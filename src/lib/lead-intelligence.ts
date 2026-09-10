export interface LeadSignalInput {
  projectType?: string | null;
  urgency?: string | null;
  budgetRange?: string | null;
  exactAmount?: string | number | null;
  companyName?: string | null;
  country?: string | null;
  preferredContactMethod?: string | null;
}

export interface LeadScore {
  score: number;
  tier: "low" | "qualified" | "priority";
  signals: string[];
}

const HIGH_INTENT_PROJECTS = /brand|identity|campaign|art direction|digital|web|product|motion/i;
const URGENCY_POINTS: Record<string, number> = {
  urgent: 30,
  high: 22,
  normal: 10,
  flexible: 4,
};

export function scoreLead(input: LeadSignalInput): LeadScore {
  let score = 0;
  const signals: string[] = [];

  if (input.projectType && HIGH_INTENT_PROJECTS.test(input.projectType)) {
    score += 20;
    signals.push("high-intent-project");
  }

  const urgency = String(input.urgency ?? "").toLowerCase();
  const urgencyPoints = URGENCY_POINTS[urgency] ?? 0;
  score += urgencyPoints;
  if (urgencyPoints >= 20) signals.push("time-sensitive");

  if (input.companyName?.trim()) {
    score += 10;
    signals.push("company-provided");
  }

  if (input.country?.trim()) score += 4;
  if (input.preferredContactMethod?.trim()) score += 3;

  if (input.budgetRange?.trim()) {
    score += 18;
    signals.push("budget-disclosed");
  }

  const amount = Number(input.exactAmount);
  if (Number.isFinite(amount) && amount > 0) {
    score += Math.min(20, Math.max(4, Math.round(Math.log10(amount + 1) * 5)));
    signals.push("exact-budget");
  }

  const bounded = Math.max(0, Math.min(100, score));
  const tier = bounded >= 65 ? "priority" : bounded >= 35 ? "qualified" : "low";
  return { score: bounded, tier, signals };
}
