"use client";

import { useEffect, useRef, useState } from "react";
import { vimeoSrc } from "@/components/MediaFrame";

type VimeoPlayer = { play: () => Promise<void>; pause: () => Promise<void>; setCurrentTime: (t: number) => Promise<number> };
declare global {
  interface Window {
    Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayer };
  }
}

const canPreview = () => window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

/**
 * Short silent loop over a spot's still (Work cards, Home rows): plays while
 * the surrounding card (`.hl-row`) is hovered, or on touch screens while it is
 * the centred card (CenterHover's centerenter / centerleave); fades in once it
 * is playing and resets on leave. Loads nothing until then; stays off with
 * reduced motion. Styles: blocks.css (.bk-spot-preview).
 *
 * `src` is a video file; `vimeoId` a Vimeo video, embedded in background mode
 * (muted, looping, no controls) on the first hover, like the case pages' loops.
 */
export default function HoverClip({ src, vimeoId }: { src?: string; vimeoId?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<VimeoPlayer | null>(null);
  const [embed, setEmbed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cover, setCover] = useState<{ width: number; height: number } | null>(null);
  const hovered = useRef(false);

  useEffect(() => {
    const spot = (ref.current ?? anchorRef.current)?.closest(".hl-row");
    if (!spot) return;
    const start = () => {
      if (!canPreview()) return;
      if (ref.current) {
        ref.current.play().catch(() => {});
      } else if (vimeoId) {
        hovered.current = true;
        setEmbed(true);
        // Already loaded: show it again; otherwise onLoad shows it.
        if (playerRef.current) {
          setVisible(true);
          playerRef.current.play().catch(() => {});
        }
      }
    };
    const stop = () => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      } else if (vimeoId) {
        hovered.current = false;
        setVisible(false);
        playerRef.current?.pause().catch(() => {});
        playerRef.current?.setCurrentTime(0).catch(() => {});
      }
    };
    const events: [string, () => void][] = [
      ["mouseenter", start],
      ["mouseleave", stop],
      ["centerenter", start],
      ["centerleave", stop],
    ];
    events.forEach(([name, fn]) => spot.addEventListener(name, fn));
    return () => events.forEach(([name, fn]) => spot.removeEventListener(name, fn));
  }, [vimeoId]);

  // The 16:9 iframe can't object-fit: size it to cover the media box.
  useEffect(() => {
    const box = frameRef.current?.parentElement;
    if (!embed || !box) return;
    const fit = () => {
      const { width, height } = box.getBoundingClientRect();
      setCover({ width: Math.max(width, (height * 16) / 9), height: Math.max(height, (width * 9) / 16) });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [embed]);

  if (vimeoId) {
    return (
      <>
        <span ref={anchorRef} hidden />
        {embed && (
          <iframe
            ref={frameRef}
            className={`bk-spot-preview${visible ? " is-playing" : ""}`}
            src={vimeoSrc(vimeoId, "background=1&dnt=1")}
            title=""
            aria-hidden="true"
            tabIndex={-1}
            allow="autoplay"
            style={cover ?? undefined}
            onLoad={() => {
              if (frameRef.current && window.Vimeo && !playerRef.current) {
                playerRef.current = new window.Vimeo.Player(frameRef.current);
              }
              setVisible(hovered.current);
              if (!hovered.current) playerRef.current?.pause().catch(() => {});
            }}
          />
        )}
      </>
    );
  }

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
