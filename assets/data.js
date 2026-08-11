/*
 * Project dataset. Drives the metric tiles, the filterable grid, the detail
 * panels, and the animated pipeline diagrams.
 *
 * Editing rules — read before adding a project:
 *   - No customer names, ticket numbers, or internal performance figures.
 *   - Metrics must trace to something real. Prefix estimates with "~".
 *   - `pipeline` node kinds: trigger | ai | system | outcome
 */

export const PROFILE = {
  name: "Andres Taquechel",
  title: "AI Operations Specialist",
  location: "Austin, TX",
  pitch:
    "I find the manual work buried inside a business and replace it with AI systems that run in production — inside the tools people already use.",
  email: "dretaq@gmail.com",
  linkedin: "https://www.linkedin.com/in/andrestaquechel/",
  resume: "/resume.pdf",

  /*
   * Google Calendar appointment schedule "Intro call with Andres".
   * 60-minute slots, Mon–Fri 9:00–17:00 Central, 72 hours minimum notice,
   * and Google checks the calendar for conflicts so booked time never shows
   * as free.
   *
   * `booking` is the plain share link (used by the Contact list and the
   * fallback card). `bookingEmbed` is the same URL with `?gv=true`, which is
   * what makes Google render the embeddable view inside an iframe.
   *
   * If bookingEmbed is ever blank — or the iframe fails to load within 6
   * seconds — the booking section falls back to a styled card instead of
   * showing a broken embed.
   */
  booking:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1KdQiK0lpPliB9yQ-mrxsvAgbDPZrdp1U2dBS-7y8vFlQgWwrnWIps5clI5C0xUcaVIt-j1fpa",
  bookingEmbed:
    "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1KdQiK0lpPliB9yQ-mrxsvAgbDPZrdp1U2dBS-7y8vFlQgWwrnWIps5clI5C0xUcaVIt-j1fpa?gv=true",
};

/* Marquee band under the hero. Names only — no logos, nothing to license. */
export const SYSTEMS = [
  "Claude API",
  "Slack",
  "HubSpot",
  "Jira",
  "Linear",
  "Pylon",
  "Guru",
  "Gmail",
  "Google Drive",
  "Contentful",
  "Notion",
  "Telegram",
  "Stripe",
  "Twilio",
  "Supabase",
  "Playwright",
  "Browserbase",
  "Vercel",
  "GitHub Actions",
  "Canvas LMS",
  "GoHighLevel",
  "PostgreSQL",
];

export const STATS = [
  {
    value: 20,
    suffix: "+",
    label: "automations shipped to production",
    note: "Live systems with real users, not prototypes",
  },
  {
    value: 30,
    suffix: "+",
    label: "systems &amp; APIs integrated",
    note: "Pylon, HubSpot, Jira, Linear, Slack, Contentful, Guru, Gmail, Stripe, and more",
  },
  {
    value: 900,
    suffix: "+",
    label: "knowledge articles piped into support AI",
    note: "Unified from three separate sources on a two-hour sync",
  },
  {
    value: 8800,
    suffix: "+",
    label: "support tickets analyzed",
    note: "Four years of history stitched across two ticketing platforms",
  },
];

export const FILTERS = [
  { id: "all", label: "All work" },
  { id: "work", label: "Living Security" },
  { id: "personal", label: "Personal &amp; business" },
  { id: "agents", label: "AI agents &amp; LLM pipelines" },
  { id: "integration", label: "Systems integration" },
  { id: "browser", label: "Browser automation" },
  { id: "fullstack", label: "Full-stack apps" },
];

