import { KINDS, PROJECTS, type Project, type Shot } from "../content";
import { esc, mediaInfo, mediaTag, mediaUrl, pad2 } from "../lib/html";
/**
 * Projects told as a visual story replace the summary, blocks, gallery, decision and result with their own sections.
 * A story is any templates/stories/<slug>.ts that exports story(); kit.ts holds the shared parts and is skipped.
 */
type StoryModule = { story?: (base: string, p: Project) => string; ready?: boolean };
const STORIES = Object.fromEntries(
  Object.entries(import.meta.glob<StoryModule>("./stories/*.ts", { eager: true }))
    .map(([path, mod]) => [path.slice("./stories/".length, -3), mod.ready === false ? undefined : mod.story] as const)
    .filter((e): e is readonly [string, NonNullable<StoryModule["story"]>] => Boolean(e[1])),
);

/**
 * Gallery shots that repeat the cover at nearly the same framing. Measured once with a 16px luminance
 * hash against the cover (mean difference under 10 of 255); captioned videos are kept.
 */
const SAME_AS_COVER = new Set<string>([]);

/**
 * Cover framing. UI captures are shown whole on the ink stage, between the header zone and the title zone,
 * so neither the site chrome nor the title ever prints over the capture's own text. Photos whose top
 * carries UI start below the header zone instead.
 */
const FRAMED_COVERS = new Set([
  "armoriq-platform",
  "armoriq-design-system",
  "social-content-tool",
  "armortools",
  "kuzara-green",
  "dash",
  "papersseum",
  "navu-kavacha",
]);
const INSET_COVERS = new Set(["shopstr"]);
const heroClass = (slug: string) =>
  FRAMED_COVERS.has(slug) ? " case__hero--framed" : INSET_COVERS.has(slug) ? " case__hero--inset" : "";

/** A single short result that only says the work was delivered repeats the status pill, so it is hidden */
const restatesStatus = (p: Project) => p.result.length === 1 && p.result[0].length < 80 && /delivered/i.test(p.result[0]);

/** One serif italic voice per heading: the clause after the comma, or else the last word */
function voiced(title: string) {
  const comma = title.indexOf(", ");
  if (comma > 0) return `${esc(title.slice(0, comma + 2))}<em>${esc(title.slice(comma + 2))}</em>`;
  const sp = title.lastIndexOf(" ");
  return sp > 0 ? `${esc(title.slice(0, sp + 1))}<em>${esc(title.slice(sp + 1))}</em>` : esc(title);
}

/** Splits a title into word masks. Words stay inline-blocks so the title can rewrap while it shrinks. */
const words = (text: string) =>
  text
    .split(/\s+/)
    .map((w) => `<span class="case__word"><span class="case__word-in">${esc(w)}</span></span>`)
    .join(" ");

/** First four items of a list at most, so no block becomes a wall of text */
const cap = <T,>(list: T[] | undefined, n = 4) => (list ?? []).slice(0, n);

/** A frame's aspect ratio follows its media, clamped so very tall page captures crop from the top. 0 means sized by CSS. */
const ratioOf = (shot: Shot) => {
  const { w, h } = mediaInfo(shot.file);
  return Math.min(1.9, Math.max(1.25, w / h));
};

/** True when the frame and the media differ by more than 20%: show the whole image on a well instead of cropping */
const needsContain = (shot: Shot, frame: number) => {
  const { w, h } = mediaInfo(shot.file);
  return Math.abs(frame - w / h) / (w / h) > 0.2;
};

function figure(base: string, shot: Shot, cls: string, ratio = ratioOf(shot), frameRatio = ratio) {
  const contain = needsContain(shot, frameRatio) ? " case__frame--contain" : "";
  const caption = shot.caption ? `<figcaption class="label case__cap">${esc(shot.caption)}</figcaption>` : "";
  return `<figure class="case__fig ${cls}">
      <div class="case__frame plx${contain}"${ratio ? ` style="aspect-ratio: ${ratio.toFixed(3)}"` : ""} data-reveal="media" data-parallax><div class="plx__in">${mediaTag(base, shot.file, shot.alt)}</div></div>
      ${caption}
    </figure>`;
}

/**
 * The gallery: shots after the cover, at most four, laid out by count so every project gets a
 * deliberate composition: 8 of 12 centred on paper (alone, no band), 6+6 pairs on a full-bleed cobalt panel, and a
 * 7+5 row of unequal widths for the third and fourth.
 */
