import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import { getPage } from "@/lib/pages";

const page = getPage("imprintPage");

export const metadata: Metadata = { title: page.seo.title };

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
              <div className="rich-text-custom w-richtext legal-text" dangerouslySetInnerHTML={{ __html: page.body }} />
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
