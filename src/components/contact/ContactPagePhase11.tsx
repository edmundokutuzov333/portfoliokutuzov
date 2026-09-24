import * as React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  FileImage,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Send,
  X,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting, SITE_EMAIL, SITE_PHONE } from "@/lib/cms";
import { whatsappLink } from "@/lib/whatsapp";
import { supabase } from "@/integrations/supabase/client";
import { BookingModal } from "@/components/contact/BookingModal";
import {
  CURRENCIES,
  CURRENCY_META,
  CONTACT_METHODS,
  PROJECT_TYPES,
  URGENCY,
  URGENCY_META,
  briefingSchema,
  isValidUrl,
  type BriefingAttachment,
  type BriefReferenceLink,
  type Currency,
  type ContactMethod,
  type Urgency,
} from "@/lib/contact-schema";
import { trackEvent } from "@/lib/analytics";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPagePhase11,
});

type ContactFormState = {
  fullName: string;
  companyName: string;
  position: string;
  country: string;
  email: string;
  phone: string;
  projectType: string;
  urgency: Urgency;
  deadline: string;
  currency: Currency;
  budgetRange: string;
  exactAmount: string;
  negotiable: boolean;
  message: string;
  preferredContact: ContactMethod | "";
  referenceLinks: BriefReferenceLink[];
  attachments: BriefingAttachment[];
};

const STEPS = [
  {
    id: 1,
    label: "Identity",
    heading: "Start with the people behind the project.",
    description: "A few details are enough to establish who I am speaking with.",
  },
  {
    id: 2,
    label: "Project",
    heading: "What are we making?",
    description: "Choose the main discipline and how much pressure the timeline carries.",
  },
  {
    id: 3,
    label: "Budget",
    heading: "What scale should I design for?",
    description: "Share the range when useful. Prefer not to say is completely valid.",
  },
  {
    id: 4,
    label: "Timing",
    heading: "When does the work need to move?",
    description: "A target date and preferred channel help shape the response.",
  },
  {
    id: 5,
    label: "References",
    heading: "Give the idea enough context.",
    description: "Describe the brief, add links, and include any useful visual references.",
  },
] as const;

const INITIAL_STATE: ContactFormState = {
  fullName: "",
  companyName: "",
  position: "",
  country: "",
  email: "",
  phone: "",
  projectType: PROJECT_TYPES[0],
  urgency: "normal",
  deadline: "",
  currency: "EUR",
  budgetRange: "Prefer not to say",
  exactAmount: "",
  negotiable: false,
  message: "",
  preferredContact: "",
  referenceLinks: [],
  attachments: [],
};

const DRAFT_KEY = "ek-contact-phase11-v1";
const MAX_FILES = 5;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

function getStepData(step: number, state: ContactFormState) {
  switch (step) {
    case 1:
      return briefingSchema.pick({ full_name: true, email: true }).safeParse({
        full_name: state.fullName,
        email: state.email,
      });
    case 2:
      return briefingSchema.pick({ project_type: true, urgency: true }).safeParse({
        project_type: state.projectType,
        urgency: state.urgency,
      });
    case 3:
      return briefingSchema
        .pick({ currency: true, budget_range: true, exact_amount: true })
        .safeParse({
          currency: state.currency,
          budget_range: state.budgetRange,
          exact_amount: state.exactAmount,
        });
    case 4:
      return briefingSchema
        .pick({ deadline: true, preferred_contact_method: true })
        .safeParse({
          deadline: state.deadline,
          preferred_contact_method: state.preferredContact || undefined,
        });
    case 5:
      return briefingSchema.pick({ message: true }).safeParse({
        message: state.message,
      });
    default:
      return { success: true as const, data: {} };
  }
}

