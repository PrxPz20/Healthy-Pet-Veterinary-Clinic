import { siteContent } from "./site";
import type { SiteContent } from "./types";

export type ContentProvider = {
  getSiteContent: () => SiteContent;
};

export const staticContentProvider: ContentProvider = {
  getSiteContent: () => siteContent,
};

export function getSiteContent(provider: ContentProvider = staticContentProvider) {
  return provider.getSiteContent();
}
