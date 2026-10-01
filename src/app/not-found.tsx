import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealText from "@/components/RevealText";

export default function NotFound() {
  return (
    <>
      <Header variant="start-top" />
      <div className="utility-page-wrap">
        <div className="utility-page-content">
          <img
            src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg"
            alt=""
            className="icon-1x1-large"
          />
          <div className="spacer-sm-start" />
          <RevealText className="heading-style-h1" text="404 page not found" />
          <div className="spacer-md-start spacer-md-end">
            <p className="copy-medium">The page appears to have been moved or deleted.</p>
          </div>
          <Link href="/" className="button w-button">
            To Homepage
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
