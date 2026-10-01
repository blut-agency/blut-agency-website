import type { ReactNode } from "react";
import CaseStudyVisual from "@/components/CaseStudyVisual";

/**
 * Coloured statement section with the animated gradient line behind centred
 * copy: the About page's mission-statement hero, reusable in any colours.
 *
 * `form` must be unique on the page, since embeds.js animates each visual by it.
 */
export default function GradientBanner({
  form,
  background,
  line,
  align = "center",
  children,
}: {
  form: string;
  background: string;
  line: string;
  align?: "center" | "right";
  children: ReactNode;
}) {
  return (
    <section
      className={align === "right" ? "section-hero is-right-aligned" : "section-hero"}
      style={{ backgroundColor: background }}
    >
      <div className="section-hero-media-wrapper" style={{ color: line }}>
        <CaseStudyVisual slug={form} variant={3} speed={10} />
      </div>
      <div className="page-padding z-index-1">
        <div className="spacer-xxl-start spacer-xxl-end">
          <div className="hero-content-wrapper">{children}</div>
        </div>
      </div>
    </section>
  );
}