function gallery(base: string, p: Project) {
  const rest = p.shots.slice(1).filter((s) => !SAME_AS_COVER.has(s.file)).slice(0, 4);
  if (!rest.length) return "";
  const wide = (s: Shot) => `<div class="case__mod case__mod--wide page-x">${figure(base, s, "case__fig--wide")}</div>`;
  const pair = (a: Shot, b: Shot) => {
    const r = Math.max(ratioOf(a), ratioOf(b));
    return `<div class="case__mod case__mod--panel case__mod--pair page-x" data-cursor-tone="cobalt">${figure(base, a, "case__fig--half", r)}${figure(base, b, "case__fig--half", r)}</div>`;
  };
  /* The 5-column frame shares the 7-column frame's height, so its ratio is about 0.71 of it */
  const MINOR = 0.71;
  const asym = (a: Shot, b: Shot) => {
    const r = ratioOf(a);
    return `<div class="case__mod case__mod--asym page-x" style="--major-ratio: ${r.toFixed(3)}">${figure(base, a, "case__fig--major", r)}${figure(base, b, "case__fig--minor", 0, r * MINOR)}</div>`;
  };

  let html = "";
  if (rest.length === 1) html = wide(rest[0]);
  else if (rest.length === 2) html = pair(rest[0], rest[1]);
  else if (rest.length === 3) html = wide(rest[0]) + pair(rest[1], rest[2]);
  else html = pair(rest[0], rest[1]) + asym(rest[2], rest[3]);
  return `<section class="case__gallery" aria-label="Images">${html}</section>`;
}

