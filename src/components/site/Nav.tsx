import { useEffect, useMemo, useState } from "react";
import { Menu, MessageCircle, Phone, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { getSiteContent } from "@/content/provider";
import { LogoMark } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const { clinic, navigation, hero } = getSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const isHome = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.location.pathname === "/";
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      className="fixed left-3 right-3 top-4 z-50 md:left-1/2 md:right-auto md:w-[min(94vw,1120px)] md:-translate-x-1/2"
    >
      <div
        className={`relative mx-auto flex h-14 items-center justify-between gap-3 rounded-full border px-3 transition-all duration-300 md:px-5 ${
          scrolled || !isHome
            ? "max-w-4xl border-white/10 bg-ink/92 shadow-[0_14px_38px_-22px_rgba(24,26,28,0.72)] backdrop-blur-xl"
            : "max-w-6xl border-white/15 bg-ink/48 shadow-[0_10px_30px_-22px_rgba(24,26,28,0.62)] backdrop-blur-md"
        }`}
      >
        <a
          href="/"
          className="focus-ring focus-ring-dark group flex min-w-0 items-center gap-2 rounded-full"
        >
          <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:scale-105" />
          <span className="hidden max-w-[150px] truncate font-display text-sm font-extrabold text-white sm:block sm:max-w-none md:text-base">
            {clinic.name}
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="focus-ring focus-ring-dark rounded-full px-3 py-2 text-sm font-semibold text-white/70 transition-colors duration-200 hover:bg-white/8 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="absolute left-16 top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-2 sm:left-auto sm:right-3 md:static md:translate-y-0">
          <a
            href={hero.primaryCta.href}
            className="focus-ring hidden min-h-11 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-clinic sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </a>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noreferrer"
            className="focus-ring focus-ring-dark hidden min-h-11 items-center gap-1.5 rounded-full bg-vet-green px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark md:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            WhatsApp
          </a>
          <button
            aria-label="Toggle menu"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring focus-ring-dark grid min-h-11 min-w-11 place-items-center rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-navigation"
            initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease }}
            className="mt-2 overflow-hidden rounded-3xl border border-white/10 bg-ink/96 shadow-[0_14px_40px_-22px_rgba(24,26,28,0.8)] backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-3 py-3">
              {navigation.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="focus-ring focus-ring-dark rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <a
                  href={hero.primaryCta.href}
                  className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-ink"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
                <a
                  href={hero.secondaryCta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring focus-ring-dark inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-vet-green px-4 py-3 text-sm font-bold text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
