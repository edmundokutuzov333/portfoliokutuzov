import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, RefreshCw, Copy, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { getInvoiceWorkspace } from "@/lib/invoice.functions";
import { money } from "@/lib/invoice-core";

type Row = {
  id: string;
  full_name: string;
  company_name: string | null;
  email: string;
  project_type: string;
  invoice_number: string | null;
  invoice_status: string | null;
  invoice_currency: string | null;
  invoice_due_date: string | null;
  invoice_issue_date: string | null;
  invoice_paid_reported_at: string | null;
  invoice_public_token: string | null;
  total: number;
  overdue: boolean;
};

type Kpis = {
  count: number;
  outstanding: number;
  overdue: number;
  paid: number;
  awaitingConfirmation: number;
};

const FILTERS = ["all", "open", "overdue", "verifying", "paid"] as const;
type Filter = (typeof FILTERS)[number];

export function InvoiceWorkspace() {
  const load = useServerFn(getInvoiceWorkspace);
  const [rows, setRows] = useState<Row[]>([]);
  const [kpis, setKpis] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const refresh = async () => {
    setLoading(true);
    try {
      const res = (await load({ data: {} as never })) as unknown as { invoices: Row[]; kpis: Kpis };
      setRows(res.invoices ?? []);
      setKpis(res.kpis ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currency = rows[0]?.invoice_currency?.toUpperCase() || "EUR";

  const visible = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "paid"
            ? r.invoice_status === "paid"
            : filter === "overdue"
              ? r.overdue
              : filter === "verifying"
                ? Boolean(r.invoice_paid_reported_at) && r.invoice_status !== "paid"
                : r.invoice_status !== "paid" && r.invoice_status !== "void";
      if (!matchFilter) return false;
      if (!term) return true;
      return [r.full_name, r.company_name, r.email, r.invoice_number, r.project_type]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [rows, filter, q]);

  const copyPortal = async (token: string | null) => {
    if (!token) return toast.error("No client link yet — generate the invoice first.");
    await navigator.clipboard.writeText(`${window.location.origin}/i/${token}`);
    toast.success("Client link copied");
  };

  return (
    <section>
      <header className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">INVOICING</div>
          <h2 className="display text-2xl mt-1">Financial workspace</h2>
        </div>
        <button
          onClick={() => void refresh()}
          className="inline-flex items-center gap-2 mono text-[11px] px-3 py-2 rounded border border-white/10 text-slate-300 hover:text-white"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <Kpi label="Outstanding" value={money(kpis?.outstanding ?? 0, currency)} tone="sky" />
        <Kpi label="Overdue" value={money(kpis?.overdue ?? 0, currency)} tone="rose" Icon={AlertTriangle} />
        <Kpi label="Paid" value={money(kpis?.paid ?? 0, currency)} tone="emerald" Icon={CheckCircle2} />
        <Kpi
          label="Awaiting confirmation"
          value={String(kpis?.awaitingConfirmation ?? 0)}
          tone="amber"
          Icon={Clock}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap mt-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              filter === f
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search client, number…"
          className="ml-auto bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50"
        />
      </div>

      <div className="mt-4 border border-white/[0.08] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-10 grid place-items-center text-slate-500">
            <Loader2 className="animate-spin" size={18} />
          </div>
        ) : visible.length === 0 ? (
          <p className="p-8 text-sm text-slate-500">No invoices for this filter yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] mono text-[10px] tracking-[0.18em] text-slate-500">
                <th className="px-4 py-3">NUMBER</th>
                <th className="px-4 py-3">CLIENT</th>
                <th className="px-4 py-3">DUE</th>
                <th className="px-4 py-3 text-right">TOTAL</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => (
                <tr key={r.id} className="border-t border-white/[0.06] text-[13px]">
                  <td className="px-4 py-3 mono text-slate-300">{r.invoice_number}</td>
                  <td className="px-4 py-3">
                    <div className="text-slate-100">{r.company_name || r.full_name}</div>
                    <div className="text-[11px] text-slate-500">{r.project_type}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{r.invoice_due_date ?? "—"}</td>
                  <td className="px-4 py-3 text-right text-slate-100">
                    {money(r.total, (r.invoice_currency || currency).toUpperCase())}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill row={r} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => void copyPortal(r.invoice_public_token)}
                      className="inline-flex items-center gap-1.5 mono text-[10px] px-2.5 py-1.5 rounded border border-white/10 text-slate-300 hover:text-white"
                    >
                      <Copy size={12} /> LINK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function Kpi({
  label,
  value,
  tone,
  Icon,
}: {
  label: string;
  value: string;
  tone: "sky" | "rose" | "emerald" | "amber";
  Icon?: typeof Clock;
}) {
  const tones: Record<string, string> = {
    sky: "text-sky-200 border-sky-300/20",
    rose: "text-rose-200 border-rose-400/20",
    emerald: "text-emerald-200 border-emerald-400/20",
    amber: "text-amber-200 border-amber-400/20",
  };
  return (
    <div className={`rounded-lg border bg-white/[0.02] p-4 ${tones[tone]}`}>
      <div className="mono text-[10px] tracking-[0.18em] text-slate-500 flex items-center gap-1.5">
        {Icon ? <Icon size={11} /> : null} {label.toUpperCase()}
      </div>
      <div className="display text-xl mt-2">{value}</div>
    </div>
  );
}

function StatusPill({ row }: { row: Row }) {
  const verifying = Boolean(row.invoice_paid_reported_at) && row.invoice_status !== "paid";
  const label = row.invoice_status === "paid"
    ? "paid"
    : verifying
      ? "verifying"
      : row.overdue
        ? "overdue"
        : (row.invoice_status ?? "draft");
  const cls =
    label === "paid"
      ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/30"
      : label === "overdue"
        ? "bg-rose-500/10 text-rose-200 border-rose-400/30"
        : label === "verifying"
          ? "bg-amber-400/10 text-amber-200 border-amber-400/30"
          : "bg-white/[0.04] text-slate-300 border-white/10";
  return <span className={`mono text-[10px] px-2 py-1 rounded-full border ${cls}`}>{label.toUpperCase()}</span>;
}
