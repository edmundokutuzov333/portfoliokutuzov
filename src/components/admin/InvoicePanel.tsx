import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  FileText, Loader2, Download, Send, Eye, CheckCircle2, History, ExternalLink, X, Copy,
  Plus, Trash2, ArrowUp, ArrowDown, BellRing, Sparkles, Paperclip,
} from "lucide-react";
import { currentOrigin, safeClipboardWrite } from "@/lib/browser-safe";
import { CURRENCIES, computeTotals, money, type LineItem } from "@/lib/invoice-core";
import {
  generateBriefingInvoice, sendBriefingInvoice, previewInvoiceEmail, setInvoiceStatus,
  listInvoiceEvents, getInvoiceDraft, saveInvoiceDraft, renderInvoicePdfNow,
} from "@/lib/invoice.functions";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  generated: "bg-sky-400/15 text-sky-200 border-sky-400/30",
  sent: "bg-violet-400/15 text-violet-200 border-violet-400/30",
  viewed: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  paid: "bg-emerald-400/15 text-emerald-200 border-emerald-400/30",
  void: "bg-rose-400/15 text-rose-200 border-rose-400/30",
};
const STATUS_ORDER = ["draft", "generated", "sent", "viewed", "paid", "void"] as const;

const PRESETS: Array<{ label: string; item: Omit<LineItem, "id"> }> = [
  { label: "Brand identity", item: { description: "Brand identity system", detail: "Logotype, type system, colour, usage guide", qty: 1, unit: "project", unit_price: 0, discount_pct: 0 } },
  { label: "Art direction", item: { description: "Art direction", detail: "Concept, references, shot list, on-set direction", qty: 1, unit: "day", unit_price: 0, discount_pct: 0 } },
  { label: "Key visual", item: { description: "Key visual", detail: "Master artwork + adaptations", qty: 1, unit: "un", unit_price: 0, discount_pct: 0 } },
  { label: "Retouching", item: { description: "Retouching & finishing", detail: null, qty: 1, unit: "hour", unit_price: 0, discount_pct: 0 } },
];

const emptyItem = (): LineItem => ({ description: "", detail: null, qty: 1, unit: "un", unit_price: 0, discount_pct: 0 });

