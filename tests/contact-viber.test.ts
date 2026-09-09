import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/20260909000000_add_viber_contact_method.sql", import.meta.url),
  "utf8",
);

test("Viber contact writes remain validated and owner-gated", () => {
  assert.match(migration, /if not public\.is_admin\(\)/);
  assert.match(migration, /clean_viber !~ '\^\[\+\]\[1-9\]\[0-9\]\{7,14\}\$'/);
  assert.match(migration, /where id = true/);
  assert.match(migration, /revoke all on function public\.save_contact_methods/);
  assert.match(migration, /grant execute on function public\.save_contact_methods/);
});
