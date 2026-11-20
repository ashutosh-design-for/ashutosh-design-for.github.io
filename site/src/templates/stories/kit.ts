import { MEDIA } from "../../content";
import { esc, mediaTag, pad2 } from "../../lib/html";
import { skim, tldrButton } from "../../lib/skim";

/**
 * The case-story kit. Every story page is built from these parts so each project starts at the same quality bar:
 * section heads with TL;DR prose, padded frames around every capture, phones and browsers that may bleed off a frame
 * edge, stat rows, outcome rows with evidence bars, the pinned page scroller and photographic mockup slots.
 * Rules behind them: ~/.claude/skills/case-study and the vault note "Working rules for case studies".
 */

/** Section intro: numbered label and serif claim on the left, the TL;DR paragraph (and an optional aside) on the right */
export function head(n: number, label: string, title: string, text = "", id = "", aside = "") {
  return `<header class="sh">
      <div class="sh__main">
        <p class="sh__label"><span class="label sh__n">${pad2(n)}</span><span class="label" data-reveal="scramble">${esc(label)}</span></p>
        <h2 class="sh__title"${id ? ` id="${id}"` : ""} data-reveal="lines">${title}</h2>
      </div>
      ${text || aside ? `<div class="sh__side">${text ? `<p class="sh__text prose" data-reveal="up">${skim(text)}</p>` : ""}${aside}</div>` : ""}
    </header>`;
}

/** Frame grounds. Pick the one that matches a capture's edge colour so an isolated component looks cut out. */
export type Tone = "grey" | "cream" | "pale" | "soft" | "ink" | "glow" | "white";

export type Frame = {
  tone: Tone;
  /** Breadcrumb, top left: "Product / Buy box" */
  crumb?: string;
  /** One short line, bottom left */
  cap?: string;
  /** Mono chip, top right: "Live", "Video", "Hover it", "Proposal" */
  tag?: string;
  cls?: string;
  /** Text block inside the frame, above the media */
  intro?: string;
  attrs?: string;
};

/** The container every capture and component lives in. Padding is generous; media may bleed off one edge. */
export function frame(o: Frame, stage: string) {
  const crumb = o.crumb
    ? `<p class="fr__crumb label">${o.crumb
        .split(" / ")
        .map((c, i, all) => (i === all.length - 1 ? `<b>${esc(c)}</b>` : `${esc(c)}<span>/</span>`))
        .join("")}</p>`
    : "";
  const tag = o.tag ? `<span class="fr__tag label">${esc(o.tag)}</span>` : "";
  const foot = o.cap ? `<figcaption class="fr__foot"><span class="fr__cap">${esc(o.cap)}</span></figcaption>` : "";
  return `<figure class="fr fr--${o.tone}${o.cls ? ` ${o.cls}` : ""}" data-reveal="up"${o.attrs ? ` ${o.attrs}` : ""}>
      ${crumb}${tag}${o.intro ?? ""}
      <div class="fr__stage">${stage}</div>
      ${foot}
    </figure>`;
}

/** Question-and-answer block for the inside of a frame */
export const qa = (q: string, a: string, n: number) =>
  `<div class="fr__intro"><span class="label fr__q-n">Question ${pad2(n)}</span><p class="fr__q">${esc(q)}</p><p class="fr__a">${esc(a)}</p></div>`;

/** A recording, rounded, on its own ground. --flat drops the radius when the clip's ground matches the frame. */
export const clip = (base: string, file: string, alt: string, cls = "") =>
  `<div class="clip${cls ? ` ${cls}` : ""}">${mediaTag(base, file, alt)}</div>`;

/** A still zoomed to one part, faded where it is cut. Size and zoom come from a modifier class. */
export const crop = (base: string, file: string, alt: string, cls = "") =>
  `<div class="crop${cls ? ` ${cls}` : ""}">${mediaTag(base, file, alt)}</div>`;

export const browser = (inner: string, url: string, cls = "") =>
  `<div class="win${cls ? ` ${cls}` : ""}"><div class="win__bar" aria-hidden="true"><i></i><i></i><i></i><span>${esc(url)}</span></div>${inner}</div>`;

/** A phone body. "ph--bottom" shows the lower part of a screen, "ph--top" the upper part, for frames it bleeds out of. */
export const phone = (inner: string, cls = "") => `<div class="ph${cls ? ` ${cls}` : ""}"><div class="ph__screen">${inner}</div></div>`;

