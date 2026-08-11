import Anthropic from "@anthropic-ai/sdk";
import handler from "../api/chat.js";

let fails = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
  if (!ok) fails++;
};

const post = (body, ip = "1.2.3.4") =>
  handler(
    new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify(body),
    })
  );

// --- SDK surface the handler depends on -------------------------------------
const c = new Anthropic({ apiKey: "test-not-a-real-key" });
check("SDK imports and constructs", typeof c === "object");
check("messages.stream exists", typeof c.messages.stream === "function");
check("RateLimitError exported", typeof Anthropic.RateLimitError === "function");

// --- guard paths (no network) ----------------------------------------------
delete process.env.ANTHROPIC_API_KEY;

const wrongMethod = await handler(
  new Request("http://localhost/api/chat", { method: "GET" })
);
check("GET rejected with 405", wrongMethod.status === 405);

const noKey = await post({ messages: [{ role: "user", content: "hi" }] });
check("missing key returns 503", noKey.status === 503, `got ${noKey.status}`);

process.env.ANTHROPIC_API_KEY = "test-not-a-real-key";

const empty = await post({ messages: [] });
check("empty messages returns 400", empty.status === 400, `got ${empty.status}`);

// Leading assistant turn must be dropped, leaving nothing -> 400.
const badOrder = await post({
  messages: [{ role: "assistant", content: "stray opener" }],
});
check("assistant-first returns 400", badOrder.status === 400, `got ${badOrder.status}`);

// Non-string / unknown roles filtered out entirely.
const junk = await post({ messages: [{ role: "system", content: 42 }] });
check("junk messages filtered to 400", junk.status === 400, `got ${junk.status}`);

// --- throttle --------------------------------------------------------------
let throttleHit = 0;
for (let i = 0; i < 20; i++) {
  const r = await post({ messages: [] }, "9.9.9.9");
  if (r.status === 429) throttleHit++;
}
check("throttle engages after ~12 requests", throttleHit > 0, `${throttleHit} of 20 throttled`);

console.log(fails === 0 ? "\nAll checks passed." : `\n${fails} check(s) failed.`);
process.exit(fails === 0 ? 0 : 1);
