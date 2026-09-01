import dermatologyImage from "@/assets/services/dermatology.webp";
import digitalXrayImage from "@/assets/services/digital_x_ray.webp";
import endoscopyImage from "@/assets/services/endoscopy.webp";
import groomingImage from "@/assets/services/grooming.webp";
import laboratoryImage from "@/assets/services/full_laboratory_blood_tests .webp";
import orthopedicImage from "@/assets/services/orthopedic_surgery.webp";
import pathologyImage from "@/assets/services/pathology.webp";
import hydrotherapyImage from "@/assets/services/pet_hydrotherapy.webp";
import physiotherapyImage from "@/assets/services/pet_physiotherapy_&_acupuncture.webp";
import petShopImage from "@/assets/services/pet_shop.webp";
import softTissueImage from "@/assets/services/soft_tissue_surgery.webp";
import ultrasoundImage from "@/assets/services/ultrasound.webp";
import { getSiteContent } from "./provider";

export const serviceImages: Record<string, string> = {
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

export function resolveStaticCmsImage(path: string) {
  if (!path.startsWith("static:")) {
    return "";
  }

  const [, kind, ...keyParts] = path.split(":");
  const key = keyParts.join(":");
  const content = getSiteContent();

  if (kind === "gallery") {
    return content.gallery.find((item) => item.slug === key)?.image.src ?? "";
  }
  if (kind === "product") {
    return content.products.find((item) => item.name === key)?.image.src ?? "";
  }
  if (kind === "service") {
    return serviceImages[key] ?? "";
  }

  return "";
}
