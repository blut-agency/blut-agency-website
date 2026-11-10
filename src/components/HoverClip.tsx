"use client";

import { useEffect, useRef } from "react";

const canPreview = () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

/**
 * Short silent loop over a spot's still (Work cards, Home rows): plays while
 * the surrounding card (`.hl-row`) is hovered, or on touch screens while it is
 * the centred card (CenterHover's centerenter / centerleave); fades in once it
 * is playing and resets on leave. Loads nothing until then; stays off with
 * reduced motion. Styles: blocks.css (.bk-spot-preview).
 */
export default function HoverClip({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const spot = video?.closest(".hl-row");
    if (!video || !spot) return;
    const start = () => {
      if (canPreview()) video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };
    const events: [string, () => void][] = [
      ["mouseenter", start],
      ["mouseleave", stop],
      ["centerenter", start],
      ["centerleave", stop],
    ];
    events.forEach(([name, fn]) => spot.addEventListener(name, fn));
    return () => events.forEach(([name, fn]) => spot.removeEventListener(name, fn));
  }, []);

  return (
    <video
      ref={ref}
      className="bk-spot-preview"
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      onPlaying={(e) => e.currentTarget.classList.add("is-playing")}
      onPause={(e) => e.currentTarget.classList.remove("is-playing")}
    />
  );
}
