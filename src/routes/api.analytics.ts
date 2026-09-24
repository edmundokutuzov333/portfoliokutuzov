import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getRequestId } from "@/lib/observability";

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const jsonValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

const eventSchema = z.object({
  page: z.string().trim().min(1).max(300),
  element: z.string().trim().max(120).nullable().optional(),
  action: z.string().trim().min(1).max(64),
  x: z.number().int().nullable().optional(),
  y: z.number().int().nullable().optional(),
  viewport_width: z.number().int().min(1).max(10000).nullable().optional(),
  viewport_height: z.number().int().min(1).max(10000).nullable().optional(),
  device: z.enum(["mobile", "tablet", "desktop"]).nullable().optional(),
  session_id: z.string().trim().max(160).nullable().optional(),
  meta: z.record(z.string(), jsonValue).default({}),
});

const payloadSchema = z.union([eventSchema, z.array(eventSchema).min(1).max(25)]);
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function response(requestId: string, status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...headers,
    },
  });
}

function clientKey(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128);
}

function allowed(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    rateLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 120) return false;
  current.count += 1;
  return true;
}

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = getRequestId(request);
        if (!allowed(clientKey(request))) {
          return response(requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": "60" });
        }

        const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return response(requestId, 422, { error: "VALIDATION_FAILED" });

        const events = Array.isArray(parsed.data) ? parsed.data : [parsed.data];
        const { error } = await supabaseAdmin.from("analytics_events").insert(
          events.map((event) => ({
            page: event.page,
            element: event.element ?? null,
            action: event.action,
            x: event.x ?? null,
            y: event.y ?? null,
            viewport_width: event.viewport_width ?? null,
            viewport_height: event.viewport_height ?? null,
            device: event.device ?? null,
            session_id: event.session_id ?? null,
            meta: event.meta ?? {},
          })),
        );

        if (error) return response(requestId, 500, { error: "ANALYTICS_FAILED" });
        return new Response(null, {
          status: 204,
          headers: { "Cache-Control": "no-store", "X-Request-Id": requestId },
        });
      },
    },
  },
});
