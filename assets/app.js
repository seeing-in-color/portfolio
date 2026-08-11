import {
  PROFILE,
  STATS,
  FILTERS,
  PROJECTS,
  APPROACH,
  SYSTEMS,
} from "./data.js";

/* ------------------------------------------------------------- helpers --- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
};
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

/* Scroll animations depend on IntersectionObserver. The `js` class is what
 * arms the hidden-until-scrolled CSS, so if the observer isn't available the
 * class is never set and everything renders visible and un-animated. */
const canAnimate = "IntersectionObserver" in window;
if (canAnimate) document.documentElement.classList.add("js");

const ICON = {
  arrow:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  mail:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM2.4 9.75h5.16V21H2.4zM9.9 9.75h4.94v1.54h.07a5.42 5.42 0 0 1 4.87-2.68c3.2 0 4.62 1.9 4.62 5.53V21h-5.16v-6.06c0-1.53-.55-2.57-1.92-2.57-1.05 0-1.68.71-1.95 1.4-.1.24-.13.58-.13.92V21H9.9z"/></svg>',
  doc:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15h6M9 11h3"/></svg>',
  cal:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
};

/* --------------------------------------------------------------- theme --- */
(() => {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;

  $("#theme").addEventListener("click", () => {
    const root = document.documentElement;
    const isLight = getComputedStyle(root)
      .getPropertyValue("color-scheme")
      .includes("light");
    const next = isLight ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
})();

/* ----------------------------------------------------------- nav state --- */
(() => {
  if (!canAnimate) return;
  const nav = $("#nav");
  const io = new IntersectionObserver(
    ([e]) => nav.classList.toggle("is-stuck", !e.isIntersecting),
    { rootMargin: "-1px 0px 0px 0px", threshold: 1 }
  );
  const probe = el("div");
  probe.style.cssText = "position:absolute;top:0;height:1px;width:1px";
  document.body.prepend(probe);
  io.observe(probe);
})();

/* --------------------------------------------------------- scroll-in --- */
const revealer = canAnimate
  ? new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          revealer.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    )
  : null;

const watchReveals = (root = document) => {
  const nodes = root.querySelectorAll(".reveal:not(.is-in)");
  if (!revealer) return nodes.forEach((n) => n.classList.add("is-in"));
  nodes.forEach((n) => revealer.observe(n));
};

/* -------------------------------------------------------------- static --- */
$("#pitch").textContent = PROFILE.pitch;
$("#year").textContent = new Date().getFullYear();
$("#cta-resume").href = PROFILE.resume;

/* --------------------------------------------------------- scroll rail --- */
(() => {
  const bar = $("#rail");
  let queued = false;
  const paint = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty("--p", max > 0 ? window.scrollY / max : 0);
    queued = false;
  };
  addEventListener(
    "scroll",
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    },
    { passive: true }
  );
  paint();
})();

/* ---------------------------------------------------- headline entrance --- */
/* Wrap each word so it can rise independently. Done in JS so the markup
 * stays readable and the heading is a normal <h1> to crawlers. */
(() => {
  const h1 = $("#headline");
  if (!canAnimate) return;

  const wrapWords = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      } else if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((piece) => {
          if (!piece.trim()) return frag.append(piece);
          const w = el("span", "w");
          w.textContent = piece;
          frag.append(w);
        });
        child.replaceWith(frag);
      }
    }
  };
  wrapWords(h1);

  const words = [...h1.querySelectorAll(".w")];
  words.forEach((w, i) => {
    w.style.transitionDelay = reduceMotion ? "0s" : `${60 + i * 34}ms`;
  });

  /* A timer, not requestAnimationFrame: rAF is suspended in background tabs,
   * so a page opened in one would render the headline permanently invisible.
   * Timers still fire (throttled), so the reveal always lands. */
  setTimeout(() => h1.classList.add("is-in"), 60);
})();

/* ------------------------------------------------------------- marquee --- */
(() => {
  const host = $("#marquee");
  if (!host || !SYSTEMS?.length) return;
  // Two identical lists so the -50% translate loops seamlessly.
  const list = () => {
    const ul = document.createElement("ul");
    ul.innerHTML = SYSTEMS.map((s) => `<li>${s}</li>`).join("");
    return ul;
  };
  host.append(list(), list());
})();

/* ------------------------------------------------- cursor-tracked glow --- */
/* Writes --mx/--my as percentages so CSS can place a radial highlight under
 * the pointer. Skipped on touch, where there is no hover to track. */
