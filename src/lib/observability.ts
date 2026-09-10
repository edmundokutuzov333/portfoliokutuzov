export type ObservabilityEvent =
  | "request_start"
  | "request_end"
  | "api_error"
  | "dependency_error"
  | "not_found"
  | "client_error";

export interface ObservabilityContext {
  requestId?: string;
  route?: string;
  method?: string;
  status?: number;
  latencyMs?: number;
  dependency?: string;
  code?: string;
  message?: string;
  sessionId?: string;
  model?: string;
  metadata?: Record<string, unknown>;
}

function safeMessage(message: string | undefined) {
  return message ? message.replace(/[\r\n\t]+/g, " ").slice(0, 500) : undefined;
}

export function logObservability(event: ObservabilityEvent, context: ObservabilityContext = {}) {
  const payload = {
    level: event === "api_error" || event === "dependency_error" ? "error" : "info",
    type: "OBSERVABILITY",
    event,
    timestamp: new Date().toISOString(),
    ...context,
    message: safeMessage(context.message),
  };

  if (payload.level === "error") console.error(JSON.stringify(payload));
  else console.log(JSON.stringify(payload));
}

export function getRequestId(request: Request) {
  return request.headers.get("x-request-id")?.slice(0, 128) ||
    `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
