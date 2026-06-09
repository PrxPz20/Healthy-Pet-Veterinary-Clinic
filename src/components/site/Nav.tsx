import { useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { getSiteContent } from "@/content/provider";
import { fadeUp, layoutSpring, menuPanel, softTransition, stagger } from "@/lib/motion";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";

export function Nav() {
  const { navigation, hero } = getSiteContent();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const compact = scrolled;

  useMotionValueEvent(scrollY, "change", (latest) => {
    const next = latest > 40;
    setScrolled((current) => (current === next ? current : next));
  });

  return (
    <motion.header
      initial={reduceMotion ? false : { y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduceMotion ? { duration: 0 } : softTransition}
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        layout
        transition={reduceMotion ? { duration: 0 } : layoutSpring}
        className={`relative mx-auto flex items-center justify-between gap-3 border transition-colors duration-300 ${
          compact
            ? "mt-4 h-16 w-[min(96vw,76rem)] rounded-full border-white/10 bg-ink/92 px-4 shadow-[0_14px_38px_-22px_rgba(24,26,28,0.72)] backdrop-blur-xl md:px-6"
            : "h-[5.25rem] max-w-none rounded-none border-transparent bg-transparent px-5 shadow-none sm:px-8 lg:px-12"
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
            className="h-10 w-auto max-w-[170px] shrink-0 object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:h-11 sm:max-w-[220px]"
          />
        </a>

        <nav className="absolute left-1/2 hidden max-w-[calc(100%-31rem)] -translate-x-1/2 items-center justify-center gap-1 overflow-hidden xl:flex 2xl:gap-2">
          {navigation.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`focus-ring focus-ring-dark whitespace-nowrap rounded-full px-2.5 py-2 text-[0.82rem] font-semibold transition-colors duration-200 2xl:px-3 2xl:text-sm ${
                compact
                  ? "text-white/70 hover:bg-white/8 hover:text-white"
                  : "text-white/86 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="absolute right-3 top-1/2 flex shrink-0 -translate-y-1/2 items-center gap-2 md:static md:translate-y-0">
          <a
            href={hero.primaryCta.href}
            className="focus-ring hidden min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold leading-none text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-clinic sm:inline-flex"
          >
            <Phone className="h-4 w-4 shrink-0" />
            <span>Call now</span>
          </a>
          <button
            aria-label="Toggle menu"
            aria-controls="mobile-navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="focus-ring focus-ring-dark grid min-h-11 min-w-11 place-items-center rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white xl:hidden"
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
            className="mt-2 overflow-hidden rounded-3xl border border-white/10 bg-ink/96 shadow-[0_14px_40px_-22px_rgba(24,26,28,0.8)] backdrop-blur-xl lg:hidden"
          >
            <motion.div
              variants={stagger}
              initial={reduceMotion ? false : "hidden"}
              animate="show"
              className="flex flex-col gap-1 px-3 py-3"
            >
              {navigation.map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  variants={fadeUp}
                  custom={{ y: 10 }}
                  className="focus-ring focus-ring-dark rounded-2xl px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.div variants={fadeUp} custom={{ y: 10 }} className="mt-2">
                <a
                  href={hero.primaryCta.href}
                  className="focus-ring inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-ink"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
