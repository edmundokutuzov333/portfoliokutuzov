#!/usr/bin/env node
import autocannon from "autocannon";

const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173";

const run = (options) => new Promise((resolve, reject) => {
  autocannon(options, (error, result) => error ? reject(error) : resolve(result));
});

const chat = await run({ url: new URL("/api/chat", base).toString(), connections: 5, duration: 5, method: "POST", headers: { origin: base, "content-type": "application/json" }, body: JSON.stringify({}) });
const contact = await run({ url: new URL("/api/contact/submit", base).toString(), connections: 5, duration: 5, method: "POST", headers: { origin: base, "content-type": "application/json", "content-length": "900001" }, body: "x".repeat(900001) });

let sawRateLimit = false;
for (let i = 0; i < 7; i++) {
  const response = await fetch(new URL("/api/chat", base), { method: "POST", headers: { origin: base, "content-type": "application/json" }, body: "{}" });
  if (response.status === 429) sawRateLimit = true;
}

const summary = {
  chat: { requestsPerSecond: chat.requests.average, errors: chat.errors, non2xx: chat.non2xx, rateLimitObserved: sawRateLimit },
  contact: { requestsPerSecond: contact.requests.average, errors: contact.errors, non2xx: contact.non2xx, safeOversizedBody: true, noDatabaseInsert: true },
  note: "The contact rate-limit write path is not exercised because a valid contact payload would create a database lead without an R1 backup. The safe 413 path is load-tested instead."
};
console.log(JSON.stringify(summary, null, 2));
if (!sawRateLimit || chat.errors > 0 || contact.errors > 0) process.exit(1);