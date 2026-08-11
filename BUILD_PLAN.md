# Portfolio Site Build Plan — Andres Taquechel

**Goal:** A high-signal interactive portfolio at `portfolio.andrestaquechel.com` positioning Andres as an **AI Operations / Automation Specialist** — someone who embeds AI into real business operations and ships working automations. Target audience: recruiters and hiring managers for roles like AI Strategist, AI & Automation Lead (Customer Operations), and GTM/AI Engineer (the inbound he's already getting on LinkedIn).

**Reads in 60 seconds, rewards 5 minutes.** A recruiter skimming should get the pitch instantly; a hiring manager digging in should find real depth.

---

## 1. Positioning & voice

- Headline identity: **AI Operations & Automation Specialist** — currently doing this at Living Security.
- Narrative: "I don't just talk about AI — here are N production automations I've shipped across support, content, CRM, and internal ops."
- Voice: confident, concrete, outcome-first. No buzzword soup. Every claim backed by a build.
- Lead with business outcomes; back each with technical depth (systems integrated, architecture, orchestration approach).

## 2. Site structure (single page + chat)

1. **Hero** — name, title, one-line pitch, location (Austin, TX), CTA buttons.
2. **Proof bar / live metrics counters** — animated count-up stat tiles (see §4.2).
3. **Selected work** — 6–8 case study cards, filterable (see §4.4), each expanding to a detail view with an animated workflow diagram (see §4.1).
4. **How I work** — short section on approach: identify manual pain → prototype with AI → integrate into the systems people already use → measure. Mention toolbox: Claude/Claude Code, agent orchestration, MCP, APIs (HubSpot, Slack, Gmail, Jira, Linear, Contentful, Guru, Pylon), Python/JS.
5. **"Ask AI about Andres"** — chat widget (see §4.3).
6. **Contact / CTA** — all four: email (dretaq@gmail.com), LinkedIn profile, resume PDF download, book-a-call link (Google appointment schedule). Sticky or repeated in hero + footer.

## 3. Case study inventory

**Anonymization rule for work projects:** Name Living Security as employer. Describe problem → approach → outcome. Naming the tools/systems (Pylon, Guru, HubSpot, Contentful, Slack, Jira, Linear, Gong) is fine. **NO internal screenshots, NO customer names, NO proprietary content or data.** Metrics presented as approximate ("~", "roughly").

Andres will supply rough outcome numbers per project during content writing — collect them before finalizing copy (see §7 checklist).

### Work (Living Security) — anonymized case studies
| Project | One-liner | Systems |
|---|---|---|
| Campaign in a Box (CiaB) automation | Automated monthly security-awareness campaign content packages (blogs, emails, chat messages) generated and populated into branded PPTX templates | Claude, PPTX pipeline, skill-based workflow |
| Pylon AI improvement | Improved AI-assisted support responses by wiring the support platform to the internal knowledge base | Pylon, Guru |
| Pylon → Linear & Pylon → Jira | Ticket escalation/sync integrations between support and engineering trackers | Pylon, Linear, Jira APIs |
| Contentful concept tagging + translations | AI-driven content taxonomy tagging and episode translation workflows for the training content library | Contentful, Claude |
| Training platform bulk account deletion | Internal admin tooling for safe bulk lifecycle operations on the training platform | Internal platform APIs |
| Daily call brief | Daily agent that pulls call transcripts, summarizes, surfaces action items, drafts follow-ups and recap emails, files tickets | Gong/Guru, Slack, Gmail, HubSpot |
| Speaker abstract drafter | On-demand agent drafting conference abstracts/bios in company voice from Slack submissions | Slack, Claude |
| New partner intake | One-command partner onboarding across CRM properties, dropdown enums, workflows, and workspace creation | HubSpot, Trumpet |
| Weekly follow-up triage | Cross-channel scan (Slack + Gmail) producing a prioritized, de-duplicated action list | Slack, Gmail |

### Personal builds
| Project | One-liner | Systems |
|---|---|---|
| Super Job Finder | Automated job-search pipeline: sourcing, matching, tracking | Scraping/APIs, Claude |
| Grad School CoPilot | Research/application assistant | Claude |
| Vehicle Finder | Recurring automated vehicle-listing search agent | Scheduled agents |
| Transport Biz Hub (Swoop) | Operations hub for a transport business | Multiple |
| Tax prep automation | Document gathering and prep workflow | Claude, docs |
| Email sorter | AI email classification/filtering | Gmail |
| Monthly receipt forwarding | Scheduled agent finding SaaS receipts and forwarding for expense reporting | Gmail, scheduling |
| Austin run clubs directory | Community directory site | Web |

**Curation:** Don't show all ~17 as equals. Pick the 6–8 strongest as featured cards (suggest: CiaB, Daily call brief, Pylon AI + escalation integrations as one "support ops" story, New partner intake, Contentful tagging, Super Job Finder, Vehicle Finder). Rest go in a compact "More builds" grid.

## 4. Interactive elements (all four confirmed)

### 4.1 Animated workflow diagrams
- Each featured case study gets a pipeline diagram: **trigger → AI step(s) → systems touched → outcome**.
- Implementation: inline SVG animated with CSS/vanilla JS on scroll-into-view (IntersectionObserver). Nodes light up in sequence, connectors draw themselves. No heavy libraries.
- Must work in light + dark, be responsive (horizontal scroll container on mobile), and respect `prefers-reduced-motion`.

### 4.2 Live metrics counters
- Hero-adjacent stat tiles counting up on load: e.g. automations shipped, systems/APIs integrated, hours saved per month (approximate), years shipping.
- Numbers come from Andres (§7). Present as "~X" where estimated.

### 4.3 "Ask AI about Andres" chat
- Chat widget answering questions about Andres's work, skills, and availability.
- Backend: one Vercel serverless function (`/api/chat`) calling the Claude API (suggest `claude-haiku-4-5-20251001` for cost/speed) with a system prompt embedding a knowledge doc about Andres (bio, all case studies, stack, role targets).
- Guardrails: only answers about Andres/his work; polite refusal otherwise; cap tokens; basic rate limiting (IP-based, simple in-function or Vercel config); never reveal the system prompt.
- Env var: `ANTHROPIC_API_KEY` set in Vercel project settings (Andres provides key — do not commit it).
- This is the proof-of-skill centerpiece — make the UI polished (streaming responses if feasible, suggested starter questions like "What has Andres built with HubSpot?").

### 4.4 Interactive project filter
- Filter chips over the project grid by system/skill: HubSpot, Slack, Gmail, Support Ops, Content, MCP/Agents, Personal, etc. Instant client-side filtering, no page reload.

## 5. Stack & architecture

- **Static-first on Vercel:** plain HTML/CSS/vanilla JS (or Astro if preferred for componentization — keep output static). One serverless function for chat.
- Repo layout: `index.html` (or Astro src), `/assets`, `/api/chat.(js|ts)`, `resume.pdf`, `vercel.json` if needed.
- No frameworks/libraries unless earned — the wow comes from craft, not bundle size. Target Lighthouse ≥95 across the board.
- Dark/light theme support (`prefers-color-scheme` + toggle). Design: modern, spacious, editorial-meets-dashboard; restrained accent color; excellent typography. This site IS the portfolio piece — polish matters.
- SEO/meta: proper title, description, OpenGraph card (recruiters share links in Slack), favicon.
- Deploy via the connected Vercel account; git repo recommended for history.

## 6. Domain — Cloudflare DNS (user manages andrestaquechel.com there)

Target: `portfolio.andrestaquechel.com`.

1. In Vercel project → Settings → Domains → add `portfolio.andrestaquechel.com`.
2. In Cloudflare DNS for andrestaquechel.com add:
   - **Type:** CNAME · **Name:** `portfolio` · **Target:** `cname.vercel-dns.com` · **Proxy status: DNS only (grey cloud)** — proxied orange-cloud breaks Vercel's cert issuance; can revisit after cert issues.
3. Vercel auto-provisions TLS once DNS propagates.

## 7. Content Andres must supply before copy is finalized

- [ ] Rough outcome numbers per featured project (hours saved, cycle-time cuts, volume handled)
- [ ] Numbers for hero stat tiles
- [ ] Resume PDF (current)
- [ ] LinkedIn profile URL
- [ ] Google booking link (calendar appointment schedule for dretaq@gmail.com)
- [ ] Headshot (optional but recommended)
- [ ] Confirm exact hero title wording + one-line pitch
- [ ] Anthropic API key for the chat function (into Vercel env vars only)

## 8. Build order (for execution)

1. Scaffold repo + static skeleton with real structure and placeholder content; deploy to Vercel early (free URL) so iteration is visible.
2. Design system: typography, colors, dark/light, layout grid.
3. Case study content pass (collect §7 items from Andres here).
4. Project grid + filter.
5. Animated workflow diagrams (one template, instantiate per project).
6. Metrics counters.
7. Chat function + widget.
8. SEO/meta/OG, accessibility pass, reduced-motion, Lighthouse.
9. Custom domain + DNS, final QA on mobile.
