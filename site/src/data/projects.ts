export type Kind = "product" | "system" | "tool" | "brand" | "web" | "concept";

export const KINDS: Record<Kind, string> = {
  product: "Product",
  system: "Systems",
  tool: "Tools",
  web: "Web",
  brand: "Brand and print",
  concept: "Concepts",
};

/** What the result actually is. Kept separate so an output is never presented as a customer outcome. */
export type Evidence = "Shipped" | "Live prototype" | "In progress" | "Delivered to client" | "Concept";

export type Shot = {
  /** Path under public/media without extension, e.g. "shopstr/04" */
  file: string;
  alt: string;
  caption?: string;
};

export type Decision = { title: string; context: string; choice: string; cost: string };

export type Project = {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  org: string;
  year: string;
  role: string[];
  kinds: Kind[];
  tier: "case" | "more";
  evidence: Evidence;
  problem?: string[];
  work: string[];
  decision?: Decision;
  result: string[];
  links?: { label: string; href: string }[];
  /** The first shot is the cover */
  shots: Shot[];
};

export const PROJECTS: Project[] = [
  {
    slug: "armoriq-platform",
    name: "ArmorIQ platform",
    headline: "Making AI agent security understandable at enterprise scale",
    summary:
      "Product design and frontend on ArmorIQ's security platform, turning policies, agent activity and investigation data into an interface people can reason through and act on.",
    org: "ArmorIQ",
    year: "2026",
    role: ["Product design", "Design engineering", "React frontend"],
    kinds: ["product", "system"],
    tier: "case",
    evidence: "In progress",
    problem: [
      "Agent security is a hard interface problem. The product has to show what an agent attempted, what a policy allowed or blocked, and what a person should do next.",
      "The previous frontend had grown into many routes and inconsistent patterns. Making one screen cleaner would not make the system coherent.",
    ],
    work: [
      "I helped rebuild the interface around a shared visual language and reusable interaction patterns: information-dense dashboards, detail surfaces, policy authoring, onboarding and role-relevant overviews.",
      "I work in the React codebase as well as the design system, so a decision gets checked against real data shapes, component behaviour and implementation constraints before it is final.",
      "Role-relevant overviews follow one rule: change the order and density of information for a role, keep the navigation stable. A security lead and an engineer land on different first screens inside the same product.",
    ],
    decision: {
      title: "One policy, three views",
      context: "A policy can be written in a form, edited as YAML or laid out on a canvas. Each suits a different person and a different moment.",
      choice:
        "All three are representations of one underlying policy object. None of them is allowed to become its own copy that drifts or drops fields.",
      cost: "All three views have to round-trip every field, so adding a field to a policy means touching three editors. That is slower to build and much cheaper than a support ticket about a rule that silently changed.",
    },
    result: [
      "A more consistent foundation for the platform: shared primitives, a token system and product patterns that new features reuse.",
      "The rebuild and its backend integration are staged over time. What is shown here is implemented interface work, not a customer or revenue claim.",
    ],
    shots: [
      {
        file: "armoriq-platform/cover",
        alt: "ArmorIQ security posture overview switching between role views",
        caption: "Overview. One product, re-ordered per role, so the most useful security signal is first without forking the navigation.",
      },
      {
        file: "armoriq-platform/01",
        alt: "Tab strip with Needs you, Active, Resolved and All counts, underline sliding between tabs",
        caption: "Queues. Counts sit in the tab, so the state of the work is readable before anything is opened.",
      },
    ],
  },
  {
    slug: "shopstr",
    name: "Shopstr",
    headline: "Making a Bitcoin marketplace feel usable beyond its protocol",
    summary:
      "For Summer of Bitcoin 2026 I redesigned Shopstr's buyer and seller experience and built a responsive frontend people can click through, from browsing to checkout and wallet.",
    org: "Summer of Bitcoin",
    year: "2026",
    role: ["Product design", "Research", "Design system", "Frontend"],
    kinds: ["product", "system"],
    tier: "case",
    evidence: "Live prototype",
    problem: [
      "Shopstr lets people trade goods for bitcoin over Nostr. It has to keep the rules of that ecosystem while answering a buyer's ordinary questions: what am I buying, can I trust this seller, what happens when I pay, and where does my order go?",
      "A visual refresh would have left every one of those questions open.",
    ],
    work: [
      "I mapped the buyer and seller journeys, rebuilt the information architecture, designed the component and motion systems and built a mobile-first frontend. Browse, product, cart, checkout, orders, reviews, messages, wallet, selling and communities are all in it.",
      "Each screen ships with loading, empty, no-results, not-found and populated states, because a marketplace has to work when the data is missing as well as when the demo is full.",
      "The design follows the real domain. Shipping options come from the listing, order actions depend on the person's role and community moderation follows Nostr's approval model. All data sits behind a hook layer, so connecting the live backend is a defined integration task instead of a redesign of every screen.",
    ],
    decision: {
      title: "Sats are the truth, currency is a label",
      context: "Buyers think in their own currency. The protocol and the seller think in sats, and the exchange rate moves while someone is checking out.",
      choice: "Sats stay the stored value everywhere. A currency quote is a display layer, and it locks for the length of checkout.",
      cost: "The quote can drift from the live rate during a slow checkout. I accepted that over a price changing under someone's thumb right before they pay.",
    },
    result: [
      "The standalone frontend, Figma system, flow map and maintainer handoff are complete and public.",
      "It is not yet connected to Shopstr's live Nostr backend or merged upstream, so this is a built and documented product, not a claim of adoption or conversion lift.",
    ],
    links: [
      { label: "Live redesign", href: "https://shopstr-redesign.vercel.app" },
      { label: "Code", href: "https://github.com/Ashu-2006/shopstr-redesign" },
      { label: "Figma", href: "https://www.figma.com/design/9goihW1i0AcsxkFJ0SdvZY/Shopstr-Redesign" },
    ],
    shots: [
      { file: "shopstr/cover", alt: "Shopstr redesign marketplace home on a laptop" },
      {
        file: "shopstr/01",
        alt: "Shopstr product page for a stoneware mug on a laptop",
        caption: "Browse to product. One listing language, so a buyer can scan the feed, judge a product and keep their place.",
      },
      {
        file: "shopstr/02",
        alt: "FigJam board of the buyer journey",
        caption: "Buyer journey. Discover, land, explore, evaluate, decide, pay, confirm and receive, mapped before any screen was drawn.",
      },
      {
        file: "shopstr/03",
        alt: "Design system iteration: neutral first, accents loud",
        caption: "System. Neutral ink and paper carry the structure. One accent does the emphasis and the playful set stays for moments that earn it.",
      },
      {
        file: "shopstr/04",
        alt: "Checkout review step showing order total in sats",
        caption: "Checkout. A review-before-pay step puts the order and its shipping terms in view before the irreversible action.",
      },
      {
        file: "shopstr/05",
        alt: "Seller listings and wallet balance screens",
        caption: "Wallet and orders. Payment and fulfilment states are explicit, and the next action depends on whether you are buying or selling.",
      },
      {
        file: "shopstr/06",
        alt: "Skeleton loading and empty cart states",
        caption: "States. Loading and empty screens were designed with everything else, not patched in after.",
      },
      { file: "shopstr/07", alt: "Library of 21 sticker SVGs", caption: "Stickers. 21 SVGs for the moments where the marketplace is allowed to be playful." },
      {
        file: "shopstr/08",
        alt: "Diagram of the data hook boundary between screens and backend",
        caption: "Handoff. One boundary makes the port small: screens read hooks, hooks read mock data today and Nostr later.",
      },
      { file: "shopstr/09", alt: "Shopstr 404 page", caption: "Not found. Even the dead end points back into the market." },
    ],
  },
  {
    slug: "verbx",
    name: "VerbX",
    headline: "Making translation feel like one conversation across formats",
    summary:
      "A mobile translation experience across text, voice and camera for Ivish AI, with a clear hierarchy and honest states when the language or the medium changes.",
    org: "Ivish AI",
    year: "2025",
    role: ["Product design", "Interaction design", "Brand"],
    kinds: ["product", "concept"],
    tier: "case",
    evidence: "Concept",
    problem: [
      "Translation changes shape with the medium. A typed phrase, a spoken exchange and text captured through a camera cannot all use the same interaction unchanged.",
      "It still has to feel like one product, so people recognise the input, trust the result and keep the conversation going.",
    ],
    work: [
      "I designed a shared visual and interaction language that brings text, voice and camera translation into one consistent mobile experience. Hierarchy and state changes make each mode clear without turning them into unrelated tools.",
      "The work runs from research and flows through the call experience, the brand and the places it lives outside the phone: a billboard, an event badge and a wearable concept.",
    ],
    decision: {
      title: "One conversation, three inputs",
      context: "Text, voice and camera could each have been their own screen with their own controls.",
      choice:
        "All three feed a single conversation, with the source and the translation kept side by side, so a person always knows which direction the meaning is going.",
      cost: "Camera translation has to fit a model built for short exchanges. Long documents are the case it handles least gracefully.",
    },
    result: [
      "A finished concept for a consumer app with its brand. It shows product thinking and finished interface design. It is not presented as a shipped Ivish product or as validated research.",
    ],
    links: [{ label: "Behance case study", href: "https://www.behance.net/gallery/243216093/VerbX-Designing-a-Multimodal-AI-Translation-App" }],
    shots: [
      { file: "verbx/cover", alt: "VerbX app on a phone resting on a dark ribbed surface" },
      {
        file: "verbx/01",
        alt: "VerbX translation screen in orange and lavender",
        caption: "One product, three inputs. A shared language connects text, voice and camera translation.",
      },
      {
        file: "verbx/02",
        alt: "Three call screens: incoming call and in-call controls",
        caption: "Calls. Translation inside a phone call, where the controls have to stay reachable with one thumb.",
      },
      {
        file: "verbx/03",
        alt: "Hand holding a phone with the VerbX translate screen in dark, light and colour themes",
        caption: "Conversation state. The result stays legible beside its source in every theme.",
      },
      { file: "verbx/04", alt: "Four-step design process from research to testing", caption: "Process. Research, define, design, test." },
      { file: "verbx/05", alt: "Core experience structure with flows and bento screens", caption: "Structure. The core flows and how the screens hang together." },
      { file: "verbx/10", alt: "Sign-up screen: Break language barriers, real time translate", caption: "Onboarding. Sign-up for the web portal, same voice as the app." },
      { file: "verbx/07", alt: "Billboard reading Everywhere you go your voice goes with you", caption: "Brand in the world." },
      { file: "verbx/08", alt: "Wearable translator hardware renders on purple", caption: "Hardware. A wearable concept that carries the same mark." },
    ],
  },
  {
    slug: "armoriq-design-system",
    name: "ArmorIQ design system",
    headline: "A design system that works in Figma and in code",
    summary:
      "A portable interface system for ArmorIQ: tokens, component primitives, usage rules and a live showcase, so designers and developers build new surfaces with the same vocabulary.",
    org: "ArmorIQ",
    year: "2026",
    role: ["Design systems", "UI engineering", "Documentation"],
    kinds: ["system"],
    tier: "case",
    evidence: "Shipped",
    problem: [
      "A component library alone does not stop drift. New pages still bring one-off colours, spacing, controls and interaction states.",
      "ArmorIQ needed a system that could be reused in the product and carried into other tools without depending on the original app.",
    ],
    work: [
      "I organised the system around semantic tokens, reusable primitives and documented patterns. A standalone showcase lets anyone inspect it visually.",
      "Machine-readable token and component manifests, with usage guidance, let implementation tools (and the agents writing code now) find what already exists before adding another variant.",
      "The kit travels: styles, source components, assets and documentation can be brought into a separate repository as one unit.",
    ],
    decision: {
      title: "A contract, not a reference file",
      context: "Most systems are a Figma page people are encouraged to look at.",
      choice:
        "Repeated values are named, new UI is expected to use the shared tokens, and a new primitive earns its place only when a pattern recurs.",
      cost: "A one-off is slower to ship. Sometimes a screen waits a day for the primitive it needs. That is the trade for the tenth page looking like the first.",
    },
    result: [
      "A portable kit and a working showcase exist and are in use across ArmorIQ surfaces. No adoption or speed figure is claimed here until it is measured.",
    ],
    shots: [
      {
        file: "armoriq-design-system/cover",
        alt: "Status buttons cycling through Approving, Retrying, Rejecting, Scan now and Send invite states",
        caption: "Components. Each primitive ships with its states, including the in-between ones like approving and retrying.",
      },
    ],
  },
  {
    slug: "social-content-tool",
    name: "Social content tool",
    headline: "Turning a manual graphics workflow into a tool the team can use",
    summary:
      "An editor that lets the ArmorIQ team start from approved layouts, change the content and export correctly sized graphics without rebuilding every asset in a design file.",
    org: "ArmorIQ",
    year: "2026",
    role: ["Product design", "Frontend"],
    kinds: ["tool"],
    tier: "case",
    evidence: "Shipped",
    problem: [
      "Social assets were made one file at a time. That works for a designer, but every routine change went back through the same manual process.",
      "The challenge was a fast path for teammates where an accidental drag or a type change cannot break the brand.",
    ],
    work: [
      "Compose mode, the default, changes content inside a locked layout. Construct mode exposes the canvas for new templates and structural edits.",
      "Layouts and backgrounds are separate, so a composition can be reused with different imagery. Headlines fit their boxes, and the editor checks text contrast against the image underneath and adjusts the scrim when it fails.",
    ],
    decision: {
      title: "On brand in under two minutes",
      context: "The same editor serves a teammate changing a date and a designer building a new template.",
      choice: "Geometry is locked unless you switch modes. The common path is a layout, a headline and an export.",
      cost: "Someone who wants to nudge a block has to switch modes first. One extra step, in exchange for nobody breaking the grid by accident.",
    },
    result: [
      "Deployed, with 32 layouts across seven event groups and export sizes verified in tests. The asset pipeline cut the shipped image library from 42.7 MB to 4.9 MB of WebP.",
      "Those are build results. Time saved per post has not been measured, so it is not claimed.",
    ],
    shots: [
      {
        file: "social-content-tool/cover",
        alt: "Animated event post: 8 hours to automate something, ArmorIQ sponsoring Automata",
        caption: "Output. An event post made from a locked layout, with imagery swapped in.",
      },
      {
        file: "social-content-tool/01",
        alt: "Animated Armor Series post: one reach away from it",
        caption: "Series. The same system, a different layout group.",
      },
    ],
  },
  {
    slug: "armortools",
    name: "ArmorTools",
    headline: "Reading an AI agent run as an action, not just a trace",
    summary:
      "One place to inspect coding-agent runs, see how they diverged from the plan and find the policy that shaped what happened.",
    org: "ArmorIQ",
    year: "2026",
    role: ["Product interface", "Frontend"],
    kinds: ["tool", "product"],
    tier: "case",
    evidence: "In progress",
    problem: [
      "Observability tells a developer what ran and how long it took. Governance asks something else: was the action expected, authorised or held for review?",
      "Those answers get hard to use when trace, plan and policy live in separate interfaces.",
    ],
    work: [
      "The interface is organised around one run. Timeline, plan, policy, cost and integrity are different ways of inspecting the same execution.",
      "A developer starts from a table of runs, opens a quick detail view, then moves into the step that needs attention. Policy authoring and review stay close to the execution evidence.",
    ],
    decision: {
      title: "One run, many lenses",
      context: "Each question about a run could have had its own page.",
      choice: "Each view is a lens on the same run, and a held or blocked action always links back to the rule and the step behind it.",
      cost: "The lenses have to agree on what a step is. That constraint shapes the data model as much as the screens.",
    },
    result: [
      "A React frontend contains these surfaces. It was built mock-data-first, and parts still depend on a live backend. No production usage is claimed.",
    ],
    shots: [
      {
        file: "armortools/cover",
        alt: "ArmorIQ Tools sidebar opening over a gradient background",
        caption: "Navigation. Runs, plans and policies one level apart.",
      },
    ],
  },
  {
    slug: "smile-share",
    name: "Smile Share",
    headline: "Making everyday giving feel possible",
    summary:
      "A donation app concept that turns small, everyday payments into acts of giving. Built at a UI/UX hackathon in 2024, where it won the Social Impact Award.",
    org: "UI/UX Hackathon",
    year: "2024",
    role: ["UX research", "Product design"],
    kinds: ["product", "concept"],
    tier: "case",
    evidence: "Concept",
    problem: [
      "Giving usually asks for a separate decision, a separate app and a number large enough to feel worth it. Most people never get to the first step.",
    ],
    work: [
      "I designed the app around a moment people already have: paying for something. Smile Share rounds the payment up and sends the difference to a campaign.",
      "The donor journey is mapped stage by stage with how the person feels at each one. Campaign pages, a stories feed and updates show where the money went, so a small gift has a visible result.",
    ],
    decision: {
      title: "Give at checkout, not in a separate app",
      context: "A dedicated donation flow competes with everything else on a phone.",
      choice: "Attach giving to a payment the person is already making, and make the amount small enough to say yes without thinking twice.",
      cost: "Small gifts can feel meaningless. The stories and updates exist to fix that, which makes the feed as important as the checkout.",
    },
    result: ["Social Impact Award at the 2024 hackathon. This is a design concept, with no launch, donation total or measured outcome claimed."],
    links: [{ label: "Case study", href: "https://flaxen-silk-89d.notion.site/Smile-Share-UX-Case-Study-89b1c0c337cc4679b87775ec3edceb11" }],
    shots: [
      { file: "smile-share/cover", alt: "Three phones: campaign page, featured campaign and share smiles screen" },
      { file: "smile-share/01", alt: "Phone on a concrete block showing a campaign screen" },
      {
        file: "smile-share/02",
        alt: "Checkout round-up donation flow across three phones",
        caption: "Donate with each payment. The round-up appears inside checkout, as one optional line.",
      },
      {
        file: "smile-share/03",
        alt: "Donor journey table with an emotion line",
        caption: "Journey. Where the donor hesitates, and what the product does at that moment.",
      },
      { file: "smile-share/04", alt: "Stories feed, campaign detail and update screens", caption: "After the gift. Stories and updates close the loop." },
      { file: "smile-share/06", alt: "Post your story screen with donation total", caption: "Sharing. Givers can tell the story themselves." },
      { file: "smile-share/07", alt: "Social Impact Award certificate", caption: "Social Impact Award, UI/UX Hackathon 2024." },
    ],
  },
  {
    slug: "impressions-of-japan",
    name: "Impressions of Japan",
    headline: "An editorial system where the grid holds and the pictures move",
    summary:
      "A book and magazine template that uses type, image pacing and a repeatable grid to give each story room without the publication falling apart.",
    org: "Editorial",
    year: "2025",
    role: ["Editorial design", "Type", "Layout"],
    kinds: ["brand"],
    tier: "case",
    evidence: "Delivered to client",
    work: [
      "The work is about rhythm: when an image should fill a spread, when a title should lead, and how a grid can hold variation without each page feeling unrelated.",
      "Canela carries the titles and Cabinet Grotesk the reading text. The grid and type are specified on their own sheet so the template can be filled by someone else.",
    ],
    result: ["A finished set of covers and spreads, plus the grid and type specification behind them."],
    shots: [
      { file: "impressions-of-japan/cover", alt: "Dark cover of Impressions of Japan with a red sun, as a book in a spotlight" },
      { file: "impressions-of-japan/01", alt: "Light cover with a red sun and Japanese characters", caption: "Two covers, one system: dark and light editions." },
      { file: "impressions-of-japan/02", alt: "Open spread of the book", caption: "Pacing. A full-bleed image gives the reader a breath between text spreads." },
      { file: "impressions-of-japan/03", alt: "Open book at an angle on concrete" },
      { file: "impressions-of-japan/04", alt: "Grid and type specification sheet", caption: "Grid and type. Canela over Cabinet Grotesk." },
      { file: "impressions-of-japan/07", alt: "Editorial layout exploration across several spreads", caption: "Exploration. Spreads tried before the grid was locked." },
    ],
  },
  {
    slug: "kuzara-green",
    name: "Kuzara Green",
    headline: "A brand for lightweight bricks that does not look like construction",
    summary:
      "Identity, website and print for Kuzara Green, a maker of eco-friendly AAC blocks. A mark built on a construction grid, a lime and teal palette and Aeonik throughout.",
    org: "Client",
    year: "2025",
    role: ["Brand identity", "Web design", "Print"],
    kinds: ["brand", "web"],
    tier: "more",
    evidence: "Delivered to client",
    work: [
      "Construction brands tend toward grey and safety orange. Kuzara's product is lighter and greener than a clay brick, so the identity leans on lime green, forest teal and warm sand.",
      "The K is drawn on a block grid, so the mark and the product share a geometry. The system runs across the website, business cards, site banners and the factory inauguration invite.",
    ],
    result: ["Identity, website design and print collateral delivered to the client."],
    shots: [
      { file: "kuzara-green/cover", alt: "Kuzara Green website hero on a monitor: eco-friendly lightweight bricks" },
      { file: "kuzara-green/01", alt: "Logo mark construction grid beside the final teal K on lime", caption: "Mark. Drawn on the same grid as a block." },
      { file: "kuzara-green/02", alt: "Palette of lime green, forest teal and warm sand", caption: "Colour. Lime, teal and sand." },
      { file: "kuzara-green/03", alt: "Aeonik type specimen", caption: "Type. Aeonik, one family for everything." },
      { file: "kuzara-green/04", alt: "Business cards leaning on concrete blocks" },
      { file: "kuzara-green/05", alt: "Build smart, build green banner on a brick building" },
      { file: "kuzara-green/07", alt: "You are invited: factory inauguration social invite" },
    ],
  },
  {
    slug: "dash",
    name: "DASH",
    headline: "A product page that does the maths before the buyer has to",
    summary:
      "DASH sells 60ml wellness shots to people who meet the brand in an Instagram ad. I redesigned how they shop: a page that answers each doubt in order, shows what results really cost, and takes a stranger from ad to checkout.",
    org: "DASH Wellness",
    year: "2026",
    role: ["Product design", "Frontend"],
    kinds: ["web", "product"],
    tier: "more",
    evidence: "Live prototype",
    work: [
      "The page is an objection ladder: buy box, then ingredients, use cases, evidence, reviews and the purchase decision, in the order a cold visitor asks.",
      "The pack selector shows per-shot price against the brand's thirty-day routine. Ingredient claims stay tied to named doses. Proposed features are labelled as proposals so a prototype addition is never mistaken for a store promise.",
      "I built the clickable purchase states: pack selector, sticky buy bar, cart drawer and checkout.",
    ],
    decision: {
      title: "Order the page by objection",
      context: "Product pages usually lead with brand story.",
      choice: "Sections follow the questions a first-time buyer asks, with the buy box always reachable.",
      cost: "The brand story moves down the page, which a brand team has to agree to.",
    },
    result: ["A working prototype and an assignment deliverable. Not evidence of a conversion lift."],
    shots: [{ file: "dash/cover", alt: "DASH home page: take a shot, it's time to dash, beside the Glow box and bottles on coral" }],
  },
  {
    slug: "papersseum",
    name: "Papersseum",
    headline: "A bot tournament designed so you can watch your bot fight",
    summary:
      "Papersseum is a season-long tournament where students' Python bots fight for territory every 15 minutes. I led the redesign of its web app: the structure, the design system, 14,400 pixel characters and the screens people watch.",
    org: "IIITDM Jabalpur",
    year: "2026",
    role: ["Product design", "Design system", "Frontend"],
    kinds: ["product", "web"],
    tier: "case",
    evidence: "Shipped",
    work: [
      "I mapped the platform on one FigJam board (sitemap, architecture, state machines, six flows, 165 edge cases), then built the design system, the pixel characters and the pages on it.",
    ],
    result: ["Live with 51 bots on the ladder and 4,438 matches played on 2026-10-23."],
    links: [{ label: "Live site", href: "https://papersseum.vercel.app" }],
    shots: [{ file: "papersseum/cover", alt: "Papersseum home: the wordmark beside a live arena where five pixel bots fight for territory" }],
  },
  {
    slug: "navu-kavacha",
    name: "Navu Kavacha",
    headline: "A shared record for every bin of restaurant waste, owned by the people who move it",
    summary:
      "Navu Kavacha turns the hand-off of restaurant wet waste in Bengaluru into a record both sides sign. I reframed the brief from scheduling to trust, designed the collector and restaurant apps around two-touch handovers, and built a presenter that plays twelve flows.",
    org: "IIITDM Jabalpur",
    year: "2026",
    role: ["Product strategy", "Product design", "Frontend"],
    kinds: ["product", "concept"],
    tier: "case",
    evidence: "Live prototype",
    work: [
      "I replaced a rating-and-tiers concept with a handover record: two touches on the collector's phone become a receipt for the kitchen and a work passbook the collector owns.",
    ],
    result: ["Twelve flows and 57 steps playable in the presenter, in Kannada, Tamil and English."],
    shots: [{ file: "navu-kavacha/cover", alt: "Three phones in the Navu Kavacha presenter: the collector's done screen, the restaurant's receipt and a WhatsApp message" }],
  },
  {
    slug: "udte-bhawre",
    name: "Udte Bhawre",
    headline: "AI companions that live beside the work",
    summary: "A desktop assistant concept built around small taskbar companions, conversation and tool access, without a full application window.",
    org: "Team project",
    year: "2025",
    role: ["Interaction design", "Electron"],
    kinds: ["concept", "tool"],
    tier: "more",
    evidence: "Live prototype",
    work: [
      "What does an assistant feel like when it lives in the operating system instead of another browser tab? Udte Bhawre puts a companion on the taskbar, with conversation, multiple terminal sessions, configurable characters and tool integrations behind it.",
      "The interesting part is the movement between a lightweight prompt and a more capable control centre, and how the companion stays available without getting in the way.",
    ],
    result: ["An Electron app with a demo, built as a team."],
    shots: [{ file: "udte-bhawre/cover", alt: "Schematic of a taskbar with small companion characters and a chat popover" }],
  },
];

export const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)!;
