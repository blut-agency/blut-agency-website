"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";

function clock(seconds: number) {
  if (!isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

/**
 * Video player for a self-hosted file (the lightbox): one control bar along
 * the bottom with the site's pill Play/Pause button (as on the Work spots),
 * the case pages' progress line and the times. A click anywhere on the
 * picture also plays and pauses. Fills its positioned parent.
 */
export default function FilePlayer({
  src,
  poster,
  title,
  autoPlay = false,
  accent,
}: {
  src: string;
  poster: string;
  title: string;
  autoPlay?: boolean;
  /** Hover colours for the Play/Pause button, from the spot that opened it. */
  accent?: { background: string; text: string };
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(autoPlay);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Start on open; if the browser blocks it, fall back to the Play state.
  useEffect(() => {
    if (!autoPlay) return;
    videoRef.current?.play().catch(() => setWaiting(false));
  }, [autoPlay]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      setWaiting(true);
      video.play().catch(() => setWaiting(false));
    } else {
      video.pause();
    }
  };

  const seek = (event: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = event.currentTarget.getBoundingClientRect();
    video.currentTime = ((event.clientX - rect.left) / rect.width) * duration;
    video.play().catch(() => {});
  };

  return (
    <div className="file-player">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        title={title}
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlaying={() => {
          setPlaying(true);
          setWaiting(false);
        }}
        onPause={() => {
          setPlaying(false);
          setWaiting(false);
        }}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
      />
      <button type="button" className="file-player-cover" aria-hidden="true" tabIndex={-1} onClick={toggle} />
      <div className="file-player-bar">
        <Button
          shape="pill"
          icon={playing || waiting ? "pause" : "play"}
          iconFirst
          onDark
          accent={accent}
          aria-label={playing ? "Pause video" : "Play video"}
          onClick={toggle}
        >
          {playing || waiting ? "Pause" : "Play"}
        </Button>
        <div className="progress-bar file-player-progress" onClick={seek}>
          <div className="progress-bar-line" />
          <div className="progress-bar-fill" style={{ left: `${duration ? (time / duration) * 100 : 0}%` }} />
        </div>
        <div className="file-player-time copy-small">
          {clock(time)} / {clock(duration)}
        </div>
      </div>
    </div>
  );
}
