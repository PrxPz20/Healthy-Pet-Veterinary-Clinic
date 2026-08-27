import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/20260826020000_expand_contact_social_links.sql", import.meta.url),
  "utf8",
);

test("social-link writes are owner-gated and platform-restricted", () => {
  assert.match(migration, /if not public\.is_admin\(\)/);
  assert.match(migration, /revoke all on function public\.save_contact_social_links/);
  assert.match(migration, /Instagram[\s\S]*Facebook[\s\S]*TikTok[\s\S]*YouTube/);
  assert.match(migration, /X[\s\S]*Threads[\s\S]*Pinterest[\s\S]*WhatsApp/);
  assert.match(migration, /add primary key \(id\)/);
  assert.match(migration, /maximum of 12 social media links/);
  assert.match(migration, /valid HTTPS profile link/);
});
