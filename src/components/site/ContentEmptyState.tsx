import { Clock3 } from "lucide-react";

export function ContentEmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div
      role="status"
      className="flex min-h-44 items-center justify-center rounded-[1.5rem] border border-dashed border-line bg-sage/35 px-6 py-10 text-center"
    >
      <div className="max-w-md">
        <Clock3 className="mx-auto h-6 w-6 text-vet-green" aria-hidden="true" />
        <h3 className="type-card-title mt-4 text-ink">{title}</h3>
        <p className="type-card-copy mt-2 text-ink/68">{body}</p>
      </div>
    </div>
  );
}
