import { StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { iconFor } from "./Icons";

export function TrustStrip() {
  const { trustPoints } = getSiteContent();

  return (
    <section className="relative z-10 bg-white text-ink">
      <StaggerGroup className="mx-auto grid max-w-7xl grid-cols-1 border-b border-line px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {trustPoints.map((item) => {
          const Icon = iconFor(item.icon);
          return (
            <StaggerItem key={item.title}>
              <div className="flex h-full gap-4 border-line py-7 sm:pr-7 lg:border-r">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-black text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">{item.body}</p>
                </div>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
