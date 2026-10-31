"use client";

import { useCallback, useRef, useState } from "react";
import Button from "@/components/Button";
import VideoLightbox from "@/components/VideoLightbox";
import { vimeoSrc } from "@/components/MediaFrame";

/**
 * A case page video in the Production spot layout: the paused video as its
 * own still (Vimeo's frame, or the file's poster), "▶ Play video" centred on
 * it, and a click anywhere on it opens the same lightbox as the spots
 * (WorkSpot). Focus goes back to the button when the lightbox closes.
 */
export default function CaseVideo({
  label,
  vimeoId,
  videoUrl,
  poster,
  accent,
}: {
  label: string;
  vimeoId?: string;
  videoUrl?: string;
  /** Still for the frame (files) and the lightbox while it loads. */
  poster: string;
  accent?: { background: string; text: string };
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <article className="bk-spot is-wide">
      <div className="bk-spot-media">
        {vimeoId ? (
          <iframe title={label} src={vimeoSrc(vimeoId)} frameBorder="0" tabIndex={-1} aria-hidden="true" className="bk-spot-iframe" />
        ) : (
          <img src={poster} alt="" loading="lazy" />
        )}
        <button type="button" className="lp-cover bk-cover" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(true)} />
        <Button
          ref={buttonRef}
          shape="pill"
          icon="play"
          iconFirst
          onDark
          accent={accent}
          className="bk-spot-play"
          onClick={() => setOpen(true)}
          aria-label={`Play video: ${label}`}
        >
          Play video
        </Button>
      </div>
      <VideoLightbox open={open} onClose={close} title={label} vimeoId={vimeoId} videoUrl={videoUrl} poster={poster} accent={accent} />
    </article>
  );
}
