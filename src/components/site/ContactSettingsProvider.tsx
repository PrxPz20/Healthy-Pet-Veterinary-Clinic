import type { ReactNode } from "react";
import type { ContactSettings } from "@/content/types";
import { ContactSettingsContext } from "./contact-settings-context";

export function ContactSettingsProvider({
  value,
  children,
}: {
  value: ContactSettings;
  children: ReactNode;
}) {
  return (
    <ContactSettingsContext.Provider value={value}>{children}</ContactSettingsContext.Provider>
  );
}
