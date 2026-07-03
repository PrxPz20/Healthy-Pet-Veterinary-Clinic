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

    const updateActive = () => {
      const marker = window.scrollY + window.innerHeight * 0.55;
      let current = "";

      for (const section of sections) {
        if (section.offsetTop <= marker) {
          current = section.id;
        }
      }

      setActiveId(current);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [hrefs]);

  return activeId;
}

export function isActiveHref(href: string, activeId: string) {
  const id = sectionIdFromHref(href);
  return Boolean(id && id === activeId);
}
