"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/Button";
import VideoLightbox from "@/components/VideoLightbox";
import { getSite } from "@/lib/site";

/*
  First-visit welcome (call with Elliot, 10 Nov 2026): a small card slides in
  at the bottom right with a silent loop of the recap, "It's been a minute".
  "Watch" opens the full recap with sound in the video lightbox.

  Closing it or watching the recap stores a flag in localStorage (no cookie,
  nothing that identifies the visitor), so it doesn't come back. The flag is
  stored only on that action, never on display (privacy policy, section 4).
  Links with ?from=linkedin skip it for that visit and store nothing: people
  coming from the LinkedIn post have just seen the video. Links with
  ?recap=1 always show it, even to visitors who closed it before.
*/

/** Words and files from Sanity (Shared texts → Welcome card) via site.json: the full recap (web H.264), the card's silent loop and the still. */
const RECAP = getSite().welcome;

const SEEN_KEY = "blut-welcome-seen";
const SKIP_PARAM = { name: "from", value: "linkedin" };
/** Shows the card on every visit, even after it was closed (for sharing). */
const SHOW_PARAM = { name: "recap", value: "1" };
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
    // LinkedIn visitors skip it on this visit only; nothing is stored.
    if (params.get(SKIP_PARAM.name) === SKIP_PARAM.value) return;
    const forced = params.get(SHOW_PARAM.name) === SHOW_PARAM.value;
    if (!forced && readSeen()) return;
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
          {/* One two-tone text at one size and line height (Nic, 11 Nov). */}
          <p className="bk-welcome-text">
            <span className="bk-welcome-title">{RECAP.title}</span>{" "}
            <span className="bk-welcome-copy">{RECAP.text}</span>
          </p>
          {/* The pill play button of the site's videos. */}
          <Button shape="pill" icon="play" iconFirst onDark onClick={watch}>
            {RECAP.button}
          </Button>
        </div>
        <button type="button" className="bk-burger is-open bk-welcome-close" aria-label="Close" onClick={dismiss}>
          <span />
          <span />
        </button>
      </aside>
      <VideoLightbox open={watching} onClose={closeVideo} title="blut recap" videoUrl={RECAP.video} poster={RECAP.poster} />
    </>
  );
}
