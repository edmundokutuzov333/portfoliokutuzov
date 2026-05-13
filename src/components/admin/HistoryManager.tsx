import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { History, RotateCcw, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { restoreSnapshot, type EntityType } from "@/lib/history";

type HistoryRow = {
  id: string;
  entity_type: EntityType;
  entity_id: string;
  snapshot: Record<string, unknown>;
  label: string | null;
  created_at: string;
};

const TYPE_LABEL: Record<EntityType, string> = {
  site_settings: "Site setting",
  projects: "Project",
  clients: "Client",
};

export function HistoryManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<"all" | EntityType>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["content_history"],
    queryFn: async (): Promise<HistoryRow[]> => {
      const { data, error } = await supabase
        .from("content_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as HistoryRow[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel(`rt-content_history-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_history" }, () => {
        qc.invalidateQueries({ queryKey: ["content_history"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);

  const filtered = rows.filter((r) => filter === "all" || r.entity_type === filter);

  const onRestore = async (row: HistoryRow) => {
    if (!confirm(`Restore this version of "${row.label ?? row.entity_id}"?`)) return;
    setRestoringId(row.id);
    const { error } = await restoreSnapshot(row.entity_type, row.entity_id, row.snapshot);
    setRestoringId(null);
    if (error) toast.error(error);
    else {
      toast.success("Restored");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    }
  };

  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal flex items-center gap-2">
          <History size={20} className="text-sky-300" /> Version history
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          The last 5 versions of every site setting, project and client are kept automatically. Open
          any entry to inspect or restore it.
        </p>
      </header>

      <div className="mt-5 flex flex-wrap gap-2 items-center">
        {(["all", "site_settings", "projects", "clients"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              filter === f
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {f === "all" ? "All" : TYPE_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        {isLoading && (
          <div className="text-sm text-slate-500 flex items-center gap-2 p-4">
            <Loader2 size={14} className="animate-spin" /> Loading…
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
            No history yet. Make a change in any section to start building rollback points.
          </div>
        )}

        {filtered.map((row) => {
          const isOpen = openId === row.id;
          return (
            <div key={row.id} className="bg-[#030814] border border-white/[0.08] rounded">
              <button
                onClick={() => setOpenId(isOpen ? null : row.id)}
                className="w-full flex items-center justify-between p-3 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {isOpen ? (
                    <ChevronDown size={14} className="text-slate-500" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-500" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm text-slate-100 truncate">
                      <span className="mono text-[10px] text-sky-300/80 mr-2">
                        {TYPE_LABEL[row.entity_type]}
                      </span>
                      {row.label ?? row.entity_id}
                    </div>
                    <div className="text-[11px] text-slate-500 mono">
                      {new Date(row.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void onRestore(row);
                  }}
                  disabled={restoringId === row.id}
                  className="inline-flex items-center gap-1.5 text-xs border border-white/10 hover:border-sky-300/40 text-slate-300 hover:text-sky-200 px-3 py-1.5 rounded disabled:opacity-50"
                >
                  {restoringId === row.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <RotateCcw size={12} />
                  )}{" "}
                  Restore
                </button>
              </button>
              {isOpen && (
                <div className="px-4 pb-4">
                  <pre className="bg-[#01040A] border border-white/[0.06] rounded p-3 text-[11px] font-mono text-slate-300 overflow-auto max-h-[420px]">
                    {JSON.stringify(row.snapshot, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
