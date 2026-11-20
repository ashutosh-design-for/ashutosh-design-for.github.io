import type { Project } from "../../content";
import { esc, mediaTag } from "../../lib/html";
import { stats } from "./kit";

/**
 * The Platform design system, told almost only in images: the 23 boards of its Behance deck, each wiping open
 * as it enters. Chapter boards run full bleed, content boards alternate between the page gutter, the story
 * column and an offset pair, so the rhythm comes from width and position rather than from captions.
 */

type Mode = "bleed" | "wide" | "inset" | "left" | "right";
type Board = [file: string, mode: Mode, alt: string];

const BOARDS: Board[] = [
  ["02", "inset", "What is inside: a bento of seven foundation tiles, from colour and type to icons and modes"],
  ["03", "bleed", "Chapter 01, Foundations, on orange"],
  ["04", "wide", "Getting started rules: bind every value to a token, subtle and bold swatches, a properties panel and the naming pattern"],
  ["05", "inset", "Five layers, from primitives to the product layer, as a rising chart on near-black"],
  ["06", "wide", "Colour: accent stripes, the four status families and the Light and Dark neutrals"],
  ["07", "bleed", "Light and Dark split down the middle, with all 15 token pairs per mode"],
  ["08", "left", "Geist type specimen, the type scale and a Geist Mono band"],
  ["09", "right", "Spacing, radius and elevation on near-black"],
  ["10", "inset", "80 icons, grouped by the job they do"],
  ["11", "bleed", "Chapter 02, Components, on near-black"],
  ["12", "wide", "Button anatomy at 3x on a blueprint grid, with the Button and Chip sets"],
  ["13", "left", "Inputs, Select and Avatar sets"],
  ["14", "right", "Form controls: four spec tiles, checkbox, radio, radio card and the plan chooser"],
  ["15", "inset", "Status: four family tiles with Badge, Chip and Toast in each"],
  ["16", "wide", "Overlays: Modal, SideModal and Alert dialog on near-black"],
  ["17", "inset", "Composed components: Sidebar, Command menu, ListToolbar, Table, DataCard and page states"],
  ["18", "bleed", "Chapter 03, Product layer, on orange"],
  ["19", "wide", "The approval card, pending on orange and resolved on near-black"],
  ["20", "left", "Agent kill switch durations and states, with the agent card"],
  ["21", "right", "The setup wizard at steps 1, 2 and 4"],
  ["22", "inset", "The file map: all 50 pages, colour-coded by layer"],
];

const SLUG = "platform-design-system";

const board = (base: string, [file, mode, alt]: Board) =>
  `<figure class="pds__b pds__b--${mode}"><div class="pds__m" data-reveal="media">${mediaTag(base, `${SLUG}/${file}`, alt)}</div></figure>`;

export function story(base: string, _p: Project) {
  const intro = `<section class="story__sec story__x pds__intro" aria-label="Overview">
    <p class="label pds__label" data-reveal="scramble">Overview</p>
    <p class="pds__lede" data-reveal="lines">${esc("Every screen of ArmorIQ's enterprise console, built from one Figma library.")}</p>
    ${stats([
      ["43", "components"],
      ["411", "variants"],
      ["121", "variables, Light and Dark"],
      ["80", "icons"],
    ])}
  </section>`;

  const boards = `<section class="pds__boards" aria-label="Boards">${BOARDS.map((b) => board(base, b)).join("")}</section>`;

  const all = `<section class="pds__all" aria-labelledby="pds-all">
    <p class="label pds__label page-x" id="pds-all" data-reveal="scramble">All 23 boards</p>
    ${board(base, ["all", "wide", "All 23 boards of the deck in one overview"])}
    ${board(base, ["23", "bleed", "Thank you, on orange"])}
  </section>`;

  /* No storyRoot: with almost no prose, the TL;DR toggle would have nothing to skim */
  return `<div class="story story--${SLUG}" data-story="${SLUG}">${intro}${boards}${all}</div>`;
}
