import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/20260731000000_owner_only_admins.sql", import.meta.url),
  "utf8",
);
const repository = readFileSync(new URL("../src/lib/admin/repository.ts", import.meta.url), "utf8");

test("owner-only migration refuses unexpected existing roles", () => {
  assert.match(migration, /where role <> 'owner'/);
  assert.match(migration, /raise exception 'Cannot enable owner-only access/);
});

test("database only accepts owner admin rows", () => {
  assert.match(migration, /check \(role = 'owner'\)/);
});

test("SQL and browser authorization require an active owner", () => {
  assert.match(migration, /role = 'owner'[\s\S]*is_active = true/);
  assert.match(repository, /\.eq\("role", "owner"\)[\s\S]*\.eq\("is_active", true\)/);
});
