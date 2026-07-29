import type { SupabaseClient } from "@supabase/supabase-js";

export const CASE_MEDIA_BUCKET = "site-cases";
export const CASE_MEDIA_SIGNED_URL_TTL_SECONDS = 300;

export async function createCaseMediaUrlMap(client: SupabaseClient, paths: readonly string[]) {
  const uniquePaths = [...new Set(paths.filter((path) => path && !path.startsWith("static:")))];
  const urls = new Map<string, string>();

  if (!uniquePaths.length) {
    return urls;
  }

  const { data, error } = await client.storage
    .from(CASE_MEDIA_BUCKET)
    .createSignedUrls(uniquePaths, CASE_MEDIA_SIGNED_URL_TTL_SECONDS);

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
