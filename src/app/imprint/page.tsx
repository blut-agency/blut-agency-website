import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";

export const metadata: Metadata = {
  title: "Imprint",
};

export default function ImprintPage() {
  return (
    <>
      <Header variant="start-top" />
      <main className="main-wrapper lp-page bk-legacy">
        <section>
          <div className="page-padding">
            <div className="container-medium">
              <div
                data-wf--spacer--variant="xxl"
                className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
              />
              <div className="rich-text-custom w-richtext legal-text">
                <h1>Imprint</h1>
                <h4>Angaben gemäß § 5 DDG</h4>
                <p>
                  BLUT GmbH
                  <br />
                  Poolstraße 42
                  <br />
                  20355 Hamburg
                </p>
                <h4>Vertreten durch</h4>
                <p>Timo Blunck</p>
                <h4>Kontakt</h4>
                <p>
                  Timo Blunck: +49 151 58884464
                  <br />
                  Michael Robb: +49 177 6233941
                  <br />
                  E-Mail: <a href="mailto:contact@blut.agency">contact@blut.agency</a>
                </p>
                <h4>Registereintrag</h4>
                <p>
                  Registergericht: Amtsgericht Hamburg
                  <br />
                  Registernummer: HRB 138213
                </p>
                <h4>Umsatzsteuer-ID</h4>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: DE301604095</p>
                <h4>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h4>
                <p>
                  Timo Blunck
                  <br />
                  Poolstraße 42
                  <br />
                  20355 Hamburg
                </p>
                <h4>Verbraucherstreitbeilegung</h4>
                <p>Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                <h4>Konzept &amp; Design</h4>
                <p>
                  <a href="http://gudbergnerger.com" target="_blank" rel="noopener noreferrer">
                    GUDBERG{"\u00a0"}NERGER
                  </a>
                </p>
                <h4>Webdesign</h4>
                <p>Nicolas Blunck</p>
              </div>
              <div
                data-wf--spacer--variant="xxl"
                className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
              />
            </div>
          </div>
        </section>
        <LandingFooter />
      </main>
    </>
  );
}
