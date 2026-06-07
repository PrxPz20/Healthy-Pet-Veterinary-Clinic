import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Circle,
  Clock,
  HeartPulse,
  MapPin,
  Microscope,
  Package,
  Phone,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Syringe,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  clock: Clock,
  "heart-pulse": HeartPulse,
  "map-pin": MapPin,
  microscope: Microscope,
  package: Package,
  phone: Phone,
  scissors: Scissors,
  "shield-check": ShieldCheck,
  stethoscope: Stethoscope,
  syringe: Syringe,
};

export function iconFor(name: string) {
  return ICONS[name] ?? Circle;
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden rounded-full bg-white text-ink ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-full border border-vet-green/30" />
      <span className="font-display text-sm font-black">V</span>
    </span>
  );
}
