import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  CircleDollarSign,
  Download,
  FileText,
  Inbox,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
  WalletCards,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { InvoiceWorkspace } from "@/components/admin/InvoiceWorkspace";
import { supabase } from "@/integrations/supabase/client";
import {
  BOOKING_STATUSES,
  LEAD_STAGES,
  type BookingStatus,
  type LeadStage,
  addLeadActivity,
  createLeadTask,
  createProjectFromLead,
  exportAdminAudience,
  getAdminLead,
  getOperationsOverview,
  getStudioOperationsSnapshot,
  listAdminAudience,
  listAdminBookings,
  listAdminClientsCRM,
  listAdminInbox,
  listAdminLeads,
  listAdminTasks,
  listLeadOwners,
  listAdminPayments,
  recordInvoicePayment,
  updateAdminBooking,
  updateAdminLead,
  updateAdminSubscriber,
  updateAdminWaitlist,
  updateLeadTask,
} from "@/lib/operations.functions";

type LeadRow = Record<string, any>;
type BookingRow = Record<string, any>;
type ClientRow = Record<string, any>;
type OwnerRow = { user_id: string; email: string; role: string };
type AudienceData = { subscribers: Record<string, any>[]; waitlist: Record<string, any>[] };
type LeadDetailData = {
  lead: LeadRow;
  activities: Record<string, any>[];
  tasks: Record<string, any>[];
  payments: Record<string, any>[];
};

type Tab = "overview" | "inbox" | "leads" | "bookings" | "audience" | "crm" | "finance" | "studio" | "tasks";

const tabs: Array<{ id: Tab; label: string; Icon: typeof Inbox }> = [
  { id: "overview", label: "Overview", Icon: Activity },
  { id: "inbox", label: "Unified Inbox", Icon: Inbox },
  { id: "leads", label: "Leads", Icon: Users },
  { id: "bookings", label: "Bookings", Icon: CalendarClock },
  { id: "audience", label: "Audience", Icon: Mail },
  { id: "crm", label: "Client CRM", Icon: Users },
  { id: "finance", label: "Finance", Icon: WalletCards },
  { id: "studio", label: "Studio", Icon: Sparkles },
  { id: "tasks", label: "Tasks", Icon: Bell },
];

const stageLabels: Record<LeadStage, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  archived: "Archived",
};

const bookingLabels: Record<BookingStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

function adminCall<T>(fn: any) {
  return fn({ data: {} }) as Promise<T>;
}

