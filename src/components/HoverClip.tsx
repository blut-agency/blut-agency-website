"use client";

import { useEffect, useRef } from "react";

/**
 * Short silent loop over a spot's still (Work cards, Home rows): plays while
 * the surrounding `.bk-spot` is hovered, fades in once it is playing and
 * resets on leave. Loads nothing until the first hover; stays off on touch
 * screens and with reduced motion. Styles: blocks.css (.bk-spot-preview).
 */
export default function HoverClip({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    const spot = video?.closest(".bk-spot");
    if (!video || !spot) return;
    const start = () => {
      if (!window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
      video.play().catch(() => {});
    };
    const stop = () => {
      video.pause();
      video.currentTime = 0;
    };
    spot.addEventListener("mouseenter", start);
    spot.addEventListener("mouseleave", stop);
    return () => {
      spot.removeEventListener("mouseenter", start);
      spot.removeEventListener("mouseleave", stop);
    };
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