/** Scroll-driven zoom: the image starts at 1.9x around its transform origin and pulls back to fit */
export const zoomed = (base: string, file: string, alt: string) => `<div class="zoom">${mediaTag(base, file, alt)}</div>`;

/** Big numbers row. Each item: [number, what it means]. */
export const stats = (items: [string, string][]) =>
  `<dl class="stats">${items.map(([n, t]) => `<div class="stats__item" data-reveal="up"><dt>${esc(n)}</dt><dd>${esc(t)}</dd></div>`).join("")}</dl>`;

/** A photographic mockup slot. It renders only once the file is registered in media.json, so slots can ship first. */
export function mockup(base: string, file: string, alt: string, text: string) {
  if (!MEDIA[file]) return "";
  return `<section class="story__sec story__x mock">
    <div class="mock__media" data-reveal="media">${mediaTag(base, file, alt)}</div>
    <p class="mock__text prose" data-reveal="up">${skim(text)}</p>
  </section>`;
}

export type Result = {
  /** The big number, already formatted */
  n: string;
  title: string;
  /** What kind of number: Measured, Derived from list prices, Shipway benchmark, Proposal */
  kind: string;
  /** TL;DR prose */
  text: string;
  /** Evidence bars: [label, value, formatted value]. Leave empty when no comparison is fair. */
  bars: [string, number, string][];
};

/** Outcome rows: big accent number, claim and explanation on the left, the evidence as bars on the right */
export function results(rows: Result[], foot = "") {
  return `<ol class="res">${rows
    .map((r) => {
      const max = Math.max(1, ...r.bars.map((b) => b[1]));
      return `<li class="res__row" data-reveal="up">
          <div class="res__main"><p class="res__n">${esc(r.n)}</p><p class="res__title">${esc(r.title)}</p><p class="res__text prose">${skim(r.text)}</p></div>
          <div class="res__viz"><p class="label res__kind">${esc(r.kind)}</p>${r.bars
            .map((b) => `<div class="res__bar"><span class="label">${esc(b[0])}</span><span class="res__track"><span class="res__fill" style="--w: ${((b[1] / max) * 100).toFixed(1)}%"></span></span><span class="label res__val">${esc(b[2])}</span></div>`)
            .join("")}</div>
        </li>`;
    })
    .join("")}</ol>${foot ? `<p class="label story__foot" data-reveal="up">${esc(foot)}</p>` : ""}`;
}

export type Scroller = {
  n: number;
  label: string;
  title: string;
  text: string;
  id: string;
  /** Questions or sections, each with its top offset in px on the capture */
  items: { q: string; s: string; y: number }[];
  /** Full-page capture, its pixel size, the address shown in the bar, and the frame crumb */
  src: string;
  w: number;
  h: number;
  url: string;
  crumb: string;
};

/**
 * The pinned page scroller: a full-page capture moves inside a browser window as the section scrolls, and the item it
 * has reached lights up in the list. Below 1024px the window scrolls natively. Behaviour: views/stories/kit.ts.
 */
export function scroller(o: Scroller) {
  const items = o.items
    .map((x, i) => `<li class="ia__item${i ? "" : " is-on"}" data-y="${x.y}"><span class="ia__n label">${pad2(i + 1)}</span><span class="ia__q">${esc(x.q)}</span><span class="ia__s label">${esc(x.s)}</span></li>`)
    .join("");
  return `<section class="story__sec story__ia" aria-labelledby="${o.id}" data-ia data-capture-w="${o.w}">
    <div class="ia__pin story__x">
      <div class="ia__copy">
        ${head(o.n, o.label, o.title, o.text, o.id)}
        <ol class="ia__list">${items}</ol>
      </div>
      ${frame(
        { tone: "grey", cls: "ia__frame", crumb: o.crumb, tag: "Scroll" },
        browser(`<div class="ia__window" data-lenis-prevent tabindex="0" aria-label="The page, scrollable"><img class="ia__page" src="${o.src}" width="${o.w}" height="${o.h}" alt="The full page, top to bottom" loading="lazy" decoding="async"></div>`, o.url),
      )}
    </div>
  </section>`;
}

