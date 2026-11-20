import { DUR, ScrollTrigger, SplitText, d, gsap, reducedMotion, whenIdle } from "../core/motion";

/**
 * The shared reveal vocabulary. Pages write data attributes; mountReveals() animates them once each
 * scrolls into view, and never while a page transition is running. Nothing fades in place: text rises
 * out of a mask, media wipes open.
 *
 *   data-reveal="rise"      element inside a .mask parent, rises yPercent 130 to 0
 *   data-reveal="lines"     a paragraph or heading, split into masked lines that rise with stagger
 *   data-reveal="up"        a block (row, card) that lifts 24px and fades in
 *   data-reveal="scramble"  short label text resolves through random glyphs
 *   data-reveal="media"     a wrapper whose clip-path wipes open while its first child scales 1.2 to 1
 *   data-reveal="tile"      a deck tile that lifts 12px and fades in, once its media has decoded
 *   data-parallax           a .plx wrapper; its .plx__in child drifts with scroll
 *   data-delay="0.2"        optional extra delay in seconds, on any of the above
 *   data-reveal-now         reveal on mount instead of on scroll (heroes)
 */

const ROOT_MARGIN = "0px 0px -8% 0px";

const delayOf = (el: Element) => Number((el as HTMLElement).dataset.delay || 0);

export function revealOne(el: HTMLElement, index = 0): gsap.core.Animation | null {
  const kind = el.dataset.reveal;
  const delay = delayOf(el);
  if (kind === "rise") {
    return gsap.fromTo(el, { y: 0, yPercent: 130 }, { y: 0, yPercent: 0, duration: d(DUR.m), ease: "expoOut", delay });
  }
  if (kind === "lines") {
    const split = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "line" });
    el.style.visibility = "visible";
    return gsap.fromTo(
      split.lines,
      { yPercent: 130 },
      { yPercent: 0, duration: d(0.8), ease: "expoOut", stagger: 0.08, delay, onComplete: () => split.revert() },
    );
  }
  if (kind === "up") {
    return gsap.fromTo(el, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: d(0.6), ease: "expoOut", delay });
  }
  if (kind === "scramble") {
    const text = el.dataset.text || el.textContent || "";
    el.style.visibility = "visible";
    return gsap.to(el, {
      duration: d(0.8),
      delay,
      ease: "none",
      scrambleText: { text, chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", revealDelay: 0.25, speed: 0.8 },
    });
  }
  if (kind === "tile") {
    /* The deck reveal: a short lift and fade, light enough to sit through on every visit */
    return gsap.fromTo(
      el,
      { y: 12, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: d(0.5),
        ease: "power3.out",
        delay,
        onComplete: () => {
          el.dataset.revealed = "1";
          gsap.set(el, { clearProps: "transform,opacity,visibility" });
        },
      },
    );
  }
  if (kind === "media") {
    const inner = el.firstElementChild as HTMLElement | null;
    const from = index % 2 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
    const tl = gsap.timeline({
      delay,
      onComplete: () => {
        el.dataset.revealed = "1";
        gsap.set([el, inner], { clearProps: "clipPath,scale" });
      },
    });
    tl.fromTo(el, { clipPath: from }, { clipPath: "inset(0% 0% 0% 0%)", duration: d(DUR.l), ease: "expoOut" }, 0);
    if (inner) tl.fromTo(inner, { scale: 1.2 }, { scale: 1, duration: d(DUR.l), ease: "expoOut" }, 0);
    return tl;
  }
  return null;
}

/** Waits for the media inside a wrapper to decode, at most 3s, so wipes never open on a blank box */
function mediaReady(el: HTMLElement) {
  const media = el.querySelector("img, video");
  if (!media) return Promise.resolve();
  const ready =
    media instanceof HTMLImageElement
      ? media.complete
        ? Promise.resolve()
        : media.decode().catch(() => {})
      : (media as HTMLVideoElement).readyState >= 2
        ? Promise.resolve()
        : new Promise<void>((r) => media.addEventListener("loadeddata", () => r(), { once: true }));
  return Promise.race([ready, new Promise<void>((r) => setTimeout(r, 3000))]);
}

export function mountReveals(root: HTMLElement): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  const plx = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
  const anims: gsap.core.Animation[] = [];
  const triggers: ScrollTrigger[] = [];
  let io: IntersectionObserver | null = null;
  let dead = false;

  if (reducedMotion()) {
    els.forEach((el) => gsap.set(el, { clearProps: "all", visibility: "visible", opacity: 1 }));
    return () => {};
  }

  let mediaIndex = 0;
  const order = new Map<HTMLElement, number>();
  els.forEach((el) => {
    if (el.dataset.reveal === "media") order.set(el, mediaIndex++);
  });

  const play = async (el: HTMLElement) => {
    if (el.dataset.reveal === "media" || el.dataset.reveal === "tile") await mediaReady(el);
    if (dead) return;
    const anim = revealOne(el, order.get(el) ?? 0);
    if (anim) anims.push(anim);
  };

  whenIdle().then(() => {
    if (dead) return;
    /* A riser sits 130% below its overflow-hidden mask, so it is never "visible": watch the mask instead */
    const watched = new Map<Element, HTMLElement[]>();
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io?.unobserve(entry.target);
          watched.get(entry.target)?.forEach(play);
          watched.delete(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    els.forEach((el) => {
      if (el.hasAttribute("data-reveal-now")) return void play(el);
      const target = el.dataset.reveal === "rise" && el.parentElement ? el.parentElement : el;
      if (!watched.has(target)) {
        watched.set(target, []);
        io!.observe(target);
      }
      watched.get(target)!.push(el);
    });

    plx.forEach((wrap) => {
      const inner = wrap.querySelector<HTMLElement>(".plx__in");
      if (!inner) return;
      const tween = gsap.fromTo(
        inner,
        { yPercent: -4.545 },
        { yPercent: 4.545, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: true } },
      );
      anims.push(tween);
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
  });

  return () => {
    dead = true;
    io?.disconnect();
    anims.forEach((a) => a.kill());
    triggers.forEach((t) => t.kill());
  };
}
