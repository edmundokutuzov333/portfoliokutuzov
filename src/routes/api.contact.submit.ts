import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const runtime = "nodejs";

const rate = new Map<string, { count: number; resetAt: number }>();

const bodySchema = z.object({
  briefing: z.record(z.string(), z.unknown()),
  attachments: z.array(z.unknown()).max(5).default([]),
  reference_links: z.array(z.unknown()).max(12).default([]),
  honeypot: z.string().max(180).default(""),
});

function clientKey(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0,128);
}

function limited(key: string) {
  const now=Date.now();
  const current=rate.get(key);
  if (!current || current.resetAt <= now) {
    rate.set(key,{count:1,resetAt:now+15*60*1000});
    return false;
  }
  current.count += 1;
  return current.count > 5;
}

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/contact/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.json().catch(() => null);
        const parsed = bodySchema.safeParse(raw);
        if (!parsed.success) return new Response(JSON.stringify({ ok:false, error:"VALIDATION_FAILED" }), { status:422 });
        if (parsed.data.honeypot.trim()) return new Response(JSON.stringify({ok:true,accepted:false}),{status:200});

        if (limited(clientKey(request))) {
          return new Response(JSON.stringify({ok:false,error:"RATE_LIMITED"}),{status:429,headers:{"Retry-After":"900","Content-Type":"application/json"}});
        }

        const { data, error } = await supabaseAdmin
          .from("briefing_submissions")
          .insert({
            ...(parsed.data.briefing as Record<string, unknown>),
            attachments: parsed.data.attachments,
            reference_links: parsed.data.reference_links,
            source: "website",
            user_agent: request.headers.get("user-agent")?.slice(0,240) ?? null,
          } as never)
          .select("id")
          .single();

        if (error || !data) {
          return new Response(JSON.stringify({ok:false,error:"SUBMISSION_FAILED"}),{status:500,headers:{"Content-Type":"application/json"}});
        }

        return new Response(JSON.stringify({ok:true,briefing_id:data.id}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
      },
    },
  },
});
