import type { SupabaseClient, User } from "@supabase/supabase-js";
import { resolveStaticCmsImage } from "@/content/cms-media";
import { getStaticContactSettings } from "@/content/contact";
import { getSiteContent } from "@/content/provider";
import type { ContactSettings } from "@/content/types";
import { createCaseMediaUrlMap } from "@/lib/supabase/case-media";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { slugify, validateAdminImage } from "./validators";

export type CmsStatus = "draft" | "published";
export type CategorySection = "cases" | "services" | "products";
export type CmsBucket =
  | "site-gallery"
  | "site-cases"
  | "site-services"
  | "site-products"
  | "site-hero";
type PublicCmsBucket = Exclude<CmsBucket, "site-cases">;
export type CmsTable =
  | "gallery_items"
  | "case_items"
  | "services"
  | "products"
  | "faq_items"
  | "testimonials";
export type BulkContentAction =
  | "publish"
  | "unpublish"
  | "archive"
  | "restore"
  | "permanent_delete";

export type GalleryRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
  gallery_media?: MediaRow[];
};

export type CaseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  is_sensitive: boolean;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
  case_media?: MediaRow[];
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  short: string;
  detail: string;
  category: string;
  icon: string;
  image_path: string | null;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  image_path: string | null;
  wolt_url: string | null;
  foody_url: string | null;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
};

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  status: CmsStatus;
  sort_order: number;
  archived_at: string | null;
  updated_at: string;
};

export type AboutSettingsRow = {
  label: string;
  heading: string;
  paragraph_one: string;
  paragraph_two: string;
  years_experience: number | null;
  completed_cases: number | null;
};

export type CategoryRow = {
  id: string;
  section: CategorySection;
  name: string;
  sort_order: number;
};

export type MediaRow = {
  id: string;
  image_path: string;
  alt: string;
  sort_order: number;
  is_cover: boolean;
  signed_url?: string;
};

export type AdminOpeningHour = {
  dayIndex: number;
  dayName: string;
  isClosed: boolean;
  opens1: string;
  closes1: string;
  opens2: string;
  closes2: string;
};

export type AdminContactSettings = Omit<ContactSettings, "openingHours"> & {
  openingHours: AdminOpeningHour[];
};

export type DashboardCounts = {
  gallery: number;
  cases: number;
  services: number;
  products: number;
  faqs: number;
  reviews: number;
};

export type AdminSessionState =
  | { status: "unconfigured"; user: null; isAdmin: false }
  | { status: "signed-out"; user: null; isAdmin: false }
  | { status: "signed-in"; user: User; isAdmin: true }
  | { status: "forbidden"; user: User; isAdmin: false };

function requireClient() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    throw new Error(
      "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  return client;
}

async function logAudit(
  client: SupabaseClient,
  action: string,
  tableName: string,
  recordId?: string,
) {
  await client.from("audit_log").insert({
    action,
    table_name: tableName,
    record_id: recordId ?? null,
  });
}

async function requireDraft(
  client: SupabaseClient,
  table: CmsTable,
  id: string,
  extraColumn?: "image_path",
) {
  const { data, error } = await client
    .from(table)
    .select(extraColumn ? `status,${extraColumn}` : "status")
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  const row = data as unknown as { status: CmsStatus; image_path?: string | null };

  if (row.status === "published") {
    throw new Error("Unpublish this item before editing it.");
  }

  return row;
}

function briefDescription(value: string) {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= 180) {
    return text;
  }

  return `${text.slice(0, 177).replace(/\s+\S*$/, "")}...`;
}

async function nextSortOrder(client: SupabaseClient, table: CmsTable) {
  const { data, error } = await client
    .from(table)
    .select("sort_order")
    .is("archived_at", null)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.sort_order ?? -1) + 1;
}

export async function getAdminSessionState(): Promise<AdminSessionState> {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return { status: "unconfigured", user: null, isAdmin: false };
  }

  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    return { status: "signed-out", user: null, isAdmin: false };
  }

  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) {
    return { status: "forbidden", user, isAdmin: false };
  }

  return { status: "signed-in", user, isAdmin: true };
}

