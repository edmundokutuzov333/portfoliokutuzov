import { createHash } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getCorsHeaders, isCorsOriginAllowed } from "@/config/server";

export const runtime = "nodejs";

const EventSchema = z.object({
  itemId: z.string().min(1).max(120),
  event: z.enum(["view", "hover", "open", "cinema"]),
  occurredAt: z.number().int().positive(),
});

const BodySchema = z.object({
  sessionSeed: z.string().min(8).max(160),
  events: z.array(EventSchema).min(1).max(24),
});

const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 20;
const rateMap = new Map<string, { start: number; count: number }>();

function hashSession(seed: string, date: string, secret: string) {
  return createHash("sha256").update(secret + ":" + date + ":" + seed).digest("hex");
}

function hashIp(ip: string, date: string, secret: string) {
  return createHash("sha256").update(secret + ":" + date + ":" + ip).digest("hex");
}

// @ts-expect-error Server-only TanStack route is intentionally outside generated FileRoutesByPath.
export const Route = createFileRoute("/api/reel-analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isCorsOriginAllowed(request)) {
          return new Response(JSON.stringify({ error: "ORIGIN_NOT_ALLOWED" }), {
            status: 403,
            headers: { ...getCorsHeaders(request), "Content-Type": "application/json" },
          });
        }

        if (process.env.REEL_ANALYTICS_ENABLED !== "true") {
          return new Response(null, { status: 204, headers: getCorsHeaders(request) });
        }

        const parsed = BodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) {
          return new Response(JSON.stringify({ error: "BAD_REQUEST" }), {
            status: 400,
            headers: { ...getCorsHeaders(request), "Content-Type": "application/json" },
          });
        }

        const now = Date.now();
        const date = new Date(now).toISOString().slice(0, 10);
        const secret = process.env.REEL_ANALYTICS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "phase6-disabled";
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
        const ipHash = hashIp(ip, date, secret);
        const previous = rateMap.get(ipHash);
        if (!previous || now - previous.start >= RATE_WINDOW_MS) {
          rateMap.set(ipHash, { start: now, count: 1 });
        } else {
          previous.count += 1;
          if (previous.count > RATE_LIMIT) {
            return new Response(null, { status: 429, headers: getCorsHeaders(request) });
          }
        }

        const sessionHash = hashSession(parsed.data.sessionSeed, date, secret);
        const rows = parsed.data.events.map((event) => ({
          item_id: event.itemId,
          event: event.event,
          session_hash: sessionHash,
          created_at: new Date(event.occurredAt).toISOString(),
        }));

        const client = supabaseAdmin as unknown as {
          from: (table: string) => {
            insert: (values: unknown) => Promise<{ error: { message: string } | null }>;
          };
        };
        const result = await client.from("reel_analytics").insert(rows);

        if (result.error) {
          return new Response(JSON.stringify({ error: "ANALYTICS_WRITE_FAILED" }), {
            status: 503,
            headers: { ...getCorsHeaders(request), "Content-Type": "application/json" },
          });
        }

        return new Response(null, { status: 204, headers: getCorsHeaders(request) });
      },
    },
  },
});