export function Phase3OperationsOS({
  onNavigate,
  initialTab = "overview",
  audienceMode = "all",
  financeMode = "full",
}: {
  onNavigate?: (section: string) => void;
  initialTab?: Tab;
  audienceMode?: "all" | "newsletter" | "studio";
  financeMode?: "full" | "payments";
}) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const qc = useQueryClient();
  const overview = useServerFn(getOperationsOverview);
  const inboxLoader = useServerFn(listAdminInbox);
  const leadLoader = useServerFn(listAdminLeads);
  const [search, setSearch] = useState("");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabase
      .channel("phase3-operations-os")
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_leads" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_activities" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_tasks" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "booking_requests" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "newsletter_subscribers" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "studio_waitlist" }, () => invalidateOps(qc))
      .on("postgres_changes", { event: "*", schema: "public", table: "crm_payments" }, () => invalidateOps(qc))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [qc]);

  const overviewQuery = useQuery({
    queryKey: ["phase3-overview"],
    queryFn: () => adminCall(overview),
    staleTime: 15_000,
  });

  const inboxQuery = useQuery({
    queryKey: ["phase3-inbox", search],
    queryFn: () => inboxLoader({ data: { kind: "all", search: search.trim() || undefined, limit: 300 } }),
    enabled: tab === "inbox",
    staleTime: 5_000,
  });
  const inboxRows = (inboxQuery.data as any)?.rows ?? [];

  const leadOverviewQuery = useQuery({
    queryKey: ["phase3-lead-overview"],
    queryFn: () => leadLoader({ data: { limit: 200 } }),
    enabled: tab === "overview",
    staleTime: 10_000,
  });
  const overviewLeads = (leadOverviewQuery.data as any)?.rows ?? [];

  const overviewData: any = overviewQuery.data ?? {};
  const tabsWithBadges = tabs.map((item) => ({
    ...item,
    badge: item.id === "leads" ? overviewData.leads?.new ?? 0 : item.id === "bookings" ? overviewData.bookings?.requested ?? 0 : 0,
  }));

  return (
    <div className="min-w-0">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono flex items-center gap-2 text-[10px] tracking-[0.28em] text-sky-300/80">
            <Activity size={13} /> OPERATIONS OS / PHASE 3
          </div>
          <h2 className="display mt-1 text-3xl text-metal">Kutuzov Operations Control Room.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            Leads, inbox, bookings, audience, client relationships, payments and Studio operations in one administrative surface.
          </p>
        </div>
        <button type="button" onClick={() => void refreshOps(qc)} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-300 hover:border-sky-300/30 hover:text-white">
          <RefreshCw size={13} /> Refresh data
        </button>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabsWithBadges.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.12em] transition ${tab === id ? "border-sky-300/35 bg-sky-300/10 text-sky-100" : "border-white/[0.08] text-slate-500 hover:text-white"}`}
          >
            <Icon size={12} /> {label}
            {badge > 0 ? <span className="rounded-full bg-sky-300 px-1.5 py-0.5 text-[9px] font-semibold text-[#01040A]">{badge}</span> : null}
          </button>
        ))}
      </div>

      {tab === "overview" && <OperationsOverview data={overviewQuery.data} leads={overviewLeads} onSelectLead={(id: string) => { setSelectedLeadId(id); setTab("leads"); }} onNavigate={onNavigate} />}
      {tab === "inbox" && <UnifiedInbox search={search} setSearch={setSearch} rows={inboxRows} onSelectLead={(id: string) => { setSelectedLeadId(id); setTab("leads"); }} />}
      {tab === "leads" && <LeadsWorkspace search={search} setSearch={setSearch} selectedLeadId={selectedLeadId} setSelectedLeadId={setSelectedLeadId} />}
      {tab === "bookings" && <BookingsWorkspace />}
      {tab === "audience" && <AudienceWorkspace mode={audienceMode} />}
      {tab === "crm" && <ClientCRMWorkspace />}
      {tab === "finance" && <FinanceWorkspace mode={financeMode} />}
      {tab === "studio" && <StudioWorkspace />}
      {tab === "tasks" && <TasksWorkspace />}
    </div>
  );
}

function OperationsOverview({ data, leads, onSelectLead, onNavigate }: any) {
  const finance = data?.finance ?? {};
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Active / new leads" value={data?.leads?.new ?? 0} detail="New opportunities waiting for action" />
        <MetricCard label="Published projects" value={data?.projects?.published ?? 0} detail={`${data?.projects?.drafts ?? 0} drafts`} />
        <MetricCard label="Bookings requested" value={data?.bookings?.requested ?? 0} detail={`${data?.bookings?.confirmed ?? 0} confirmed`} />
        <MetricCard label="Newsletter + waitlist" value={(data?.audience?.newsletter_active ?? 0) + (data?.audience?.studio_waitlist_active ?? 0)} detail="Active audience records" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
        <Panel kicker="Lead lifecycle" title="Pipeline">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {LEAD_STAGES.map((stage) => (
              <button key={stage} type="button" onClick={() => leads.find((r: any) => r.stage === stage)?.id && onSelectLead(leads.find((r: any) => r.stage === stage).id)} className="rounded-lg border border-white/[0.06] p-3 text-left hover:border-sky-300/25">
                <div className="mono text-[9px] uppercase tracking-wider text-slate-600">{stageLabels[stage]}</div>
                <div className="mt-2 text-2xl font-semibold text-white">{data?.leads?.[stage] ?? 0}</div>
              </button>
            ))}
          </div>
        </Panel>
        <Panel kicker="Finance" title="Money at a glance">
          <MoneyRows label="Revenue" rows={finance.revenue_by_currency ?? {}} icon={<CircleDollarSign size={14} />} />
          <div className="mt-3"><MoneyRows label="Outstanding" rows={finance.outstanding_by_currency ?? {}} icon={<WalletCards size={14} />} /></div>
          <div className="mt-3"><MoneyRows label="Overdue" rows={finance.overdue_by_currency ?? {}} icon={<XCircle size={14} />} /></div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel kicker="Inbox" title="Latest leads">
          {leads.slice(0, 6).map((row: any) => <LeadCompact key={row.id} row={row} onClick={() => onSelectLead(row.id)} />)}
          {leads.length === 0 && <EmptyState label="No leads yet." />}
        </Panel>
        <Panel kicker="Actions" title="Jump to workspace">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Open inbox", "inbox", Inbox],
              ["New project", "portfolio", Plus],
              ["Invoices", "invoice", FileText],
              ["Media library", "media", Sparkles],
            ].map(([label, section, Icon]) => (
              <button key={String(label)} type="button" onClick={() => onNavigate?.(String(section))} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/[0.07] px-3 text-xs text-slate-400 hover:border-sky-300/25 hover:text-white">
                <Icon size={13} className="text-sky-300" /> {String(label)}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function UnifiedInbox({ rows, search, setSearch, onSelectLead }: any) {
  const kinds = useMemo(() => Array.from(new Set(rows.map((row: any) => row.kind))), [rows]);
  const [kind, setKind] = useState("all");
  const filtered = kind === "all" ? rows : rows.filter((row: any) => row.kind === kind);
  return (
    <div>
      <SectionHeader kicker="Operations / Inbox" title="Unified lead inbox." description="Every contact and briefing becomes a CRM lead while retaining its original source record." />
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1"><Search size={14} className="absolute left-3 top-3 text-slate-600" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, company, email or project type..." className="adm-input pl-9" /></div>
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="adm-input max-w-[170px]"><option value="all">All sources</option>{kinds.map((k: any) => <option key={k} value={k}>{String(k).replaceAll("_", " ")}</option>)}</select>
      </div>
      <div className="grid gap-2">
        {filtered.map((row: any) => (
          <button key={row.id} type="button" onClick={() => row.lead_id && onSelectLead(row.lead_id)} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-[#030814] p-4 text-left hover:border-sky-300/25">
            <div className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-sky-300"><Inbox size={14} /></div>
            <div className="min-w-[190px] flex-1"><div className="text-sm font-medium text-white">{row.full_name ?? "Unnamed"}</div><div className="mt-1 text-xs text-slate-600">{row.email ?? "No email"}{row.company_name ? ` · ${row.company_name}` : ""}</div></div>
            <Pill label={row.stage ? (stageLabels[row.stage as LeadStage] ?? row.stage) : (row.status ?? "New")} tone={row.stage ? stageTone(row.stage) : "muted"} />
            <span className="mono text-[10px] text-slate-600">{String(row.kind ?? "").replaceAll("_", " ")}</span>
            <span className="mono text-[10px] text-slate-600">{formatDate(row.updated_at)}</span>
          </button>
        ))}
        {filtered.length === 0 && <EmptyState label="No leads match the current filter." />}
      </div>
    </div>
  );
}

function LeadsWorkspace({ search, setSearch, selectedLeadId, setSelectedLeadId }: any) {
  const load = useServerFn(getAdminLead);
  const ownersQuery = useQuery({ queryKey: ["phase3-owners"], queryFn: () => adminCall(listLeadOwners) });
  const clientsQuery = useQuery({ queryKey: ["phase3-crm-clients"], queryFn: () => adminCall(listAdminClientsCRM) });
  const [stageFilter, setStageFilter] = useState<LeadStage | "all">("all");
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [detail, setDetail] = useState<LeadDetailData | null>(null);
  const [busy, setBusy] = useState(false);
  const list = useServerFn(listAdminLeads);

  const reload = async () => {
    const result = await list({ data: { search: search.trim() || undefined, stage: stageFilter === "all" ? undefined : stageFilter, limit: 200 } });
    setRows((result as any).rows ?? []);
    if (!selectedLeadId && (result as any).rows?.[0]?.id) setSelectedLeadId((result as any).rows[0].id);
  };

  useEffect(() => { void reload(); }, [search, stageFilter]);
  useEffect(() => {
    if (!selectedLeadId) return;
    setBusy(true);
    load({ data: { id: selectedLeadId } }).then((result: any) => setDetail(result)).catch((error: any) => toast.error(error?.message ?? "Lead could not be loaded")).finally(() => setBusy(false));
  }, [selectedLeadId, load]);

  const saveLead = useServerFn(updateAdminLead);
  const addActivity = useServerFn(addLeadActivity);
  const newTask = useServerFn(createLeadTask);
  const makeProject = useServerFn(createProjectFromLead);
  const pay = useServerFn(recordInvoicePayment);
  const updateTaskFn = useServerFn(updateLeadTask);
  const qc = useQueryClient();

  const current = detail?.lead;
  const clients = (clientsQuery.data as any)?.rows ?? [];
  const owners = (ownersQuery.data as any)?.rows ?? [];

  const patchLead = async (patch: any) => {
    if (!current) return;
    try {
      await saveLead({ data: { id: current.id, ...patch } });
      await load({ data: { id: current.id } }).then((result: any) => setDetail(result));
      await qc.invalidateQueries({ queryKey: ["phase3-overview"] });
      toast.success("Lead updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Lead update failed");
    }
  };

  const changeStage = async (next: LeadStage) => {
    const previous = current?.stage;
    await patchLead({ stage: next });
    if (current && previous !== next) {
      await addActivity({ data: { lead_id: current.id, activity_type: "stage_change", body: `Stage changed to ${stageLabels[next]}.`, metadata: { from: previous, to: next } } });
      await load({ data: { id: current.id } }).then((result: any) => setDetail(result));
    }
  };

  const onCreateProject = async () => {
    if (!current) return;
    try {
      const result = await makeProject({ data: { id: current.id } });
      toast.success("Project draft created");
      if ((result as any).project_id) window.location.assign(`/admin?project=${(result as any).project_id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Project could not be created");
    }
  };

  const onPayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!current) return;
    const form = new FormData(event.currentTarget);
    try {
      await pay({ data: {
        lead_id: current.id,
        briefing_id: current.source_type === "briefing" ? current.source_id : null,
        amount: Number(form.get("amount")),
        currency: String(form.get("currency") || current.invoice_currency || "USD"),
        method: String(form.get("method") || "") || null,
        reference: String(form.get("reference") || "") || null,
        status: "confirmed",
        paid_at: new Date().toISOString(),
        notes: String(form.get("notes") || "") || null,
      }});
      event.currentTarget.reset();
      await load({ data: { id: current.id } }).then((result: any) => setDetail(result));
      await qc.invalidateQueries({ queryKey: ["phase3-overview"] });
      toast.success("Payment recorded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed");
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[.72fr 1.28fr]">
      <section className="min-w-0">
        <SectionHeader kicker="Operations / CRM" title="Leads." description="Lifecycle state, owner, client, project, activity and finance context." />
        <div className="mb-3 flex flex-wrap gap-2">{["all", ...LEAD_STAGES].map((stage) => <button key={stage} type="button" onClick={() => setStageFilter(stage as any)} className={`rounded-full border px-3 py-1.5 text-[10px] uppercase ${stageFilter === stage ? "border-sky-300/30 bg-sky-300/10 text-sky-100" : "border-white/[0.08] text-slate-500"}`}>{stage === "all" ? "All" : stageLabels[stage as LeadStage]} {stage !== "all" ? `· ${rows.filter((r) => r.stage === stage).length}` : ""}</button>)}</div>
        <div className="mb-3 relative"><Search size={13} className="absolute left-3 top-3 text-slate-600" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search leads..." className="adm-input pl-9" /></div>
        <div className="space-y-2">{rows.map((row) => <button key={row.id} type="button" onClick={() => setSelectedLeadId(row.id)} className={`w-full rounded-xl border p-3 text-left ${selectedLeadId === row.id ? "border-sky-300/35 bg-sky-300/[0.04]" : "border-white/[0.07] bg-[#030814]"}`}><div className="flex items-start gap-3"><div className="min-w-0 flex-1"><div className="truncate text-sm text-white">{row.title ?? "Unnamed"}</div><div className="mt-1 truncate text-[11px] text-slate-600">{row.email ?? "No email"}{row.company_name ? ` · ${row.company_name}` : ""}</div></div><Pill label={stageLabels[row.stage as LeadStage] ?? row.stage} tone={stageTone(row.stage)} /></div><div className="mt-2 text-[10px] text-slate-600">{row.company_name ?? row.project_type ?? "No project context"} · {formatDate(row.updated_at)}</div></button>)}{rows.length === 0 && <EmptyState label="No leads found." />}</div>
      </section>

      <section className="min-w-0">
        {busy && !current ? <EmptyState label="Loading lead..." /> : current ? <LeadDetail lead={current} detail={detail!} clients={clients} owners={owners} onPatch={patchLead} onStage={changeStage} onCreateProject={onCreateProject} onPayment={onPayment} addActivity={addActivity} createTask={newTask} updateTask={async (data: any) => { await updateTaskFn({ data }); await load({ data: { id: current.id } }).then((result: any) => setDetail(result)); }} /> : <EmptyState label="Select a lead." />}
      </section>
    </div>
  );
}

