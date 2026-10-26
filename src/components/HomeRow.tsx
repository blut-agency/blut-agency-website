import Link from "next/link";
import CaseStudyVisual, { patternAt } from "@/components/CaseStudyVisual";
import HoverClip from "@/components/HoverClip";
import { CtaLink } from "@/components/Blocks";
import type { ImageTheme } from "@/lib/imageTheme";

export type HomeRowData = {
  copy: string;
  href: string;
  cta: string;
  image: string;
  alt: string;
  /** Short silent loop that plays over the photo on hover: a video file, or a Vimeo ID. */
  preview?: string;
  previewVimeoId?: string;
};

/**
 * A Home row (Figma 267-1107): photo and black text box side by side, 50/50,
 * the question at the top of the box and its link at the bottom; `flipped`
 * swaps the sides. Styles: blocks.css (.bk-spot.is-split) and highlight.css.
 */
export default function HomeRow({
  row,
  theme,
  flipped = false,
  pattern = 0,
}: {
  row: HomeRowData;
  theme: ImageTheme | null;
  flipped?: boolean;
  /** Position in the list: picks the highlight's shape and tempo. */
  pattern?: number;
}) {
  return (
    <article className={`bk-spot is-split${flipped ? " is-flipped" : ""} lp-hover hl-row`}>
      <div className="bk-spot-media hl-media">
        <img src={row.image} alt={row.alt} loading="lazy" />
        {(row.preview || row.previewVimeoId) && <HoverClip src={row.preview} vimeoId={row.previewVimeoId} />}
        <Link href={row.href} className="lp-cover" aria-hidden="true" tabIndex={-1} />
      </div>
      <div className={`bk-spot-body hl-panel${theme?.lightBackground ? " is-light-highlight" : ""}`}>
        {theme && (
          <div className="hl-visual" aria-hidden="true" style={{ backgroundColor: theme.background, color: theme.line }}>
            <CaseStudyVisual slug={`home-row-${row.href.slice(1)}`} {...patternAt(pattern)} />
          </div>
        )}
        <p className="lp-copy">{row.copy}</p>
        <CtaLink href={row.href} label={row.cta} />
        <Link href={row.href} className="lp-cover" aria-hidden="true" tabIndex={-1} />
      </div>
    </article>
  );
}
