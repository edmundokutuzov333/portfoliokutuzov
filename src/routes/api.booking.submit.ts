import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  preferred_date: z.string().trim().min(1),
  preferred_time: z.string().trim().max(32).nullable().optional(),
  timezone: z.string().trim().max(80).nullable().optional(),
  note: z.string().trim().max(3000).nullable().optional(),
});

// @ts-expect-error TanStack route registry does not include server-only API paths in generated FileRoutesByPath.
export const Route = createFileRoute("/api/booking/submit")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed=schema.safeParse(await request.json().catch(()=>null));
        if(!parsed.success) return new Response(JSON.stringify({ok:false,error:"VALIDATION_FAILED"}),{status:422,headers:{"Content-Type":"application/json"}});
        const { data,error }=await supabaseAdmin.from("booking_requests").insert({
          name:parsed.data.name,
          email:parsed.data.email.toLowerCase(),
          preferred_date:parsed.data.preferred_date,
          preferred_time:parsed.data.preferred_time||null,
          timezone:parsed.data.timezone||null,
          note:parsed.data.note||null,
        }).select("id").single();
        if(error||!data) return new Response(JSON.stringify({ok:false,error:"BOOKING_FAILED"}),{status:500,headers:{"Content-Type":"application/json"}});
        return new Response(JSON.stringify({ok:true,booking_id:data.id}),{status:200,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});
      },
    },
  },
});
