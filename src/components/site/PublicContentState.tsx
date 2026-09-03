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
