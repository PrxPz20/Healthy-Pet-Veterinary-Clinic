import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";
import { LogoMark } from "./Icons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { clinic, hero, media } = getSiteContent();

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink text-white">
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0"
      >
        <img
          src={media.heroPoster.src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
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
      <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(0deg,#181A1C_0%,rgba(24,26,28,0)_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-32 sm:px-8 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.3 }}
          className="inline-flex items-center gap-3 rounded-full border border-white/18 bg-white/8 px-3 py-2 backdrop-blur-md"
        >
          <LogoMark className="h-8 w-8" />
          <span className="text-sm font-bold text-white/88">{clinic.name}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
          className="mt-7 max-w-4xl text-balance font-display text-[clamp(2.6rem,7vw,6.7rem)] font-black leading-[0.94] text-white"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.75 }}
          className="mt-7 max-w-[22rem] text-base leading-relaxed text-white/76 sm:max-w-2xl sm:text-lg md:text-xl"
        >
          {hero.body}
        </motion.p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href={hero.primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-ink shadow-[0_16px_42px_-20px_rgba(255,255,255,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-clinic"
          >
            <Phone className="h-4 w-4" />
            {hero.primaryCta.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-vet-green px-7 py-3.5 text-sm font-bold text-white shadow-[0_16px_42px_-20px_rgba(59,98,34,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green-dark"
          >
            <MessageCircle className="h-4 w-4" />
            {hero.secondaryCta.label}
          </a>
        </div>

        <div className="mt-10 grid max-w-xs gap-2 border-l border-white/22 pl-5 text-sm text-white/70 md:mt-12 md:flex md:max-w-3xl md:flex-wrap md:gap-x-7 md:gap-y-3">
          <span>{hero.eyebrow}</span>
          <span>{clinic.phoneDisplay}</span>
          <span>{clinic.address.city}, Cyprus</span>
        </div>
      </div>
    </section>
  );
}