export const PROJECTS = [
  /* ---------------------------------------------------------------- work --- */
  {
    id: "box-studio",
    title: "Box Studio",
    subtitle: "AI content factory for monthly security-awareness campaigns",
    org: "Living Security",
    year: "2026",
    featured: true,
    tags: ["work", "agents", "integration"],
    blurb:
      "A Slack bot that turns a month name into a finished, cited, brand-templated awareness campaign — blog, four emails, four chat messages, resources, and a 20-slide deck.",
    problem:
      "Every month, someone hand-authored an entire security-awareness campaign: research a topic with credible sources, write a blog, four weekly emails, four chat messages, pick GIFs, then rebuild it all inside a branded 20-slide deck for review. It was days of work on a fixed monthly clock, and the research step was the part most likely to be rushed.",
    approach: [
      "One pipeline, three surfaces: a Slack bot that runs research → concept → outline → full draft → review → finalize entirely in-thread, plus a Google Drive knowledge base for retrieval grounding.",
      "Model routing per task rather than one model for everything — the strongest model for source research where URL accuracy matters, a mid-tier model for long-form content, and the cheapest for brief distillation.",
      "Server-side web search on the research calls, with every returned URL programmatically re-validated so dead links get pruned before a human ever sees them.",
      "Serverless timeout engineering: Slack demands a 3-second acknowledgment but the research runs for minutes, so heavy steps dispatch to dedicated long-running workers behind a bearer token. An early version silently died at the platform's execution wall — splitting it into chained invocations fixed it.",
      "Decks are generated by surgically editing the real template's underlying XML instead of rebuilding slides from scratch, so exports stay pixel-faithful to brand.",
      "A persistent campaign brief distills every human refinement into directive bullets and re-injects them into each later generation step, so feedback given once actually sticks.",
    ],
    outcome: [
      "Ships a complete campaign package from a single Slack command, returning a deck and a review doc in-thread.",
      "199 automated tests across 20 files; typechecks and builds clean in CI.",
      "Verified end-to-end in live production, including four bugs found and fixed during that run.",
      "Measured step latencies drove the architecture: concept ~78s, sources ~55s, outline ~127s — the numbers are why the work is chained rather than monolithic.",
    ],
    metrics: [
      { value: "199", label: "automated tests" },
      { value: "20", label: "slides generated per campaign" },
      { value: "3", label: "models routed by task" },
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Claude API",
      "Slack API",
      "Google Drive / Docs / Slides",
      "PPTX XML",
      "Turso",
      "Vitest",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Slack command", sub: "/newbox + month" },
      { kind: "ai", label: "Topic research", sub: "web search + URL validation" },
      { kind: "ai", label: "Concept → outline → draft", sub: "chained workers" },
      { kind: "system", label: "Deck + doc build", sub: "template XML surgery" },
      { kind: "outcome", label: "Review in-thread", sub: "campaign ready" },
    ],
  },

  {
    id: "support-knowledge",
    title: "Support AI Knowledge Pipeline",
    subtitle: "Audited a support AI, then built the pipeline that fixed it",
    org: "Living Security",
    year: "2026",
    featured: true,
    tags: ["work", "agents", "integration"],
    blurb:
      "Read 90 days of real support conversations to find out why the AI agent was underperforming, then built the sync that put ~900 articles behind it.",
    problem:
      "The support AI was answering customers from an almost-empty knowledge base — so it escalated questions that had documented answers, and occasionally invented procedures that didn't exist. The knowledge itself existed, but scattered across three systems that had no path between them, and keeping them in sync was manual copy-paste across hundreds of articles.",
    approach: [
      "Started with measurement, not code: read 90 days of support conversations to establish what the AI actually resolved versus what the platform's own counter claimed, and categorized every ticket by what it really was.",
      "Built an idempotent sync from three sources — an internal knowledge platform, a Drive export of the public support site, and a curated customer-facing set — keyed on content hash so reruns are free and an interrupted run resumes where it stopped.",
      "Title-based adoption absorbed articles that predated the project instead of duplicating them, quietly cleaning up an existing mess.",
      "Found the setting that made the whole thing work: the obvious 'internal' visibility flag hides an article from the AI completely. Internal knowledge had to sync under a different flag combination to be AI-readable but customer-invisible.",
      "Chose scheduled CI over serverless deliberately and wrote down why — free serverless caps out around 60 seconds, but the destination platform rate-limits article creation to roughly ten per minute, so a full sync runs over an hour.",
      "Client-side collection filtering as a safety measure, because the source API ignores server-side filters — call transcripts and non-allowlisted internal collections can never leak into a customer-facing knowledge base.",
    ],
    outcome: [
      "~900 articles unified from three sources and kept in sync on a two-hour schedule.",
      "Corrected 136 pre-existing articles that had been configured invisible to the AI.",
      "Built a companion dashboard stitching four years of ticket history across two platforms, exposing the migration overlap explicitly so it never reads as a false spike.",
      "The audit set an explicit measurement baseline, so the change could be graded rather than assumed.",
    ],
    metrics: [
      { value: "~900", label: "articles synced" },
      { value: "8,800+", label: "tickets analyzed" },
      { value: "2 hr", label: "sync cadence" },
    ],
    stack: [
      "Python",
      "Next.js",
      "Pylon API",
      "Guru API",
      "HubSpot",
      "Google Drive",
      "GitHub Actions",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Scheduled run", sub: "every 2 hours" },
      { kind: "system", label: "Pull 3 sources", sub: "hash-keyed diff" },
      { kind: "ai", label: "Support AI", sub: "now grounded" },
      { kind: "system", label: "Upsert + adopt", sub: "idempotent, resumable" },
      { kind: "outcome", label: "Fewer escalations", sub: "measured baseline" },
    ],
  },

  {
    id: "offboarding-robot",
    title: "Customer Offboarding Robot",
    subtitle: "Destructive automation with safety gates that actually hold",
    org: "Living Security",
    year: "2026",
    featured: true,
    tags: ["work", "browser", "integration"],
    blurb:
      "A Slack message starts a robot that offboards a churned customer across four products — two through a driven browser, two through APIs — and reports back in-thread.",
    problem:
      "Offboarding one churned customer meant a human clicking through four separate systems, two of which have no API at all, then opening a support ticket, filing an engineering request, and reporting back in Slack. It was slow, easy to half-finish, and permanently destructive if done to the wrong account. A backlog of 390 expired accounts had built up behind it.",
    approach: [
      "Acknowledge-then-work: the webhook returns immediately so the trigger never retries or spawns a duplicate browser, then the real work runs in a background task.",
      "Browser flows live as declarative JSON steps executed by a generic runner, with a codegen harness to re-record them when the admin UI changes — so a UI change is a re-record, not a rewrite.",
      "Two hard safety gates before anything destructive. The account's tenant ID must match the master list from inside the edit modal itself; a mismatch is a hard skip, never a guess. Bulk runs additionally require the license end date to be more than six months old.",
      "Session resilience: a saved browser context is reused, and when it expires the robot signs itself back in including time-based 2FA. A health endpoint reports the deployed commit so you always know what's actually running.",
      "Batch orchestration through scheduled CI with a concurrency group, so two batches can never overlap on the same destructive work.",
      "Results consolidate intelligently — one bulk engineering ticket per batch rather than per company, with per-company notes threaded onto that company's own support ticket.",
    ],
    outcome: [
      "Four product offboarding flows automated end to end from a single Slack trigger.",
      "Worked a 390-account backlog in verified batches of 25, with tenant-ID mismatches correctly refusing to proceed rather than guessing.",
      "Deliberately kept human-supervised for bulk runs — the design treats irreversibility as a first-class constraint rather than an edge case.",
    ],
    metrics: [
      { value: "4", label: "products, one trigger" },
      { value: "390", label: "account backlog worked" },
      { value: "2", label: "hard safety gates" },
    ],
    stack: [
      "Node.js",
      "Playwright",
      "Browserbase",
      "Slack API",
      "Pylon API",
      "Jira API",
      "GitHub Actions",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Churn in Slack", sub: "202 ack, work async" },
      { kind: "system", label: "Safety gates", sub: "tenant ID + license age" },
      { kind: "system", label: "Driven browser", sub: "2 products, no API" },
      { kind: "system", label: "API paths", sub: "2 products via tickets" },
      { kind: "outcome", label: "Thread report", sub: "auditable trail" },
    ],
  },

  {
    id: "taxonomy-audit",
    title: "Content Taxonomy Audit",
    subtitle: "Constrained LLM extraction with a validation gate",
    org: "Living Security",
    year: "2026",
    featured: false,
    tags: ["work", "agents"],
    blurb:
      "Read the captions of 362 training videos against a fixed 79-value taxonomy and proposed 941 tag corrections — with zero invented values.",
    problem:
      "A video training library's taxonomy tags had drifted from the content. Verifying them meant watching hundreds of videos and cross-checking each against a controlled vocabulary — and nobody could say which tags were wrong without doing exactly that.",
    approach: [
      "Pulled and read the full English captions for every video, matching entries by exact ID rather than by name so nothing got mismatched.",
      "Ran twelve parallel extraction passes with the existing 79-value taxonomy as the *only* allowed vocabulary, and required every suggestion to cite the transcript evidence behind it.",
      "Put a programmatic validation gate after the model: is this a real taxonomy value, is it not already applied, and for removals, is it actually currently applied? Anything failing was dropped rather than surfaced.",
      "Scored candidate new topic tags by real keyword coverage across all transcripts and kept only those clearing a five-item threshold, so every proposed tag returns a useful result set when a learner searches it.",
      "Shipped it as a review proposal with its own limitations documented — transcript-only analysis can't see on-screen text, so the weakest column is flagged as review-only.",
    ],
    outcome: [
      "0 of 812 validated suggestions failed the gate — nothing was invented.",
      "941 concept tag additions proposed across 386 rows, plus 196 flagged for human review.",
      "474 raw new-tag candidates narrowed to 26 that actually earn their place.",
      "41 category mismatches surfaced across 16 distinct patterns, plus a caption-integrity audit that caught missing and malformed files.",
    ],
    metrics: [
      { value: "0 / 812", label: "invented values" },
      { value: "362", label: "videos read" },
      { value: "941", label: "tag fixes proposed" },
    ],
    stack: ["Claude API", "Contentful", "VTT captions", "Excel", "Python"],
    pipeline: [
      { kind: "trigger", label: "Library export", sub: "398 content rows" },
      { kind: "system", label: "Fetch captions", sub: "matched by entry ID" },
      { kind: "ai", label: "12 parallel passes", sub: "fixed vocabulary only" },
      { kind: "system", label: "Validation gate", sub: "drop anything unreal" },
      { kind: "outcome", label: "Review workbook", sub: "evidence per row" },
    ],
  },

  {
    id: "zapier-replacement",
    title: "Support → Engineering Routing",
    subtitle: "Replacing paid Zaps with owned, tested serverless code",
    org: "Living Security",
    year: "2026",
    featured: false,
    tags: ["work", "integration"],
    blurb:
      "Two zero-dependency serverless endpoints that route support tickets into Jira and Linear by type, with signature verification and dedup informed by real production misfires.",
    problem:
      "Customer-reported bugs and feature needs were hand-carried from the support platform into engineering's trackers, then partly automated with paid no-code Zaps that were a black box when they misbehaved — and they did misbehave, because other automations re-tag a ticket and re-fire the same webhook.",
    approach: [
      "Rewrote both Zaps as serverless functions with zero runtime dependencies, and documented a step-by-step mapping from each original no-code step to the code that replaced it, so the migration was reviewable rather than a leap of faith.",
      "HMAC signature verification on every inbound webhook — unsigned requests are rejected outright.",
      "Dedup by stamping created issues with the source ticket ID, then checking for that stamp before creating. Crucially, the stamp is only ever applied by the automation, so tickets an engineer files by hand are never blocked.",
      "For the Linear side, dedup uses a direct attachment lookup specifically because it's immediately consistent — issue search is eventually consistent and would miss a second fire landing seconds after the first.",
      "The dedup path fails open: if the lookup errors it logs and proceeds, so a search hiccup can never silently swallow a real bug report.",
      "The whole routing table is an environment variable, so changing where a ticket type lands needs no deploy.",
    ],
    outcome: [
      "Both Zaps retired, with a documented cutover procedure ending in switching the old automation off.",
      "The dedup design came from an observed production measurement: the same ticket firing five times, twice within six seconds.",
      "Unit-tested transform logic that runs with no dependencies at all.",
      "Unmatched webhooks are an explicit no-op rather than an error, so scope changes upstream don't page anyone.",
    ],
    metrics: [
      { value: "2", label: "paid Zaps retired" },
      { value: "0", label: "runtime dependencies" },
      { value: "5×", label: "duplicate fires handled" },
    ],
    stack: ["Node.js", "Vercel", "Pylon API", "Jira REST", "Linear GraphQL", "HMAC"],
    pipeline: [
      { kind: "trigger", label: "Ticket webhook", sub: "HMAC verified" },
      { kind: "system", label: "Route by type", sub: "config as env var" },
      { kind: "system", label: "Dedup check", sub: "stamp lookup, fail-open" },
      { kind: "system", label: "Create issue", sub: "Jira or Linear" },
      { kind: "outcome", label: "Linked both ways", sub: "no manual carry" },
    ],
  },

  {
    id: "project-pulse",
    title: "Project Pulse",
    subtitle: "A messy doc becomes a structured, approvable dashboard",
    org: "Living Security",
    year: "2026",
    featured: true,
    tags: ["work", "agents", "fullstack"],
    blurb:
      "Parses a free-text Google Doc into projects, tasks, questions, and blockers — behind a confidence-scored human approval gate, with a read-only view for leadership.",
    problem:
      "Priorities, project context, tasks, and open questions lived in a single free-text doc maintained by a manager. Finding what changed meant re-reading it; assembling a status update or prepping a 1:1 meant doing that by hand every time.",
    approach: [
      "Treated the extraction prompt as a specification rather than a suggestion: heading hierarchy is converted to explicit markers and declared the primary structural signal, extraction is hard-scoped to two top-level sections, and subtask nesting is derived from leading indentation with parent titles required to match verbatim.",
      "Checkbox prefixes in the doc drive two-way status sync, with the prefix stripped from the title but the source text kept verbatim.",
      "Nothing writes automatically. Every extracted item arrives as a proposal with a confidence score and lands in a review queue where you approve, edit, merge, or ignore it.",
      "Every item carries the verbatim doc excerpt it came from, so any card on the dashboard traces back to its source.",
      "Writeback is deliberately non-destructive — it appends rather than editing in place, and when it can't locate the target text safely it falls back to a dedicated section instead of guessing.",
      "Token-gated public views let leadership check status without an account, and scheduled hooks run the daily sync and weekly report.",
    ],
    outcome: [
      "In production use with a live leadership view and real authentication.",
      "22 tables and 32 migrations of iteration behind a deliberately simple surface.",
      "Migrated cleanly off a no-code build platform onto owned infrastructure while it was already live.",
      "Replaced manual status assembly, weekly reporting, and 1:1 prep.",
    ],
    metrics: [
      { value: "22", label: "data models" },
      { value: "0", label: "unreviewed writes" },
      { value: "1 / day", label: "automatic sync" },
    ],
    stack: [
      "TanStack Start",
      "React 19",
      "Supabase",
      "Claude API",
      "Google Docs API",
      "Slack",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Daily sync", sub: "or on demand" },
      { kind: "system", label: "Read the doc", sub: "heading hierarchy" },
      { kind: "ai", label: "Classify", sub: "confidence-scored proposals" },
      { kind: "system", label: "Human approval", sub: "approve / edit / ignore" },
      { kind: "outcome", label: "Dashboard + boss view", sub: "traceable to source" },
    ],
  },

  {
    id: "sales-collateral",
    title: "Sales Collateral Bot",
    subtitle: "Automating around an API that doesn't exist",
    org: "Living Security",
    year: "2026",
    featured: false,
    tags: ["work", "browser", "integration"],
    blurb:
      "React to a file in Slack; it lands in the CRM's document library with a tracking link back in the thread — via a driven browser, because there's no public API for it.",
    problem:
      "Sales collateral had to be uploaded into the CRM's document library by hand and a tracking link generated per file. The CRM exposes no public API for that library, so there was nothing to integrate with.",
    approach: [
      "Drove a real logged-in browser session through the CRM UI, since the API path simply doesn't exist — and kept every step of one trigger inside a single browser session so one upload never spawns multiple browsers.",
      "Auto sign-in including time-based 2FA when the saved session dies, plus a health endpoint that distinguishes 'logged in' from 'session dead'.",
      "Made the flow deadline-aware: a cold login can eat the time budget, so rather than failing it degrades to a different Slack reply.",
      "Deterministic post-upload identification — name matching plus newest-first ordering plus waiting for the uploaded row — so it opens the right document instead of guessing.",
    ],
    outcome: [
      "One Slack reaction replaces the full manual upload-and-share loop.",
      "Became the reusable in-house pattern that the offboarding robot was later built from.",
    ],
    metrics: [
      { value: "1", label: "reaction to publish" },
      { value: "300s", label: "budget, deadline-aware" },
    ],
    stack: ["Node.js", "Playwright", "Browserbase", "Slack API", "HubSpot", "Vercel"],
    pipeline: [
      { kind: "trigger", label: "Slack reaction", sub: "on any file" },
      { kind: "system", label: "Driven browser", sub: "saved session + 2FA" },
      { kind: "system", label: "Upload + share", sub: "deterministic match" },
      { kind: "outcome", label: "Tracking link", sub: "back in thread" },
    ],
  },

  /* ------------------------------------------------------------ personal --- */
  {
    id: "vehicle-finder",
    title: "Vehicle Finder",
    subtitle: "Vision-graded fleet sourcing, where the LLM is the scheduler",
    org: "Personal · Swoop",
    year: "2026",
    featured: true,
    tags: ["personal", "agents", "browser"],
    blurb:
      "Twice a day it sweeps marketplace listings across Texas, grades condition and requirement-fit from the photos, filters out financing bait, and alerts on anything worth acting on.",
    problem:
      "Sourcing passenger vans for a transportation business meant refreshing marketplace listings daily across seven cities, re-checking whether things had sold, and eyeballing photos to work out what a listing actually was — because titles lie about roof height and seating, and dealers advertise down payments as prices.",
    approach: [
      "Inverted the usual architecture: the scheduling runtime *is* the model session, so vision grading happens inside a scheduled agent run rather than as per-listing API calls — no key to manage and no per-listing cost.",
      "Requirements are written as plain prose ('must be a 12 or 15 passenger van with medium or high roof — verify from photos, not the title') and verified against the images, not the listing text.",
      "Three-tier mileage extraction with vision as the last resort: structured field, then description text, then reading the odometer off a dashboard photo.",
      "Bait detection as a first-class state — advertised prices that are really down payments get excluded and dropped out of the ranked view entirely.",
      "A real lifecycle state machine (active / pending / sold / stale / archived) with price-drop tracking and per-run cost caps, so repeated runs stay cheap and history is preserved.",
    ],
    outcome: [
      "Running on a live twice-daily schedule with accumulated multi-run history.",
      "103 listing cards swept per run; 72 listings tracked with 47 vision analyses stored.",
      "Alerts only above a score threshold, so the notification stays worth reading.",
      "Honest about its constraints — hobbyist scale, well under rate limits, documented as such.",
    ],
    metrics: [
      { value: "2×/day", label: "autonomous runs" },
      { value: "103", label: "listings swept per run" },
      { value: "7", label: "metro areas covered" },
    ],
    stack: ["Node.js", "Playwright", "Claude vision", "Telegram Bot API", "Vercel"],
    pipeline: [
      { kind: "trigger", label: "Scheduled agent", sub: "08:00 and 18:00" },
      { kind: "system", label: "Sweep listings", sub: "7 cities, 250mi" },
      { kind: "ai", label: "Grade from photos", sub: "fit, condition, mileage" },
      { kind: "system", label: "Bait filter", sub: "down-payment traps" },
      { kind: "outcome", label: "Ranked + alerted", sub: "above threshold only" },
    ],
  },

  {
    id: "self-repairing-publisher",
    title: "Self-Repairing Publisher",
    subtitle: "An automation that fixes its own broken selectors",
    org: "Personal",
    year: "2026",
    featured: true,
    tags: ["personal", "agents", "browser"],
    blurb:
      "Publishes from a Notion database to a platform with no public API — and when the UI changes underneath it, it asks a model to patch its own selector mapping and commits the fix.",
    problem:
      "Publishing meant copy-pasting and reformatting out of Notion into a platform that offers no public publishing API. Any automation for it has to lean on an undocumented endpoint or the UI itself — and both break silently whenever the vendor ships a redesign. That's the actual problem: not writing the scraper, but the fact that scrapers rot.",
    approach: [
      "A three-tier publish chain: try the undocumented HTTP endpoint first, fall back to browser automation, and only then escalate.",
      "The escalation is the interesting part. On double failure it hands the model the accumulated errors plus the current UI mapping and asks for a JSON mapping patch — updated selectors or path tweaks — then deep-merges it and retries both paths.",
      "All UI coupling lives in one declarative mapping file rather than scattered through the code, which is precisely what makes automated repair tractable.",
      "When a repair succeeds, CI commits the corrected mapping back to the repository, so the fix persists instead of being rediscovered next run.",
      "The repair prompt is explicitly instructed never to include secrets or cookies, and only redacted snippets are sent.",
    ],
    outcome: [
      "A working answer to selector rot that persists its own fixes rather than paging a human.",
      "Nine focused modules including a hand-written converter targeting the platform's rich-text document format.",
      "Honest status: the design is complete and deployable, but the repair path hasn't yet been triggered by a real vendor redesign — the mapping file is still pristine.",
    ],
    metrics: [
      { value: "3", label: "fallback tiers" },
      { value: "1", label: "self-committed fix loop" },
    ],
    stack: [
      "TypeScript",
      "Notion API",
      "Claude API",
      "Playwright",
      "GitHub Actions",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Status flips", sub: "ready to publish" },
      { kind: "system", label: "Try API → browser", sub: "two paths" },
      { kind: "ai", label: "Repair mapping", sub: "on double failure" },
      { kind: "system", label: "Commit the fix", sub: "back to the repo" },
      { kind: "outcome", label: "Published", sub: "and self-healed" },
    ],
  },

  {
    id: "email-triage",
    title: "Inbox Triage, Three Ways",
    subtitle: "The same problem attacked three times, each with a better handle on the constraint",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "agents"],
    blurb:
      "A progression: LLM-first triage on cloud infrastructure, then re-engineered to run free inside Google's platform limits, then rethought as a layered cascade where the model only sees the ambiguous middle.",
    problem:
      "Manual triage across five or six inboxes daily. The interesting part isn't classification — it's that the first honest answer was wrong twice, and the design got better each time the real constraint became clear.",
    approach: [
      "v1 — LLM-first triage into seven categories on cloud jobs, with a structured rubric that asks for actionability, urgency and intent *before* choosing a category, plus a correspondent graph built from your own sent mail.",
      "v2 — the same pipeline ported into a platform with a six-minute execution ceiling and a 9KB-per-property state limit: self-terminating before the wall, storing IDs only and trimming to 5,000, and swapping full sent-history scans for a rolling window plus cache. Zero infrastructure, zero hosting cost.",
      "v3 — rethought entirely as a six-layer fail-open cascade: urgent rescue, allowlist, hard bulk signals, relationship check, then the model only for the genuinely ambiguous middle, defaulting to keep. Cheap deterministic layers first means most mail never reaches an LLM at all.",
      "A human-in-the-loop training loop that needs no UI: drag a message onto a training label and the next run absorbs it into a permanent per-sender rule. Drag anything back to the inbox and that sender is allowlisted forever.",
      "Deliberate capability limiting — the OAuth scope granted structurally cannot send or permanently delete, so the worst-case bug is a misfiled email.",
      "Security and 2FA mail is hard-pinned to keep and cannot be overridden even by your own training.",
    ],
    outcome: [
      "525 emails classified in an evaluation pass, with the full category distribution captured.",
      "The final version runs live across three accounts on a 30-minute schedule.",
      "A dry-run mode that labels what *would* move, so the judgment can be audited for a week before going live.",
    ],
    metrics: [
      { value: "525", label: "emails evaluated" },
      { value: "6", label: "cascade layers" },
      { value: "3", label: "accounts live" },
    ],
    stack: [
      "Python",
      "Google Apps Script",
      "Gmail API",
      "Claude API",
      "OpenAI API",
      "Cloud Run",
      "Docker",
    ],
    pipeline: [
      { kind: "trigger", label: "Every 30 min", sub: "3 accounts" },
      { kind: "system", label: "Deterministic layers", sub: "rescue, allowlist, bulk" },
      { kind: "ai", label: "Ambiguous only", sub: "confidence ≥ 0.8" },
      { kind: "system", label: "Label, never delete", sub: "scope-limited by design" },
      { kind: "outcome", label: "Inbox is signal", sub: "trainable by drag" },
    ],
  },

  {
    id: "swoop-ops",
    title: "Transport Ops Hub",
    subtitle: "A knowledge bot for drivers and a payout audit that found real money",
    org: "Swoop Franchise LLC",
    year: "2026",
    featured: false,
    tags: ["personal", "agents", "integration"],
    blurb:
      "A Telegram bot that answers fleet questions in plain English, plus a weekly reconciliation that checks the platform's payout math against the contract across three markets.",
    problem:
      "Two problems in one business. Drivers and staff needed VINs, registration dates and vehicle details that were buried in nested Notion pages nobody could search. Separately, weekly earnings across three metro markets had to be pulled by hand from a platform admin panel — and nobody had ever checked whether the payout actually matched the agreed revenue share.",
    approach: [
      "Rejected live search: the source platform's search is title-only and misses nested pages and tables, so it crawls configured root pages, caches a local index, and ranks by keyword overlap — no LLM cost per query, with a documented swap point for embeddings if it grows.",
      "Scoping as a privacy control: only pages beneath explicitly configured roots are indexed, so the bot cannot surface personal or financial pages shared with the same integration. Access is an ID allowlist with owner/assistant/driver roles, and an empty allowlist denies everyone.",
      "Serious reverse engineering to get the data at all — market switching turned out to be server-side session state, a CDN prerender cache made the active market label go stale, and one endpoint silently returns a market-wide total instead of a per-driver one when queried in bulk.",
      "The reconciliation computes what the payout *should* be from the contract terms and prints the per-market delta alongside the implied revenue share, so a wrong rate is visible directly rather than inferred.",
      "An auto-flagging attention panel surfaces low completion rates, cancellations exceeding completions, long online hours at low revenue, and any lease shortfall.",
    ],
    outcome: [
      "Surfaced a consistent, evidence-backed shortfall in one market where the implied revenue share ran several points below the contracted rate — quantified across multiple clean weeks.",
      "Deliberately documented the four alternative explanations to rule out first before raising it, so the finding holds up in a conversation.",
      "Weekly pull across three markets runs in about 15 seconds; five weeks backfilled.",
      "Dashboard sits behind organization auth, which is the right outcome for a page showing driver pay and lease balances.",
    ],
    metrics: [
      { value: "3", label: "markets reconciled" },
      { value: "~15s", label: "full weekly pull" },
      { value: "1", label: "revenue gap found" },
    ],
    stack: ["Python", "Claude API", "Notion API", "Telegram Bot API", "Vercel", "pytest"],
    pipeline: [
      { kind: "trigger", label: "Weekly + on ask", sub: "Telegram or cron" },
      { kind: "system", label: "Pull 3 markets", sub: "session-state switching" },
      { kind: "ai", label: "Answer questions", sub: "grounded, scoped index" },
      { kind: "system", label: "Reconcile payout", sub: "contract vs actual" },
      { kind: "outcome", label: "Flagged deltas", sub: "with caveats listed" },
    ],
  },

  {
    id: "camp-platform",
    title: "Hill Country Fishing Camps",
    subtitle: "The whole back office of a seasonal business, in one platform",
    org: "Personal · client build",
    year: "2026",
    featured: false,
    tags: ["personal", "fullstack", "agents"],
    blurb:
      "Marketing site, card-payment registration, admin operations hub, employee portal, hiring pipeline, and two knowledge-grounded chatbots with a hard public/internal split.",
    problem:
      "A multi-location kids' summer camp business ran its entire back office by hand: registrations and payment, per-location staffing and shift picking, waiting lists, onboarding reminders, hiring applications, and answering the same parent questions over and over.",
    approach: [
      "17 data models covering registrations, schedule slots, waiting lists with slot notifications, applications, and update requests with attachments.",
      "A visibility enum enforces a hard public/internal knowledge split at the data layer, so employee-only content structurally cannot surface in the parent-facing chatbot.",
      "The chatbot detects when it should escalate — phrases like 'real person' or 'not helpful' return an escalation flag alongside a confidence score and cited sources.",
      "Ingests media as knowledge: video captions and walkthrough metadata are auto-pulled so recorded content becomes searchable chatbot material.",
      "Integration credentials resolve from the database before environment variables, so the owner can wire up SMS and email from the admin UI without a redeploy.",
    ],
    outcome: [
      "A working platform covering six distinct surfaces from one codebase, deployed with scheduled onboarding reminders.",
      "Honest status: mid-roadmap with payments still in test mode — built, not yet taking live money.",
    ],
    metrics: [
      { value: "17", label: "data models" },
      { value: "6", label: "product surfaces" },
    ],
    stack: [
      "Next.js 15",
      "Prisma",
      "PostgreSQL",
      "Stripe",
      "Twilio",
      "Resend",
      "Vercel",
    ],
    pipeline: [
      { kind: "trigger", label: "Parent or staff", sub: "web, SMS, chat" },
      { kind: "system", label: "Register + pay", sub: "checkout + webhooks" },
      { kind: "ai", label: "Grounded chatbot", sub: "public / internal split" },
      { kind: "outcome", label: "Ops hub runs it", sub: "staffing to fulfilment" },
    ],
  },

  {
    id: "job-runner",
    title: "Job Runner",
    subtitle: "An agentic application pipeline — and the judgment call to walk it back",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "agents", "browser"],
    blurb:
      "A published CLI that discovers, enriches, scores, tailors and applies — driven by an agent over a browser — plus the later decision to deliberately give up its headline feature.",
    problem:
      "The manual application loop: searching boards one at a time, reading each posting, guessing fit, rewriting a resume per role, and re-typing the same data into every applicant tracking system.",
    approach: [
      "Six stages — discover, enrich, score, tailor, cover letter, apply — shipped as an installable CLI with a versioned changelog and automated publishing.",
      "A three-tier enrichment cascade: structured page data first, then selector patterns, and only then a model for unknown layouts. Cheap paths first, LLM as fallback.",
      "The apply stage drives arbitrary applicant tracking forms through an agent over a browser automation protocol rather than hardcoding a flow per site, with a dry-run mode that fills without submitting.",
      "Anti-fabrication tailoring: facts are preserved verbatim from a profile, and a validator enforces it — the model reorganizes but never invents.",
      "Rate-limit engineering for a free model tier: chunked scoring with pauses and per-item commits, so a mid-run failure never loses completed work.",
      "Later versions added a self-updating daemon controlled over Telegram that pulls, reinstalls and restarts itself when the main branch advances.",
    ],
    outcome: [
      "Published as a package, with an outside-user bug report fixed — real users beyond me.",
      "48 employer portals and 30 direct career sites preconfigured, on top of five job boards.",
      "The honest ending, and the part I'd actually defend in an interview: I later scrapped full auto-apply. It violates platform terms and risks account bans, so the successor design is explicitly human-in-the-loop and alert-based. The portfolio contains its own documented change of mind.",
    ],
    metrics: [
      { value: "48", label: "employer portals" },
      { value: "6", label: "pipeline stages" },
      { value: "~19k", label: "lines of Python" },
    ],
    stack: ["Python", "Playwright", "MCP", "Gemini", "OpenAI", "SQLite", "FastAPI"],
    pipeline: [
      { kind: "trigger", label: "Tiered search", sub: "boards + portals" },
      { kind: "system", label: "Enrich cascade", sub: "structured → CSS → AI" },
      { kind: "ai", label: "Score + tailor", sub: "facts preserved verbatim" },
      { kind: "system", label: "Agent applies", sub: "dry-run capable" },
      { kind: "outcome", label: "Walked back", sub: "human-in-the-loop instead" },
    ],
  },

  {
    id: "social-life-os",
    title: "Social Life OS",
    subtitle: "Explainable ranking with a calendar trick",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "fullstack"],
    blurb:
      "A curated Austin events feed with learned match scores that show their own math, syncing to a calendar as free time until you actually commit.",
    problem:
      "Hunting across event platforms for things worth attending, then adding them to a calendar — where 'maybe' events either clutter your real schedule or get forgotten entirely.",
    approach: [
      "Feed events are written to the calendar as transparent (free) so they surface without blocking availability; committing promotes the same event to busy with reminders re-enabled.",
      "Every app-created event is tagged with private properties, so toggling a category off deletes only this app's events and never touches real calendar entries.",
      "The ranking is explainable by design — each match percentage discloses its curated starting score, its learned adjustment, and the result, with bounded math documented in plain English.",
      "Feedback propagates across shared signals (category, tag, platform, cost, time, format) rather than only the event you clicked, and deletion is a stronger negative signal that stays recoverable.",
      "Real input hardening in the serverless layer: strict validation, control-character stripping, length caps, private visibility, and no-store cache headers.",
    ],
    outcome: [
      "Deployed and iterated across three meaningful revisions, from basic sync to explainable personalized ranking.",
      "54 curated events, each with a hand-assigned score and a written rationale.",
      "No build step at all — vanilla JS and hand-written CSS, which keeps it instant.",
    ],
    metrics: [
      { value: "54", label: "curated events" },
      { value: "6", label: "learning signals" },
    ],
    stack: ["Vanilla JS", "Google Calendar API", "Vercel Functions"],
    pipeline: [
      { kind: "trigger", label: "Curated feed", sub: "scored + explained" },
      { kind: "ai", label: "Learn from clicks", sub: "bounded adjustments" },
      { kind: "system", label: "Sync as free", sub: "transparent events" },
      { kind: "outcome", label: "Commit → busy", sub: "never clobbers real events" },
    ],
  },

  {
    id: "grad-copilot",
    title: "Grad School Copilot",
    subtitle: "Drafting in your own voice, grounded in your own writing",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "agents", "fullstack"],
    blurb:
      "Reads a learning platform for what's actually due, then drafts coursework in the student's real writing voice — built from a corpus of their own past work.",
    problem:
      "Course platforms are bad daily drivers — figuring out what's due across courses means clicking through each one — and every weekly discussion post starts from a blank page.",
    approach: [
      "A typed read-only client over the learning platform's API with proper pagination, pulling courses, grades, syllabi, assignments and announcements.",
      "The interesting idea: a 'my voice' corpus built automatically from the student's own past posts and uploaded essays, so tone is grounded in real prior writing rather than a prompt adjective.",
      "Layered prompt assembly combining assignment instructions, captured external articles, uploaded course resources, and voice samples.",
      "Follows external links found in assignments, extracts readable text, and flags paywalls before you hit them.",
      "Draft-only by design — nothing is ever submitted automatically.",
    ],
    outcome: [
      "Working locally with a real voice corpus of 33 samples captured.",
      "Honest status: not deployed, and the README names the three blockers itself — file storage needs replacing, delivery is a stub, and there's no auth yet.",
    ],
    metrics: [
      { value: "33", label: "voice samples" },
      { value: "0", label: "auto-submissions" },
    ],
    stack: ["Next.js", "TypeScript", "OpenAI API", "Canvas LMS API", "Cheerio"],
    pipeline: [
      { kind: "trigger", label: "Course sync", sub: "what's actually due" },
      { kind: "system", label: "Gather context", sub: "articles + resources" },
      { kind: "ai", label: "Draft in your voice", sub: "grounded in past work" },
      { kind: "outcome", label: "Edit and copy", sub: "you always submit" },
    ],
  },

  {
    id: "card-to-crm",
    title: "Business Card to CRM",
    subtitle: "Structured-output OCR, not a text dump",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "integration"],
    blurb:
      "Photograph a business card; vision extraction returns a strict 14-field schema that maps straight onto CRM trigger fields.",
    problem:
      "Typing conference business cards into a CRM one field at a time.",
    approach: [
      "A strict 14-field JSON schema with every field required, rather than asking for free text and parsing it afterwards.",
      "The prompt does the normalization: names split into first and last, phone numbers keep country codes, bare domains get a scheme, addresses parse into components, and anything left over goes to notes.",
      "Output keys map directly onto the CRM's workflow trigger fields, so there's no translation layer.",
      "Real device polish — iPhone clipboard paste and HEIC photos both work, solved with an auto-focused paste target.",
    ],
    outcome: [
      "Deployed and working. Intentionally tiny: three library files, two API routes, two dependencies.",
    ],
    metrics: [
      { value: "14", label: "fields, all required" },
      { value: "2", label: "runtime dependencies" },
    ],
    stack: ["Next.js", "GPT-4o vision", "GoHighLevel webhook", "Vercel"],
    pipeline: [
      { kind: "trigger", label: "Photo or paste", sub: "HEIC supported" },
      { kind: "ai", label: "Schema-locked OCR", sub: "14 required fields" },
      { kind: "outcome", label: "Contact in CRM", sub: "trigger-ready keys" },
    ],
  },

  {
    id: "lifepulse",
    title: "LifePulse",
    subtitle: "Getting data out from behind a platform wall",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "fullstack"],
    blurb:
      "A native iOS app that extracts Screen Time data the OS deliberately keeps unreadable, using an app-group sideband around a sandboxed report extension.",
    problem:
      "iOS walls Screen Time data inside Settings — no export, no read API. The numbers are only ever available inside a sandboxed report extension whose view the system renders into the host app, and the host app itself can never read them.",
    approach: [
      "The extension aggregates per-app durations while rendering and persists the result to a shared app group — written to both defaults and an atomic file — and the main app reads that sideband instead.",
      "Handled the race explicitly: the extension only writes when its view actually renders, so the app polls shared storage on a short interval with a timeout, and manual sync forces a range change and waits for a re-render.",
      "Background refresh on a twelve-hour cadence, re-submitted after each run, plus a foreground catch-up.",
      "Correct entitlements for the hard part, which is most of the battle with this API family.",
    ],
    outcome: [
      "A working prototype that ran on real hardware — the race-condition handling is the tell, since you only write that after watching it fail on a device.",
    ],
    metrics: [
      { value: "12 hr", label: "background cadence" },
      { value: "1", label: "sandbox worked around" },
    ],
    stack: ["Swift", "SwiftUI", "FamilyControls", "DeviceActivity", "Supabase"],
    pipeline: [
      { kind: "trigger", label: "Background task", sub: "every 12 hours" },
      { kind: "system", label: "Extension renders", sub: "writes app-group file" },
      { kind: "system", label: "Host reads sideband", sub: "polls with timeout" },
      { kind: "outcome", label: "Data escapes", sub: "ingested externally" },
    ],
  },

  {
    id: "role-finder",
    title: "Role Finder",
    subtitle: "Built for friends, and the negative result that shaped it",
    org: "Personal",
    year: "2026",
    featured: false,
    tags: ["personal", "fullstack"],
    blurb:
      "A multi-tenant job-search tool for friends, where an entire profile rides in the URL — and which deliberately never links to a single job posting.",
    problem:
      "Friends job-hunting in an unfamiliar market didn't know which channels their roles even lived on, and burned time on dead job links.",
    approach: [
      "The core design decision came from a tested negative result: every individual posting link checked was already dead within days, so the tool links to tested evergreen search URLs and curated sourcing maps instead of individual jobs.",
      "Zero-infrastructure multi-tenancy — a friend's whole profile is encoded into the URL fragment, so a new user needs no database row and no deploy, just a link.",
      "A 'why not a fit' capture records the user's own rejection reasons, designed as training data for a later scheduled ranking pass.",
      "Explicit ethical guardrails written into the README: no auto-submitting and no account creation on someone else's behalf, because full auto-apply violates platform terms and risks bans.",
    ],
    outcome: [
      "Deployed and in use, with verified-live employer links tested by hand on a specific date.",
      "Honest status: phase two of four — the curated dashboard works, the scheduled automation isn't built.",
    ],
    metrics: [
      { value: "0", label: "dead links shipped" },
      { value: "1", label: "URL = whole profile" },
    ],
    stack: ["Vanilla JS", "GitHub Actions", "Vercel"],
    pipeline: [
      { kind: "trigger", label: "Chat intake", sub: "creates a profile" },
      { kind: "system", label: "Encode to URL", sub: "no DB, no deploy" },
      { kind: "outcome", label: "Curated channels", sub: "evergreen searches only" },
    ],
  },
];

