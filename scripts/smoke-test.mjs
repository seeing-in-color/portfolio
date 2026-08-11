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

// --- Edge-compatible upstream streaming ------------------------------------
const originalFetch = globalThis.fetch;
globalThis.fetch = async () =>
  new Response(
    [
      'event: message_start\ndata: {"type":"message_start"}\n\n',
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello "}}\n\n',
      'event: content_block_delta\ndata: {"type":"content_block_delta","delta":{"type":"text_delta","text":"there"}}\n\n',
      'event: message_stop\ndata: {"type":"message_stop"}\n\n',
    ].join(""),
    { status: 200, headers: { "content-type": "text/event-stream" } }
  );

const streamed = await post(
  { messages: [{ role: "user", content: "Tell me about Andres" }] },
  "7.7.7.7"
);
check("streaming response returns 200", streamed.status === 200, `got ${streamed.status}`);
check("SSE is converted to plain text", (await streamed.text()) === "Hello there");
globalThis.fetch = originalFetch;

console.log(fails === 0 ? "\nAll checks passed." : `\n${fails} check(s) failed.`);
process.exit(fails === 0 ? 0 : 1);
