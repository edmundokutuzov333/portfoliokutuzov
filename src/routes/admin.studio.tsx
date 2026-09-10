import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { BarChart3, BrainCircuit, ChevronLeft, Download, ExternalLink, Eye, FileImage, FileText, Mail, RefreshCw, WandSparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAdminAuth } from "@/hooks/useAdmin";

export const Route = createLazyFileRoute("/admin/studio")({ component: StudioAdminPage });

type RangeDays = 7 | 30 | 90;
type Tab = "overview" | "library" | "generation" | "export" | "email" | "digital" | "ai";
type MetricMap = Record<string, number>;
type TimelineRow = { day: string; events: number; generations: number; exports: number; emails: number; views: number; ai: number };
type CountRow = { provider?: string; format?: string; event?: string; count?: number; completed?: number; requests?: number };
type Dashboard = {
  summary?: MetricMap;
  timeline?: TimelineRow[];
  generation?: { providers: CountRow[]; average_duration_ms: number };
  exports_by_format?: CountRow[];
  email?: { sent: number; failed: number; average_duration_ms: number };
  digital_card?: CountRow[];
  ai?: { providers: CountRow[]; success_rate: number };
  library?: CardRecord[];
};
type CardRecord = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  status: string;
  public_enabled: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  views: number;
  shares: number;
  exports: number;
  emails: number;
};

const tabs: Array<{ id: Tab; label: string; Icon: typeof BarChart3 }> = [
  { id: "overview", label: "Studio Analytics", Icon: BarChart3 },
  { id: "library", label: "Card Library", Icon: FileImage },
  { id: "generation", label: "Generation Analytics", Icon: WandSparkles },
  { id: "export", label: "Export Analytics", Icon: Download },
  { id: "email", label: "Email Analytics", Icon: Mail },
  { id: "digital", label: "Digital Card Analytics", Icon: ExternalLink },
  { id: "ai", label: "AI Analytics", Icon: BrainCircuit },
];

