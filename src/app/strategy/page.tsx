import type { Metadata } from "next";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import WorkSpot from "@/components/WorkSpot";
import { themesForImages } from "@/lib/imageTheme";
import { ContactBlock, CtaLink, Lead, PageHero, ServiceDrawers } from "@/components/Blocks";

export const metadata: Metadata = {
  title: "Strategy – Find out what your sound is really saying | blut",
  description:
    "We assess your existing sonic ecosystem across campaigns, channels, partnerships and experiences, then construct an action plan to get your brand on the right path.",
};

/*
  Strategy in the new design (Work v02 building blocks). The three services in
  the board's order: Sonic Strategy, Content Production, Performance &
  Measurement, each as ServiceDrawers (Figma 250:1130): name, question and
  intro on top, the three tools as drawers beside a static photo. Copy is the
  old page's, unchanged.
*/

const SALES_VIDEO = "/images/spt/sales-video-poster.jpg";
const DASHBOARD_WIDE = "/images/spt/dashboard-zoom-1.jpg";
const CONTENT_STILL = "/images/spt/slideshow-poster.jpg";
const DASHBOARD = "/images/spt/dashboard-zoom-2.jpg";

export default async function StrategyPage() {
  const [salesTheme] = await themesForImages([SALES_VIDEO]);
  return (
    <div className="main-wrapper lp-page bk-page">
      <PageHero
        form="strategy-hero"
        heading="Find out what your sound is really saying."
        line="We assess your existing sonic ecosystem across campaigns, channels, partnerships and experiences to identify what’s working, what’s missing and where value is being lost. Then we construct an action plan to get your brand on the right path."
        background="#7a3bff"
        lineColor="#02b7fd"
      />
      <Header variant="start-top" />

      {/* The Sonic Performance Tracker sales video, full width (board node 85:2362),
          as the Work page's wide spot. Plays once a Vimeo ID is set. */}
      <section className="bk-section">
        <div className="lp-wrap">
          <WorkSpot
            variant="wide"
            formId="strategy-sales-video"
            theme={salesTheme}
            spot={{
              client: "Sonic Performance Tracker",
              image: SALES_VIDEO,
              text: "See how the Sonic Performance Tracker shows what your sound is really saying.",
            }}
          />
        </div>
      </section>

      <section className="bk-section is-dark" id="sonic-strategy">
        <ServiceDrawers
          heading="Sonic Strategy"
          line="Your brand needs a Sonic Identity – but which one?"
          image={DASHBOARD_WIDE}
          alt="The Sonic Performance Tracker dashboard"
          intro="We analyze your brand, its cultural context, the sounds of the market, and the habits of your target audience to define your perfect sonic identity. These are our tools:"
          items={[
            {
              name: "Sonic Sweetspot",
              text: "With our Sonic Sweetspot service, we provide a robust brand and competitor analysis that identifies the distinctive musical space a brand can claim for itself within the market.",
            },
            {
              name: "Sonic Trend Radar",
              text: "Our Sonic Trend Radar service gathers information on emerging sonic trends relevant to your brand, and suggests creative ways in which you can capitalize on their cultural impact.",
            },
            {
              name: "ArtistMatch",
              text: "Our ArtistMatch service uses both data-based research alongside qualitative factors to ensure the artist partnerships we recommend are not only creatively inspired but feel authentic and make strategic sense.",
            },
          ]}
        />
      </section>

      <section className="bk-section" id="content-production">
        <ServiceDrawers
          flipped
          heading="Content Production"
          line="How do we bring your sonic identity to life?"
          image={CONTENT_STILL}
          alt="On set with Hyundai Inster"
          intro="From strategy to real life. Informed by our analytical insights, we craft all kinds of assets shaped by music culture - from sound and film to events, merch, digital content, and immersive experiences - to power your communication across every touchpoint."
          items={[
            {
              name: "Sonic Branding & Identity",
              text: "We don’t create jingles. We build sonic identities that become cultural signatures. Your sound is not decoration. It’s your brand’s heartbeat — recognizable, emotional, unforgettable.",
            },
            {
              name: "Content & Campaign Production",
              text: "We design campaigns, social content, films, and brand experiences that don’t just grab attention — they earn emotional loyalty. Every piece of content starts with your sonic DNA and turns it into real-world resonance.",
            },
            {
              name: "Cultural Activation & Experiences",
              text: "We orchestrate artist collaborations, branded playlists, cultural partnerships, and live experiences that make your brand part of the conversation — not an outsider shouting from the sidelines.",
            },
          ]}
          cta={{ href: "/work", label: "See us in action" }}
        />
      </section>

      <section className="bk-section is-dark" id="performance">
        <ServiceDrawers
          heading="Performance & Measurement"
          line="Not just music - measurable impact."
          image={DASHBOARD}
          alt="Sonic Strategy Score in the Sonic Performance Tracker dashboard"
          intro="Keen insights and extraordinary craft are only part of the story. None of it means anything if we can’t measure the impact of our actions. We provide reporting, market research and data analytics to empirically prove the efficacy of our sonic strategies."
          items={[
            {
              name: "Direct Response Tracking",
              text: "We measure what matters immediately: engagement rates, shares, searches, and audience reactions across platforms. No assumptions. Just clear signals that your sound is being heard — and felt.",
            },
            {
              name: "Cultural Resonance Analysis",
              text: "We track how your activations resonate emotionally and culturally — across demographics, subcultures, and digital spaces. Because cultural relevance isn’t built on views. It’s built on meaning.",
            },
            {
              name: "Strategic Impact Scoring",
              text: "Our Cultural Relevance Score and Strategy Score reveal how music drives brand loyalty, emotional equity, and market leadership. Finally, creativity you can manage — and monetize.",
            },
          ]}
        />
      </section>

      <section className="bk-section">
        <Lead
          boxed
          parallax={false}
          heading="Want to see strategy at work?"
          text="Our music production and data-driven sonic strategies work hand-in-hand to create memorable campaigns that genuinely connect with audiences."
        >
          <CtaLink href="/case-studies" label="View our case studies" />
        </Lead>
      </section>

      <ContactBlock person="karl" />
      <LandingFooter band={{ background: "#7a3bff", line: "#02b7fd" }} />
    </div>
  );
}
