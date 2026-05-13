import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Inbox,
  Mail,
  Trash2,
  Loader2,
  Phone,
  Building2,
  Clock,
  CalendarClock,
  Paperclip,
  Link as LinkIcon,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import { RequestsInbox } from "./RequestsInbox";

type BriefAttachment = { url: string; name: string; size: number };
type BriefRefLink = { url: string; label?: string };

type Briefing = {
  id: string;
  full_name: string;
  company_name: string | null;
  position: string | null;
  country: string | null;
  email: string;
  phone: string | null;
  project_type: string;
  urgency: "low" | "normal" | "high" | "urgent" | string;
  deadline: string | null;
  currency: string;
  budget_range: string | null;
  exact_amount: number | null;
  negotiable: boolean;
  message: string;
  preferred_contact_method: string | null;
  reference_project_id: string | null;
  attachments: BriefAttachment[];
  reference_links: BriefRefLink[];
  status: "new" | "reviewing" | "accepted" | "closed" | string;
  admin_notes: string | null;
  source: string | null;
  created_at: string;
};

type Booking = {
  id: string;
  name: string;
  email: string;
  preferred_date: string | null;
  preferred_time: string | null;
  timezone: string | null;
  note: string | null;
  status: "new" | "reviewing" | "accepted" | "closed" | string;
  admin_notes: string | null;
  created_at: string;
};

type Subscriber = {
  id: string;
  email: string;
  name: string | null;
  source: string | null;
  is_active: boolean;
  created_at: string;
};

const URGENCY_TONE: Record<string, string> = {
  low: "border-slate-400/30 text-slate-300",
  normal: "border-sky-300/35 text-sky-200",
  high: "border-amber-300/40 text-amber-200",
  urgent: "border-rose-300/40 text-rose-200",
};

const STATUS_TONE: Record<string, string> = {
  new: "bg-sky-300/15 text-sky-100 border-sky-300/30",
  reviewing: "bg-violet-300/10 text-violet-200 border-violet-300/30",
  accepted: "bg-emerald-300/10 text-emerald-200 border-emerald-300/30",
  closed: "bg-slate-400/10 text-slate-300 border-slate-400/20",
};

type Tab = "briefings" | "bookings" | "subscribers" | "legacy";

