import type { Metadata } from "next";

/** The default link preview: the blut wordmark on the red homepage banner (1200×630). */
export const SHARE_IMAGE = { url: "/images/share/blut-share.jpg", width: 1200, height: 630, alt: "blut – music strategies with measurable impact" };

/**
 * Link previews (LinkedIn, WhatsApp, Slack, X…) for a page: Open Graph and
 * Twitter tags with the page's own title, description and picture. Next only
 * shallow-merges `openGraph`, so every page sets the whole object through this.
 */
export function share({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  /** A picture of the page's own subject; the wordmark otherwise. */
  image?: { url: string; width?: number; height?: number; alt?: string };
}): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [image ?? SHARE_IMAGE];
  return {
    openGraph: { type: "website", siteName: "blut", locale: "en_US", url: path, title, description, images },
    twitter: { card: "summary_large_image", title, description, images },
  };
}
