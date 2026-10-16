import Link from "next/link";
import CaseStudyVisual, { visualVariant } from "@/components/CaseStudyVisual";
import type { CaseRow } from "./caseRows";

// Morph durations the case index has always used, keyed by visual variant.
const SPEED: Record<number, number> = { 1: 8, 2: 10, 3: 10 };

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

/*
  One dark case row: the case's gradient panel (1/3: client, title, optional
  result line, tag pills, "Read more") and its thumbnail (2/3). Used by the
  Cases list and by Home's "Selected cases". Styles: cases.css (.cs-case-*),
  which applies under .cs-page or a .cs-rows wrapper.
*/
export default function CaseRowItem({
  c,
  hidden,
  titleAs: Title = "h2",
  visualPrefix = "cases",
}: {
  c: CaseRow;
  hidden?: boolean;
  titleAs?: "h2" | "h3";
  /** Keeps the embeds.js visual ids unique per page. */
  visualPrefix?: string;
}) {
  const variant = visualVariant(c.useVisual);
  return (
    <article role="listitem" className="gl-row is-dark cs-case cta-panel" hidden={hidden}>
      <div className="gl-col cs-case-grid">
        <div className="cs-case-copy" style={{ backgroundColor: c.panel, color: c.text }}>
          <div className="case-study-teaser-visual cs-case-visual" style={{ color: c.line }} aria-hidden="true">
            <CaseStudyVisual
              slug={`${visualPrefix}-${c.slug}`}
              variant={variant}
              speed={SPEED[variant]}
              visualizationJson={c.visualizationJson}
            />
          </div>
          <div className="cs-case-top">
            <p className="cs-case-client">{c.client}</p>
            <Title className="cs-case-title">{c.campaign}</Title>
            {c.result && <p className="cs-case-result">{c.result}</p>}
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
  );
}
