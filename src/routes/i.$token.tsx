import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, CheckCircle2, Clock } from "lucide-react";
import { getPublicInvoice } from "@/lib/invoice.functions";

export const Route = createFileRoute("/i/$token")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Invoice" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublicInvoicePage,
});

const CURRENCY_SYMBOL: Record<string, string> = {
  EUR: "€", USD: "$", MZN: "MT ", GBP: "£", BRL: "R$",
};

function money(amount: number | null | undefined, currency: string | null | undefined) {
  if (amount == null || !currency) return "—";
  return `${CURRENCY_SYMBOL[currency] ?? ""}${Number(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
}

function PublicInvoicePage() {
  const { token } = Route.useParams();
  const q = useQuery({
    queryKey: ["public-invoice", token],
    queryFn: () => getPublicInvoice({ data: { token } }),
    retry: false,
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
          <p className="text-slate-400 text-sm mt-2">This link may have expired or is invalid. Please contact us.</p>
        </div>
      </div>
    );
  }

  const { branding, invoice, client, payment } = q.data;
  const accent = branding.brand_color;
  const isPaid = invoice.status === "paid";

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {branding.logo_url && (
              <img src={branding.logo_url} alt={branding.studio_name} className="h-9 w-auto" />
            )}
            <div>
              <div className="mono text-[10px] tracking-widest" style={{ color: accent }}>
                {branding.header_label}
              </div>
              <div className="text-lg font-semibold text-slate-100">{branding.studio_name}</div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[11px] mono tracking-widest border ${
            isPaid ? "border-emerald-400/40 text-emerald-300" : "border-white/15 text-slate-300"
          }`}>
            {(invoice.status ?? "sent").toUpperCase()}
          </div>
        </header>

        <div className="rounded-xl border border-white/10 p-6 bg-white/[0.02]">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500">INVOICE N°</div>
              <div className="text-xl font-semibold text-slate-100">{invoice.number}</div>
            </div>
            <div className="text-right">
              <div className="mono text-[10px] tracking-widest text-slate-500">AMOUNT DUE</div>
              <div className="text-3xl font-bold" style={{ color: accent }}>
                {money(invoice.amount, invoice.currency)}
                <span className="text-sm text-slate-400 ml-2">{invoice.currency}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-1">BILL TO</div>
              <div className="text-slate-100">{client.name}</div>
              {client.company && <div className="text-slate-400">{client.company}</div>}
            </div>
            <div>
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-1">DETAILS</div>
              <div className="text-slate-300">{invoice.project_type}</div>
              {invoice.due_date && (
                <div className="text-slate-400 mt-1 flex items-center gap-1">
                  <Clock size={11} /> Due {invoice.due_date}
                </div>
              )}
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <div className="mono text-[10px] tracking-widest text-slate-500 mb-2">NOTES</div>
              <p className="text-[13px] text-slate-300 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          <a href={invoice.pdf_url} target="_blank" rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-[#01040A]"
            style={{ background: accent }}>
            <Download size={14} /> Download PDF invoice
          </a>
        </div>

        {(payment.bank_iban || payment.mpesa_number) && (
          <div className="mt-6 rounded-xl border border-white/10 p-6 bg-white/[0.02]">
            <div className="mono text-[10px] tracking-widest text-slate-500 mb-3">PAYMENT DETAILS</div>
            <dl className="grid grid-cols-1 gap-2 text-sm">
              {payment.bank_name && <Row label="Bank" value={payment.bank_name} />}
              {payment.bank_account_name && <Row label="Account" value={payment.bank_account_name} />}
              {payment.bank_iban && <Row label="IBAN" value={payment.bank_iban} copyable />}
              {payment.bank_swift && <Row label="SWIFT / BIC" value={payment.bank_swift} copyable />}
              {payment.mpesa_number && <Row label="M-Pesa" value={payment.mpesa_number} copyable />}
              <Row label="Reference" value={invoice.number ?? ""} copyable />
            </dl>
            {payment.payment_terms && (
              <p className="text-[12px] text-slate-500 mt-4 border-t border-white/10 pt-3">
                {payment.payment_terms}
              </p>
            )}
          </div>
        )}

        {isPaid && (
          <div className="mt-6 flex items-center gap-2 text-emerald-300 text-sm">
            <CheckCircle2 size={14} /> Payment received{invoice.paid_at ? ` · ${new Date(invoice.paid_at).toLocaleDateString()}` : ""}. Thank you!
          </div>
        )}

        {branding.legal_text && (
          <p className="text-[11px] text-slate-500 mt-8 leading-relaxed">{branding.legal_text}</p>
        )}
        {branding.footer_note && (
          <p className="text-[11px] text-slate-500 mt-2">{branding.footer_note}</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, copyable }: { label: string; value: string; copyable?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 border-b border-white/5 last:border-b-0">
      <dt className="text-slate-500 text-[12px]">{label}</dt>
      <dd className="text-slate-100 text-[13px] flex items-center gap-2">
        <span className="tabular-nums">{value}</span>
        {copyable && (
          <button
            onClick={() => { navigator.clipboard.writeText(value); }}
            className="text-slate-500 hover:text-slate-200 text-[10px] mono tracking-widest"
          >COPY</button>
        )}
      </dd>
    </div>
  );
}