(() => {
  if (!window.matchMedia("(hover: hover)").matches) return;
  const selector = ".card, .btn";
  addEventListener(
    "pointermove",
    (e) => {
      const target = e.target.closest?.(selector);
      if (!target) return;
      const r = target.getBoundingClientRect();
      target.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      target.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    },
    { passive: true }
  );
})();

/* --------------------------------------------------------------- stats --- */
(() => {
  const host = $("#stats");
  const format = (n) => n.toLocaleString("en-US");

  // Render the real figure up front. If the count-up never runs, the tiles
  // still show the true number rather than a misleading zero.
  STATS.forEach((s) => {
    const card = el("div", "stat");
    card.innerHTML = `
      <div class="stat__val" data-target="${s.value}" data-suffix="${s.suffix}">${format(
      s.value
    )}${s.suffix}</div>
      <div class="stat__label">${s.label}</div>
      <div class="stat__note">${s.note}</div>`;
    host.append(card);
  });

  if (!canAnimate || reduceMotion) return;

  const run = (node) => {
    const target = Number(node.dataset.target);
    const suffix = node.dataset.suffix ?? "";
    const dur = 1500;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      // easeOutExpo — lands softly rather than stopping dead
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      node.textContent = format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        run(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.6 }
  );

  host.querySelectorAll(".stat__val").forEach((n) => {
    n.textContent = "0" + (n.dataset.suffix ?? ""); // zero only once it will animate
    io.observe(n);
  });
})();

/* ------------------------------------------------------------ approach --- */
(() => {
  const host = $("#approach-grid");
  APPROACH.forEach((a) => {
    const item = el("div", "approach__item");
    item.innerHTML = `
      <div class="approach__step">${a.step}</div>
      <h3>${a.title}</h3>
      <p>${a.body}</p>`;
    host.append(item);
  });
})();

/* ------------------------------------------------------------ pipeline --- */
function buildPipeline(steps) {
  const pipe = el("div", "pipe");
  pipe.setAttribute("role", "img");
  pipe.setAttribute(
    "aria-label",
    "Pipeline: " + steps.map((s) => `${s.label} (${s.sub})`).join(" then ")
  );

  steps.forEach((s, i) => {
    if (i > 0) pipe.append(el("div", "pipe__link"));
    const node = el("div", "pipe__node");
    node.dataset.kind = s.kind;
    node.innerHTML = `
      <div class="pipe__kind"><i></i>${s.kind}</div>
      <b>${s.label}</b>
      <span>${s.sub}</span>`;
    pipe.append(node);
  });

  // Stagger the reveal so it reads as flow rather than a single pop.
  const parts = [...pipe.children];
  parts.forEach((n, i) => {
    n.style.transitionDelay = reduceMotion ? "0s" : `${i * 90}ms`;
  });

  if (!canAnimate) {
    pipe.classList.add("is-live");
    return pipe;
  }

  const io = new IntersectionObserver(
    ([e]) => {
      if (!e.isIntersecting) return;
      pipe.classList.add("is-live");
      io.disconnect();
    },
    { threshold: 0.35 }
  );
  requestAnimationFrame(() => io.observe(pipe));

  return pipe;
}

/* --------------------------------------------------------------- cards --- */
const grid = $("#grid");
let active = "all";

function cardFor(p) {
  const card = el("button", "card" + (p.featured ? " card--featured" : ""));
  card.type = "button";
  card.dataset.id = p.id;
  card.setAttribute("aria-haspopup", "dialog");

  const metrics = (p.metrics ?? [])
    .map(
      (m) =>
        `<div class="card__metric"><b>${m.value}</b><span>${m.label}</span></div>`
    )
    .join("");

  card.innerHTML = `
    <div class="card__top">
      <span class="badge">${p.org}</span>
      <span class="badge badge--year">${p.year}</span>
    </div>
    <h3>${p.title}</h3>
    <p class="card__sub">${p.subtitle}</p>
    <p class="card__blurb">${p.blurb}</p>
    <div class="card__metrics">${metrics}</div>
    <span class="card__open">Read the case study ${ICON.arrow}</span>`;

  card.addEventListener("click", () => openSheet(p.id, card));
  return card;
}

