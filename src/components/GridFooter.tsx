import Link from "next/link";

/** Footer for the grid layout: black, three columns divided by the grid lines, no giant logo. */
export default function GridFooter() {
  return (
    <footer id="footer" className="gl-footer">
      <div className="gl-col gl-footer-cols">
        <ul role="list" className="gl-footer-list">
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
        <ul role="list" className="gl-footer-list">
          <li>
            <Link href="/imprint">Imprint</Link>
          </li>
          <li>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </li>
        </ul>
        <ul role="list" className="gl-footer-list">
          <li>
            <a href="https://www.instagram.com/blut.agency/" target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/company/blut-gmbh/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
