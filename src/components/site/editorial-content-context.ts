import { createContext, useContext } from "react";
import { getSiteContent } from "@/content/provider";
import type { PublicEditorialContent } from "@/lib/supabase/public-editorial";

const fallback = getSiteContent();

export const EditorialContentContext = createContext<PublicEditorialContent>({
  about: fallback.about,
  faqs: fallback.faqs,
  testimonials: fallback.testimonials,
});

export function useEditorialContent() {
  return useContext(EditorialContentContext);
}
