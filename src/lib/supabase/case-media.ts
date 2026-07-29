import type { SupabaseClient } from "@supabase/supabase-js";

export const CASE_MEDIA_BUCKET = "site-cases";
export const CASE_MEDIA_SIGNED_URL_TTL_SECONDS = 300;

export async function createCaseMediaUrlMap(
  client: SupabaseClient,
  paths: readonly string[],
  resolveStaticImage: (path: string) => string = () => "",
) {
  const uniquePaths = [...new Set(paths.filter(Boolean))];
  const urls = new Map<string, string>();
  const storagePaths: string[] = [];

  for (const path of uniquePaths) {
    const staticImage = resolveStaticImage(path);
    if (staticImage) {
      urls.set(path, staticImage);
    } else if (!path.startsWith("static:")) {
      storagePaths.push(path);
    }
  }

  if (!storagePaths.length) {
    return urls;
  }

  const { data, error } = await client.storage
    .from(CASE_MEDIA_BUCKET)
    .createSignedUrls(storagePaths, CASE_MEDIA_SIGNED_URL_TTL_SECONDS);

  if (error) {
    throw error;
  }

  for (const item of data) {
    if (item.path && item.signedUrl && !item.error) {
      urls.set(item.path, item.signedUrl);
    }
  }

  return urls;
}