/** The story root: scope for TL;DR and the floating toggle. `extra` carries one-off defs such as SVG filters. */
export const storyRoot = (slug: string, sections: string, extra = "") =>
  `<div class="story story--${slug}" data-story="${slug}" data-tldr-scope>${extra}${sections}${tldrButton("tldr--float")}</div>`;

/** The in-flow TL;DR toggle, for the first section's head aside */
export const tldrInline = () => `<div class="sh__aside">${tldrButton("tldr--inline")}<span class="label sh__hint">Skim the whole page</span></div>`;

/* ------------------------------------------------------------------ bento grid */

/**
 * One tile of a bento row. `f` is a media.json key; a video plays when it scrolls in. `bg` is the tile ground,
 * `pad` insets the media so a screen floats on the ground, `fit` cover crops to fill (boards, photos), contain keeps
 * the whole screen. `html` replaces the media with a text card.
 */
export type Tile = { f?: string; alt?: string; bg?: string; pad?: boolean; fit?: "cover" | "contain"; pos?: string; label?: string; html?: string; dark?: boolean };

/** A cell is one tile, or a column of tiles stacked in the same cell */
export type Cell = Tile | Tile[];

/** A row: cells side by side. `w` are the column weights; leave it out and widths follow each media's aspect ratio. */
export type Row = { cells: Cell[]; w?: number[]; ar?: number };

const arOf = (t: Tile) => {
  if (!t.f) return 1;
  const { w, h } = MEDIA[t.f] ?? { w: 16, h: 10 };
  return w / h;
};

function tile(base: string, t: Tile) {
  const style = [t.bg ? `--bg:${t.bg}` : "", `--tar:${arOf(t).toFixed(4)}`, t.pos ? `--pos:${t.pos}` : ""].filter(Boolean).join(";");
  const cls = ["bx__t", t.pad ? "bx__t--pad" : "", t.fit === "cover" ? "bx__t--cover" : "", t.html ? "bx__t--text" : "", t.dark ? "bx__t--dark" : ""].filter(Boolean).join(" ");
  const label = t.label ? `<span class="bx__label label">${esc(t.label)}</span>` : "";
  if (t.html) return `<div class="${cls}" style="${style}" data-reveal="up">${t.html}</div>`;
  return `<figure class="${cls}" style="${style}"><div class="bx__m" data-reveal="tile"><div class="bx__in">${mediaTag(base, t.f!, t.alt ?? "")}</div></div>${label}</figure>`;
}

/** A column stack's aspect ratio: tiles of one width stacked, so 1 / sum(1 / ar) */
const cellAr = (c: Cell) => (Array.isArray(c) ? 1 / c.reduce((s, t) => s + 1 / arOf(t), 0) : arOf(c));

/**
 * Bento rows. Each row has a fixed aspect ratio, so every tile in it shares one height; on phones the rows stack
 * and each tile takes its media's own ratio. Tiles lift and fade in as they enter (data-reveal="tile").
 */
export function bento(base: string, rows: Row[], cls = "") {
  return `<div class="bx${cls ? ` ${cls}` : ""}">${rows
    .map((r) => {
      const ws = r.w ?? r.cells.map(cellAr);
      const ar = r.ar ?? (r.w ? undefined : ws.reduce((a, b) => a + b, 0));
      /* Weights are normalised: fr values that sum below 1 would leave part of the row empty */
      const total = ws.reduce((a, b) => a + b, 0);
      const style = `grid-template-columns:${ws.map((w) => `minmax(0,${(w / total).toFixed(4)}fr)`).join(" ")}${ar ? `;--rar:${ar.toFixed(4)}` : ""}`;
      const cells = r.cells.map((c) => (Array.isArray(c) ? `<div class="bx__col">${c.map((t) => tile(base, t)).join("")}</div>` : tile(base, c))).join("");
      /* A row of only contained screens may letterbox, so it never grows taller than the viewport */
      const cap = ar && r.cells.flat().every((t) => !t.html && t.fit !== "cover");
      return `<div class="bx__row${ar ? "" : " bx__row--free"}${cap ? " bx__row--cap" : ""}" style="${style}">${cells}</div>`;
    })
    .join("")}</div>`;
}

/** A text break between bentos: the section head on its own, then the bento continues */
export const chapter = (n: number, label: string, title: string, text: string, id: string, body = "") =>
  `<section class="story__sec story__x bx-sec" aria-labelledby="${id}">${head(n, label, title, text, id)}${body}</section>`;
