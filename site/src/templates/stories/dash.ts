import type { Project } from "../../content";
import { bento, type Tile } from "./kit";

/**
 * DASH as a Behance presentation, no words: every frame of the Figma "DASH Behance board v2" (node 183:173) in its
 * exact order, the three photo plates included, one board per row at full width. Boards wipe open.
 */

const SLUG = "dash";
const b = (f: string, alt: string): Tile => ({ f: `${SLUG}/${f}`, alt, fit: "cover", bg: "#fffdf6" });

const BOARDS: [string, string][] = [
  ["b01-cover", "Take a shot: the DASH Glow bottle on a pixel burst, with the three shot tags"],
  ["p-billboard", "A DASH billboard in a glass hall: Take a shot, time to Dash"],
  ["b02-brief", "The brief: the Glow bottle in a pixel burst on ink, with the project notes"],
  ["b05-tablet", "Home at 834 px"],
  ["b06-mobile", "Mobile home and menu at 390 px"],
  ["b09-glow", "Dash of Glow: the product page in coral"],
  ["b10-volume", "Dash of Volume: the same page in its own olive theme"],
  ["b11-diaries", "The Dash Diaries journal, on mobile"],
  ["b12-longmobile", "The Dash Diaries article and footer as one long mobile scroll"],
  ["b16-type", "Type: Champ, Degular Display, General Sans and Azeret Mono"],
  ["b17-colour", "The colour bento: ink, cream and three shot ramps"],
  ["b19-hero", "The hero: Take a shot, time to Dash"],
  ["b20-burnvol", "Dash of Burn and Dash of Volume product pages"],
  ["p-stage", "The DASH line-up on a conference stage screen: Your new inner circle"],
  ["b22-brand", "Brand application: a lifestyle photo cut into the pixel burst"],
  ["b22b-social", "Social posts at 4:5 for Glow, Burn and Volume"],
  ["p-metro", "A Dash of Burn poster inside a metro carriage"],
  ["b23-compare", "Research notes beside the shop at 834 px"],
  ["b24-lineup", "Your new inner circle: the three shots and the trial trio on mobile"],
  ["b28-close", "Closing card: Take a shot, time to Dash"],
];

export function story(base: string, _p: Project) {
  const deck = bento(base, BOARDS.map(([f, alt]) => ({ cells: [b(f, alt)] })), "bx--seamless bx--last");
  return `<div class="story story--${SLUG} story--deck" data-story="${SLUG}">${deck}</div>`;
}
