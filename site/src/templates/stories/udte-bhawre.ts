import type { Project } from "../../content";
import { bento, type Tile } from "./kit";

/**
 * Udte Bhawre as a Behance presentation, no words of its own: the crew, one task from summon to done, the approval
 * and the breaks, three companions at once, the state library, home base and the mark. Twelve tiles from the
 * Showcase studio's toy-paper series (white plate, real UI, 3D crew), batch 4 first. Tiles use the kit reveal.
 */

const SLUG = "udte-bhawre";
const t = (f: string, alt: string, bg = "#ffffff"): Tile => ({ f: `${SLUG}/${f}`, alt, fit: "cover", bg });

export function story(base: string, _p: Project) {
  const deck = bento(
    base,
    [
      /* Batch 4 (2026-11-19), each copied off a Proof reference: Talkie 28, 01 and 16, eco-mine 07, Lucas Crespo's coin turn */
      { cells: [t("n-team", "The crew: Bo, Pim, Tuck, Zip and Penny peeking over their cards")] },
      {
        cells: [
          t("n-poster-bo", "Bo, the inbox helper, in front of his name", "#e6eeff"),
          t("n-poster-pim", "Pim, the writer, in front of her name", "#ffeaf4"),
          t("n-poster-tuck", "Tuck, the organiser, in front of his name", "#e3f7eb"),
        ],
      },
      {
        cells: [
          t("n-poster-zip", "Zip, marketing, in front of his name", "#ffe8e1"),
          t("n-poster-penny", "Penny, finance, in front of her name", "#fff5d4"),
          t("v-turn", "The crew turning like coins, one into the next"),
        ],
      },
      { cells: [t("n-tuck", "Tuck at work beside his approval card and the Removes tag")] },
      { cells: [t("n-pim-spec", "Pim spec sheet: four callouts and the twelve states")] },
      { cells: [t("v-welcome", "Welcome, Ash: the five companions orbit the greeting")] },
      { cells: [t("v-summon", "Summoning Pim from the taskbar and rewriting a note, to done", "#fafaf8")] },
      /* Full rows: at half width the approval card's type drops to about 9px */
      { cells: [t("p-approval", "Tuck needs your OK: a three step plan to approve or stop")] },
      { cells: [t("p-breaks", "When it breaks: Gmail stopped answering, and a clean done")] },
      { cells: [t("p-kite", "Tuck, Pim and Bo open at once, each in its own panel")] },
      {
        cells: [
          t("v-states", "Bo's twelve states, from hatching to returning"),
          t("v-toss", "Picking Bo up off the taskbar and tossing him back", "#fafaf8"),
        ],
      },
      { cells: [t("v-home", "Home base in light and dark: Good evening, Pim's page and threads")] },
      { cells: [t("v-mark", "The Udte Bhawre mark lighting up over the crew")] },
    ],
    "bx--last",
  );
  return `<div class="story story--${SLUG} story--deck" data-story="${SLUG}">${deck}</div>`;
}
