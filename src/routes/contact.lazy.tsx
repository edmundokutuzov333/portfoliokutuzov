import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Check,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Phone,
  MapPin,
  Paperclip,
  X,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  User,
  Briefcase,
  Wallet,
  ImagePlus,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting, SITE_EMAIL, SITE_PHONE } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { sendBriefingEmails } from "@/lib/briefing.functions";
import { toast } from "sonner";
import {
  CURRENCIES,
  CURRENCY_META,
  PROJECT_TYPES,
  URGENCY,
  URGENCY_META,
  CONTACT_METHODS,
  briefingSchema,
  isValidUrl,
  type Currency,
  type BriefingAttachment,
  type BriefReferenceLink,
} from "@/lib/contact-schema";
import { WhatsAppButton } from "@/components/contact/WhatsAppButton";
import { LinkedInCard } from "@/components/contact/LinkedInCard";
import { NewsletterForm } from "@/components/contact/NewsletterForm";
import { BookingModal } from "@/components/contact/BookingModal";
import { trackEvent } from "@/lib/analytics";
import { LINKEDIN_URL } from "@/lib/cms";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPage,
});

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024;

const STEPS = [
  { id: 1, label: "Identity", Icon: User },
  { id: 2, label: "Project", Icon: Briefcase },
  { id: 3, label: "Budget", Icon: Wallet },
  { id: 4, label: "Timing", Icon: CalendarDays },
  { id: 5, label: "References", Icon: ImagePlus },
] as const;

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const sendEmails = useServerFn(sendBriefingEmails);
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "contact", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);

  const email = r("email", SITE_EMAIL);
  const phone = r("phone", SITE_PHONE);
  const bookingUrl = r("booking_url", "");

  // form state
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [country, setCountry] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [projectType, setProjectType] = useState<string>(PROJECT_TYPES[0]);
  const [urgency, setUrgency] = useState<(typeof URGENCY)[number]>("normal");
  const [deadline, setDeadline] = useState("");
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [budgetIdx, setBudgetIdx] = useState(1);
  const [exactAmount, setExactAmount] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [message, setMessage] = useState("");
  const [preferredContact, setPreferredContact] = useState<(typeof CONTACT_METHODS)[number] | "">(
    "",
  );
  const [files, setFiles] = useState<BriefingAttachment[]>([]);
  const [refLinks, setRefLinks] = useState<BriefReferenceLink[]>([]);
  const [refLinkInput, setRefLinkInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    trackEvent({ action: "view", element: "contact" });
  }, []);

  const brackets = CURRENCY_META[currency].brackets;
  const selectedBudget = brackets[budgetIdx] ?? brackets[0];

  const onFiles = async (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Max ${MAX_FILES} files`);
      return;
    }
    setUploading(true);
    try {
      const uploads: BriefingAttachment[] = [];
      for (const file of incoming) {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is over 8 MB`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        const safe = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `briefing-uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
        const { error: upErr } = await supabase.storage
          .from("site-assets")
          .upload(path, file, { upsert: false });
        if (upErr) {
          toast.error(`${file.name}: ${upErr.message}`);
          continue;
        }
        const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
        // measure dimensions
        const dims = await new Promise<{ w?: number; h?: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
          img.onerror = () => resolve({});
          img.src = data.publicUrl;
        });
        uploads.push({
          url: data.publicUrl,
          name: file.name,
          size: file.size,
          width: dims.w,
          height: dims.h,
        });
      }
      setFiles((f) => [...f, ...uploads]);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (i: number) => setFiles((f) => f.filter((_, j) => j !== i));

  const validateStep = (n: number): boolean => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!fullName.trim()) e.full_name = "Required";
      if (!emailVal.trim() || !/.+@.+\..+/.test(emailVal)) e.email = "Valid email required";
    }
    if (n === 2) {
      if (!projectType) e.project_type = "Pick a project type";
    }
    if (n === 5) {
      if (message.trim().length < 10) e.message = "Tell me a bit more (10+ chars)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) {
      toast.error("Please complete the required fields");
      return;
    }
    setStep((s) => Math.min(STEPS.length, s + 1));
  };
  const prev = () => setStep((s) => Math.max(1, s - 1));

  const addRefLink = () => {
    const v = refLinkInput.trim();
    if (!v) return;
    if (!isValidUrl(v)) {
      toast.error("Enter a valid URL (https://...)");
      return;
    }
    if (refLinks.some((l) => l.url === v)) {
      setRefLinkInput("");
      return;
    }
    setRefLinks((l) => [...l, { url: v }]);
    setRefLinkInput("");
  };
  const removeRefLink = (i: number) => setRefLinks((l) => l.filter((_, j) => j !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) {
      toast.error("Please complete the message");
      return;
    }
    const rawPayload = {
      full_name: fullName,
      company_name: companyName,
      position,
      country,
      email: emailVal,
      phone: phoneVal,
      project_type: projectType,
      urgency,
      deadline,
      currency,
      budget_range: selectedBudget?.label ?? "",
      exact_amount: exactAmount,
      negotiable,
      message,
      preferred_contact_method: preferredContact || null,
    };
    const parsed = briefingSchema.safeParse(rawPayload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0]?.toString() ?? "_";
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      toast.error("Please check the highlighted fields");
      return;
    }
    setSubmitting(true);
    // Drop undefined keys so the database receives proper nulls/values only.
    const clean = Object.fromEntries(
      Object.entries(parsed.data).filter(([, v]) => v !== undefined),
    ) as typeof parsed.data;
    const insertRow = {
      ...clean,
      attachments: files,
      reference_links: refLinks,
      source: "website",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : null,
    };
    const { data: inserted, error } = await supabase
      .from("briefing_submissions")
      .insert(insertRow as never)
      .select("id")
      .single();
    setSubmitting(false);
    if (error) return toast.error(error.message);
    trackEvent({ action: "submit", element: "briefing" });
    // Fire-and-forget confirmation + admin notification emails. The server
    // function only accepts the briefing id and re-reads all email content
    // from the DB row, so it cannot be abused as an open email relay.
    if (inserted?.id) {
      sendEmails({ data: { briefing_id: inserted.id } }).catch(() => {
        /* silent — submission is already stored */
      });
    }
    setDone(true);
    toast.success("Brief received. I'll be in touch within 48h.");
  };

  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>{r("eyebrow", "Contact")}</div>
          <div>{r("status", "Open for 2026 projects")}</div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <h1 className="display text-5xl md:text-7xl leading-[0.98] tracking-[-0.02em]">
                <span className="text-metal">{r("title_1", "Let's")} </span>
                <span className="italic text-accent">{r("title_accent", "talk.")}</span>
              </h1>
              <p className="mt-6 max-w-md text-[15px] text-slate-400 leading-relaxed">
                {r("subtitle", "Tell me about your project. I respond within 48 hours.")}
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${email}`}
                onClick={() => trackEvent({ action: "click", element: "email" })}
                className="flex items-center gap-3 group"
              >
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-sky-300/50 transition">
                  <Mail size={15} />
                </span>
                <span className="text-sm group-hover:text-sky-200 transition">{email}</span>
              </a>
              <a
                href={`tel:${String(phone).replace(/\s/g, "")}`}
                onClick={() => trackEvent({ action: "click", element: "phone" })}
                className="flex items-center gap-3 group"
              >
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-sky-300/50 transition">
                  <Phone size={15} />
                </span>
                <span className="text-sm group-hover:text-sky-200 transition">{phone}</span>
              </a>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center">
                  <MapPin size={15} />
                </span>
                <span className="text-sm text-slate-300">{r("location", "")}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <WhatsAppButton variant="primary" />
              <button
                type="button"
                onClick={() => {
                  trackEvent({ action: "click", element: "booking-open" });
                  setBookingOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-sky-300/[0.06] px-5 py-3 text-sm text-sky-100 hover:border-sky-300/55 transition"
              >
                <CalendarDays size={14} /> Book a call
              </button>
            </div>

            <LinkedInCard />

            <div className="flex items-center gap-2">
              {[
                { icon: Instagram, label: "Instagram", href: s("instagram", "#") },
                { icon: Linkedin, label: "LinkedIn", href: LINKEDIN_URL },
                { icon: Facebook, label: "Facebook", href: s("facebook", "#") },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="h-10 w-10 rounded-full border border-white/10 grid place-items-center text-slate-300 hover:text-white hover:border-sky-300/50 transition"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>

            <NewsletterForm source="contact-page" />
          </div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-7 relative rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-6 md:p-8"
          >
            {done ? (
              <div className="py-14 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-sky-300/15 grid place-items-center">
                  <Check className="text-sky-200" />
                </div>
                <h2 className="display text-2xl mt-4 text-metal">Brief received.</h2>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  Thanks {fullName.split(" ")[0] || "for reaching out"}. I'll get back to you at{" "}
                  <span className="text-sky-200">{emailVal}</span> within 48 hours.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-5 py-2.5 text-sm font-semibold text-[#01040A] hover:bg-sky-200"
                  >
                    <CalendarDays size={14} /> Book a call now
                  </button>
                  <WhatsAppButton variant="ghost">WhatsApp</WhatsAppButton>
                </div>
                <div className="mt-8 max-w-sm mx-auto">
                  <NewsletterForm source="briefing-confirmation" compact />
                </div>
                <button
                  onClick={() => {
                    setDone(false);
                    setStep(1);
                    setFullName("");
                    setEmailVal("");
                    setMessage("");
                    setFiles([]);
                  }}
                  className="mt-6 text-xs mono text-slate-500 hover:text-white"
                >
                  Send another brief
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* Stepper */}
                <div className="mb-6">
                  {/* Mobile header: step X of N + current label */}
                  <div className="sm:hidden flex items-center justify-between mb-3">
                    <span className="mono text-[10px] tracking-[0.22em] text-slate-500">
                      Step {step} of {STEPS.length}
                    </span>
                    <span className="mono text-[10px] tracking-[0.22em] text-sky-200">
                      {STEPS[step - 1].label}
                    </span>
                  </div>
                  {/* Mobile progress bar */}
                  <div className="sm:hidden h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ width: `${(step / STEPS.length) * 100}%` }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-sky-300 to-sky-500"
                    />
                  </div>
                  {/* Mobile dots for direct nav */}
                  <ol className="sm:hidden mt-3 flex items-center justify-center gap-2">
                    {STEPS.map((s) => {
                      const active = step === s.id;
                      const done = step > s.id;
                      const Icon = s.Icon;
                      return (
                        <li key={s.id}>
                          <button
                            type="button"
                            onClick={() => setStep(s.id)}
                            aria-label={`Go to step ${s.id}: ${s.label}`}
                            className={`h-9 w-9 rounded-full grid place-items-center transition ${
                              active
                                ? "bg-sky-300 text-[#01040A]"
                                : done
                                  ? "bg-sky-300/20 text-sky-200 border border-sky-300/30"
                                  : "bg-white/[0.04] text-slate-500 border border-white/10"
                            }`}
                          >
                            <Icon size={14} strokeWidth={1.8} />
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                  {/* Desktop stepper */}
                  <ol className="hidden sm:flex items-center justify-between gap-2">
                    {STEPS.map((s) => {
                      const active = step === s.id;
                      const done = step > s.id;
                      return (
                        <li key={s.id} className="flex-1 flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={() => setStep(s.id)}
                            className={`h-7 w-7 shrink-0 rounded-full grid place-items-center text-[11px] mono transition ${
                              active
                                ? "bg-sky-300 text-[#01040A]"
                                : done
                                  ? "bg-sky-300/20 text-sky-200"
                                  : "bg-white/[0.04] text-slate-500 border border-white/10"
                            }`}
                          >
                            {s.id}
                          </button>
                          <span
                            className={`mono text-[10px] tracking-[0.18em] truncate ${active ? "text-sky-200" : "text-slate-500"}`}
                          >
                            {s.label}
                          </span>
                          {s.id < STEPS.length && (
                            <span className="flex-1 h-px bg-white/10" />
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    {step === 1 && (
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Full name" required error={errors.full_name}>
                          <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="field"
                            placeholder="Your name"
                          />
                        </Field>
                        <Field label="Email" required error={errors.email}>
                          <input
                            type="email"
                            value={emailVal}
                            onChange={(e) => setEmailVal(e.target.value)}
                            className="field"
                            placeholder="you@company.com"
                          />
                        </Field>
                        <Field label="Company">
                          <input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="field"
                            placeholder="Optional"
                          />
                        </Field>
                        <Field label="Position">
                          <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="field"
                            placeholder="e.g. Marketing lead"
                          />
                        </Field>
                        <Field label="Country">
                          <input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="field"
                            placeholder="Optional"
                          />
                        </Field>
                        <Field label="Phone">
                          <input
                            value={phoneVal}
                            onChange={(e) => setPhoneVal(e.target.value)}
                            className="field"
                            placeholder="Optional"
                          />
                        </Field>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
                        <Field label="Project type" required error={errors.project_type}>
                          <div className="flex flex-wrap gap-2">
                            {PROJECT_TYPES.map((p) => (
                              <button
                                type="button"
                                key={p}
                                onClick={() => setProjectType(p)}
                                className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${projectType === p ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="How urgent?" required>
                          <div className="flex flex-wrap gap-2">
                            {URGENCY.map((u) => (
                              <button
                                type="button"
                                key={u}
                                onClick={() => setUrgency(u)}
                                className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${urgency === u ? "bg-white text-black border-white" : `${URGENCY_META[u].tone} hover:text-white`}`}
                              >
                                {URGENCY_META[u].label}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="space-y-5">
                        <Field label="Currency" required>
                          <div className="flex items-center gap-2 flex-wrap">
                            {CURRENCIES.map((c) => (
                              <button
                                type="button"
                                key={c}
                                onClick={() => setCurrency(c)}
                                className={`px-3 py-1.5 rounded text-[11px] mono border transition ${currency === c ? "bg-sky-300 text-[#01040A] border-sky-300" : "border-white/10 text-slate-400 hover:text-white"}`}
                              >
                                {CURRENCY_META[c].symbol} {CURRENCY_META[c].label}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Estimated budget">
                          <div className="flex flex-wrap gap-2">
                            {brackets.map((b, i) => (
                              <button
                                type="button"
                                key={b.label}
                                onClick={() => setBudgetIdx(i)}
                                className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${budgetIdx === i ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                              >
                                {b.label}
                              </button>
                            ))}
                          </div>
                        </Field>
                        <Field label="Or an exact amount" hint="Optional">
                          <input
                            value={exactAmount}
                            onChange={(e) => setExactAmount(e.target.value)}
                            className="field"
                            placeholder={`e.g. ${CURRENCY_META[currency].symbol} 12,000`}
                          />
                        </Field>
                        <label className="inline-flex items-center gap-2 text-[12px] text-slate-400">
                          <input
                            type="checkbox"
                            checked={negotiable}
                            onChange={(e) => setNegotiable(e.target.checked)}
                          />
                          Budget is negotiable
                        </label>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="space-y-5">
                        <Field label="Deadline" hint="Optional">
                          <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="field"
                          />
                        </Field>
                        <Field label="Preferred contact" hint="Optional">
                          <div className="flex flex-wrap gap-2">
                            {CONTACT_METHODS.map((c) => (
                              <button
                                type="button"
                                key={c}
                                onClick={() => setPreferredContact(c === preferredContact ? "" : c)}
                                className={`px-3 py-1.5 rounded-full text-[12px] mono border transition capitalize ${preferredContact === c ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </Field>
                      </div>
                    )}

                    {step === 5 && (
                      <div className="space-y-5">
                        <Field label="Message" required error={errors.message}>
                          <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            className="field resize-none"
                            placeholder="Tell me about the brand, the challenge, the goals and any references…"
                          />
                        </Field>
                        <Field
                          label={`References (${files.length}/${MAX_FILES})`}
                          hint="Up to 5 images, 8 MB each."
                        >
                          {files.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                              {files.map((f, i) => (
                                <div
                                  key={f.url}
                                  className="relative group rounded-lg overflow-hidden border border-white/10 bg-[#01040A] aspect-square"
                                >
                                  <img
                                    src={f.url}
                                    alt={f.name}
                                    className="absolute inset-0 h-full w-full object-cover"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeFile(i)}
                                    className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition"
                                  >
                                    <X size={11} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          {files.length < MAX_FILES && (
                            <label className="flex items-center justify-center gap-2 text-[12px] mono border border-dashed border-white/15 hover:border-sky-300/50 hover:text-sky-200 text-slate-400 rounded-lg px-4 py-6 cursor-pointer transition">
                              {uploading ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Paperclip size={13} />
                              )}
                              {uploading ? "Uploading…" : "Drop images or click to upload"}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                  onFiles(e.target.files);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          )}
                        </Field>
                        <Field
                          label="Reference links"
                          hint="Optional · Behance, Instagram, Drive, Pinterest..."
                        >
                          {refLinks.length > 0 && (
                            <ul className="mb-3 space-y-1.5">
                              {refLinks.map((l, i) => (
                                <li
                                  key={l.url}
                                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#01040A] px-3 py-2 text-[12px]"
                                >
                                  <span className="mono text-[10px] tracking-[0.18em] text-sky-300/70 shrink-0">
                                    URL
                                  </span>
                                  <a
                                    href={l.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-slate-200 hover:text-sky-200"
                                  >
                                    {l.url}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => removeRefLink(i)}
                                    className="ml-auto text-slate-500 hover:text-white"
                                  >
                                    <X size={12} />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="flex gap-2">
                            <input
                              value={refLinkInput}
                              onChange={(e) => setRefLinkInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addRefLink();
                                }
                              }}
                              placeholder="https://..."
                              className="field"
                            />
                            <button
                              type="button"
                              onClick={addRefLink}
                              className="shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-[12px] mono text-slate-200 hover:border-sky-300/50 hover:text-sky-200 transition"
                            >
                              Add
                            </button>
                          </div>
                        </Field>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-7 flex items-center justify-between gap-3 pt-5 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={prev}
                    disabled={step === 1}
                    className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white disabled:opacity-40"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  {step < STEPS.length ? (
                    <button
                      type="button"
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-white text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition"
                    >
                      Continue <ArrowRight size={14} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="inline-flex items-center gap-2 rounded-full bg-white text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition disabled:opacity-60"
                    >
                      {submitting ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Send size={14} />
                      )}
                      {submitting ? "Sending…" : "Send brief"}
                    </button>
                  )}
                </div>

                <style>{`
                  .field { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #f5f8ff; transition: border-color .2s, background .2s; }
                  .field::placeholder { color: #64748b; }
                  .field:focus { outline: none; border-color: #6ddcff; background: rgba(109,220,255,0.04); }
                `}</style>
              </form>
            )}
          </motion.div>
        </div>
      </div>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        bookingUrl={bookingUrl || undefined}
      />
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-sky-300">*</span>}
        </span>
        {hint && (
          <span className="text-[10px] text-slate-600 normal-case tracking-normal">{hint}</span>
        )}
      </span>
      <div className="mt-2">{children}</div>
      {error && (
        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-red-300">
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </label>
  );
}
