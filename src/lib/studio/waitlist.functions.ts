import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { studioWaitlistEmailSchema } from "@/lib/studio/waitlist-schema";

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";

async function sendOpeningEmail(email: string) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) return;

  const from =
    process.env.STUDIO_EMAIL_FROM ??
    process.env.NEWSLETTER_FROM ??
    "Edmundo Kutuzov <onboarding@resend.dev>";

  try {
    await fetch(`${RESEND_GATEWAY}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "You're on the Kutuzov Studio list",
        text: "You're on the list. We'll email you the moment Kutuzov Studio opens.",
      }),
    });
  } catch {
    // The signup remains valid even if the confirmation email provider is temporarily unavailable.
  }
}

export const joinStudioWaitlist = createServerFn({ method: "POST" })
  .validator(studioWaitlistEmailSchema)
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Studio waitlist is not configured on the server.");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { error } = await supabase
      .from("studio_waitlist")
      .insert({ email: data.email });

    if (error) {
      if (error.code === "23505") return { status: "duplicate" as const };
      throw new Error(error.message);
    }

    await sendOpeningEmail(data.email);
    return { status: "ok" as const };
  });
