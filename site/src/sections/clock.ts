import { SITE } from "../content";

const fmt = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: SITE.timeZone });

/** "4:07 pm" in India (SITE.timeZone) */
export const localTime = () => fmt.format(new Date()).replace(/\s?(am|pm)$/i, (m) => ` ${m.trim().toLowerCase()}`);

/** Runs fn now and then just after each minute turns, so every clock on the page flips together. Returns a stop. */
export function onMinute(fn: () => void): () => void {
  let id = 0;
  const loop = () => {
    fn();
    id = window.setTimeout(loop, 60000 - (Date.now() % 60000) + 20);
  };
  loop();
  return () => clearTimeout(id);
}

/** Keeps every [data-clock] inside root on SITE.timeZone time. Returns a cleanup that stops it. */
export function mountClock(root: ParentNode): () => void {
  const els = Array.from(root.querySelectorAll<HTMLElement>("[data-clock]"));
  if (!els.length) return () => {};
  const tick = () => {
    const now = localTime();
    const iso = new Date().toISOString();
    els.forEach((el) => {
      if (el.textContent !== now) el.textContent = now;
      el.setAttribute("datetime", iso);
    });
  };
  return onMinute(tick);
}
