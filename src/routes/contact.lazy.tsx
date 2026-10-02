import { createLazyFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting, SITE_EMAIL, SITE_PHONE, LINKEDIN_URL } from "@/lib/cms";
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
import { BookingModal } from "@/components/contact/BookingModal";
import { ShinyButton } from "@/components/ui/shiny-button";
import { trackEvent } from "@/lib/analytics";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPage,
});

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024;

const STEPS = [
  {
    id: 1,
    number: "01",
    label: "IDENTITY",
    heading: "Tell me who you are and what you're building.",
    subtext: "Let's start with the basics so I know who is leading this initiative.",
    Icon: User,
    cta: "Continue to Project",
  },
  {
    id: 2,
    number: "02",
    label: "PROJECT",
    heading: "What are we creating together?",
    subtext: "Select the discipline, creative focus and urgency level for the rollout.",
    Icon: Briefcase,
    cta: "Continue to Budget",
  },
  {
    id: 3,
    number: "03",
    label: "BUDGET",
    heading: "What's the scale you're working with?",
    subtext: "Establishing scale ensures we align scope, production depth and craft velocity.",
    Icon: Wallet,
    cta: "Continue to Timing",
  },
  {
    id: 4,
    number: "04",
    label: "TIMING",
    heading: "When does this need to happen?",
    subtext: "Key delivery milestones and your preferred communication channel.",
    Icon: CalendarDays,
    cta: "Continue to References",
  },
  {
    id: 5,
    number: "05",
    label: "REFERENCES",
    heading: "Share anything that helps define the direction.",
    subtext: "Describe the vision, upload brand assets or drop links to moodboards.",
    Icon: ImagePlus,
    cta: "Send Project Brief",
  },
] as const;

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const sendEmails = useServerFn(sendBriefingEmails);
  const reducedMotion = useReducedMotion();

  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "contact", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);

  const email = r("email", SITE_EMAIL);
  const phone = r("phone", SITE_PHONE);
  const bookingUrl = r("booking_url", "");

  // Form State
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Field values
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
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    trackEvent({ action: "view", element: "contact" });
  }, []);

  const brackets = CURRENCY_META[currency].brackets;
  const selectedBudget = brackets[budgetIdx] ?? brackets[0];

  const onFiles = async (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} reference files allowed`);
      return;
    }
    setUploading(true);
    try {
      const uploads: BriefingAttachment[] = [];
      for (const file of incoming) {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} exceeds 8 MB limit`);
          continue;
        }
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file`);
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
      toast.success("Attachments uploaded successfully");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (i: number) => setFiles((f) => f.filter((_, j) => j !== i));

  const validateStep = (n: number): boolean => {
    const e: Record<string, string> = {};
    if (n === 1) {
      if (!fullName.trim()) e.full_name = "Your full name is required";
      if (!emailVal.trim()) {
        e.email = "Your email address is required";
      } else if (!/.+@.+\..+/.test(emailVal.trim())) {
        e.email = "Please enter a valid email address (e.g. name@company.com)";
      }
    }
    if (n === 2) {
      if (!projectType) e.project_type = "Please select a project discipline";
    }
    if (n === 5) {
      if (message.trim().length < 10) {
        e.message =
          "Please share a few more details about your project goals (at least 10 characters)";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const clearFieldError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const goToStep = (targetStep: number) => {
    if (targetStep === step) return;
    if (targetStep > step) {
      if (!validateStep(step)) {
        toast.error("Please complete the required fields to continue");
        return;
      }
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setStep(targetStep);
  };

  const next = () => {
    if (!validateStep(step)) {
      toast.error("Please complete the required fields to continue");
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(STEPS.length, s + 1));
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

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
      toast.error("Please provide a description of your project before sending");
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
    try {
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

      if (error) {
        toast.error(`Submission failed: ${error.message}. Your data is preserved.`);
        setSubmitting(false);
        return;
      }

      setSubmissionId(inserted?.id || null);
      trackEvent({ action: "submit", element: "briefing" });

      if (inserted?.id) {
        sendEmails({ data: { briefing_id: inserted.id } }).catch(() => {
          /* silent background notification */
        });
      }

      setDone(true);
      toast.success("Brief received. I'll be in touch within 48h.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepData = STEPS[step - 1];

  return (
    <section className="relative px-4 md:px-8 pt-44 md:pt-48 pb-32 bg-[var(--color-bg)] min-h-screen text-[var(--color-text-primary)]">
      <div className="max-w-[var(--width-standard)] mx-auto relative z-10">
        {/* Top Eyebrow Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          className="flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase mb-12 border-b border-white/[0.08] pb-6"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>{r("eyebrow", "Project Briefing Experience")}</span>
          </div>
          <div>{r("status", "Open for 2026 Collaborations")}</div>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20 items-start">
          {/* ==================== LEFT: CHANNELS & IDENTITY ==================== */}
          <div className="md:col-span-5 space-y-10 md:sticky md:top-28">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
                className="display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.96] tracking-[-0.025em] text-white"
              >
                Let's <span className="italic text-sky-300 font-normal">collaborate.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-6 text-[15px] md:text-[16px] text-slate-300 leading-relaxed"
              >
                {r(
                  "subtitle",
                  "Tell me about your project, vision, and timeline. I review every submission personally and respond within 48 hours.",
                )}
              </motion.p>
            </div>

            {/* THREE CONTACT CHANNELS HIERARCHY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-3 pt-2"
            >
              <p className="mono text-[10px] tracking-[0.24em] text-slate-400 uppercase mb-3">
                Direct Channels
              </p>

              {/* 1. WHATSAPP (IMMEDIATE) */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center shrink-0">
                    <MessageSquare size={15} />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>WhatsApp Direct</span>
                      <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Immediate
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Quick voice or chat exchange
                    </p>
                  </div>
                </div>
                <WhatsAppButton variant="ghost" className="text-xs py-1.5 px-3">
                  Open Chat
                </WhatsAppButton>
              </div>

              {/* 2. EMAIL (FORMAL) */}
              <a
                href={`mailto:${email}`}
                onClick={() => trackEvent({ action: "click", element: "email" })}
                className="group rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 flex items-center justify-between hover:border-sky-400/40 hover:bg-sky-950/10 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.04] text-slate-300 group-hover:text-sky-300 group-hover:border-sky-400/40 grid place-items-center shrink-0 transition-colors">
                    <Mail size={15} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>Formal Email</span>
                      <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">
                        Formal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{email}</p>
                  </div>
                </div>
                <span className="mono text-[10px] text-sky-300 tracking-wider uppercase shrink-0 font-medium">
                  Compose
                </span>
              </a>

              {/* 3. CALENDAR (SCHEDULED) */}
              <button
                type="button"
                onClick={() => {
                  trackEvent({ action: "click", element: "booking-open" });
                  setBookingOpen(true);
                }}
                className="w-full group rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 flex items-center justify-between hover:border-sky-400/40 hover:bg-sky-950/10 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.04] text-slate-300 group-hover:text-sky-300 group-hover:border-sky-400/40 grid place-items-center shrink-0 transition-colors">
                    <CalendarDays size={15} />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <span>Schedule 30-Min Call</span>
                      <span className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300">
                        Discovery
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">Pick a calendar slot</p>
                  </div>
                </div>
                <span className="mono text-[10px] text-sky-300 tracking-wider uppercase shrink-0 font-medium">
                  Book
                </span>
              </button>
            </motion.div>

            {/* Social & Studio Location Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-white/[0.08] space-y-4"
            >
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <MapPin size={15} className="text-sky-400 shrink-0" />
                <span>{r("location", 'Magoanine "C", Maputo · Mozambique')}</span>
              </div>

              <div className="flex items-center gap-2.5">
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
                    className="h-9 w-9 rounded-full border border-white/[0.08] bg-white/[0.02] grid place-items-center text-slate-400 hover:text-white hover:border-sky-400/40 hover:bg-sky-950/20 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ==================== RIGHT: CONVERSATIONAL BRIEFING FORM ==================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL }}
            className="md:col-span-7 relative"
          >
            {done ? (
              /* REAL SUCCESS STATE */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE_EDITORIAL }}
                className="rounded-2xl border border-sky-400/30 bg-gradient-to-b from-[#061224] to-[#02050c] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center relative overflow-hidden"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-sky-400/20 border border-sky-400/40 grid place-items-center text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.3)]">
                  <Check size={28} strokeWidth={2.5} />
                </div>

                <div className="mono text-[10px] tracking-[0.28em] text-sky-400 uppercase mt-6">
                  Brief Submitted Successfully
                </div>

                <h2 className="display text-3xl md:text-4xl text-white mt-2 font-medium">
                  Brief received, {fullName.split(" ")[0] || "there"}.
                </h2>

                <p className="text-[15px] text-slate-300 mt-4 max-w-md mx-auto leading-relaxed">
                  Thank you for submitting your project brief. A confirmation copy has been queued
                  for{" "}
                  <span className="text-white font-medium underline underline-offset-4 decoration-sky-400/60">
                    {emailVal}
                  </span>
                  .
                </p>

                {/* Next Steps Guidance */}
                <div className="mt-8 p-6 rounded-xl border border-white/[0.08] bg-black/40 text-left space-y-3 max-w-lg mx-auto">
                  <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
                    <Clock size={14} />
                    <span>What happens next:</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                      <span>
                        <strong>Review (24-48h):</strong> I personally review your project scope,
                        timing, and reference materials.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                      <span>
                        <strong>Discovery Response:</strong> You will receive a structured response
                        with questions or proposed next steps.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Fallback Quick Actions */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-sky-300 transition-colors"
                  >
                    <CalendarDays size={14} /> Book a follow-up call
                  </button>

                  <WhatsAppButton variant="ghost">Chat on WhatsApp</WhatsAppButton>
                </div>

                <div className="mt-10 pt-6 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => {
                      setDone(false);
                      setStep(1);
                      setFullName("");
                      setEmailVal("");
                      setMessage("");
                      setFiles([]);
                      setRefLinks([]);
                    }}
                    className="mono text-[11px] text-slate-500 hover:text-sky-300 uppercase tracking-[0.15em] transition-colors"
                  >
                    Submit another project brief
                  </button>
                </div>
              </motion.div>
            ) : (
              /* CONVERSATIONAL FORM WRAPPER */
              <div className="rounded-2xl border border-white/[0.1] bg-[#030712] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                {/* 1. ANIMATED STEP INDICATOR */}
                <div className="mb-8 pb-6 border-b border-white/[0.08]">
                  {/* Progress meta and Step count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="mono text-[10px] tracking-[0.24em] text-sky-400 uppercase font-semibold">
                        STEP {step} OF {STEPS.length}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="mono text-[10px] tracking-[0.2em] text-slate-300 uppercase">
                        {currentStepData.label}
                      </span>
                    </div>

                    <span className="mono text-[10px] tracking-[0.15em] text-slate-500 uppercase">
                      {Math.round((step / STEPS.length) * 100)}% Complete
                    </span>
                  </div>

                  {/* 8. Thin ScaleX Progress Bar */}
                  <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden mb-6">
                    <motion.div
                      animate={{
                        scaleX: step / STEPS.length,
                      }}
                      transition={{
                        duration: 0.35,
                        ease: EASE_EDITORIAL,
                      }}
                      style={{ transformOrigin: "left" }}
                      className="h-full bg-gradient-to-r from-sky-400 to-cyan-300"
                    />
                  </div>

                  {/* Desktop / Tablet Step Tabs */}
                  <div className="grid grid-cols-5 gap-2">
                    {STEPS.map((sItem) => {
                      const isActive = step === sItem.id;
                      const isPast = step > sItem.id;

                      return (
                        <button
                          key={sItem.id}
                          type="button"
                          onClick={() => goToStep(sItem.id)}
                          className="text-left group focus:outline-none"
                        >
                          <motion.div
                            animate={{
                              opacity: isActive ? 1 : isPast ? 0.75 : 0.35,
                              scale: isActive ? 1 : 0.96,
                            }}
                            transition={{
                              duration: 0.3,
                              ease: EASE_EDITORIAL,
                            }}
                            className={`p-2.5 rounded-lg border transition-all duration-300 ${
                              isActive
                                ? "border-sky-400/40 bg-sky-950/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                                : isPast
                                  ? "border-white/[0.1] bg-white/[0.02]"
                                  : "border-transparent bg-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`mono text-[10px] font-semibold tracking-wider ${
                                  isActive
                                    ? "text-sky-300"
                                    : isPast
                                      ? "text-slate-300"
                                      : "text-slate-500"
                                }`}
                              >
                                {sItem.number}
                              </span>
                              {isPast && <Check size={10} className="text-emerald-400" />}
                            </div>
                            <div
                              className={`mono text-[9px] tracking-[0.14em] uppercase truncate mt-1 ${
                                isActive ? "text-white font-semibold" : "text-slate-400"
                              }`}
                            >
                              {sItem.label}
                            </div>
                          </motion.div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 9. ADAPTIVE MICROCOPY HEADING */}
                <div className="mb-8">
                  <h2 className="display text-2xl sm:text-3xl text-white font-medium tracking-tight">
                    {currentStepData.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                    {currentStepData.subtext}
                  </p>
                </div>

                {/* 2. STEP TRANSITIONS WITH ANIMATEPRESENCE & DIRECTION */}
                <form onSubmit={onSubmit} noValidate>
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      initial={
                        reducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              x: direction > 0 ? 24 : -24,
                            }
                      }
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={
                        reducedMotion
                          ? { opacity: 0 }
                          : {
                              opacity: 0,
                              x: direction > 0 ? -24 : 24,
                            }
                      }
                      transition={{
                        duration: 0.38,
                        ease: EASE_EDITORIAL,
                      }}
                    >
                      {/* STEP 1: IDENTITY */}
                      {step === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <Field
                            label="Your Name"
                            required
                            error={errors.full_name}
                            hint="Primary contact"
                          >
                            <input
                              value={fullName}
                              onChange={(e) => {
                                setFullName(e.target.value);
                                clearFieldError("full_name");
                              }}
                              className="field"
                              placeholder="e.g. Maya Lin"
                              autoFocus
                            />
                          </Field>

                          <Field
                            label="Email Address"
                            required
                            error={errors.email}
                            hint="Where I'll reply"
                          >
                            <input
                              type="email"
                              value={emailVal}
                              onChange={(e) => {
                                setEmailVal(e.target.value);
                                clearFieldError("email");
                              }}
                              className="field"
                              placeholder="maya@studio.com"
                            />
                          </Field>

                          <Field label="Company / Brand" hint="Optional">
                            <input
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="field"
                              placeholder="e.g. Acme Studio"
                            />
                          </Field>

                          <Field label="Role / Title" hint="Optional">
                            <input
                              value={position}
                              onChange={(e) => setPosition(e.target.value)}
                              className="field"
                              placeholder="e.g. Founder, Marketing Director"
                            />
                          </Field>

                          <Field label="Country / City" hint="Optional">
                            <input
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="field"
                              placeholder="e.g. Maputo, Lisbon, London"
                            />
                          </Field>

                          <Field label="Phone / WhatsApp" hint="Optional">
                            <input
                              value={phoneVal}
                              onChange={(e) => setPhoneVal(e.target.value)}
                              className="field"
                              placeholder="e.g. +258 84 000 0000"
                            />
                          </Field>
                        </div>
                      )}

                      {/* STEP 2: PROJECT */}
                      {step === 2 && (
                        <div className="space-y-8">
                          <Field
                            label="Project Discipline"
                            required
                            error={errors.project_type}
                            hint="Select main focus"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                              {PROJECT_TYPES.map((p) => {
                                const isSel = projectType === p;
                                return (
                                  <button
                                    type="button"
                                    key={p}
                                    onClick={() => {
                                      setProjectType(p);
                                      clearFieldError("project_type");
                                    }}
                                    className={`px-3.5 py-3 rounded-xl text-xs text-left transition-all duration-200 border ${
                                      isSel
                                        ? "bg-sky-950/40 border-sky-400/60 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/20"
                                        : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.04]"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="truncate">{p}</span>
                                      {isSel && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 ml-1.5" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <Field label="Project Urgency" required hint="Rollout timeline pressure">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              {URGENCY.map((u) => {
                                const isSel = urgency === u;
                                const meta = URGENCY_META[u];
                                return (
                                  <button
                                    type="button"
                                    key={u}
                                    onClick={() => setUrgency(u)}
                                    className={`px-3.5 py-3 rounded-xl text-xs text-center transition-all duration-200 border capitalize ${
                                      isSel
                                        ? "bg-white text-black font-semibold border-white shadow-lg"
                                        : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"
                                    }`}
                                  >
                                    {meta.label}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>
                        </div>
                      )}

                      {/* STEP 3: BUDGET */}
                      {step === 3 && (
                        <div className="space-y-8">
                          <Field label="Currency" required hint="Preferred billing currency">
                            <div className="flex items-center gap-2 flex-wrap pt-1">
                              {CURRENCIES.map((c) => {
                                const isSel = currency === c;
                                const meta = CURRENCY_META[c];
                                return (
                                  <button
                                    type="button"
                                    key={c}
                                    onClick={() => {
                                      setCurrency(c);
                                      setBudgetIdx(1);
                                    }}
                                    className={`px-4 py-2.5 rounded-xl text-xs border transition-all duration-200 ${
                                      isSel
                                        ? "bg-sky-400 text-black font-bold border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                                        : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"
                                    }`}
                                  >
                                    <span className="font-semibold">{meta.symbol}</span>{" "}
                                    {meta.label}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <Field
                            label="Estimated Scope Bracket"
                            hint="Select the tier that best fits"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              {brackets.map((b, i) => {
                                const isSel = budgetIdx === i;
                                return (
                                  <button
                                    type="button"
                                    key={b.label}
                                    onClick={() => setBudgetIdx(i)}
                                    className={`px-4 py-3.5 rounded-xl text-xs text-center border transition-all duration-200 ${
                                      isSel
                                        ? "bg-white text-black font-bold border-white shadow-lg"
                                        : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"
                                    }`}
                                  >
                                    {b.label}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <div className="grid sm:grid-cols-2 gap-6 items-end pt-2">
                            <Field label="Or an Exact Figure" hint="Optional target amount">
                              <input
                                value={exactAmount}
                                onChange={(e) => setExactAmount(e.target.value)}
                                className="field"
                                placeholder={`e.g. ${CURRENCY_META[currency].symbol} 12,000`}
                              />
                            </Field>

                            <label className="flex items-center gap-3 text-xs text-slate-300 cursor-pointer h-12 pb-1 group">
                              <input
                                type="checkbox"
                                checked={negotiable}
                                onChange={(e) => setNegotiable(e.target.checked)}
                                className="w-4 h-4 rounded border-white/20 bg-white/[0.05] text-sky-400 focus:ring-sky-400 focus:ring-offset-0 focus:ring-1 transition-colors"
                              />
                              <span className="group-hover:text-white transition-colors">
                                Budget is negotiable based on scope &amp; deliverables
                              </span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* STEP 4: TIMING */}
                      {step === 4 && (
                        <div className="space-y-8">
                          <Field
                            label="Target Launch / Delivery Date"
                            hint="Optional project deadline"
                          >
                            <input
                              type="date"
                              value={deadline}
                              onChange={(e) => setDeadline(e.target.value)}
                              className="field max-w-sm"
                            />
                          </Field>

                          <Field
                            label="Preferred Contact Channel"
                            hint="How would you like to receive the proposal?"
                          >
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                              {CONTACT_METHODS.map((c) => {
                                const isSel = preferredContact === c;
                                return (
                                  <button
                                    type="button"
                                    key={c}
                                    onClick={() => setPreferredContact(isSel ? "" : c)}
                                    className={`px-4 py-3 rounded-xl text-xs text-center border transition-all duration-200 capitalize ${
                                      isSel
                                        ? "bg-sky-950/40 border-sky-400 text-sky-200 font-semibold ring-1 ring-sky-400/30"
                                        : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"
                                    }`}
                                  >
                                    {c}
                                  </button>
                                );
                              })}
                            </div>
                          </Field>

                          <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-start gap-3">
                            <ShieldCheck size={16} className="text-sky-400 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-400 leading-relaxed">
                              All briefings and shared information are strictly confidential and
                              protected under standard studio NDA standards.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* STEP 5: REFERENCES & MESSAGE */}
                      {step === 5 && (
                        <div className="space-y-8">
                          <Field
                            label="Project Description & Vision"
                            required
                            error={errors.message}
                            hint="The challenge, goals and deliverables"
                          >
                            <textarea
                              value={message}
                              onChange={(e) => {
                                setMessage(e.target.value);
                                clearFieldError("message");
                              }}
                              rows={5}
                              className="field resize-none leading-relaxed"
                              placeholder="Tell me about the brand context, the creative ambition, deliverables expected, and any specific aesthetic benchmarks…"
                              autoFocus
                            />
                          </Field>

                          <div className="grid sm:grid-cols-2 gap-6 pt-2">
                            {/* File Uploads */}
                            <Field
                              label={`Visual Attachments (${files.length}/${MAX_FILES})`}
                              hint="Max 8 MB images"
                            >
                              {files.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                  {files.map((f, i) => (
                                    <div
                                      key={f.url}
                                      className="relative group rounded-lg overflow-hidden border border-white/[0.1] bg-[#070e1c] aspect-square"
                                    >
                                      <img
                                        src={f.url}
                                        alt={f.name}
                                        className="absolute inset-0 h-full w-full object-cover"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeFile(i)}
                                        className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {files.length < MAX_FILES && (
                                <label className="flex flex-col items-center justify-center gap-2 text-xs border border-dashed border-white/[0.15] hover:border-sky-400/60 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-sky-950/10 rounded-xl px-4 py-6 cursor-pointer transition-all duration-300 group text-center">
                                  {uploading ? (
                                    <Loader2 size={18} className="animate-spin text-sky-400" />
                                  ) : (
                                    <Paperclip
                                      size={18}
                                      className="text-slate-400 group-hover:text-sky-300 transition-colors"
                                    />
                                  )}
                                  <span>
                                    {uploading ? "Uploading..." : "Upload images / brand assets"}
                                  </span>
                                  <span className="text-[10px] text-slate-500">
                                    PNG, JPG, WEBP up to 8MB
                                  </span>
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

                            {/* Reference Links */}
                            <Field
                              label="Moodboards / Reference URLs"
                              hint="Behance, Figma, Drive, Pinterest"
                            >
                              {refLinks.length > 0 && (
                                <ul className="mb-3 space-y-2">
                                  {refLinks.map((l, i) => (
                                    <li
                                      key={l.url}
                                      className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs"
                                    >
                                      <span className="mono text-[9px] tracking-wider text-sky-400 uppercase shrink-0">
                                        LINK
                                      </span>
                                      <a
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-slate-200 hover:text-sky-300 transition-colors"
                                      >
                                        {l.url}
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => removeRefLink(i)}
                                        className="ml-auto text-slate-500 hover:text-white transition-colors"
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
                                  placeholder="https://behance.net/..."
                                  className="field"
                                />
                                <button
                                  type="button"
                                  onClick={addRefLink}
                                  className="shrink-0 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-xs font-semibold text-white hover:border-sky-400 hover:bg-sky-950/20 transition-all"
                                >
                                  Add
                                </button>
                              </div>
                            </Field>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* 10. PRIMARY CTA & NAVIGATION CONTROLS */}
                  <div className="mt-12 flex items-center justify-between gap-4 pt-8 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={prev}
                      disabled={step === 1}
                      className="inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>

                    {step < STEPS.length ? (
                      <ShinyButton
                        onClick={next}
                        type="button"
                        className="px-7 py-3.5 text-xs sm:text-sm font-semibold text-white"
                      >
                        <span>{currentStepData.cta}</span>
                        <ArrowRight size={15} />
                      </ShinyButton>
                    ) : (
                      <ShinyButton
                        type="submit"
                        disabled={submitting || uploading}
                        className="px-8 py-3.5 text-xs sm:text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {submitting ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={15} />
                        )}
                        <span>{submitting ? "Transmitting Brief..." : "Send Project Brief"}</span>
                      </ShinyButton>
                    )}
                  </div>

                  {/* 3. FIELD FOCUS & STYLES */}
                  <style>{`
                    .field {
                      width: 100%;
                      background: rgba(255, 255, 255, 0.02);
                      border: 1px solid rgba(255, 255, 255, 0.1);
                      border-radius: 12px;
                      padding: 12px 14px;
                      font-size: 14px;
                      color: #f8fafc;
                      transition: all 0.25s ease;
                    }
                    .field::placeholder {
                      color: rgba(148, 163, 184, 0.5);
                    }
                    .field:hover {
                      border-color: rgba(255, 255, 255, 0.2);
                    }
                    .field:focus {
                      outline: none;
                      border-color: rgba(56, 189, 248, 0.6);
                      box-shadow: 0 0 16px rgba(56, 189, 248, 0.12);
                      background: rgba(56, 189, 248, 0.03);
                    }
                  `}</style>
                </form>
              </div>
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
      <span className="mono text-[10px] tracking-[0.2em] uppercase text-slate-400 flex items-center justify-between mb-2">
        <span className="flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-sky-400 font-bold">*</span>}
        </span>
        {hint && (
          <span className="text-[10px] text-slate-400 normal-case tracking-normal font-normal">
            {hint}
          </span>
        )}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <AlertCircle size={13} className="shrink-0" /> {error}
        </span>
      )}
    </label>
  );
}
