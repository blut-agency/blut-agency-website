import Link from "next/link";
import LogoBand, { type BandColors } from "@/components/LogoBand";
import { Fragment } from "react";
import { getSite } from "@/lib/site";

/**
 * Site footer: the blut logo band (it appears here and nowhere else) in the
 * page header's colours, then black with contact · legal · social in three
 * columns.
 */
const SITE = getSite();

export default function LandingFooter({ band }: { band?: BandColors }) {
  return (
    <>
      <LogoBand theme="brown-yellow" colors={band} />
      <footer id="footer" className="lp-footer">
        <div className="lp-wrap">
          <ul role="list" className="lp-footer-list">
            {SITE.footerContact.map((entry) => (
              <li key={entry}>
                {entry === SITE.contactEmail ? (
                  <a href={`mailto:${entry}`}>{entry}</a>
                ) : (
                  entry.split("\n").map((line, i) => (
                    <Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </Fragment>
                  ))
                )}
              </li>
            ))}
          </ul>
          <ul role="list" className="lp-footer-list">
            {SITE.footerLegal.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
          <ul role="list" className="lp-footer-list">
            {SITE.footerSocial.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </>
  );
}
