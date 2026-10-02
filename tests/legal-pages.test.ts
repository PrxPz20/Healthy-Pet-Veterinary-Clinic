import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const privacy = readFileSync(new URL("../src/routes/privacy.tsx", import.meta.url), "utf8");
const terms = readFileSync(new URL("../src/routes/terms.tsx", import.meta.url), "utf8");
const footer = readFileSync(new URL("../src/components/site/Footer.tsx", import.meta.url), "utf8");

test("legal pages include supplied operator details and verified website limitations", () => {
  for (const detail of [
    "FILIDONO LTD",
    "Healthy Pet",
    "HE488697",
    "Katinas Paxinou 66, Agios Athanasios-Panthea, 4105",
    "vetdr2000cy@gmail.com",
    "95952663",
  ]) {
    const escaped = detail.replaceAll("[", "\\[").replaceAll("]", "\\]");
    assert.match(privacy, new RegExp(escaped));
    assert.match(terms, new RegExp(escaped));
  }

  assert.match(privacy, /mailto:vetdr2000cy@gmail\.com/);
  assert.match(terms, /mailto:vetdr2000cy@gmail\.com/);
  assert.match(privacy, /\[EFFECTIVE DATE\]/);
  assert.match(terms, /\[EFFECTIVE DATE\]/);

  const noTransactions =
    /does not accept\s+appointment bookings, payments, purchases, or public form/;
  assert.match(privacy, noTransactions);
  assert.match(terms, noTransactions);
  assert.match(privacy, /permission before publication/);
  assert.match(terms, /Publication permission[\s\S]*must be confirmed/);
  assert.match(footer, /href="\/privacy"/);
  assert.match(footer, /href="\/terms"/);
});
