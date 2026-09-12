/**
 * Normalizes cake image URLs to a consistent 4:3 presentation canvas.
 * Ensures the subject cake has a consistent visual scale across the catalogue,
 * full cake remains visible without cropping, and excessive black/empty space is minimized.
 */
export function getNormalizedCakeImageUrl(rawUrl?: string | null): string {
  if (
    !rawUrl ||
    typeof rawUrl !== "string" ||
    !rawUrl.trim() ||
    rawUrl.trim() === "null" ||
    rawUrl.trim() === "undefined"
  ) {
    return "/images/ref_belgian_chocolate.png";
  }

  try {
    const trimmed = rawUrl.trim();
    // 1. Unsplash Images: Use Imgix parameters to generate a crisp, normalized 4:3 canvas
    if (trimmed.includes("images.unsplash.com")) {
      const url = new URL(trimmed);
      url.searchParams.set("auto", "format");
      url.searchParams.set("fit", "crop");
      url.searchParams.set("ar", "4:3");
      url.searchParams.set("q", "85");
      if (!url.searchParams.has("w") || parseInt(url.searchParams.get("w") || "0") < 800) {
        url.searchParams.set("w", "900");
      }
      return url.toString();
    }

    // 2. ImageKit Images: Use ImageKit transformation parameters for 4:3 aspect ratio
    if (trimmed.includes("ik.imagekit.io")) {
      const url = new URL(trimmed);
      if (!url.searchParams.has("tr")) {
        url.searchParams.set("tr", "ar-4-3,w-900,c-at_max");
      }
      return url.toString();
    }

    return trimmed;
  } catch {
    return rawUrl || "/images/ref_belgian_chocolate.png";
  }
}

/**
 * Returns the 100% UNTOUCHED, UNCROPPED original source image URL for the Cake Detail Hero.
 * Strictly removes any crop/aspect-ratio transforms (such as fit=crop, ar=4:3) so that
 * the customer sees the complete original photograph without any zoom, cut edges, or cropping.
 */
export function getCleanOriginalCakeImageUrl(rawUrl?: string | null): string {
  if (
    !rawUrl ||
    typeof rawUrl !== "string" ||
    !rawUrl.trim() ||
    rawUrl.trim() === "null" ||
    rawUrl.trim() === "undefined"
  ) {
    return "/images/ref_belgian_chocolate.png";
  }

  try {
    const trimmed = rawUrl.trim();
    // 1. Unsplash Images: Remove any forced crop, fit, or aspect-ratio parameters
    if (trimmed.includes("images.unsplash.com")) {
      const url = new URL(trimmed);
      url.searchParams.delete("fit");
      url.searchParams.delete("crop");
      url.searchParams.delete("ar");
      url.searchParams.set("auto", "format");
      url.searchParams.set("q", "85");
      return url.toString();
    }

    // 2. ImageKit Images: Remove forced aspect ratio, fit, or crop parameters
    if (trimmed.includes("ik.imagekit.io")) {
      const url = new URL(trimmed);
      if (url.searchParams.has("tr")) {
        const tr = url.searchParams.get("tr") || "";
        const cleanTr = tr
          .split(",")
          .filter((t) => !t.startsWith("ar-") && !t.startsWith("c-") && !t.startsWith("fo-"))
          .join(",");
        if (cleanTr) {
          url.searchParams.set("tr", cleanTr);
        } else {
          url.searchParams.delete("tr");
        }
      }
      return url.toString();
    }

    return trimmed;
  } catch {
    return rawUrl || "/images/ref_belgian_chocolate.png";
  }
}
