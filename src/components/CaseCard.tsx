import Link from "next/link";
import CaseStudyVisual, { patternAt } from "@/components/CaseStudyVisual";
import HoverClip from "@/components/HoverClip";
import { CtaLink } from "@/components/Blocks";
import type { CaseStudy } from "@/lib/content";
import type { ImageTheme } from "@/lib/imageTheme";

/** The items of a CMS rich-text list, as plain text, without "coming soon" placeholders. */
export function listItems(html: string): string[] {
  return [...html.matchAll(/<li[^>]*>(.*?)<\/li>/g)]
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim(),
    )
    .filter((tag) => tag && !/coming soon/i.test(tag));
}

/** The case's services from its "What we did" list. */
export function caseTags(cs: CaseStudy): string[] {
  return listItems(cs.whatWeDidHtml);
}

/**
 * Case teaser card (landing "Check out some more", /case-studies): photo with
 * the client label, then campaign, services and "Read more" over the case's
 * highlight on hover. Styles: landing.css (.lp-case) and highlight.css.
 */
export default function CaseCard({ cs, theme, formPrefix }: { cs: CaseStudy; theme: ImageTheme | null; formPrefix: string }) {
  const href = `/project/${cs.slug}`;
  // Shape and tempo by the case's place in the list, so neighbours differ.
  const pattern = patternAt(cs.position - 1);
  const accent = theme?.background ?? "var(--_color---accent-color-2)";
  const tags = caseTags(cs);
  return (
    <article className="lp-case lp-hover hl-row" style={{ ["--lp-case-accent" as string]: accent }}>
      <div className="lp-case-media hl-media">
        <img src={cs.thumbnail} alt="" loading="lazy" />
        {(cs.previewUrl || cs.previewVimeoId) && <HoverClip src={cs.previewUrl} vimeoId={cs.previewVimeoId} />}
        <p className="lp-case-client">{cs.teaserClient}</p>
      </div>
      <div className={`lp-case-body hl-panel${theme?.lightBackground ? " is-light-highlight" : ""}`}>
        <div
          className="lp-case-visual"
          aria-hidden="true"
          style={theme ? { backgroundColor: theme.background, color: theme.line } : undefined}
        >
          <CaseStudyVisual slug={`${formPrefix}-${cs.slug}`} {...pattern} />
        </div>
        <h3 className="lp-case-title">{cs.teaserCampaign}</h3>
        {tags.length > 0 && (
          <ul className="lp-case-tags" aria-label="Services">
            {tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
        <CtaLink href={href} label="Read more" />
      </div>
      <Link href={href} className="lp-cover" aria-hidden="true" tabIndex={-1} />
    </article>
  );
}
