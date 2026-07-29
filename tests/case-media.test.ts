import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CASE_MEDIA_BUCKET,
  CASE_MEDIA_SIGNED_URL_TTL_SECONDS,
  createCaseMediaUrlMap,
} from "../src/lib/supabase/case-media.ts";

const migration = readFileSync(
  new URL("../supabase/migrations/20260729000000_private_case_media.sql", import.meta.url),
  "utf8",
);

function caseMediaClient(result: {
  data: Array<{ error: string | null; path: string | null; signedUrl: string | null }> | null;
  error: Error | null;
}) {
  const calls: Array<{ bucket: string; paths: string[]; expiresIn: number }> = [];
  const client = {
    storage: {
      from(bucket: string) {
        return {
          async createSignedUrls(paths: string[], expiresIn: number) {
            calls.push({ bucket, paths, expiresIn });
            return result;
          },
        };
      },
    },
  } as unknown as SupabaseClient;

  return { client, calls };
}

test("case media uses short-lived signed URLs from site-cases", async () => {
  const path = "dental/case.webp";
  const signedUrl =
    "https://example.supabase.co/storage/v1/object/sign/site-cases/dental/case.webp?token=test";
  const { client, calls } = caseMediaClient({
    data: [{ error: null, path, signedUrl }],
    error: null,
  });

  const urls = await createCaseMediaUrlMap(client, [path, path]);

  assert.equal(urls.get(path), signedUrl);
  assert.deepEqual(calls, [
    {
      bucket: CASE_MEDIA_BUCKET,
      paths: [path],
      expiresIn: CASE_MEDIA_SIGNED_URL_TTL_SECONDS,
    },
  ]);
  assert.equal(CASE_MEDIA_SIGNED_URL_TTL_SECONDS, 300);
});

test("case media never falls back to a raw or public storage URL", async () => {
  const path = "private/draft.webp";
  const { client } = caseMediaClient({
    data: [{ error: "Access denied", path, signedUrl: null }],
    error: null,
  });

  const urls = await createCaseMediaUrlMap(client, [path]);

  assert.equal(urls.has(path), false);
  assert.equal(
    [...urls.values()].some((url) => url.includes("/object/public/")),
    false,
  );
});

test("static case assets stay local and are never sent to Storage", async () => {
  const path = "static:case:documented-case";
  const { client, calls } = caseMediaClient({ data: [], error: null });

  const urls = await createCaseMediaUrlMap(client, [path], (value) =>
    value === path ? "/assets/documented-case.webp" : "",
  );

  assert.equal(urls.get(path), "/assets/documented-case.webp");
  assert.deepEqual(calls, []);
});

test("a signing request failure is not converted into a public URL", async () => {
  const { client } = caseMediaClient({ data: null, error: new Error("Access denied") });

  await assert.rejects(() => createCaseMediaUrlMap(client, ["private/archived.webp"]), {
    message: "Access denied",
  });
});

test("site-cases Storage policy is private and parent-state constrained", () => {
  assert.match(migration, /set public = false\s+where id = 'site-cases'/);
  assert.match(
    migration,
    /bucket_id in \('site-gallery', 'site-services', 'site-products', 'site-hero'\)/,
  );
  assert.doesNotMatch(migration, /bucket_id in \([^\n]*'site-cases'/);
  assert.match(migration, /media\.image_path = storage\.objects\.name/);
  assert.match(migration, /item\.status = 'published'/);
  assert.match(migration, /item\.archived_at is null/);
});

test("draft and archived Case previews require an active admin policy", () => {
  assert.match(migration, /for select to authenticated using \([\s\S]*public\.is_admin\(\)/);
});
