"use client";

import { useSyncExternalStore } from "react";
import { DISCIPLINES, disciplineSlug, type Discipline } from "./disciplines";
import CaseRowItem from "./CaseRowItem";
import type { CaseRow } from "./caseRows";

export type { CaseRow };

/*
  The active filter lives in the URL (?discipline=content-production), so other
  pages can link straight to a filtered list. useSyncExternalStore reads it
  after hydration: the server and first paint always show every case.
*/
const PARAM = "discipline";
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

function readFilter(): Discipline | null {
  const slug = new URLSearchParams(window.location.search).get(PARAM);
  return DISCIPLINES.find((d) => disciplineSlug(d) === slug) ?? null;
}

function setFilter(d: Discipline | null) {
  const url = new URL(window.location.href);
  if (d) url.searchParams.set(PARAM, disciplineSlug(d));
  else url.searchParams.delete(PARAM);
  window.history.replaceState(window.history.state, "", url);
  listeners.forEach((cb) => cb());
}

export default function CaseList({ cases }: { cases: CaseRow[] }) {
  const active = useSyncExternalStore(subscribe, readFilter, () => null);
  const shown = cases.filter((c) => !active || c.disciplines.includes(active)).length;
  const options: (Discipline | null)[] = [null, ...DISCIPLINES];

  return (
    <>
      {/* Filter: one pill per discipline; the active one is filled. */}
      <div className="gl-row is-dark cs-filter-row">
        <div className="gl-col cs-filter" role="group" aria-label="Filter cases by discipline">
          {options.map((d) => (
            <button
              key={d ?? "all"}
              type="button"
              className="cs-pill cs-pill--filter"
              aria-pressed={active === d}
              onClick={() => setFilter(d)}
            >
              {d ?? "All"}
            </button>
          ))}
          <p className="visually-hidden" aria-live="polite">
            {shown} of {cases.length} cases shown
          </p>
        </div>
      </div>

      {/* Rows stay in the DOM when filtered out (hidden), so the animated
          textures that embeds.js attached on load keep running. */}
      <div className="cs-cases" role="list">
        {cases.map((c) => (
          <CaseRowItem key={c.slug} c={c} hidden={!!active && !c.disciplines.includes(active)} />
        ))}
      </div>
    </>
  );
}
