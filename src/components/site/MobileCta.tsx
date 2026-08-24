import { Phone } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileCta() {
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const bottomSections = document.querySelectorAll("#contact, #final-cta, footer");
    if (!bottomSections.length) return;

    const visibleSections = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleSections.add(entry.target);
          } else {
            visibleSections.delete(entry.target);
          }
        });
        setContactVisible(visibleSections.size > 0);
      },
      { threshold: 0.08 },
    );
    bottomSections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <a
      href="#contact"
      className={`focus-ring focus-ring-dark group fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-40 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-vet-green text-white shadow-[0_16px_34px_-20px_rgba(24,26,28,0.72)] transition-[width,transform,opacity,background-color] duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark md:hover:w-36 md:hover:gap-3 ${
        contactVisible ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
      aria-label="Go to contact section"
      aria-hidden={contactVisible}
      tabIndex={contactVisible ? -1 : undefined}
    >
      <span className="type-button hidden max-w-0 whitespace-nowrap opacity-0 transition-all duration-200 md:inline-block md:group-hover:max-w-20 md:group-hover:opacity-100">
        Contact
      </span>
      <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
    </a>
  );
}
