import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { g as createLazyFileRoute } from "../_libs/tanstack__react-router.mjs";
import { b as useSiteSettings, u as useServerFn, j as PROJECT_TYPES, t as trackEvent, C as CURRENCY_META, L as LINKEDIN_URL, U as URGENCY, k as URGENCY_META, l as CURRENCIES, m as CONTACT_METHODS, o as ShinyButton, r as readSetting, p as briefingSchema, q as isValidUrl, h as bookingSchema, S as SITE_PHONE_DIGITS, f as createSsrRpc, v as SITE_EMAIL, w as SITE_PHONE } from "./router-DUKWfrGf.mjs";
import { s as supabase } from "./client-BWSZl9S1.mjs";
import { c as createServerFn } from "./server-D2mK8el-.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import "../_libs/seroval.mjs";
import { u as useReducedMotion, m as motion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { a4 as MessageSquare, a as Mail, ab as CalendarDays, m as MapPin, ac as Instagram, ad as Linkedin, ae as Facebook, k as Check, p as Clock, z as User, y as Briefcase, af as Wallet, ag as ImagePlus, q as ShieldCheck, X, L as LoaderCircle, a2 as Paperclip, v as ArrowLeft, w as ArrowRight, j as Send, e as MessageCircle, C as CircleAlert } from "../_libs/lucide-react.mjs";
import { f as object, d as string } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
import "../_libs/p-retry.mjs";
import "../_libs/retry.mjs";
import "../_libs/google-auth-library.mjs";
import "child_process";
import "querystring";
import "fs";
import "../_libs/gaxios.mjs";
import "https";
import "../_libs/extend.mjs";
import "../_libs/gcp-metadata.mjs";
import "os";
import "../_libs/json-bigint.mjs";
import "../_libs/bignumber.js.mjs";
import "../_libs/google-logging-utils.mjs";
import "events";
import "process";
import "path";
import "../_libs/base64-js.mjs";
import "../_libs/ecdsa-sig-formatter.mjs";
import "../_libs/safe-buffer.mjs";
import "buffer";
import "../_libs/jws.mjs";
import "../_libs/jwa.mjs";
import "../_libs/buffer-equal-constant-time.mjs";
import "fs/promises";
import "node:stream/promises";
import "../_libs/ws.mjs";
import "http";
import "net";
import "tls";
import "url";
import "zlib";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const Input = object({
  briefing_id: string().uuid()
});
const sendBriefingEmails = createServerFn({
  method: "POST"
}).inputValidator((input) => Input.parse(input)).handler(createSsrRpc("0950b9567811d33822a6d68cdb42a67e24a6c66d84e085f282580cea5664330f"));
function whatsappLink(message) {
  const text = encodeURIComponent(
    message ?? "Hello Edmundo, I found your portfolio and I would like to discuss a project."
  );
  return `https://wa.me/${SITE_PHONE_DIGITS}?text=${text}`;
}
function WhatsAppButton({
  message,
  variant = "primary",
  className,
  children
}) {
  const href = whatsappLink(message);
  const base = "inline-flex items-center gap-2 rounded-full text-sm font-medium transition";
  if (variant === "icon") {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "a",
      {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": "Chat on WhatsApp",
        className: clsx(
          "h-10 w-10 grid place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/[0.07] text-emerald-200 hover:border-emerald-300/60 hover:bg-emerald-300/[0.12] transition",
          className
        ),
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageCircle, { size: 15, strokeWidth: 1.8 }, void 0, false, {
          fileName: "/app/applet/src/components/contact/WhatsAppButton.tsx",
          lineNumber: 30,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/contact/WhatsAppButton.tsx",
        lineNumber: 20,
        columnNumber: 7
      },
      this
    );
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: clsx(
        base,
        variant === "primary" ? "bg-emerald-300 text-[#01040A] px-5 py-3 hover:bg-emerald-200" : "border border-emerald-300/30 text-emerald-200 px-4 py-2 hover:border-emerald-300/55 hover:bg-emerald-300/[0.06]",
        className
      ),
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageCircle, { size: 15, strokeWidth: 1.8 }, void 0, false, {
          fileName: "/app/applet/src/components/contact/WhatsAppButton.tsx",
          lineNumber: 47,
          columnNumber: 7
        }, this),
        children ?? "Chat on WhatsApp"
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/contact/WhatsAppButton.tsx",
      lineNumber: 35,
      columnNumber: 5
    },
    this
  );
}
function BookingModal({
  open,
  onClose,
  bookingUrl
}) {
  const [name, setName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [date, setDate] = reactExports.useState("");
  const [time, setTime] = reactExports.useState("");
  const [tz, setTz] = reactExports.useState(
    typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : ""
  );
  const [note, setNote] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!open || !bookingUrl || typeof window === "undefined") return;
    window.open(bookingUrl, "_blank", "noopener,noreferrer");
    onClose();
  }, [bookingUrl, onClose, open]);
  if (!open) return null;
  if (bookingUrl) {
    return null;
  }
  const submit = async (e) => {
    e.preventDefault();
    const parsed = bookingSchema.safeParse({
      name,
      email,
      preferred_date: date,
      preferred_time: time,
      timezone: tz,
      note
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
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "fixed inset-0 z-[90] grid place-items-center bg-[#01040A]/80 backdrop-blur-sm p-4",
      onClick: onClose,
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        motion.div,
        {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          className: "relative w-full max-w-md rounded-2xl border border-white/10 bg-[#030814] p-6 shadow-2xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close",
                className: "absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:text-white",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 14 }, void 0, false, {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 84,
                  columnNumber: 11
                }, this)
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 78,
                columnNumber: 9
              },
              this
            ),
            done ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-center py-6", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto h-12 w-12 rounded-full bg-emerald-300/15 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { className: "text-emerald-200" }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 90,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 89,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl mt-4 text-metal", children: "Request received." }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 92,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-slate-400 mt-2", children: [
                "I'll confirm a slot within 48 hours at ",
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sky-200", children: email }, void 0, false, {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 94,
                  columnNumber: 54
                }, this),
                "."
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 93,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: onClose,
                  className: "mt-6 inline-flex rounded-full bg-white text-[#01040A] px-5 py-2.5 text-sm font-semibold hover:bg-sky-200",
                  children: "Done"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 96,
                  columnNumber: 13
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/contact/BookingModal.tsx",
              lineNumber: 88,
              columnNumber: 11
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit: submit, children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mono text-[10px] tracking-[0.22em] text-sky-300/80", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CalendarDays, { size: 13 }, void 0, false, {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 106,
                  columnNumber: 15
                }, this),
                " SCHEDULE A CALL"
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 105,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl mt-2 text-metal", children: "Book a 30 min call" }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 108,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[12px] text-slate-500 mt-1", children: "Tell me when works for you and I'll confirm." }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 109,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-5 grid gap-3", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    required: true,
                    placeholder: "Your name",
                    className: "adm-field"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                    lineNumber: 114,
                    columnNumber: 15
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    placeholder: "Email",
                    className: "adm-field"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                    lineNumber: 121,
                    columnNumber: 15
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 gap-3", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      type: "date",
                      value: date,
                      onChange: (e) => setDate(e.target.value),
                      required: true,
                      className: "adm-field"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                      lineNumber: 130,
                      columnNumber: 17
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "input",
                    {
                      type: "time",
                      value: time,
                      onChange: (e) => setTime(e.target.value),
                      className: "adm-field"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                      lineNumber: 137,
                      columnNumber: 17
                    },
                    this
                  )
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 129,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    value: tz,
                    onChange: (e) => setTz(e.target.value),
                    placeholder: "Timezone",
                    className: "adm-field"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                    lineNumber: 144,
                    columnNumber: 15
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "textarea",
                  {
                    value: note,
                    onChange: (e) => setNote(e.target.value),
                    rows: 3,
                    placeholder: "Anything I should know? (optional)",
                    className: "adm-field resize-none"
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                    lineNumber: 150,
                    columnNumber: 15
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 113,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  type: "submit",
                  disabled: busy,
                  className: "mt-5 w-full inline-flex justify-center items-center gap-2 rounded-full bg-sky-300 px-5 py-3 text-sm font-semibold text-[#01040A] hover:bg-sky-200 disabled:opacity-60",
                  children: [
                    busy ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 14, className: "animate-spin" }, void 0, false, {
                      fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                      lineNumber: 164,
                      columnNumber: 23
                    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CalendarDays, { size: 14 }, void 0, false, {
                      fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                      lineNumber: 164,
                      columnNumber: 72
                    }, this),
                    "Request booking"
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                  lineNumber: 159,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("style", { children: `
              .adm-field { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 12px; font-size: 13px; color: #f5f8ff; }
              .adm-field::placeholder { color: #64748b; }
              .adm-field:focus { outline: none; border-color: #6ddcff; }
            ` }, void 0, false, {
                fileName: "/app/applet/src/components/contact/BookingModal.tsx",
                lineNumber: 168,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/contact/BookingModal.tsx",
              lineNumber: 104,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/contact/BookingModal.tsx",
          lineNumber: 72,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/contact/BookingModal.tsx",
      lineNumber: 66,
      columnNumber: 5
    },
    this
  );
}
const Route = createLazyFileRoute("/contact")({
  component: ContactPage
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
    cta: "Continue to Project"
  },
  {
    id: 2,
    number: "02",
    label: "PROJECT",
    heading: "What are we creating together?",
    subtext: "Select the discipline, creative focus and urgency level for the rollout.",
    Icon: Briefcase,
    cta: "Continue to Budget"
  },
  {
    id: 3,
    number: "03",
    label: "BUDGET",
    heading: "What's the scale you're working with?",
    subtext: "Establishing scale ensures we align scope, production depth and craft velocity.",
    Icon: Wallet,
    cta: "Continue to Timing"
  },
  {
    id: 4,
    number: "04",
    label: "TIMING",
    heading: "When does this need to happen?",
    subtext: "Key delivery milestones and your preferred communication channel.",
    Icon: CalendarDays,
    cta: "Continue to References"
  },
  {
    id: 5,
    number: "05",
    label: "REFERENCES",
    heading: "Share anything that helps define the direction.",
    subtext: "Describe the vision, upload brand assets or drop links to moodboards.",
    Icon: ImagePlus,
    cta: "Send Project Brief"
  }
];
const EASE_EDITORIAL = [0.16, 1, 0.3, 1];
function ContactPage() {
  const { data: settings } = useSiteSettings();
  const sendEmails = useServerFn(sendBriefingEmails);
  const reducedMotion = useReducedMotion();
  const r = (f, fb) => readSetting(settings, "contact", f, fb);
  const s = (f, fb) => readSetting(settings, "social", f, fb);
  const email = r("email", SITE_EMAIL);
  r("phone", SITE_PHONE);
  const bookingUrl = r("booking_url", "");
  const [step, setStep] = reactExports.useState(1);
  const [direction, setDirection] = reactExports.useState(1);
  const [fullName, setFullName] = reactExports.useState("");
  const [companyName, setCompanyName] = reactExports.useState("");
  const [position, setPosition] = reactExports.useState("");
  const [country, setCountry] = reactExports.useState("");
  const [emailVal, setEmailVal] = reactExports.useState("");
  const [phoneVal, setPhoneVal] = reactExports.useState("");
  const [projectType, setProjectType] = reactExports.useState(PROJECT_TYPES[0]);
  const [urgency, setUrgency] = reactExports.useState("normal");
  const [deadline, setDeadline] = reactExports.useState("");
  const [currency, setCurrency] = reactExports.useState("EUR");
  const [budgetIdx, setBudgetIdx] = reactExports.useState(1);
  const [exactAmount, setExactAmount] = reactExports.useState("");
  const [negotiable, setNegotiable] = reactExports.useState(false);
  const [message, setMessage] = reactExports.useState("");
  const [preferredContact, setPreferredContact] = reactExports.useState(
    ""
  );
  const [files, setFiles] = reactExports.useState([]);
  const [refLinks, setRefLinks] = reactExports.useState([]);
  const [refLinkInput, setRefLinkInput] = reactExports.useState("");
  const [uploading, setUploading] = reactExports.useState(false);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [done, setDone] = reactExports.useState(false);
  const [bookingOpen, setBookingOpen] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const [submissionId, setSubmissionId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    trackEvent({ action: "view", element: "contact" });
  }, []);
  const brackets = CURRENCY_META[currency].brackets;
  const selectedBudget = brackets[budgetIdx] ?? brackets[0];
  const onFiles = async (list) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} reference files allowed`);
      return;
    }
    setUploading(true);
    try {
      const uploads = [];
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
        const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: false });
        if (upErr) {
          toast.error(`${file.name}: ${upErr.message}`);
          continue;
        }
        const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
        const dims = await new Promise((resolve) => {
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
          height: dims.h
        });
      }
      setFiles((f) => [...f, ...uploads]);
      toast.success("Attachments uploaded successfully");
    } finally {
      setUploading(false);
    }
  };
  const removeFile = (i) => setFiles((f) => f.filter((_, j) => j !== i));
  const validateStep = (n) => {
    const e = {};
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
        e.message = "Please share a few more details about your project goals (at least 10 characters)";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const clearFieldError = (key) => {
    if (errors[key]) {
      setErrors((prev2) => {
        const next2 = { ...prev2 };
        delete next2[key];
        return next2;
      });
    }
  };
  const goToStep = (targetStep) => {
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
    setStep((s2) => Math.min(STEPS.length, s2 + 1));
  };
  const prev = () => {
    setDirection(-1);
    setStep((s2) => Math.max(1, s2 - 1));
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
  const removeRefLink = (i) => setRefLinks((l) => l.filter((_, j) => j !== i));
  const onSubmit = async (e) => {
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
      preferred_contact_method: preferredContact || null
    };
    const parsed = briefingSchema.safeParse(rawPayload);
    if (!parsed.success) {
      const errs = {};
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
        Object.entries(parsed.data).filter(([, v]) => v !== void 0)
      );
      const insertRow = {
        ...clean,
        attachments: files,
        reference_links: refLinks,
        source: "website",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : null
      };
      const { data: inserted, error } = await supabase.from("briefing_submissions").insert(insertRow).select("id").single();
      if (error) {
        toast.error(`Submission failed: ${error.message}. Your data is preserved.`);
        setSubmitting(false);
        return;
      }
      setSubmissionId(inserted?.id || null);
      trackEvent({ action: "submit", element: "briefing" });
      if (inserted?.id) {
        sendEmails({ data: { briefing_id: inserted.id } }).catch(() => {
        });
      }
      setDone(true);
      toast.success("Brief received. I'll be in touch within 48h.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  const currentStepData = STEPS[step - 1];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "relative px-4 md:px-8 pt-44 md:pt-48 pb-32 bg-[var(--color-bg)] min-h-screen text-[var(--color-text-primary)]", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-standard)] mx-auto relative z-10", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        motion.div,
        {
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE_EDITORIAL },
          className: "flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase mb-12 border-b border-white/[0.08] pb-6",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-2 h-2 rounded-full bg-sky-400 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                lineNumber: 387,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: r("eyebrow", "Project Briefing Experience") }, void 0, false, {
                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                lineNumber: 388,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/contact.lazy.tsx",
              lineNumber: 386,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: r("status", "Open for 2026 Collaborations") }, void 0, false, {
              fileName: "/app/applet/src/routes/contact.lazy.tsx",
              lineNumber: 390,
              columnNumber: 11
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/contact.lazy.tsx",
          lineNumber: 380,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20 items-start", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "md:col-span-5 space-y-10 md:sticky md:top-28", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              motion.h1,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL },
                className: "display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.96] tracking-[-0.025em] text-white",
                children: [
                  "Let's ",
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "italic text-sky-300 font-normal", children: "collaborate." }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 403,
                    columnNumber: 23
                  }, this)
                ]
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                lineNumber: 397,
                columnNumber: 15
              },
              this
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { duration: 0.8, delay: 0.2 },
                className: "mt-6 text-[15px] md:text-[16px] text-slate-300 leading-relaxed",
                children: r(
                  "subtitle",
                  "Tell me about your project, vision, and timeline. I review every submission personally and respond within 48 hours."
                )
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                lineNumber: 405,
                columnNumber: 15
              },
              this
            )
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/contact.lazy.tsx",
            lineNumber: 396,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.8, delay: 0.3 },
              className: "space-y-3 pt-2",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] tracking-[0.24em] text-slate-400 uppercase mb-3", children: "Direct Channels" }, void 0, false, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 425,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3.5 flex items-center justify-between hover:border-emerald-500/40 transition-colors", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 grid place-items-center shrink-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MessageSquare, { size: 15 }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 433,
                      columnNumber: 21
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 432,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold text-white flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "WhatsApp Direct" }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 437,
                          columnNumber: 23
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300", children: "Immediate" }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 438,
                          columnNumber: 23
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 436,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "Quick voice or chat exchange" }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 442,
                        columnNumber: 21
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 435,
                      columnNumber: 19
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 431,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WhatsAppButton, { variant: "ghost", className: "text-xs py-1.5 px-3", children: "Open Chat" }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 447,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 430,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "a",
                  {
                    href: `mailto:${email}`,
                    onClick: () => trackEvent({ action: "click", element: "email" }),
                    className: "group rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 flex items-center justify-between hover:border-sky-400/40 hover:bg-sky-950/10 transition-all",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 min-w-0", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.04] text-slate-300 group-hover:text-sky-300 group-hover:border-sky-400/40 grid place-items-center shrink-0 transition-colors", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Mail, { size: 15 }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 460,
                          columnNumber: 21
                        }, this) }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 459,
                          columnNumber: 19
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold text-white flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Formal Email" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 464,
                              columnNumber: 23
                            }, this),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300", children: "Formal" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 465,
                              columnNumber: 23
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 463,
                            columnNumber: 21
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-slate-400 truncate mt-0.5", children: email }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 469,
                            columnNumber: 21
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 462,
                          columnNumber: 19
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 458,
                        columnNumber: 17
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] text-sky-300 tracking-wider uppercase shrink-0 font-medium", children: "Compose" }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 472,
                        columnNumber: 17
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 453,
                    columnNumber: 15
                  },
                  this
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      trackEvent({ action: "click", element: "booking-open" });
                      setBookingOpen(true);
                    },
                    className: "w-full group rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 flex items-center justify-between hover:border-sky-400/40 hover:bg-sky-950/10 transition-all text-left",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-8 h-8 rounded-full border border-white/[0.1] bg-white/[0.04] text-slate-300 group-hover:text-sky-300 group-hover:border-sky-400/40 grid place-items-center shrink-0 transition-colors", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CalendarDays, { size: 15 }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 488,
                          columnNumber: 21
                        }, this) }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 487,
                          columnNumber: 19
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xs font-semibold text-white flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Schedule 30-Min Call" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 492,
                              columnNumber: 23
                            }, this),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/[0.08] text-slate-300", children: "Discovery" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 493,
                              columnNumber: 23
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 491,
                            columnNumber: 21
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-slate-400 mt-0.5", children: "Pick a calendar slot" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 497,
                            columnNumber: 21
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 490,
                          columnNumber: 19
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 486,
                        columnNumber: 17
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] text-sky-300 tracking-wider uppercase shrink-0 font-medium", children: "Book" }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 500,
                        columnNumber: 17
                      }, this)
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 478,
                    columnNumber: 15
                  },
                  this
                )
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/routes/contact.lazy.tsx",
              lineNumber: 419,
              columnNumber: 13
            },
            this
          ),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.div,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.8, delay: 0.4 },
              className: "pt-6 border-t border-white/[0.08] space-y-4",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3 text-xs text-slate-400", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MapPin, { size: 15, className: "text-sky-400 shrink-0" }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 514,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: r("location", 'Magoanine "C", Maputo · Mozambique') }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 515,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 513,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2.5", children: [
                  { icon: Instagram, label: "Instagram", href: s("instagram", "#") },
                  { icon: Linkedin, label: "LinkedIn", href: LINKEDIN_URL },
                  { icon: Facebook, label: "Facebook", href: s("facebook", "#") }
                ].map(({ icon: Icon, label, href }) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "a",
                  {
                    href,
                    target: "_blank",
                    rel: "noreferrer",
                    "aria-label": label,
                    className: "h-9 w-9 rounded-full border border-white/[0.08] bg-white/[0.02] grid place-items-center text-slate-400 hover:text-white hover:border-sky-400/40 hover:bg-sky-950/20 transition-all",
                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Icon, { size: 15 }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 532,
                      columnNumber: 21
                    }, this)
                  },
                  label,
                  false,
                  {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 524,
                    columnNumber: 19
                  },
                  this
                )) }, void 0, false, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 518,
                  columnNumber: 15
                }, this)
              ]
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/routes/contact.lazy.tsx",
              lineNumber: 507,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/contact.lazy.tsx",
          lineNumber: 395,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.div,
          {
            initial: { opacity: 0, y: 30 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL },
            className: "md:col-span-7 relative",
            children: done ? (
              /* REAL SUCCESS STATE */
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.5, ease: EASE_EDITORIAL },
                  className: "rounded-2xl border border-sky-400/30 bg-gradient-to-b from-[#061224] to-[#02050c] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-center relative overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mx-auto h-16 w-16 rounded-full bg-sky-400/20 border border-sky-400/40 grid place-items-center text-sky-300 shadow-[0_0_30px_rgba(56,189,248,0.3)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { size: 28, strokeWidth: 2.5 }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 555,
                      columnNumber: 19
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 554,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.28em] text-sky-400 uppercase mt-6", children: "Brief Submitted Successfully" }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 558,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "display text-3xl md:text-4xl text-white mt-2 font-medium", children: [
                      "Brief received, ",
                      fullName.split(" ")[0] || "there",
                      "."
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 562,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[15px] text-slate-300 mt-4 max-w-md mx-auto leading-relaxed", children: [
                      "Thank you for submitting your project brief. A confirmation copy has been queued for",
                      " ",
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-white font-medium underline underline-offset-4 decoration-sky-400/60", children: emailVal }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 569,
                        columnNumber: 19
                      }, this),
                      "."
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 566,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-8 p-6 rounded-xl border border-white/[0.08] bg-black/40 text-left space-y-3 max-w-lg mx-auto", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-xs font-semibold text-sky-300", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { size: 14 }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 578,
                          columnNumber: 21
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "What happens next:" }, void 0, false, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 579,
                          columnNumber: 21
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 577,
                        columnNumber: 19
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "text-xs text-slate-300 space-y-2 leading-relaxed", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start gap-2", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 583,
                            columnNumber: 23
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: "Review (24-48h):" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 585,
                              columnNumber: 25
                            }, this),
                            " I personally review your project scope, timing, and reference materials."
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 584,
                            columnNumber: 23
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 582,
                          columnNumber: 21
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start gap-2", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 590,
                            columnNumber: 23
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("strong", { children: "Discovery Response:" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 592,
                              columnNumber: 25
                            }, this),
                            " You will receive a structured response with questions or proposed next steps."
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 591,
                            columnNumber: 23
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 589,
                          columnNumber: 21
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 581,
                        columnNumber: 19
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 576,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 flex flex-wrap items-center justify-center gap-4", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "button",
                        {
                          type: "button",
                          onClick: () => setBookingOpen(true),
                          className: "inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-semibold hover:bg-sky-300 transition-colors",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CalendarDays, { size: 14 }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 606,
                              columnNumber: 21
                            }, this),
                            " Book a follow-up call"
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 601,
                          columnNumber: 19
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(WhatsAppButton, { variant: "ghost", children: "Chat on WhatsApp" }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 609,
                        columnNumber: 19
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 600,
                      columnNumber: 17
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-10 pt-6 border-t border-white/[0.08]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setDone(false);
                          setStep(1);
                          setFullName("");
                          setEmailVal("");
                          setMessage("");
                          setFiles([]);
                          setRefLinks([]);
                        },
                        className: "mono text-[11px] text-slate-500 hover:text-sky-300 uppercase tracking-[0.15em] transition-colors",
                        children: "Submit another project brief"
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 613,
                        columnNumber: 19
                      },
                      this
                    ) }, void 0, false, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 612,
                      columnNumber: 17
                    }, this)
                  ]
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 548,
                  columnNumber: 15
                },
                this
              )
            ) : (
              /* CONVERSATIONAL FORM WRAPPER */
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "rounded-2xl border border-white/[0.1] bg-[#030712] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mb-8 pb-6 border-b border-white/[0.08]", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-4", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.24em] text-sky-400 uppercase font-semibold", children: [
                        "STEP ",
                        step,
                        " OF ",
                        STEPS.length
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 638,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-slate-600", children: "·" }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 641,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.2em] text-slate-300 uppercase", children: currentStepData.label }, void 0, false, {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 642,
                        columnNumber: 23
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 637,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.15em] text-slate-500 uppercase", children: [
                      Math.round(step / STEPS.length * 100),
                      "% Complete"
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 647,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 636,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden mb-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      animate: {
                        scaleX: step / STEPS.length
                      },
                      transition: {
                        duration: 0.35,
                        ease: EASE_EDITORIAL
                      },
                      style: { transformOrigin: "left" },
                      className: "h-full bg-gradient-to-r from-sky-400 to-cyan-300"
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 654,
                      columnNumber: 21
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 653,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-5 gap-2", children: STEPS.map((sItem) => {
                    const isActive = step === sItem.id;
                    const isPast = step > sItem.id;
                    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: () => goToStep(sItem.id),
                        className: "text-left group focus:outline-none",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            animate: {
                              opacity: isActive ? 1 : isPast ? 0.75 : 0.35,
                              scale: isActive ? 1 : 0.96
                            },
                            transition: {
                              duration: 0.3,
                              ease: EASE_EDITORIAL
                            },
                            className: `p-2.5 rounded-lg border transition-all duration-300 ${isActive ? "border-sky-400/40 bg-sky-950/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]" : isPast ? "border-white/[0.1] bg-white/[0.02]" : "border-transparent bg-transparent"}`,
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-1.5", children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "span",
                                  {
                                    className: `mono text-[10px] font-semibold tracking-wider ${isActive ? "text-sky-300" : isPast ? "text-slate-300" : "text-slate-500"}`,
                                    children: sItem.number
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 698,
                                    columnNumber: 31
                                  },
                                  this
                                ),
                                isPast && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { size: 10, className: "text-emerald-400" }, void 0, false, {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 709,
                                  columnNumber: 42
                                }, this)
                              ] }, void 0, true, {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 697,
                                columnNumber: 29
                              }, this),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: `mono text-[9px] tracking-[0.14em] uppercase truncate mt-1 ${isActive ? "text-white font-semibold" : "text-slate-400"}`,
                                  children: sItem.label
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 711,
                                  columnNumber: 29
                                },
                                this
                              )
                            ]
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 680,
                            columnNumber: 27
                          },
                          this
                        )
                      },
                      sItem.id,
                      false,
                      {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 674,
                        columnNumber: 25
                      },
                      this
                    );
                  }) }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 668,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 634,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mb-8", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "display text-2xl sm:text-3xl text-white font-medium tracking-tight", children: currentStepData.heading }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 727,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed", children: currentStepData.subtext }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 730,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 726,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("form", { onSubmit, noValidate: true, children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatePresence, { mode: "wait", custom: direction, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      custom: direction,
                      initial: reducedMotion ? { opacity: 0 } : {
                        opacity: 0,
                        x: direction > 0 ? 24 : -24
                      },
                      animate: {
                        opacity: 1,
                        x: 0
                      },
                      exit: reducedMotion ? { opacity: 0 } : {
                        opacity: 0,
                        x: direction > 0 ? -24 : 24
                      },
                      transition: {
                        duration: 0.38,
                        ease: EASE_EDITORIAL
                      },
                      children: [
                        step === 1 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Your Name",
                              required: true,
                              error: errors.full_name,
                              hint: "Primary contact",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "input",
                                {
                                  value: fullName,
                                  onChange: (e) => {
                                    setFullName(e.target.value);
                                    clearFieldError("full_name");
                                  },
                                  className: "field",
                                  placeholder: "e.g. Maya Lin",
                                  autoFocus: true
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 775,
                                  columnNumber: 29
                                },
                                this
                              )
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 769,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Email Address",
                              required: true,
                              error: errors.email,
                              hint: "Where I'll reply",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "input",
                                {
                                  type: "email",
                                  value: emailVal,
                                  onChange: (e) => {
                                    setEmailVal(e.target.value);
                                    clearFieldError("email");
                                  },
                                  className: "field",
                                  placeholder: "maya@studio.com"
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 793,
                                  columnNumber: 29
                                },
                                this
                              )
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 787,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Company / Brand", hint: "Optional", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              value: companyName,
                              onChange: (e) => setCompanyName(e.target.value),
                              className: "field",
                              placeholder: "e.g. Acme Studio"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 806,
                              columnNumber: 29
                            },
                            this
                          ) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 805,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Role / Title", hint: "Optional", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              value: position,
                              onChange: (e) => setPosition(e.target.value),
                              className: "field",
                              placeholder: "e.g. Founder, Marketing Director"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 815,
                              columnNumber: 29
                            },
                            this
                          ) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 814,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Country / City", hint: "Optional", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              value: country,
                              onChange: (e) => setCountry(e.target.value),
                              className: "field",
                              placeholder: "e.g. Maputo, Lisbon, London"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 824,
                              columnNumber: 29
                            },
                            this
                          ) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 823,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Phone / WhatsApp", hint: "Optional", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              value: phoneVal,
                              onChange: (e) => setPhoneVal(e.target.value),
                              className: "field",
                              placeholder: "e.g. +258 84 000 0000"
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 833,
                              columnNumber: 29
                            },
                            this
                          ) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 832,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 768,
                          columnNumber: 25
                        }, this),
                        step === 2 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-8", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Project Discipline",
                              required: true,
                              error: errors.project_type,
                              hint: "Select main focus",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1", children: PROJECT_TYPES.map((p) => {
                                const isSel = projectType === p;
                                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => {
                                      setProjectType(p);
                                      clearFieldError("project_type");
                                    },
                                    className: `px-3.5 py-3 rounded-xl text-xs text-left transition-all duration-200 border ${isSel ? "bg-sky-950/40 border-sky-400/60 text-white font-medium shadow-[0_0_15px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/20" : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2] hover:bg-white/[0.04]"}`,
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "truncate", children: p }, void 0, false, {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 870,
                                        columnNumber: 39
                                      }, this),
                                      isSel && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 ml-1.5" }, void 0, false, {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 872,
                                        columnNumber: 41
                                      }, this)
                                    ] }, void 0, true, {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 869,
                                      columnNumber: 37
                                    }, this)
                                  },
                                  p,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 856,
                                    columnNumber: 35
                                  },
                                  this
                                );
                              }) }, void 0, false, {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 852,
                                columnNumber: 29
                              }, this)
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 846,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Project Urgency", required: true, hint: "Rollout timeline pressure", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1", children: URGENCY.map((u) => {
                            const isSel = urgency === u;
                            const meta = URGENCY_META[u];
                            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => setUrgency(u),
                                className: `px-3.5 py-3 rounded-xl text-xs text-center transition-all duration-200 border capitalize ${isSel ? "bg-white text-black font-semibold border-white shadow-lg" : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"}`,
                                children: meta.label
                              },
                              u,
                              false,
                              {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 887,
                                columnNumber: 35
                              },
                              this
                            );
                          }) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 882,
                            columnNumber: 29
                          }, this) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 881,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 845,
                          columnNumber: 25
                        }, this),
                        step === 3 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-8", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Currency", required: true, hint: "Preferred billing currency", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 flex-wrap pt-1", children: CURRENCIES.map((c) => {
                            const isSel = currency === c;
                            const meta = CURRENCY_META[c];
                            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                type: "button",
                                onClick: () => {
                                  setCurrency(c);
                                  setBudgetIdx(1);
                                },
                                className: `px-4 py-2.5 rounded-xl text-xs border transition-all duration-200 ${isSel ? "bg-sky-400 text-black font-bold border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]" : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"}`,
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-semibold", children: meta.symbol }, void 0, false, {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 928,
                                    columnNumber: 37
                                  }, this),
                                  " ",
                                  meta.label
                                ]
                              },
                              c,
                              true,
                              {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 915,
                                columnNumber: 35
                              },
                              this
                            );
                          }) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 910,
                            columnNumber: 29
                          }, this) }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 909,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Estimated Scope Bracket",
                              hint: "Select the tier that best fits",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1", children: brackets.map((b, i) => {
                                const isSel = budgetIdx === i;
                                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setBudgetIdx(i),
                                    className: `px-4 py-3.5 rounded-xl text-xs text-center border transition-all duration-200 ${isSel ? "bg-white text-black font-bold border-white shadow-lg" : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"}`,
                                    children: b.label
                                  },
                                  b.label,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 944,
                                    columnNumber: 35
                                  },
                                  this
                                );
                              }) }, void 0, false, {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 940,
                                columnNumber: 29
                              }, this)
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 936,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-6 items-end pt-2", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Field, { label: "Or an Exact Figure", hint: "Optional target amount", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "input",
                              {
                                value: exactAmount,
                                onChange: (e) => setExactAmount(e.target.value),
                                className: "field",
                                placeholder: `e.g. ${CURRENCY_META[currency].symbol} 12,000`
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 963,
                                columnNumber: 31
                              },
                              this
                            ) }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 962,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "flex items-center gap-3 text-xs text-slate-300 cursor-pointer h-12 pb-1 group", children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: negotiable,
                                  onChange: (e) => setNegotiable(e.target.checked),
                                  className: "w-4 h-4 rounded border-white/20 bg-white/[0.05] text-sky-400 focus:ring-sky-400 focus:ring-offset-0 focus:ring-1 transition-colors"
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 972,
                                  columnNumber: 31
                                },
                                this
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "group-hover:text-white transition-colors", children: "Budget is negotiable based on scope & deliverables" }, void 0, false, {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 978,
                                columnNumber: 31
                              }, this)
                            ] }, void 0, true, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 971,
                              columnNumber: 29
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 961,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 908,
                          columnNumber: 25
                        }, this),
                        step === 4 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-8", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Target Launch / Delivery Date",
                              hint: "Optional project deadline",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "input",
                                {
                                  type: "date",
                                  value: deadline,
                                  onChange: (e) => setDeadline(e.target.value),
                                  className: "field max-w-sm"
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 993,
                                  columnNumber: 29
                                },
                                this
                              )
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 989,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Preferred Contact Channel",
                              hint: "How would you like to receive the proposal?",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1", children: CONTACT_METHODS.map((c) => {
                                const isSel = preferredContact === c;
                                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    type: "button",
                                    onClick: () => setPreferredContact(isSel ? "" : c),
                                    className: `px-4 py-3 rounded-xl text-xs text-center border transition-all duration-200 capitalize ${isSel ? "bg-sky-950/40 border-sky-400 text-sky-200 font-semibold ring-1 ring-sky-400/30" : "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:border-white/[0.2]"}`,
                                    children: c
                                  },
                                  c,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 1009,
                                    columnNumber: 35
                                  },
                                  this
                                );
                              }) }, void 0, false, {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 1005,
                                columnNumber: 29
                              }, this)
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 1001,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-start gap-3", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { size: 16, className: "text-sky-400 shrink-0 mt-0.5" }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 1027,
                              columnNumber: 29
                            }, this),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs text-slate-400 leading-relaxed", children: "All briefings and shared information are strictly confidential and protected under standard studio NDA standards." }, void 0, false, {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 1028,
                              columnNumber: 29
                            }, this)
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1026,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 988,
                          columnNumber: 25
                        }, this),
                        step === 5 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-8", children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Field,
                            {
                              label: "Project Description & Vision",
                              required: true,
                              error: errors.message,
                              hint: "The challenge, goals and deliverables",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "textarea",
                                {
                                  value: message,
                                  onChange: (e) => {
                                    setMessage(e.target.value);
                                    clearFieldError("message");
                                  },
                                  rows: 5,
                                  className: "field resize-none leading-relaxed",
                                  placeholder: "Tell me about the brand context, the creative ambition, deliverables expected, and any specific aesthetic benchmarks…",
                                  autoFocus: true
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                  lineNumber: 1045,
                                  columnNumber: 29
                                },
                                this
                              )
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                              lineNumber: 1039,
                              columnNumber: 27
                            },
                            this
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-6 pt-2", children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field,
                              {
                                label: `Visual Attachments (${files.length}/${MAX_FILES})`,
                                hint: "Max 8 MB images",
                                children: [
                                  files.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-3 gap-2 mb-3", children: files.map((f, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "relative group rounded-lg overflow-hidden border border-white/[0.1] bg-[#070e1c] aspect-square",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "img",
                                          {
                                            src: f.url,
                                            alt: f.name,
                                            className: "absolute inset-0 h-full w-full object-cover"
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                            lineNumber: 1071,
                                            columnNumber: 39
                                          },
                                          this
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "button",
                                          {
                                            type: "button",
                                            onClick: () => removeFile(i),
                                            className: "absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity",
                                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 12 }, void 0, false, {
                                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                              lineNumber: 1081,
                                              columnNumber: 41
                                            }, this)
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                            lineNumber: 1076,
                                            columnNumber: 39
                                          },
                                          this
                                        )
                                      ]
                                    },
                                    f.url,
                                    true,
                                    {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 1067,
                                      columnNumber: 37
                                    },
                                    this
                                  )) }, void 0, false, {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 1065,
                                    columnNumber: 33
                                  }, this),
                                  files.length < MAX_FILES && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "flex flex-col items-center justify-center gap-2 text-xs border border-dashed border-white/[0.15] hover:border-sky-400/60 text-slate-400 hover:text-white bg-white/[0.02] hover:bg-sky-950/10 rounded-xl px-4 py-6 cursor-pointer transition-all duration-300 group text-center", children: [
                                    uploading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 18, className: "animate-spin text-sky-400" }, void 0, false, {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 1091,
                                      columnNumber: 37
                                    }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Paperclip,
                                      {
                                        size: 18,
                                        className: "text-slate-400 group-hover:text-sky-300 transition-colors"
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 1093,
                                        columnNumber: 37
                                      },
                                      this
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: uploading ? "Uploading..." : "Upload images / brand assets" }, void 0, false, {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 1098,
                                      columnNumber: 35
                                    }, this),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] text-slate-500", children: "PNG, JPG, WEBP up to 8MB" }, void 0, false, {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 1101,
                                      columnNumber: 35
                                    }, this),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "input",
                                      {
                                        type: "file",
                                        accept: "image/*",
                                        multiple: true,
                                        className: "hidden",
                                        onChange: (e) => {
                                          onFiles(e.target.files);
                                          e.target.value = "";
                                        }
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 1104,
                                        columnNumber: 35
                                      },
                                      this
                                    )
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 1089,
                                    columnNumber: 33
                                  }, this)
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 1060,
                                columnNumber: 29
                              },
                              this
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field,
                              {
                                label: "Moodboards / Reference URLs",
                                hint: "Behance, Figma, Drive, Pinterest",
                                children: [
                                  refLinks.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "mb-3 space-y-2", children: refLinks.map((l, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "li",
                                    {
                                      className: "flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[9px] tracking-wider text-sky-400 uppercase shrink-0", children: "LINK" }, void 0, false, {
                                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                          lineNumber: 1130,
                                          columnNumber: 39
                                        }, this),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "a",
                                          {
                                            href: l.url,
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "truncate text-slate-200 hover:text-sky-300 transition-colors",
                                            children: l.url
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                            lineNumber: 1133,
                                            columnNumber: 39
                                          },
                                          this
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "button",
                                          {
                                            type: "button",
                                            onClick: () => removeRefLink(i),
                                            className: "ml-auto text-slate-500 hover:text-white transition-colors",
                                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 12 }, void 0, false, {
                                              fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                              lineNumber: 1146,
                                              columnNumber: 41
                                            }, this)
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                            lineNumber: 1141,
                                            columnNumber: 39
                                          },
                                          this
                                        )
                                      ]
                                    },
                                    l.url,
                                    true,
                                    {
                                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                      lineNumber: 1126,
                                      columnNumber: 37
                                    },
                                    this
                                  )) }, void 0, false, {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 1124,
                                    columnNumber: 33
                                  }, this),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex gap-2", children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "input",
                                      {
                                        value: refLinkInput,
                                        onChange: (e) => setRefLinkInput(e.target.value),
                                        onKeyDown: (e) => {
                                          if (e.key === "Enter") {
                                            e.preventDefault();
                                            addRefLink();
                                          }
                                        },
                                        placeholder: "https://behance.net/...",
                                        className: "field"
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 1154,
                                        columnNumber: 33
                                      },
                                      this
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "button",
                                      {
                                        type: "button",
                                        onClick: addRefLink,
                                        className: "shrink-0 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 text-xs font-semibold text-white hover:border-sky-400 hover:bg-sky-950/20 transition-all",
                                        children: "Add"
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                        lineNumber: 1166,
                                        columnNumber: 33
                                      },
                                      this
                                    )
                                  ] }, void 0, true, {
                                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                    lineNumber: 1153,
                                    columnNumber: 31
                                  }, this)
                                ]
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                                lineNumber: 1119,
                                columnNumber: 29
                              },
                              this
                            )
                          ] }, void 0, true, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1058,
                            columnNumber: 27
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/routes/contact.lazy.tsx",
                          lineNumber: 1038,
                          columnNumber: 25
                        }, this)
                      ]
                    },
                    step,
                    true,
                    {
                      fileName: "/app/applet/src/routes/contact.lazy.tsx",
                      lineNumber: 738,
                      columnNumber: 21
                    },
                    this
                  ) }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 737,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-12 flex items-center justify-between gap-4 pt-8 border-t border-white/[0.08]", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        type: "button",
                        onClick: prev,
                        disabled: step === 1,
                        className: "inline-flex items-center gap-2 text-xs md:text-sm font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { size: 16 }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1189,
                            columnNumber: 23
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Back" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1190,
                            columnNumber: 23
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 1183,
                        columnNumber: 21
                      },
                      this
                    ),
                    step < STEPS.length ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      ShinyButton,
                      {
                        onClick: next,
                        type: "button",
                        className: "px-7 py-3.5 text-xs sm:text-sm font-semibold text-white",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: currentStepData.cta }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1199,
                            columnNumber: 25
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { size: 15 }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1200,
                            columnNumber: 25
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 1194,
                        columnNumber: 23
                      },
                      this
                    ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      ShinyButton,
                      {
                        type: "submit",
                        disabled: submitting || uploading,
                        className: "px-8 py-3.5 text-xs sm:text-sm font-semibold text-white disabled:opacity-60",
                        children: [
                          submitting ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 16, className: "animate-spin" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1209,
                            columnNumber: 27
                          }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Send, { size: 15 }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1211,
                            columnNumber: 27
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: submitting ? "Transmitting Brief..." : "Send Project Brief" }, void 0, false, {
                            fileName: "/app/applet/src/routes/contact.lazy.tsx",
                            lineNumber: 1213,
                            columnNumber: 25
                          }, this)
                        ]
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/contact.lazy.tsx",
                        lineNumber: 1203,
                        columnNumber: 23
                      },
                      this
                    )
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 1182,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("style", { children: `
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
                  ` }, void 0, false, {
                    fileName: "/app/applet/src/routes/contact.lazy.tsx",
                    lineNumber: 1219,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/contact.lazy.tsx",
                  lineNumber: 736,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/contact.lazy.tsx",
                lineNumber: 632,
                columnNumber: 15
              }, this)
            )
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/contact.lazy.tsx",
            lineNumber: 540,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/contact.lazy.tsx",
        lineNumber: 393,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/contact.lazy.tsx",
      lineNumber: 378,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      BookingModal,
      {
        open: bookingOpen,
        onClose: () => setBookingOpen(false),
        bookingUrl: bookingUrl || void 0
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/routes/contact.lazy.tsx",
        lineNumber: 1250,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/contact.lazy.tsx",
    lineNumber: 377,
    columnNumber: 5
  }, this);
}
function Field({
  label,
  required,
  hint,
  error,
  className = "",
  children
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: `block ${className}`, children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.2em] uppercase text-slate-400 flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: label }, void 0, false, {
          fileName: "/app/applet/src/routes/contact.lazy.tsx",
          lineNumber: 1278,
          columnNumber: 11
        }, this),
        required && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sky-400 font-bold", children: "*" }, void 0, false, {
          fileName: "/app/applet/src/routes/contact.lazy.tsx",
          lineNumber: 1279,
          columnNumber: 24
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/contact.lazy.tsx",
        lineNumber: 1277,
        columnNumber: 9
      }, this),
      hint && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[10px] text-slate-400 normal-case tracking-normal font-normal", children: hint }, void 0, false, {
        fileName: "/app/applet/src/routes/contact.lazy.tsx",
        lineNumber: 1282,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/contact.lazy.tsx",
      lineNumber: 1276,
      columnNumber: 7
    }, this),
    children,
    error && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mt-1.5 inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleAlert, { size: 13, className: "shrink-0" }, void 0, false, {
        fileName: "/app/applet/src/routes/contact.lazy.tsx",
        lineNumber: 1290,
        columnNumber: 11
      }, this),
      " ",
      error
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/contact.lazy.tsx",
      lineNumber: 1289,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/contact.lazy.tsx",
    lineNumber: 1275,
    columnNumber: 5
  }, this);
}
export {
  Route
};
