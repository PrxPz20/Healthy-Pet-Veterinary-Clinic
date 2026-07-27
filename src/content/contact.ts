import { getSiteContent } from "./provider";
import type { ContactSettings, Cta } from "./types";

export function getStaticContactSettings(): ContactSettings {
  const { clinic, openingHours } = getSiteContent();

  return {
    address: { ...clinic.address, mapUrl: clinic.mapUrl },
    phones: [
      { label: "Clinic Phone", number: clinic.phone },
      ...(clinic.vetPhone ? [{ label: "Vet Phone", number: clinic.vetPhone }] : []),
    ],
    whatsapp: clinic.vetPhone ?? "",
    email: clinic.email,
    openingHours,
  };
}

export function phoneHref(number: string) {
  return `tel:${number.replace(/[^\\d+]/g, "")}`;
}

export function whatsappHref(number: string) {
  return number ? `https://wa.me/${number.replace(/\\D/g, "")}` : "";
}

export function formatPhone(number: string) {
  const digits = number.replace(/\\D/g, "");
  if (digits.startsWith("357") && digits.length === 11) {
    return `+357 ${digits.slice(3, 5)} ${digits.slice(5)}`;
  }
  return number;
}

export function contactAddressLine(contact: ContactSettings) {
  const { street, city, postalCode, country } = contact.address;
  return [street, city, postalCode, country].filter(Boolean).join(", ");
}

export function mapEmbedUrl(contact: ContactSettings) {
  return `https://www.google.com/maps?q=${encodeURIComponent(contactAddressLine(contact))}&output=embed`;
}

export function primaryContactCta(contact: ContactSettings): Cta {
  const phone = contact.phones[0];
  if (phone) return { label: "Call Now", href: phoneHref(phone.number) };
  if (contact.whatsapp)
    return { label: "WhatsApp", href: whatsappHref(contact.whatsapp), external: true };
  return { label: "Email Us", href: `mailto:${contact.email}` };
}

export function whatsappCta(contact: ContactSettings): Cta | null {
  return contact.whatsapp
    ? { label: "WhatsApp", href: whatsappHref(contact.whatsapp), external: true }
    : null;
}
