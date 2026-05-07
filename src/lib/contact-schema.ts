import { z } from "zod";

// ---------- Currencies ----------
export const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; label: string; brackets: { value: number; label: string }[] }
> = {
  EUR: {
    symbol: "€", label: "Euro",
    brackets: [
      { value: 3000, label: "< €5K" },
      { value: 10000, label: "€5K - €15K" },
      { value: 25000, label: "€15K - €40K" },
      { value: 60000, label: "€40K +" },
    ],
  },
  USD: {
    symbol: "$", label: "Dollar",
    brackets: [
      { value: 3500, label: "< $5K" },
      { value: 11000, label: "$5K - $17K" },
      { value: 28000, label: "$17K - $45K" },
      { value: 65000, label: "$45K +" },
    ],
  },
  MZN: {
    symbol: "MT", label: "Metical",
    brackets: [
      { value: 200000, label: "< 350k MT" },
      { value: 700000, label: "350k - 1M MT" },
      { value: 1700000, label: "1M - 2.5M MT" },
      { value: 3500000, label: "2.5M MT +" },
    ],
  },
  GBP: {
    symbol: "£", label: "Pounds",
    brackets: [
      { value: 2500, label: "< £4K" },
      { value: 9000, label: "£4K - £13K" },
      { value: 22000, label: "£13K - £35K" },
      { value: 50000, label: "£35K +" },
    ],
  },
  BRL: {
    symbol: "R$", label: "Reais",
    brackets: [
      { value: 15000, label: "< R$25K" },
      { value: 60000, label: "R$25K - R$90K" },
      { value: 150000, label: "R$90K - R$220K" },
      { value: 350000, label: "R$220K +" },
    ],
  },
};

// ---------- Project types & urgency ----------
export const PROJECT_TYPES = [
  "Brand Identity",
  "Art Direction",
  "Campaign Design",
  "Social Media",
  "Motion Content",
  "Web Design",
  "Image Manipulation",
  "Video Direction",
  "Creative Strategy",
  "Content Creation",
  "Product Launch Design",
  "Visual Systems",
] as const;

export const URGENCY = ["low", "normal", "high", "urgent"] as const;
export type Urgency = (typeof URGENCY)[number];

export const URGENCY_META: Record<Urgency, { label: string; tone: string }> = {
  low: { label: "Low - exploring", tone: "border-slate-400/30 text-slate-300" },
  normal: { label: "Normal", tone: "border-sky-300/35 text-sky-100" },
  high: { label: "High", tone: "border-amber-300/40 text-amber-200" },
  urgent: { label: "Urgent", tone: "border-rose-300/40 text-rose-200" },
};

export const CONTACT_METHODS = ["email", "phone", "whatsapp", "linkedin"] as const;
export type ContactMethod = (typeof CONTACT_METHODS)[number];

// ---------- Briefing schema (the new smart form) ----------
// Helpers - keep optional fields safe for the database (numerics + dates).
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().trim().max(200).nullable().optional(),
);

const optionalNumeric = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^0-9.\-]/g, "");
    if (!cleaned) return null;
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}, z.number().nullable().optional());

const optionalDate = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date").nullable().optional(),
);

const optionalUuid = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? null : v),
  z.string().uuid("Invalid id").nullable().optional(),
);

export const briefingSchema = z.object({
  full_name: z.string().trim().min(1, "Your name is required").max(120),
  company_name: optionalString,
  position: optionalString,
  country: optionalString,
  email: z.string().trim().email("Invalid email").max(200),
  phone: optionalString,
  project_type: z.string().trim().min(1, "Pick a project type").max(80),
  urgency: z.enum(URGENCY),
  deadline: optionalDate,
  currency: z.enum(CURRENCIES),
  budget_range: optionalString,
  exact_amount: optionalNumeric,
  negotiable: z.boolean().optional().default(false),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(4000),
  preferred_contact_method: z.preprocess(
    (v) => (v === "" || v === undefined ? null : v),
    z.enum(CONTACT_METHODS).nullable().optional(),
  ),
  reference_project_id: optionalUuid,
});

export type BriefingInput = z.infer<typeof briefingSchema>;

export type BriefingAttachment = {
  url: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
};

// ---------- Booking ----------
export const bookingSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(200),
  preferred_date: z.string().trim().min(1, "Pick a date"),
  preferred_time: z.string().trim().max(20).optional().or(z.literal("")),
  timezone: z.string().trim().max(60).optional().or(z.literal("")),
  note: z.string().trim().max(800).optional().or(z.literal("")),
});
export type BookingInput = z.infer<typeof bookingSchema>;

// ---------- Newsletter ----------
export const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email").max(200),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  source: z.enum(["contact-page", "footer", "briefing-confirmation"]).default("contact-page"),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ---------- Legacy contact_requests (kept for the existing inbox) ----------
// The old form schema is no longer used by the public site; it's preserved
// here so the admin can still display historical records without changes.
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  project_type: z.string().trim().min(1).max(80),
  budget_amount: z.number().nonnegative().nullable().optional(),
  budget_currency: z.enum(CURRENCIES),
  budget_label: z.string().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
});
export type ContactInput = z.infer<typeof contactSchema>;