function render() {
  grid.innerHTML = "";
  const list = PROJECTS.filter(
    (p) => active === "all" || p.tags.includes(active)
  );
  list.forEach((p) => grid.append(cardFor(p)));

  const label = FILTERS.find((f) => f.id === active).label;
  $("#count").innerHTML =
    active === "all"
      ? `${list.length} projects`
      : `${list.length} project${list.length === 1 ? "" : "s"} in <strong>${label}</strong>`;
}

(() => {
  const host = $("#filters");
  FILTERS.forEach((f) => {
    const b = el("button", "chip");
    b.type = "button";
    b.innerHTML = f.label;
    b.setAttribute("aria-pressed", String(f.id === active));
    b.addEventListener("click", () => {
      active = f.id;
      host.querySelectorAll(".chip").forEach((c) =>
        c.setAttribute("aria-pressed", String(c === b))
      );
      render();
    });
    host.append(b);
  });
  render();
})();

/* --------------------------------------------------------------- sheet --- */
const sheet = $("#sheet");
const sheetBody = $("#sheet-body");
let lastFocus = null;

function openSheet(id, trigger) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  lastFocus = trigger ?? null;

  sheetBody.innerHTML = `
    <div class="card__top">
      <span class="badge">${p.org}</span>
      <span class="badge badge--year">${p.year}</span>
    </div>
    <h2 id="sheet-title">${p.title}</h2>
    <p class="sheet__lede">${p.subtitle}</p>

    <h4>Pipeline</h4>
    <div data-pipe></div>

    <h4>The problem</h4>
    <p>${p.problem}</p>

    <h4>Approach</h4>
    <ul>${p.approach.map((a) => `<li><span>${a}</span></li>`).join("")}</ul>

    <h4>Outcome</h4>
    <ul class="outcomes">${p.outcome
      .map((o) => `<li><span>${o}</span></li>`)
      .join("")}</ul>

    <h4>By the numbers</h4>
    <div class="metric-row">${(p.metrics ?? [])
      .map((m) => `<div><b>${m.value}</b><span>${m.label}</span></div>`)
      .join("")}</div>

    <h4>Stack</h4>
    <div class="tags">${p.stack
      .map((s) => `<span class="tag-pill">${s}</span>`)
      .join("")}</div>`;

  $("[data-pipe]", sheetBody).replaceWith(buildPipeline(p.pipeline));

  sheet.hidden = false;
  document.body.classList.add("is-locked");
  requestAnimationFrame(() => sheet.classList.add("is-open"));
  $(".sheet__close", sheet).focus();
}

function closeSheet() {
  sheet.classList.remove("is-open");
  document.body.classList.remove("is-locked");
  const done = () => {
    sheet.hidden = true;
    sheetBody.innerHTML = "";
  };
  reduceMotion ? done() : setTimeout(done, 320);
  lastFocus?.focus();
}

