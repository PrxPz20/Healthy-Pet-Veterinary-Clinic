import type { CaseItem, GalleryItem, MediaAsset, Product, Service } from "@/content/types";
import { resolveStaticCmsImage } from "@/content/cms-media";
import { createCaseMediaUrlMap } from "./case-media";
import { getSupabaseBrowserClient } from "./client";
import { isSupabaseConfigured } from "./config";
import { reportClientError } from "@/lib/safe-errors";

type GalleryMediaRow = {
  image_path: string;
  alt: string;
  sort_order: number;
  is_cover: boolean;
};

type GalleryRow = {
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  gallery_media?: GalleryMediaRow[];
};

type CaseMediaRow = GalleryMediaRow;

type CaseRow = {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  is_sensitive: boolean;
  sort_order: number;
  case_media?: CaseMediaRow[];
};

type ServiceRow = {
  slug: string;
  title: string;
  short: string;
  detail: string;
  category: string;
  icon: string;
  image_path: string | null;
  sort_order: number;
};

type ProductRow = {
  name: string;
  category: string;
  description: string;
  image_path: string | null;
  wolt_url: string | null;
  foody_url: string | null;
  sort_order: number;
};

type PublicMediaBucket = "site-gallery" | "site-services" | "site-products" | "site-hero";

function publicImage(bucket: PublicMediaBucket, path: string) {
  const staticImage = resolveStaticCmsImage(path);
  if (staticImage) {
    return staticImage;
  }

  const client = getSupabaseBrowserClient();
  return client?.storage.from(bucket).getPublicUrl(path).data.publicUrl ?? path;
}

function mapGalleryItem(row: GalleryRow): GalleryItem | null {
  const media = [...(row.gallery_media ?? [])]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
    .map<MediaAsset>((item) => ({
      src: publicImage("site-gallery", item.image_path),
      alt: item.alt,
      type: "image",
    }));

  if (!media.length) {
    return null;
  }

  return {
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    image: media[0],
    media,
  };
}

function mapCaseItem(row: CaseRow, mediaUrls: ReadonlyMap<string, string>): CaseItem {
  const media = [...(row.case_media ?? [])]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
    .flatMap<MediaAsset>((item) => {
      const src = mediaUrls.get(item.image_path);
      return src ? [{ src, alt: item.alt, type: "image" }] : [];
    });

  return {
    id: row.slug,
    title: row.title,
    description: row.description ?? "",
    category: row.category ?? undefined,
    image: media[0] ?? { src: "", alt: row.title },
    media,
    isSensitive: row.is_sensitive,
    homepagePreview: true,
  };
}

function mapService(row: ServiceRow): Service {
  return {
    slug: row.slug,
    title: row.title,
    seoTitle: row.title,
    short: row.short,
    detail: row.detail,
    category: row.category,
    icon: row.icon || "Stethoscope",
    highlights: [],
    image: row.image_path
      ? {
          src: publicImage("site-services", row.image_path),
          alt: `${row.title} at Healthy Pet Veterinary Clinic`,
        }
      : undefined,
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    name: row.name,
    category: row.category,
    description: row.description,
    image: row.image_path
      ? {
          src: publicImage("site-products", row.image_path),
          alt: row.name,
        }
      : { src: "", alt: row.name },
    links: {
      wolt: row.wolt_url ?? undefined,
      foody: row.foody_url ?? undefined,
    },
  };
}

export async function loadPublishedGallery() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("gallery_items")
    .select("slug,title,description,sort_order,gallery_media(image_path,alt,sort_order,is_cover)")
    .eq("status", "published")
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    reportClientError("Unable to load gallery content", error);
    return null;
  }

  return ((data ?? []) as GalleryRow[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapGalleryItem)
    .filter(Boolean) as GalleryItem[];
}

export async function loadPublishedCases() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("case_items")
    .select(
      "slug,title,description,category,is_sensitive,sort_order,case_media(image_path,alt,sort_order,is_cover)",
    )
    .eq("status", "published")
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    reportClientError("Unable to load case content", error);
    return null;
  }

  const rows = ((data ?? []) as CaseRow[]).sort((a, b) => a.sort_order - b.sort_order);

  try {
    const mediaUrls = await createCaseMediaUrlMap(
      client,
      rows.flatMap((row) => (row.case_media ?? []).map((item) => item.image_path)),
    );
    return rows.map((row) => mapCaseItem(row, mediaUrls));
  } catch (signingError) {
    reportClientError("Unable to load case media", signingError);
    return null;
  }
}

export async function loadPublishedServices() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("services")
    .select("slug,title,short,detail,category,icon,image_path,sort_order")
    .eq("status", "published")
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    reportClientError("Unable to load service content", error);
    return null;
  }

  return ((data ?? []) as ServiceRow[]).sort((a, b) => a.sort_order - b.sort_order).map(mapService);
}

export async function loadPublishedProducts() {
  const client = getSupabaseBrowserClient();

  if (!client) {
    return null;
  }

  const { data, error } = await client
    .from("products")
    .select("name,category,description,image_path,wolt_url,foody_url,sort_order")
    .eq("status", "published")
    .is("archived_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    reportClientError("Unable to load product content", error);
    return null;
  }

  return ((data ?? []) as ProductRow[]).sort((a, b) => a.sort_order - b.sort_order).map(mapProduct);
}

export function mergeGalleryItems(staticItems: GalleryItem[], cmsItems: GalleryItem[] | null) {
  return cmsItems ?? staticItems;
}

export function mergeCaseItems(staticItems: CaseItem[], cmsItems: CaseItem[] | null) {
  return cmsItems ?? staticItems;
}

export function mergeServiceItems(staticItems: Service[], cmsItems: Service[] | null) {
  return cmsItems ?? staticItems;
}

export function mergeProductItems(staticItems: Product[], cmsItems: Product[] | null) {
  return cmsItems ?? staticItems;
}

export function initialPublicItems<T>(staticItems: T[]) {
  return isSupabaseConfigured() ? [] : staticItems;
}
