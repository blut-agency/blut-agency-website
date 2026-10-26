"use client";

import { useCallback, useRef, useState } from "react";
import CaseStudyVisual from "@/components/CaseStudyVisual";
import VideoLightbox from "@/components/VideoLightbox";
import HoverClip from "@/components/HoverClip";
import { PlayerSpinnerButtons, vimeoSrc } from "@/components/MediaFrame";
import { CtaLink } from "@/components/Blocks";
import Button from "@/components/Button";
import type { ImageTheme } from "@/lib/imageTheme";

export type WorkSpotData = {
  client: string;
  image: string;
  text: string;
  /** Card title; wide spots have none. */
  title?: string;
  tags?: string[];
  vimeoId?: string;
  /** Self-hosted mp4, played in the lightbox when there is no Vimeo ID. */
  videoUrl?: string;
  /** Short silent loop that plays over the still while the spot is hovered. */
  preview?: string;
  /** Slug of the case study that belongs to this spot: adds "— See case". */
  caseSlug?: string;
};

/**
 * One spot on the Work page (Figma "Work v02"): the still with the client
 * label and "Play video", and the text box under it with the hover highlight
 * (highlight.css; theme picked from the still by imageTheme.ts).
 *
 * - "wide": full content width, 16:9 still, copy and CTA below.
 * - "card": half width, 4:3 still, title, tags, copy and CTA below.
 * - "row": still in two thirds (client chip on it), text box in the last
 *   third, sides alternating via `flipped` (Work, Figma 264:1110).
 *
 * Video: "Play video ▶" on the still. With a Vimeo ID the spot plays right
 * there with the case pages' player (progress bar and times, driven by
 * public/js/embeds.js); without one, Play (or a click anywhere on the still or
 * box) opens the lightbox.
 */
export default function WorkSpot({
  spot,
  theme,
  variant,
  flipped = false,
  formId,
}: {
  spot: WorkSpotData;
  theme: ImageTheme | null;
  /** "row": still in two thirds, text box (with the client as its title) in one third. */
  variant: "wide" | "card" | "row";
  /** Row only: text box on the left, still on the right. */
  flipped?: boolean;
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
  // Buttons on the spot take its highlight colour on hover, like the chip.
  const buttonAccent = {
    background: accent,
    text: theme && !theme.lightBackground ? "var(--_color---copy-bright)" : "var(--_color---copy-dark)",
  };
  // With a Vimeo ID the spot plays inline with the case pages' player
  // (embeds.js); without one, the big Play opens the lightbox.
  const inline = Boolean(spot.vimeoId);
  const playerId = `${formId}-video`;
  const cover = inline ? null : (
    <button type="button" className="lp-cover bk-cover" aria-hidden="true" tabIndex={-1} onClick={play} />
  );

  return (
    <article
      className={`bk-spot is-${variant}${flipped ? " is-flipped" : ""} hl-row`}
      style={{ ["--bk-accent" as string]: accent }}
    >
      <div className="bk-spot-media hl-media">
        <img src={spot.image} alt="" loading="lazy" />
        {spot.preview && <HoverClip src={spot.preview} />}
        <p className="bk-spot-client">{spot.client}</p>
        {inline ? (
          <>
            <iframe
              id={playerId}
              title={`${spot.client} spot`}
              src={vimeoSrc(spot.vimeoId!)}
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              className="bk-spot-iframe"
            />
            <Button
              shape="pill"
              icon="play"
              iconFirst
              onDark
              accent={buttonAccent}
              data-player="play-button-big"
              data-player-target={playerId}
              aria-label={`Play and pause: ${spot.client}`}
              className="bk-spot-play"
            >
              <span data-player="play-text">Play video</span>
            </Button>
            <div className="project-video-controls bk-spot-controls">
              <div data-player-file={playerId} className="audioplayer-controls">
                <div data-player="progress-bar" className="progress-bar">
                  <div className="progress-bar-line" />
                  <div data-player="progress-fill" className="progress-bar-fill" />
                </div>
                <div className="progress-time">
                  <div data-player="current-time" className="current-time">
                    0:00
                  </div>
                  <div data-player="duration" className="duration">
                    0:00
                  </div>
                </div>
                <PlayerSpinnerButtons size="copy-medium" />
              </div>
            </div>
          </>
        ) : (
          <>
            {cover}
            <Button
              ref={buttonRef}
              shape="pill"
              icon="play"
              iconFirst
              onDark
              accent={buttonAccent}
              className="bk-spot-play"
              onClick={play}
              aria-label={`Play video: ${spot.client}`}
            >
              Play video
            </Button>
          </>
        )}
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
        {spot.caseSlug && (
          <div className="bk-spot-case">
            <CtaLink href={`/project/${spot.caseSlug}`} label="See case" />
          </div>
        )}
        {cover}
      </div>
      {!inline && (
        <VideoLightbox
          open={open}
          onClose={close}
          title={`${spot.client} spot`}
          vimeoId={spot.vimeoId}
          videoUrl={spot.videoUrl}
          poster={spot.image}
          accent={buttonAccent}
        />
      )}
    </article>
  );
}
