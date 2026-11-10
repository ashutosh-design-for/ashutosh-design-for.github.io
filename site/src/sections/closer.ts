import { SITE } from "../content";
import { mountClock } from "./clock";
import { fitText, mountCopy, mountScrambleHover } from "./kit";
import { mountSwaps } from "./swap";

/** How each topic reads inside "I'd like to talk about ..." */
const TOPIC_PHRASE: Record<string, string> = {
  "Product design": "product design",
  "Design system": "a design system",
  "Frontend build": "a frontend build",
  "Full-time role": "a full-time role",
  "Something else": "something else",
};

/** The inquiry's email, from whatever has been filled in. Every field is optional, so a blank form still reads. */
export function composeInquiry(name: string, company: string, topic: string, message: string) {
  const who = [name.trim(), company.trim()].filter(Boolean).join(", ");
  const subject = `${topic || "Hello"}${company.trim() ? `, ${company.trim()}` : ""}`;
  const lines = [`Hi Ashutosh,`, ``, message.trim() || `I'd like to talk about ${TOPIC_PHRASE[topic] ?? "a project"}.`, ``, who ? `Thanks,\n${who}` : `Thanks`];
  return { subject, body: lines.join("\n") };
}

/** The API base (the Cloudflare Worker in ../leaderboard that also serves Night Drive scores). Unset means no backend. */
const API: string = typeof import.meta.env.VITE_LEADERBOARD_URL === "string" ? import.meta.env.VITE_LEADERBOARD_URL.replace(/\/$/, "") : "";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIMEOUT_MS = 12000;

/**
 * Contact: posts the inquiry to the API's /inquiries route, which stores it in D1. States: idle, invalid (email is
 * the one required field), sending (button busy, double submits ignored), sent (form cleared), and failed (network,
 * timeout, rate limit or server error), where the fine print offers the same message as a prefilled email instead.
 * With no API configured the form falls back to opening the visitor's mail app, as it did before the backend.
 */
export function mountInquiry(form: HTMLFormElement): () => void {
  const status = form.querySelector<HTMLElement>("[data-inquiry-status]");
  const button = form.querySelector<HTMLButtonElement>(".iq__send");
  const emailIn = form.querySelector<HTMLInputElement>('input[name="email"]');
  const idleText = status?.textContent ?? "";
  let busy = false;
  let ctrl: AbortController | null = null;

  const say = (state: "idle" | "sending" | "sent" | "error", text: string, mailto?: string) => {
    if (!status) return;
    status.dataset.state = state;
    status.textContent = text;
    if (mailto) {
      const a = document.createElement("a");
      a.href = mailto;
      a.textContent = "Email it instead";
      status.append(" ", a);
    }
  };
  const fields = () => {
    const d = new FormData(form);
    const get = (k: string) => String(d.get(k) ?? "").trim();
    return { name: get("name"), email: get("email"), company: get("company"), topic: get("topic"), message: get("message"), website: get("website") };
  };
  const mailtoFor = (v: ReturnType<typeof fields>) => {
    const { subject, body } = composeInquiry(v.name, v.company, v.topic, v.message);
    return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const markEmail = (bad: boolean) => emailIn?.setAttribute("aria-invalid", String(bad));
  const clearInvalid = () => {
    if (emailIn?.getAttribute("aria-invalid") === "true" && EMAIL.test(emailIn.value.trim())) {
      markEmail(false);
      say("idle", idleText);
    }
  };

  const send = async (e: Event) => {
    e.preventDefault();
    if (busy) return;
    const v = fields();
    if (!API) {
      window.location.href = mailtoFor(v);
      return;
    }
    if (!EMAIL.test(v.email)) {
      markEmail(true);
      say("error", "Add your email so I can reply.");
      emailIn?.focus();
      return;
    }
    markEmail(false);
    busy = true;
    button?.setAttribute("aria-busy", "true");
    say("sending", "Sending...");
    ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl?.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${API}/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, page: location.pathname }),
        signal: ctrl.signal,
      });
      if (res.ok) {
        form.reset();
        say("sent", `Sent. I'll reply to ${v.email}.`);
        return;
      }
      const err = (await res.json().catch(() => null)) as { error?: string; field?: string } | null;
      if (res.status === 400 && err?.field === "email") {
        markEmail(true);
        emailIn?.focus();
      }
      say("error", `${err?.error ?? "That didn't go through"}.`,mailtoFor(v));
    } catch (err) {
      if (!form.isConnected) return;
      console.warn("Inquiry failed to send", err);
      say("error", "Couldn't reach the server.", mailtoFor(v));
    } finally {
      window.clearTimeout(timer);
      busy = false;
      ctrl = null;
      button?.removeAttribute("aria-busy");
    }
  };
  form.addEventListener("submit", send);
  emailIn?.addEventListener("input", clearInvalid);
  return () => {
    ctrl?.abort();
    form.removeEventListener("submit", send);
    emailIn?.removeEventListener("input", clearInvalid);
  };
}

/** Footer: the wordmark fitted to the full width, every letter a face-swap target */
export function mountSignature(link: HTMLElement): () => void {
  const inner = link.querySelector<HTMLElement>(".foot__mark-in");
  if (!inner) return () => {};
  const { stop } = mountSwaps(link);
  const unfit = fitText(link, inner, "--mark-fs");
  return () => {
    unfit();
    stop();
  };
}

/** Wires every closer behaviour found in scope: copy, scramble links, clocks, the inquiry form and the wordmark */
export function mountClosing(scope: HTMLElement): () => void {
  const all = <T extends HTMLElement>(sel: string) => Array.from(scope.querySelectorAll<T>(sel));
  const cleanups = [
    mountCopy(scope),
    mountScrambleHover(scope),
    mountClock(scope),
    ...all<HTMLFormElement>("form[data-inquiry]").map(mountInquiry),
    ...all("[data-sig]").map(mountSignature),
  ];
  return () => cleanups.forEach((fn) => fn());
}
