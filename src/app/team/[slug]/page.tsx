import type { Metadata } from "next";
import AiDraftNote from "@/components/AiDraftNote";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import LandingFooter from "@/components/LandingFooter";
import WorkSpot from "@/components/WorkSpot";
import CaseCard from "@/components/CaseCard";
import Drawer from "@/components/Drawer";
import { ContactBlock, CtaLink, Lead, PageHero, ServiceDrawers } from "@/components/Blocks";
import { PEOPLE, getPerson } from "@/content/people";
import { workItem } from "@/content/work";
import { getCaseStudyBySlug, type CaseStudy } from "@/lib/content";
import { highlightThemes, themesForImages } from "@/lib/imageTheme";

/*
  Team pages, written for search: the person's name and role in the title,
  description, H1 and first paragraph; what the role covers; selected blut
  work; an FAQ; and structured data (Person, FAQPage, BreadcrumbList) so
  search engines can show them as a person working at blut. Content:
  src/content/people.ts.
*/

const SITE = "https://www.blut.agency";

export function generateStaticParams() {
  return PEOPLE.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPerson((await params).slug);
  if (!p) return {};
  const url = `/team/${p.slug}`;
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    keywords: p.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "profile",
      url,
      title: `${p.name} – ${p.role} at blut`,
      description: p.seoDescription,
      firstName: p.firstName,
      lastName: p.name.split(" ").slice(1).join(" "),
      images: [{ url: `/images/${p.file}.jpg`, width: 1200, height: 1200, alt: p.name }],
    },
    twitter: { card: "summary_large_image", title: `${p.name} – ${p.role} at blut`, description: p.seoDescription },
  };
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPerson((await params).slug);
  if (!p) notFound();

  const spots = (p.work.spots ?? []).map(workItem);
  const cases = (p.work.cases ?? []).map(getCaseStudyBySlug).filter((cs): cs is CaseStudy => Boolean(cs));
  const [spotThemes, caseThemes] = await Promise.all([
    themesForImages(spots.map((s) => s.spot.image)),
    highlightThemes(cases.map((cs) => ({ image: cs.thumbnail, color: cs.color }))),
  ]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: p.name,
      jobTitle: p.role,
      email: `mailto:${p.email}`,
      ...(p.phone ? { telephone: p.phone } : {}),
      image: `${SITE}/images/${p.file}.jpg`,
      url: `${SITE}/team/${p.slug}`,
      description: p.seoDescription,
      knowsAbout: p.expertise.items.map((i) => i.name),
      worksFor: {
        "@type": "Organization",
        name: "blut",
        url: SITE,
        address: { "@type": "PostalAddress", streetAddress: "Poolstraße 42", postalCode: "20355", addressLocality: "Hamburg", addressCountry: "DE" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faq.map((q) => ({ "@type": "Question", name: q.name, acceptedAnswer: { "@type": "Answer", text: q.text } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "blut", item: SITE },
        { "@type": "ListItem", position: 2, name: "About", item: `${SITE}/about` },
        { "@type": "ListItem", position: 3, name: p.name, item: `${SITE}/team/${p.slug}` },
      ],
    },
  ];

  return (
    <div className="main-wrapper lp-page bk-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        form={`team-${p.slug}`}
        heading={p.name}
        line={p.hero.line}
        background={p.hero.background}
        lineColor={p.hero.lineColor}
        dark={p.hero.dark}
        lineAiDraft
      />
      <Header variant="start-top" />

      {/* Portrait and who they are. */}
      <section className="bk-section">
        <div className="lp-wrap bk-person">
          <div className="bk-contact-photo bk-person-photo">
            <img
              src={`/images/${p.file}.jpg`}
              srcSet={`/images/${p.file}-p-500.jpg 500w, /images/${p.file}-p-800.jpg 800w, /images/${p.file}-p-1080.jpg 1080w, /images/${p.file}.jpg 1200w`}
              sizes="(max-width: 767px) 100vw, 30vw"
              alt={`${p.name}, ${p.role} at blut`}
            />
          </div>
          <div className="bk-person-text">
            <AiDraftNote />
            <h2 className="lp-heading">{p.role}</h2>
            {[...p.intro, ...p.bio].map((para) => (
              <p className="lp-copy ai-draft" key={para.slice(0, 24)}>
                {para}
              </p>
            ))}
            <CtaLink href={`mailto:${p.email}`} label={`Write to ${p.firstName}`} />
          </div>
        </div>
      </section>

      <section className="bk-section is-dark ai-draft">
        <ServiceDrawers
          heading={p.expertise.heading}
          line={p.expertise.line}
          intro={p.expertise.intro}
          image={p.expertise.image}
          alt={p.expertise.alt}
          items={p.expertise.items}
        />
      </section>

      <section className="bk-section">
        <Lead heading={p.work.heading} parallax={false} />
        {spots.length > 0 && (
          <ul role="list" className="lp-wrap bk-mosaic">
            {spots.map((item, i) => (
              <li key={item.spot.client}>
                <WorkSpot
                  spot={item.spot}
                  theme={spotThemes[i]}
                  variant="row"
                  flipped={i % 2 === 1}
                  formId={`team-${p.slug}-${i}`}
                  pattern={i}
                />
              </li>
            ))}
          </ul>
        )}
        {cases.length > 0 && (
          <ul role="list" className="lp-wrap bk-case-list">
            {cases.map((cs, i) => (
              <li key={cs.slug}>
                <CaseCard cs={cs} theme={caseThemes[i]} formPrefix={`team-${p.slug}`} />
              </li>
            ))}
          </ul>
        )}
        <div className="lp-wrap">
          <CtaLink href={spots.length ? "/production" : "/case-studies"} label={spots.length ? "See all our work" : "View all case studies"} />
        </div>
      </section>

      <section className="bk-section is-dark ai-draft">
        <Lead heading={`Questions for ${p.firstName}`} parallax={false} />
        <div className="lp-wrap bk-faq">
          <div className="bk-drawers">
            {p.faq.map((q) => (
              <Drawer key={q.name} name={q.name} text={q.text} />
            ))}
          </div>
        </div>
      </section>

      <ContactBlock person={p.slug === "michael-robb" ? "michael" : "karl"} />
      <LandingFooter band={{ background: p.hero.background, line: p.hero.lineColor, light: p.hero.dark }} />
    </div>
  );
}
