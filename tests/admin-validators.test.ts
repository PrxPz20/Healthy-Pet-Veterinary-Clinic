import assert from "node:assert/strict";
import test from "node:test";
import {
  aboutFormSchema,
  caseFormSchema,
  contactMethodsSchema,
  faqFormSchema,
  galleryFormSchema,
  normalizeInternationalPhone,
  openingHoursSchema,
  productFormSchema,
  serviceFormSchema,
  slugify,
  testimonialFormSchema,
  validateAdminImage,
} from "../src/lib/admin/validators.ts";

test("slugify creates stable URL-safe slugs", () => {
  assert.equal(slugify("  Dr. Avgoustinos' Care  "), "dr-avgoustinos-care");
  assert.equal(slugify("Physiotherapy & Acupuncture"), "physiotherapy-acupuncture");
});

test("gallery requires a title but permits an omitted description", () => {
  assert.equal(
    galleryFormSchema.safeParse({ title: "Clinic visit", status: "published" }).success,
    true,
  );
  assert.equal(galleryFormSchema.safeParse({ title: "", status: "published" }).success, false);
});

test("cases permit omitted media-related copy and default to sensitive", () => {
  const result = caseFormSchema.parse({ title: "Dental care", status: "published" });
  assert.equal(result.is_sensitive, true);
  assert.equal(result.description, undefined);
});

test("services require a title, detail, and category", () => {
  assert.equal(
    serviceFormSchema.safeParse({
      title: "Ultrasound",
      detail: "Diagnostic imaging",
      category: "Diagnostics",
    }).success,
    true,
  );
  assert.equal(
    serviceFormSchema.safeParse({ title: "Ultrasound", detail: "", category: "Diagnostics" })
      .success,
    false,
  );
});

test("products accept empty optional copy and approved marketplace links", () => {
  assert.equal(
    productFormSchema.safeParse({
      name: "Veterinary diet",
      category: "Food",
      wolt_url: "https://wolt.com/en/cyp/limassol",
      foody_url: "https://www.foody.com.cy/page/shop",
    }).success,
    true,
  );
});

test("products reject unsafe or unrelated marketplace links", () => {
  for (const value of [
    "javascript:alert(1)",
    "http://wolt.com/shop",
    "https://wolt.com.example.com/shop",
    "https://example.com/shop",
  ]) {
    assert.equal(
      productFormSchema.safeParse({ name: "Diet", category: "Food", wolt_url: value }).success,
      false,
      value,
    );
  }
});

test("FAQ and review limits reject incomplete content", () => {
  assert.equal(faqFormSchema.safeParse({ question: "Why?", answer: "No" }).success, false);
  assert.equal(
    testimonialFormSchema.safeParse({ name: "A", rating: 6, review_text: "Good" }).success,
    false,
  );
});

test("about counters reject negative or unrealistic values", () => {
  const base = {
    label: "About Us",
    heading: "Meet Dr. Avgoustinos",
    paragraph_one: "Professional veterinary care in Limassol.",
    paragraph_two: "",
    completed_cases: 1000,
  };
  assert.equal(aboutFormSchema.safeParse({ ...base, years_experience: 20 }).success, true);
  assert.equal(aboutFormSchema.safeParse({ ...base, years_experience: -1 }).success, false);
});

test("image validation accepts supported images within 10MB", () => {
  assert.equal(validateAdminImage(new File(["image"], "pet.webp", { type: "image/webp" })), null);
});

test("image validation rejects unsupported types and oversized files", () => {
  assert.match(
    validateAdminImage(new File(["file"], "case.svg", { type: "image/svg+xml" })) ?? "",
    /JPG, PNG, or WebP/,
  );
  const oversized = new File([new Uint8Array(10 * 1024 * 1024 + 1)], "large.jpg", {
    type: "image/jpeg",
  });
  assert.match(validateAdminImage(oversized) ?? "", /10MB or smaller/);
});

test("contact methods normalize and validate international phone numbers", () => {
  assert.equal(normalizeInternationalPhone("+357 25 ABC 101352"), "+35725101352");
  assert.equal(
    contactMethodsSchema.safeParse({
      phones: [{ label: "Clinic", number: "+35725101352" }],
      whatsapp: "",
      email: "",
    }).success,
    true,
  );
  assert.equal(
    contactMethodsSchema.safeParse({
      phones: [{ label: "Clinic", number: "+123" }],
      whatsapp: "",
      email: "",
    }).success,
    false,
  );
});

test("opening hours reject incomplete or overlapping periods", () => {
  const hours = Array.from({ length: 7 }, (_, dayIndex) => ({
    dayIndex,
    dayName: `Day ${dayIndex}`,
    isClosed: dayIndex > 0,
    opens1: dayIndex === 0 ? "09:00" : "",
    closes1: dayIndex === 0 ? "13:00" : "",
    opens2: "",
    closes2: "",
  }));
  assert.equal(openingHoursSchema.safeParse(hours).success, true);
  hours[0].opens2 = "12:00";
  hours[0].closes2 = "14:00";
  assert.equal(openingHoursSchema.safeParse(hours).success, false);
});
