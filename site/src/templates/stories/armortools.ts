import type { Project } from "../../content";
import { bento, type Tile } from "./kit";

/**
 * ArmorTools as a Behance presentation, no words of its own: the boards he approved (Four agents, the bleed, the
 * gallery, the bento, the diptych), five new boards in the same shell with more of the console, the composed
 * screens from Figma, and the recordings. Tiles wipe open.
 */

const SLUG = "armortools";
const t = (f: string, alt: string, pad = false): Tile => ({ f: `${SLUG}/${f}`, alt, fit: pad ? "contain" : "cover", pad, bg: "#141416" });

export function story(base: string, _p: Project) {
  const deck = bento(
    base,
    [
      { cells: [t("s-chat", "The console's chat: How can I help you today, over a warm blurred ground")] },
      { cells: [t("p-four", "Four agents. One list."), t("p-allnight", "Your agents ran all night. Here's what needs you."), t("p-bento", "Every agent run, in one place")] },
      { cells: [t("p-setup", "New account, two steps: the setup home")] },
      { cells: [t("p-shadow", "New rules watch first: a policy in safe mode")] },
      { cells: [t("p-policies", "Policies with suggested detections"), t("p-cost", "What your agents cost"), t("v-range", "Changing the analytics range")] },
      { cells: [t("p-briefing", "Last night, in a line: the daily briefing")] },
      { cells: [t("p-diptych", "Record, check, block: every tool call and why")] },
      { cells: [t("p-keys", "One key per agent: API keys in settings")] },
      { cells: [t("v-film", "The ArmorTools film")] },
    ],
    "bx--last",
  );
  return `<div class="story story--${SLUG} story--deck" data-story="${SLUG}">${deck}</div>`;
}
