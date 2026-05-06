import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

const SubscribeInput = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  name: z.string().trim().max(120).optional(),
  source: z
    .enum(["contact-page", "footer", "briefing-confirmation"])
    .default("contact-page"),
  consent: z.literal(true),
});

async function sendWelcomeEmail(email: string, name?: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return; // best-effort
  const FROM = process.env.NEWSLETTER_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";
  try {
    await fetch(`${RESEND_GATEWAY}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: FROM,
        to: [email],
        subject: "Welcome - Edmundo Kutuzov studio updates",
        html: `<div style="font-family:-apple-system,Segoe UI,Inter,sans-serif;background:#01040A;color:#e2e8f0;padding:32px">
          <p style="font-family:monospace;letter-spacing:.18em;color:#7dd3fc;font-size:11px;margin:0 0 16px">SUBSCRIPTION CONFIRMED</p>
          <h1 style="font-size:28px;line-height:1.1;margin:0 0 18px;color:#f5f8ff">${greeting}</h1>
          <p style="font-size:15px;line-height:1.7;color:#cbd5e1;margin:0 0 18px">
            You're now on the list. I'll send a short note when there's new work, availability or studio news worth your attention. No noise.
          </p>
          <p style="font-size:13px;line-height:1.7;color:#94a3b8;margin:0 0 24px">
            If this wasn't you, ignore this message and you'll be removed automatically.
          </p>
          <p style="font-size:12px;color:#64748b;margin:24px 0 0">- Edmundo Kutuzov - Art Director</p>
        </div>`,
      }),
    });
  } catch {
    // ignore - subscriber is already saved
  }
}

async function addToResendAudience(email: string, name?: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!lovableKey || !resendKey || !audienceId) return null;
  try {
    const res = await fetch(
      `${RESEND_GATEWAY}/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey,
        },
        body: JSON.stringify({
          email,
          first_name: name?.split(" ")[0] ?? undefined,
          last_name: name?.split(" ").slice(1).join(" ") || undefined,
          unsubscribed: false,
        }),
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string };
    return data.id ?? null;
  } catch {
    return null;
  }
}

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubscribeInput.parse(input))
  .handler(async ({ data }) => {
    // Upsert subscriber - if email already exists, just bump source / re-activate.
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, is_active")
      .eq("email", data.email)
      .maybeSingle();

    if (existing) {
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({ is_active: true, name: data.name ?? null, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      return { ok: true, alreadySubscribed: true };
    }

    const resendId = await addToResendAudience(data.email, data.name);

    const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
      email: data.email,
      name: data.name ?? null,
      source: data.source,
      consent: true,
      is_active: true,
      resend_contact_id: resendId,
    });
    if (error) throw new Error(error.message);

    await sendWelcomeEmail(data.email, data.name);
    return { ok: true, alreadySubscribed: false };
  });
