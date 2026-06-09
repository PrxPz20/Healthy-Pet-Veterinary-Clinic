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
