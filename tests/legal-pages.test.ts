import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const privacy = readFileSync(new URL("../src/routes/privacy.tsx", import.meta.url), "utf8");
const terms = readFileSync(new URL("../src/routes/terms.tsx", import.meta.url), "utf8");
const footer = readFileSync(new URL("../src/components/site/Footer.tsx", import.meta.url), "utf8");

test("legal pages retain required placeholders and verified website limitations", () => {
  for (const placeholder of [
    "[REGISTERED LEGAL BUSINESS NAME]",
    "[TRADING NAME]",
    "[COMPANY REGISTRATION NUMBER]",
    "[REGISTERED ADDRESS]",
    "[PRIVACY CONTACT EMAIL]",
    "[PRIVACY CONTACT PHONE]",
    "[EFFECTIVE DATE]",
  ]) {
    const escaped = placeholder.replaceAll("[", "\\[").replaceAll("]", "\\]");
    assert.match(privacy, new RegExp(escaped));
    assert.match(terms, new RegExp(escaped));
  }

  const noTransactions =
    /does not accept\s+appointment bookings, payments, purchases, or public form/;
  assert.match(privacy, noTransactions);
  assert.match(terms, noTransactions);
  assert.match(privacy, /permission before publication/);
  assert.match(terms, /Publication permission[\s\S]*must be confirmed/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(footer, /href="\/terms"/);
});
