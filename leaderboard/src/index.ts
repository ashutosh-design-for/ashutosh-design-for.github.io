/**
 * The portfolio's one backend: a Cloudflare Worker in front of one D1 database. It holds the Night Drive
 * leaderboard and the contact form's inquiries.
 *
 *   GET  /scores?limit=10   best score per name, highest first: Entry[]
 *   POST /scores {name, score}   records a run, returns { rank } (1-based, among best-per-name)
 *   POST /inquiries {name, email, company, topic, message, page, website}   stores an inquiry, returns { ok: true }
 *
 * The game runs in the browser, so any score can be forged. The server only keeps that cheap:
 * strict name rules, a score ceiling, and a per-visitor rate limit keyed on a salted IP hash
 * (the raw IP is never stored).
 */

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  MAX_SCORE: string;
  IP_SALT: string;
}

type Entry = { name: string; score: number; at: string };

const NAME = /^[A-Za-z0-9_ ]{3,12}$/;
const PER_MINUTE = 3;
const PER_DAY = 60;

function cors(req: Request, env: Env): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  const ok = allowed.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

const json = (body: unknown, status: number, headers: Record<string, string>) =>
  new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

async function ipHash(req: Request, env: Env) {
  const ip = req.headers.get("CF-Connecting-IP") ?? "unknown";
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${env.IP_SALT}:${ip}`));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function top(env: Env, limit: number): Promise<Entry[]> {
  const { results } = await env.DB.prepare(
    `SELECT name, MAX(score) AS score, at FROM scores GROUP BY name COLLATE NOCASE ORDER BY score DESC, at ASC LIMIT ?`,
  )
    .bind(limit)
    .all<Entry>();
  return results;
}

async function submit(req: Request, env: Env, headers: Record<string, string>) {
  let body: { name?: unknown; score?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body must be JSON" }, 400, headers);
  }
  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const score = typeof body.score === "number" ? Math.floor(body.score) : NaN;
  if (!NAME.test(name)) return json({ error: "Name must be 3 to 12 letters, numbers, spaces or underscores" }, 400, headers);
  if (!Number.isFinite(score) || score < 0 || score > Number(env.MAX_SCORE)) return json({ error: "Score out of range" }, 400, headers);

  const hash = await ipHash(req, env);
  const counts = await env.DB.prepare(
    `SELECT
       SUM(CASE WHEN at > datetime('now', '-1 minute') THEN 1 ELSE 0 END) AS minute,
       SUM(CASE WHEN at > datetime('now', '-1 day') THEN 1 ELSE 0 END) AS day
     FROM scores WHERE ip_hash = ?`,
  )
    .bind(hash)
    .first<{ minute: number | null; day: number | null }>();
  if ((counts?.minute ?? 0) >= PER_MINUTE || (counts?.day ?? 0) >= PER_DAY) {
    return json({ error: "Too many submissions, try again in a minute" }, 429, headers);
  }

  await env.DB.prepare(`INSERT INTO scores (name, score, at, ip_hash) VALUES (?, ?, datetime('now'), ?)`).bind(name, score, hash).run();

  /* Where this run lands against everyone else's best, so a run below your own best still gets an honest rank */
  const better = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM (
       SELECT MAX(score) AS best FROM scores WHERE name <> ? COLLATE NOCASE GROUP BY name COLLATE NOCASE
     ) WHERE best > ?`,
  )
    .bind(name, score)
    .first<{ n: number }>();
  return json({ rank: (better?.n ?? 0) + 1 }, 201, headers);
}

/* Inquiries: email is the only required field (it is how a reply gets back); every text field has a length cap */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INQ_CAPS = { name: 80, email: 254, company: 80, topic: 40, message: 4000, page: 200 } as const;
const INQ_PER_HOUR = 5;
const INQ_PER_DAY = 20;

async function inquire(req: Request, env: Env, headers: Record<string, string>) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Body must be JSON" }, 400, headers);
  }
  if (!body || typeof body !== "object") return json({ error: "Body must be an object" }, 400, headers);
  /* Honeypot: a field people never see. A bot that fills it gets a quiet success and nothing is stored */
  if (typeof body.website === "string" && body.website.trim()) return json({ ok: true }, 201, headers);

  const field = (k: keyof typeof INQ_CAPS) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const v = { name: field("name"), email: field("email"), company: field("company"), topic: field("topic"), message: field("message"), page: field("page") };
  for (const k of Object.keys(INQ_CAPS) as (keyof typeof INQ_CAPS)[]) {
    if (v[k].length > INQ_CAPS[k]) return json({ error: `${k[0].toUpperCase()}${k.slice(1)} is too long`, field: k }, 400, headers);
  }
  if (!EMAIL.test(v.email)) return json({ error: "Enter a valid email so I can reply", field: "email" }, 400, headers);

  const hash = await ipHash(req, env);
  const counts = await env.DB.prepare(
    `SELECT
       SUM(CASE WHEN at > datetime('now', '-1 hour') THEN 1 ELSE 0 END) AS hour,
       SUM(CASE WHEN at > datetime('now', '-1 day') THEN 1 ELSE 0 END) AS day
     FROM inquiries WHERE ip_hash = ?`,
  )
    .bind(hash)
    .first<{ hour: number | null; day: number | null }>();
  if ((counts?.hour ?? 0) >= INQ_PER_HOUR || (counts?.day ?? 0) >= INQ_PER_DAY) {
    return json({ error: "Too many messages from here, try again later or email me directly" }, 429, headers);
  }

  await env.DB.prepare(
    `INSERT INTO inquiries (name, email, company, topic, message, page, at, ip_hash) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), ?)`,
  )
    .bind(v.name, v.email, v.company, v.topic, v.message, v.page, hash)
    .run();
  return json({ ok: true }, 201, headers);
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const headers = cors(req, env);
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
    if (url.pathname !== "/scores" && url.pathname !== "/inquiries") return json({ error: "Not found" }, 404, headers);

    try {
      if (url.pathname === "/inquiries") {
        return req.method === "POST" ? await inquire(req, env, headers) : json({ error: "Method not allowed" }, 405, headers);
      }
      if (req.method === "GET") {
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 10, 1), 50);
        return json(await top(env, limit), 200, { ...headers, "Cache-Control": "public, max-age=10" });
      }
      if (req.method === "POST") return await submit(req, env, headers);
      return json({ error: "Method not allowed" }, 405, headers);
    } catch (err) {
      console.error("api error", url.pathname, err);
      return json({ error: "Server error" }, 500, headers);
    }
  },
};
