"use client";

import { useRef, useState } from "react";

function clock(seconds: number) {
  if (!isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

/**
 * The case pages' video player (big "Play", progress bar, times, Play/Pause)
 * for a self-hosted video file. Same classes as the embeds.js-driven Vimeo
 * player, so it looks the same, but React drives it: it can mount after page
 * load, e.g. inside the video lightbox. Fills its positioned parent.
 */
export default function FilePlayer({
  src,
  poster,
  title,
  autoPlay = false,
}: {
  src: string;
  poster: string;
  title: string;
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [waiting, setWaiting] = useState(autoPlay);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlaying={() => {
          setPlaying(true);
          setWaiting(false);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
      />
      <button type="button" className="play-toggle-big" aria-label={playing ? "Pause video" : "Play video"} onClick={toggle}>
        {!playing && !waiting && <div className="text-block">Play</div>}
      </button>
      <div className="project-video-controls file-player-controls">
        <div className="audioplayer-controls">
          <div className="progress-bar" onClick={seek}>
            <div className="progress-bar-line" />
            <div className="progress-bar-fill" style={{ left: `${duration ? (time / duration) * 100 : 0}%` }} />
          </div>
          <div className="progress-time">
            <div className="current-time">{clock(time)}</div>
            <div className="duration">{clock(duration)}</div>
          </div>
          <div className="player-toggle-button">
            <button type="button" className="play-toggle" onClick={toggle}>
              <div className="play-toggle-text copy-medium">{waiting ? "Loading…" : playing ? "Pause" : "Play"}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
