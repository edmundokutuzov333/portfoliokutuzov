const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL", "ZAR"];
const CURRENCY_SYMBOL = {
  EUR: "€",
  USD: "$",
  MZN: "MT ",
  GBP: "£",
  BRL: "R$",
  ZAR: "R "
};
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const num = (v, fallback = 0) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
};
const clampPct = (v) => Math.min(100, Math.max(0, num(v)));
function lineNet(item) {
  const gross = num(item.qty, 0) * num(item.unit_price, 0);
  return round2(gross * (1 - clampPct(item.discount_pct) / 100));
}
function computeTotals(input) {
  const lines = (input.items ?? []).map((i) => ({ ...i, net: lineNet(i) }));
  const subtotal = round2(lines.reduce((acc, l) => acc + l.net, 0));
  const discount_amount = round2(subtotal * clampPct(input.discount_pct) / 100);
  const taxable = round2(subtotal - discount_amount);
  const tax_amount = round2(taxable * clampPct(input.tax_pct) / 100);
  const total = round2(taxable + tax_amount);
  const deposit_amount = round2(total * clampPct(input.deposit_pct) / 100);
  return {
    lines,
    subtotal,
    discount_amount,
    taxable,
    tax_amount,
    total,
    deposit_amount,
    balance: round2(total - deposit_amount)
  };
}
function money(amount, currency) {
  if (amount == null || !Number.isFinite(Number(amount))) return "—";
  const value = Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return `${CURRENCY_SYMBOL[(currency ?? "").toUpperCase()] ?? ""}${value}`;
}
export {
  CURRENCIES as C,
  computeTotals as c,
  money as m
};
