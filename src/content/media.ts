import type { CaseItem, GalleryItem, ImageAsset, MediaAsset } from "./types";

export function itemMedia(item: GalleryItem | CaseItem): MediaAsset[] {
  if (item.media?.length) {
    return item.media;
  }

  if (!item.image.src) {
    return [];
  }

  return [{ ...item.image, type: "image" }];
}

export function coverImage(item: GalleryItem | CaseItem): ImageAsset {
  return itemMedia(item)[0] ?? item.image;
}
