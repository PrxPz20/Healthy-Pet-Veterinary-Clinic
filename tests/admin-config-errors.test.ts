import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const loginRoute = readFileSync(new URL("../src/routes/admin/login.tsx", import.meta.url), "utf8");
const repository = readFileSync(new URL("../src/lib/admin/repository.ts", import.meta.url), "utf8");
const dashboard = readFileSync(new URL("../src/routes/admin/index.tsx", import.meta.url), "utf8");
const publicCms = readFileSync(
  new URL("../src/lib/supabase/public-gallery.ts", import.meta.url),
  "utf8",
);

test("browser-facing admin errors do not disclose configuration names", () => {
  for (const source of [loginRoute, repository]) {
    assert.doesNotMatch(source, /Supabase is not configured/);
    assert.doesNotMatch(source, /VITE_SUPABASE_(URL|ANON_KEY)/);
  }
});

test("unconfigured admin portal returns a generic user-facing error", () => {
  assert.match(loginRoute, /The admin portal is temporarily unavailable/);
  assert.match(repository, /The admin service is temporarily unavailable/);
});

test("unknown backend errors are redacted at browser-facing boundaries", () => {
  assert.doesNotMatch(dashboard, /sectionQuery\.error\.message/);
  assert.doesNotMatch(dashboard, /currentError instanceof Error \? currentError\.message/);
  assert.doesNotMatch(publicCms, /error\.message/);
  assert.match(dashboard, /userFacingError/);
  assert.match(publicCms, /reportClientError/);
});

test("admin session loading cannot remain pending indefinitely", () => {
  assert.match(dashboard, /ADMIN_SESSION_TIMEOUT = 10_000/);
  assert.match(dashboard, /Please check your connection and try again/);
  assert.match(dashboard, /window\.clearTimeout\(timeout\)/);
});
