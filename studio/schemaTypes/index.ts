import { award } from "./award";
import { caseStudy } from "./caseStudy";
import { casesSettings } from "./casesSettings";
import { colorTheme } from "./colorTheme";
import { legalText } from "./legalText";
import { richText } from "./richText";
import { teamMember } from "./teamMember";
import { videoFile } from "./videoFile";
import { homePage } from "./pages/homePage";
import { aboutPage, casesPage, postPage, productionPage, strategyPage } from "./pages/otherPages";
import { callResponse, cta, hero, leadBox, seo, service, workSpot } from "./pages/shared";
import { imprintPage, privacyPage, siteSettings } from "./pages/sitePages";

/** The page forms, in the order the studio lists them. Each exists once. */
export const PAGE_TYPES = [
  homePage,
  productionPage,
  strategyPage,
  postPage,
  casesPage,
  aboutPage,
  imprintPage,
  privacyPage,
  siteSettings,
];

export const schemaTypes = [
  ...PAGE_TYPES,
  caseStudy,
  casesSettings,
  colorTheme,
  award,
  teamMember,
  richText,
  legalText,
  videoFile,
  seo,
  cta,
  hero,
  callResponse,
  leadBox,
  workSpot,
  service,
];

/** Documents that exist exactly once: no "create new", no delete. Their id is their type name. */
export const SINGLETONS = ["casesSettings", ...PAGE_TYPES.map((t) => t.name)];
