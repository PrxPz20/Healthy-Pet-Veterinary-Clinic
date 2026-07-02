import { useEffect, useState } from "react";

function sectionIdFromHref(href: string) {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return "";
  return href.slice(hashIndex + 1);
}

export function useActiveSection(hrefs: string[]) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const ids = hrefs.map(sectionIdFromHref).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const clearInHero = () => {
      if (window.scrollY < window.innerHeight * 0.55) {
        setActiveId("");
      }
    };

    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        const [nextActive] = [...visibility.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort((a, b) => b[1] - a[1]);

        if (nextActive?.[0]) {
          setActiveId(nextActive[0]);
        }
      },
      {
        rootMargin: "-28% 0px -58% 0px",
        threshold: [0.08, 0.18, 0.32, 0.5, 0.68],
      },
    );

    sections.forEach((section) => observer.observe(section));
    clearInHero();
    window.addEventListener("scroll", clearInHero, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", clearInHero);
    };
  }, [hrefs]);

  return activeId;
}

export function isActiveHref(href: string, activeId: string) {
  const id = sectionIdFromHref(href);
  return Boolean(id && id === activeId);
}
