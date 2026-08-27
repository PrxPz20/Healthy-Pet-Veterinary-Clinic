import { createClient } from "@supabase/supabase-js";
import { getStaticContactSettings } from "@/content/contact";
import type { ContactSettings, OpeningHour } from "@/content/types";
import { getSupabasePublicConfig } from "./config";

type ContactRow = {
  street: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  map_url: string;
  email: string;
  whatsapp: string;
};

type PhoneRow = { id: string; label: string; phone: string; sort_order: number };
type SocialLinkRow = { platform: string; url: string; sort_order: number };
type HoursRow = {
  day_index: number;
  day_name: string;
  is_closed: boolean;
  opens_1: string | null;
  closes_1: string | null;
  opens_2: string | null;
  closes_2: string | null;
};

function mapHours(row: HoursRow): OpeningHour {
  const ranges = [
    row.opens_1 && row.closes_1
      ? { opens: row.opens_1.slice(0, 5), closes: row.closes_1.slice(0, 5) }
      : null,
    row.opens_2 && row.closes_2
      ? { opens: row.opens_2.slice(0, 5), closes: row.closes_2.slice(0, 5) }
      : null,
  ].filter(Boolean) as OpeningHour["ranges"];

  return { day: row.day_name, label: row.day_name, ranges: row.is_closed ? [] : ranges };
}

export async function loadPublicContactSettings(): Promise<ContactSettings> {
  const fallback = getStaticContactSettings();
  const config = getSupabasePublicConfig();
  if (!config) return fallback;

  const client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const [settingsResult, phonesResult, hoursResult, socialResult] = await Promise.all([
    client
      .from("contact_settings")
      .select("street,city,region,postal_code,country,map_url,email,whatsapp")
      .eq("id", true)
      .maybeSingle(),
    client.from("contact_phones").select("id,label,phone,sort_order").order("sort_order"),
    client
      .from("opening_hours")
      .select("day_index,day_name,is_closed,opens_1,closes_1,opens_2,closes_2")
      .order("day_index"),
    client.from("contact_social_links").select("platform,url,sort_order").order("sort_order"),
  ]);

  if (settingsResult.error || !settingsResult.data) return fallback;
  const settings = settingsResult.data as ContactRow;
  return {
    address: {
      street: settings.street,
      city: settings.city,
      region: settings.region,
      postalCode: settings.postal_code,
      country: settings.country,
      mapUrl: settings.map_url,
    },
    phones: phonesResult.error
      ? fallback.phones
      : ((phonesResult.data ?? []) as PhoneRow[]).map((phone) => ({
          id: phone.id,
          label: phone.label,
          number: phone.phone,
        })),
    whatsapp: settings.whatsapp,
    email: settings.email,
    socialLinks: socialResult.error
      ? fallback.socialLinks
      : ((socialResult.data ?? []) as SocialLinkRow[]).map((link) => ({
          label: link.platform,
          href: link.url,
          external: true,
        })),
    openingHours: hoursResult.error
      ? fallback.openingHours
      : ((hoursResult.data ?? []) as HoursRow[]).map(mapHours),
  };
}
