import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../src/components/site/PublicContentState.tsx", import.meta.url),
  "utf8",
);

test("public content states announce updates while hiding decorative skeletons", () => {
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /Loading \$\{label\}/);
  assert.match(source, /Showing \$\{visible\} of \$\{total\}/);
  assert.match(source, /aria-hidden="true"/);
});
