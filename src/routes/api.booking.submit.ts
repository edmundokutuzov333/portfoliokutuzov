import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { bookingSchema } from "@/lib/contact-schema";
import { getRequestId } from "@/lib/observability";

const limits = new Map<string, { count: number; resetAt: number }>();

function key(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 128);
}

function json(requestId: string, status: number, body: unknown, extra: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Request-Id": requestId,
      ...extra,
    },
  });
}

function check(keyValue: string) {
  const now = Date.now();
  const current = limits.get(keyValue);
  if (!current || current.resetAt <= now) {
    limits.set(keyValue, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= 5) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export const Route = createFileRoute("/api/booking/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const requestId = getRequestId(request);
        const rate = check(key(request));
        if (!rate.allowed) {
          return json(requestId, 429, { error: "RATE_LIMITED" }, { "Retry-After": String(rate.retryAfter) });
        }

        const parsed = bookingSchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return json(requestId, 422, { error: "VALIDATION_FAILED", issues: parsed.error.issues });
        }

        const { data, error } = await supabaseAdmin
          .from("booking_requests")
          .insert({
            name: parsed.data.name,
            email: parsed.data.email,
            preferred_date: parsed.data.preferred_date,
            preferred_time: parsed.data.preferred_time || null,
            timezone: parsed.data.timezone || null,
            note: parsed.data.note || null,
            status: "new",
            booking_status: "requested",
          })
          .select("id,created_at")
          .single();

        if (error || !data) return json(requestId, 500, { error: "BOOKING_FAILED" });
        return json(requestId, 200, { ok: true, id: data.id, created_at: data.created_at });
      },
    },
  },
});
