import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Inbox, Mail, Star, Trash2, Loader2, ExternalLink, Phone, Building2,
  Clock, CheckCircle2, Archive, MessageSquare, Paperclip,
} from "lucide-react";

type Attachment = { url: string; name: string; size: number };

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  budget_amount: number | null;
  budget_currency: string | null;
  budget_label: string | null;
  timeline: string | null;
  message: string;
  attachments: Attachment[];
  source: string | null;
  status: "new" | "read" | "replied" | "archived" | string;
  is_starred: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_FILTERS: { id: "all" | "new" | "read" | "replied" | "archived"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];

const STATUS_BADGE: Record<string, string> = {
  new: "bg-sky-300/15 text-sky-200 border-sky-300/30",
  read: "bg-slate-300/10 text-slate-300 border-slate-300/20",
  replied: "bg-emerald-300/10 text-emerald-200 border-emerald-300/30",
  archived: "bg-amber-300/10 text-amber-200 border-amber-300/30",
};

export function RequestsInbox() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["contact_requests"],
    queryFn: async (): Promise<ContactRequest[]> => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        attachments: Array.isArray(r.attachments) ? (r.attachments as unknown as Attachment[]) : [],
      })) as ContactRequest[];
    },
  });

  // Realtime updates
  useEffect(() => {
    const ch = supabase
      .channel(`rt-contact_requests-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["contact_requests"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const filtered = useMemo(
    () => rows.filter((r) => filter === "all" || r.status === filter),
    [rows, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length, new: 0, read: 0, replied: 0, archived: 0 };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);

  const current = filtered.find((r) => r.id === selected) ?? null;

  const update = async (id: string, patch: Partial<ContactRequest>) => {
    const { error } = await supabase
      .from("contact_requests")
      .update(patch as Record<string, unknown>)
      .eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this request? This cannot be undone.")) return;
    const { error } = await supabase.from("contact_requests").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); setSelected(null); }
  };

  const onOpen = (r: ContactRequest) => {
    setSelected(r.id);
    if (r.status === "new") void update(r.id, { status: "read" });
  };

  return (
    <div>
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="display text-2xl text-metal flex items-center gap-2">
            <Inbox size={20} className="text-sky-300" /> Requests inbox
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Messages submitted from the public contact form. {counts.new > 0 && (
              <span className="text-sky-300">· {counts.new} new</span>
            )}
          </p>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2 items-center">
        {STATUS_FILTERS.map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              filter === f.id ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"
            }`}>
            {f.label} <span className="text-slate-500">({counts[f.id] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* List */}
        <div className="lg:col-span-5 space-y-2">
          {isLoading && (
            <div className="text-sm text-slate-500 flex items-center gap-2 p-4">
              <Loader2 size={14} className="animate-spin" /> Loading…
            </div>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
              No requests yet.
            </div>
          )}
          {filtered.map((r) => (
            <button key={r.id} onClick={() => onOpen(r)}
              className={`w-full text-left bg-[#030814] border rounded p-3 transition ${
                current?.id === r.id ? "border-sky-300/40" : "border-white/[0.06] hover:border-white/[0.15]"
              }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {r.is_starred && <Star size={12} className="text-amber-300 shrink-0" fill="currentColor" />}
                  <div className="text-sm font-medium text-slate-100 truncate">{r.name}</div>
                </div>
                <span className={`mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_BADGE[r.status] ?? STATUS_BADGE.new}`}>
                  {r.status.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 truncate">{r.email}</div>
              <div className="text-[12px] text-slate-400 mt-1.5 line-clamp-2">{r.message}</div>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 mt-2 mono">
                <Clock size={10} /> {new Date(r.created_at).toLocaleString()}
                {r.attachments?.length > 0 && (
                  <span className="inline-flex items-center gap-1"><Paperclip size={10} /> {r.attachments.length}</span>
                )}
                {r.project_type && <span className="ml-auto">{r.project_type}</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className="lg:col-span-7">
          {!current ? (
            <div className="bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500">
              <MessageSquare className="mx-auto mb-3 text-slate-600" />
              Select a message to view it.
            </div>
          ) : (
            <RequestDetail key={current.id} req={current} onUpdate={update} onDelete={() => remove(current.id)} />
          )}
        </div>
      </div>
    </div>
  );
}

function RequestDetail({
  req, onUpdate, onDelete,
}: {
  req: ContactRequest;
  onUpdate: (id: string, patch: Partial<ContactRequest>) => Promise<void>;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(req.admin_notes ?? "");
  useEffect(() => { setNotes(req.admin_notes ?? ""); }, [req.id, req.admin_notes]);

  const reply = `mailto:${req.email}?subject=${encodeURIComponent(`Re: ${req.project_type ?? "your project"}`)}&body=${encodeURIComponent(`Hi ${req.name.split(" ")[0]},\n\n`)}`;

  return (
    <div className="bg-[#030814] border border-white/[0.08] rounded-lg p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="display text-xl text-metal">{req.name}</div>
          <a href={`mailto:${req.email}`} className="text-sm text-sky-200 hover:underline inline-flex items-center gap-1">
            <Mail size={12} /> {req.email}
          </a>
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2">
            {req.phone && <span className="inline-flex items-center gap-1"><Phone size={11} /> {req.phone}</span>}
            {req.company && <span className="inline-flex items-center gap-1"><Building2 size={11} /> {req.company}</span>}
            <span className="mono">{new Date(req.created_at).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button title={req.is_starred ? "Unstar" : "Star"} onClick={() => onUpdate(req.id, { is_starred: !req.is_starred })}
            className="p-2 rounded hover:bg-white/[0.05]">
            <Star size={14} className={req.is_starred ? "text-amber-300" : "text-slate-500"} fill={req.is_starred ? "currentColor" : "none"} />
          </button>
          <button title="Delete" onClick={onDelete} className="p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        <Meta label="Type" value={req.project_type ?? "-"} />
        <Meta label="Budget" value={req.budget_label ? `${req.budget_label} (${req.budget_currency})` : "-"} />
        <Meta label="Timeline" value={req.timeline ?? "-"} />
        <Meta label="Source" value={req.source ?? "-"} />
      </div>

      <div className="mt-5">
        <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">MESSAGE</div>
        <div className="bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap">
          {req.message}
        </div>
      </div>

      {req.attachments?.length > 0 && (
        <div className="mt-5">
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">ATTACHMENTS</div>
          <div className="flex flex-wrap gap-2">
            {req.attachments.map((a) => (
              <a key={a.url} href={a.url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-[12px] bg-[#01040A] border border-white/10 rounded px-3 py-1.5 hover:border-sky-300/40">
                <Paperclip size={11} /> <span className="truncate max-w-[180px]">{a.name}</span>
                <ExternalLink size={11} className="text-slate-500" />
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
          onBlur={() => notes !== (req.admin_notes ?? "") && void onUpdate(req.id, { admin_notes: notes })}
          rows={3}
          placeholder="Notes for yourself - not visible to the sender."
          className="w-full bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50"
        />
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
        <a href={reply} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold">
          <Mail size={13} /> Reply by email
        </a>
        <button onClick={() => onUpdate(req.id, { status: "replied" })}
          className="inline-flex items-center gap-2 border border-white/10 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200 px-4 py-2 rounded text-sm">
          <CheckCircle2 size={13} /> Mark replied
        </button>
        <button onClick={() => onUpdate(req.id, { status: req.status === "archived" ? "read" : "archived" })}
          className="inline-flex items-center gap-2 border border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200 px-4 py-2 rounded text-sm">
          <Archive size={13} /> {req.status === "archived" ? "Unarchive" : "Archive"}
        </button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#01040A] border border-white/[0.06] rounded px-3 py-2">
      <div className="mono text-[9px] tracking-[0.2em] text-slate-500">{label}</div>
      <div className="text-slate-200 mt-0.5 truncate">{value}</div>
    </div>
  );
}
