"use client";

import { useCallback, useRef, useState } from "react";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import VideoLightbox from "@/components/VideoLightbox";
import type { ImageTheme } from "@/lib/imageTheme";

export type WorkSpotData = {
  client: string;
  image: string;
  text: string;
  /** Card title; wide spots have none. */
  title?: string;
  tags?: string[];
  vimeoId?: string;
};

/**
 * One spot on the Work page (Figma "Work v02"): the still with the client
 * label and "Play video", and the text box under it with the hover highlight
 * (highlight.css; theme picked from the still by imageTheme.ts).
 *
 * - "wide": full content width, 16:9 still, copy and CTA below.
 * - "card": half width, 4:3 still, title, tags, copy and CTA below.
 *
 * Anywhere on the still or the box opens the video lightbox; the "Play video"
 * button on the still (bottom right) is the keyboard target.
 */
export default function WorkSpot({
  spot,
  theme,
  variant,
  formId,
}: {
  spot: WorkSpotData;
  theme: ImageTheme | null;
  variant: "wide" | "card";
  /** Unique per page: embeds.js animates each highlight visual by it. */
  formId: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);
  const play = () => setOpen(true);

  const accent = theme?.background ?? "var(--_color---accent-color-2)";
  const cover = <button type="button" className="lp-cover bk-cover" aria-hidden="true" tabIndex={-1} onClick={play} />;

  return (
    <article className={`bk-spot is-${variant} hl-row`} style={{ ["--bk-accent" as string]: accent }}>
      <div className="bk-spot-media hl-media">
        <img src={spot.image} alt="" loading="lazy" />
        <p className="bk-spot-client">{spot.client}</p>
        {cover}
        <button ref={buttonRef} type="button" className="bk-spot-play" onClick={play} aria-label={`Play video: ${spot.client}`}>
          <span className="bk-spot-play-text">Play video</span>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path d="M6 4v16l14-8z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div className={`bk-spot-body hl-panel${theme?.lightBackground ? " is-light-highlight" : ""}`}>
        {theme && (
          <div className="hl-visual" aria-hidden="true" style={{ backgroundColor: theme.background, color: theme.line }}>
            <CaseStudyVisual slug={formId} variant={2} speed={10} />
          </div>
        )}
        {spot.title && <h3 className="bk-spot-title">{spot.title}</h3>}
        {spot.tags && spot.tags.length > 0 && (
          <ul className="lp-case-tags" aria-label="Services">
            {spot.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <p className="bk-spot-text">{spot.text}</p>
        {cover}
      </div>
      <VideoLightbox open={open} onClose={close} title={`${spot.client} spot`} vimeoId={spot.vimeoId} poster={spot.image} />
    </article>
  );
}
