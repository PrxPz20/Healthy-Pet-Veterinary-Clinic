import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import dermatologyImage from "@/assets/services/dermatology.png";
import digitalXrayImage from "@/assets/services/digital_x_ray.png";
import endoscopyImage from "@/assets/services/endoscopy.png";
import groomingImage from "@/assets/services/grooming.png";
import laboratoryImage from "@/assets/services/full_laboratory_blood_tests .png";
import orthopedicImage from "@/assets/services/orthopedic_surgery.png";
import pathologyImage from "@/assets/services/pathology.png";
import hydrotherapyImage from "@/assets/services/pet_hydrotherapy.png";
import physiotherapyImage from "@/assets/services/pet_physiotherapy_&_acupuncture.png";
import petShopImage from "@/assets/services/pet_shop.png";
import softTissueImage from "@/assets/services/soft_tissue_surgery.png";
import ultrasoundImage from "@/assets/services/ultrasound.png";
import type { Service } from "@/content/types";
import { quickTransition } from "@/lib/motion";

const serviceImages: Record<string, string> = {
  pathology: pathologyImage,
  "laboratory-blood-tests": laboratoryImage,
  "orthopedic-surgery": orthopedicImage,
  "soft-tissue-surgery": softTissueImage,
  dermatology: dermatologyImage,
  ultrasound: ultrasoundImage,
  "digital-x-ray": digitalXrayImage,
  "pet-hydrotherapy": hydrotherapyImage,
  "physiotherapy-acupuncture": physiotherapyImage,
  endoscopy: endoscopyImage,
  grooming: groomingImage,
  "pet-shop": petShopImage,
};

type ServiceDetailCardProps = {
  service: Service;
  reversed?: boolean;
};

export function ServiceDetailCard({ service, reversed = false }: ServiceDetailCardProps) {
  const reduceMotion = useReducedMotion();
  const image = serviceImages[service.slug] ?? petShopImage;

  return (
    <motion.article
      id={service.slug}
      className="group min-w-0 scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-38px_rgba(24,26,28,0.32)] transition-colors duration-300 hover:border-vet-green/35"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={quickTransition}
    >
      <div
        className={`grid min-w-0 gap-0 lg:grid-cols-2 ${
          reversed ? "" : "lg:[&>*:first-child]:order-2"
        }`}
      >
        <div className="min-h-full border-b border-line bg-clinic lg:border-b-0">
          <img
            src={image}
            alt={`${service.title} at Healthy Pet Veterinary Clinic`}
            loading="lazy"
            className="aspect-[4/3] h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 md:p-8 lg:min-h-[26rem]">
          <h3 className="text-balance break-words font-display text-[clamp(1.65rem,5.5vw,3rem)] font-black leading-[1.04] text-ink">
            {service.title}
          </h3>
          <p className="mt-4 max-w-[68ch] text-pretty leading-relaxed text-ink/68">
            {service.detail}
          </p>

          <a
            href="/#contact"
            aria-label={`Ask about ${service.title}`}
            className="focus-ring focus-ring-dark group/link mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            Ask about this service
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
