import { Phone } from "lucide-react";

export function MobileCta() {
  return (
    <a
      href="#contact"
      className="focus-ring focus-ring-dark group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-vet-green text-white shadow-[0_16px_34px_-20px_rgba(24,26,28,0.72)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark md:hover:w-36 md:hover:gap-3"
      aria-label="Go to contact section"
    >
      <span className="type-button hidden max-w-0 whitespace-nowrap opacity-0 transition-all duration-200 md:inline-block md:group-hover:max-w-20 md:group-hover:opacity-100">
        Contact
      </span>
      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
    </a>
  );
}
