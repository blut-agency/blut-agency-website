"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import VideoLightbox from "@/components/VideoLightbox";

/*
  First-visit welcome (call with Elliot, 10 Nov 2026): a small card slides in
  at the bottom right with a silent loop of the recap, "It's been a minute".
  "Watch" opens the full recap with sound in the video lightbox.

  It shows once per browser. Closing it or watching the recap stores a flag
  in localStorage (no cookie, nothing that identifies the visitor). Links
  with ?from=linkedin skip it and store the flag too, because people coming
  from the LinkedIn post have already seen the video.
*/

const RECAP = {
  title: "blut recap",
  /** Full recap, web version (H.264, about 30 MB). */
  video: "/media/blut-recap-web.mp4",
  /** Silent loop for the card (a few seconds, small). */
  teaser: "/media/blut-recap-teaser.mp4",
  poster: "/images/welcome/blut-recap-poster.jpg",
};

const SEEN_KEY = "blut-welcome-seen";
const SKIP_PARAM = { name: "from", value: "linkedin" };
const DELAY_MS = 2000;

function readSeen() {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function storeSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage blocked (private mode): the card may show again next visit.
  }
}

export default function WelcomeRecap() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get(SKIP_PARAM.name) === SKIP_PARAM.value) {
      storeSeen();
      return;
    }
    if (readSeen()) return;
    const timer = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    storeSeen();
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 400);
  }, []);

  const watch = () => {
    storeSeen();
    setWatching(true);
  };

  const closeVideo = useCallback(() => {
    setWatching(false);
    dismiss();
  }, [dismiss]);

  if (!visible) return null;

  return (
    <>
      <aside className={`bk-welcome${leaving ? " is-leaving" : ""}`} aria-label="Welcome">
        <button type="button" className="bk-welcome-media" onClick={watch} aria-label="Watch the recap">
          <video src={RECAP.teaser} poster={RECAP.poster} autoPlay muted loop playsInline aria-hidden="true" />
        </button>
        <div className="bk-welcome-body">
          <p className="bk-welcome-title ai-draft">It&rsquo;s been a minute.</p>
          <p className="bk-welcome-copy ai-draft">Here&rsquo;s what we&rsquo;ve been up to.</p>
          <Button size="sm" icon="play" iconFirst onDark onClick={watch}>
            Watch
          </Button>
        </div>
        <button type="button" className="bk-burger is-open bk-welcome-close" aria-label="Close" onClick={dismiss}>
          <span />
          <span />
        </button>
      </aside>
      <VideoLightbox open={watching} onClose={closeVideo} title={RECAP.title} videoUrl={RECAP.video} poster={RECAP.poster} />
    </>
  );
}
