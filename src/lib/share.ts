import type { Metadata } from "next";

/** The default link preview: the red blut wordmark (1800×945). */
export const SHARE_IMAGE = { url: "/images/open-graph-image-3.png", width: 1800, height: 945, alt: "blut – colorful audio" };

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
