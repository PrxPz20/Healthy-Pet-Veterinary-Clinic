import assert from "node:assert/strict";
import test from "node:test";

import { UserSafeError, userFacingError } from "../src/lib/safe-errors.ts";

test("unknown backend details are replaced with a generic production message", () => {
  const backendError = new Error(
    'relation "admin_users" does not exist; VITE_SUPABASE_URL=https://internal.example',
  );

  assert.equal(
    userFacingError(backendError, "Content is temporarily unavailable. Please try again later."),
    "Content is temporarily unavailable. Please try again later.",
  );
});

test("explicitly trusted validation errors remain useful", () => {
  assert.equal(
    userFacingError(new UserSafeError("Add a service image before saving."), "Unable to save."),
    "Add a service image before saving.",
  );
});
