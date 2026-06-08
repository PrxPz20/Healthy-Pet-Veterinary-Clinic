import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Bone,
  Camera,
  Circle,
  Clock,
  FlaskConical,
  HeartPulse,
  MapPin,
  Microscope,
  Package,
  Phone,
  ScanLine,
  Scissors,
  ShieldCheck,
  Stethoscope,
  Syringe,
  Waves,
  type LucideIcon,
} from "lucide-react";
import healthyPetLogoMark from "@/assets/HealthyPet_Logo_Mark.png";

export const ICONS: Record<string, LucideIcon> = {
  activity: Activity,
  "arrow-right": ArrowRight,
  "badge-check": BadgeCheck,
  bone: Bone,
  camera: Camera,
  clock: Clock,
  "flask-conical": FlaskConical,
  "heart-pulse": HeartPulse,
  "map-pin": MapPin,
  microscope: Microscope,
  package: Package,
  phone: Phone,
  "scan-line": ScanLine,
  scissors: Scissors,
  "shield-check": ShieldCheck,
  stethoscope: Stethoscope,
  syringe: Syringe,
  waves: Waves,
};

export function iconFor(name: string) {
  return ICONS[name] ?? Circle;
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative grid place-items-center overflow-hidden rounded-full bg-white p-1.5 text-ink ${className}`}
      aria-hidden="true"
    >
      <span className="absolute inset-1 rounded-full border border-vet-green/30" />
      <img
        src={healthyPetLogoMark}
        alt=""
        className="relative z-10 h-full w-full object-contain"
        loading="eager"
      />
    </span>
  );
}
