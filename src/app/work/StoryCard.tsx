"use client";

import { useRef } from "react";
import VideoPanel from "@/components/VideoPanel";

export type Spot = {
  client: string;
  text: string;
  image: string;
  /** Vimeo ID or direct video file. Empty: the poster opens "Video coming soon". */
  vimeoId?: string;
  videoUrl?: string;
  hidden?: boolean;
};

/**
 * One video card on the Work page: 16:9 still poster (the shared VideoPanel:
 * a button labelled "Play video: <client>" that opens the lightbox), then the
 * client name, the full spot text and "—— Play video". The text link opens
 * the same lightbox by pressing the poster's button, so focus returns there
 * on close; it is a mouse shortcut only, keyboards use the poster button.
 */
export default function StoryCard({ spot, wide = false }: { spot: Spot; wide?: boolean }) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const play = () => mediaRef.current?.querySelector<HTMLButtonElement>(".video-spot-button")?.click();

  return (
    <article className={`ws-card${wide ? " is-wide" : ""}`}>
      <div ref={mediaRef} className="ws-card-media">
        <VideoPanel title={spot.client} image={spot.image} vimeoId={spot.vimeoId} videoUrl={spot.videoUrl} />
      </div>
      <div className="ws-card-meta">
        <h3 className="ws-card-title">{spot.client}</h3>
        <p className="ws-card-text">{spot.text}</p>
        <button type="button" className="ws-card-play" tabIndex={-1} aria-hidden="true" onClick={play}>
          <span className="ws-card-play-line" />
          Play video
        </button>
      </div>
    </article>
  );
}
