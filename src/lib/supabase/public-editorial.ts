import { createClient } from "@supabase/supabase-js";
import { getSiteContent } from "@/content/provider";
import type { FaqItem, Testimonial } from "@/content/types";
import { getSupabasePublicConfig } from "./config";

export type PublicEditorialContent = {
  about: ReturnType<typeof getSiteContent>["about"];
  aboutImage: ReturnType<typeof getSiteContent>["media"]["about"];
  faqs: FaqItem[];
  testimonials: Testimonial[];
};

export async function loadPublicEditorialContent(): Promise<PublicEditorialContent> {
  const fallback = getSiteContent();
  const config = getSupabasePublicConfig();
  if (!config) {
    return {
      about: fallback.about,
      aboutImage: fallback.media.about,
      faqs: fallback.faqs,
      testimonials: fallback.testimonials,
    };
  }

  const client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const [aboutResult, faqResult, reviewResult] = await Promise.all([
    client
      .from("about_settings")
      .select(
        "label,heading,paragraph_one,paragraph_two,years_experience,completed_cases,image_path",
      )
      .eq("id", true)
      .maybeSingle(),
    client.from("faq_items").select("question,answer").order("sort_order").order("created_at"),
    client
      .from("testimonials")
      .select("name,rating,review_text")
      .order("sort_order")
      .order("created_at"),
  ]);

  const about =
    !aboutResult.error && aboutResult.data
      ? {
          ...fallback.about,
          label: aboutResult.data.label,
          heading: aboutResult.data.heading,
          paragraphs: [aboutResult.data.paragraph_one, aboutResult.data.paragraph_two].filter(
            Boolean,
          ),
          metrics: [
            {
              label: "Years of experience",
              value: aboutResult.data.years_experience ?? undefined,
              suffix: "+",
            },
            {
              label: "Completed cases",
              value: aboutResult.data.completed_cases ?? undefined,
              suffix: "+",
            },
          ],
        }
      : fallback.about;

  return {
    about,
    aboutImage: aboutResult.data?.image_path
      ? {
          src: client.storage.from("site-about").getPublicUrl(aboutResult.data.image_path).data
            .publicUrl,
          alt: "Dr. Avgoustinos Theodorou at Healthy Pet Veterinary Clinic",
        }
      : fallback.media.about,
    faqs: faqResult.error ? fallback.faqs : (faqResult.data ?? []),
    testimonials: reviewResult.error
      ? fallback.testimonials
      : (reviewResult.data ?? []).map((item) => ({
          name: item.name,
          rating: item.rating as 1 | 2 | 3 | 4 | 5,
          text: item.review_text,
        })),
  };
}
