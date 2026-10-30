"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";

/*
  Filter buttons for /case-studies: All, the offers, then one per service on
  the cards, in one wrapping row.
  The cards are rendered on the server with data-tags; the buttons only pick
  a tag, and a style rule hides the cards that don't carry it. The choice
  lives in the URL (?tag=sonic-strategy), so other pages can link straight to
  a filtered list. Server render and first paint show every case. A change
  fades the list out, swaps it and fades it back in (blocks.css).
*/
const PARAM = "tag";
const FADE_OUT_MS = 200;
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

const readParam = () => new URLSearchParams(window.location.search).get(PARAM);

function choose(slug: string | null) {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set(PARAM, slug);
  else url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((cb) => cb());
}

type Option = { slug: string; label: string };

export default function CaseFilter({ options, children }: { options: Option[]; children: ReactNode }) {
  const param = useSyncExternalStore(subscribe, readParam, () => null);
  const active = options.some((o) => o.slug === param) ? param : null;
  const [fading, setFading] = useState(false);
  const all: { slug: string | null; label: string }[] = [{ slug: null, label: "All" }, ...options];

  function pick(slug: string | null) {
    if (slug === active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return choose(slug);
    setFading(true);
    window.setTimeout(() => {
      choose(slug);
      setFading(false);
    }, FADE_OUT_MS);
  }

  return (
    <div className={`bk-filtered${fading ? " is-fading" : ""}`}>
      {/* Slugs are [a-z0-9-] (tagSlug), safe inside the selector. */}
      {active && <style>{`.bk-filtered .bk-case-list > li:not([data-tags~="${active}"]) { display: none; }`}</style>}
      <div className="lp-wrap bk-filter" role="group" aria-label="Filter cases">
        {all.map((o) => (
          <button key={o.slug ?? "all"} type="button" className="bk-pill" aria-pressed={active === o.slug} onClick={() => pick(o.slug)}>
            {o.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