function downloadBase64Pdf(base64: string, filename: string) {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

type Props = {
  briefingId: string;
  defaultCurrency: string;
  suggestedAmount?: number | null;
  onSent?: () => void;
};

export function InvoicePanel({ briefingId, defaultCurrency, suggestedAmount, onSent }: Props) {
  const generate = useServerFn(generateBriefingInvoice);
  const send = useServerFn(sendBriefingInvoice);
  const preview = useServerFn(previewInvoiceEmail);
  const setStatus = useServerFn(setInvoiceStatus);
  const listEvents = useServerFn(listInvoiceEvents);
  const loadDraft = useServerFn(getInvoiceDraft);
  const saveDraft = useServerFn(saveInvoiceDraft);
  const renderNow = useServerFn(renderInvoicePdfNow);
  const qc = useQueryClient();

  const draft = useQuery({
    queryKey: ["invoice-draft", briefingId],
    queryFn: () => loadDraft({ data: { briefing_id: briefingId } }),
    refetchOnWindowFocus: false,
  });
  const events = useQuery({
    queryKey: ["invoice-events", briefingId],
    queryFn: () => listEvents({ data: { briefing_id: briefingId } }),
    refetchOnWindowFocus: false,
  });

  const [items, setItems] = useState<LineItem[]>([]);
  const [currency, setCurrency] = useState((defaultCurrency || "EUR").toUpperCase());
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [taxPct, setTaxPct] = useState(0);
  const [taxLabel, setTaxLabel] = useState("");
  const [depositPct, setDepositPct] = useState(0);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ html: string; subject: string; to: string[]; cc: string[]; clientPortalUrl: string } | null>(null);
  const [attachPdf, setAttachPdf] = useState(true);

  const header = draft.data?.header;

  // Hydrate the editor once the draft arrives.
  useEffect(() => {
    if (!draft.data) return;
    const h = draft.data.header;
    setItems(
      draft.data.items.length
        ? draft.data.items
        : [{ ...emptyItem(), description: "Creative direction & production", unit: "project", unit_price: Number(suggestedAmount ?? 0) }],
    );
    setCurrency((h.currency || defaultCurrency || "EUR").toUpperCase());
    setIssueDate(h.issue_date ?? new Date().toISOString().slice(0, 10));
    setDueDate(h.due_date ?? "");
    setDiscountPct(h.discount_pct);
    setTaxPct(h.tax_pct);
    setTaxLabel(h.tax_label ?? "");
    setDepositPct(h.deposit_pct);
    setNotes(h.notes ?? "");
    setTerms(h.terms ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.data]);

  const totals = useMemo(
    () => computeTotals({ items, discount_pct: discountPct, tax_pct: taxPct, deposit_pct: depositPct }),
    [items, discountPct, taxPct, depositPct],
  );

  const status = header?.status ?? "draft";
  const hasInvoice = Boolean(header?.number && header?.pdf_path);
  const portalUrl = header?.token ? `${currentOrigin()}/i/${header.token}` : null;

  const payload = () => {
    const clean = items
      .map((i) => ({
        description: i.description.trim(),
        detail: i.detail?.trim() ? i.detail.trim() : null,
        qty: Number(i.qty) || 0,
        unit: (i.unit || "un").trim(),
        unit_price: Number(i.unit_price) || 0,
        discount_pct: Number(i.discount_pct) || 0,
      }))
      .filter((i) => i.description.length > 0);
    if (!clean.length) { toast.error("Add at least one described line item"); return null; }
    if (totals.total <= 0) { toast.error("Total must be greater than zero"); return null; }
    return {
      briefing_id: briefingId,
      currency: currency as (typeof CURRENCIES)[number],
      issue_date: issueDate || null,
      due_date: dueDate || null,
      discount_pct: discountPct,
      tax_pct: taxPct,
      tax_label: taxLabel || null,
      deposit_pct: depositPct,
      notes: notes || null,
      terms: terms || null,
      items: clean,
    };
  };

  const run = async (key: string, fn: () => Promise<void>) => {
    setBusy(key);
    try { await fn(); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Failed"); }
    finally { setBusy(null); }
  };

  const refresh = () => {
    onSent?.();
    qc.invalidateQueries({ queryKey: ["invoice-draft", briefingId] });
    qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
  };

  const doInstantPdf = () => {
    const input = payload(); if (!input) return;
    void run("pdf", async () => {
      const res = await renderNow({ data: input });
      downloadBase64Pdf(res.base64, res.filename);
      toast.success("PDF downloaded");
    });
  };

  const doSaveDraft = () => {
    const input = payload(); if (!input) return;
    void run("save", async () => {
      await saveDraft({ data: input });
      toast.success("Draft saved");
      refresh();
    });
  };

  const doIssue = (thenSend: boolean) => {
    const input = payload(); if (!input) return;
    void run(thenSend ? "both" : "issue", async () => {
      const res = await generate({ data: input });
      if (thenSend) await send({ data: { briefing_id: briefingId, attach_pdf: attachPdf, variant: "invoice" } });
      else downloadBase64Pdf(res.base64, res.filename);
      toast.success(`Invoice ${res.invoiceNumber} ${thenSend ? "issued & sent" : "issued"}`);
      refresh();
    });
  };

  const doSend = (variant: "invoice" | "reminder" | "receipt") =>
    void run(variant, async () => {
      await send({ data: { briefing_id: briefingId, attach_pdf: attachPdf, variant } });
      toast.success(variant === "reminder" ? "Reminder sent" : variant === "receipt" ? "Receipt sent" : "Invoice email sent");
      setPreviewOpen(false);
      refresh();
    });

  const doPreview = (variant: "invoice" | "reminder" | "receipt") =>
    void run("preview", async () => {
      const res = await preview({ data: { briefing_id: briefingId, variant } });
      setPreviewData(res);
      setPreviewOpen(true);
    });

  const changeStatus = (s: (typeof STATUS_ORDER)[number]) =>
    void run("status", async () => {
      await setStatus({ data: { briefing_id: briefingId, status: s } });
      toast.success(`Status → ${s}`);
      refresh();
    });

  const patchItem = (idx: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const move = (idx: number, dir: -1 | 1) =>
    setItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j]!, next[idx]!];
      return next;
    });

  const fmt = (n: number) => money(n, currency);

  return (
    <div className="mt-5">
      <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2 flex-wrap">
        <FileText size={11} /> INVOICE
        <span className={`px-2 py-0.5 rounded border text-[10px] ${STATUS_TONE[status] ?? STATUS_TONE.draft}`}>
          {status.toUpperCase()}
        </span>
        {header?.number && <span className="text-slate-400">{header.number}</span>}
        {header?.paid_reported_at && status !== "paid" && (
          <span className="px-2 py-0.5 rounded border border-amber-400/30 text-amber-200">
            CLIENT REPORTED PAYMENT
          </span>
        )}
      </div>

      <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 space-y-4">
        {draft.isLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-[12px] py-4">
            <Loader2 size={13} className="animate-spin" /> Loading invoice…
          </div>
        ) : (
          <>
            {/* header meta */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Field label="Currency">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputCls}>
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Issue date">
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Due date">
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputCls} />
              </Field>
              <Field label="Deposit %">
                <input type="number" min={0} max={100} value={depositPct}
                  onChange={(e) => setDepositPct(Number(e.target.value) || 0)} className={inputCls} />
              </Field>
            </div>

            {/* line items */}
            <div>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="mono text-[10px] tracking-[0.2em] text-slate-500">LINE ITEMS</div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => setItems((prev) => [...prev, { ...p.item }])}
                      className="text-[10px] px-2 py-1 rounded border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25 inline-flex items-center gap-1">
                      <Sparkles size={9} /> {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {items.map((it, idx) => (
                  <div key={idx} className="border border-white/[0.06] rounded p-3 bg-white/[0.01]">
                    <div className="flex gap-2">
                      <input value={it.description} placeholder="Description"
                        onChange={(e) => patchItem(idx, { description: e.target.value })}
                        className={`${inputCls} flex-1 font-medium`} />
                      <div className="flex items-center gap-1">
                        <IconBtn onClick={() => move(idx, -1)} title="Move up"><ArrowUp size={12} /></IconBtn>
                        <IconBtn onClick={() => move(idx, 1)} title="Move down"><ArrowDown size={12} /></IconBtn>
                        <IconBtn onClick={() => setItems((p) => p.filter((_, i) => i !== idx))} title="Remove">
                          <Trash2 size={12} />
                        </IconBtn>
                      </div>
                    </div>
                    <input value={it.detail ?? ""} placeholder="Detail (optional)"
                      onChange={(e) => patchItem(idx, { detail: e.target.value })}
                      className={`${inputCls} mt-2 text-[12px]`} />
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 items-end">
                      <Field label="Qty">
                        <input type="number" min={0} step="0.01" value={it.qty}
                          onChange={(e) => patchItem(idx, { qty: Number(e.target.value) || 0 })} className={inputCls} />
                      </Field>
                      <Field label="Unit">
                        <input value={it.unit} onChange={(e) => patchItem(idx, { unit: e.target.value })} className={inputCls} />
                      </Field>
                      <Field label="Rate">
                        <input type="number" min={0} step="0.01" value={it.unit_price}
                          onChange={(e) => patchItem(idx, { unit_price: Number(e.target.value) || 0 })} className={inputCls} />
                      </Field>
                      <Field label="Disc %">
                        <input type="number" min={0} max={100} value={it.discount_pct}
                          onChange={(e) => patchItem(idx, { discount_pct: Number(e.target.value) || 0 })} className={inputCls} />
                      </Field>
                      <div className="text-right">
                        <div className="mono text-[9px] tracking-widest text-slate-600">AMOUNT</div>
                        <div className="text-[13px] text-slate-100 tabular-nums">
                          {fmt(totals.lines[idx]?.net ?? 0)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => setItems((p) => [...p, emptyItem()])}
                className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-sky-200 hover:underline">
                <Plus size={12} /> Add line item
              </button>
            </div>

            {/* adjustments + totals */}
            <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <Field label="Discount %">
                    <input type="number" min={0} max={100} value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value) || 0)} className={inputCls} />
                  </Field>
                  <Field label="Tax %">
                    <input type="number" min={0} max={100} value={taxPct}
                      onChange={(e) => setTaxPct(Number(e.target.value) || 0)} className={inputCls} />
                  </Field>
                  <Field label="Tax label">
                    <input value={taxLabel} placeholder="VAT (16%)"
                      onChange={(e) => setTaxLabel(e.target.value)} className={inputCls} />
                  </Field>
                </div>
                <Field label="Notes (client-visible)">
                  <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
                </Field>
                <Field label="Terms">
                  <textarea rows={2} value={terms} onChange={(e) => setTerms(e.target.value)}
                    placeholder="Falls back to studio payment terms" className={inputCls} />
                </Field>
              </div>

              <div className="bg-white/[0.02] border border-white/[0.06] rounded p-4 space-y-1.5 text-[13px] self-start">
                <TotalLine label="Subtotal" value={fmt(totals.subtotal)} />
                {totals.discount_amount > 0 && <TotalLine label={`Discount (${discountPct}%)`} value={`-${fmt(totals.discount_amount)}`} />}
                {totals.tax_amount > 0 && <TotalLine label={taxLabel || `Tax (${taxPct}%)`} value={fmt(totals.tax_amount)} />}
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                  <span className="text-slate-300 font-semibold">Total</span>
                  <span className="text-sky-200 font-bold tabular-nums">{fmt(totals.total)} {currency}</span>
                </div>
                {totals.deposit_amount > 0 && (
                  <>
                    <TotalLine label={`Deposit now (${depositPct}%)`} value={fmt(totals.deposit_amount)} />
                    <TotalLine label="Balance later" value={fmt(totals.balance)} />
                  </>
                )}
              </div>
            </div>

            {/* actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]">
              <Btn onClick={doInstantPdf} busy={busy === "pdf"} icon={<Download size={12} />} tone="ghost">
                Download PDF now
              </Btn>
              <Btn onClick={doSaveDraft} busy={busy === "save"} icon={<CheckCircle2 size={12} />} tone="ghost">
                Save draft
              </Btn>
              <Btn onClick={() => doIssue(false)} busy={busy === "issue"} icon={<FileText size={12} />} tone="solid">
                {hasInvoice ? "Re-issue PDF" : "Issue invoice"}
              </Btn>
              <Btn onClick={() => doIssue(true)} busy={busy === "both"} icon={<Send size={12} />} tone="solid">
                Issue & send
              </Btn>
              <Btn onClick={() => doPreview("invoice")} busy={busy === "preview"} icon={<Eye size={12} />} tone="ghost">
                Preview email
              </Btn>
              {hasInvoice && (
                <>
                  <Btn onClick={() => doSend("invoice")} busy={busy === "invoice"} icon={<Send size={12} />} tone="ghost">
                    Send invoice
                  </Btn>
                  <Btn onClick={() => doSend("reminder")} busy={busy === "reminder"} icon={<BellRing size={12} />} tone="ghost">
                    Send reminder{header?.reminder_count ? ` (${header.reminder_count})` : ""}
                  </Btn>
                  <Btn onClick={() => doSend("receipt")} busy={busy === "receipt"} icon={<CheckCircle2 size={12} />} tone="ghost">
                    Send receipt
                  </Btn>
                </>
              )}
              <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 ml-1">
                <input type="checkbox" checked={attachPdf} onChange={(e) => setAttachPdf(e.target.checked)} />
                <Paperclip size={11} /> attach PDF
              </label>
            </div>

            {/* status + links */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]">
              <span className="mono text-[10px] tracking-[0.2em] text-slate-600">STATUS</span>
              {STATUS_ORDER.map((s) => (
                <button key={s} onClick={() => changeStatus(s)} disabled={busy === "status"}
                  className={`px-2 py-1 rounded border text-[10px] transition-colors ${
                    s === status ? STATUS_TONE[s] : "border-white/10 text-slate-500 hover:text-slate-200 hover:border-white/25"
                  }`}>
                  {s}
                </button>
              ))}
              {portalUrl && (
                <div className="flex items-center gap-3 ml-auto">
                  <a href={portalUrl} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] text-sky-200 hover:underline">
                    <ExternalLink size={12} /> Client link
                  </a>
                  <button onClick={() => { safeClipboardWrite(portalUrl).then(() => toast.success("Copied")).catch(() => toast.error("Clipboard unavailable")); }}
                    className="text-slate-400 hover:text-slate-200" title="Copy client link">
                    <Copy size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* timeline */}
            <div className="pt-3 border-t border-white/[0.06]">
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-1.5">
                <History size={11} /> TIMELINE
              </div>
              {events.data?.length ? (
                <ul className="space-y-1.5 max-h-44 overflow-auto pr-1">
                  {events.data.map((e) => (
                    <li key={e.id} className="flex items-start justify-between gap-3 text-[11.5px]">
                      <span className="text-slate-300">
                        {e.event_type}
                        {e.recipients?.length ? <span className="text-slate-500"> → {e.recipients.join(", ")}</span> : null}
                      </span>
                      <span className="text-slate-600 whitespace-nowrap">
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[11.5px] text-slate-600">No activity yet.</p>
              )}
            </div>
          </>
        )}
      </div>

      {previewOpen && previewData && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setPreviewOpen(false)}>
          <div className="bg-[#050A12] border border-white/10 rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06]">
              <div className="min-w-0">
                <div className="text-[13px] text-slate-100 truncate">{previewData.subject}</div>
                <div className="text-[11px] text-slate-500 truncate">
                  to {previewData.to.join(", ")} · cc {previewData.cc.join(", ")}
                </div>
              </div>
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X size={16} />
              </button>
            </div>
            <div className="overflow-auto flex-1 bg-white/[0.02]">
              <iframe title="Email preview" srcDoc={previewData.html} className="w-full h-[60vh] border-0" />
            </div>
            <div className="px-4 py-3 border-t border-white/[0.06] flex justify-end gap-2">
              <Btn onClick={() => setPreviewOpen(false)} tone="ghost">Close</Btn>
              <Btn onClick={() => doSend("invoice")} busy={busy === "invoice"} icon={<Send size={12} />} tone="solid">
                Send now
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ atoms */
const inputCls =
  "w-full bg-[#01040A] border border-white/10 rounded px-2.5 py-2 text-[12.5px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mono text-[9px] tracking-[0.18em] text-slate-600 block mb-1">{label.toUpperCase()}</span>
      {children}
    </label>
  );
}

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} title={title}
      className="p-1.5 rounded border border-white/10 text-slate-500 hover:text-slate-200 hover:border-white/25">
      {children}
    </button>
  );
}

function TotalLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-200 tabular-nums">{value}</span>
    </div>
  );
}

function Btn({
  onClick, children, icon, busy, tone = "ghost",
}: {
  onClick: () => void; children: React.ReactNode; icon?: React.ReactNode; busy?: boolean; tone?: "ghost" | "solid";
}) {
  return (
    <button onClick={onClick} disabled={busy}
      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded text-[12px] font-medium transition-colors disabled:opacity-60 ${
        tone === "solid"
          ? "bg-sky-400/90 text-[#01040A] hover:bg-sky-300"
          : "border border-white/10 text-slate-300 hover:text-slate-100 hover:border-white/25"
      }`}>
      {busy ? <Loader2 size={12} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}
