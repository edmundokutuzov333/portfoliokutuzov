import { createHash, randomBytes } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { resolvePublicSiteUrl } from "@/config/server";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
const UNIFIED_NEWSLETTER_ENABLED = process.env.UNIFIED_NEWSLETTER_ENABLED === "true";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const SubscribeInput = z.object({
  email: z.string().trim().email().max(200).toLowerCase(),
  name: z.string().trim().max(120).optional(),
  source: z.enum(["home", "studio", "footer", "contact-page", "briefing-confirmation"]).default("home"),
  consent: z.literal(true),
});

const ConfirmInput = z.object({
  token: z.string().trim().min(32).max(256),
});

function normalizeSource(source: z.infer<typeof SubscribeInput>["source"]) {
  return source === "studio" ? "studio" : "home";
}

function clientIp(request: Request) {
  return (request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown").slice(0, 128);
}

function rateKey(request: Request) {
  const salt = process.env.NEWSLETTER_RATE_LIMIT_SALT || process.env.SUPABASE_URL || "newsletter";
  return createHash("sha256").update(salt + ":" + clientIp(request)).digest("hex");
}

function checkRateLimit(key: string) {
  const now = Date.now();
  for (const [entryKey, entry] of rateLimits) {
    if (entry.resetAt <= now) rateLimits.delete(entryKey);
  }
  const current = rateLimits.get(key);
  if (!current) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_MAX) return false;
  current.count += 1;
  return true;
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function sendResendEmail(email: string, subject: string, html: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return false;

  const from = process.env.NEWSLETTER_FROM ?? "Edmundo Kutuzov <onboarding@resend.dev>";
  try {
    const response = await fetch(`${RESEND_GATEWAY}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({ from, to: [email], subject, html }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function sendDoubleOptIn(email: string, name: string | undefined, token: string) {
  const url = new URL("/contact", resolvePublicSiteUrl());
  url.searchParams.set("newsletter_confirm", token);
  const greeting = name ? `Hi ${name.split(" ")[0]},` : "Hi there,";
  return sendResendEmail(
    email,
    "Confirm your Kutuzov Studio updates",
    `<div style="font-family:Arial,sans-serif;background:#000;color:#f2f2ef;padding:36px">
      <p style="letter-spacing:.16em;font:600 11px Arial;color:#b9b7b0">EDMUNDO KUTUZOV</p>
      <h1 style="font:800 34px/1 Archivo,Arial,sans-serif;margin:22px 0 14px">One click to confirm.</h1>
      <p style="font:400 18px/1.6 Georgia,serif;color:#d6d4ce">${greeting}<br/>Confirm your subscription to receive occasional notes on new work, availability and studio news.</p>
      <p style="margin:28px 0"><a href="${url.toString()}" style="display:inline-block;border:2px solid #f2f2ef;background:#f2f2ef;color:#000;padding:14px 18px;text-decoration:none;font:700 14px Arial">Confirm subscription</a></p>
      <p style="font:13px/1.6 Arial;color:#b9b7b0">This confirmation link expires in 48 hours.</p>
    </div>`,
  );
}

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SubscribeInput.parse(input))
  .handler(async ({ data }) => {
    const request = getRequest();
    if (!checkRateLimit(rateKey(request))) {
      throw new Error("Too many subscription attempts. Please try again later.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/server/index.server");
    const source = normalizeSource(data.source);

    // Keep the current production schema safe until the additive Phase 4
    // migration is applied and explicitly enabled by deployment configuration.
    if (!UNIFIED_NEWSLETTER_ENABLED) {
      const { data: existingLegacy } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id,is_active")
        .eq("email", data.email)
        .maybeSingle();

      if (existingLegacy) {
        await supabaseAdmin
          .from("newsletter_subscribers")
          .update({
            is_active: true,
            name: data.name ?? null,
            source,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingLegacy.id);
        return { ok: true, alreadySubscribed: true, legacySchema: true };
      }

      const { error: legacyError } = await supabaseAdmin.from("newsletter_subscribers").insert({
        email: data.email,
        name: data.name ?? null,
        source,
        consent: true,
        is_active: true,
      });
      if (legacyError) throw new Error(legacyError.message);
      return { ok: true, alreadySubscribed: false, legacySchema: true };
    }
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id,is_active,confirmed_at")
      .eq("email", data.email)
      .maybeSingle();

    const token = randomBytes(32).toString("base64url");
    const hash = tokenHash(token);
    const expires = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

    if (existing?.confirmed_at) {
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({
          is_active: true,
          name: data.name ?? null,
          source,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      return { ok: true, alreadySubscribed: true };
    }

    if (existing) {
      await supabaseAdmin
        .from("newsletter_subscribers")
        .update({
          is_active: true,
          name: data.name ?? null,
          source,
          confirmation_token_hash: hash,
          confirmation_expires_at: expires,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
        email: data.email,
        name: data.name ?? null,
        source,
        consent: true,
        is_active: true,
        confirmed_at: null,
        confirmation_token_hash: hash,
        confirmation_expires_at: expires,
      });
      if (error) throw new Error(error.message);
    }

    const sent = await sendDoubleOptIn(data.email, data.name, token);
    if (!sent) {
      return { ok: true, pendingEmail: true };
    }

    return { ok: true, alreadySubscribed: false, pendingConfirmation: true };
  });

export const confirmNewsletter = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ConfirmInput.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/server/index.server");
    const hash = tokenHash(data.token);
    const { data: subscriber, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id,confirmation_expires_at")
      .eq("confirmation_token_hash", hash)
      .maybeSingle();

    if (error || !subscriber) throw new Error("This confirmation link is invalid.");
    if (!subscriber.confirmation_expires_at || new Date(subscriber.confirmation_expires_at).getTime() < Date.now()) {
      throw new Error("This confirmation link has expired.");
    }

    const { error: updateError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .update({
        confirmed_at: new Date().toISOString(),
        confirmation_token_hash: null,
        confirmation_expires_at: null,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id);

    if (updateError) throw new Error(updateError.message);
    return { ok: true };
  });
