import type { Project } from "../../content";
import { bento, type Tile } from "./kit";

/**
 * ArmorIQ platform as a Behance presentation, no words: the pieces of the approved Platform board from Figma as
 * separate tiles on the page ground (no board seams), whole mockups re-pinned with the right screens, phones in
 * Safari, then the wall of screens and the closing clip. Kept short on purpose: only the strongest frames.
 */

const SLUG = "armoriq-platform";
const t = (f: string, alt: string, bg = "#f3f3f1"): Tile => ({ f: `${SLUG}/${f}`, alt, fit: "cover", bg });

export function story(base: string, _p: Project) {
  const deck = bento(
    base,
    [
      { cells: [t("m-hands", "A laptop held in two hands, showing the Security overview")] },
      { cells: [t("t-found", "Role-based access, navigation from 84 px to 60 px, and human in the loop")] },
      { cells: [t("t-approval", "An approval card on orange: a treasury agent waits for a person", "#e85a19"), t("m-desk", "A laptop on an oak desk showing an agent's detail page")] },
      { cells: [t("m-sofa", "The sign-in screen on a laptop in an orange armchair"), t("t-palette", "The colour palette: accent, wash, canvas, surface, border and four inks", "#ffffff")] },
      { cells: [t("t-type", "Geist and Geist Mono, the type scale from hero to caption")] },
      { cells: [t("m-phone-a", "A killed agent on a phone in Safari, on concrete"), t("m-phone-b", "Preferences on a phone in Safari, held in a hand")] },
      { cells: [t("v-wall", "Every screen of the console sliding past, then the whole wall", "#0c0c0d")] },
      { cells: [t("m-plinth", "A laptop on a white plinth showing the policy engine")] },
      { cells: [{ f: `${SLUG}/clip-kill-crop`, alt: "Holding the kill switch for 1.5 seconds kills the agent", pad: true, bg: "#fbfbfb" }] },
      { cells: [t("v-close", "Agents act. People decide.")] },
    ],
    "bx--last",
  );
  return `<div class="story story--${SLUG} story--deck" data-story="${SLUG}">${deck}</div>`;
}
