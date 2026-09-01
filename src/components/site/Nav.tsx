import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { getSiteContent } from "@/content/provider";
import { primaryContactCta } from "@/content/contact";
import { useContactSettings } from "./contact-settings-context";
import { isActiveHref, useActiveSection } from "@/hooks/use-active-section";
import { fadeUp, layoutSpring, menuPanel, softTransition, stagger } from "@/lib/motion";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";

const navDropdowns: Record<string, { label: string; href: string }> = {
  "/#services": { label: "All services", href: "/services" },
  "/#gallery": { label: "All gallery", href: "/gallery" },
  "/#cases": { label: "All cases", href: "/cases" },
};

export function Nav() {
  const { navigation } = getSiteContent();
  const primaryCta = primaryContactCta(useContactSettings());
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const compact = scrolled;
  const navHrefs = useMemo(() => navigation.map((item) => item.href), [navigation]);
  const activeId = useActiveSection(navHrefs);
  const activeItem = navigation.find((item) => isActiveHref(item.href, activeId));

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 40;
    setScrolled((current) => (current === next ? current : next));
  });

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (navRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : softTransition}
      className="fixed inset-x-0 top-0 z-50"
      ref={navRef}
    >
      <motion.div
        layout
        transition={reduceMotion ? { duration: 0 } : layoutSpring}
        className={`relative mx-auto flex items-center justify-between gap-3 rounded-full border transition-[width,max-width,height,margin,background-color,border-color,box-shadow,padding] duration-500 ease-out ${
          compact
            ? "mt-4 h-[4.75rem] w-[calc(100%-2.5rem)] max-w-[calc(80rem-4rem)] rounded-full border-white/10 bg-ink/92 px-4 shadow-[0_14px_38px_-22px_rgba(24,26,28,0.72)] backdrop-blur-xl sm:w-[calc(100%-4rem)] md:px-6"
            : "mt-0 h-[5.75rem] w-[calc(100%-2.5rem)] max-w-[calc(80rem-4rem)] border-transparent bg-transparent px-0 shadow-none sm:w-[calc(100%-4rem)]"
        }`}
      >
        <a
          href="/"
          className="focus-ring focus-ring-dark group flex min-w-0 items-center rounded-full"
          aria-label="Healthy Pet Veterinary Clinic home"
        >
          <img
            src={logoUrl}
            alt="Healthy Pet Veterinary Clinic"
            className="h-14 w-auto max-w-[200px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-16 sm:max-w-[280px]"
          />
        </a>

        <nav className="absolute left-1/2 hidden max-w-[calc(100%-36rem)] -translate-x-1/2 items-center justify-center gap-1 xl:flex 2xl:gap-2">
          {navigation.map((l) => {
            const isActive = isActiveHref(l.href, activeId);
            const dropdown = navDropdowns[l.href];

            return (
              <div key={l.href} className="group/drop relative">
                <a
                  href={l.href}
                  className={`focus-ring focus-ring-dark relative flex whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold transition-colors duration-200 2xl:px-3 ${
                    isActive
                      ? "text-white"
                      : compact
                        ? "text-white/70 hover:text-white"
                        : "text-white/86 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={reduceMotion ? { duration: 0 } : layoutSpring}
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-1.5">
                    {l.label}
                    {dropdown ? (
                      <ChevronDown
                        className="h-3.5 w-3.5 transition-transform duration-200 group-hover/drop:rotate-180 group-focus-within/drop:rotate-180"
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                </a>
                {dropdown ? (
                  <div className="invisible absolute left-0 top-full z-50 min-w-40 pt-2 opacity-0 transition duration-200 motion-safe:translate-y-1 group-hover/drop:visible group-hover/drop:translate-y-0 group-hover/drop:opacity-100 group-focus-within/drop:visible group-focus-within/drop:translate-y-0 group-focus-within/drop:opacity-100">
                    <div className="rounded-2xl border border-white/10 bg-ink/92 p-2 backdrop-blur-xl">
                      <a
                        href={dropdown.href}
                        className="focus-ring focus-ring-dark type-button block rounded-xl px-4 py-3 text-white/78 transition-colors hover:bg-white/10 hover:text-white"
                      >
                        {dropdown.label}
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="absolute right-3 top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-2 md:static md:translate-y-0">
          <AnimatePresence mode="wait">
            {activeItem ? (
              <motion.a
                key={activeItem.href}
                href={activeItem.href}
                initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={reduceMotion ? { duration: 0 } : softTransition}
                className="focus-ring focus-ring-dark type-label hidden max-w-24 items-center rounded-full bg-white/10 px-3 py-2 text-white backdrop-blur-md sm:inline-flex xl:hidden"
              >
                <span className="truncate">{activeItem.label}</span>
              </motion.a>
            ) : null}
          </AnimatePresence>
          <a
            href={primaryCta.href}
            className="focus-ring type-button hidden min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 sm:inline-flex"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>{primaryCta.label}</span>
          </a>
          <button
            ref={menuButtonRef}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring focus-ring-dark inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-ink/35 p-2 text-white transition-colors hover:bg-white/10 xl:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            variants={menuPanel}
            initial={reduceMotion ? false : "hidden"}
            animate="show"
            exit={reduceMotion ? { opacity: 0 } : "exit"}
            className="mx-3 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-ink/96 shadow-[0_14px_40px_-22px_rgba(24,26,28,0.8)] backdrop-blur-xl xl:hidden"
          >
            <motion.div
              variants={stagger}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className="flex flex-col gap-1 px-3 py-3"
            >
              {navigation.map((l) => {
                const isActive = isActiveHref(l.href, activeId);
                const dropdown = navDropdowns[l.href];

                return (
                  <motion.div key={l.href} variants={fadeUp} custom={{ y: 10 }}>
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`focus-ring focus-ring-dark relative block overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-white/10 hover:text-white ${
                        isActive ? "text-white" : "text-white/80"
                      }`}
                    >
                      {isActive ? (
                        <motion.span
                          layoutId="mobile-nav-active-pill"
                          className="absolute inset-0 rounded-2xl bg-white/10"
                          transition={reduceMotion ? { duration: 0 } : layoutSpring}
                        />
                      ) : null}
                      <span className="relative z-10 inline-flex items-center gap-1.5">
                        {l.label}
                        {dropdown ? (
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : null}
                      </span>
                    </a>
                    {dropdown ? (
                      <a
                        href={dropdown.href}
                        onClick={() => setOpen(false)}
                        className="focus-ring focus-ring-dark ml-4 mt-1 block rounded-xl px-4 py-2.5 text-sm font-semibold text-white/62 transition hover:bg-white/10 hover:text-white"
                      >
                        {dropdown.label}
                      </a>
                    ) : null}
                  </motion.div>
                );
              })}
              <motion.div variants={fadeUp} custom={{ y: 10 }} className="mt-2">
                <a
                  href={primaryCta.href}
                  className="focus-ring type-button inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-ink"
                >
                  <Phone className="h-4 w-4" />
                  {primaryCta.label}
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
