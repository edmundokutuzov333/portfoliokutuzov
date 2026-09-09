let lastCapturedError;
const TTL_MS = 5e3;
function record(error) {
  lastCapturedError = { error, at: Date.now() };
}
if (typeof globalThis.addEventListener === "function") {
  globalThis.addEventListener("error", (event) => {
    record(event.error ?? event);
  });
  globalThis.addEventListener("unhandledrejection", (event) => {
    record(event.reason ?? event);
  });
}
function consumeLastCapturedError() {
  if (!lastCapturedError) return void 0;
  if (Date.now() - lastCapturedError.at > TTL_MS) {
    lastCapturedError = void 0;
    return void 0;
  }
  const { error } = lastCapturedError;
  lastCapturedError = void 0;
  return error;
}
function renderErrorPage(message = "The application failed to render safely.") {
  return `<!doctype html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Preview recovery</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center}
      main{max-width:560px}.mono{font:10px ui-monospace,Menlo,monospace;letter-spacing:.18em;color:#1d9bff;text-transform:uppercase}
      h1{font-size:32px;line-height:1.05;margin:14px 0 10px}p{color:#aab6c8;line-height:1.55;margin:0 0 22px}
      a,button{display:inline-flex;border-radius:999px;padding:12px 18px;font-weight:700;text-decoration:none;cursor:pointer}
      button{border:0;background:#1d9bff;color:#01040a}a{border:1px solid rgba(255,255,255,.16);color:#f5f8ff;margin-left:8px}
    </style>
  </head>
  <body>
    <main>
      <div class="mono">/// recovery</div>
      <h1>The interface recovered.</h1>
      <p>${escapeHtml(message)} A fallback screen was shown instead of a blank page.</p>
      <button onclick="location.reload()">Reload preview</button><a href="/">Go home</a>
    </main>
  </body>
</html>`;
}
function escapeHtml(value) {
  return value.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]
  );
}
let serverEntryPromise;
async function getServerEntry() {
  if (!serverEntryPromise) {
    serverEntryPromise = import("./server-BjuWTvBY.mjs").then((n) => n.s).then(
      (module) => module.default ?? module
    );
  }
  return serverEntryPromise;
}
function isH3SwallowedErrorBody(body) {
  try {
    const payload = JSON.parse(body);
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}
function isExpectedPreviewDisconnect(error) {
  if (!(error instanceof Error)) return false;
  const code = "code" in error ? String(error.code) : "";
  const cause = "cause" in error ? error.cause : void 0;
  return error.name === "AbortError" || error.message === "aborted" || code === "ECONNRESET" || isExpectedPreviewDisconnect(cause);
}
function disconnectedResponse() {
  return new Response(null, { status: 499, statusText: "Client Closed Request" });
}
async function normalizeSsrResponse(request, response) {
  if (request.signal.aborted) return disconnectedResponse();
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;
  console.error(
    consumeLastCapturedError() ?? new Error(`SSR error swallowed by renderer: ${body}`)
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}
const server = {
  async fetch(request, env, ctx) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeSsrResponse(request, response);
    } catch (error) {
      if (request.signal.aborted || isExpectedPreviewDisconnect(error)) {
        return disconnectedResponse();
      }
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" }
      });
    }
  }
};
export {
  server as default,
  renderErrorPage as r
};
