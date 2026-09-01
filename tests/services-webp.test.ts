import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const mediaSource = readFileSync(new URL("../src/content/cms-media.ts", import.meta.url), "utf8");
const servicesPage = readFileSync(new URL("../src/routes/services.tsx", import.meta.url), "utf8");
const migration = readFileSync(
  new URL("../supabase/migrations/20260831000000_services_webp_assets.sql", import.meta.url),
  "utf8",
);

test("Services page static media uses WebP assets", () => {
  assert.doesNotMatch(mediaSource, /@\/assets\/services\/[^"']+\.png/);
  assert.doesNotMatch(servicesPage, /@\/assets\/services\/[^"']+\.png/);
  assert.match(servicesPage, /services_hero_banner\.webp/);

  for (const key of [
    "pathology",
    "laboratory-blood-tests",
    "ultrasound",
    "endoscopy",
    "digital-x-ray",
    "orthopedic-surgery",
    "soft-tissue-surgery",
    "physiotherapy-acupuncture",
    "dermatology",
    "pet-shop",
  ]) {
    assert.match(migration, new RegExp(`static:service:${key}`));
  }
});
