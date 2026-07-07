import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { FileText, Loader2, Download, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { generateBriefingInvoice } from "@/lib/invoice.functions";

const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL"] as const;

type Props = {
  briefingId: string;
  defaultCurrency: string;
  suggestedAmount?: number | null;
  existing?: {
    invoice_number: string | null;
    invoice_amount: number | null;
    invoice_currency: string | null;
    invoice_due_date: string | null;
    invoice_pdf_path: string | null;
    invoice_status: string | null;
    invoice_sent_at: string | null;
  };
  onSent?: () => void;
};

export function InvoicePanel({
  briefingId,
  defaultCurrency,
  suggestedAmount,
  existing,
  onSent,
}: Props) {
  const call = useServerFn(generateBriefingInvoice);
  const [amount, setAmount] = useState<string>(
    existing?.invoice_amount ? String(existing.invoice_amount) : suggestedAmount ? String(suggestedAmount) : "",
  );
  const [currency, setCurrency] = useState<string>(
    (existing?.invoice_currency || defaultCurrency || "EUR").toUpperCase(),
  );
  const [dueDate, setDueDate] = useState<string>(existing?.invoice_due_date ?? "");
  const [notes, setNotes] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const isSent = existing?.invoice_status === "sent";
  const existingUrl =
    existing?.invoice_pdf_path
      ? supabase.storage.from("site-assets").getPublicUrl(existing.invoice_pdf_path).data.publicUrl
      : null;

  const submit = async () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (!CURRENCIES.includes(currency as (typeof CURRENCIES)[number])) {
      toast.error("Pick a currency");
      return;
    }
    setBusy(true);
    try {
      const res = await call({
        data: {
          briefing_id: briefingId,
          amount: n,
          currency: currency as (typeof CURRENCIES)[number],
          due_date: dueDate || null,
          notes: notes || null,
        },
      });
      toast.success(`Invoice ${res.invoiceNumber} sent`);
      setNotes("");
      onSent?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send invoice");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
        <FileText size={11} /> INVOICE
      </div>
      <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 space-y-3">
        {isSent && existing && (
          <div className="flex items-center justify-between gap-3 pb-3 mb-1 border-b border-white/[0.06]">
            <div className="text-[12px] text-slate-300">
              <div className="text-emerald-300 mono text-[10px] tracking-wider">SENT</div>
              <div className="mt-1">
                <b>{existing.invoice_number}</b> · {existing.invoice_currency}{" "}
                {Number(existing.invoice_amount ?? 0).toFixed(2)}
                {existing.invoice_sent_at && (
                  <span className="text-slate-500">
                    {" "}
                    · {new Date(existing.invoice_sent_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            {existingUrl && (
              <a
                href={existingUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[12px] text-sky-200 hover:underline"
              >
                <Download size={12} /> PDF
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <label className="col-span-2">
            <span className="mono text-[9px] tracking-[0.2em] text-slate-500">AMOUNT</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
            />
          </label>
          <label>
            <span className="mono text-[9px] tracking-[0.2em] text-slate-500">CURRENCY</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-2 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mono text-[9px] tracking-[0.2em] text-slate-500">DUE DATE (OPTIONAL)</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
          />
        </label>

        <label className="block">
          <span className="mono text-[9px] tracking-[0.2em] text-slate-500">
            LINE-ITEM NOTES (OPTIONAL)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="e.g. 50% deposit — brand identity system, 3-week production window."
            className="w-full mt-1 bg-[#030814] border border-white/10 rounded p-2 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50"
          />
        </label>

        <button
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-60"
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
          {isSent ? "Regenerate & resend invoice" : "Generate & send invoice"}
        </button>
        <p className="text-[11px] text-slate-500">
          Client receives an email with the PDF link. You're CC'd. Bank/M-Pesa details come from
          site settings → <code className="text-slate-400">invoice_settings</code>.
        </p>
      </div>
    </div>
  );
}
