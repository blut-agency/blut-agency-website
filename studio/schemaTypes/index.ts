import { award } from "./award";
import { caseStudy } from "./caseStudy";
import { casesSettings } from "./casesSettings";
import { colorTheme } from "./colorTheme";
import { richText } from "./richText";
import { videoFile } from "./videoFile";

export const schemaTypes = [caseStudy, casesSettings, colorTheme, award, richText, videoFile];

/** Documents that exist exactly once: no "create new", no delete. */
export const SINGLETONS = ["casesSettings"];