export const APPROACH = [
  {
    step: "01",
    title: "Find the real manual work",
    body: "Not the work people complain about — the work they've stopped noticing. It's usually someone re-typing the same data into a second system, or a judgment call being made from memory because the data is too annoying to look up.",
  },
  {
    step: "02",
    title: "Measure before building",
    body: "The support AI project started as an audit, not a pipeline. Reading 90 days of real conversations is what told me the knowledge base was the constraint — and gave me a baseline to grade the fix against afterwards.",
  },
  {
    step: "03",
    title: "Put it where people already are",
    body: "Almost none of my work has its own UI. It lives in Slack, in Telegram, in the inbox, in the CRM. Adoption problems are usually interface problems, and the interface people already have is the one that wins.",
  },
  {
    step: "04",
    title: "Make the model's job small",
    body: "Deterministic layers first, model last, and constrained when it runs. Fixed vocabularies, required evidence, confidence thresholds, validation gates that drop anything unreal. The taxonomy audit invented zero values out of 812 because the gate wouldn't let it.",
  },
  {
    step: "05",
    title: "Assume it will break",
    body: "Idempotent syncs keyed on content hash. Dedup that fails open so a hiccup never swallows real work. Safety gates that hard-skip rather than guess before anything irreversible. Health endpoints that report the deployed commit.",
  },
  {
    step: "06",
    title: "Keep the human where it counts",
    body: "Confidence-scored proposals behind an approval queue. Draft-only output. Scopes that structurally cannot delete. I've also killed my own features on these grounds — full auto-apply worked, and I scrapped it.",
  },
];
