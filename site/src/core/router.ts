import { label, match, render, type Route } from "../templates/routes";
import { bus } from "./bus";
import { ScrollTrigger, setPhase } from "./motion";
import { scrollToTarget } from "./scroll";

export type Cleanup = () => void;
export type View = { mount(root: HTMLElement, route: Route): Cleanup | void };

/**
 * What the transition layer is told about a navigation. `thumb` is the element marked
 * data-flip inside the clicked link, if any, so the curtain can fly it onto the title card.
 * `quick` is true for browser back/forward, which gets a shorter curtain with no title hold.
 */
export type TransitionRequest = { route: Route; title: string; thumb: HTMLElement | null; quick: boolean };
export type Transition = {
  /** Resolves once the screen is fully covered and the old page may be destroyed */
  cover(req: TransitionRequest): Promise<void>;
  /** Called after the new page has mounted. Resolves when the new page is fully visible. */
  reveal(req: TransitionRequest): Promise<void>;
};

const BASE = import.meta.env.BASE_URL;

/* The resume view is local only (gitignored); a clean checkout has no file, so the route loads not found */
const resumeView = import.meta.env.DEV ? import.meta.glob<View>("../views/resume.ts")["../views/resume.ts"] : undefined;

const views: Record<Route["kind"], () => Promise<View>> = {
  home: () => import("../views/home"),
  case: () => import("../views/case"),
  work: () => import("../views/work"),
  about: () => import("../views/about"),
  playground: () => import("../views/playground"),
  contact: () => import("../views/contact"),
  /* Dev only: production never matches a resume route, and this keeps its chunk out of the build */
  resume: resumeView ?? (() => import("../views/notfound")),
  notfound: () => import("../views/notfound"),
};

let transition: Transition = { cover: async () => {}, reveal: async () => {} };
let current: { route: Route; cleanup?: Cleanup | void } | null = null;
let busy = false;
let pendingPop: URL | null = null;
const hooks: ((route: Route) => void)[] = [];

const main = () => document.getElementById("main")!;
const key = (r: Route) => (r.kind === "case" ? `case:${r.slug}` : r.kind === "resume" ? `resume:${r.variant}` : r.kind);

/** The transition layer registers itself here. Until then navigation is a hard cut. */
export const setTransition = (t: Transition) => void (transition = t);

/** Runs after every mount (chrome refresh, media observers) */
export const afterMount = (fn: (route: Route) => void) => hooks.push(fn);

export const currentRoute = () => current?.route ?? null;

async function mount(route: Route, firstLoad: boolean) {
  const root = main();
  if (!firstLoad || !root.firstElementChild) {
    const page = render(route, BASE);
    root.innerHTML = page.html;
    document.title = page.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", page.description);
  }
  const view = await views[route.kind]();
  const cleanup = view.mount(root, route);
  current = { route, cleanup };
  hooks.forEach((fn) => fn(route));
  bus.emit("route:enter", { kind: route.kind, slug: route.kind === "case" ? route.slug : undefined });
  ScrollTrigger.refresh();
}

function unmount() {
  if (!current) return;
  bus.emit("route:leave", { kind: current.route.kind, slug: current.route.kind === "case" ? current.route.slug : undefined });
  current.cleanup?.();
  ScrollTrigger.getAll().forEach((t) => t.kill());
  current = null;
}

/** Client-side navigation with the curtain. Safe to call from anywhere, including the OS layer. */
export async function navigate(url: URL | string, opts: { push?: boolean; thumb?: HTMLElement | null; quick?: boolean } = {}) {
  const target = typeof url === "string" ? new URL(url, location.origin + BASE) : url;
  if (busy) {
    /* Back/forward already changed the URL, so it cannot be dropped: remember where the browser now points */
    if (opts.push === false) pendingPop = new URL(location.href);
    return;
  }
  const route = match(target.pathname, BASE);
  if (current && key(current.route) === key(route)) {
    if (opts.push !== false && target.href !== location.href) history.pushState({}, "", target);
    scrollToTarget(target.hash || 0);
    return;
  }
  const req: TransitionRequest = { route, title: label(route), thumb: opts.thumb ?? null, quick: Boolean(opts.quick) };
  busy = true;
  try {
    setPhase("covering");
    await transition.cover(req);
    /* A back/forward press under the curtain wins: mount where the browser points and push nothing */
    let dest = target;
    let destRoute = route;
    let push = opts.push !== false;
    if (pendingPop) {
      dest = pendingPop;
      destRoute = match(dest.pathname, BASE);
      push = false;
      pendingPop = null;
    }
    unmount();
    if (push) history.pushState({}, "", dest);
    scrollToTarget(0, { immediate: true });
    await mount(destRoute, false);
    /* Re-pin after mount: ScrollTrigger.refresh() and leftover Lenis momentum can otherwise restore an old offset */
    ScrollTrigger.clearScrollMemory("manual");
    if (dest.hash) scrollToTarget(dest.hash, { immediate: true });
    else {
      window.scrollTo(0, 0);
      scrollToTarget(0, { immediate: true });
    }
    main().focus({ preventScroll: true });
    setPhase("revealing");
    await transition.reveal(req);
  } finally {
    setPhase("idle");
    busy = false;
    bus.emit("cursor:refresh", {});
  }
  if (pendingPop) {
    const pop = pendingPop;
    pendingPop = null;
    navigate(pop, { push: false, quick: true });
  }
}

export async function initRouter() {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const route = match(location.pathname, BASE);
  await mount(route, true);
  if (location.hash) requestAnimationFrame(() => scrollToTarget(location.hash, { immediate: true }));

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element | null)?.closest("a");
    if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-native")) return;
    const url = new URL(a.href, location.href);
    if (url.protocol === "mailto:" || url.origin !== location.origin || !url.pathname.startsWith(BASE)) return;
    e.preventDefault();
    navigate(url, { thumb: a.querySelector<HTMLElement>("[data-flip]") });
  });

  window.addEventListener("popstate", () => navigate(new URL(location.href), { push: false, quick: true }));
}
