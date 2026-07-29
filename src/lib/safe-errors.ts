export class UserSafeError extends Error {
  override name = "UserSafeError";
}

function rawErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : "";
  }
  return "";
}

export function userFacingError(error: unknown, fallback: string) {
  if (error instanceof UserSafeError) return error.message;
  if (import.meta.env?.DEV) return rawErrorMessage(error) || fallback;
  return fallback;
}

export function reportClientError(context: string, error: unknown) {
  if (import.meta.env?.DEV) {
    console.error(context, error);
  }
}
