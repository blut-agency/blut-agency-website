"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import { DISCIPLINES, disciplineSlug, type Discipline } from "./disciplines";

export type CaseRow = {
  slug: string;
  client: string;
  campaign: string;
  thumbnail: string;
  panel: string;
  line: string;
  text: "#000" | "#fff";
  useVisual: boolean[];
  visualizationJson: string;
  disciplines: Discipline[];
};

// Morph durations the case index has always used, keyed by visual variant.
const SPEED: Record<number, number> = { 1: 8, 2: 10, 3: 10 };

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

/** "— Read more" link, same markup as Home's grid CTAs. */
function ReadMore({ href, label }: { href: string; label: string }) {
  return (
    <div className="cta-link-component gl-cta">
      <Link aria-label={label} href={href} className="cta-link w-inline-block">
        <div className="cta-link-line" />
        <div className="cta-link-text">Read more</div>
      </Link>
    </div>
  );
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
          <article
            role="listitem"
            className="gl-row is-dark cs-case cta-panel"
            key={c.slug}
            hidden={!!active && !c.disciplines.includes(active)}
          >
            <div className="gl-col cs-case-grid">
              <div className="cs-case-copy" style={{ backgroundColor: c.panel, color: c.text }}>
                <div className="case-study-teaser-visual cs-case-visual" style={{ color: c.line }} aria-hidden="true">
                  <CaseStudyVisual
                    slug={`cases-${c.slug}`}
                    variant={visualVariant(c.useVisual)}
                    speed={SPEED[visualVariant(c.useVisual)]}
                    visualizationJson={c.visualizationJson}
                  />
                </div>
                <div className="cs-case-top">
                  <p className="cs-case-client">{c.client}</p>
                  <h2 className="cs-case-title">{c.campaign}</h2>
                  {c.disciplines.length > 0 && (
                    <ul className="cs-tags" aria-label="What we did">
                      {c.disciplines.map((d) => (
                        <li key={d} className="cs-pill cs-pill--tag">
                          {d}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <ReadMore href={`/project/${c.slug}`} label={`Read more: ${c.client}, ${c.campaign}`} />
              </div>
              <div className="cs-case-media">
                <img src={c.thumbnail} alt="" loading="lazy" className="fit-cover-absolute" />
              </div>
              {/* The whole row links to the case; the visible CTA is in the panel. */}
              <Link aria-hidden="true" tabIndex={-1} href={`/project/${c.slug}`} className="cta-link-full-cover w-inline-block" />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
