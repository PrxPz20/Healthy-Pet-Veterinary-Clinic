import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../src/lib/supabase/public-gallery.ts", import.meta.url),
  "utf8",
);

test("public CMS failures restore static content for every supported section", () => {
  for (const name of ["Gallery", "Case", "Service", "Product"]) {
    assert.match(
      source,
      new RegExp(`function merge${name}Items[\\s\\S]*?return cmsItems \\?\\? staticItems;`),
    );
  }
});
