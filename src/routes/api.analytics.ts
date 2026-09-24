import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const runtime = "nodejs";

const eventSchema = z.object({
  page: z.string().max(240).optional(),
  element: z.string().max(120).nullable().optional(),
  action: z.string().max(80),
  x: z.number().finite().nullable().optional(),
  y: z.number().finite().nullable().optional(),
  viewport_width: z.number().int().positive().max(10000).nullable().optional(),
  viewport_height: z.number().int().positive().max(10000).nullable().optional(),
  device: z.enum(["mobile","tablet","desktop"]).nullable().optional(),
  session_id: z.string().max(120).nullable().optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

const bodySchema = z.object({ events: z.array(eventSchema).min(1).max(20) });

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = bodySchema.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return new Response(JSON.stringify({ok:false,error:"VALIDATION_FAILED"}),{status:422,headers:{"Content-Type":"application/json"}});
        const { error } = await supabaseAdmin.from("analytics_events").insert(parsed.data.events as never);
        if (error) return new Response(JSON.stringify({ok:false,error:"ANALYTICS_FAILED"}),{status:500,headers:{"Content-Type":"application/json"}});
        return new Response(JSON.stringify({ok:true,count:parsed.data.events.length}),{status:200,headers:{"Content-Type":"application/json"}});
      },
    },
  },
});
