import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText, Loader2, Download, Send, Eye, CheckCircle2,
  History, ExternalLink, X, Copy,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { currentOrigin, safeClipboardWrite } from "@/lib/browser-safe";
import {
  generateBriefingInvoice, sendBriefingInvoice, previewInvoiceEmail,
  setInvoiceStatus, listInvoiceEvents,
} from "@/lib/invoice.functions";

const CURRENCIES = ["EUR", "USD", "MZN", "GBP", "BRL"] as const;
const STATUS_TONE: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  generated: "bg-sky-400/15 text-sky-200 border-sky-400/30",
  sent: "bg-violet-400/15 text-violet-200 border-violet-400/30",
  viewed: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  paid: "bg-emerald-400/15 text-emerald-200 border-emerald-400/30",
  void: "bg-rose-400/15 text-rose-200 border-rose-400/30",
};
const STATUS_ORDER = ["draft", "generated", "sent", "viewed", "paid", "void"] as const;

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
    invoice_public_token?: string | null;
  };
  onSent?: () => void;
};

export function InvoicePanel({ briefingId, defaultCurrency, suggestedAmount, existing, onSent }: Props) {
  const generate = useServerFn(generateBriefingInvoice);
  const send = useServerFn(sendBriefingInvoice);
  const preview = useServerFn(previewInvoiceEmail);
  const setStatus = useServerFn(setInvoiceStatus);
  const listEvents = useServerFn(listInvoiceEvents);
  const qc = useQueryClient();

  const [amount, setAmount] = useState<string>(
    existing?.invoice_amount ? String(existing.invoice_amount) : suggestedAmount ? String(suggestedAmount) : "",
  );
  const [currency, setCurrency] = useState<string>(
    (existing?.invoice_currency || defaultCurrency || "EUR").toUpperCase(),
  );
  const [dueDate, setDueDate] = useState<string>(existing?.invoice_due_date ?? "");
  const [notes, setNotes] = useState<string>("");
  const [busy, setBusy] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ html: string; subject: string; to: string[]; cc: string[]; clientPortalUrl: string } | null>(null);

  const events = useQuery({
    queryKey: ["invoice-events", briefingId],
    queryFn: () => listEvents({ data: { briefing_id: briefingId } }),
    refetchOnWindowFocus: false,
  });

  const status = existing?.invoice_status ?? "draft";
  const hasInvoice = Boolean(existing?.invoice_number && existing?.invoice_pdf_path);
  const pdfUrl = existing?.invoice_pdf_path
    ? supabase.storage.from("site-assets").getPublicUrl(existing.invoice_pdf_path).data.publicUrl
    : null;
  const portalUrl = existing?.invoice_public_token
    ? `${currentOrigin()}/i/${existing.invoice_public_token}`
    : null;

  const validate = () => {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) { toast.error("Enter a valid amount"); return null; }
    return { briefing_id: briefingId, amount: n, currency: currency as (typeof CURRENCIES)[number], due_date: dueDate || null, notes: notes || null };
  };

  const doPreview = async () => {
    const input = validate(); if (!input) return;
    setBusy("preview");
    try {
      const res = await preview({ data: input });
      setPreviewData(res);
      setPreviewOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Preview failed");
    } finally { setBusy(null); }
  };

  const doGenerate = async () => {
    const input = validate(); if (!input) return;
    setBusy("generate");
    try {
      const res = await generate({ data: input });
      toast.success(`Invoice ${res.invoiceNumber} generated`);
      onSent?.();
      qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  const doSend = async () => {
    setBusy("send");
    try {
      await send({ data: { briefing_id: briefingId } });
      toast.success("Invoice email sent");
      setPreviewOpen(false);
      onSent?.();
      qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  const doGenerateAndSend = async () => {
    const input = validate(); if (!input) return;
    setBusy("both");
    try {
      const res = await generate({ data: input });
      await send({ data: { briefing_id: briefingId } });
      toast.success(`Invoice ${res.invoiceNumber} generated & sent`);
      onSent?.();
      qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  const changeStatus = async (s: (typeof STATUS_ORDER)[number]) => {
    setBusy("status");
    try {
      await setStatus({ data: { briefing_id: briefingId, status: s } });
      toast.success(`Status → ${s}`);
      onSent?.();
      qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
    } catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  return (
    <div className="mt-5">
      <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
        <FileText size={11} /> INVOICE
        <span className={`ml-2 px-2 py-0.5 rounded border text-[10px] ${STATUS_TONE[status] ?? STATUS_TONE.draft}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 space-y-3">
        {hasInvoice && (
          <div className="flex items-center justify-between gap-3 pb-3 mb-1 border-b border-white/[0.06] flex-wrap">
            <div className="text-[12px] text-slate-300">
              <b>{existing?.invoice_number}</b> · {existing?.invoice_currency}{" "}
              {Number(existing?.invoice_amount ?? 0).toFixed(2)}
              {existing?.invoice_sent_at && (
                <span className="text-slate-500"> · sent {new Date(existing.invoice_sent_at).toLocaleDateString()}</span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {pdfUrl && (
                <a href={pdfUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-sky-200 hover:underline">
                  <Download size={12} /> PDF
                </a>
              )}
              {portalUrl && (
                <>
                  <a href={portalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-sky-200 hover:underline">
                    <ExternalLink size={12} /> Client link
                  </a>
                  <button
                    onClick={() => { safeClipboardWrite(portalUrl).then(() => toast.success("Copied")).catch(() => toast.error("Clipboard unavailable")); }}
                    className="text-slate-400 hover:text-slate-200"
                    title="Copy client link"
                  >
                    <Copy size={12} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2">
          <label className="col-span-2">
            <span className="mono text-[9px] tracking-[0.2em] text-slate-500">AMOUNT</span>
            <input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50" />
          </label>
          <label>
            <span className="mono text-[9px] tracking-[0.2em] text-slate-500">CURRENCY</span>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-2 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50">
              {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mono text-[9px] tracking-[0.2em] text-slate-500">DUE DATE (OPTIONAL)</span>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
            className="w-full mt-1 bg-[#030814] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50" />
        </label>

        <label className="block">
          <span className="mono text-[9px] tracking-[0.2em] text-slate-500">LINE-ITEM NOTES (OPTIONAL)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
            placeholder="e.g. 50% deposit — brand identity system, 3-week production window."
            className="w-full mt-1 bg-[#030814] border border-white/10 rounded p-2 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50" />
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <button onClick={doPreview} disabled={!!busy}
            className="inline-flex items-center gap-2 border border-sky-300/40 text-sky-200 px-3 py-2 rounded text-[12px] font-medium disabled:opacity-60">
            {busy === "preview" ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} Preview email
          </button>
          <button onClick={doGenerate} disabled={!!busy}
            className="inline-flex items-center gap-2 border border-white/15 text-slate-200 px-3 py-2 rounded text-[12px] font-medium disabled:opacity-60">
            {busy === "generate" ? <Loader2 size={12} className="animate-spin" /> : <FileText size={12} />}
            {hasInvoice ? "Regenerate PDF" : "Generate PDF"}
          </button>
          {hasInvoice && (
            <button onClick={doSend} disabled={!!busy}
              className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-3 py-2 rounded text-[12px] font-semibold disabled:opacity-60">
              {busy === "send" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Send email
            </button>
          )}
          {!hasInvoice && (
            <button onClick={doGenerateAndSend} disabled={!!busy}
              className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-3 py-2 rounded text-[12px] font-semibold disabled:opacity-60">
              {busy === "both" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Generate & send
            </button>
          )}
          {hasInvoice && status !== "paid" && (
            <button onClick={() => changeStatus("paid")} disabled={!!busy}
              className="inline-flex items-center gap-2 border border-emerald-300/40 text-emerald-200 px-3 py-2 rounded text-[12px] font-medium disabled:opacity-60 ml-auto">
              <CheckCircle2 size={12} /> Mark paid
            </button>
          )}
        </div>

        {hasInvoice && (
          <div className="flex flex-wrap gap-1 pt-1">
            {STATUS_ORDER.map((s) => (
              <button key={s} onClick={() => changeStatus(s)} disabled={!!busy || s === status}
                className={`mono text-[9px] tracking-wider px-2 py-1 rounded border ${s === status ? STATUS_TONE[s] : "border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25"} disabled:cursor-default`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div className="pt-3 border-t border-white/[0.06]">
          <div className="mono text-[9px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
            <History size={10} /> EVENT LOG
          </div>
          {events.isLoading ? (
            <div className="text-[11px] text-slate-500">Loading…</div>
          ) : (events.data?.length ?? 0) === 0 ? (
            <div className="text-[11px] text-slate-500">No events yet.</div>
          ) : (
            <ul className="space-y-1.5 max-h-48 overflow-auto">
              {events.data!.map((ev) => (
                <li key={ev.id} className="text-[11px] text-slate-400 flex items-start gap-2">
                  <span className="mono text-slate-500 tabular-nums shrink-0">
                    {new Date(ev.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  <span className="text-slate-200 font-medium">{ev.event_type}</span>
                  {ev.recipients && ev.recipients.length > 0 && (
                    <span className="text-slate-500">→ {ev.recipients.join(", ")}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {previewOpen && previewData && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setPreviewOpen(false)}>
          <div className="bg-[#01040A] border border-white/10 rounded-lg max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div>
                <div className="mono text-[10px] tracking-widest text-slate-500">EMAIL PREVIEW</div>
                <div className="text-[13px] text-slate-100 mt-1"><b>Subject:</b> {previewData.subject}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">To: {previewData.to.join(", ")} · Cc: {previewData.cc.join(", ")}</div>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-100"><X size={16} /></button>
            </div>
            <iframe title="email preview" srcDoc={previewData.html} className="flex-1 w-full bg-white rounded-b-none" />
            <div className="p-3 border-t border-white/10 flex justify-end gap-2">
              <button onClick={() => setPreviewOpen(false)} className="px-3 py-2 text-[12px] text-slate-300 hover:text-slate-100">Close</button>
              {hasInvoice ? (
                <button onClick={doSend} disabled={busy === "send"}
                  className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-[12px] font-semibold disabled:opacity-60">
                  {busy === "send" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Send now
                </button>
              ) : (
                <button onClick={doGenerateAndSend} disabled={busy === "both"}
                  className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-[12px] font-semibold disabled:opacity-60">
                  {busy === "both" ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />} Generate & send
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