function StudioAdminPage() {
  const { session, isAdmin, loading } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [days, setDays] = useState<RangeDays>(30);
  const [data, setData] = useState<Dashboard | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const token = session?.access_token;
    if (!token || !isAdmin) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/studio/admin?days=${days}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      if (!response.ok) throw new Error(response.status === 403 ? "Admin access required." : "Analytics could not be loaded.");
      setData((await response.json()) as Dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analytics could not be loaded.");
    } finally {
      setBusy(false);
    }
  }, [days, isAdmin, session?.access_token]);

  useEffect(() => { void load(); }, [load]);

  const cards = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const source = data?.library ?? [];
    return needle ? source.filter((card) => `${card.name} ${card.role} ${card.company} ${card.email}`.toLowerCase().includes(needle)) : source;
  }, [data?.library, query]);

  if (loading) return <CenterState label="Loading Studio Intelligence…" />;
  if (!session || !isAdmin) return <Unauthorized />;

  const summary = data?.summary ?? {};
  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#01040A]/95 px-5 py-4 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/admin" aria-label="Back to Control Room" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 hover:bg-white/[0.04]"><ChevronLeft size={16} /></a>
            <div className="min-w-0"><div className="mono text-[9px] uppercase tracking-[0.28em] text-sky-300/75">KUTUZOV STUDIO / ADMIN</div><h1 className="display truncate text-xl text-metal md:text-2xl">Studio Intelligence</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-lg border border-white/10 p-1 sm:flex">{([7, 30, 90] as const).map((value) => <button key={value} type="button" onClick={() => setDays(value)} className={`rounded-md px-3 py-1.5 text-xs ${days === value ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}>{value}d</button>)}</div>
            <button type="button" onClick={() => void load()} disabled={busy} className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/[0.04] disabled:opacity-50"><RefreshCw size={13} className={busy ? "animate-spin" : ""} /> Refresh</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] gap-6 px-5 py-7 md:px-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <nav aria-label="Studio analytics" className="self-start rounded-xl border border-white/[0.08] bg-[#030814] p-2 lg:sticky lg:top-24">
          {tabs.map(({ id, label, Icon }) => <button key={id} type="button" onClick={() => setTab(id)} className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm transition ${tab === id ? "border-sky-300/15 bg-sky-300/10 text-sky-100" : "border-transparent text-slate-500 hover:bg-white/[0.035] hover:text-slate-200"}`}><Icon size={15} />{label}</button>)}
        </nav>

        <section className="min-w-0">
          {error && <div role="alert" className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-300">{error}</div>}
          {tab === "overview" && <Overview summary={summary} timeline={data?.timeline ?? []} aiSuccess={data?.ai?.success_rate ?? 0} />}
          {tab === "library" && <Library cards={cards} query={query} onQueryChange={setQuery} />}
          {tab === "generation" && <Generation summary={summary} data={data?.generation} />}
          {tab === "export" && <ExportAnalytics summary={summary} rows={data?.exports_by_format ?? []} />}
          {tab === "email" && <EmailAnalytics data={data?.email} />}
          {tab === "digital" && <DigitalCardAnalytics rows={data?.digital_card ?? []} />}
          {tab === "ai" && <AiAnalytics summary={summary} data={data?.ai} />}
        </section>
      </main>
    </div>
  );
}

function CenterState({ label }: { label: string }) { return <div className="grid min-h-screen place-items-center bg-[#01040A] text-sm text-slate-500"><div className="flex items-center gap-2"><RefreshCw size={15} className="animate-spin" />{label}</div></div>; }
function Unauthorized() { return <div className="grid min-h-screen place-items-center bg-[#01040A] px-5"><div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#030814] p-7 text-center"><div className="mono text-[9px] uppercase tracking-[0.24em] text-slate-500">CONTROL ROOM</div><h1 className="display mt-2 text-2xl text-metal">Access restricted</h1><p className="mt-3 text-sm text-slate-500">This workspace is available to administrators only.</p><a className="mt-5 inline-flex rounded-lg bg-sky-300 px-4 py-2 text-sm font-semibold text-[#01040A]" href="/admin">Back to admin</a></div></div>; }
function Panel({ title, kicker, children }: { title: string; kicker?: string; children: ReactNode }) { return <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">{kicker && <div className="mono text-[9px] uppercase tracking-[0.24em] text-sky-300/70">{kicker}</div>}<h2 className="display mt-1 text-xl text-metal">{title}</h2><div className="mt-5">{children}</div></section>; }
function Metric({ label, value, detail }: { label: string; value: number | string; detail?: string }) { const display = typeof value === "number" ? value.toLocaleString("en-US") : value; return <div className="rounded-lg border border-white/[0.07] bg-black/10 p-4"><div className="text-[10px] uppercase tracking-[0.17em] text-slate-600">{label}</div><div className="mt-2 text-2xl font-semibold tracking-tight text-white">{display}</div>{detail && <div className="mt-1 text-[11px] text-slate-500">{detail}</div>}</div>; }

function Overview({ summary, timeline, aiSuccess }: { summary: MetricMap; timeline: TimelineRow[]; aiSuccess: number }) {
  return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Cards created" value={summary.cards_total ?? 0} /><Metric label="Published" value={summary.cards_published ?? 0} /><Metric label="Digital views" value={summary.digital_views ?? 0} /><Metric label="AI requests" value={summary.ai_requests ?? 0} /></div><div className="grid gap-6 xl:grid-cols-[1.45fr_.9fr]"><Panel title="Studio activity" kicker="Event timeline"><div className="h-[330px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={timeline} margin={{ top: 12, right: 10, left: -18, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" /><XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(value) => String(value).slice(5)} /><YAxis tick={{ fill: "#64748b", fontSize: 10 }} allowDecimals={false} /><Tooltip contentStyle={{ background: "#060b14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, color: "#e2e8f0" }} /><Line type="monotone" dataKey="generations" stroke="#7dd3fc" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="exports" stroke="#c4b5fd" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="emails" stroke="#f9a8d4" strokeWidth={2} dot={false} /><Line type="monotone" dataKey="views" stroke="#86efac" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></Panel><Panel title="Operational snapshot" kicker="Selected window"><div className="grid gap-3 sm:grid-cols-2"><Metric label="Generations" value={summary.generations ?? 0} detail={`${summary.successful_generations ?? 0} successful`} /><Metric label="Exports" value={summary.exports ?? 0} /><Metric label="Emails" value={summary.emails_sent ?? 0} detail={`${summary.emails_failed ?? 0} failed`} /><Metric label="AI success" value={`${Number(aiSuccess).toFixed(1)}%`} /></div></Panel></div></div>;
}

function Library({ cards, query, onQueryChange }: { cards: CardRecord[]; query: string; onQueryChange: (value: string) => void }) {
  return <Panel title="Card Library" kicker="Latest 100 cards"><div className="mb-4 flex flex-wrap items-center gap-3"><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search name, company, email..." className="min-w-[220px] flex-1 rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-300/40" /><span className="text-xs text-slate-500">{cards.length} visible</span></div><div className="overflow-x-auto"><table className="w-full min-w-[850px] text-sm"><thead><tr className="border-b border-white/[0.07] text-left text-[10px] uppercase tracking-[0.16em] text-slate-600"><th className="pb-3 pr-4">Identity</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Public</th><th className="pb-3 pr-4">Views</th><th className="pb-3 pr-4">Shares</th><th className="pb-3 pr-4">Exports</th><th className="pb-3">Updated</th></tr></thead><tbody>{cards.map((card) => <tr key={card.id} className="border-b border-white/[0.05] text-slate-300"><td className="py-3 pr-4"><div className="font-medium text-white">{card.name || "Untitled"}</div><div className="text-xs text-slate-500">{card.role}{card.company ? ` · ${card.company}` : ""}</div></td><td className="py-3 pr-4"><span className="rounded-full border border-white/10 px-2 py-1 text-[11px]">{card.status}</span></td><td className="py-3 pr-4">{card.public_enabled ? <span className="text-emerald-300">Live</span> : <span className="text-slate-600">Private</span>}</td><td className="py-3 pr-4">{card.views.toLocaleString()}</td><td className="py-3 pr-4">{card.shares.toLocaleString()}</td><td className="py-3 pr-4">{card.exports.toLocaleString()}</td><td className="py-3 text-slate-500">{new Date(card.updated_at).toLocaleDateString()}</td></tr>)}</tbody></table>{cards.length === 0 && <div className="py-16 text-center text-sm text-slate-600">No cards match the current filter.</div>}</div></Panel>;
}

function Generation({ data, summary }: { data: Dashboard["generation"]; summary: MetricMap }) { const rows = data?.providers ?? []; return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Started" value={summary.generations ?? 0} /><Metric label="Completed" value={summary.successful_generations ?? 0} /><Metric label="Failed" value={summary.failed_generations ?? 0} detail={`${data?.average_duration_ms ?? 0} ms average`} /></div><Panel title="Generation providers" kicker="Provider performance"><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={rows} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.07)" /><XAxis dataKey="provider" tick={{ fill: "#64748b", fontSize: 11 }} /><YAxis tick={{ fill: "#64748b", fontSize: 10 }} allowDecimals={false} /><Tooltip contentStyle={{ background: "#060b14", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8 }} /><Bar dataKey="completed" fill="#7dd3fc" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div></Panel></div>; }
function ExportAnalytics({ rows, summary }: { rows: CountRow[]; summary: MetricMap }) { const vector = rows.find((row) => row.format === "svg")?.count ?? 0; const raster = rows.filter((row) => row.format === "png" || row.format === "pdf").reduce((total, row) => total + (row.count ?? 0), 0); return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Exports" value={summary.exports ?? 0} /><Metric label="SVG / vector" value={vector} /><Metric label="PNG + PDF" value={raster} /></div><Panel title="Export mix" kicker="Output formats"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{rows.map((row) => <div key={row.format} className="rounded-lg border border-white/[0.07] p-4"><div className="flex items-center gap-2 text-slate-500"><FileText size={14} /><span className="text-[10px] uppercase tracking-[0.18em]">{row.format ?? "unknown"}</span></div><div className="mt-3 text-2xl font-semibold text-white">{(row.count ?? 0).toLocaleString()}</div></div>)}</div></Panel></div>; }
function EmailAnalytics({ data }: { data: Dashboard["email"] }) { const sent = data?.sent ?? 0; const failed = data?.failed ?? 0; const total = sent + failed; return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Sent" value={sent} /><Metric label="Failed" value={failed} /><Metric label="Delivery rate" value={`${total ? ((sent / total) * 100).toFixed(1) : "0.0"}%`} detail={`${data?.average_duration_ms ?? 0} ms average`} /></div><Panel title="Email delivery" kicker="PDF + PNG + vCard"><div className="grid gap-6 md:grid-cols-2"><Insight icon={<Mail size={17} />} title="Outbound delivery" value={`${sent.toLocaleString()} successful sends`} detail="Measured from the server-side delivery event." /><Insight icon={<FileText size={17} />} title="Bundle" value="PDF · PNG · vCard" detail="The Studio email action sends the generated identity package." /></div></Panel></div>; }
function DigitalCardAnalytics({ rows }: { rows: CountRow[] }) { const map = new Map(rows.map((row) => [row.event, row.count ?? 0])); const outbound = (map.get("digital_card_email_click") ?? 0) + (map.get("digital_card_phone_click") ?? 0) + (map.get("digital_card_website_click") ?? 0); return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Views" value={map.get("digital_card_view") ?? 0} /><Metric label="Shares" value={map.get("digital_card_share") ?? 0} /><Metric label="Save contact" value={map.get("digital_card_save_contact") ?? 0} /><Metric label="Outbound clicks" value={outbound} /></div><Panel title="Digital card engagement" kicker="Public identity surface"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{rows.filter((row) => row.event !== "digital_card_view").map((row) => <Insight key={row.event} icon={<Eye size={16} />} title={(row.event ?? "interaction").replace("digital_card_", "").replaceAll("_", " ")} value={(row.count ?? 0).toLocaleString()} detail="Interaction recorded from the public card." />)}</div></Panel></div>; }
function AiAnalytics({ data, summary }: { data: Dashboard["ai"]; summary: MetricMap }) { return <div className="space-y-6"><div className="grid gap-3 sm:grid-cols-3"><Metric label="Requests" value={summary.ai_requests ?? 0} /><Metric label="Successful" value={summary.ai_successes ?? 0} /><Metric label="Success rate" value={`${Number(data?.success_rate ?? 0).toFixed(1)}%`} /></div><Panel title="AI provider usage" kicker="Creative Engine + Assistant"><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{(data?.providers ?? []).map((row) => <Insight key={row.provider} icon={<BrainCircuit size={16} />} title={row.provider ?? "unknown"} value={(row.requests ?? 0).toLocaleString()} detail="Successful AI responses in the selected window." />)}{(data?.providers ?? []).length === 0 && <div className="text-sm text-slate-600">No successful AI events in this window.</div>}</div></Panel></div>; }
function Insight({ icon, title, value, detail }: { icon: ReactNode; title: string; value: string; detail: string }) { return <div className="rounded-lg border border-white/[0.07] p-4"><div className="flex items-center gap-2 text-slate-500">{icon}<span className="text-[10px] uppercase tracking-[0.15em]">{title}</span></div><div className="mt-3 text-xl font-semibold capitalize text-white">{value}</div><div className="mt-1 text-[11px] leading-relaxed text-slate-600">{detail}</div></div>; }
