import type { WorkSpotData } from "@/components/WorkSpot";
import { getPage } from "@/lib/pages";

/*
  The films on Production (and Post), from Sanity via pages.json. Used by the
  team pages (selected work, looked up by client name) and the component sheet.
*/

export type WorkItem = { spot: WorkSpotData; layout: "wide" | "row" | "row-flipped" };

const toItem = ({ layout, ...spot }: WorkSpotData & { layout: WorkItem["layout"] }): WorkItem => ({ layout, spot });

export const WORK_ITEMS: WorkItem[] = getPage("productionPage").spots.map(toItem);
const POST_ITEMS: WorkItem[] = getPage("postPage").spots.map(toItem);

/** The film for a client name, from Production first, then Post. Undefined when no film has that name. */
export function workItem(client: string): WorkItem | undefined {
  return [...WORK_ITEMS, ...POST_ITEMS].find((i) => i.spot.client === client);
}
