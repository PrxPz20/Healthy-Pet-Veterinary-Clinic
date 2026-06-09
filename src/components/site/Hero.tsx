import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Microscope, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";
import { ease, softTransition } from "@/lib/motion";

export function Hero() {
  const { hero, media } = getSiteContent();
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-start overflow-hidden bg-ink text-white md:items-center"
    >
      <motion.div
        initial={reduceMotion ? false : { scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.25, ease }}
        className="absolute inset-0"
      >
        <img
          src={media.heroPoster.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center"
          loading="eager"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] md:object-center"
          autoPlay
          muted
          loop
          playsInline
          poster={media.heroPoster.src}
          aria-label={media.heroPoster.alt}
        >
          <source src={media.heroVideo} type="video/mp4" />
        </video>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,26,28,0.9)_0%,rgba(24,26,28,0.7)_38%,rgba(24,26,28,0.25)_72%,rgba(24,26,28,0.48)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(0deg,#181A1C_0%,rgba(24,26,28,0)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-28 pt-28 sm:px-8 md:pb-24 md:pt-28">
        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { ...softTransition, delay: 0.22 }}
          className="max-w-[20.5rem] text-balance font-display text-[clamp(2.1rem,9vw,5.75rem)] font-black leading-[1] text-white sm:max-w-4xl md:leading-[0.94]"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { ...softTransition, delay: 0.34 }}
          className="mt-6 max-w-[22rem] text-base leading-relaxed text-white/78 sm:max-w-2xl sm:text-lg md:text-xl"
        >
          {hero.body}
        </motion.p>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { ...softTransition, delay: 0.44 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          <a
            href={hero.primaryCta.href}
            className="focus-ring focus-ring-dark group inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_-16px_rgba(59,98,34,0.82)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
          >
            <Phone className="h-4 w-4" />
            {hero.primaryCta.label}
          </a>
          <a
            href="/services"
            className="focus-ring focus-ring-dark group inline-flex min-h-11 items-center gap-2 rounded-full border border-white/28 bg-white/8 px-7 py-3.5 text-sm font-bold text-white shadow-[0_8px_18px_-16px_rgba(255,255,255,0.42)] backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/42 hover:bg-white/14"
          >
            <Microscope className="h-4 w-4" />
            Explore our care
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#care"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { ...softTransition, delay: 0.68 }}
        style={{ x: "-50%" }}
        className="focus-ring focus-ring-dark absolute bottom-6 left-1/2 z-10 hidden rounded-full px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/72 sm:block"
        aria-label="Scroll to services"
      >
        <motion.span
          aria-hidden="true"
          className="grid place-items-center"
          animate={reduceMotion ? undefined : { y: [0, 5, 0], opacity: [0.7, 1, 0.7] }}
          transition={reduceMotion ? undefined : { duration: 1.45, repeat: Infinity, ease }}
        >
          <span>Scroll</span>
          <ChevronDown className="mt-2 h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
