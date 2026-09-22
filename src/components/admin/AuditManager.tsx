import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ChevronDown, ChevronRight, ClipboardList, Loader2, RefreshCw } from "lucide-react";
import { getAdminAuditLog } from "@/lib/admin.functions";

type AuditRow = {
  id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  action: "create" | "update" | "delete";
  entity_type: string;
  entity_id: string;
  entity_label: string | null;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

const ACTIONS = ["all", "create", "update", "delete"] as const;

function badgeClass(action: AuditRow["action"]) {
  if (action === "create") return "bg-emerald-300/10 text-emerald-200 border-emerald-300/20";
  if (action === "delete") return "bg-red-300/10 text-red-200 border-red-300/20";
  return "bg-sky-300/10 text-sky-200 border-sky-300/20";
}

export function AuditManager() {
  const load = useServerFn(getAdminAuditLog);
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [action, setAction] = useState<(typeof ACTIONS)[number]>("all");
  const [entity, setEntity] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    setError("");
    try {
      const result = (await load({
        data: {
          limit: 200,
          action: action === "all" ? undefined : action,
          entity_type: entity === "all" ? undefined : entity,
          search: search.trim() || undefined,
        },
      })) as unknown as { rows: AuditRow[] };
      setRows(result.rows ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load audit log.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchRows();
    // Filters are intentionally applied only on explicit refresh.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action, entity]);

  const entities = useMemo(
    () => ["all", ...Array.from(new Set(rows.map((row) => row.entity_type))).sort()],
    [rows],
  );

  return (
    <div>
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80 flex items-center gap-2">
            <ClipboardList size={13} /> AUDIT
          </div>
          <h2 className="display text-2xl text-metal mt-1">Administrator activity</h2>
          <p className="text-sm text-slate-500 mt-1">
            Immutable database events for administrator-controlled content.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void fetchRows()}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-white/10 hover:border-sky-300/40 px-3 py-2 rounded text-xs text-slate-300 disabled:opacity-50"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </header>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-3">
        <select
          value={action}
          onChange={(event) => setAction(event.target.value as (typeof ACTIONS)[number])}
          className="adm-input"
          aria-label="Action"
        >
          {ACTIONS.map((value) => (
            <option key={value} value={value}>
              {value === "all" ? "All actions" : value}
            </option>
          ))}
        </select>

        <select value={entity} onChange={(event) => setEntity(event.target.value)} className="adm-input" aria-label="Entity">
          {entities.map((value) => (
            <option key={value} value={value}>
              {value === "all" ? "All entities" : value}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void fetchRows();
          }}
          placeholder="Search actor, entity or id..."
          className="adm-input"
        />
      </div>

      {error && (
        <div role="alert" className="mt-4 rounded border border-red-400/20 bg-red-400/[0.04] p-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-2">
        {loading && (
          <div className="flex items-center gap-2 text-sm text-slate-500 p-4">
            <Loader2 size={14} className="animate-spin" /> Loading audit events...
          </div>
        )}

        {!loading && rows.length === 0 && (
          <div className="bg-[#030814] border border-white/[0.08] rounded-lg p-8 text-center text-sm text-slate-500">
            No audit events match the current filters.
          </div>
        )}

        {rows.map((row) => {
          const isOpen = openId === row.id;
          return (
            <div key={row.id} className="bg-[#030814] border border-white/[0.08] rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : row.id)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.025]"
              >
                {isOpen ? (
                  <ChevronDown size={14} className="text-slate-500" />
                ) : (
                  <ChevronRight size={14} className="text-slate-500" />
                )}
                <span className={`mono text-[9px] px-2 py-1 rounded-full border ${badgeClass(row.action)}`}>
                  {row.action}
                </span>
                <span className="mono text-[10px] text-slate-500">{row.entity_type}</span>
                <span className="text-sm text-slate-100 truncate">
                  {row.entity_label ?? row.entity_id}
                </span>
                <span className="ml-auto text-[11px] text-slate-600 hidden md:block">
                  {row.actor_email ?? "unknown actor"} · {new Date(row.created_at).toLocaleString()}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-white/[0.06] p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <div className="mono text-[9px] tracking-[0.2em] text-slate-500 mb-2">BEFORE</div>
                    <pre className="bg-[#01040A] border border-white/[0.06] rounded p-3 text-[11px] text-slate-300 overflow-auto max-h-[360px]">
                      {row.before_data ? JSON.stringify(row.before_data, null, 2) : "null"}
                    </pre>
                  </div>
                  <div>
                    <div className="mono text-[9px] tracking-[0.2em] text-slate-500 mb-2">AFTER</div>
                    <pre className="bg-[#01040A] border border-white/[0.06] rounded p-3 text-[11px] text-slate-300 overflow-auto max-h-[360px]">
                      {row.after_data ? JSON.stringify(row.after_data, null, 2) : "null"}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
