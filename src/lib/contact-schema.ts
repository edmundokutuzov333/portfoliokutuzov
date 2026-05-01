import { z } from "zod";

export const CURRENCIES = ["EUR", "USD", "MZN"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const CURRENCY_META: Record<
  Currency,
  { symbol: string; brackets: { value: number; label: string }[] }
> = {
  EUR: {
    symbol: "€",
    brackets: [
      { value: 3000, label: "< €5K" },
      { value: 10000, label: "€5K - €15K" },
      { value: 25000, label: "€15K - €40K" },
      { value: 60000, label: "€40K +" },
    ],
  },
  USD: {
    symbol: "$",
    brackets: [
      { value: 3500, label: "< $5K" },
      { value: 11000, label: "$5K - $17K" },
      { value: 28000, label: "$17K - $45K" },
      { value: 65000, label: "$45K +" },
    ],
  },
  MZN: {
    symbol: "MT",
    brackets: [
      { value: 200000, label: "< 350k MT" },
      { value: 700000, label: "350k - 1M MT" },
      { value: 1700000, label: "1M - 2.5M MT" },
      { value: 3500000, label: "2.5M MT +" },
    ],
  },
};

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Invalid email").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  project_type: z.string().trim().min(1, "Pick a project type").max(80),
  budget_amount: z.number().nonnegative().nullable().optional(),
  budget_currency: z.enum(CURRENCIES),
  budget_label: z.string().max(60).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell me a bit more (10+ chars)").max(4000),
});

export type ContactInput = z.infer<typeof contactSchema>;
