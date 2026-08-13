import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Imprint",
};

export default function ImprintPage() {
  return (
    <>
      <Header variant="start-top" />
      <main className="main-wrapper">
        <section>
          <div className="page-padding">
            <div className="container-medium">
              <div
                data-wf--spacer--variant="xxl"
                className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
              />
              <div className="rich-text-custom w-richtext">
                <h1>Imprint</h1>
                <p>‍</p>
                <h4>Angaben gemäß § 5 TMG</h4>
                <p>
                  BLUT GmbH
                  <br />
                  Poolstrasse 42
                  <br />
                  20355 Hamburg
                  <br />
                  Handelsregister: HRB 138213 <br />
                  Registergericht: Amtsgericht Hamburg
                </p>
                <p>‍</p>
                <h4>Vertreten durch:</h4>
                <p>Timo Blunck</p>
                <p>‍</p>
                <h4>Kontakt</h4>
                <p>Telefon: </p>
                <p>Timo Blunck: ‭+49 151 58884464‬</p>
                <p>Michael Robb: +49 177 6233941</p>
                <p>
                  ‍
                  <br />
                  E-Mail: <a href="mailto:contact@blut.agency">contact@blut.agency</a>
                </p>
                <p>‍</p>
                <h4>Umsatzsteuer-ID</h4>
                <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:{"\u00a0\u2028"}DE301604095</p>
                <p>‍</p>
                <h4>Redaktionell verantwortlich</h4>
                <p>
                  Timo Blunck{"\u2028"}
                  <br />
                  Poolstrasse 42
                  <br />
                  20355 Hamburg
                </p>
                <p>‍</p>
                <h4>Konzept &amp; Design</h4>
                <p>
                  <a href="http://gudbergnerger.com" target="_blank" rel="noopener noreferrer">
                    GUDBERG{"\u00a0"}NERGER
                  </a>
                </p>
                <p>‍</p>
                <h4>EU-Streitschlichtung</h4>
                <p>
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{"\u00a0\u2028"}
                  https://ec.europa.eu/consumers/odr/.{"\u2028"}
                  Unsere E-Mail-Adresse finden Sie oben im Impressum.
                </p>
                <p>‍</p>
                <h4>Verbraucherstreitbeilegung/­Universalschlichtungsstelle</h4>
                <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                <p>‍</p>
                <p>
                  Quelle:
                  <br />
                  https://www.e-recht24.de/impressum-generator.html
                </p>
              </div>
              <div
                data-wf--spacer--variant="xxl"
                className="spacer-component w-variant-f176b2ee-826a-f858-3f7a-82a98e21da6b"
              />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
