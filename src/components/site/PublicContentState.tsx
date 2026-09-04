import { RefreshCw } from "lucide-react";

export function ContentLoadingState({
  count = 3,
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid gap-5 ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.5rem] border border-line bg-white">
          <div className="aspect-[4/3] w-full animate-pulse bg-sage/65" />
          <div className="space-y-3 p-5 sm:p-6">
            <div className="h-5 w-2/3 animate-pulse rounded-md bg-sage/65" />
            <div className="h-3 w-full animate-pulse rounded-md bg-sage/65" />
            <div className="h-3 w-4/5 animate-pulse rounded-md bg-sage/65" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContentErrorState({
  onRetry,
  loading = false,
}: {
  onRetry: () => void;
  loading?: boolean;
}) {
  return (
    <div
      role="alert"
      className="mt-8 flex flex-col gap-3 rounded-2xl border border-line bg-clinic px-4 py-4 text-ink sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="type-card-copy font-semibold text-ink/72">
        Some current content could not be loaded. Please try again in a moment.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={loading}
        className="focus-ring focus-ring-dark type-button inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-ink px-5 text-white transition-colors hover:bg-vet-green disabled:cursor-wait disabled:opacity-60"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
        {loading ? "Trying again..." : "Try again"}
      </button>
    </div>
  );
}

export function ContentResultsStatus({
  label,
  loading,
  visible,
  total,
}: {
  label: string;
  loading: boolean;
  visible: number;
  total: number;
}) {
  return (
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {loading ? `Loading ${label}.` : total ? `Showing ${visible} of ${total} ${label}.` : ""}
    </p>
  );
}
