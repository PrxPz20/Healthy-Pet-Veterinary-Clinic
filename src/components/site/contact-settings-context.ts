import { createContext, useContext } from "react";
import { getStaticContactSettings } from "@/content/contact";
import type { ContactSettings } from "@/content/types";

export const ContactSettingsContext = createContext<ContactSettings>(getStaticContactSettings());

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