sheet.addEventListener("click", (e) => {
  if (e.target.closest("[data-close]")) closeSheet();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !sheet.hidden) closeSheet();
});
// Keep tab focus inside the dialog while it's open.
sheet.addEventListener("keydown", (e) => {
  if (e.key !== "Tab") return;
  const nodes = [
    ...sheet.querySelectorAll(
      'button, a[href], [tabindex]:not([tabindex="-1"])'
    ),
  ].filter((n) => n.offsetParent !== null);
  if (!nodes.length) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

/* ------------------------------------------------------------- contact --- */
(() => {
  const host = $("#contact-links");
  const links = [
    {
      icon: ICON.mail,
      label: "Email",
      sub: PROFILE.email,
      href: `mailto:${PROFILE.email}`,
    },
    {
      icon: ICON.linkedin,
      label: "LinkedIn",
      sub: "Connect or message me",
      href: PROFILE.linkedin,
    },
    {
      icon: ICON.doc,
      label: "Résumé",
      sub: "PDF download",
      href: PROFILE.resume,
    },
    {
      icon: ICON.cal,
      label: "Book a call",
      sub: "Find a time that works",
      href: PROFILE.booking,
    },
  ];

  links.forEach((l) => {
    const a = el("a", "contact__link");
    a.href = l.href;
    if (l.href.startsWith("http")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    a.innerHTML = `${l.icon}<span><b>${l.label}</b><span>${l.sub}</span></span>
      <svg class="arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
    host.append(a);
  });
})();

/* ------------------------------------------------------------- booking --- */
/* Embeds the Google Calendar appointment schedule when PROFILE.bookingEmbed
 * is set. If it's blank — or the iframe fails to load — a styled card takes
 * its place, so the section never renders as a broken white box. */
(() => {
  const host = $("#book-frame");
  if (!host) return;

  const fallback = (note) => {
    host.innerHTML = `
      <div class="book__fallback">
        <p class="mono">${note}</p>
        <h3>Let's find a time</h3>
        <p>
          Email me with a couple of windows that work and I'll confirm within
          the day. I'm in Central time but flexible.
        </p>
        <a class="btn btn--primary" href="mailto:${PROFILE.email}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
          <span>${PROFILE.email}</span>
        </a>
        <a class="btn" href="${PROFILE.booking}" target="_blank" rel="noopener noreferrer">
          <span>Open my calendar</span>
          ${ICON.arrow}
        </a>
      </div>`;
  };

  const url = (PROFILE.bookingEmbed ?? "").trim();
  if (!url) return fallback("Scheduling link");

  const frame = document.createElement("iframe");
  frame.src = url;
  frame.title = "Book a call with Andres Taquechel";
  frame.loading = "lazy";
  frame.setAttribute("frameborder", "0");

  // Google's embed doesn't report load errors cross-origin, so "never fired
  // onload" is the only failure signal available. The grace period is
  // deliberately long: the booking widget is heavy, and a short timeout
  // showed "Calendar unavailable" on a perfectly good cold load. Better to
  // let a slow connection finish than to lie about the calendar being down.
  let loaded = false;
  const toFallback = () => {
    if (loaded) return;
    host.classList.remove("is-embed");
    fallback("Calendar unavailable");
  };
  frame.addEventListener("load", () => (loaded = true));
  frame.addEventListener("error", toFallback);
  setTimeout(toFallback, 20000);

  // Switches the panel to a light surface — see the note in styles.css.
  host.classList.add("is-embed");
  host.append(frame);
})();

/* ---------------------------------------------------------------- chat --- */
(() => {
  const log = $("#log");
  const form = $("#chat-form");
  const input = $("#chat-input");
  const send = $(".chat__send");
  const seedHost = $("#seeds");

  const SEEDS = [
    "What has Andres built with HubSpot?",
    "Show me his most technically impressive project",
    "How does he keep AI from making things up?",
    "Has he ever killed one of his own features?",
    "Why should we hire him for an AI ops role?",
  ];

  const history = [];
  let busy = false;

  const escape = (s) =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // Minimal, safe formatting: paragraphs plus **bold**.
  const fmt = (text) =>
    escape(text)
      .split(/\n{2,}/)
      .map(
        (para) =>
          `<p>${para
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`
      )
      .join("");

  function bubble(role, html) {
    const msg = el("div", `msg msg--${role}`);
    msg.innerHTML = `
      <div class="msg__who">${role === "user" ? "You" : "AI"}</div>
      <div class="msg__text">${html}</div>`;
    log.append(msg);
    log.scrollTop = log.scrollHeight;
    return $(".msg__text", msg);
  }

  bubble(
    "bot",
    fmt(
      "Hi — I'm an assistant with the full detail of Andres's work in front of me. Ask me anything about what he's built, how he builds it, or whether he's a fit for a role you're hiring for."
    )
  );

  SEEDS.forEach((q) => {
    const b = el("button", "seed");
    b.type = "button";
    b.textContent = q;
    b.addEventListener("click", () => {
      input.value = q;
      form.requestSubmit();
    });
    seedHost.append(b);
  });

  async function ask(question) {
    busy = true;
    send.disabled = true;
    seedHost.hidden = true;

    bubble("user", fmt(question));
    const target = bubble("bot", '<span class="dots"><i></i><i></i><i></i></span>');

    history.push({ role: "user", content: question });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });

      if (!res.ok || !res.body) {
        const detail = await res.text().catch(() => "");
        throw new Error(detail || `HTTP ${res.status}`);
      }

      // The endpoint streams plain UTF-8 text, so chunks append directly.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        target.innerHTML = fmt(answer);
        log.scrollTop = log.scrollHeight;
      }

      if (!answer.trim()) throw new Error("Empty response");
      history.push({ role: "assistant", content: answer });
    } catch (err) {
      target.innerHTML = fmt(
        "I couldn't reach the assistant just then. Andres is at **dretaq@gmail.com** — that route always works."
      );
      console.error("chat failed:", err);
    } finally {
      busy = false;
      send.disabled = false;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || busy) return;
    input.value = "";
    ask(q);
  });
})();

watchReveals();
