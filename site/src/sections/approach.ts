import { gsap, reducedMotion } from "../core/motion";

/**
 * The middle of the home page, all scroll-linked:
 * - What I do: the statement's words fill from faint to full as it scrolls through the viewport.
 * - The stack (desktop): What I do and Credits are sticky (styles/home.css). The collage column rises over the
 *   statement first; once Credits reaches the top, the ink column rises into the empty half over one screen of
 *   scroll (the stack's gap).
 * Reduced motion and phones keep plain flow with everything at rest.
 */
export function mountApproach(root: HTMLElement): () => void {
  if (reducedMotion()) return () => {};
  const tweens: gsap.core.Animation[] = [];

  /* Sticky elements report where they are stuck, not where they sit, so every trigger is measured from the
     stack, which stays in flow, plus the heights of what comes before. */
  const stk = root.querySelector<HTMLElement>(".hstk");
  const ap = stk?.querySelector<HTMLElement>(".ap");
  const cr = stk?.querySelector<HTMLElement>(".cr");
  const gap = stk?.querySelector<HTMLElement>(".hstk__gap");
  const stacked = !!(stk && ap && cr && gap && gap.offsetHeight);
  const crTop = () => (ap ? ap.offsetHeight : 0);

  const text = root.querySelector<HTMLElement>("[data-ap-text]");
  const words = text ? Array.from(text.querySelectorAll<HTMLElement>(".ap__w")) : [];
  if (text && words.length) {
    /* Stacked: fill while the statement comes up and finish before the collage has covered half of it */
    const st = stacked
      ? { trigger: stk, start: "top 75%", end: () => `top+=${innerHeight * 0.35} top`, scrub: true }
      : { trigger: text, start: "top 78%", end: "bottom 42%", scrub: true };
    tweens.push(gsap.fromTo(words, { opacity: 0.16 }, { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: st }));
  }

  /* The ink column waits a screen below its place, then rises in while Credits holds at the top */
  const ink = cr?.querySelector<HTMLElement>("[data-cr-ink]");
  if (stacked && ink) {
    tweens.push(
      gsap.fromTo(
        ink,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: stk, start: () => `top+=${crTop()} top`, end: () => `top+=${crTop() + gap!.offsetHeight} top`, scrub: true },
        },
      ),
    );
  }
  const grid = root.querySelector<HTMLElement>("[data-cr-grid]");
  if (grid) {
    const tiles = Array.from(grid.querySelectorAll<HTMLElement>(".cr__tile"));
    const st = stacked
      ? { trigger: stk, start: () => `top+=${crTop()} bottom`, end: () => `top+=${crTop() + gap!.offsetHeight} top`, scrub: true }
      : { trigger: grid, start: "top bottom", end: "bottom top", scrub: true };
    tweens.push(gsap.fromTo(tiles, { yPercent: (i: number) => 18 + (i % 3) * 10 }, { yPercent: (i: number) => -8 - (i % 3) * 6, ease: "none", scrollTrigger: st }));
  }

  return () => {
    tweens.forEach((t) => {
      t.scrollTrigger?.kill();
      t.kill();
    });
    words.forEach((w) => gsap.set(w, { clearProps: "opacity" }));
    if (cr) gsap.set(Array.from(cr.children), { clearProps: "transform" });
  };
}
