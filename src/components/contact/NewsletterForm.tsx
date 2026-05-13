import { useState } from "react";
import { Loader2, Send, Check } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/server/newsletter.functions.server";
import { newsletterSchema } from "@/lib/contact-schema";
import { trackEvent } from "@/lib/analytics";

export function NewsletterForm({
  source = "contact-page",
  compact = false,
}: {
  source?: "contact-page" | "footer" | "briefing-confirmation";
  compact?: boolean;
}) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = newsletterSchema.safeParse({ email, name, source, consent });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    try {
      const res = await subscribe({ data: parsed.data });
      setDone(true);
      trackEvent({ action: "submit", element: `newsletter:${source}` });
      toast.success(
        res.alreadySubscribed ? "You're already on the list." : "You're in. Check your inbox.",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Subscription failed");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div
        className={
          compact
            ? "text-[12px] text-emerald-200 inline-flex items-center gap-2"
            : "rounded-xl border border-emerald-300/25 bg-emerald-300/[0.05] p-4 text-sm text-emerald-100 inline-flex items-center gap-2"
        }
      >
        <Check size={14} /> Subscribed - thank you.
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className={
        compact
          ? "flex flex-col gap-2 sm:flex-row"
          : "rounded-xl border border-white/[0.08] bg-[#030814] p-4"
      }
    >
      {!compact && (
        <>
          <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">Mailing list</div>
          <p className="mt-1 text-sm text-slate-300">Get updates on new work and availability.</p>
        </>
      )}
      <div className={compact ? "flex flex-1 gap-2" : "mt-3 flex flex-col gap-2 sm:flex-row"}>
        {!compact && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-300/50 focus:outline-none sm:max-w-[180px]"
          />
        )}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-sky-300/50 focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-300 px-4 py-2.5 text-sm font-semibold text-[#01040A] hover:bg-sky-200 disabled:opacity-60"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {compact ? "Join" : "Subscribe"}
        </button>
      </div>
      {!compact && (
        <label className="mt-3 flex items-start gap-2 text-[11px] text-slate-500">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5"
          />
          <span>
            I agree to receive occasional emails about new work and availability. Unsubscribe
            anytime.
          </span>
        </label>
      )}
    </form>
  );
}
