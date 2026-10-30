"use client";

import { useSyncExternalStore, type ReactNode } from "react";

/*
  Filter buttons for /case-studies: All, then one per offer that has cases.
  The cards are rendered on the server with data-offers; the buttons only set
  data-filter on the wrapper and blocks.css hides the cards that don't match.
  The choice lives in the URL (?offer=production), so other pages can link
  straight to a filtered list. Server render and first paint show every case.
*/
const PARAM = "offer";
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

  return (
    <div className="bk-filtered" data-filter={active ?? undefined}>
      <div className="lp-wrap bk-filter" role="group" aria-label="Filter cases">
        {[{ slug: null, label: "All" }, ...options].map((o) => (
          <button
            key={o.slug ?? "all"}
            type="button"
            className="bk-pill"
            aria-pressed={active === o.slug}
            onClick={() => choose(o.slug)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
