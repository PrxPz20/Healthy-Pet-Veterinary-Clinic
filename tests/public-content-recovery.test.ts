import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const hookSource = readFileSync(
  new URL("../src/hooks/use-public-items.ts", import.meta.url),
  "utf8",
);
const homeSource = readFileSync(new URL("../src/routes/index.tsx", import.meta.url), "utf8");
const heroSource = readFileSync(
  new URL("../src/components/site/Hero.tsx", import.meta.url),
  "utf8",
);

test("failed public requests preserve current content or restore the static fallback", () => {
  assert.match(hookSource, /current\.length \? current : merge\(fallback, null\)/);
  assert.match(hookSource, /setHasError\(true\)/);
  assert.match(hookSource, /return \{ items, hasLoaded, loading, hasError, retry \}/);
});

test("homepage defers below-the-fold component code", () => {
  for (const component of ["Gallery", "Cases", "Testimonials", "Products", "Faq", "Contact"]) {
    assert.match(homeSource, new RegExp(`const ${component} = lazy`));
  }
  assert.match(homeSource, /<Suspense/);
});

test("hero video renders immediately and respects reduced motion", () => {
  assert.doesNotMatch(heroSource, /videoReady|document\.readyState|setTimeout/);
  assert.match(heroSource, /autoPlay=\{!reduceMotion\}/);
  assert.match(heroSource, /preload=\{reduceMotion \? "metadata" : "auto"\}/);
  assert.match(heroSource, /if \(reduceMotion\)/);
});
