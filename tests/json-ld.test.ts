import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "../src/lib/json-ld.ts";

test("JSON-LD serialization neutralizes script-closing CMS content", () => {
  const data = {
    question: "Can I use </script><script>globalThis.compromised = true</script>?",
    answer: "Use <care> & guidance.\u2028Line separator.\u2029Paragraph separator.",
  };

  const serialized = serializeJsonLd(data);

  assert.equal(serialized.includes("</script"), false);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes(">"), false);
  assert.equal(serialized.includes("&"), false);
  assert.equal(serialized.includes("\u2028"), false);
  assert.equal(serialized.includes("\u2029"), false);
  assert.deepEqual(JSON.parse(serialized), data);
});

test("JSON-LD serialization preserves ordinary structured data", () => {
  const data = {
    "@context": "https://schema.org",
    name: "Healthy Pet Veterinary Clinic",
    rating: 5,
    available: true,
  };

  assert.deepEqual(JSON.parse(serializeJsonLd(data)), data);
});
