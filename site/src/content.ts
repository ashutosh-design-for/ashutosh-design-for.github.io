/**
 * The words come from the content modules in ./data and the media from public/.
 * The About copy lives here because nothing else uses it.
 */
export { PROJECTS, KINDS, bySlug, type Project, type Shot } from "./data/projects";
export { PLAY, PLAY_KINDS, type Play } from "./data/playground";
export { WRITING, type Post } from "./data/writing";
export { SITE, SOCIALS, EXPERIENCE, EDUCATION, PRINCIPLES, CAPABILITIES, FACTS, QUOTES, SKILLS, type Quote, type Skill } from "./data/site";
import media from "./data/media.json";

export type MediaInfo = { w: number; h: number; video?: boolean; schematic?: boolean };
export const MEDIA = media as Record<string, MediaInfo>;

export const INTRO =
  "Product designer. I read the codebase before I open Figma. Design and frontend at ArmorIQ, lead product design at Ivish AI. Interfaces built for real data, not the happy-path mockup.";

export const ABOUT = {
  /** The About page, Vedant style: one line, two short paragraphs, the photos and the connection line (lead) */
  hero: "Ash, a.k.a. Ashutosh Rana, is a product designer who writes the frontend for teams building with AI.",
  thinking:
    "I read the codebase before I open Figma. What the API returns, which components already exist and where the data runs out decide more of the interface than a moodboard does.",
  making:
    "I design every state the demo skips, then build the interface myself. What I hand over is the system, not the screen: tokens, primitives and rules the next person can follow without me.",
  title: "I design the interface, then I build it.",
  lead: "I'm Ashutosh, a product designer from Jabalpur, India. I taught myself design from YouTube during the 2020 lockdown, and I'm the first person in my family to choose it.",
  body: [
    "Most of my week goes to ArmorIQ, where I do design and frontend for a security platform for AI agents: the product, its design system and the internal tools. I also lead product design at Ivish AI, a translation company working across text, voice and video. This summer I was on Summer of Bitcoin's designer track, redesigning Shopstr.",
    "The habit that makes the difference is reading the codebase before I design. I want to know what the API returns, which components already exist and where the data runs out before a screen exists, not at handoff. Usually I build the interface myself.",
    "I'm in my second year of a BTech in Design at IIIT Jabalpur.",
  ],
};

export const LEDE = {
  work: "Products, design systems and internal tools for teams building with AI.",
  more: "Brand and web work for clients, and things built against a deadline.",
  play: "Smaller things, each made to learn one thing properly.",
};