export async function signInAdmin(email: string, password: string) {
  const client = requireClient();
  return client.auth.signInWithPassword({ email, password });
}

export async function signOutAdmin() {
  const client = requireClient();
  return client.auth.signOut();
}

export function publicStorageUrl(bucket: PublicCmsBucket, path: string | null | undefined) {
  if (!path) {
    return "";
  }

  const staticImage = resolveStaticCmsImage(path);
  if (staticImage) {
    return staticImage;
  }

  const client = getSupabaseBrowserClient();
  if (!client) {
    return path;
  }

  return client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function uploadAdminImage(bucket: CmsBucket, folder: string, file: File) {
  const validationError = validateAdminImage(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const client = requireClient();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "webp";
  const safeFolder = slugify(folder) || "asset";
  const path = `${safeFolder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });

  if (error) {
    throw error;
  }

  return path;
}

async function uploadMediaFiles(
  client: SupabaseClient,
  bucket: "site-gallery" | "site-cases",
  mediaTable: "gallery_media" | "case_media",
  parentKey: "gallery_item_id" | "case_item_id",
  parentId: string,
  title: string,
  files: File[],
  startIndex = 0,
) {
  const paths: string[] = [];
  try {
    for (const file of files) {
      paths.push(await uploadAdminImage(bucket, title, file));
    }

    if (!paths.length) return;

    const { error } = await client.from(mediaTable).insert(
      paths.map((path, index) => {
        const sortOrder = startIndex + index;
        return {
          [parentKey]: parentId,
          image_path: path,
          alt: `${title} image ${sortOrder + 1}`,
          sort_order: sortOrder,
          is_cover: sortOrder === 0,
        };
      }),
    );
    if (error) throw error;
  } catch (error) {
    if (paths.length) await client.storage.from(bucket).remove(paths);
    throw error;
  }
}

export async function listGallery() {
  const client = requireClient();
  const { data, error } = await client
    .from("gallery_items")
    .select("*, gallery_media(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as GalleryRow[];
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  const client = requireClient();
  const { data, error } = await client.rpc("get_admin_dashboard_counts");

  if (!error && data && !Array.isArray(data)) {
    const counts = data as Record<keyof DashboardCounts, number>;
    return {
      gallery: Number(counts.gallery ?? 0),
      cases: Number(counts.cases ?? 0),
      services: Number(counts.services ?? 0),
      products: Number(counts.products ?? 0),
      faqs: Number(counts.faqs ?? 0),
      reviews: Number(counts.reviews ?? 0),
    };
  }

  if (error && error.code !== "PGRST202" && error.code !== "42883") {
    throw error;
  }

  const tables = [
    ["gallery", "gallery_items"],
    ["cases", "case_items"],
    ["services", "services"],
    ["products", "products"],
    ["faqs", "faq_items"],
    ["reviews", "testimonials"],
  ] as const;
  const results = await Promise.all(
    tables.map(([, table]) =>
      client.from(table).select("id", { count: "exact", head: true }).is("archived_at", null),
    ),
  );

  const failed = results.find((result) => result.error);
  if (failed?.error) {
    throw failed.error;
  }

  return Object.fromEntries(
    results.map((result, index) => [tables[index][0], result.count ?? 0]),
  ) as DashboardCounts;
}

export async function listCases() {
  const client = requireClient();
  const { data, error } = await client
    .from("case_items")
    .select("*, case_media(*)")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as CaseRow[];

  try {
    const mediaUrls = await createCaseMediaUrlMap(
      client,
      rows.flatMap((row) => (row.case_media ?? []).map((media) => media.image_path)),
      resolveStaticCmsImage,
    );
    return rows.map((row) => ({
      ...row,
      case_media: row.case_media?.map((media) => ({
        ...media,
        signed_url: mediaUrls.get(media.image_path),
      })),
    }));
  } catch (signingError) {
    console.warn(
      "Unable to sign admin case previews",
      signingError instanceof Error ? signingError.message : "Unknown signing error",
    );
    return rows;
  }
}

export async function listServices() {
  const client = requireClient();
  const { data, error } = await client
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ServiceRow[];
}

export async function listProducts() {
  const client = requireClient();
  const { data, error } = await client
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as ProductRow[];
}

export async function listFaqs() {
  const client = requireClient();
  const { data, error } = await client
    .from("faq_items")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as FaqRow[];
}

export async function listTestimonials() {
  const client = requireClient();
  const { data, error } = await client
    .from("testimonials")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as TestimonialRow[];
}

export async function getAboutSettings(): Promise<AboutSettingsRow> {
  const client = requireClient();
  const fallback = getSiteContent().about;
  const { data, error } = await client
    .from("about_settings")
    .select("*")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  return (
    data ?? {
      label: fallback.label,
      heading: fallback.heading,
      paragraph_one: fallback.paragraphs[0] ?? "",
      paragraph_two: fallback.paragraphs[1] ?? "",
      years_experience: fallback.metrics[0]?.value ?? null,
      completed_cases: fallback.metrics[1]?.value ?? null,
    }
  );
}

export async function saveAboutSettings(values: AboutSettingsRow) {
  const client = requireClient();
  const { error } = await client.from("about_settings").upsert({ id: true, ...values });
  if (error) throw error;
  await logAudit(client, "save", "about_settings");
}

export async function createFaq(values: Pick<FaqRow, "question" | "answer" | "status">) {
  const client = requireClient();
  const sort_order = await nextSortOrder(client, "faq_items");
  const { data, error } = await client
    .from("faq_items")
    .insert({ ...values, sort_order })
    .select("id")
    .single();
  if (error) throw error;
  await logAudit(client, "create", "faq_items", data.id);
}

export async function updateFaq(
  id: string,
  values: Pick<FaqRow, "question" | "answer" | "status">,
) {
  const client = requireClient();
  await requireDraft(client, "faq_items", id);
  const { error } = await client.from("faq_items").update(values).eq("id", id);
  if (error) throw error;
  await logAudit(client, "update", "faq_items", id);
}

export async function createTestimonial(
  values: Pick<TestimonialRow, "name" | "rating" | "review_text" | "status">,
) {
  const client = requireClient();
  const sort_order = await nextSortOrder(client, "testimonials");
  const { data, error } = await client
    .from("testimonials")
    .insert({ ...values, sort_order })
    .select("id")
    .single();
  if (error) throw error;
  await logAudit(client, "create", "testimonials", data.id);
}

export async function updateTestimonial(
  id: string,
  values: Pick<TestimonialRow, "name" | "rating" | "review_text" | "status">,
) {
  const client = requireClient();
  await requireDraft(client, "testimonials", id);
  const { error } = await client.from("testimonials").update(values).eq("id", id);
  if (error) throw error;
  await logAudit(client, "update", "testimonials", id);
}

export async function listCategories(section?: CategorySection) {
  const client = requireClient();
  let query = client.from("content_categories").select("id,section,name,sort_order");

  if (section) {
    query = query.eq("section", section);
  }

  const { data, error } = await query
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    if (error.code === "PGRST205" || error.code === "42P01") {
      return null;
    }
    throw error;
  }

  return (data ?? []) as CategoryRow[];
}

export async function getContactSettings(): Promise<AdminContactSettings> {
  const client = requireClient();
  const fallback = getStaticContactSettings();
  const [settingsResult, phonesResult, hoursResult] = await Promise.all([
    client
      .from("contact_settings")
      .select("street,city,region,postal_code,country,map_url,email,whatsapp")
      .eq("id", true)
      .maybeSingle(),
    client.from("contact_phones").select("id,label,phone,sort_order").order("sort_order"),
    client
      .from("opening_hours")
      .select("day_index,day_name,is_closed,opens_1,closes_1,opens_2,closes_2")
      .order("day_index"),
  ]);

  if (settingsResult.error || !settingsResult.data) {
    return {
      ...fallback,
      openingHours: fallback.openingHours.map((day, dayIndex) => ({
        dayIndex,
        dayName: day.day,
        isClosed: day.ranges.length === 0,
        opens1: day.ranges[0]?.opens ?? "",
        closes1: day.ranges[0]?.closes ?? "",
        opens2: day.ranges[1]?.opens ?? "",
        closes2: day.ranges[1]?.closes ?? "",
      })),
    };
  }

  const settings = settingsResult.data;
  return {
    address: {
      street: settings.street,
      city: settings.city,
      region: settings.region,
      postalCode: settings.postal_code,
      country: settings.country,
      mapUrl: settings.map_url,
    },
    phones: phonesResult.error
      ? fallback.phones
      : (phonesResult.data ?? []).map((phone) => ({
          id: phone.id,
          label: phone.label,
          number: phone.phone,
        })),
    whatsapp: settings.whatsapp,
    email: settings.email,
    openingHours: hoursResult.error
      ? []
      : (hoursResult.data ?? []).map((day) => ({
          dayIndex: day.day_index,
          dayName: day.day_name,
          isClosed: day.is_closed,
          opens1: day.opens_1?.slice(0, 5) ?? "",
          closes1: day.closes_1?.slice(0, 5) ?? "",
          opens2: day.opens_2?.slice(0, 5) ?? "",
          closes2: day.closes_2?.slice(0, 5) ?? "",
        })),
  };
}

export async function saveContactAddress(address: AdminContactSettings["address"]) {
  const client = requireClient();
  const { error } = await client.rpc("save_contact_address", {
    next_street: address.street,
    next_city: address.city,
    next_region: address.region,
    next_postal_code: address.postalCode,
    next_country: address.country,
    next_map_url: address.mapUrl,
  });
  if (error) throw error;
}

export async function saveContactMethods(
  values: Pick<AdminContactSettings, "phones" | "whatsapp" | "email">,
) {
  const client = requireClient();
  const { error } = await client.rpc("save_contact_methods", {
    next_phones: values.phones,
    next_whatsapp: values.whatsapp,
    next_email: values.email,
  });
  if (error) throw error;
}

export async function saveOpeningHours(hours: AdminOpeningHour[]) {
  const client = requireClient();
  const { error } = await client.rpc("save_opening_hours", { next_hours: hours });
  if (error) throw error;
}

let staticContentSeeded = false;

export async function seedStaticContent() {
  if (staticContentSeeded) {
    return;
  }

  const client = requireClient();
  const content = getSiteContent();
  const { data: seedLog, error: seedLogError } = await client
    .from("audit_log")
    .select("id")
    .eq("action", "seed_v1")
    .eq("table_name", "static_content")
    .limit(1)
    .maybeSingle();

  if (seedLogError) {
    throw seedLogError;
  }
  if (seedLog) {
    staticContentSeeded = true;
    return;
  }

  const { data: categoryRows, error: categoryError } = await client
    .from("content_categories")
    .select("section,name");

  if (categoryError?.code === "PGRST205" || categoryError?.code === "42P01") {
    return;
  }
  if (categoryError) {
    throw categoryError;
  }

  const categorySeeds = [
    ...content.services.map((item) => ({ section: "services", name: item.category })),
    ...content.products.map((item) => ({ section: "products", name: item.category })),
    ...content.cases
      .filter((item) => item.category)
      .map((item) => ({ section: "cases", name: item.category! })),
  ];
  const categoryKeys = new Set(
    (categoryRows ?? []).map((item) => `${item.section}:${item.name.toLowerCase()}`),
  );
  const missingCategories = categorySeeds.filter((item) => {
    const key = `${item.section}:${item.name.toLowerCase()}`;
    if (categoryKeys.has(key)) {
      return false;
    }
    categoryKeys.add(key);
    return true;
  });

  if (missingCategories.length) {
    const { error } = await client.from("content_categories").insert(missingCategories);
    if (error) throw error;
  }

  const { data: galleryRows, error: galleryError } = await client
    .from("gallery_items")
    .select("id,slug,gallery_media(id)");
  if (galleryError) throw galleryError;
  const gallerySlugs = new Set((galleryRows ?? []).map((item) => item.slug));
  const missingGallery = content.gallery.filter((item) => !gallerySlugs.has(item.slug));
  let insertedGallery: { id: string; slug: string; gallery_media: { id: string }[] }[] = [];
  if (missingGallery.length) {
    const { data, error } = await client
      .from("gallery_items")
      .insert(
        missingGallery.map((item, index) => ({
          slug: item.slug,
          title: item.title,
          description: item.description || null,
          status: "published",
          sort_order: index,
        })),
      )
      .select("id,slug");
    if (error) throw error;
    insertedGallery = (data ?? []).map((item) => ({ ...item, gallery_media: [] }));
  }
  const allGalleryRows = [...(galleryRows ?? []), ...insertedGallery];
  const galleryMedia = allGalleryRows.flatMap((row) => {
    const item = content.gallery.find((current) => current.slug === row.slug);
    return item && !row.gallery_media?.length
      ? [
          {
            gallery_item_id: row.id,
            image_path: `static:gallery:${item.slug}`,
            alt: item.image.alt,
            sort_order: 0,
            is_cover: true,
          },
        ]
      : [];
  });
  if (galleryMedia.length) {
    const { error } = await client.from("gallery_media").insert(galleryMedia);
    if (error) throw error;
  }

  const { data: caseRows, error: caseError } = await client
    .from("case_items")
    .select("id,slug,case_media(id)");
  if (caseError) throw caseError;
  const caseSlugs = new Set((caseRows ?? []).map((item) => item.slug));
  const missingCases = content.cases.filter((item) => !caseSlugs.has(item.id));
  let insertedCases: { id: string; slug: string; case_media: { id: string }[] }[] = [];
  if (missingCases.length) {
    const { data, error } = await client
      .from("case_items")
      .insert(
        missingCases.map((item, index) => ({
          slug: item.id,
          title: item.title,
          description: item.description || null,
          category: item.category || null,
          is_sensitive: item.isSensitive,
          status: "published",
          sort_order: index,
        })),
      )
      .select("id,slug");
    if (error) throw error;
    insertedCases = (data ?? []).map((item) => ({ ...item, case_media: [] }));
  }
  const allCaseRows = [...(caseRows ?? []), ...insertedCases];
  const caseMedia = allCaseRows.flatMap((row) => {
    const item = content.cases.find((current) => current.id === row.slug);
    return item && !row.case_media?.length
      ? [
          {
            case_item_id: row.id,
            image_path: `static:case:${item.id}`,
            alt: item.image.alt,
            sort_order: 0,
            is_cover: true,
          },
        ]
      : [];
  });
  if (caseMedia.length) {
    const { error } = await client.from("case_media").insert(caseMedia);
    if (error) throw error;
  }

  const { data: serviceRows, error: serviceError } = await client.from("services").select("slug");
  if (serviceError) throw serviceError;
  const serviceSlugs = new Set((serviceRows ?? []).map((item) => item.slug));
  const missingServices = content.services.filter((item) => !serviceSlugs.has(item.slug));
  if (missingServices.length) {
    const { error } = await client.from("services").insert(
      missingServices.map((item, index) => ({
        slug: item.slug,
        title: item.title,
        short: item.short,
        detail: item.detail,
        category: item.category,
        icon: item.icon,
        image_path: `static:service:${item.slug}`,
        status: "published",
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  const { data: productRows, error: productError } = await client.from("products").select("name");
  if (productError) throw productError;
  const productNames = new Set((productRows ?? []).map((item) => item.name.toLowerCase()));
  const missingProducts = content.products.filter(
    (item) => !productNames.has(item.name.toLowerCase()),
  );
  if (missingProducts.length) {
    const { error } = await client.from("products").insert(
      missingProducts.map((item, index) => ({
        name: item.name,
        category: item.category,
        description: item.description || "",
        image_path: `static:product:${item.name}`,
        wolt_url: item.links.wolt || null,
        foody_url: item.links.foody || null,
        status: "published",
        sort_order: index,
      })),
    );
    if (error) throw error;
  }

  await logAudit(client, "seed_v1", "static_content");
  staticContentSeeded = true;
}

export async function createCategory(section: CategorySection, name: string) {
  const client = requireClient();
  const { data, error } = await client
    .from("content_categories")
    .insert({ section, name: name.trim() })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await logAudit(client, "create", "content_categories", data.id);
}

export async function renameCategory(id: string, name: string) {
  const client = requireClient();
  const { error } = await client.rpc("rename_content_category", {
    category_id: id,
    new_name: name.trim(),
  });

  if (error) {
    throw error;
  }

  await logAudit(client, "update", "content_categories", id);
}

export async function deleteCategory(id: string) {
  const client = requireClient();
  const { error } = await client.rpc("delete_content_category", { category_id: id });

  if (error) {
    throw error;
  }

  await logAudit(client, "delete", "content_categories", id);
}

export async function createGalleryItem(values: {
  title: string;
  description?: string;
  status: CmsStatus;
  files: File[];
}) {
  if (!values.files.length) {
    throw new Error("Add at least one image before saving a gallery item.");
  }

  const client = requireClient();
  const slug = slugify(values.title);
  const sortOrder = await nextSortOrder(client, "gallery_items");
  const { data, error } = await client
    .from("gallery_items")
    .insert({
      title: values.title,
      description: values.description || null,
      status: "draft",
      slug: `${slug}-${Date.now()}`,
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await uploadMediaFiles(
    client,
    "site-gallery",
    "gallery_media",
    "gallery_item_id",
    data.id,
    values.title,
    values.files,
  );

  if (values.status === "published") {
    const { error: publishError } = await client
      .from("gallery_items")
      .update({ status: "published" })
      .eq("id", data.id);
    if (publishError) throw publishError;
  }

  await logAudit(client, "create", "gallery_items", data.id);
}

export async function updateGalleryItem(
  id: string,
  values: {
    title: string;
    description?: string;
    status: CmsStatus;
    files: File[];
  },
) {
  const client = requireClient();
  await requireDraft(client, "gallery_items", id);
  const { error } = await client
    .from("gallery_items")
    .update({
      title: values.title,
      description: values.description || null,
      status: "draft",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  const { count, error: countError } = await client
    .from("gallery_media")
    .select("id", { count: "exact", head: true })
    .eq("gallery_item_id", id);

  if (countError) {
    throw countError;
  }

  await uploadMediaFiles(
    client,
    "site-gallery",
    "gallery_media",
    "gallery_item_id",
    id,
    values.title,
    values.files,
    count ?? 0,
  );

  if (values.status === "published") {
    const { error: publishError } = await client
      .from("gallery_items")
      .update({ status: "published" })
      .eq("id", id);
    if (publishError) throw publishError;
  }

  await logAudit(client, "update", "gallery_items", id);
}

export async function createCaseItem(values: {
  title: string;
  description?: string;
  category?: string;
  is_sensitive: boolean;
  status: CmsStatus;
  files: File[];
}) {
  const client = requireClient();
  const slug = slugify(values.title);
  const sortOrder = await nextSortOrder(client, "case_items");
  const statusDuringUpload = values.files.length ? "draft" : values.status;
  const { data, error } = await client
    .from("case_items")
    .insert({
      title: values.title,
      description: values.description || null,
      category: values.category || null,
      is_sensitive: values.is_sensitive,
      status: statusDuringUpload,
      slug: `${slug}-${Date.now()}`,
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await uploadMediaFiles(
    client,
    "site-cases",
    "case_media",
    "case_item_id",
    data.id,
    values.title,
    values.files,
  );

  if (values.files.length && values.status === "published") {
    const { error: publishError } = await client
      .from("case_items")
      .update({ status: "published" })
      .eq("id", data.id);
    if (publishError) throw publishError;
  }

  await logAudit(client, "create", "case_items", data.id);
}

export async function updateCaseItem(
  id: string,
  values: {
    title: string;
    description?: string;
    category?: string;
    is_sensitive: boolean;
    status: CmsStatus;
    files: File[];
  },
) {
  const client = requireClient();
  await requireDraft(client, "case_items", id);
  const { error } = await client
    .from("case_items")
    .update({
      title: values.title,
      description: values.description || null,
      category: values.category || null,
      is_sensitive: values.is_sensitive,
      status: "draft",
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  const { count, error: countError } = await client
    .from("case_media")
    .select("id", { count: "exact", head: true })
    .eq("case_item_id", id);

  if (countError) {
    throw countError;
  }

  await uploadMediaFiles(
    client,
    "site-cases",
    "case_media",
    "case_item_id",
    id,
    values.title,
    values.files,
    count ?? 0,
  );

  if (values.status === "published") {
    const { error: publishError } = await client
      .from("case_items")
      .update({ status: "published" })
      .eq("id", id);
    if (publishError) throw publishError;
  }

  await logAudit(client, "update", "case_items", id);
}

export async function createService(values: {
  title: string;
  detail: string;
  category: string;
  status: CmsStatus;
  file?: File | null;
}) {
  if (!values.file) {
    throw new Error("Add a service image before saving.");
  }

  const client = requireClient();
  const imagePath = await uploadAdminImage("site-services", values.title, values.file);
  const sortOrder = await nextSortOrder(client, "services");
  const { data, error } = await client
    .from("services")
    .insert({
      title: values.title,
      short: briefDescription(values.detail),
      detail: values.detail,
      category: values.category,
      slug: `${slugify(values.title)}-${Date.now()}`,
      status: values.status,
      image_path: imagePath,
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await logAudit(client, "create", "services", data.id);
}

export async function updateService(
  id: string,
  values: {
    title: string;
    detail: string;
    category: string;
    status: CmsStatus;
    file?: File | null;
  },
) {
  const client = requireClient();
  const current = await requireDraft(client, "services", id, "image_path");
  if (!values.file && !current.image_path) {
    throw new Error("Add a service image before saving.");
  }
  const imagePath = values.file
    ? await uploadAdminImage("site-services", values.title, values.file)
    : undefined;
  const { error } = await client
    .from("services")
    .update({
      title: values.title,
      short: briefDescription(values.detail),
      detail: values.detail,
      category: values.category,
      status: values.status,
      ...(imagePath ? { image_path: imagePath } : {}),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  await logAudit(client, "update", "services", id);
}

export async function createProduct(values: {
  name: string;
  category: string;
  description?: string;
  wolt_url?: string;
  foody_url?: string;
  status: CmsStatus;
  file?: File | null;
}) {
  if (!values.file) {
    throw new Error("Add a product image before saving.");
  }

  const client = requireClient();
  const imagePath = await uploadAdminImage("site-products", values.name, values.file);
  const sortOrder = await nextSortOrder(client, "products");
  const { data, error } = await client
    .from("products")
    .insert({
      name: values.name,
      category: values.category,
      description: values.description || "",
      wolt_url: values.wolt_url || null,
      foody_url: values.foody_url || null,
      status: values.status,
      image_path: imagePath,
      sort_order: sortOrder,
    })
    .select("id")
    .single();

  if (error) {
    throw error;
  }

  await logAudit(client, "create", "products", data.id);
}

export async function updateProduct(
  id: string,
  values: {
    name: string;
    category: string;
    description?: string;
    wolt_url?: string;
    foody_url?: string;
    status: CmsStatus;
    file?: File | null;
  },
) {
  const client = requireClient();
  const current = await requireDraft(client, "products", id, "image_path");
  if (!values.file && !current.image_path) {
    throw new Error("Add a product image before saving.");
  }
  const imagePath = values.file
    ? await uploadAdminImage("site-products", values.name, values.file)
    : undefined;
  const { error } = await client
    .from("products")
    .update({
      name: values.name,
      category: values.category,
      description: values.description || "",
      wolt_url: values.wolt_url || null,
      foody_url: values.foody_url || null,
      status: values.status,
      ...(imagePath ? { image_path: imagePath } : {}),
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  await logAudit(client, "update", "products", id);
}

export async function updateStatus(table: CmsTable, id: string, status: CmsStatus) {
  const client = requireClient();

  if (table === "gallery_items" && status === "published") {
    const { count, error: countError } = await client
      .from("gallery_media")
      .select("id", { count: "exact", head: true })
      .eq("gallery_item_id", id);

    if (countError) {
      throw countError;
    }

    if (!count) {
      throw new Error("Add at least one image before publishing a gallery item.");
    }
  }

  if ((table === "services" || table === "products") && status === "published") {
    const { data, error: imageError } = await client
      .from(table)
      .select("image_path")
      .eq("id", id)
      .single();

    if (imageError) {
      throw imageError;
    }

    if (!data.image_path) {
      throw new Error(`Add a ${table === "services" ? "service" : "product"} image first.`);
    }
  }

  const { error } = await client.from(table).update({ status }).eq("id", id);

  if (error) {
    throw error;
  }

  await logAudit(client, status === "published" ? "publish" : "save_draft", table, id);
}

export async function reorderRecords(table: CmsTable, orderedIds: string[]) {
  const client = requireClient();
  if (new Set(orderedIds).size !== orderedIds.length) {
    throw new Error("The new order contains duplicate items. Refresh and try again.");
  }

  const results = await Promise.all(
    orderedIds.map((id, sortOrder) =>
      client.from(table).update({ sort_order: sortOrder }).eq("id", id),
    ),
  );
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw failed.error;
  }

  const { data, error } = await client.from(table).select("id,sort_order").in("id", orderedIds);

  if (error) {
    throw error;
  }

  const savedOrder = new Map((data ?? []).map((item) => [item.id, item.sort_order]));
  const orderWasSaved = orderedIds.every((id, index) => savedOrder.get(id) === index);
  if (!orderWasSaved) {
    throw new Error("The website order was not saved completely. Refresh and try again.");
  }

  await logAudit(client, "reorder", table);
}

export async function archiveRecord(table: CmsTable, id: string) {
  const client = requireClient();
  const { error } = await client
    .from(table)
    .update({ status: "draft", archived_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw error;
  }

  await logAudit(client, "archive", table, id);
}

export async function restoreRecord(table: CmsTable, id: string) {
  const client = requireClient();
  const sortOrder = await nextSortOrder(client, table);
  const { error } = await client
    .from(table)
    .update({ archived_at: null, sort_order: sortOrder })
    .eq("id", id);

  if (error) {
    throw error;
  }

  await logAudit(client, "restore", table, id);
}

async function recordAssetPaths(client: SupabaseClient, table: CmsTable, ids: string[]) {
  if (table === "gallery_items") {
    const { data } = await client
      .from("gallery_media")
      .select("image_path")
      .in("gallery_item_id", ids);
    return {
      bucket: "site-gallery" as CmsBucket,
      paths: (data ?? []).map((item) => item.image_path),
    };
  }
  if (table === "case_items") {
    const { data } = await client.from("case_media").select("image_path").in("case_item_id", ids);
    return {
      bucket: "site-cases" as CmsBucket,
      paths: (data ?? []).map((item) => item.image_path),
    };
  }

  if (table === "faq_items" || table === "testimonials") {
    return null;
  }

  const { data } = await client.from(table).select("image_path").in("id", ids);
  return {
    bucket: (table === "services" ? "site-services" : "site-products") as CmsBucket,
    paths: (data ?? []).map((item) => item.image_path).filter(Boolean) as string[],
  };
}

export async function bulkContentAction(table: CmsTable, ids: string[], action: BulkContentAction) {
  if (!ids.length) {
    throw new Error("Select at least one item.");
  }

  const client = requireClient();
  const assets = action === "permanent_delete" ? await recordAssetPaths(client, table, ids) : null;
  const { error } = await client.rpc("bulk_content_action", {
    target_table: table,
    target_ids: ids,
    target_action: action,
  });

  if (error) {
    throw error;
  }

  if (assets?.paths.length) {
    const { error: storageError } = await client.storage.from(assets.bucket).remove(assets.paths);
    if (storageError) {
      console.warn("Content deleted, but some stored files need cleanup.", storageError.message);
    }
  }
}

export async function purgeExpiredArchives() {
  const client = requireClient();
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const tables: CmsTable[] = [
    "gallery_items",
    "case_items",
    "services",
    "products",
    "faq_items",
    "testimonials",
  ];

  const expiredRecords = await Promise.all(
    tables.map(async (table) => {
      const { data, error } = await client
        .from(table)
        .select("id")
        .not("archived_at", "is", null)
        .lte("archived_at", cutoff);
      if (error) throw error;
      return { table, ids: (data ?? []).map((item) => item.id) };
    }),
  );

  await Promise.all(
    expiredRecords
      .filter(({ ids }) => ids.length)
      .map(({ table, ids }) => bulkContentAction(table, ids, "permanent_delete")),
  );
}
