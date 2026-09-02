import "./lib/error-capture";
import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (module) => (module.default ?? module) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function isH3SwallowedErrorBody(body: string) {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function isExpectedPreviewDisconnect(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = "code" in error ? String(error.code) : "";
  const cause = "cause" in error ? error.cause : undefined;
  return (
    error.name === "AbortError" ||
    error.message === "aborted" ||
    code === "ECONNRESET" ||
    isExpectedPreviewDisconnect(cause)
  );
}

function disconnectedResponse() {
  return new Response(null, { status: 499, statusText: "Client Closed Request" });
}

async function normalizeSsrResponse(request: Request, response: Response): Promise<Response> {
  if (request.signal.aborted) return disconnectedResponse();
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;
  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;
  console.error(
    consumeLastCapturedError() ?? new Error(`SSR error swallowed by renderer: ${body}`),
  );
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
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
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
