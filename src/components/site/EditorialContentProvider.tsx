import type { ReactNode } from "react";
import type { PublicEditorialContent } from "@/lib/supabase/public-editorial";
import { EditorialContentContext } from "./editorial-content-context";

export function EditorialContentProvider({
  value,
  children,
}: {
  value: PublicEditorialContent;
  children: ReactNode;
}) {
  return (
    <EditorialContentContext.Provider value={value}>{children}</EditorialContentContext.Provider>
  );
}