function LeadDetail({ lead, detail, clients, owners, onPatch, onStage, onCreateProject, onPayment, addActivity, createTask, updateTask }: any) {
  const [note, setNote] = useState(lead.notes ?? "");
  const [activity, setActivity] = useState("");
  const [activityType, setActivityType] = useState<"note" | "email" | "call" | "meeting">("note");
  useEffect(() => setNote(lead.notes ?? ""), [lead.id, lead.notes]);
  const canPay = lead.source_type === "briefing" && !!lead.invoice_number;

  return (
    <div className="space-y-4">
      <Panel kicker={`Lead / ${lead.source_type}`} title={lead.full_name ?? "Lead"}>
        <div className="grid gap-3 md:grid-cols-2">
          <Info label="Company" value={lead.company_name} />
          <Info label="Email" value={lead.email} />
          <Info label="Phone" value={lead.phone} />
          <Info label="Project" value={lead.project_type} />
          <Info label="Budget" value={lead.budget_amount ? `${lead.budget_currency ?? ""} ${Number(lead.budget_amount).toLocaleString()}` : lead.budget_label} />
          <Info label="Timeline" value={lead.timeline} />
          <Info label="Source" value={lead.source} />
          <Info label="Linked project" value={lead.project_title} />
          <Info label="Lead ID" value={lead.id} />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <FieldSelect label="Stage" value={lead.stage} onChange={(value) => void onStage(value)} options={LEAD_STAGES.map((stage) => ({ value: stage, label: stageLabels[stage] }))} />
          <FieldSelect label="Owner" value={lead.owner_user_id ?? ""} onChange={(value) => void onPatch({ owner_user_id: value || null })} options={[{ value: "", label: "Unassigned" }, ...owners.map((owner: OwnerRow) => ({ value: owner.user_id, label: owner.email }))]} />
          <FieldSelect label="Client" value={lead.client_id ?? ""} onChange={(value) => void onPatch({ client_id: value || null })} options={[{ value: "", label: "No client" }, ...clients.map((client: ClientRow) => ({ value: client.id, label: client.name }))]} />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
          <FieldInput label="Next action" type="datetime-local" value={toLocalInput(lead.next_action_at)} onChange={(value: string) => void onPatch({ next_action_at: value ? new Date(value).toISOString() : null })} />
          <button type="button" onClick={() => void onCreateProject()} className="self-end inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-sky-300/30 px-4 text-xs text-sky-200 hover:bg-sky-300/10"><Plus size={13} /> Create project draft</button>
        </div>
        <div className="mt-3"><label className="block space-y-2"><span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Internal notes</span><textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="adm-input"/><button type="button" onClick={() => void onPatch({ notes: note || null })} className="mt-2 inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-300">Save notes</button></label></div>
      </Panel>

        {Array.isArray(lead.attachments) && lead.attachments.length > 0 && <Panel kicker="Brief / Attachments" title={`${lead.attachments.length} attachment${lead.attachments.length === 1 ? "" : "s"}`}><div className="space-y-2">{lead.attachments.map((attachment: any, index: number) => { const item = typeof attachment === "string" ? { url: attachment, name: `Attachment ${index + 1}` } : attachment ?? {}; return <a key={`${item.url ?? "attachment"}-${index}`} href={item.url ?? "#"} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-white/[0.06] p-3 text-xs text-slate-300 hover:border-sky-300/25 hover:text-white"><FileText size={14} className="text-sky-300" /><span className="min-w-0 flex-1 truncate">{item.name ?? item.filename ?? `Attachment ${index + 1}`}</span><ArrowRight size={12} /></a>; })}</div></Panel>}
      <Panel kicker="Activity" title="Timeline">
        <div className="grid gap-2 md:grid-cols-[150px_1fr_auto]">
          <select value={activityType} onChange={(e) => setActivityType(e.target.value as typeof activityType)} className="adm-input">
            <option value="note">Note</option><option value="email">Email</option><option value="call">Call</option><option value="meeting">Meeting</option>
          </select>
          <input value={activity} onChange={(e) => setActivity(e.target.value)} placeholder="Describe the interaction..." className="adm-input"/>
          <button type="button" disabled={!activity.trim()} onClick={async () => { await addActivity({ data: { lead_id: lead.id, activity_type: activityType, body: activity.trim(), metadata: {} } }); setActivity(""); toast.success("Activity added"); }} className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-sky-300/30 text-sky-200"><Plus size={14}/></button>
        </div>
        <div className="mt-4 space-y-2">{detail.activities.map((row: any) => <div key={row.id} className="rounded-lg border border-white/[0.06] p-3"><div className="flex justify-between gap-2"><span className="mono text-[9px] uppercase tracking-wider text-sky-300/70">{row.activity_type}</span><span className="text-[10px] text-slate-600">{formatDate(row.created_at)}</span></div><p className="mt-2 text-sm text-slate-300">{row.body}</p></div>)}{detail.activities.length===0 && <EmptyState label="No activity yet." />}</div>
      </Panel>

      {canPay && <Panel kicker="Finance / Payments" title={`Invoice ${lead.invoice_number}`}><div className="grid gap-3 sm:grid-cols-3"><Info label="Total" value={`${lead.invoice_currency ?? ""} ${Number(lead.invoice_total ?? 0).toLocaleString()}`} /><Info label="Status" value={normalizeInvoiceStatus(lead.invoice_status)} /><Info label="Due" value={lead.invoice_due_date ? formatDate(lead.invoice_due_date) : "Not set"} /></div><form onSubmit={onPayment} className="mt-4 grid gap-2 md:grid-cols-[130px_90px_1fr_1fr_auto]"><FieldInput name="amount" label="Amount" type="number" min="0.01" step="0.01" required /><FieldInput name="currency" label="Currency" defaultValue={lead.invoice_currency ?? "USD"} /><FieldInput name="method" label="Method" placeholder="Bank / cash / card" /><FieldInput name="reference" label="Reference" placeholder="Payment reference" /><button type="submit" className="self-end inline-flex min-h-10 items-center justify-center rounded-lg border border-emerald-300/25 px-3 text-[10px] text-emerald-200">Record payment</button></form><div className="mt-4 space-y-2">{detail.payments.map((row:any)=><div key={row.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3 text-xs"><span className="text-slate-300">{row.currency} {Number(row.amount).toLocaleString()} · {row.method ?? "unspecified"}</span><span className="mono text-[9px] text-slate-600">{row.status} · {formatDate(row.created_at)}</span></div>)}</div></Panel>}

      <Panel kicker="Tasks" title="Follow-up">
        <TaskCreate leadId={lead.id} owners={owners} onCreate={async (data: any) => { await createTask({ data }); toast.success("Task created"); }} />
        <div className="mt-4 space-y-2">{detail.tasks.map((task: any) => <div key={task.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/[0.06] p-3"><div className="min-w-0 flex-1"><div className="text-sm text-slate-300">{task.title}</div><div className="text-[10px] text-slate-600">{task.kind} · due {formatDate(task.due_at)}</div></div><Pill label={task.status} tone={task.status === "pending" ? "amber" : "muted"} /><button type="button" disabled={task.status !== "pending"} onClick={() => void updateTask({ id: task.id, status: "completed" })} className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-slate-400">Complete</button></div>)}</div>
      </Panel>
    </div>
  );
}

function BookingsWorkspace() {
  const load = useServerFn(listAdminBookings);
  const update = useServerFn(updateAdminBooking);
  const [rows, setRows] = useState<BookingRow[]>([]);
  const refresh = () => void load({ data: {} }).then((result: any) => setRows(result.rows ?? [])).catch((error: any) => toast.error(error?.message ?? "Bookings could not be loaded"));
  useEffect(() => { refresh(); }, []);
  return <div><SectionHeader kicker="Operations / Scheduling" title="Bookings." description="Requested, confirmed, rescheduled, completed and cancelled." /><div className="space-y-2">{rows.map((row)=><article key={row.id} className="rounded-xl border border-white/[0.07] bg-[#030814] p-4"><div className="flex flex-wrap items-start gap-3"><div className="min-w-0 flex-1"><div className="text-sm font-medium text-white">{row.name}</div><div className="mt-1 text-xs text-slate-600"><a className="hover:text-sky-200" href={`mailto:${row.email}`}>{row.email}</a>{row.timezone ? ` · ${row.timezone}` : ""}</div></div><Pill label={bookingLabels[row.booking_status as BookingStatus] ?? row.booking_status} tone={row.booking_status === "confirmed" ? "green" : row.booking_status === "cancelled" ? "muted" : "sky"} /></div><div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_160px]"><Info label="Requested date" value={row.preferred_date} /><Info label="Preferred time" value={row.preferred_time} /><FieldSelect label="Status" value={row.booking_status} onChange={async (value) => { try { await update({ data: { id: row.id, booking_status: value as BookingStatus } }); refresh(); toast.success("Booking status updated"); } catch(error){toast.error(error instanceof Error?error.message:"Update failed");} }} options={BOOKING_STATUSES.map((status)=>({value:status,label:bookingLabels[status]}))}/></div><div className="mt-3"><FieldInput label="Internal notes" defaultValue={row.admin_notes ?? ""} onBlur={async (value: string) => { if(value !== (row.admin_notes ?? "")) { try { await update({data:{id:row.id,admin_notes:value||null}}); toast.success("Booking note saved"); refresh(); } catch(error){toast.error(error instanceof Error?error.message:"Update failed");} } }} /></div></article>)}{rows.length===0&&<EmptyState label="No bookings."/>}</div></div>;
}

function AudienceWorkspace({ mode = "all" }: { mode?: "all" | "newsletter" | "studio" }) {
  const load = useServerFn(listAdminAudience);
  const updateSubscriber = useServerFn(updateAdminSubscriber);
  const updateWaitlist = useServerFn(updateAdminWaitlist);
  const exportCsv = useServerFn(exportAdminAudience);
  const [data, setData] = useState<AudienceData>({ subscribers: [], waitlist: [] });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive" | "unsubscribed">("all");
  const [kind, setKind] = useState<"all" | "newsletter" | "studio">(mode === "all" ? "all" : mode);

  const refresh = () => void load({ data: {} })
    .then((result: any) => setData({ subscribers: result.subscribers ?? [], waitlist: result.waitlist ?? [] }))
    .catch((error: any) => toast.error(error?.message ?? "Audience could not be loaded"));

  useEffect(() => { refresh(); }, []);

  const needle = query.trim().toLowerCase();
  const subscribers = data.subscribers.filter((row) => {
    const haystack = `${row.email ?? ""} ${row.name ?? ""} ${row.source ?? ""}`.toLowerCase();
    return (kind === "all" || kind === "newsletter")
      && (!needle || haystack.includes(needle))
      && (status === "all" || row.status === status);
  });
  const waitlist = data.waitlist.filter((row) => {
    const haystack = `${row.email ?? ""} ${row.source ?? ""}`.toLowerCase();
    return (kind === "all" || kind === "studio")
      && (!needle || haystack.includes(needle))
      && (status === "all" || row.status === status);
  });

  const download = async () => {
    try {
      const result: any = await exportCsv({ data: {} });
      const blob = new Blob([result.csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kutuzov-audience-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    }
  };

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-3">
      <SectionHeader kicker="Operations / Audience" title="Newsletter + Studio waitlist." description="One audience surface with search, lifecycle filters, activation controls and export." />
      <button type="button" onClick={() => void download()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-300"><Download size={13}/> Export CSV</button>
    </div>
    <div className="mb-5 grid gap-2 md:grid-cols-[1fr_auto_auto]">
      <div className="relative"><Search size={13} className="absolute left-3 top-3 text-slate-600" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search email, name or source..." className="adm-input pl-9" /></div>
      {mode === "all" ? <select value={kind} onChange={(e) => setKind(e.target.value as any)} className="adm-input md:w-40"><option value="all">All audiences</option><option value="newsletter">Newsletter</option><option value="studio">Studio waitlist</option></select> : null}
      <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="adm-input md:w-40"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="unsubscribed">Unsubscribed</option></select>
    </div>
    {mode !== "studio" ? <Panel kicker="Newsletter" title={`${subscribers.length} visible · ${data.subscribers.length} total`}>
      <div className="space-y-2">{subscribers.map((row)=><div key={row.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[0.06] p-3"><div className="min-w-0 flex-1"><div className="text-sm text-slate-200">{row.email}</div><div className="text-[10px] text-slate-600">{row.name ?? "No name"} · {row.source ?? "website"} · {formatDate(row.created_at)}</div></div><FieldSelect label="" value={row.status} onChange={async(value: string)=>{try{await updateSubscriber({data:{id:row.id,status:value as any}});refresh();toast.success("Subscriber updated");}catch(error){toast.error(error instanceof Error?error.message:"Update failed");}}} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"},{value:"unsubscribed",label:"Unsubscribed"}]}/></div>)}{subscribers.length===0&&<EmptyState label="No newsletter records match the filters."/ >}</div>
    </Panel> : null}
    {mode !== "newsletter" ? <div className="mt-5"><Panel kicker="Studio" title={`${waitlist.length} visible · ${data.waitlist.length} total`}>
      <div className="space-y-2">{waitlist.map((row)=><div key={row.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[0.06] p-3"><div className="min-w-0 flex-1"><div className="text-sm text-slate-200">{row.email}</div><div className="text-[10px] text-slate-600">{row.source ?? "studio"} · {formatDate(row.created_at)}</div></div><FieldSelect label="" value={row.status} onChange={async(value: string)=>{try{await updateWaitlist({data:{id:row.id,status:value as any}});refresh();toast.success("Waitlist updated");}catch(error){toast.error(error instanceof Error?error.message:"Update failed");}}} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"}]}/></div>)}{waitlist.length===0&&<EmptyState label="No Studio waitlist records match the filters."/ >}</div>
    </Panel></div> : null}
  </div>;
}
function ClientCRMWorkspace() {
  const load = useServerFn(listAdminClientsCRM);
  const [rows,setRows]=useState<ClientRow[]>([]);
  const refresh=()=>void load({data:{}}).then((result:any)=>setRows(result.rows??[])).catch((error:any)=>toast.error(error?.message??"Clients could not be loaded"));
  useEffect(()=>{refresh();},[]);
  return <div><SectionHeader kicker="Operations / CRM" title="Client relationships." description="Clients remain the canonical identity. Projects and leads attach to the client without removing legacy client_name data."/><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{rows.map((row)=><article key={row.id} className="rounded-xl border border-white/[0.07] bg-[#030814] p-4"><div className="flex items-start justify-between gap-3"><div><div className="text-sm font-medium text-white">{row.name}</div><div className="mt-1 text-[10px] text-slate-600">{row.kind} · {row.is_active?"active":"hidden"}</div></div><Pill label={row.active_lead_count+" active leads"} tone="sky"/></div><div className="mt-4 grid grid-cols-2 gap-2"><MetricMini label="Projects" value={row.project_count}/><MetricMini label="Leads" value={row.lead_count}/></div></article>)}</div>{rows.length===0&&<EmptyState label="No client records."/ >}</div>;
}

function FinanceWorkspace({ mode = "full" }: { mode?: "full" | "payments" }) {
  return mode === "payments" ? <PaymentsWorkspace /> : <FinanceSummaryWorkspace />;
}

function FinanceSummaryWorkspace() {
  const overview = useServerFn(getOperationsOverview);
  const [data, setData] = useState<any>(null);
  const refresh = () => void overview({ data: {} }).then((result: any) => setData(result)).catch((error: any) => toast.error(error?.message ?? "Finance overview could not be loaded"));
  useEffect(() => { refresh(); }, []);
  const finance = data?.finance ?? {};
  if (mode === "payments") return <PaymentsWorkspace />;
  return <div className="space-y-6"><SectionHeader kicker="Operations / Finance" title="Finance." description="Existing invoice workspace plus the payment ledger, lifecycle totals and CRM linkage."/>
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel kicker="Cash performance" title="Paid revenue"><MoneyRows label="All confirmed payments" rows={finance.paid_records ?? {}} icon={<CircleDollarSign size={14}/>} /><div className="mt-4"><MoneyRows label="This month" rows={finance.revenue_this_month_by_currency ?? {}} icon={<CalendarClock size={14}/>} /></div><div className="mt-4"><MoneyRows label="This year" rows={finance.revenue_this_year_by_currency ?? {}} icon={<CalendarClock size={14}/>} /></div></Panel>
      <Panel kicker="Receivables" title="Invoice exposure"><MoneyRows label="Outstanding" rows={finance.outstanding_by_currency ?? {}} icon={<WalletCards size={14}/>} /><div className="mt-4"><MoneyRows label="Overdue" rows={finance.overdue_by_currency ?? {}} icon={<XCircle size={14}/>} /></div></Panel>
    </div>
    <InvoiceWorkspace/>
  </div>;
}

function PaymentsWorkspace() {
  const load = useServerFn(listAdminPayments);
  const [rows, setRows] = useState<any[]>([]);
  const [status, setStatus] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const result: any = await load({ data: { status, limit: 300 } });
      setRows(result.rows ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payments could not be loaded");
    } finally {
      setLoading(false);
    }
  };

  // refresh intentionally follows the selected payment status.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void refresh(); }, [status]);

  return <div className="space-y-5">
    <SectionHeader kicker="Finance / Payments" title="Payment ledger." description="Confirmed, pending and rejected payment records linked to leads and briefing submissions." />
    <div className="flex flex-wrap items-center gap-2">
      {(["all","pending","confirmed","rejected"] as const).map((value) => (
        <button key={value} type="button" onClick={() => setStatus(value)} className={`mono rounded-full border px-3 py-1.5 text-[10px] transition ${status === value ? "border-sky-300/35 bg-sky-300/10 text-sky-100" : "border-white/10 text-slate-500 hover:text-white"}`}>
          {value.toUpperCase()}
        </button>
      ))}
      <button type="button" onClick={() => void refresh()} className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-300">
        <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
      </button>
    </div>
    <Panel kicker="Ledger" title={`${rows.length} payment records`}>
      {loading ? <div className="grid min-h-40 place-items-center text-slate-500"><RefreshCw size={16} className="animate-spin" /></div> :
        rows.length === 0 ? <EmptyState label="No payment records match the filter." /> :
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="bg-white/[0.03] mono text-[10px] tracking-[0.16em] text-slate-500"><th className="px-4 py-3">DATE</th><th className="px-4 py-3">CLIENT</th><th className="px-4 py-3">METHOD</th><th className="px-4 py-3">REFERENCE</th><th className="px-4 py-3 text-right">AMOUNT</th><th className="px-4 py-3">STATUS</th></tr></thead><tbody>{rows.map((row:any) => <tr key={row.id} className="border-t border-white/[0.06] text-xs"><td className="px-4 py-3 text-slate-500">{formatDate(row.paid_at ?? row.created_at)}</td><td className="px-4 py-3 text-slate-200">{row.lead?.company_name || row.briefing?.company_name || row.lead?.full_name || row.briefing?.full_name || row.lead?.email || row.briefing?.email || "Unlinked"}</td><td className="px-4 py-3 text-slate-400">{row.method ?? "unspecified"}</td><td className="px-4 py-3 mono text-slate-400">{row.reference ?? "—"}</td><td className="px-4 py-3 text-right text-slate-100">{row.currency} {Number(row.amount).toLocaleString()}</td><td className="px-4 py-3"><Pill label={row.status} tone={row.status === "confirmed" ? "green" : row.status === "rejected" ? "muted" : "sky"} /></td></tr>)}</tbody></table></div>}
    </Panel>
  </div>;
}


function StudioWorkspace() {
  const load=useServerFn(getStudioOperationsSnapshot);
  const [data,setData]=useState<any>(null);
  const refresh=()=>void load({data:{}}).then((result:any)=>setData(result.data??{})).catch((error:any)=>toast.error(error?.message??"Studio analytics could not be loaded"));
  useEffect(()=>{refresh();},[]);
  const summary=data?.summary??{};
  return <div><SectionHeader kicker="Operations / Studio" title="Studio operations." description="Analytics are integrated here; the full legacy Studio intelligence workspace remains available from the Studio route."/><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Cards created" value={summary.cards_total??0} /><MetricCard label="Published" value={summary.cards_published??0}/><MetricCard label="Generations" value={summary.generations??0}/><MetricCard label="Digital views" value={summary.digital_views??0}/></div><div className="mt-5 flex flex-wrap gap-2"><a href="/admin/studio" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-300/25 px-3 text-xs text-sky-200">Open full Studio Intelligence <ArrowRight size={13}/></a><a href="/studio" target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-400">Open public Studio <ArrowRight size={13}/></a></div></div>;
}

function TasksWorkspace() {
  const load = useServerFn(listAdminTasks);
  const taskUpdate = useServerFn(updateLeadTask);
  const [status, setStatus] = useState("pending");
  const [tasks,setTasks]=useState<any[]>([]);
  const refresh=async()=>{const r:any=await load({data:{status,limit:300}});setTasks((r.rows??[]).map((task:any)=>({...task,lead_name:task.lead_profile?.full_name ?? task.lead_name ?? "Lead"})));};
  useEffect(()=>{void refresh().catch((e)=>toast.error(e instanceof Error?e.message:"Tasks could not be loaded"));},[status]);
  return <div><SectionHeader kicker="Operations / Tasks" title="Operational reminders." description="Follow-up, lead, invoice and waitlist tasks stored in Supabase and visible to the whole Control Room."/><div className="mb-4 flex flex-wrap gap-2">{["pending","completed","cancelled","all"].map((v)=><button key={v} type="button" onClick={()=>setStatus(v)} className={`rounded-full border px-3 py-1.5 text-[10px] uppercase ${status===v?"border-sky-300/30 bg-sky-300/10 text-sky-100":"border-white/[0.08] text-slate-500"}`}>{v}</button>)}</div><div className="space-y-2">{tasks.map((task)=><div key={task.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.07] bg-[#030814] p-4"><div className="min-w-0 flex-1"><div className="text-sm text-white">{task.title}</div><div className="mt-1 text-[10px] text-slate-600">{task.lead_name} · {task.kind} · {formatDate(task.due_at)}</div></div><Pill label={task.status} tone={task.status==="pending"?"amber":task.status==="completed"?"green":"muted"}/>{task.status==="pending"&&<button type="button" onClick={async()=>{try{await taskUpdate({data:{id:task.id,status:"completed"}});refresh();toast.success("Task completed");}catch(e){toast.error(e instanceof Error?e.message:"Update failed");}}} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-slate-400">Complete</button>}</div>)}{tasks.length===0&&<EmptyState label="No operational tasks."/ >}</div></div>;
}

function TaskCreate({ leadId, owners, onCreate }: any) {
  const [open,setOpen]=useState(false);
  if(!open) return <button type="button" onClick={()=>setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] text-slate-300"><Plus size={12}/> Add reminder</button>;
  return <form onSubmit={async(e)=>{e.preventDefault();const form=new FormData(e.currentTarget);await onCreate({lead_id:leadId,kind:String(form.get("kind")),title:String(form.get("title")),due_at:new Date(String(form.get("due_at"))).toISOString(),owner_user_id:String(form.get("owner_user_id")||"")||null,metadata:{}});setOpen(false);}} className="grid gap-2 md:grid-cols-[180px_1fr_190px_160px_auto]"><select name="kind" className="adm-input"><option value="follow_up">Follow-up</option><option value="lead_reminder">Lead reminder</option><option value="invoice_reminder">Invoice reminder</option><option value="waitlist_notification">Waitlist notification</option></select><input name="title" required placeholder="Task title" className="adm-input"/><input name="due_at" required type="datetime-local" className="adm-input"/><select name="owner_user_id" className="adm-input"><option value="">Unassigned</option>{owners.map((owner:any)=><option key={owner.user_id} value={owner.user_id}>{owner.email}</option>)}</select><button type="submit" className="rounded-lg border border-sky-300/30 px-3 text-[10px] text-sky-200">Create</button></form>;
}

function SectionHeader({ kicker, title, description }: any) {
  return <header className="mb-5"><div className="mono text-[10px] tracking-[0.24em] text-sky-300/70">{kicker}</div><h2 className="display mt-1 text-2xl text-metal">{title}</h2><p className="mt-2 text-sm text-slate-500">{description}</p></header>;
}
function Panel({ kicker, title, children }: any) {
  return <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">{kicker&&<div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">{kicker}</div>}<h3 className="display mt-1 text-lg text-metal">{title}</h3><div className="mt-4">{children}</div></section>;
}
function MetricCard({ label, value, detail }: { label:string; value:number|string; detail?:string }) { return <div className="rounded-xl border border-white/[0.07] bg-[#030814] p-4"><div className="text-[10px] uppercase tracking-[0.15em] text-slate-600">{label}</div><div className="mt-2 text-2xl font-semibold text-white">{typeof value==="number"?value.toLocaleString():value}</div>{detail&&<div className="mt-1 text-[11px] text-slate-600">{detail}</div>}</div>; }
function MetricMini({label,value}:{label:string;value:number}){return <div className="rounded-lg border border-white/[0.06] p-3"><div className="text-[9px] uppercase text-slate-600">{label}</div><div className="mt-1 text-lg text-white">{value}</div></div>;}
function MoneyRows({label,rows,icon}:{label:string;rows:Record<string,number>;icon:React.ReactNode}){const entries=Object.entries(rows);return <div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500">{icon}{label}</div>{entries.length?entries.map(([currency,value])=><div key={currency} className="flex items-center justify-between text-sm"><span className="mono text-[10px] text-slate-600">{currency}</span><span className="font-medium text-white">{Number(value).toLocaleString()}</span></div>):<div className="text-sm text-slate-700">0</div>}</div>;}
function LeadCompact({row,onClick}:{row:any;onClick:()=>void}){return <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-lg border border-white/[0.06] p-3 text-left hover:border-sky-300/25"><div className="min-w-0 flex-1"><div className="truncate text-sm text-white">{row.full_name}</div><div className="mt-1 text-[10px] text-slate-600">{row.company_name??row.email}</div></div><Pill label={stageLabels[row.stage as LeadStage]??row.stage} tone={stageTone(row.stage)}/></button>;}
function Info({label,value}:{label:string;value:any}){return <div><div className="mono text-[9px] uppercase tracking-[0.16em] text-slate-600">{label}</div><div className="mt-1 min-h-5 text-sm text-slate-300">{value??"Not set"}</div></div>;}
function FieldSelect({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:Array<{value:string;label:string}>}){return <label className="block space-y-1.5"><span className="mono text-[9px] uppercase tracking-[0.16em] text-slate-600">{label}</span><select value={value??""} onChange={(e)=>onChange(e.target.value)} className="adm-input">{options.map((o)=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;}
function FieldInput({label,name,value,onChange,...props}:any){const [local,setLocal]=useState(value??"");useEffect(()=>setLocal(value??""),[value]);return <label className="block space-y-1.5"><span className="mono text-[9px] uppercase tracking-[0.16em] text-slate-600">{label}</span><input {...props} name={name} value={local} onChange={(e)=>{setLocal(e.target.value);onChange?.(e.target.value);}} className="adm-input"/></label>;}
function Pill({label,tone}:{label:string;tone:string}){const map:any={sky:"border-sky-300/25 bg-sky-300/10 text-sky-200",green:"border-emerald-300/25 bg-emerald-300/10 text-emerald-200",amber:"border-amber-300/25 bg-amber-300/10 text-amber-200",muted:"border-white/[0.08] bg-white/[0.02] text-slate-500"};return <span className={`inline-flex rounded-full border px-2 py-1 text-[9px] uppercase tracking-wider ${map[tone]??map.muted}`}>{label}</span>;}
function EmptyState({label}:{label:string}){return <div className="rounded-xl border border-white/[0.06] bg-[#030814] p-8 text-center text-sm text-slate-600">{label}</div>;}
function stageTone(stage:string){return stage==="won"?"green":stage==="negotiation"||stage==="proposal"?"amber":stage==="lost"||stage==="archived"?"muted":"sky";}
function formatDate(value:string|null|undefined){return value?new Date(value).toLocaleString():"Not set";}
function toLocalInput(value:string|null|undefined){if(!value)return "";const d=new Date(value);const offset=d.getTimezoneOffset();return new Date(d.getTime()-offset*60000).toISOString().slice(0,16);}
function normalizeInvoiceStatus(value:string|null|undefined){if(value==="generated")return "issued";if(value==="partially_paid")return "partially paid";return value??"draft";}
function refreshOps(qc:any){return Promise.all([
  qc.invalidateQueries({queryKey:["phase3-overview"]}),
  qc.invalidateQueries({queryKey:["phase3-lead-overview"]}),
  qc.invalidateQueries({queryKey:["phase3-inbox"]}),
  qc.invalidateQueries({queryKey:["phase3-owners"]}),
]);}
function invalidateOps(qc:any){void refreshOps(qc);}