import type { Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

type RevealMotion = {
  delay?: number;
  y?: number;
};

export const softDuration = 0.6;
export const quickDuration = 0.24;

export const softTransition = { duration: softDuration, ease };
export const quickTransition = { duration: quickDuration, ease };
export const layoutSpring = { type: "spring", stiffness: 260, damping: 30 } as const;

export const fadeUp: Variants = {
  hidden: ({ y = 14 }: RevealMotion = {}) => ({ opacity: 0, y }),
  show: ({ delay = 0 }: RevealMotion = {}) => ({
    opacity: 1,
    y: 0,
    transition: { ...softTransition, delay },
  }),
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const menuPanel: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: quickTransition,
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.98,
    transition: quickTransition,
  },
};