function info(p: Project) {
  const pill = `<span class="case__pill${p.evidence === "Shipped" ? ' case__pill--solid" data-cursor-tone="cobalt' : ""}">${esc(p.evidence)}</span>`;
  const links = cap(p.links)
    .map((l) => `<a class="case__btn" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}<span aria-hidden="true">&nbsp;&#8599;</span></a>`)
    .join("");
  const list = (items: string[]) => `<ul class="case__list">${items.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
  return `<section class="case__info page-x" aria-label="Project facts">
    <dl class="case__facts">
      <div class="case__fact case__fact--year"><dt class="label" data-reveal="scramble">Year</dt><dd>${esc(p.year)}</dd></div>
      <div class="case__fact case__fact--org"><dt class="label" data-reveal="scramble">For</dt><dd>${esc(p.org)}</dd></div>
      <div class="case__fact case__fact--role"><dt class="label" data-reveal="scramble">Role</dt><dd>${list(p.role)}</dd></div>
      <div class="case__fact case__fact--kind"><dt class="label" data-reveal="scramble">Kind</dt><dd>${list(p.kinds.map((k) => KINDS[k]))}</dd></div>
      <div class="case__fact case__fact--status"><dt class="label" data-reveal="scramble">Status</dt><dd>${pill}${links ? `<span class="case__links">${links}</span>` : ""}</dd></div>
    </dl>
  </section>`;
}

/** Text columns on the grid: one item reads as a statement, two take 5 columns each, three take 3 */
const span = (n: number) => (n === 1 ? 7 : n === 3 ? 3 : 5);

function blocks(p: Project) {
  const problem = cap(p.problem);
  const work = cap(p.work);
  const prob = problem.length
    ? `<div class="case__block">
        <h2 class="label case__block-label" data-reveal="scramble">Problem</h2>
        <div class="case__block-text" style="--span: ${span(problem.length)}">${problem
          .map((t) => `<p class="${problem.length > 1 ? "case__col" : ""}" data-reveal="up">${esc(t)}</p>`)
          .join("")}</div>
      </div>`
    : "";
  const did =
    work.length === 1
      ? `<div class="case__block">
      <h2 class="label case__block-label" data-reveal="scramble">What I did</h2>
      <p class="case__block-text case__statement" data-reveal="lines">${esc(work[0])}</p>
    </div>`
      : `<div class="case__block">
      <h2 class="label case__block-label" data-reveal="scramble">What I did</h2>
      <ol class="case__block-text" style="--span: ${span(work.length)}">${work
        .map((t, i) => `<li class="case__col" data-reveal="up"><span class="label case__step-n" aria-hidden="true">${pad2(i + 1)}</span><p>${esc(t)}</p></li>`)
        .join("")}</ol>
    </div>`;
  return `<section class="case__blocks page-x" aria-label="Problem and work">${prob}${did}</section>`;
}

function decision(p: Project) {
  const dec = p.decision;
  if (!dec) return "";
  const col = (label: string, text: string) =>
    `<div class="case__dcol"><dt class="label" data-reveal="scramble">${label}</dt><dd data-reveal="up">${esc(text)}</dd></div>`;
  return `<section class="case__decision" aria-labelledby="case-decision">
    <div class="case__decision-in page-x">
      <p class="label case__decision-label" data-reveal="scramble">The decision</p>
      <h2 class="case__decision-title" id="case-decision" data-reveal="lines">${voiced(dec.title)}</h2>
      <dl class="case__dcols">${col("Context", dec.context)}${col("Choice", dec.choice)}${col("Cost", dec.cost)}</dl>
    </div>
  </section>`;
}

function result(p: Project) {
  if (restatesStatus(p)) return "";
  const items = cap(p.result);
  return `<section class="case__result page-x" aria-labelledby="case-result">
    <h2 class="label case__block-label" id="case-result" data-reveal="scramble">Result</h2>
    <ol class="case__results">${items
      .map((t, i) => `<li data-reveal="up"><span class="case__rnum" aria-hidden="true">${pad2(i + 1)}</span><p>${esc(t)}</p></li>`)
      .join("")}</ol>
  </section>`;
}

function next(base: string, p: Project) {
  const i = PROJECTS.findIndex((x) => x.slug === p.slug);
  const n = PROJECTS[(i + 1) % PROJECTS.length];
  const cover = n.shots[0];
  return `<a class="case__next page-x" href="${base}work/${n.slug}/" aria-label="Next case: ${esc(n.name)}">
    <span class="label case__next-label">Next</span>
    <span class="case__next-media plx" data-flip data-cursor="media" data-cursor-label="Next case" data-reveal="media" data-parallax>
      <span class="plx__in"><img src="${mediaUrl(base, cover.file, "jpg", true)}" alt="" loading="lazy" decoding="async"></span>
    </span>
    <span class="case__next-text">
      <span class="case__next-title">${esc(n.name)}</span>
      <span class="case__next-sub">${esc(n.headline)}</span>
    </span>
  </a>`;
}

function standard(base: string, p: Project) {
  return `<section class="case__summary page-x" aria-label="Summary">
        <p class="label case__block-label" data-reveal="scramble">Overview</p>
        <p class="case__lede" data-reveal="lines">${esc(p.summary)}</p>
      </section>
      ${blocks(p)}
      ${gallery(base, p)}
      ${decision(p)}
      ${result(p)}`;
}

/**
 * The case page, the auge details structure condensed. A sticky hero (cover media, 120% oversized)
 * sits behind a 100dvh spacer; a paper sheet slides up over it. The title is a sticky
 * difference-blend layer that shrinks into a compact label as the page scrolls.
 */
export function caseStudy(base: string, p: Project) {
  const i = PROJECTS.findIndex((x) => x.slug === p.slug);
  const cover = p.shots[0];
  return `
<article class="case" data-section="case" aria-labelledby="case-title">
  <div class="case__track">
    <div class="case__head">
      <h1 class="case__title" id="case-title">${words(p.name)}</h1>
      <span class="case__probe" aria-hidden="true"></span>
    </div>
    <div class="case__stage">
      <div class="case__hero${heroClass(p.slug)}">
        <div class="case__hero-media">${mediaTag(base, cover.file, cover.alt, { eager: true, className: "case__hero-img" })}</div>
        <div class="case__hero-scrim"></div>
        <div class="case__hero-dim"></div>
      </div>
      <div class="case__caption page-x">
        <p class="case__headline" data-reveal="lines" data-reveal-now data-delay="0.2"><em>${esc(p.headline)}</em></p>
        <p class="label case__index" data-reveal="scramble" data-reveal-now data-delay="0.3">${pad2(i + 1)} / ${pad2(PROJECTS.length)}</p>
      </div>
    </div>
    <div class="case__sheet">
      ${info(p)}
      ${STORIES[p.slug]?.(base, p) ?? standard(base, p)}
    </div>
  </div>
  ${next(base, p)}
</article>`;
}
