"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Full-screen video player: the video fills the available space at 16:9,
 * with a close button top-right. Escape or a click on the backdrop closes it
 * and page scrolling is locked while it is open. The opener moves focus back
 * to itself in onClose (a clicked button isn't focused in every browser).
 *
 * Rendered into <body> so it sits above the header and the page transition
 * wrapper. Without a Vimeo ID it shows the still with "Video coming soon".
 */
export default function VideoLightbox({
  open,
  onClose,
  title,
  vimeoId,
  poster,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  vimeoId?: string;
  poster: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="video-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <button ref={closeRef} type="button" className="video-lightbox-close" aria-label="Close video" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <div className="video-lightbox-frame" onClick={(event) => event.stopPropagation()}>
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&dnt=1`}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img src={poster} alt="" className="fit-cover-absolute" />
            <div className="video-lightbox-status copy-medium">Video coming soon</div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
