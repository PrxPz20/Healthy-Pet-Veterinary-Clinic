import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

function readEnvFile(path) {
  try {
    return Object.fromEntries(
      readFileSync(path, "utf8")
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"))
        .map((line) => {
          const index = line.indexOf("=");
          return [line.slice(0, index), line.slice(index + 1)];
        }),
    );
  } catch {
    return {};
  }
}

const env = { ...readEnvFile(".env"), ...readEnvFile(".env.local"), ...process.env };
const url = env.VITE_SUPABASE_URL;
const anonKey = env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.");
  process.exit(1);
}

const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
let failed = false;

async function check(name, assertion) {
  try {
    await assertion();
    console.log(`✓ ${name}`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${name}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const tables = [
  "faq_items",
  "testimonials",
  "about_settings",
  "gallery_items",
  "gallery_media",
  "case_items",
  "case_media",
  "services",
  "products",
  "content_categories",
  "contact_settings",
  "contact_phones",
  "opening_hours",
];

await check("all CMS tables exist", async () => {
  for (const table of tables) {
    const { error } = await supabase.from(table).select("*", { head: true, count: "exact" });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
});

for (const table of [
  "gallery_items",
  "case_items",
  "services",
  "products",
  "faq_items",
  "testimonials",
]) {
  await check(`${table} exposes only published, active rows`, async () => {
    const { data, error } = await supabase
      .from(table)
      .select("status,archived_at,sort_order")
      .order("sort_order");
    if (error) throw error;
    expect(
      (data ?? []).every((row) => row.status === "published" && row.archived_at === null),
      "anonymous access exposed a draft or archived row",
    );
    expect(
      (data ?? []).every(
        (row, index, rows) => index === 0 || rows[index - 1].sort_order <= row.sort_order,
      ),
      "public sort order is inconsistent",
    );
  });
}

await check("published gallery items always have media", async () => {
  const { data, error } = await supabase.from("gallery_items").select("id,gallery_media(id)");
  if (error) throw error;
  expect(
    (data ?? []).every((item) => item.gallery_media.length > 0),
    "a published gallery item has no image",
  );
});

await check("published services and products always have images", async () => {
  for (const table of ["services", "products"]) {
    const { data, error } = await supabase.from(table).select("image_path");
    if (error) throw error;
    expect(
      (data ?? []).every((item) => Boolean(item.image_path)),
      `${table} contains a published item without an image`,
    );
  }
});

await check("public product links use approved HTTPS hosts", async () => {
  const { data, error } = await supabase.from("products").select("wolt_url,foody_url");
  if (error) throw error;
  for (const product of data ?? []) {
    for (const [field, hostname] of [
      ["wolt_url", "wolt.com"],
      ["foody_url", "foody.com.cy"],
    ]) {
      const value = product[field];
      if (!value) continue;
      const parsed = new URL(value);
      expect(parsed.protocol === "https:", `${field} is not HTTPS`);
      expect(
        parsed.hostname === hostname || parsed.hostname.endsWith(`.${hostname}`),
        `${field} has an unapproved host`,
      );
    }
  }
});

await check("contact hours contain one complete week", async () => {
  const { data, error } = await supabase
    .from("opening_hours")
    .select("day_index")
    .order("day_index");
  if (error) throw error;
  expect(
    JSON.stringify((data ?? []).map((row) => row.day_index)) ===
      JSON.stringify([0, 1, 2, 3, 4, 5, 6]),
    "opening hours must contain days 0 through 6 exactly once",
  );
});

await check("private admin tables return no anonymous rows", async () => {
  for (const table of ["admin_users", "audit_log", "content_categories"]) {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) throw error;
    expect((data ?? []).length === 0, `${table} is readable anonymously`);
  }
});

await check("anonymous users cannot call admin bulk actions", async () => {
  const { error } = await supabase.rpc("bulk_content_action", {
    target_table: "faq_items",
    target_ids: [randomUUID()],
    target_action: "archive",
  });
  expect(Boolean(error), "anonymous bulk action unexpectedly succeeded");
  expect(error.message.includes("Admin access required"), `unexpected denial: ${error.message}`);
});

await check("anonymous users cannot rename categories", async () => {
  const { error } = await supabase.rpc("rename_content_category", {
    category_id: randomUUID(),
    new_name: "Security test",
  });
  expect(Boolean(error), "anonymous category mutation unexpectedly succeeded");
  expect(error.message.includes("Admin access required"), `unexpected denial: ${error.message}`);
});

await check("anonymous users cannot change contact settings", async () => {
  const { error } = await supabase.rpc("save_contact_address", {
    next_street: "",
    next_city: "",
    next_region: "",
    next_postal_code: "",
    next_country: "",
    next_map_url: "",
  });
  expect(Boolean(error), "anonymous contact mutation unexpectedly succeeded");
  expect(error.message.includes("Admin access required"), `unexpected denial: ${error.message}`);
});

if (failed) process.exit(1);
console.log("\nSupabase CMS contract checks passed.");
