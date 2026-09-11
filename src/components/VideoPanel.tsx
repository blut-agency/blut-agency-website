"use client";

import { useCallback, useRef, useState } from "react";
import VideoLightbox from "@/components/VideoLightbox";

/**
 * Media half of a Story row: the still covers the whole grid cell. Hover zooms
 * it and fades in "Play Video" bottom-right (same styles as VideoSpot); a click
 * opens the video lightbox.
 */
export default function VideoPanel({ title, image, vimeoId }: { title: string; image: string; vimeoId?: string }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="video-panel video-hover">
      <img src={image} alt="" loading="lazy" className="fit-cover-absolute video-spot-image" />
      <div className="video-spot-scrim" />
      <div className="video-spot-play copy-medium" aria-hidden="true">
        Play Video
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 5v14l11-7z" fill="currentColor" />
        </svg>
      </div>
      <button
        ref={buttonRef}
        type="button"
        className="video-spot-button"
        aria-label={`Play video: ${title}`}
        onClick={() => setOpen(true)}
      />
      <VideoLightbox open={open} onClose={close} title={`${title} spot`} vimeoId={vimeoId} poster={image} />
    </div>
  );
}