export function ContactPagePhase11() {
  const { data: settings } = useSiteSettings();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = React.useState(1);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [state, setState] = React.useState<ContactFormState>(INITIAL_STATE);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [refInput, setRefInput] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [submissionId, setSubmissionId] = React.useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = React.useState(false);
  const [prefilledCase, setPrefilledCase] = React.useState("");
  const [prefilledService, setPrefilledService] = React.useState("");
  const [responseHours, setResponseHours] = React.useState("48");
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const hydratedRef = React.useRef(false);

  const r = <T,>(field: string, fallback: T) =>
    readSetting<T>(settings, "contact", field, fallback);

  const email = r("email", SITE_EMAIL);
  const phone = r("phone", SITE_PHONE);
  const bookingUrl = r("booking_url", "");
  const responseTime = r("response_hours", responseHours);
  const location = r("location", 'Magoanine "C", Maputo · Mozambique');

  React.useEffect(() => {
    setResponseHours(String(responseTime || "48"));
  }, [responseTime]);

  React.useEffect(() => {
    trackEvent({ action: "view", element: "contact" });

    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as Partial<ContactFormState> & { step?: number };
        setState({ ...INITIAL_STATE, ...draft });
        if (Number.isInteger(draft.step)) {
          setStep(Math.min(STEPS.length, Math.max(1, Number(draft.step))));
        }
      }
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
    } finally {
      hydratedRef.current = true;
    }

    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref")?.trim() || "";
    const service = params.get("service")?.trim() || "";

    if (service) {
      setPrefilledService(service);
      const lower = service.toLowerCase();
      if (lower.includes("identity")) setState((v) => ({ ...v, projectType: "Brand Identity" }));
      else if (lower.includes("art direction")) setState((v) => ({ ...v, projectType: "Art Direction" }));
      else if (lower.includes("editorial") || lower.includes("print")) {
        setState((v) => ({ ...v, projectType: "Visual Systems" }));
      } else if (lower.includes("digital")) {
        setState((v) => ({ ...v, projectType: "Web Design" }));
      }
      setStep(2);
    }

    if (!ref) return;

    let cancelled = false;
    setPrefilledCase(ref);

    fetch("/api/portfolio-case-study?slug=" + encodeURIComponent(ref))
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (cancelled || !payload?.project) return;

        const project = payload.project as {
          title?: string;
          category?: string;
          id?: string;
        };

        const category = String(project.category ?? "").toLowerCase();
        const mapped =
          category.includes("social")
            ? "Social Media"
            : category.includes("video")
              ? "Video Direction"
              : category.includes("web") || category.includes("digital")
                ? "Web Design"
                : category.includes("brand")
                  ? "Brand Identity"
                  : category.includes("campaign")
                    ? "Campaign Design"
                    : category.includes("editorial")
                      ? "Visual Systems"
                      : null;

        setState((current) => ({
          ...current,
          projectType: mapped ?? current.projectType,
          message:
            current.message.trim() ||
            "Portfolio case reference: " + String(project.title || ref),
        }));

        if (project.id) {
          setState((current) => ({
            ...current,
            // The server validates UUID format before persistence.
            referenceLinks: current.referenceLinks,
          }));
        }

        setStep(2);
      })
      .catch(() => {
        if (!cancelled) setPrefilledCase(ref);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (!hydratedRef.current || typeof window === "undefined") return;

    try {
      sessionStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          ...state,
          step,
        }),
      );
    } catch {
      // Session storage is progressive enhancement.
    }
  }, [state, step]);

  React.useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[String(key)];
      return next;
    });
  };

  const validateStep = (targetStep: number) => {
    const result = getStepData(targetStep, state);
    if (result.success) {
      setErrors((current) => {
        const next = { ...current };
        if (targetStep === 1) {
          delete next.full_name;
          delete next.email;
        }
        return next;
      });
      return true;
    }

    const nextErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = String(issue.path[0] ?? "_");
      nextErrors[key] = issue.message;
    }
    setErrors((current) => ({ ...current, ...nextErrors }));
    return false;
  };

  const next = () => {
    if (!validateStep(step)) {
      toast.error("Check the highlighted fields.");
      return;
    }

    setDirection(1);
    setStep((current) => Math.min(STEPS.length, current + 1));
  };

  const previous = () => {
    setDirection(-1);
    setStep((current) => Math.max(1, current - 1));
  };

  const jump = (target: number) => {
    if (target <= step) {
      setDirection(-1);
      setStep(target);
      return;
    }

    let current = step;
    while (current < target) {
      if (!validateStep(current)) {
        toast.error("Complete the current step before moving ahead.");
        return;
      }
      current += 1;
    }

    setDirection(1);
    setStep(target);
  };

  const addReference = () => {
    const value = refInput.trim();
    if (!value) return;
    if (!isValidUrl(value)) {
      toast.error("Use a complete http or https URL.");
      return;
    }
    if (state.referenceLinks.some((item) => item.url === value)) {
      setRefInput("");
      return;
    }
    update("referenceLinks", [...state.referenceLinks, { url: value }]);
    setRefInput("");
  };

  const removeReference = (index: number) => {
    update(
      "referenceLinks",
      state.referenceLinks.filter((_, current) => current !== index),
    );
  };

  const uploadFiles = async (list: FileList | null) => {
    if (!list) return;

    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));
    if (state.attachments.length + incoming.length > MAX_FILES) {
      toast.error("Maximum of 5 attachments.");
      return;
    }

    for (const file of incoming) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(file.name + " is larger than 8 MB.");
        continue;
      }

      const extension = file.name.includes(".") ? "." + file.name.split(".").pop() : "";
      const path = "briefings/" + crypto.randomUUID() + extension;

      const { error } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });

      if (error) {
        toast.error(file.name + ": " + error.message);
        continue;
      }

      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      const dimensions = await new Promise<{ width?: number; height?: number }>((resolve) => {
        const image = new Image();
        image.onload = () =>
          resolve({
            width: image.naturalWidth || undefined,
            height: image.naturalHeight || undefined,
          });
        image.onerror = () => resolve({});
        image.src = URL.createObjectURL(file);
      });

      update("attachments", [
        ...state.attachments,
        {
          url: data.publicUrl,
          name: file.name,
          size: file.size,
          width: dimensions.width,
          height: dimensions.height,
        },
      ]);
    }
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    for (let current = 1; current <= STEPS.length; current += 1) {
      if (!validateStep(current)) {
        setStep(current);
        setDirection(current < step ? -1 : 1);
        toast.error("Please complete the required fields.");
        return;
      }
    }

    setSubmitting(true);

    try {
      const parsed = briefingSchema.safeParse({
        full_name: state.fullName,
        company_name: state.companyName,
        position: state.position,
        country: state.country,
        email: state.email,
        phone: state.phone,
        project_type: state.projectType,
        urgency: state.urgency,
        deadline: state.deadline,
        currency: state.currency,
        budget_range: state.budgetRange,
        exact_amount: state.exactAmount,
        negotiable: state.negotiable,
        message: state.message,
        preferred_contact_method: state.preferredContact || null,
      });

      if (!parsed.success) {
        const nextErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          nextErrors[String(issue.path[0] ?? "_")] = issue.message;
        }
        setErrors(nextErrors);
        toast.error("Please check the highlighted fields.");
        return;
      }

      const locale = window.location.pathname.startsWith("/pt/") ? "pt" : "en";
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefing: parsed.data,
          source_case_slug: prefilledCase || null,
          attachments: state.attachments,
          reference_links: state.referenceLinks,
          locale,
          honeypot: "",
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        briefing_id?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        if (response.status === 429) {
          toast.error("Too many submissions. Please try again later.");
        } else {
          toast.error("We could not send the brief. Your draft is still saved.");
        }
        return;
      }

      setSubmissionId(payload.briefing_id || null);
      setDone(true);
      sessionStorage.removeItem(DRAFT_KEY);
      trackEvent({ action: "submit", element: "briefing" });
      toast.success("Brief received.");
    } catch {
      toast.error("Network error. Your draft is still saved.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setState(INITIAL_STATE);
    setStep(1);
    setErrors({});
    setSubmissionId(null);
    setDone(false);
    sessionStorage.removeItem(DRAFT_KEY);
  };

  const current = STEPS[step - 1]!;
  const firstBudget = CURRENCY_META[state.currency].brackets;

  const whatsappMessage =
    "Hello Edmundo, I am reaching out from your portfolio Contact page" +
    (prefilledCase ? " about the case " + prefilledCase : "") +
    (prefilledService ? " for " + prefilledService : "") +
    ".";

  return (
    <main data-tone="betao" className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      <section className="mx-auto max-w-[1500px] px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm font-semibold text-chapa">
              {r("eyebrow", "Contact")}
            </p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-5 max-w-3xl font-cartaz text-[clamp(3.6rem,8.6vw,8.5rem)] font-extrabold leading-[0.86] tracking-[-0.06em] focus:outline-none"
              style={{ fontVariationSettings: '"wdth" 72, "wght" 800' }}
            >
              Let&apos;s talk.
            </h1>
            <p className="mt-8 max-w-xl font-livro text-[clamp(1.2rem,2vw,1.8rem)] leading-[1.55] text-chapa">
              {r(
                "subtitle",
                "Tell me about your project, vision, and timeline. I review every submission personally.",
              )}
            </p>

            {(prefilledCase || prefilledService) && (
              <div className="mt-8 border-2 border-preto p-4 text-sm">
                {prefilledService && (
                  <p>
                    Selected discipline: <strong>{prefilledService}</strong>
                  </p>
                )}
                {prefilledCase && (
                  <p className={prefilledService ? "mt-2" : ""}>
                    Selected case: <strong>{prefilledCase}</strong>
                  </p>
                )}
              </div>
            )}

            <div className="mt-10 border-t-2 border-preto">
              <ChannelLink
                icon={<MessageCircle size={18} aria-hidden="true" />}
                title="WhatsApp Direct"
                detail="Immediate response channel"
                href={whatsappLink(whatsappMessage)}
                external
              />
              <ChannelLink
                icon={<Mail size={18} aria-hidden="true" />}
                title="Formal Email"
                detail={email}
                href={"mailto:" + email}
              />
              <button
                type="button"
                className="flex min-h-20 w-full items-center justify-between border-b-2 border-preto px-0 py-5 text-left hover:bg-preto hover:text-cal focus:outline-none focus-visible:ring-2 focus-visible:ring-work"
                onClick={() => {
                  if (bookingUrl) {
                    window.open(bookingUrl, "_blank", "noopener,noreferrer");
                  } else {
                    setBookingOpen(true);
                  }
                  trackEvent({ action: "click", element: "booking-open" });
                }}
              >
                <span className="flex items-center gap-3">
                  <CalendarDays size={18} aria-hidden="true" />
                  <span>
                    <span className="block text-base font-semibold">Schedule 30-Min Call</span>
                    <span className="block text-sm opacity-70">Existing booking integration</span>
                  </span>
                </span>
                <ExternalLink size={17} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-8 space-y-3 text-sm text-chapa">
              <p className="flex items-center gap-3">
                <MapPin size={17} aria-hidden="true" />
                {location}
              </p>
              <p className="flex items-center gap-3">
                <Clock3 size={17} aria-hidden="true" />
                Response target: {responseHours} hours
              </p>
            </div>
          </aside>

          <section className="bg-cal text-preto">
            <div className="border-2 border-preto p-5 md:p-8">
              <div className="grid gap-6 border-b-2 border-preto pb-6 md:grid-cols-5">
                {STEPS.map((item) => {
                  const active = item.id === step;
                  const complete = item.id < step;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => jump(item.id)}
                      className={
                        "min-h-16 border-2 px-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-work " +
                        (active
                          ? "border-black bg-black text-cal"
                          : complete
                            ? "border-black bg-betao text-black"
                            : "border-black/35 text-chapa")
                      }
                    >
                      <span className="block text-xs font-bold tabular-nums">{String(item.id).padStart(2, "0")}</span>
                      <span className="mt-1 block text-sm font-semibold">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-6 py-7 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="text-sm font-semibold text-chapa">
                    Step {step} of {STEPS.length}
                  </p>
                  <h2 className="mt-2 font-cartaz text-4xl font-extrabold leading-[0.92] tracking-[-0.04em] md:text-6xl">
                    {current.heading}
                  </h2>
                  <p className="mt-3 max-w-2xl font-livro text-lg leading-[1.55] text-chapa">
                    {current.description}
                  </p>
                </div>
                <p className="border-2 border-preto px-3 py-2 text-sm font-semibold">
                  Approx. 3–5 min
                </p>
              </div>

              {done ? (
                <SuccessState email={state.email} submissionId={submissionId} onReset={reset} responseHours={responseHours} />
              ) : (
                <form
                  onSubmit={submit}
                  noValidate
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    const target = event.target as HTMLElement;
                    if (target.tagName === "TEXTAREA" || target.tagName === "BUTTON") return;
                    event.preventDefault();
                    next();
                  }}
                >
                  {step === 1 && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <Field label="Full name" required error={errors.full_name}>
                        <input
                          id="full_name"
                          name="full_name"
                          value={state.fullName}
                          onChange={(event) => update("fullName", event.target.value)}
                          autoComplete="name"
                          autoFocus
                          className="field"
                        />
                      </Field>
                      <Field label="Email" required error={errors.email}>
                        <input
                          id="email"
                          name="email"
                          value={state.email}
                          onChange={(event) => update("email", event.target.value)}
                          autoComplete="email"
                          inputMode="email"
                          type="email"
                          className="field"
                        />
                      </Field>
                      <Field label="Company / brand">
                        <input
                          id="company"
                          value={state.companyName}
                          onChange={(event) => update("companyName", event.target.value)}
                          autoComplete="organization"
                          className="field"
                        />
                      </Field>
                      <Field label="Role / title">
                        <input
                          id="role"
                          value={state.position}
                          onChange={(event) => update("position", event.target.value)}
                          autoComplete="organization-title"
                          className="field"
                        />
                      </Field>
                      <Field label="Country / city">
                        <input
                          id="country"
                          value={state.country}
                          onChange={(event) => update("country", event.target.value)}
                          autoComplete="address-level2"
                          className="field"
                        />
                      </Field>
                      <Field label="Phone / WhatsApp">
                        <input
                          id="phone"
                          value={state.phone}
                          onChange={(event) => update("phone", event.target.value)}
                          autoComplete="tel"
                          inputMode="tel"
                          className="field"
                        />
                      </Field>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-8">
                      <ChoiceGroup
                        label="Project discipline"
                        required
                        value={state.projectType}
                        options={PROJECT_TYPES}
                        onChange={(value) => update("projectType", value)}
                        error={errors.project_type}
                      />
                      <ChoiceGroup
                        label="Urgency"
                        value={state.urgency}
                        options={URGENCY}
                        labels={Object.fromEntries(URGENCY.map((value) => [value, URGENCY_META[value].label]))}
                        onChange={(value) => update("urgency", value as Urgency)}
                        error={errors.urgency}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <ChoiceGroup
                        label="Currency"
                        required
                        value={state.currency}
                        options={[...CURRENCIES]}
                        labels={Object.fromEntries(CURRENCIES.map((value) => [value, CURRENCY_META[value].label]))}
                        onChange={(value) => {
                          update("currency", value as Currency);
                          update("budgetRange", "Prefer not to say");
                        }}
                        error={errors.currency}
                      />
                      <ChoiceGroup
                        label="Estimated scope"
                        value={state.budgetRange}
                        options={["Prefer not to say", ...firstBudget.map((item) => item.label)]}
                        onChange={(value) => update("budgetRange", value)}
                        error={errors.budget_range}
                      />
                      <div className="grid gap-5 md:grid-cols-2">
                        <Field label="Exact figure" hint="Optional">
                          <input
                            id="exact_amount"
                            inputMode="decimal"
                            value={state.exactAmount}
                            onChange={(event) => update("exactAmount", event.target.value)}
                            className="field"
                          />
                        </Field>
                        <label className="flex min-h-12 items-center gap-3 border-2 border-preto px-3 text-sm">
                          <input
                            type="checkbox"
                            checked={state.negotiable}
                            onChange={(event) => update("negotiable", event.target.checked)}
                            className="h-5 w-5"
                          />
                          Budget can flex with scope
                        </label>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-8">
                      <Field label="Target launch / delivery date">
                        <input
                          id="deadline"
                          type="date"
                          value={state.deadline}
                          onChange={(event) => update("deadline", event.target.value)}
                          className="field max-w-md"
                        />
                      </Field>
                      <ChoiceGroup
                        label="Preferred contact channel"
                        value={state.preferredContact}
                        options={["", ...CONTACT_METHODS]}
                        labels={{
                          "": "No preference",
                          email: "Email",
                          phone: "Phone",
                          whatsapp: "WhatsApp",
                          linkedin: "LinkedIn",
                        }}
                        onChange={(value) => update("preferredContact", value as ContactMethod | "")}
                      />
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-8">
                      <Field label="Project description" required error={errors.message}>
                        <textarea
                          id="message"
                          name="message"
                          value={state.message}
                          onChange={(event) => update("message", event.target.value)}
                          rows={8}
                          autoFocus
                          className="field resize-y"
                          placeholder="Context, challenge, deliverables, ambition, references and anything that would change the direction."
                        />
                      </Field>

                      <div className="grid gap-6 md:grid-cols-2">
                        <Field label="Reference URLs" hint="Optional">
                          <div className="flex gap-2">
                            <input
                              value={refInput}
                              onChange={(event) => setRefInput(event.target.value)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                  event.preventDefault();
                                  addReference();
                                }
                              }}
                              placeholder="https://..."
                              className="field"
                            />
                            <button type="button" onClick={addReference} className="ds-button shrink-0" data-variant="secondary">
                              Add
                            </button>
                          </div>
                          {state.referenceLinks.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {state.referenceLinks.map((link, index) => (
                                <li key={link.url} className="flex items-center justify-between gap-3 border-b border-black/20 py-2 text-sm">
                                  <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="truncate underline underline-offset-4"
                                  >
                                    {link.url}
                                  </a>
                                  <button type="button" onClick={() => removeReference(index)} aria-label={"Remove " + link.url}>
                                    <X size={17} aria-hidden="true" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Field>

                        <Field label={"Visual attachments " + state.attachments.length + "/" + MAX_FILES} hint="PNG, JPG, WEBP · 8 MB each">
                          <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-black/30 p-4 text-sm text-chapa hover:border-black focus-within:ring-2 focus-within:ring-work">
                            <FileImage size={20} aria-hidden="true" />
                            <span>Upload reference images</span>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              multiple
                              className="sr-only"
                              onChange={(event) => {
                                void uploadFiles(event.target.files);
                                event.target.value = "";
                              }}
                            />
                          </label>
                          {state.attachments.length > 0 && (
                            <ul className="mt-3 space-y-2">
                              {state.attachments.map((attachment, index) => (
                                <li key={attachment.url} className="flex items-center justify-between gap-3 border-b border-black/20 py-2 text-sm">
                                  <span className="flex min-w-0 items-center gap-2">
                                    <Paperclip size={15} aria-hidden="true" />
                                    <span className="truncate">{attachment.name}</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => update("attachments", state.attachments.filter((_, currentIndex) => currentIndex !== index))}
                                    aria-label={"Remove " + attachment.name}
                                  >
                                    <X size={17} aria-hidden="true" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </Field>
                      </div>

                      <div className="border-y-2 border-preto py-6">
                        <h3 className="font-cartaz text-2xl font-bold leading-none">Review before sending</h3>
                        <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                          <Summary label="Name" value={state.fullName} />
                          <Summary label="Email" value={state.email} />
                          <Summary label="Project" value={state.projectType} />
                          <Summary label="Budget" value={state.budgetRange} />
                          <Summary label="Timing" value={state.deadline || "Flexible"} />
                          <Summary label="Contact" value={state.preferredContact || "No preference"} />
                        </dl>
                      </div>
                    </div>
                  )}

                  <div className="mt-10 flex items-center justify-between gap-4 border-t-2 border-preto pt-6">
                    <button
                      type="button"
                      onClick={previous}
                      disabled={step === 1}
                      className="ds-button disabled:opacity-30"
                      data-variant="secondary"
                    >
                      <ArrowLeft size={17} aria-hidden="true" /> Back
                    </button>

                    {step < STEPS.length ? (
                      <button type="button" onClick={next} className="ds-button" data-variant="primary" data-tone="light">
                        Continue <ArrowRight size={17} aria-hidden="true" />
                      </button>
                    ) : (
                      <button type="submit" disabled={submitting} className="ds-button" data-variant="primary" data-tone="light">
                        {submitting ? "Sending…" : "Send Project Brief"} <Send size={17} aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  <p className="mt-5 text-center text-sm text-chapa" aria-live="polite">
                    Your draft stays in this browser until the brief is submitted.
                  </p>
                </form>
              )}
            </div>
          </section>
        </div>
      </section>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} bookingUrl={bookingUrl || undefined} />
    </main>
  );
}

function ChannelLink({
  icon,
  title,
  detail,
  href,
  external = false,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex min-h-20 items-center justify-between border-b-2 border-preto px-0 py-5 hover:bg-preto hover:text-cal focus:outline-none focus-visible:ring-2 focus-visible:ring-work"
    >
      <span className="flex items-center gap-3">
        {icon}
        <span>
          <span className="block text-base font-semibold">{title}</span>
          <span className="block text-sm opacity-70">{detail}</span>
        </span>
      </span>
      <ExternalLink size={17} aria-hidden="true" />
    </a>
  );
}

function Field({
  label,
  required = false,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  const firstChild = React.Children.toArray(children).find(React.isValidElement);
  const id = firstChild
    ? (firstChild as React.ReactElement<{ id?: string }>).props.id
    : undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label} {required ? <span aria-hidden="true">*</span> : null}
        {hint ? <span className="ml-2 font-normal text-chapa">({hint})</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ChoiceGroup({
  label,
  required = false,
  value,
  options,
  labels = {},
  onChange,
  error,
}: {
  label: string;
  required?: boolean;
  value: string;
  options: readonly string[];
  labels?: Record<string, string>;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </legend>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option || "none"}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option)}
              className={
                "min-h-12 border-2 px-3 py-3 text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-work " +
                (selected ? "border-black bg-black text-cal" : "border-black/30 hover:border-black")
              }
            >
              {labels[option] ?? option}
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-700" role="alert" aria-live="polite">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-black/20 pb-2">
      <dt className="text-xs font-semibold text-chapa">{label}</dt>
      <dd className="mt-1 text-sm">{value || "—"}</dd>
    </div>
  );
}

function SuccessState({
  email,
  submissionId,
  onReset,
  responseHours,
}: {
  email: string;
  submissionId: string | null;
  onReset: () => void;
  responseHours: string;
}) {
  return (
    <div className="border-2 border-black p-7 md:p-10" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        <Check size={24} aria-hidden="true" />
        <p className="text-sm font-semibold">Brief received.</p>
      </div>

      <h3 className="mt-5 max-w-4xl font-cartaz text-[clamp(2.4rem,5vw,4.5rem)] font-extrabold leading-[0.9] tracking-[-0.05em]">
        The project is now in the queue.
      </h3>

      <p className="mt-5 max-w-2xl font-livro text-xl leading-[1.55] text-chapa">
        A confirmation was prepared for {email}. The current response target is {responseHours} hours.
      </p>

      {submissionId ? (
        <p className="mt-4 text-sm text-chapa">Reference: {submissionId}</p>
      ) : null}

      <button type="button" onClick={onReset} className="mt-8 ds-button" data-variant="secondary">
        Start another brief
      </button>
    </div>
  );
}
