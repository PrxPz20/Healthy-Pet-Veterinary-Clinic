import { z } from "zod";

export const contentStatusSchema = z.enum(["draft", "published"]);

function marketplaceUrlSchema(hostname: string, label: string) {
  return z
    .string()
    .trim()
    .refine((value) => {
      if (!value) return true;
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          (url.hostname === hostname || url.hostname.endsWith(`.${hostname}`))
        );
      } catch {
        return false;
      }
    }, `Enter a valid HTTPS ${label} link.`)
    .optional();
}

export const woltUrlSchema = marketplaceUrlSchema("wolt.com", "Wolt");
export const foodyUrlSchema = marketplaceUrlSchema("foody.com.cy", "Foody");

export const galleryFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(600).optional(),
  status: contentStatusSchema.default("published"),
});

export const caseFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().max(700).optional(),
  category: z.string().trim().max(80).optional(),
  is_sensitive: z.boolean().default(true),
  status: contentStatusSchema.default("published"),
});

export const serviceFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  detail: z.string().trim().min(2).max(3200),
  category: z.string().trim().min(2).max(80),
  status: contentStatusSchema.default("published"),
});

export const productFormSchema = z.object({
  name: z.string().trim().min(2).max(140),
  category: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  wolt_url: woltUrlSchema,
  foody_url: foodyUrlSchema,
  status: contentStatusSchema.default("published"),
});

export const faqFormSchema = z.object({
  question: z.string().trim().min(5, "Enter a complete question.").max(180),
  answer: z.string().trim().min(5, "Enter a useful answer.").max(1200),
  status: contentStatusSchema.default("published"),
});

export const testimonialFormSchema = z.object({
  name: z.string().trim().min(2, "Enter the reviewer's name.").max(100),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().trim().min(5, "Enter the review text.").max(2000),
  status: contentStatusSchema.default("published"),
});

export const aboutFormSchema = z.object({
  label: z.string().trim().min(2).max(40),
  heading: z.string().trim().min(5).max(180),
  paragraph_one: z.string().trim().min(5).max(1200),
  paragraph_two: z.string().trim().max(1200),
  years_experience: z.number().int().min(0).max(100).nullable(),
  completed_cases: z.number().int().min(0).max(1000000).nullable(),
});

const internationalPhoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Use international format, for example +35725101352.");

export function normalizeInternationalPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  return digits ? `+${digits}` : "";
}

export const contactAddressSchema = z.object({
  street: z.string().trim().min(2, "Enter the street address.").max(160),
  city: z.string().trim().min(2, "Enter the city.").max(80),
  postalCode: z.string().trim().min(2, "Enter the postal code.").max(20),
  country: z.string().trim().min(2, "Enter the country.").max(80),
  mapUrl: z
    .string()
    .trim()
    .refine(
      (value) =>
        !value || /^https:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.app\.goo\.gl)\//i.test(value),
      {
        message: "Enter a valid Google Maps link.",
      },
    ),
});

export const contactMethodsSchema = z
  .object({
    phones: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z.string().trim().min(2, "Enter a phone label.").max(40),
          number: internationalPhoneSchema,
        }),
      )
      .max(3),
    whatsapp: z.union([z.literal(""), internationalPhoneSchema]),
    email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  })
  .refine((value) => value.phones.length > 0 || value.whatsapp || value.email, {
    message: "Add at least one phone number, WhatsApp number, or email.",
  });

const timeSchema = z.union([z.literal(""), z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/)]);

const openingHourSchema = z
  .object({
    dayIndex: z.number().int().min(0).max(6),
    dayName: z.string(),
    isClosed: z.boolean(),
    opens1: timeSchema,
    closes1: timeSchema,
    opens2: timeSchema,
    closes2: timeSchema,
  })
  .superRefine((day, context) => {
    if (day.isClosed) return;
    if (!day.opens1 || !day.closes1 || day.opens1 >= day.closes1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Set a valid first opening period.",
      });
    }
    if (Boolean(day.opens2) !== Boolean(day.closes2)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Complete both times in the second period or clear both.",
      });
    } else if (day.opens2 && (day.opens2 >= day.closes2 || day.closes1 > day.opens2)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The second period must start after the first period ends.",
      });
    }
  });

export const openingHoursSchema = z
  .array(openingHourSchema)
  .length(7, "Opening hours must include all seven days.")
  .refine((hours) => hours.some((day) => !day.isClosed), {
    message: "At least one day must be open.",
  });

export const MAX_ADMIN_IMAGE_SIZE = 10 * 1024 * 1024;
export const ADMIN_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function validateAdminImage(file: File) {
  if (!ADMIN_IMAGE_TYPES.includes(file.type)) {
    return "Use JPG, PNG, or WebP images only.";
  }

  if (file.size > MAX_ADMIN_IMAGE_SIZE) {
    return "Image must be 10MB or smaller.";
  }

  return null;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
