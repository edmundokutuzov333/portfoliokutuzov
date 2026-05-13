import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bookingSchema } from "@/lib/contact-schema";
import { trackEvent } from "@/lib/analytics";

export function BookingModal({
  open,
  onClose,
  bookingUrl,
}: {
  open: boolean;
  onClose: () => void;
  bookingUrl?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [tz, setTz] = useState(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "",
  );
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  // If a booking URL is provided we redirect immediately rather than show the form.
  if (bookingUrl) {
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
    onClose();
    return null;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({
      name,
      email,
      preferred_date: date,
      preferred_time: time,
      timezone: tz,
      note,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("booking_requests").insert(parsed.data);
    setBusy(false);
    if (error) return toast.error(error.message);
    trackEvent({ action: "submit", element: "booking" });
    setDone(true);
    toast.success("Booking request sent.");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] grid place-items-center bg-[#01040A]/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#030814] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:text-white"
        >
          <X size={14} />
        </button>

        {done ? (
          <div className="text-center py-6">
            <div className="mx-auto h-12 w-12 rounded-full bg-emerald-300/15 grid place-items-center">
              <Check className="text-emerald-200" />
            </div>
            <h3 className="display text-2xl mt-4 text-metal">Request received.</h3>
            <p className="text-sm text-slate-400 mt-2">
              I'll confirm a slot within 48 hours at <span className="text-sky-200">{email}</span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 inline-flex rounded-full bg-white text-[#01040A] px-5 py-2.5 text-sm font-semibold hover:bg-sky-200"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div className="flex items-center gap-2 mono text-[10px] tracking-[0.22em] text-sky-300/80">
              <CalendarDays size={13} /> SCHEDULE A CALL
            </div>
            <h3 className="display text-2xl mt-2 text-metal">Book a 30 min call</h3>
            <p className="text-[12px] text-slate-500 mt-1">
              Tell me when works for you and I'll confirm.
            </p>

            <div className="mt-5 grid gap-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="adm-field"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email"
                className="adm-field"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="adm-field"
                />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="adm-field"
                />
              </div>
              <input
                value={tz}
                onChange={(e) => setTz(e.target.value)}
                placeholder="Timezone"
                className="adm-field"
              />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Anything I should know? (optional)"
                className="adm-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-5 w-full inline-flex justify-center items-center gap-2 rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-[#01040A] hover:bg-sky-200 disabled:opacity-60"
            >
              {busy ? <Loader2 size={14} className="animate-spin" /> : <CalendarDays size={14} />}
              Request booking
            </button>

            <style>{`
              .adm-field { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #f5f8ff; }
              .adm-field::placeholder { color: #64748b; }
              .adm-field:focus { outline: none; border-color: #6ddcff; }
            `}</style>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