export function InboxHub() {
  const [tab, setTab] = useState<Tab>("briefings");
  const qc = useQueryClient();

  // Realtime: invalidate the right cache when any of the inbox tables change
  useEffect(() => {
    const ch = supabase
      .channel(`rt-inbox-hub-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "briefing_submissions" }, () =>
        qc.invalidateQueries({ queryKey: ["briefings"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "booking_requests" }, () =>
        qc.invalidateQueries({ queryKey: ["bookings"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "newsletter_subscribers" },
        () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const briefingCount =
    useQuery({
      queryKey: ["briefings-count"],
      queryFn: async () => {
        const { count } = await supabase
          .from("briefing_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        return count ?? 0;
      },
    }).data ?? 0;

  const bookingCount =
    useQuery({
      queryKey: ["bookings-count"],
      queryFn: async () => {
        const { count } = await supabase
          .from("booking_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        return count ?? 0;
      },
    }).data ?? 0;

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "briefings", label: "Briefings", badge: briefingCount },
    { id: "bookings", label: "Bookings", badge: bookingCount },
    { id: "subscribers", label: "Newsletter" },
    { id: "legacy", label: "Legacy contact" },
  ];

  return (
    <div>
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="display text-2xl text-metal flex items-center gap-2">
            <Inbox size={20} className="text-sky-300" /> Inbox
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Smart briefings, call bookings and newsletter subscribers — synced in real time.
          </p>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`mono inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full border transition ${
              tab === t.id
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {t.label}
            {t.badge ? (
              <span className="bg-sky-300 text-[#01040A] text-[10px] font-semibold rounded-full px-1.5">
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "briefings" && <BriefingsPanel />}
        {tab === "bookings" && <BookingsPanel />}
        {tab === "subscribers" && <SubscribersPanel />}
        {tab === "legacy" && <RequestsInbox />}
      </div>
    </div>
  );
}

// ---------- Briefings ----------
function BriefingsPanel() {
  const [selected, setSelected] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["briefings"],
    queryFn: async (): Promise<Briefing[]> => {
      const { data, error } = await supabase
        .from("briefing_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        attachments: Array.isArray(r.attachments)
          ? (r.attachments as unknown as BriefAttachment[])
          : [],
        reference_links: Array.isArray(r.reference_links)
          ? (r.reference_links as unknown as BriefRefLink[])
          : [],
      })) as Briefing[];
    },
  });

  const filtered = useMemo(
    () => rows.filter((r) => statusFilter === "all" || r.status === statusFilter),
    [rows, statusFilter],
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: rows.length,
      new: 0,
      reviewing: 0,
      accepted: 0,
      closed: 0,
    };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const current = filtered.find((r) => r.id === selected) ?? null;

  const update = async (id: string, patch: Partial<Briefing>) => {
    const { error } = await supabase
      .from("briefing_submissions")
      .update(patch as never)
      .eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this briefing? This cannot be undone.")) return;
    const { error } = await supabase.from("briefing_submissions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      setSelected(null);
    }
  };

  const onOpen = (r: Briefing) => {
    setSelected(r.id);
    if (r.status === "new") void update(r.id, { status: "reviewing" });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {["all", "new", "reviewing", "accepted", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              statusFilter === s
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {s.toUpperCase()} <span className="text-slate-500">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 space-y-2">
          {isLoading && (
            <div className="text-sm text-slate-500 flex items-center gap-2 p-4">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
              No briefings yet.
            </div>
          )}
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => onOpen(r)}
              className={`w-full text-left bg-[#030814] border rounded p-3 transition ${
                current?.id === r.id
                  ? "border-sky-300/40"
                  : "border-white/[0.06] hover:border-white/[0.15]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium text-slate-100 truncate">
                  {r.full_name}
                  {r.company_name ? ` · ${r.company_name}` : ""}
                </div>
                <span
                  className={`mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`}
                >
                  {r.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">{r.email}</div>
              <div className="text-[12px] text-slate-400 mt-1.5 line-clamp-2">{r.message}</div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600 mt-2 mono">
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} />
                  {new Date(r.created_at).toLocaleString()}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded border ${URGENCY_TONE[r.urgency] ?? URGENCY_TONE.normal}`}
                >
                  {String(r.urgency).toUpperCase()}
                </span>
                {r.attachments?.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <Paperclip size={10} />
                    {r.attachments.length}
                  </span>
                )}
                {r.reference_links?.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <LinkIcon size={10} />
                    {r.reference_links.length}
                  </span>
                )}
                <span className="ml-auto truncate">{r.project_type}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-7">
          {!current ? (
            <div className="bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500">
              <MessageSquare className="mx-auto mb-3 text-slate-600" />
              Select a briefing to view it.
            </div>
          ) : (
            <BriefingDetail
              key={current.id}
              req={current}
              onUpdate={update}
              onDelete={() => remove(current.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function BriefingDetail({
  req,
  onUpdate,
  onDelete,
}: {
  req: Briefing;
  onUpdate: (id: string, patch: Partial<Briefing>) => Promise<void>;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(req.admin_notes ?? "");
  useEffect(() => {
    setNotes(req.admin_notes ?? "");
  }, [req.id, req.admin_notes]);

  const reply = `mailto:${req.email}?subject=${encodeURIComponent(`Re: ${req.project_type}`)}&body=${encodeURIComponent(`Hi ${req.full_name.split(" ")[0]},\n\n`)}`;

  const budget = req.exact_amount
    ? `${req.currency} ${req.exact_amount.toLocaleString()}${req.negotiable ? " · negotiable" : ""}`
    : req.budget_range
      ? `${req.budget_range} (${req.currency})${req.negotiable ? " · negotiable" : ""}`
      : "—";

  return (
    <div className="bg-[#030814] border border-white/[0.08] rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="display text-xl text-metal truncate">{req.full_name}</div>
          <a
            href={`mailto:${req.email}`}
            className="text-sm text-sky-200 hover:underline inline-flex items-center gap-1"
          >
            <Mail size={12} /> {req.email}
          </a>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
            {req.phone && (
              <span className="inline-flex items-center gap-1">
                <Phone size={11} />
                {req.phone}
              </span>
            )}
            {req.company_name && (
              <span className="inline-flex items-center gap-1">
                <Building2 size={11} />
                {req.company_name}
                {req.position ? ` · ${req.position}` : ""}
              </span>
            )}
            {req.country && (
              <span className="inline-flex items-center gap-1">
                <MapPin size={11} />
                {req.country}
              </span>
            )}
            <span className="mono">{new Date(req.created_at).toLocaleString()}</span>
          </div>
        </div>
        <button
          title="Delete"
          onClick={onDelete}
          className="p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        <Meta label="Project" value={req.project_type} />
        <Meta
          label="Urgency"
          value={String(req.urgency).toUpperCase()}
          tone={URGENCY_TONE[req.urgency]}
        />
        <Meta label="Deadline" value={req.deadline ?? "—"} icon={<CalendarClock size={11} />} />
        <Meta label="Budget" value={budget} />
      </div>

      <div className="mt-5">
        <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">MESSAGE</div>
        <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap">
          {req.message}
        </div>
      </div>

      {req.preferred_contact_method && (
        <div className="mt-3 text-[12px] text-slate-400 mono">
          Preferred contact: <span className="text-slate-200">{req.preferred_contact_method}</span>
        </div>
      )}

      {req.attachments?.length > 0 && (
        <div className="mt-5">
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">ATTACHMENTS</div>
          <div className="flex flex-wrap gap-2">
            {req.attachments.map((a) => (
              <a
                key={a.url}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[12px] bg-[#01040A] border border-white/10 rounded px-3 py-1.5 hover:border-sky-300/40"
              >
                <Paperclip size={11} /> <span className="truncate max-w-[180px]">{a.name}</span>
                <ExternalLink size={11} className="text-slate-500" />
              </a>
            ))}
          </div>
        </div>
      )}

      {req.reference_links?.length > 0 && (
        <div className="mt-5">
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">
            REFERENCE LINKS
          </div>
          <div className="flex flex-col gap-1.5">
            {req.reference_links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[12px] text-sky-200 hover:underline truncate"
              >
                <LinkIcon size={11} /> {l.label || l.url}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">PRIVATE NOTES</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() =>
            notes !== (req.admin_notes ?? "") && void onUpdate(req.id, { admin_notes: notes })
          }
          rows={3}
          placeholder="Notes for yourself."
          className="w-full bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
        <a
          href={reply}
          className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold"
        >
          <Send size={13} /> Reply by email
        </a>
        {(["new", "reviewing", "accepted", "closed"] as const).map((s) => (
          <button
            key={s}
            onClick={() => onUpdate(req.id, { status: s })}
            disabled={req.status === s}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              req.status === s
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Bookings ----------
function BookingsPanel() {
  const [selected, setSelected] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async (): Promise<Booking[]> => {
      const { data, error } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });

  const current = rows.find((r) => r.id === selected) ?? null;

  const update = async (id: string, patch: Partial<Booking>) => {
    const { error } = await supabase
      .from("booking_requests")
      .update(patch as never)
      .eq("id", id);
    if (error) toast.error(error.message);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    const { error } = await supabase.from("booking_requests").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      setSelected(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <div className="lg:col-span-5 space-y-2">
        {isLoading && (
          <div className="text-sm text-slate-500 flex items-center gap-2 p-4">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        )}
        {!isLoading && rows.length === 0 && (
          <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
            No call bookings yet.
          </div>
        )}
        {rows.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={`w-full text-left bg-[#030814] border rounded p-3 transition ${
              current?.id === r.id
                ? "border-sky-300/40"
                : "border-white/[0.06] hover:border-white/[0.15]"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-slate-100 truncate">{r.name}</div>
              <span
                className={`mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`}
              >
                {r.status.toUpperCase()}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">{r.email}</div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-600 mt-2 mono">
              <span className="inline-flex items-center gap-1">
                <CalendarClock size={10} />
                {r.preferred_date ?? "—"}
                {r.preferred_time ? ` ${r.preferred_time}` : ""}
                {r.timezone ? ` ${r.timezone}` : ""}
              </span>
              <span className="ml-auto inline-flex items-center gap-1">
                <Clock size={10} />
                {new Date(r.created_at).toLocaleString()}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7">
        {!current ? (
          <div className="bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500">
            <CalendarClock className="mx-auto mb-3 text-slate-600" />
            Select a booking to view it.
          </div>
        ) : (
          <div className="bg-[#030814] border border-white/[0.08] rounded-lg p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="display text-xl text-metal">{current.name}</div>
                <a
                  href={`mailto:${current.email}`}
                  className="text-sm text-sky-200 hover:underline inline-flex items-center gap-1"
                >
                  <Mail size={12} /> {current.email}
                </a>
              </div>
              <button
                onClick={() => remove(current.id)}
                className="p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
              <Meta
                label="Date"
                value={current.preferred_date ?? "—"}
                icon={<CalendarClock size={11} />}
              />
              <Meta label="Time" value={current.preferred_time ?? "—"} />
              <Meta label="Timezone" value={current.timezone ?? "—"} icon={<Globe size={11} />} />
            </div>

            {current.note && (
              <div className="mt-5">
                <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">NOTE</div>
                <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap">
                  {current.note}
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
              {(["new", "reviewing", "accepted", "closed"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update(current.id, { status: s })}
                  disabled={current.status === s}
                  className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
                    current.status === s
                      ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                      : "border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Newsletter subscribers ----------
function SubscribersPanel() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async (): Promise<Subscriber[]> => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Subscriber[];
    },
  });

  const exportCsv = () => {
    const header = ["email", "name", "source", "is_active", "created_at"];
    const lines = [header.join(",")].concat(
      rows.map((r) =>
        [r.email, r.name ?? "", r.source ?? "", String(r.is_active), r.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-400">
          {rows.length} subscriber{rows.length === 1 ? "" : "s"}
        </div>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {isLoading ? (
        <div className="text-sm text-slate-500 flex items-center gap-2 p-4">
          <Loader2 size={14} className="animate-spin" /> Loading…
        </div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
          No subscribers yet.
        </div>
      ) : (
        <div className="bg-[#030814] border border-white/[0.06] rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.02] text-slate-500 mono text-[10px] tracking-[0.18em]">
              <tr>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Source</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-white/[0.06]">
                  <td className="px-4 py-2 text-slate-100">{r.email}</td>
                  <td className="px-4 py-2 text-slate-400">{r.name ?? "—"}</td>
                  <td className="px-4 py-2 text-slate-400">{r.source ?? "—"}</td>
                  <td className="px-4 py-2">
                    {r.is_active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-200 text-[12px]">
                        <CheckCircle2 size={12} /> active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[12px]">
                        <AlertCircle size={12} /> inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-slate-500 text-[12px] mono">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Meta({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  tone?: string;
}) {
  return (
    <div className={`bg-[#01040A] border rounded px-3 py-2 ${tone ?? "border-white/[0.06]"}`}>
      <div className="mono text-[9px] tracking-[0.2em] text-slate-500">{label}</div>
      <div className="text-slate-200 mt-0.5 truncate inline-flex items-center gap-1.5">
        {icon}
        {value}
      </div>
    </div>
  );
}
