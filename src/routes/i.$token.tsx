import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Download,
  Loader2,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Upload,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPublicInvoice,
  createProofUploadUrl,
  reportInvoicePayment,
} from "@/lib/invoice.functions";
import { safeClipboardWrite } from "@/lib/browser-safe";
import { supabase } from "@/integrations/supabase/client";
import { money } from "@/lib/invoice-core";

export const Route = createFileRoute("/i/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Your invoice — Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Secure invoice portal: review the breakdown, download the PDF and confirm your payment.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PublicInvoicePage,
});

const METHODS = [
  { id: "bank_transfer", label: "Bank transfer" },
  { id: "mpesa", label: "M-Pesa" },
  { id: "card", label: "Card / other online" },
  { id: "other", label: "Other" },
] as const;

function PublicInvoicePage() {
  const { token } = Route.useParams();
  const getInvoice = useServerFn(getPublicInvoice);
  const createUpload = useServerFn(createProofUploadUrl);
  const reportPayment = useServerFn(reportInvoicePayment);

  const q = useQuery({
    queryKey: ["public-invoice", token],
    queryFn: () => getInvoice({ data: { token } }),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("bank_transfer");
  const [reference, setReference] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const report = useMutation({
    mutationFn: async () => {
      let proofPath: string | null = null;
      if (file) {
        const ct = file.type as "image/png" | "image/jpeg" | "image/webp" | "application/pdf";
        const up = await createUpload({ data: { token, filename: file.name, content_type: ct } });
        const { error } = await supabase.storage
          .from(up.bucket)
          .uploadToSignedUrl(up.path, up.token, file);
        if (error) throw new Error(error.message);
        proofPath = up.path;
      }
      return reportPayment({
        data: { token, method, reference: reference || null, proof_path: proofPath },
      });
    },
    onSuccess: () => {
      toast.success("Thank you — we'll confirm shortly.");
      void q.refetch();
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not submit"),
  });

  if (q.isLoading) {
    return (
      <div className="min-h-screen bg-[#01040A] grid place-items-center text-slate-300">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (q.isError || !q.data) {
    return (
      <div className="min-h-screen bg-[#01040A] grid place-items-center text-center px-6">
        <div>
          <h1 className="text-2xl text-slate-100 font-semibold">Invoice not found</h1>
          <p className="text-slate-400 text-sm mt-2">
            This link may have expired or is invalid. Please contact us.
          </p>
        </div>
      </div>
    );
  }

  const { branding, invoice, client, payment, items, totals } = q.data;
  const accent = branding.brand_color;
  const cur = invoice.currency;
  const isPaid = invoice.status === "paid";
  const isVoid = invoice.status === "void";
  const reported = Boolean(invoice.paid_reported_at) && !isPaid;
  const overdue =
    !isPaid &&
    !isVoid &&
    Boolean(invoice.due_date) &&
    invoice.due_date! < new Date().toISOString().slice(0, 10);
  const amountNow = totals.deposit_amount > 0 && !isPaid ? totals.deposit_amount : totals.total;

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200">
      <div className="h-1 w-full" style={{ background: accent }} />
      <div className="max-w-3xl mx-auto py-10 px-5 sm:px-6">
        <header className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-3">
            {branding.logo_url && (
              <img src={branding.logo_url} alt={branding.studio_name} className="h-9 w-auto" />
            )}
            <div>
              <div className="mono text-[10px] tracking-widest" style={{ color: accent }}>
                {branding.header_label}
              </div>
              <h1 className="text-lg font-semibold text-slate-100">{branding.studio_name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {overdue && (
              <span className="px-3 py-1 rounded-full text-[11px] mono tracking-widest border border-rose-400/40 text-rose-300 inline-flex items-center gap-1">
                <AlertTriangle size={11} /> OVERDUE
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-[11px] mono tracking-widest border ${
                isPaid ? "border-emerald-400/40 text-emerald-300" : "border-white/15 text-slate-300"
              }`}
            >
              {(invoice.status ?? "sent").toUpperCase()}
            </span>
          </div>
        </header>

        {/* Summary card */}
        <section className="rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500">INVOICE N°</div>
              <div className="text-xl font-semibold text-slate-100">{invoice.number}</div>
              <div className="text-[12px] text-slate-500 mt-1">
                {invoice.issue_date ? `Issued ${invoice.issue_date}` : null}
                {invoice.due_date ? ` · Due ${invoice.due_date}` : null}
              </div>
            </div>
            <div className="text-right">
              <div className="mono text-[10px] tracking-widest text-slate-500">
                {isPaid
                  ? "AMOUNT PAID"
                  : totals.deposit_amount > 0
                    ? `DEPOSIT DUE (${invoice.deposit_pct}%)`
                    : "AMOUNT DUE"}
              </div>
              <div className="text-3xl font-bold tabular-nums" style={{ color: accent }}>
                {money(amountNow, cur)}
                <span className="text-sm text-slate-400 ml-2">{cur}</span>
              </div>
              {totals.deposit_amount > 0 && !isPaid && (
                <div className="text-[12px] text-slate-500 mt-1">
                  Total {money(totals.total, cur)} · balance {money(totals.balance, cur)}
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-1">BILLED TO</div>
              <div className="text-slate-100">{client.name}</div>
              {client.company && <div className="text-slate-400">{client.company}</div>}
            </div>
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-1">ENGAGEMENT</div>
              <div className="text-slate-300">{invoice.project_type}</div>
              {invoice.due_date && (
                <div className="text-slate-400 mt-1 flex items-center gap-1">
                  <Clock size={11} /> Payment due {invoice.due_date}
                </div>
              )}
            </div>
          </div>

          {/* Line items */}
          <div className="mt-6 border-t border-white/10 pt-4">
            <div className="mono text-[10px] tracking-widest text-slate-500 mb-3">BREAKDOWN</div>
            <ul className="space-y-3">
              {items.map((l, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-4 pb-3 border-b border-white/5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <div className="text-[14px] text-slate-100">{l.description}</div>
                    {l.detail && (
                      <div className="text-[12px] text-slate-500 mt-0.5">{l.detail}</div>
                    )}
                    <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                      {l.qty} {l.unit} × {money(l.unit_price, cur)}
                      {l.discount_pct > 0 && (
                        <span style={{ color: accent }}> · -{l.discount_pct}%</span>
                      )}
                    </div>
                  </div>
                  <div className="text-[14px] text-slate-100 tabular-nums whitespace-nowrap">
                    {money(l.net, cur)}
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-4 ml-auto max-w-xs text-[13px] space-y-1.5">
              <TotalRow label="Subtotal" value={money(totals.subtotal, cur)} />
              {totals.discount_amount > 0 && (
                <TotalRow
                  label={`Discount (${invoice.discount_pct}%)`}
                  value={`-${money(totals.discount_amount, cur)}`}
                />
              )}
              {totals.tax_amount > 0 && (
                <TotalRow
                  label={invoice.tax_label || `Tax (${invoice.tax_pct}%)`}
                  value={money(totals.tax_amount, cur)}
                />
              )}
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                <dt className="text-slate-300 font-semibold">Total</dt>
                <dd className="font-bold tabular-nums" style={{ color: accent }}>
                  {money(totals.total, cur)} {cur}
                </dd>
              </div>
            </dl>
          </div>

          {invoice.notes && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-2">NOTES</div>
              <p className="text-[13px] text-slate-300 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          <a
            href={invoice.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-[#01040A]"
            style={{ background: accent }}
          >
            <Download size={14} /> Download PDF invoice
          </a>
        </section>

        {/* Payment details */}
        {(payment.bank_iban || payment.mpesa_number) && !isVoid && (
          <section className="mt-6 rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
            <div className="mono text-[10px] tracking-widest text-slate-500 mb-3">
              PAYMENT DETAILS
            </div>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              {payment.bank_name && <Row label="Bank" value={payment.bank_name} />}
              {payment.bank_account_name && (
                <Row label="Account" value={payment.bank_account_name} />
              )}
              {payment.bank_iban && <Row label="IBAN" value={payment.bank_iban} copyable />}
              {payment.bank_swift && (
                <Row label="SWIFT / BIC" value={payment.bank_swift} copyable />
              )}
              {payment.mpesa_number && <Row label="M-Pesa" value={payment.mpesa_number} copyable />}
              <Row label="Reference" value={invoice.number ?? ""} copyable />
              <Row label="Amount" value={`${money(amountNow, cur)} ${cur}`} copyable />
            </dl>
            {(invoice.terms || payment.payment_terms) && (
              <p className="text-[12px] text-slate-500 mt-4 border-t border-white/10 pt-3">
                {invoice.terms || payment.payment_terms}
              </p>
            )}
          </section>
        )}

        {/* Confirm payment */}
        {!isPaid && !isVoid && (
          <section className="mt-6 rounded-2xl border border-white/10 p-6 bg-white/[0.02]">
            <div className="mono text-[10px] tracking-widest text-slate-500 mb-1">
              ALREADY PAID?
            </div>
            <p className="text-[13px] text-slate-400 mb-4">
              Tell us and attach the receipt — we verify and confirm, usually the same day.
            </p>

            {reported ? (
              <div className="flex items-center gap-2 text-amber-300 text-sm">
                <ShieldCheck size={15} /> Payment reported on{" "}
                {new Date(invoice.paid_reported_at!).toLocaleDateString()} — awaiting our
                confirmation.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${
                        method === m.id
                          ? "border-transparent text-[#01040A] font-semibold"
                          : "border-white/15 text-slate-300 hover:border-white/30"
                      }`}
                      style={method === m.id ? { background: accent } : undefined}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transaction reference (optional)"
                  className="w-full bg-[#01040A] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white/30"
                />
                <label className="flex items-center gap-2 text-[13px] text-slate-400 cursor-pointer">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30">
                    <Upload size={13} /> {file ? "Change receipt" : "Attach receipt"}
                  </span>
                  {file && (
                    <span className="text-slate-300 truncate max-w-[180px]">{file.name}</span>
                  )}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      if (f && f.size > 8 * 1024 * 1024) {
                        toast.error("Max 8MB");
                        return;
                      }
                      setFile(f);
                    }}
                  />
                </label>
                <button
                  onClick={() => report.mutate()}
                  disabled={report.isPending}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[#01040A] disabled:opacity-60"
                  style={{ background: accent }}
                >
                  {report.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  I've paid this invoice
                </button>
              </div>
            )}
          </section>
        )}

        {isPaid && (
          <div className="mt-6 flex items-center gap-2 text-emerald-300 text-sm">
            <CheckCircle2 size={14} /> Payment received
            {invoice.paid_at ? ` · ${new Date(invoice.paid_at).toLocaleDateString()}` : ""}. Thank
            you!
          </div>
        )}

        <footer className="mt-10 border-t border-white/10 pt-5">
          {branding.legal_text && (
            <p className="text-[11px] text-slate-500 leading-relaxed">{branding.legal_text}</p>
          )}
          <p className="text-[11px] text-slate-500 mt-2">
            {branding.studio_name}
            {branding.footer_note ? ` · ${branding.footer_note}` : ""}
            {branding.studio_email ? ` · ${branding.studio_email}` : ""}
          </p>
        </footer>
      </div>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-200 tabular-nums">{value}</dd>
    </div>
  );
}

function Row({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  const [done, setDone] = useState(false);
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b border-white/5 last:border-b-0">
      <dt className="text-slate-500 text-[12px]">{label}</dt>
      <dd className="text-slate-100 text-[13px] flex items-center gap-2">
        <span className="tabular-nums">{value}</span>
        {copyable && (
          <button
            onClick={() => {
              void safeClipboardWrite(value).then(() => {
                setDone(true);
                setTimeout(() => setDone(false), 1400);
              });
            }}
            className="text-slate-500 hover:text-slate-200"
            aria-label={`Copy ${label}`}
          >
            {done ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          </button>
        )}
      </dd>
    </div>
  );
}
