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
