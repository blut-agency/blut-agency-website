import type { ReactNode } from "react";
import Link from "next/link";

/**
 * The wide closing teaser at the bottom of the Story, SPT and Cases pages
 * ("Want to know more…", "Like what you see?"). The Figma board draws all
 * three as the same dark box, so they share one component built from the
 * site's existing page-teaser and CTA-link classes.
 */
export default function PageTeaser({
  intro,
  heading,
  text,
  href,
  ctaLabel = "Read more",
  ariaLabel,
}: {
  /** Optional copy above the heading (the Cases page leads with it). */
  intro?: ReactNode;
  heading: ReactNode;
  /** Optional body copy between heading and CTA. */
  text?: ReactNode;
  href: string;
  ctaLabel?: string;
  ariaLabel: string;
}) {
  return (
    <section className="section-services-cases-teaser">
      <div className="page-teaser-wide-component">
        <div className="page-teaser-wide-background-color is-dark"></div>
        <div className="container-large text-color-bright">
          <div
            data-wf--box-inner-text--variant="is-next-case-study-teaser"
            className="item-inner w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761"
          >
            <div className="item-top w-variant-d9f4f337-c70e-b4e9-7a9a-312292f48761">
              {intro && (
                <>
                  <div className="copy-medium text-color-grey">{intro}</div>
                  <div
                    data-wf--spacer--variant="l"
                    className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                  ></div>
                </>
              )}
              <h2 className="heading-style-h1">{heading}</h2>
              {text && (
                <>
                  <div
                    data-wf--spacer--variant="l"
                    className="spacer-component w-variant-8c123a48-ff1f-5886-993b-c2bccb3f4e38"
                  ></div>
                  <div className="copy-medium text-color-grey">{text}</div>
                </>
              )}
            </div>
            <div className="item-bottom">
              <div data-wf--cta-link--variant="bright-text" className="cta-link-component">
                <Link aria-hidden="true" aria-label={ariaLabel} href={href} className="cta-link-full-cover w-inline-block" />
                <Link aria-label={ariaLabel} href={href} className="cta-link w-inline-block">
                  <div className="cta-link-line"></div>
                  <div className="cta-link-text">{ctaLabel}</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
