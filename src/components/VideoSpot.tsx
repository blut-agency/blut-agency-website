"use client";

import { useCallback, useRef, useState } from "react";
import RevealText from "@/components/RevealText";
import VideoLightbox from "@/components/VideoLightbox";

/**
 * Full-width spot on the Story page: the still fills the width at 16:9 with
 * the client headline and copy over it, bottom-left. Hovering zooms the still
 * and fades in "Play Video" bottom-right; clicking opens the video lightbox.
 * On small screens the copy sits below the still instead (see globals.css).
 */
export default function VideoSpot({
  client,
  text,
  image,
  vimeoId,
}: {
  client: string;
  text: string;
  image: string;
  vimeoId?: string;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  return (
    <div className="video-spot video-hover">
      <div className="video-spot-media">
        <img src={image} alt="" loading="lazy" className="fit-cover-absolute video-spot-image" />
        <div className="video-spot-scrim" />
      </div>
      {/* Same headline-to-copy spacing as the Story rows (spacing l). */}
      <div className="video-spot-content">
        <RevealText className="heading-style-h1" text={client} />
        <div
          data-wf--spacer--variant="l"
          className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
        ></div>
        <p className="copy-medium">{text}</p>
      </div>
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
        aria-label={`Play video: ${client}`}
        onClick={() => setOpen(true)}
      />
      <VideoLightbox open={open} onClose={close} title={`${client} spot`} vimeoId={vimeoId} poster={image} />
    </div>
  );
}
