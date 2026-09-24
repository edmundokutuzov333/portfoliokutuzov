import { useEffect, useState } from "react";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useLocation } from "@tanstack/react-router";
import { confirmNewsletter, subscribeNewsletter } from "@/lib/newsletter.functions";
import { newsletterSchema } from "@/lib/contact-schema";
import { trackEvent } from "@/lib/analytics";
import { UI_COPY, useSiteLocale } from "@/lib/site-locale";

export function NewsletterForm({
  source = "contact-page",
  compact = false,
}: {
  source?: "home" | "studio" | "footer" | "contact-page" | "briefing-confirmation";
  compact?: boolean;
}) {
  const subscribe = useServerFn(subscribeNewsletter);
  const confirm = useServerFn(confirmNewsletter);
  const { pathname } = useLocation();
  const locale = useSiteLocale();
  const copy = UI_COPY[locale];
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("newsletter_confirm");
    if (!token) return;

    let cancelled = false;
    setConfirmation(true);
    void confirm({ data: { token } })
      .then(() => {
        if (cancelled) return;
        setDone(true);
        toast.success(locale === "pt-PT" ? "Subscrição confirmada." : "Subscription confirmed.");
        window.history.replaceState({}, "", pathname || "/");
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : "Confirmation failed.");
      })
      .finally(() => {
        if (!cancelled) setConfirmation(false);
      });

    return () => {
      cancelled = true;
    };
  }, [confirm, locale, pathname]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, name, source, consent });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setBusy(true);
    try {
      const result = await subscribe({ data: parsed.data });
      setDone(true);
      trackEvent({ action: "submit", element: `newsletter:${source}` });

      if (result.alreadySubscribed) {
        toast.success(locale === "pt-PT" ? "Este email já está na lista." : "You're already on the list.");
      } else if ("pendingConfirmation" in result) {
        toast.success(locale === "pt-PT" ? "Verifique o email para confirmar a subscrição." : "Check your inbox to confirm your subscription.");
      } else if ("pendingEmail" in result) {
        toast.success(locale === "pt-PT" ? "O pedido foi registado." : "Your request was recorded.");
      } else {
        toast.success(locale === "pt-PT" ? "Subscrição concluída." : "You're in.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Subscription failed");
    } finally {
      setBusy(false);
    }
  };

  if (confirmation) {
    return <div className="text-sm text-[#b9b7b0]">{locale === "pt-PT" ? "A confirmar a subscrição…" : "Confirming your subscription…"}</div>;
  }

  if (done) {
    return (
      <div className="inline-flex min-h-11 items-center gap-2 border-2 border-[var(--shell-work)] bg-transparent px-3 py-2 text-sm text-current">
        <Check size={14} aria-hidden="true" />
        {locale === "pt-PT" ? "Subscrição confirmada." : "Subscription confirmed."}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3" noValidate>
      {!compact ? (
        <div>
          <p className="text-sm font-semibold">{copy.newsletterLabel}</p>
          <p className="mt-1 text-sm opacity-75">{copy.newsletterDescription}</p>
        </div>
      ) : null}

      {!compact ? (
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={locale === "pt-PT" ? "Nome (opcional)" : "Name (optional)"}
          autoComplete="name"
          className="min-h-12 w-full border-2 border-[#3f3e3b] bg-[#f2f2ef] px-3 py-2 text-sm text-black placeholder:text-[#3f3e3b] focus:border-[var(--shell-work)] focus:outline-none"
        />
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`newsletter-${source}`}>{copy.newsletterEmail}</label>
        <input
          id={`newsletter-${source}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          className="min-h-12 min-w-0 flex-1 border-2 border-[#3f3e3b] bg-[#f2f2ef] px-3 py-2 text-sm text-black placeholder:text-[#3f3e3b] focus:border-[var(--shell-work)] focus:outline-none"
        />
        <button type="submit" disabled={busy} className="min-h-12 border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-[#f2f2ef] transition hover:bg-[var(--shell-work)] hover:border-[var(--shell-work)] disabled:opacity-60">
          {busy ? <Loader2 size={14} className="animate-spin" aria-hidden="true" /> : copy.join}
        </button>
      </div>

      {!compact ? (
        <label className="flex items-start gap-2 text-sm text-[#3f3e3b]">
          <input
            type="checkbox"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--shell-work)]"
          />
          <span>{locale === "pt-PT" ? "Aceito receber emails ocasionais sobre trabalho novo e disponibilidade." : "I agree to receive occasional emails about new work and availability."}</span>
        </label>
      ) : null}
    </form>
  );
}
