import Link from "next/link";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import RevealText from "@/components/RevealText";
import { getSite } from "@/lib/site";

/** Words from Sanity (Shared texts → Page not found) via site.json. */
const TEXT = getSite().notFound;

export default function NotFound() {
  return (
    <>
      <Header variant="start-top" />
      <div className="utility-page-wrap">
        <div className="utility-page-content">
          <img
            src="/images/webflow/page-not-found.211a85e40c.svg"
            alt=""
            className="icon-1x1-large"
          />
          <div className="spacer-sm-start" />
          <RevealText className="heading-style-h1" text={TEXT.heading} />
          <div className="spacer-md-start spacer-md-end">
            <p className="copy-medium">{TEXT.text}</p>
          </div>
          <Link href="/" className="button w-button">
            {TEXT.button}
          </Link>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
