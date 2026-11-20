import { LEDE, PROJECTS, SITE } from "../content";
import { about } from "./about";
import { caseStudy } from "./case";
import { chrome as chromeHtml } from "./chrome";
import { footer } from "./footer";
import { contact } from "./contact";
import { home } from "./home";
import { playground } from "./playground";
import { workIndex } from "./work";

/* Resume drafts are local only (gitignored, placeholder numbers). The glob is empty in a clean checkout, so the
   route falls through to not found there, and production never matches it either way. */
type ResumeModule = { isResume(id: string): boolean; resumePage(base: string, variant: string | null): string };
const resume = import.meta.env.DEV
  ? import.meta.glob<ResumeModule>("./resume.ts", { eager: true })["./resume.ts"]
  : undefined;

export type Route =
  | { kind: "home" }
  | { kind: "work" }
  | { kind: "case"; slug: string }
  | { kind: "about" }
  | { kind: "playground" }
  | { kind: "contact" }
  | { kind: "resume"; variant: string | null }
  | { kind: "notfound" };
export type RouteKind = Route["kind"];
export type Rendered = { title: string; description: string; html: string };

export function match(pathname: string, base: string): Route {
  const rest = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\//, "");
  const clean = rest.replace(/index\.html$/, "").replace(/\/+$/, "");
  if (clean === "") return { kind: "home" };
  if (clean === "work") return { kind: "work" };
  if (clean === "about") return { kind: "about" };
  if (clean === "playground") return { kind: "playground" };
  if (clean === "contact") return { kind: "contact" };
  /* Resume drafts carry placeholder numbers, so they exist on the dev server only and are never prerendered */
  if (import.meta.env.DEV && resume) {
    const r = clean.match(/^resume(?:\/([a-z0-9-]+))?$/);
    if (r && (!r[1] || resume.isResume(r[1]))) return { kind: "resume", variant: r[1] ?? null };
  }
  const m = clean.match(/^work\/([a-z0-9-]+)$/);
  if (m && PROJECTS.some((p) => p.slug === m[1])) return { kind: "case", slug: m[1] };
  return { kind: "notfound" };
}

/** The words the curtain's title card shows for a route */
export function label(route: Route): string {
  if (route.kind === "case") return PROJECTS.find((p) => p.slug === route.slug)!.name;
  if (route.kind === "work") return "Work";
  if (route.kind === "about") return "About";
  if (route.kind === "playground") return "Playground";
  if (route.kind === "contact") return "Contact";
  if (route.kind === "resume") return "Resume";
  if (route.kind === "notfound") return "Lost";
  return "Index";
}

export const chrome = (base: string) => chromeHtml(base);

function notFound(base: string) {
  return `
<section class="nf" data-section="notfound" aria-labelledby="nf-title">
  <p class="label">Error 404</p>
  <h1 class="nf__title" id="nf-title"><span class="mask"><span class="mask__in" data-reveal="rise">This page <em>never shipped.</em></span></span></h1>
  <a class="nf__home" href="${base}" data-nf-home data-reveal="up" data-delay="0.08">Back to home</a>
  <div class="nf__play" data-reveal="up" data-delay="0.16">
    <div class="nf__stage" data-nf-stage></div>
    <button class="nf__os" type="button" data-play-os>Or play it in 1998</button>
  </div>
</section>`;
}

export function render(route: Route, base: string): Rendered {
  if (route.kind === "case") {
    const p = PROJECTS.find((x) => x.slug === route.slug)!;
    return { title: `${p.name}, ${SITE.name}`, description: `${p.headline}. ${p.summary}`, html: caseStudy(base, p) + footer(base) };
  }
  if (route.kind === "about") {
    return { title: `About, ${SITE.name}`, description: SITE.description, html: about(base) + footer(base) };
  }
  if (route.kind === "work") {
    return { title: `Work, ${SITE.name}`, description: LEDE.work, html: workIndex(base) + footer(base) };
  }
  if (route.kind === "playground") {
    /* An infinite board has no bottom, so the playground carries no footer */
    return { title: `Playground, ${SITE.name}`, description: LEDE.play, html: playground(base) };
  }
  if (route.kind === "contact") {
    return { title: `Contact, ${SITE.name}`, description: SITE.description, html: contact(base) };
  }
  if (import.meta.env.DEV && resume && route.kind === "resume") {
    return { title: `Resume, ${SITE.name}`, description: SITE.description, html: resume.resumePage(base, route.variant) };
  }
  if (route.kind === "notfound") {
    return { title: `Not found, ${SITE.name}`, description: SITE.description, html: notFound(base) + footer(base) };
  }
  return { title: `${SITE.name}, product designer`, description: SITE.description, html: home(base) + footer(base) };
}

/** Every route as a static file, for the build */
export function prerender(base: string) {
  const routes: { path: string; route: Route }[] = [
    { path: "index.html", route: { kind: "home" } },
    { path: "work/index.html", route: { kind: "work" } },
    { path: "about/index.html", route: { kind: "about" } },
    { path: "playground/index.html", route: { kind: "playground" } },
    { path: "contact/index.html", route: { kind: "contact" } },
    ...PROJECTS.map((p) => ({ path: `work/${p.slug}/index.html`, route: { kind: "case", slug: p.slug } as Route })),
    { path: "404.html", route: { kind: "notfound" } },
  ];
  return routes.map(({ path, route }) => ({ path, kind: route.kind, ...render(route, base) }));
}
