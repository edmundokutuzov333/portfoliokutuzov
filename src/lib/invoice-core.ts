/**
 * Invoice core — shared, isomorphic money & totals logic.
 * Pure functions only: safe to import from browser components AND server code.
 * The server is always the source of truth; the client uses this only to mirror
 * the exact same arithmetic so the UI never disagrees with the generated PDF.
 */

export const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL", "ZAR"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€",
  USD: "$",
  MZN: "MT ",
  GBP: "£",
  BRL: "R$",
  ZAR: "R ",
};

export const INVOICE_STATUSES = [
  "draft",
  "generated",
  "sent",
  "viewed",
  "verifying",
  "paid",
  "overdue",
  "void",
] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const UNITS = ["un", "project", "day", "hour", "month", "licence"] as const;

export type LineItem = {
  id?: string;
  description: string;
  detail?: string | null;
  qty: number;
  unit: string;
  unit_price: number;
  discount_pct: number;
  sort_order?: number;
};

export type TotalsInput = {
  items: LineItem[];
  discount_pct?: number;
  tax_pct?: number;
  deposit_pct?: number;
};

export type Totals = {
  lines: Array<LineItem & { net: number }>;
  subtotal: number;
  discount_amount: number;
  taxable: number;
  tax_amount: number;
  total: number;
  deposit_amount: number;
  balance: number;
};

/** Round to cents, immune to float drift (0.1 + 0.2 style artefacts). */
export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

const num = (v: unknown, fallback = 0): number => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const clampPct = (v: unknown): number => Math.min(100, Math.max(0, num(v)));

export function lineNet(item: LineItem): number {
  const gross = num(item.qty, 0) * num(item.unit_price, 0);
  return round2(gross * (1 - clampPct(item.discount_pct) / 100));
}

export function computeTotals(input: TotalsInput): Totals {
  const lines = (input.items ?? []).map((i) => ({ ...i, net: lineNet(i) }));
  const subtotal = round2(lines.reduce((acc, l) => acc + l.net, 0));
  const discount_amount = round2((subtotal * clampPct(input.discount_pct)) / 100);
  const taxable = round2(subtotal - discount_amount);
  const tax_amount = round2((taxable * clampPct(input.tax_pct)) / 100);
  const total = round2(taxable + tax_amount);
  const deposit_amount = round2((total * clampPct(input.deposit_pct)) / 100);
  return {
    lines,
    subtotal,
    discount_amount,
    taxable,
    tax_amount,
    total,
    deposit_amount,
    balance: round2(total - deposit_amount),
  };
}

export function money(amount: number | null | undefined, currency?: string | null): string {
  if (amount == null || !Number.isFinite(Number(amount))) return "—";
  const value = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY_SYMBOL[(currency ?? "").toUpperCase()] ?? ""}${value}`;
}

/** Whole days until (positive) or since (negative) the due date, UTC-safe. */
export function daysUntil(dueDate?: string | null): number | null {
  if (!dueDate) return null;
  const due = Date.parse(`${dueDate}T00:00:00Z`);
  if (Number.isNaN(due)) return null;
  const today = new Date();
  const startOfToday = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.round((due - startOfToday) / 86_400_000);
}

export function isOverdue(status?: string | null, dueDate?: string | null): boolean {
  if (!dueDate) return false;
  if (status === "paid" || status === "void" || status === "draft") return false;
  const d = daysUntil(dueDate);
  return d != null && d < 0;
}

/** Human status label used across admin, email and client portal. */
export const STATUS_LABEL: Record<string, string> = {
  draft: "Draft",
  generated: "Ready to send",
  sent: "Awaiting payment",
  viewed: "Viewed by client",
  verifying: "Payment in verification",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
};

export const PRESET_TERMS: Array<{ id: string; label: string; days: number | null; deposit: number; text: string }> = [
  {
    id: "deposit50",
    label: "50% upfront",
    days: 7,
    deposit: 50,
    text: "50% deposit to confirm the booking, remaining 50% on final delivery.",
  },
  {
    id: "net15",
    label: "Net 15",
    days: 15,
    deposit: 0,
    text: "Full payment due within 15 days of the invoice date.",
  },
  {
    id: "net30",
    label: "Net 30",
    days: 30,
    deposit: 0,
    text: "Full payment due within 30 days of the invoice date.",
  },
  {
    id: "onreceipt",
    label: "Due on receipt",
    days: 0,
    deposit: 100,
    text: "Payment due on receipt. Production starts once funds are confirmed.",
  },
];

export function addDaysIso(days: number, from = new Date()): string {
  const d = new Date(from.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
