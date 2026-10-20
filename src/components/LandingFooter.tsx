import Link from "next/link";
import LogoBand, { type BandColors } from "@/components/LogoBand";

/**
 * Site footer: the blut logo band (it appears here and nowhere else) in the
 * page header's colours, then black with contact · legal · social in three
 * columns.
 */
export default function LandingFooter({ band }: { band?: BandColors }) {
  return (
    <>
      <LogoBand theme="brown-yellow" colors={band} />
      <footer id="footer" className="lp-footer">
        <div className="lp-wrap">
          <ul role="list" className="lp-footer-list">
            <li>blut.agency</li>
            <li>
              <a href="mailto:contact@blut.agency">contact@blut.agency</a>
            </li>
            <li>Timo Blunck: +49 151 58884464</li>
            <li>Michael Robb: +49 177 6233941</li>
            <li>
              Poolstraße 42
              <br />
              20355 Hamburg
            </li>
          </ul>
          <ul role="list" className="lp-footer-list">
            <li>
              <Link href="/imprint">Imprint</Link>
            </li>
            <li>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </li>
          </ul>
          <ul role="list" className="lp-footer-list">
            <li>
              <a
                href="https://www.instagram.com/blut.agency/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/blut-gmbh/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
