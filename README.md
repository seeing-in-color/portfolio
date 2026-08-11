# andrestaquechel.com portfolio

Portfolio site for Andres Taquechel — AI Operations Specialist. Live at
**[portfolio.andrestaquechel.com](https://portfolio.andrestaquechel.com)**.

Static HTML/CSS/vanilla JS with one serverless function. No framework, no build
step, no bundler — the whole site is four files plus a dataset.

## Layout

```
index.html            markup and meta
assets/styles.css     design tokens, layout, components (light + dark)
assets/data.js        the project dataset — edit this to change content
assets/app.js         grid, filters, animated pipelines, counters, chat client
assets/og.svg         social share card
api/chat.js           "Ask AI about Andres" — Vercel Edge function, Claude API
scripts/smoke-test.mjs  guard-path tests for the chat endpoint
```

**To add or edit a project, only `assets/data.js` changes.** The grid, filter
chips, detail sheets, pipeline diagrams, and metric tiles all render from it.

## Local development

```bash
npm install
python3 -m http.server 4321
```

The static site works fully offline; `/api/chat` won't resolve, and the chat
widget degrades to an "email him instead" message. To exercise the real
endpoint, use `vercel dev` with `ANTHROPIC_API_KEY` set locally.

Run the endpoint's guard-path tests (no API key or network needed):

```bash
npm test
```

## Deployment

Vercel, on the `dretaq` personal account. Pushes to `main` deploy
automatically.

One environment variable is required, set in **Vercel → Settings →
Environment Variables**:

| Variable | Value |
| --- | --- |
| `ANTHROPIC_API_KEY` | An Anthropic API key |

Without it, `/api/chat` returns 503 and the widget shows its fallback message.
The key is never committed — see `.env.example`.

### DNS

`portfolio.andrestaquechel.com` is a CNAME in Cloudflare pointing at
`cname.vercel-dns.com` with **proxy disabled (grey cloud)**. The proxy has to
stay off or Vercel can't issue the TLS certificate.

## Booking embed

The bottom section embeds a Google Calendar appointment schedule. It is **off
until you paste your link in** — set `PROFILE.bookingEmbed` in
`assets/data.js`:

1. Open your booking page in Google Calendar and copy the share link.
2. Paste it into `bookingEmbed` with `?gv=true` appended.

Until then (or if the iframe fails to load within 6 seconds) the section shows
a styled card with your email and a link out to the calendar, so it never
renders as a broken white box.

## Design notes

- **Dark is the default**, light is a full theme rather than a tint. The toggle
  persists to `localStorage`; with no stored preference the OS setting wins.
- **Nothing is boxed in.** Surfaces are gradients plus a hairline top edge and
  soft shadow — no 1px card outlines. Radii start at 20px; controls are pills.
- **The ambient backdrop** is three slow-drifting radial fields plus fine
  grain, animating `transform`/`opacity` only so it stays on the compositor.
- **Cards track the cursor**: `--mx`/`--my` are written on `pointermove` and
  CSS places a radial highlight under the pointer. Skipped on touch.
- **The headline reveal uses a timer, not `requestAnimationFrame`.** rAF is
  suspended in background tabs, so a page opened in one would render the
  headline permanently invisible.
- **The marquee fades via `mask-image`**, not an overlaid gradient — an opaque
  fade would block the glow behind it and read as a flat dark rectangle.
- **The project grid uses `grid-auto-flow: dense`** because featured cards span
  two tracks and would otherwise leave unfillable holes beside them.
- **Scroll animations are gated behind a `js` class** set on `<html>` at
  runtime. If scripting or `IntersectionObserver` is unavailable, the hidden
  state is never applied and everything renders visible. A portfolio that
  animates in is nice; one that renders blank is not.
- **Metric tiles ship the real number in the markup** and are zeroed only once
  the count-up is actually going to run, so a failed animation shows the true
  figure rather than `0`.
- `prefers-reduced-motion` disables the reveals, the pipeline sequencing, and
  the count-up.
- Wide content (pipeline diagrams) scrolls inside its own container; the page
  body never scrolls horizontally.

## Content rules

Work projects are written as anonymized case studies. When editing
`assets/data.js`:

- No customer names, ticket numbers, or internal performance figures.
- Metrics must trace to something real. Prefix estimates with `~`.
- Keep the honest status lines. Several projects say "not deployed" or
  "mid-roadmap" — that credibility is the point, and it is load-bearing in
  interviews.
