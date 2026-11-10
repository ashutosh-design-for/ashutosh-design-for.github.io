export const SITE = {
  name: "Ashutosh Rana",
  role: "Product designer",
  url: "https://ashutoshdesigns.me",
  /* The public inbox, as on the old site */
  email: "ashutosh.designs0402@gmail.com",
  /** Cal.com page with 15 and 30 minute intro calls */
  booking: "https://cal.com/ashutosh-rana",
  /* Based in California now; the About copy still says where he is from */
  location: "California, USA",
  /** The short place name beside every clock */
  city: "India",
  /** Every clock on the site runs on India time */
  timeZone: "Asia/Kolkata",
  availability: "Taking on one freelance project for November",
  description:
    "Ashutosh Rana, product designer. Design and frontend at ArmorIQ, lead product design at Ivish AI. Interfaces built for real data.",
};

export const SOCIALS = [
  { label: "X", handle: "@AshutoshDes", href: "https://x.com/AshutoshDes" },
  { label: "LinkedIn", handle: "ashutosh-rana04", href: "https://www.linkedin.com/in/ashutosh-rana04" },
  { label: "Behance", handle: "ashutoshrana04", href: "https://www.behance.net/ashutoshrana04" },
  { label: "Dribbble", handle: "Ash_Designs_", href: "https://dribbble.com/Ash_Designs_" },
  { label: "GitHub", handle: "Ashu-2006", href: "https://github.com/Ashu-2006" },
] as const;

export const NAV = [
  { label: "Work", path: "work/" },
  { label: "Playground", path: "playground/" },
  { label: "About", path: "about/" },
  { label: "Contact", path: "#contact" },
] as const;

export type Role = {
  org: string;
  title: string;
  when: string;
  note: string;
  current?: boolean;
  /** Project slugs made in this role. The home index links them and its preview cycles through them */
  projects: string[];
};

export const EXPERIENCE: Role[] = [
  {
    org: "ArmorIQ",
    title: "Design and frontend",
    when: "Now",
    note: "Security for AI agents. The platform, its design system and the internal tools.",
    current: true,
    projects: ["armoriq-platform", "armoriq-design-system", "social-content-tool", "armortools"],
  },
  {
    org: "Ivish AI",
    title: "Lead product designer",
    when: "Now",
    note: "Multimodal translation across text, voice and video.",
    current: true,
    projects: ["verbx"],
  },
  {
    org: "Summer of Bitcoin",
    title: "Designer track",
    when: "2026",
    note: "Redesigned Shopstr, a Nostr marketplace, and built the frontend.",
    projects: ["shopstr"],
  },
  {
    org: "Freelance",
    title: "Product design and build",
    when: "Ongoing",
    note: "Brand, web and product for founders and small teams.",
    projects: ["kuzara-green", "impressions-of-japan"],
  },
  {
    org: "Hackathons and side projects",
    title: "Whatever the weekend needs",
    when: "Since 2024",
    note: "Built against a deadline. One of them won an award.",
    projects: ["smile-share", "udte-bhawre", "dash"],
  },
];

export const EDUCATION = {
  org: "IIIT Jabalpur",
  title: "BTech, Design",
  when: "2024 - 2028",
  note: "Second year. Runner-up at Hackbyte 4.0, out of 120+ teams.",
};

export const PRINCIPLES = [
  {
    title: "Read the codebase first",
    body: "Before I open Figma I open the repo. The data shapes, the components that already exist and the API that answers slowly decide more of the interface than a moodboard does.",
  },
  {
    title: "Design every state",
    body: "Empty, loading, error, partial, the 400-row table and the name that does not fit. A screen that only works in the demo is a screen that breaks on Tuesday.",
  },
  {
    title: "Ship the system, not the screen",
    body: "One good page is easy. The tenth page staying consistent is the job, so the output is tokens, primitives and rules that the next person can follow without me.",
  },
] as const;

export const CAPABILITIES = {
  design: [
    "Product design",
    "Design systems and tokens",
    "Data-dense dashboards",
    "Onboarding flows",
    "AI product UX",
    "UX audits",
    "Landing pages",
  ],
  build: ["React and TypeScript", "HTML, CSS and motion", "Vite and Next.js", "Framer", "Figma, variables and libraries", "Cursor and v0"],
} as const;

export const FACTS = [
  { value: "2020", label: "Started learning design from YouTube, during lockdown" },
  { value: "2nd", label: "Place at Hackbyte 4.0, out of 120+ teams" },
  { value: "SoB '26", label: "Summer of Bitcoin, Designer track at Shopstr" },
] as const;

/** photo: a media key (public/media/voices/<name>.jpg); without one the slide shows initials */
export type Quote = { text: string; name: string; role: string; photo?: string };

/* Verbatim from the old site (ashutoshdesigns.me), typos fixed. Names and titles checked against LinkedIn, Oct 2026. */
export const QUOTES: Quote[] = [
  {
    text: "As a founding designer, Ashutosh led the design across multiple products, including mobile apps and SaaS platforms. He built a scalable component system in Figma, which improved design consistency and made it easier for developers to implement features efficiently.",
    name: "Ankith M",
    photo: "voices/ankith",
    role: "Co-founder, Ivish AI (VerbX)",
  },
  {
    text: "Helped us define the flows and designed core screens for our AI communication tools. His focus on clarity made complex AI interactions feel simple for users.",
    name: "Sahith Vutukuri",
    photo: "voices/sahith",
    role: "Founder and CEO, Ivish AI",
  },
  {
    text: "Our website conversion rate improved significantly thanks to Ashutosh's expertise.",
    name: "Sanjay Kumar",
    photo: "voices/sanjay",
    role: "Co-founder, Kuzara Green",
  },
  {
    text: "He went beyond visuals, restructuring our content and user flow made our offering much easier to understand. The site not only looked better but communicated our product more clearly.",
    name: "Ujjwal",
    photo: "voices/ujjwal",
    role: "Co-founder, BeBest",
  },
];

export type Skill = { name: string; sub: string; body: string; projects: string[] };

/** Home, Skill(s): four rows, each backed by images. Entries are "slug:shot", picked so no shot repeats and the covers in Work are not shown again. */
export const SKILLS: Skill[] = [
  {
    name: "Product design",
    sub: "Flows, states, interface",
    body: "From a rough brief to screens that hold up with real data. Flows first, then every state the happy path skips.",
    projects: ["armoriq-platform:1", "shopstr:1", "verbx:1", "smile-share:1", "shopstr:4"],
  },
  {
    name: "Design systems",
    sub: "Tokens, components, rules",
    body: "Tokens and primitives that work in Figma and in code, so the tenth page stays as consistent as the first.",
    projects: ["armoriq-design-system:0", "social-content-tool:1", "verbx:3", "shopstr:2"],
  },
  {
    name: "Frontend build",
    sub: "React, TypeScript, motion",
    body: "I build what I design, in React and TypeScript, so nothing gets lost between Figma and the repo.",
    projects: ["dash:0", "udte-bhawre:0", "papersseum:0", "verbx:5"],
  },
  {
    name: "Brand and web",
    sub: "Identity, landing pages",
    body: "Identities and marketing sites for founders. Fast to load, one clear message.",
    projects: ["kuzara-green:1", "impressions-of-japan:1", "kuzara-green:4", "impressions-of-japan:4"],
  },
];
