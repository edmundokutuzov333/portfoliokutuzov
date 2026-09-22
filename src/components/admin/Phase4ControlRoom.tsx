import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeftRight,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Command,
  ExternalLink,
  FileDiff,
  Filter,
  Globe2,
  History,
  Keyboard,
  Loader2,
  Monitor,
  MoreHorizontal,
  PanelLeft,
  Play,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  createAdminDraft,
  discardAdminDraft,
  getAdminDraft,
  getAdminDraftDiff,
  getAdminPreviewBundle,
  getAdminSystemHealth,
  globalAdminSearch,
  listAdminDrafts,
  listAdminEditableEntities,
  getAdminAuditLogPhase4,
  publishAdminDrafts,
  restoreAdminAuditState,
  submitAdminDraftForReview,
  updateAdminDraft,
} from "@/lib/admin.phase4.functions";
import {
  clearAdminDirty,
  getAdminDirtyKeys,
  hasAdminDirty,
  subscribeAdminDirty,
} from "@/lib/admin-dirty";
import { setAdminDirty } from "@/lib/admin-dirty";

type Phase4EntityType =
  | "site_settings"
  | "projects"
  | "clients"
  | "services"
  | "stats"
  | "about_method";

type DraftRow = {
  id: string;
  entity_type: Phase4EntityType;
  entity_id: string;
  label: string;
  payload: Record<string, unknown>;
  baseline_snapshot: Record<string, unknown>;
  baseline_updated_at: string | null;
  status: "draft" | "review" | "published" | "discarded";
  created_by: string | null;
  updated_by: string | null;
  reviewed_by: string | null;
  publish_note: string | null;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

type EntityDirectory = Record<
  Phase4EntityType,
  Array<{ id: string; label: string; meta: string | null }>
>;

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  target: string;
  entity_id?: string;
};

const ENTITY_LABELS: Record<Phase4EntityType, string> = {
  site_settings: "Website settings",
  projects: "Projects",
  clients: "Clients",
  services: "Services",
  stats: "Stats",
  about_method: "Method",
};



export function AdminDraftPreviewPage({ draftId }: { draftId: string }) {
  const load = useServerFn(getAdminPreviewBundle);
  const [data, setData] = useState<any>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [error, setError] = useState("");
  useEffect(() => {
    void load({ data: { id: draftId } })
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Preview could not be loaded"));
  }, [draftId, load]);

  const width = device === "desktop" ? "100%" : device === "tablet" ? "768px" : "390px";

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200">
      <header className="sticky top-0 z-20 border-b border-white/[0.08] bg-[#01040A]/95 px-4 py-3 backdrop-blur md:px-8">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3">
          <div>
            <div className="mono text-[9px] uppercase tracking-[0.24em] text-sky-300/70">CONTROL ROOM / PREVIEW</div>
            <h1 className="display mt-1 text-lg text-metal">{data?.draft?.label ?? "Draft preview"}</h1>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] p-1">
            {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as const).map(([id, Icon]) => (
              <button key={id} type="button" onClick={() => setDevice(id)} aria-label={id} className={\`grid h-8 w-9 place-items-center rounded \${device === id ? "bg-white/10 text-white" : "text-slate-600 hover:text-white"}\`}>
                <Icon size={13} />
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1480px] p-3 sm:p-6">
        {error ? <div role="alert" className="rounded-xl border border-red-300/20 bg-red-300/[0.04] p-5 text-sm text-red-200">{error}</div> : null}
        {!data && !error ? <LoadingBlock label="Loading draft preview..." /> : null}
        {data ? (
          <div className="overflow-auto rounded-2xl border border-white/[0.08] bg-[#020712] p-2">
            <div className="mx-auto min-h-[85vh] overflow-hidden rounded-xl border border-white/[0.06] bg-[#01040A]" style={{ width, maxWidth: "100%" }}>
              <PreviewCanvas data={data} />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function useAdminDirtyState() {
  const [dirty, setDirty] = useState(hasAdminDirty());

  useEffect(() => {
    return subscribeAdminDirty(() => setDirty(hasAdminDirty()));
  }, []);

  return { dirty, keys: getAdminDirtyKeys() };
}

export function Phase4AdminToolbar({
  onNavigate,
  onOpenRelease,
  onOpenSystem,
}: {
  onNavigate: (section: string) => void;
  onOpenRelease: () => void;
  onOpenSystem: () => void;
}) {
  const dirty = useAdminDirtyState();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-40 -mx-6 mb-6 border-b border-white/[0.07] bg-[#01040A]/95 px-6 py-3 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex min-h-10 flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="mono text-[9px] uppercase tracking-[0.22em] text-sky-300/70">
              CONTROL ROOM 2.0
            </span>
            {dirty.dirty ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-1 text-[9px] uppercase tracking-[0.13em] text-amber-200">
                <Clock3 size={11} />
                Unsaved changes
              </span>
            ) : (
              <span className="hidden text-[10px] text-slate-600 sm:inline">
                All changes saved
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.09] px-3 text-[10px] text-slate-400 hover:border-sky-300/30 hover:text-white"
              aria-label="Open global admin search"
            >
              <Search size={13} />
              Search everything
              <kbd className="mono hidden rounded border border-white/10 px-1.5 py-0.5 text-[8px] sm:inline">
                ⌘K
              </kbd>
            </button>
            <button
              type="button"
              onClick={onOpenRelease}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/25 bg-sky-300/10 px-3 text-[10px] text-sky-100 hover:bg-sky-300/15"
            >
              <Send size={13} />
              Release Center
            </button>
            <button
              type="button"
              onClick={onOpenSystem}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.09] px-3 text-[10px] text-slate-400 hover:border-white/20 hover:text-white"
            >
              <ShieldCheck size={13} />
              System
            </button>
          </div>
        </div>
      </div>

      {searchOpen ? (
        <AdminCommandPalette
          onClose={() => setSearchOpen(false)}
          onNavigate={(section) => {
            setSearchOpen(false);
            onNavigate(section);
          }}
        />
      ) : null}
    </>
  );
}

function AdminCommandPalette({
  onClose,
  onNavigate,
}: {
  onClose: () => void;
  onNavigate: (section: string) => void;
}) {
  const search = useServerFn(globalAdminSearch);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<SearchResult[]>([]);
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    requestAnimationFrame(() => inputRef.current?.focus());
    return () => returnFocusRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      if (!query.trim()) {
        setRows([]);
        return;
      }
      setBusy(true);
      try {
        const result = await search({ data: { query: query.trim(), limit: 30 } });
        if (!cancelled) {
          setRows(result.results ?? []);
          setActive(0);
        }
      } catch (error) {
        if (!cancelled) toast.error(error instanceof Error ? error.message : "Search failed");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 120);
    return () => {
      window.clearTimeout(timer);
      cancelled = true;
    };
  }, [query, search]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActive((value) => Math.min(value + 1, Math.max(rows.length - 1, 0)));
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActive((value) => Math.max(value - 1, 0));
      }
      if (event.key === "Enter" && rows[active]) {
        event.preventDefault();
        onNavigate(rows[active].target);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onClose, onNavigate, rows]);

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-global-search-title"
        className="mx-auto mt-[8vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#050a12] shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="border-b border-white/[0.08] p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <Command size={18} className="text-sky-300" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <h2 id="admin-global-search-title" className="text-sm font-medium text-white">
                Search everything
              </h2>
              <p className="mt-0.5 text-[10px] text-slate-600">
                Projects, clients, services, settings, leads, invoices and assets.
              </p>
            </div>
            <kbd className="mono rounded border border-white/10 px-2 py-1 text-[9px] text-slate-500">ESC</kbd>
          </div>
          <div className="relative mt-4">
            <Search size={14} className="absolute left-3 top-3 text-slate-600" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try BRUTAL, Absa, branding, invoice..."
              maxLength={120}
              className="w-full rounded-xl border border-white/10 bg-[#01040A] px-10 py-3 text-sm text-white outline-none focus:border-sky-300/45"
              aria-label="Global admin search"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="max-h-[62vh] overflow-y-auto p-2">
          {busy ? (
            <div className="flex items-center gap-2 p-6 text-sm text-slate-600">
              <Loader2 size={15} className="animate-spin" />
              Searching...
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center">
              <Search size={18} className="mx-auto text-slate-700" />
              <p className="mt-2 text-sm text-slate-600">
                {query.trim() ? "No matching admin records." : "Type to search across the Control Room."}
              </p>
            </div>
          ) : (
            rows.map((row, index) => (
              <button
                key={row.id}
                type="button"
                onMouseEnter={() => setActive(index)}
                onClick={() => onNavigate(row.target)}
                className={
                  "flex w-full items-center gap-3 rounded-xl p-3 text-left transition " +
                  (index === active ? "bg-white/[0.07]" : "hover:bg-white/[0.04]")
                }
                aria-selected={index === active}
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/[0.07] bg-[#01040A]">
                  <Search size={14} className="text-sky-300/80" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white">{row.title}</div>
                  <div className="mt-1 truncate text-[10px] text-slate-600">{row.subtitle}</div>
                </div>
                <span className="mono text-[9px] uppercase tracking-wider text-slate-600">{row.type}</span>
                {index === active ? <ChevronRight size={13} className="text-sky-300" /> : null}
              </button>
            ))
          )}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3 text-[9px] text-slate-600">
          <span className="inline-flex items-center gap-1"><Keyboard size={11} /> ↑ ↓ navigate · Enter open</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );
}

export function ReleaseCenter() {
  const qc = useQueryClient();
  const list = useServerFn(listAdminDrafts);
  const create = useServerFn(createAdminDraft);
  const draftLoader = useServerFn(getAdminDraft);
  const update = useServerFn(updateAdminDraft);
  const review = useServerFn(submitAdminDraftForReview);
  const discard = useServerFn(discardAdminDraft);
  const publish = useServerFn(publishAdminDrafts);
  const diff = useServerFn(getAdminDraftDiff);
  const directoryLoader = useServerFn(listAdminEditableEntities);

  const [filter, setFilter] = useState<"all" | "draft" | "review" | "published" | "discarded">("all");
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [directory, setDirectory] = useState<EntityDirectory | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [editorId, setEditorId] = useState<string | null>(null);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setBusy(true);
    try {
      const [drafts, directoryResult] = await Promise.all([
        list({ data: { status: filter, limit: 200 } }),
        directoryLoader({ data: {} }),
      ]);
      setRows((drafts.rows ?? []) as DraftRow[]);
      setDirectory(directoryResult.entities as EntityDirectory);
      setSelected([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Release data could not be loaded");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [filter]);

  const reviewable = rows.filter((row) => row.status === "review");
  const selectedReviewable = selected.filter((id) => reviewable.some((row) => row.id === id));

  const createDraft = async (entity_type: Phase4EntityType, entity_id: string) => {
    const entity = directory?.[entity_type]?.find((item) => item.id === entity_id);
    if (!entity) return;
    try {
      const result = await create({
        data: {
          entity_type,
          entity_id,
          label: entity.label,
        },
      });
      setCreateOpen(false);
      await refresh();
      setEditorId(result.row.id);
      toast.success(result.created ? "Draft created" : "Existing draft opened");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draft could not be created");
    }
  };

  const saveDraft = async (id: string, payload: Record<string, unknown>, status?: "draft" | "review") => {
    try {
      await update({ data: { id, payload, status } });
      await refresh();
      toast.success(status === "review" ? "Sent to review" : "Draft saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draft could not be saved");
    }
  };

  const discardDraft = async (id: string) => {
    if (!confirm("Discard this draft? The live site will remain unchanged.")) return;
    try {
      await discard({ data: { id } });
      await refresh();
      setEditorId(null);
      toast.success("Draft discarded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Draft could not be discarded");
    }
  };

  const publishSelected = async () => {
    if (!selectedReviewable.length) {
      toast.error("Select at least one draft in Review.");
      return;
    }
    let changed = 0;
    let images = 0;
    let reordered = 0;
    try {
      for (const id of selectedReviewable) {
        const result = await diff({ data: { id } });
        changed += result.diff.changedCount;
        images += result.diff.imagesReplaced;
        if (result.diff.reordered) reordered += 1;
      }
      const impact = \`\${changed} field\${changed === 1 ? "" : "s"} changed, \${images} media change\${images === 1 ? "" : "s"}\${reordered ? \`, \${reordered} reorder\${reordered === 1 ? "" : "s"}\` : ""}\`;
      if (!confirm(\`Publish \${selectedReviewable.length} change\${selectedReviewable.length === 1 ? "" : "s"}?\\n\\nImpact: \${impact}\\n\\nThis publishes atomically and checks for stale data.\`)) return;
      await publish({ data: { ids: selectedReviewable, note: impact } });
      await refresh();
      toast.success("Changes published");
    } catch (error) {
      if (error instanceof Error && /stale/i.test(error.message)) {
        toast.error("A live record changed since this draft was created. Reload and compare before publishing.");
      } else {
        toast.error(error instanceof Error ? error.message : "Publish failed");
      }
    }
  };

  const draftById = (id: string | null) => rows.find((row) => row.id === id) ?? null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-sky-300/70">
            <Send size={13} />
            Release Management
          </div>
          <h2 className="display mt-1 text-3xl text-metal">Draft. Review. Publish.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Prepare changes without touching live content, preview them, compare the impact, send for review and publish atomically.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-300 px-4 text-xs font-semibold text-[#01040A] hover:bg-sky-200"
        >
          <Play size={13} />
          New draft
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryTile label="Drafts" value={rows.filter((row) => row.status === "draft").length} />
        <SummaryTile label="In review" value={rows.filter((row) => row.status === "review").length} />
        <SummaryTile label="Published" value={rows.filter((row) => row.status === "published").length} />
        <SummaryTile label="Unsaved now" value={hasAdminDirty() ? "Yes" : "No"} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "draft", "review", "published", "discarded"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={
              "rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-wider " +
              (filter === value
                ? "border-sky-300/30 bg-sky-300/10 text-sky-100"
                : "border-white/[0.08] text-slate-500 hover:text-white")
            }
          >
            {value}
          </button>
        ))}
        {selectedReviewable.length > 0 ? (
          <button
            type="button"
            onClick={() => void publishSelected()}
            className="ml-auto inline-flex min-h-9 items-center gap-2 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 text-[10px] uppercase tracking-wider text-emerald-200"
          >
            <Send size={12} />
            Publish {selectedReviewable.length}
          </button>
        ) : null}
      </div>

      {busy ? (
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#030814] p-8 text-sm text-slate-600">
          <Loader2 size={15} className="animate-spin" /> Loading release queue...
        </div>
      ) : rows.length === 0 ? (
        <EmptyBlock title="No release records" body="Create a draft from any editable website entity to start a governed change." />
      ) : (
        <div className="space-y-2">
          {rows.map((row) => {
            const checked = selected.includes(row.id);
            return (
              <div key={row.id} className="rounded-xl border border-white/[0.07] bg-[#030814]">
                <div className="flex flex-wrap items-center gap-3 p-4">
                  {row.status === "review" ? (
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) =>
                        setSelected((current) =>
                          event.target.checked
                            ? [...current, row.id]
                            : current.filter((id) => id !== row.id),
                        )
                      }
                      aria-label={\`Select \${row.label}\`}
                    />
                  ) : <span className="w-4" />}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{row.label}</div>
                    <div className="mt-1 text-[10px] text-slate-600">
                      {ENTITY_LABELS[row.entity_type]} · {row.entity_id} · updated {new Date(row.updated_at).toLocaleString()}
                    </div>
                  </div>
                  <StatusBadge status={row.status} />
                  <button
                    type="button"
                    onClick={() => setEditorId(row.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-400 hover:text-white"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompareId(row.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-400 hover:text-white"
                  >
                    <ArrowLeftRight size={12} /> Compare
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewId(row.id)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-400 hover:text-white"
                  >
                    Preview
                  </button>
                  {row.status === "draft" ? (
                    <button
                      type="button"
                      onClick={() => void (async () => {
                        try {
                          await review({ data: { id: row.id } });
                          await refresh();
                          toast.success("Draft sent to review");
                        } catch (error) {
                          toast.error(error instanceof Error ? error.message : "Review transition failed");
                        }
                      })()}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-sky-300/20 px-3 text-[10px] text-sky-200"
                    >
                      <Send size={12} /> Review
                    </button>
                  ) : null}
                  {row.status === "review" ? (
                    <button
                      type="button"
                      onClick={() => void publish({ data: { ids: [row.id], note: "Single release" } }).then(refresh).then(() => toast.success("Published")).catch((error) => toast.error(error instanceof Error ? error.message : "Publish failed"))}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-emerald-300/20 px-3 text-[10px] text-emerald-200"
                    >
                      <Check size={12} /> Publish
                    </button>
                  ) : null}
                  {row.status === "draft" || row.status === "review" ? (
                    <button
                      type="button"
                      onClick={() => void discardDraft(row.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-slate-600 hover:text-red-300"
                      aria-label={\`Discard \${row.label}\`}
                    >
                      <Trash2 size={12} />
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {createOpen && directory ? (
        <NewDraftDialog
          directory={directory}
          onClose={() => setCreateOpen(false)}
          onCreate={createDraft}
        />
      ) : null}
      {editorId ? (
        <DraftEditorModal
          draftId={editorId}
          onClose={() => setEditorId(null)}
          onSave={saveDraft}
          onDiscard={discardDraft}
          draftLoader={draftLoader}
        />
      ) : null}
      {compareId ? (
        <CompareModal draftId={compareId} onClose={() => setCompareId(null)} diffLoader={diff} />
      ) : null}
      {previewId ? (
        <PreviewModal draftId={previewId} onClose={() => setPreviewId(null)} previewLoader={useServerFn(getAdminPreviewBundle)} />
      ) : null}
    </div>
  );
}

function NewDraftDialog({
  directory,
  onClose,
  onCreate,
}: {
  directory: EntityDirectory;
  onClose: () => void;
  onCreate: (type: Phase4EntityType, id: string) => Promise<void>;
}) {
  const [type, setType] = useState<Phase4EntityType>("site_settings");
  const [entityId, setEntityId] = useState("");
  const options = directory[type] ?? [];
  useEffect(() => {
    setEntityId(options[0]?.id ?? "");
  }, [type, directory]);

  return (
    <Modal title="Create governed draft" onClose={onClose}>
      <div className="grid gap-4">
        <label className="space-y-2">
          <FieldLabel>Entity</FieldLabel>
          <select value={type} onChange={(event) => setType(event.target.value as Phase4EntityType)} className="adm-input">
            {Object.entries(ENTITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="space-y-2">
          <FieldLabel>Record</FieldLabel>
          <select value={entityId} onChange={(event) => setEntityId(event.target.value)} className="adm-input">
            {options.map((item) => <option key={item.id} value={item.id}>{item.label}{item.meta ? \` · \${item.meta}\` : ""}</option>)}
          </select>
        </label>
        <div className="rounded-lg border border-sky-300/15 bg-sky-300/[0.04] p-3 text-xs leading-relaxed text-slate-400">
          Creating a draft clones the current live record. Editing the draft does not change the public site until Publish.
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400">Cancel</button>
          <button type="button" disabled={!entityId} onClick={() => void onCreate(type, entityId)} className="rounded-lg bg-sky-300 px-4 py-2 text-xs font-semibold text-[#01040A] disabled:opacity-40">Create draft</button>
        </div>
      </div>
    </Modal>
  );
}

function DraftEditorModal({
  draftId,
  onClose,
  onSave,
  onDiscard,
  draftLoader,
}: {
  draftId: string;
  onClose: () => void;
  onSave: (id: string, payload: Record<string, unknown>, status?: "draft" | "review") => Promise<void>;
  onDiscard: (id: string) => Promise<void>;
  draftLoader: (input: { data: { id: string } }) => Promise<any>;
}) {
  const [draft, setDraft] = useState<DraftRow | null>(null);
  const [payload, setPayload] = useState<Record<string, unknown>>({});
  const [busy, setBusy] = useState(false);
  const [localDirty, setLocalDirty] = useState(false);

  useEffect(() => {
    let alive = true;
    setBusy(true);
    void draftLoader({ data: { id: draftId } })
      .then((result) => {
        if (!alive) return;
        setDraft(result.row as DraftRow);
        setPayload((result.row.payload ?? {}) as Record<string, unknown>);
        setLocalDirty(false);
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Draft could not be loaded"))
      .finally(() => alive && setBusy(false));
    return () => { alive = false; };
  }, [draftId, draftLoader]);

  useEffect(() => {
    setAdminDirty("release:" + draftId, localDirty);
    return () => setAdminDirty("release:" + draftId, false);
  }, [draftId, localDirty]);

  if (busy || !draft) return <Modal title="Draft editor" onClose={onClose}><div className="grid place-items-center py-12 text-slate-600"><Loader2 className="animate-spin" /></div></Modal>;

  const update = (key: string, value: unknown) => {
    setLocalDirty(true);
    setPayload((current) => ({ ...current, [key]: value }));
  };
  const isProject = draft.entity_type === "projects";
  const isClient = draft.entity_type === "clients";
  const isService = draft.entity_type === "services";
  const isStat = draft.entity_type === "stats";
  const isMethod = draft.entity_type === "about_method";
  const isSetting = draft.entity_type === "site_settings";

  const save = async (nextStatus?: "draft" | "review") => {
    try {
      await onSave(draftId, payload, nextStatus);
      setLocalDirty(false);
      setAdminDirty("release:" + draftId, false);
      if (nextStatus === "review") onClose();
    } catch {
      // Parent handles feedback.
    }
  };

  return (
    <Modal title={\`Edit draft · \${draft.label}\`} onClose={() => {
        const ownDirty = getAdminDirtyKeys().includes("release:" + draftId);
        if (!ownDirty || window.confirm("Existem alterações não guardadas neste draft. Fechar e perder o trabalho local?")) {
          clearAdminDirty();
          onClose();
        }
      }} wide>
      <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {isSetting ? (
            <>
              <Field label="Setting key" hint="The key is fixed for this draft.">
                <input value={draft.entity_id} disabled className="adm-input opacity-60" />
              </Field>
              {Object.entries(payload).map(([key, value]) =>
                typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? (
                  <Field key={key} label={key.replaceAll("_", " ")}>
                    {typeof value === "boolean" ? (
                      <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                        <input type="checkbox" checked={value} onChange={(event) => update(key, event.target.checked)} />
                        {value ? "Enabled" : "Disabled"}
                      </label>
                    ) : key.toLowerCase().includes("description") || key.toLowerCase().includes("subtitle") || key.toLowerCase().includes("bio") || key.toLowerCase().includes("notes") ? (
                      <textarea className="adm-input min-h-28" value={String(value)} onChange={(event) => update(key, event.target.value)} />
                    ) : (
                      <input className="adm-input" value={String(value)} onChange={(event) => update(key, event.target.value)} />
                    )}
                  </Field>
                ) : null,
              )}
              <ComplexFields payload={payload} update={update} />
            </>
          ) : isProject ? (
            <>
              <Field label="Title"><input className="adm-input" value={String(payload.title ?? "")} onChange={(event) => update("title", event.target.value)} /></Field>
              <Field label="Client"><input className="adm-input" value={String(payload.client_name ?? "")} onChange={(event) => update("client_name", event.target.value)} /></Field>
              <Field label="Category"><input className="adm-input" value={String(payload.category ?? "")} onChange={(event) => update("category", event.target.value)} /></Field>
              <Field label="Year"><input className="adm-input" value={String(payload.year ?? "")} onChange={(event) => update("year", event.target.value)} /></Field>
              <Field label="Description"><textarea className="adm-input min-h-28" value={String(payload.description ?? "")} onChange={(event) => update("description", event.target.value)} /></Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Sort order"><input type="number" className="adm-input" value={String(payload.sort_order ?? 0)} onChange={(event) => update("sort_order", Number(event.target.value) || 0)} /></Field>
                <Field label="Featured priority"><input type="number" className="adm-input" value={String(payload.featured_priority ?? 0)} onChange={(event) => update("featured_priority", Number(event.target.value) || 0)} /></Field>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <ToggleField label="Published" value={Boolean(payload.is_published)} onChange={(value) => update("is_published", value)} />
                <ToggleField label="Featured" value={Boolean(payload.featured)} onChange={(value) => update("featured", value)} />
              </div>
              <Field label="Cover URL"><input type="url" className="adm-input" value={String(payload.cover_url ?? "")} onChange={(event) => update("cover_url", event.target.value || null)} /></Field>
              <Field label="Video URL"><input type="url" className="adm-input" value={String(payload.video_url ?? "")} onChange={(event) => update("video_url", event.target.value || null)} /></Field>
              <ComplexArrayEditor label="Tags" values={toStringArray(payload.tags)} onChange={(values) => update("tags", values)} />
              <ComplexArrayEditor label="Deliverables" values={toStringArray(payload.deliverables)} onChange={(values) => update("deliverables", values)} />
              <ComplexArrayEditor label="Collaborators" values={toStringArray(payload.collaborators)} onChange={(values) => update("collaborators", values)} />
              <ComplexArrayEditor label="Tools used" values={toStringArray(payload.tools_used)} onChange={(values) => update("tools_used", values)} />
              <ComplexArrayEditor label="Gallery URLs" values={toStringArray(payload.gallery)} onChange={(values) => update("gallery", values)} />
            </>
          ) : isClient ? (
            <>
              <Field label="Name"><input className="adm-input" value={String(payload.name ?? "")} onChange={(event) => update("name", event.target.value)} /></Field>
              <Field label="Website URL"><input type="url" className="adm-input" value={String(payload.website_url ?? "")} onChange={(event) => update("website_url", event.target.value || null)} /></Field>
              <Field label="Logo URL"><input type="url" className="adm-input" value={String(payload.logo_url ?? "")} onChange={(event) => update("logo_url", event.target.value || null)} /></Field>
              <Field label="Sort order"><input type="number" className="adm-input" value={String(payload.sort_order ?? 0)} onChange={(event) => update("sort_order", Number(event.target.value) || 0)} /></Field>
              <ToggleField label="Active on public site" value={Boolean(payload.is_active)} onChange={(value) => update("is_active", value)} />
            </>
          ) : isService ? (
            <>
              <Field label="Number"><input className="adm-input" value={String(payload.number ?? "")} onChange={(event) => update("number", event.target.value)} /></Field>
              <Field label="Title"><input className="adm-input" value={String(payload.title ?? "")} onChange={(event) => update("title", event.target.value)} /></Field>
              <Field label="Description"><textarea className="adm-input min-h-28" value={String(payload.description ?? "")} onChange={(event) => update("description", event.target.value)} /></Field>
              <Field label="Icon"><input className="adm-input" value={String(payload.icon ?? "")} onChange={(event) => update("icon", event.target.value)} /></Field>
              <Field label="Sort order"><input type="number" className="adm-input" value={String(payload.sort_order ?? 0)} onChange={(event) => update("sort_order", Number(event.target.value) || 0)} /></Field>
              <ToggleField label="Active on public site" value={Boolean(payload.is_active)} onChange={(value) => update("is_active", value)} />
            </>
          ) : isStat ? (
            <>
              <Field label="Value"><input className="adm-input" value={String(payload.value ?? "")} onChange={(event) => update("value", event.target.value)} /></Field>
              <Field label="Label"><input className="adm-input" value={String(payload.label ?? "")} onChange={(event) => update("label", event.target.value)} /></Field>
              <Field label="Sort order"><input type="number" className="adm-input" value={String(payload.sort_order ?? 0)} onChange={(event) => update("sort_order", Number(event.target.value) || 0)} /></Field>
              <ToggleField label="Active on public site" value={Boolean(payload.is_active)} onChange={(value) => update("is_active", value)} />
            </>
          ) : isMethod ? (
            <>
              <Field label="Number"><input className="adm-input" value={String(payload.number ?? "")} onChange={(event) => update("number", event.target.value)} /></Field>
              <Field label="Title"><input className="adm-input" value={String(payload.title ?? "")} onChange={(event) => update("title", event.target.value)} /></Field>
              <Field label="Description"><textarea className="adm-input min-h-28" value={String(payload.description ?? "")} onChange={(event) => update("description", event.target.value)} /></Field>
              <Field label="Sort order"><input type="number" className="adm-input" value={String(payload.sort_order ?? 0)} onChange={(event) => update("sort_order", Number(event.target.value) || 0)} /></Field>
              <ToggleField label="Active on public site" value={Boolean(payload.is_active)} onChange={(value) => update("is_active", value)} />
            </>
          ) : null}
          <div className="rounded-xl border border-white/[0.06] bg-[#01040A] p-4">
            <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Advanced payload</div>
            <p className="mt-1 text-xs text-slate-600">Complex nested data is preserved. Use the normal CMS managers for routine edits.</p>
            <textarea
              value={JSON.stringify(payload, null, 2)}
              onChange={(event) => {
                try {
                  const next = JSON.parse(event.target.value);
                  if (next && typeof next === "object" && !Array.isArray(next)) setPayload(next);
                } catch {
                  // Keep last valid payload while the textarea is being edited.
                }
              }}
              spellCheck={false}
              rows={12}
              className="mt-3 w-full rounded-lg border border-white/[0.08] bg-[#030814] p-3 font-mono text-[10px] text-slate-300 outline-none focus:border-sky-300/40"
              aria-label="Advanced draft payload"
            />
          </div>
        </div>
        <aside className="space-y-3">
          <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-sky-300/70">Release state</div>
            <div className="mt-2 flex items-center gap-2 text-sm text-white"><StatusBadge status={draft.status} /></div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Live content remains untouched until the release is published.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[#01040A] p-4">
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Governance</div>
            <div className="mt-3 space-y-2 text-xs text-slate-500">
              <p>Baseline: {draft.baseline_updated_at ? new Date(draft.baseline_updated_at).toLocaleString() : "initial snapshot"}</p>
              <p>Updated: {new Date(draft.updated_at).toLocaleString()}</p>
              <p>Optimistic concurrency: active</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => void save()} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-sky-300/25 bg-sky-300/10 px-4 text-xs text-sky-100"><Check size={13}/> Save draft</button>
            <button type="button" onClick={() => void save("review")} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-300 px-4 text-xs font-semibold text-[#01040A]"><Send size={13}/> Save &amp; send to review</button>
            <button type="button" onClick={() => void onDiscard(draftId)} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 text-xs text-slate-500 hover:text-red-300"><Trash2 size={13}/> Discard</button>
          </div>
          <button type="button" onClick={() => window.open("/admin/preview?draft=" + encodeURIComponent(draftId), "_blank", "noopener,noreferrer")} className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.08] px-4 text-xs text-slate-400 hover:text-white"><ExternalLink size={13}/> Open preview route</button>
        </aside>
      </div>
    </Modal>
  );
}

function ComplexFields({ payload, update }: { payload: Record<string, unknown>; update: (key: string, value: unknown) => void }) {
  return <div className="grid gap-3">
    {Object.entries(payload).filter(([, value]) => typeof value === "object" && value !== null && !Array.isArray(value)).map(([key, value]) => (
      <Field key={key} label={key.replaceAll("_", " ")}>
        <textarea
          className="adm-input min-h-24 font-mono text-[10px]"
          value={JSON.stringify(value, null, 2)}
          onChange={(event) => { try { const parsed = JSON.parse(event.target.value); update(key, parsed); } catch {} }}
        />
      </Field>
    ))}
  </div>;
}

function ComplexArrayEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (values: string[]) => void }) {
  return <Field label={label} hint="One item per line.">
    <textarea className="adm-input min-h-24" value={values.join("\n")} onChange={(event) => onChange(event.target.value.split(/\n/).map((value) => value.trim()).filter(Boolean))} />
  </Field>;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function ToggleField({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!value)} className={\`flex w-full items-center justify-between rounded-lg border px-3 py-3 text-left \${value ? "border-emerald-300/20 bg-emerald-300/[0.04] text-emerald-200" : "border-white/[0.08] text-slate-500"}\`}><span className="text-sm">{label}</span><span className="mono text-[9px] uppercase">{value ? "Enabled" : "Disabled"}</span></button>;
}

function CompareModal({ draftId, onClose, diffLoader }: { draftId: string; onClose: () => void; diffLoader: ReturnType<typeof useServerFn<typeof getAdminDraftDiff>> }) {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    void diffLoader({ data: { id: draftId } }).then(setData).catch((error) => toast.error(error instanceof Error ? error.message : "Compare failed"));
  }, [diffLoader, draftId]);
  return <Modal title="Compare with live baseline" onClose={onClose} wide>
    {!data ? <div className="grid place-items-center py-12 text-slate-600"><Loader2 className="animate-spin"/></div> :
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-4">
          <SummaryTile label="Changed fields" value={data.diff.changedCount}/>
          <SummaryTile label="Media changes" value={data.diff.imagesReplaced}/>
          <SummaryTile label="Reordered" value={data.diff.reordered ? "Yes" : "No"}/>
          <SummaryTile label="Entity" value={ENTITY_LABELS[data.row.entity_type as Phase4EntityType]}/>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#030814] p-4">
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Changed fields</div>
          {data.diff.changedPaths.length === 0 ? <p className="mt-3 text-sm text-slate-600">No differences.</p> :
            <div className="mt-3 grid gap-2 sm:grid-cols-2">{data.diff.changedPaths.map((path:string)=><div key={path} className="rounded-lg border border-white/[0.06] px-3 py-2 text-xs text-slate-300">{path}</div>)}</div>}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <JsonPanel title="Current" value={data.row.baseline_snapshot}/>
          <JsonPanel title="Draft" value={data.row.payload}/>
        </div>
      </div>}
  </Modal>;
}

function PreviewModal({ draftId, onClose, previewLoader }: { draftId: string; onClose: () => void; previewLoader: ReturnType<typeof useServerFn<typeof getAdminPreviewBundle>> }) {
  const [data, setData] = useState<any>(null);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  useEffect(() => {
    void previewLoader({ data: { id: draftId } }).then(setData).catch((error) => toast.error(error instanceof Error ? error.message : "Preview failed"));
  }, [draftId, previewLoader]);
  const width = device === "desktop" ? "100%" : device === "tablet" ? "768px" : "390px";
  return <Modal title="Live preview" onClose={onClose} wide>
    {!data ? <div className="grid place-items-center py-12 text-slate-600"><Loader2 className="animate-spin"/></div> :
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">Draft overlay</div>
          <div className="flex items-center gap-1 rounded-lg border border-white/[0.08] p-1">
            {([["desktop",Monitor],["tablet",Tablet],["mobile",Smartphone]] as const).map(([id,Icon])=><button key={id} type="button" onClick={()=>setDevice(id)} aria-label={id} className={\`grid h-8 w-9 place-items-center rounded \${device===id?"bg-white/10 text-white":"text-slate-600 hover:text-white"}\`}><Icon size={13}/></button>)}
          </div>
        </div>
        <div className="overflow-auto rounded-xl border border-white/[0.08] bg-[#020712] p-2">
          <div className="mx-auto min-h-[520px] overflow-hidden rounded-lg border border-white/[0.06] bg-[#01040A] transition-all" style={{ width, maxWidth:"100%" }}>
            <PreviewCanvas data={data}/>
          </div>
        </div>
      </div>}
  </Modal>;
}

function PreviewCanvas({ data }: { data: any }) {
  const settings = data.settings ?? {};
  const hero = settings.hero ?? {};
  const manifesto = settings.manifesto ?? {};
  const project = data.selectedProject;
  const featured = (data.projects ?? []).filter((row: any) => row.featured).sort((a:any,b:any)=>Number(a.featured_priority??0)-Number(b.featured_priority??0)).slice(0,3);

  const featuredSettings = settings.featured_section ?? {};
  const service = data.selectedService;
  const client = data.selectedClient;
  const stat = data.selectedStat;
  const method = data.selectedMethod;

  return <div className="space-y-0 text-slate-200">
    <section className="min-h-[360px] border-b border-white/10 p-6 sm:p-10">
      <div className="flex items-center justify-between gap-3 text-[9px] uppercase tracking-[0.2em] text-slate-600"><span>{hero.top_left ?? "KUTUZOV"}</span><span>{hero.top_right ?? ""}</span></div>
      <div className="mt-20 max-w-2xl">
        <div className="mono text-[9px] uppercase tracking-[0.18em] text-sky-300/70">{hero.eyebrow ?? "CREATIVE DIRECTION"}</div>
        <h3 className="display mt-3 text-4xl leading-none text-white sm:text-6xl">{hero.title_1 ?? "Design systems"}<br/>{hero.title_2 ?? "for brands that"}<br/><em className="text-sky-300">{hero.title_accent ?? "matter."}</em></h3>
        <p className="mt-5 max-w-xl text-xs leading-6 text-slate-500">{hero.subtitle ?? ""}</p>
      </div>
    </section>
    <section className="border-b border-white/10 p-6 sm:p-10">
      <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{manifesto.eyebrow ?? "MANIFESTO"}</div>
      <h4 className="display mt-2 text-2xl text-white">{manifesto.title_1 ?? "The work should"} {manifesto.title_accent ?? "mean something."}</h4>
      <div className="mt-4 grid gap-4 text-xs leading-6 text-slate-500 sm:grid-cols-2"><p>{manifesto.col1 ?? ""}</p><p>{manifesto.col2 ?? ""}</p></div>
    </section>
    <section className="p-6 sm:p-10">
      <div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">FEATURED WORK</div>
      <h4 className="display mt-2 text-2xl text-white">{featuredSettings.title ?? "Featured Work"}</h4>
      {featuredSettings.subtitle ? <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-500">{featuredSettings.subtitle}</p> : null}
      {project ? <div className="mt-4 rounded-xl border border-sky-300/20 bg-sky-300/[0.04] p-4"><div className="text-[10px] uppercase text-sky-300/70">Draft entity</div><div className="mt-2 text-lg text-white">{project.title}</div><div className="mt-1 text-xs text-slate-500">{project.client_name ?? ""} · {project.category}</div>{project.cover_url ? <img src={project.cover_url} alt="" className="mt-4 max-h-72 w-full rounded object-contain bg-black/20"/> : null}</div> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-3">{featured.map((row:any)=><div key={row.id} className="rounded-xl border border-white/[0.07] p-3">{row.cover_url ? <img src={row.cover_url} alt="" className="aspect-[4/3] w-full rounded object-cover"/> : <div className="aspect-[4/3] rounded bg-white/[0.03]"/>}<div className="mt-2 text-xs text-white">{row.title}</div></div>)}</div>
      {(client || service || stat || method) ? <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {client ? <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4"><div className="mono text-[9px] uppercase text-sky-300/70">Client draft</div><div className="mt-2 text-sm text-white">{client.name}</div><div className="mt-1 text-xs text-slate-500">{client.website_url ?? "No website"}</div></div> : null}
        {service ? <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4"><div className="mono text-[9px] uppercase text-sky-300/70">Service draft</div><div className="mt-2 text-sm text-white">{service.title}</div><div className="mt-1 text-xs text-slate-500">{service.description ?? ""}</div></div> : null}
        {stat ? <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4"><div className="mono text-[9px] uppercase text-sky-300/70">Stat draft</div><div className="mt-2 text-2xl text-white">{stat.value}</div><div className="mt-1 text-xs text-slate-500">{stat.label}</div></div> : null}
        {method ? <div className="rounded-xl border border-sky-300/15 bg-sky-300/[0.035] p-4"><div className="mono text-[9px] uppercase text-sky-300/70">Method draft</div><div className="mt-2 text-sm text-white">{method.title}</div><div className="mt-1 text-xs text-slate-500">{method.description ?? ""}</div></div> : null}
      </div> : null>
    </section>
  </div>;
}

export function AuditCenter() {
  const load = useServerFn(getAdminAuditLogPhase4);
  const restore = useServerFn(restoreAdminAuditState);
  const [rows, setRows] = useState<any[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [action, setAction] = useState<"all"|"create"|"update"|"delete">("all");
  const [entity, setEntity] = useState("all");
  const [search, setSearch] = useState("");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchRows = async () => {
    setBusy(true);
    try {
      const result = await load({ data: {
        limit: 300,
        action: action === "all" ? undefined : action,
        entity_type: entity === "all" ? undefined : entity,
        search: search.trim() || undefined,
        since: since ? new Date(since).toISOString() : undefined,
        until: until ? new Date(until).toISOString() : undefined,
      }});
      setRows(result.rows ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Audit could not be loaded");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => { void fetchRows(); }, [action, entity]);

  const entities = ["all", ...Array.from(new Set(rows.map((row) => row.entity_type))).sort()];

  return <div className="space-y-6">
    <header>
      <div className="mono text-[10px] uppercase tracking-[0.25em] text-sky-300/70">SYSTEM / AUDIT CENTER</div>
      <h2 className="display mt-1 text-3xl text-metal">Who changed what.</h2>
      <p className="mt-2 text-sm text-slate-500">Global database-backed audit events, with before/after inspection and controlled restoration.</p>
    </header>
    <div className="grid gap-2 lg:grid-cols-[auto_auto_1fr_180px_180px]">
      <select value={action} onChange={(event) => setAction(event.target.value as typeof action)} className="adm-input" aria-label="Action"><option value="all">All actions</option><option value="create">Create</option><option value="update">Update</option><option value="delete">Delete</option></select>
      <select value={entity} onChange={(event) => setEntity(event.target.value)} className="adm-input" aria-label="Entity">{entities.map((value)=><option key={value} value={value}>{value === "all" ? "All entities" : value}</option>)}</select>
      <input value={search} onChange={(event)=>setSearch(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter")void fetchRows();}} placeholder="Search actor, entity, id..." className="adm-input"/>
      <input type="datetime-local" value={since} onChange={(event)=>setSince(event.target.value)} className="adm-input" aria-label="Since"/>
      <input type="datetime-local" value={until} onChange={(event)=>setUntil(event.target.value)} className="adm-input" aria-label="Until"/>
    </div>
    <div className="flex justify-end"><button type="button" onClick={()=>void fetchRows()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-400"><RefreshCw size={12}/> Refresh</button></div>
    {busy ? <LoadingBlock label="Loading audit events..."/> : rows.length === 0 ? <EmptyBlock title="No audit events" body="There are no events matching the current filters."/> :
      <div className="space-y-2">{rows.map((row)=><div key={row.id} className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#030814]">
        <button type="button" onClick={()=>setOpen(open===row.id?null:row.id)} className="flex w-full items-center gap-3 p-4 text-left">
          {open===row.id?<ChevronDown size={13}/>:<ChevronRight size={13}/>}
          <StatusBadge status={row.action}/>
          <span className="mono text-[9px] uppercase tracking-wider text-slate-600">{row.entity_type}</span>
          <span className="min-w-0 flex-1 truncate text-sm text-white">{row.entity_label ?? row.entity_id}</span>
          <span className="hidden text-[10px] text-slate-600 md:block">{row.actor_email ?? "system"} · {new Date(row.created_at).toLocaleString()}</span>
        </button>
        {open===row.id ? <div className="border-t border-white/[0.07] p-4"><div className="grid gap-4 lg:grid-cols-2"><JsonPanel title="Before" value={row.before_data}/><JsonPanel title="After" value={row.after_data}/></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><span className="text-[10px] text-slate-600">Audit ID: {row.id}</span>{["site_settings","projects","clients","services","stats","about_method"].includes(row.entity_type) ? <button type="button" onClick={()=>void (async()=>{if(!confirm("Restore this audited state? A new audit event will be created."))return;try{await restore({data:{id:row.id,entity_type:row.entity_type,entity_id:row.entity_id,snapshot:row.after_data ?? row.before_data ?? {},}});toast.success("State restored");await fetchRows();}catch(error){toast.error(error instanceof Error?error.message:"Restore failed");}})()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-amber-300/20 px-3 text-[10px] text-amber-200"><Undo2 size={12}/> Restore this state</button>:null}</div></div>:null}
      </div>)}
    </div>}
  </div>;
}

export function SystemHealthCenter() {
  const load = useServerFn(getAdminSystemHealth);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    setBusy(true);
    try { setData(await load({data:{}})); } catch(error){ toast.error(error instanceof Error?error.message:"System health failed"); } finally { setBusy(false); }
  };
  useEffect(()=>{void refresh();},[]);
  const items = [
    ["Database", data?.database?.database?.status, data?.database?.database?.postgres_version],
    ["Realtime", data?.database?.realtime?.status, \`\${data?.database?.realtime?.subscribed_tables ?? 0} / \${data?.database?.realtime?.expected_tables ?? 0} tables\`],
    ["Storage", data?.database?.storage?.status, data?.database?.storage?.bucket],
    ["Public Site", data?.providers?.public_site?.status, data?.providers?.public_site?.http_status ? \`HTTP \${data.providers.public_site.http_status}\` : data?.providers?.public_site?.url],
    ["Vercel", data?.providers?.vercel?.status, data?.providers?.vercel?.environment],
    ["Resend", data?.providers?.resend?.status, data?.providers?.resend?.configured ? "configured" : "not configured"],
    ["Gemini", data?.providers?.gemini?.status, data?.providers?.gemini?.configured ? "configured" : "not configured"],
    ["Audit", data?.database?.audit?.status, \`\${data?.database?.audit?.events ?? 0} events\`],
    ["Versioning", data?.database?.versioning?.status, \`\${data?.database?.versioning?.versions ?? 0} versions\`],
  ] as Array<[string,string|undefined,string|undefined]>;

  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><div className="mono text-[10px] uppercase tracking-[0.25em] text-sky-300/70">SYSTEM / HEALTH</div><h2 className="display mt-1 text-3xl text-metal">System health.</h2><p className="mt-2 text-sm text-slate-500">Operational signals without exposing provider credentials.</p></div>
      <button type="button" disabled={busy} onClick={()=>void refresh()} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-400"><RefreshCw size={13} className={busy?"animate-spin":""}/> Run checks</button>
    </header>
    {!data ? <LoadingBlock label="Checking system boundaries..."/> :
      <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{items.map(([label,status,detail])=><HealthCard key={label} label={label} status={status ?? "warning"} detail={detail}/>)}</div>
        <div className="grid gap-5 lg:grid-cols-2">
          <Panel kicker="Recovery" title="Disaster recovery readiness">
            <div className="grid gap-3 sm:grid-cols-2">{[
              ["RPO target", \`\${data.recovery?.rpo_hours ?? 24} hours\`],
              ["RTO target", \`\${data.recovery?.rto_hours ?? 4} hours\`],
              ["Content recovery", data.recovery?.content_versioning ?? "unknown"],
              ["Audit immutability", data.recovery?.audit_immutability ?? "unknown"],
              ["Deployment rollback", data.recovery?.deployment_rollback ?? "unknown"],
              ["Database backup", data.recovery?.database_backup ?? "external"],
            ].map(([label,value])=><div key={label} className="rounded-lg border border-white/[0.06] p-3"><div className="mono text-[9px] uppercase tracking-wider text-slate-600">{label}</div><div className="mt-2 text-sm text-slate-200">{value}</div></div>)}</div>
            <a href="/docs/DATA_RECOVERY.md" className="mt-4 inline-flex items-center gap-2 text-[10px] text-sky-300">Recovery policy <ExternalLink size={11}/></a>
            <p className="mt-3 text-[10px] leading-relaxed text-slate-600">Provider-managed database backup and restore drills remain external operational controls. The Admin does not claim a restore test was executed when it was not.</p>
          </Panel>
          <Panel kicker="QA / Accessibility" title="Release gate checklist">
            <div className="space-y-2">{[
              "Keyboard-only navigation",
              "Visible focus states",
              "Dialog labels and Escape handling",
              "Semantic buttons and form controls",
              "Responsive desktop / tablet / mobile surfaces",
              "Contrast reviewed on dark surfaces",
              "Heavy workspaces loaded on demand",
              "Backend permission checks remain authoritative",
            ].map((label)=><div key={label} className="flex items-center gap-2 rounded-lg border border-white/[0.06] p-3 text-xs text-slate-400"><Check size={13} className="text-emerald-300"/>{label}</div>)}</div>
          </Panel>
        </div>
      </>}
  </div>;
}

function HealthCard({ label, status, detail }: { label:string; status:string; detail?:string }) {
  const tone = status === "healthy" ? "border-emerald-300/20 bg-emerald-300/[0.04] text-emerald-200" : status === "error" ? "border-red-300/20 bg-red-300/[0.04] text-red-200" : "border-amber-300/20 bg-amber-300/[0.04] text-amber-200";
  return <div className={\`rounded-xl border p-4 \${tone}\`}><div className="flex items-center justify-between gap-2"><div className="text-sm text-white">{label}</div><StatusBadge status={status}/></div><div className="mt-2 text-[10px] text-slate-500">{detail ?? "No detail"}</div></div>;
}

function SummaryTile({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-xl border border-white/[0.07] bg-[#030814] p-4"><div className="mono text-[9px] uppercase tracking-[0.17em] text-slate-600">{label}</div><div className="mt-2 text-2xl font-semibold text-white">{typeof value === "number" ? value.toLocaleString() : value}</div></div>;
}
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block space-y-2"><span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{label}</span>{hint ? <span className="block text-[10px] text-slate-700">{hint}</span> : null}{children}</label>;
}
function FieldLabel({ children }: { children: ReactNode }) { return <span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{children}</span>; }
function Modal({ title, children, onClose, wide = false }: { title:string; children:ReactNode; onClose:()=>void; wide?:boolean }) {
  return <div className="fixed inset-0 z-[110] grid place-items-center bg-black/70 p-3 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
    <div role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event)=>event.stopPropagation()} className={\`max-h-[92vh] w-full overflow-y-auto rounded-2xl border border-white/10 bg-[#050a12] shadow-2xl \${wide?"max-w-6xl":"max-w-xl"}\`}>
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#050a12]/95 px-5 py-4 backdrop-blur"><h2 className="text-sm font-medium text-white">{title}</h2><button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-slate-500 hover:text-white"><X size={14}/></button></div>
      <div className="p-5">{children}</div>
    </div>
  </div>;
}
function Panel({ kicker, title, children }: { kicker?:string; title:string; children:ReactNode }) { return <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">{kicker?<div className="mono text-[9px] uppercase tracking-[0.2em] text-sky-300/60">{kicker}</div>:null}<h3 className="display mt-1 text-lg text-metal">{title}</h3><div className="mt-4">{children}</div></section>; }
function StatusBadge({ status }: { status: string }) {
  const tone = ["published","healthy","create","completed","paid"].includes(status) ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : ["review","warning","update","draft"].includes(status) ? "border-amber-300/20 bg-amber-300/10 text-amber-200" : ["error","delete","discarded","cancelled"].includes(status) ? "border-red-300/20 bg-red-300/10 text-red-200" : "border-white/[0.08] bg-white/[0.02] text-slate-500";
  return <span className={\`inline-flex rounded-full border px-2 py-1 text-[9px] uppercase tracking-wider \${tone}\`}>{status}</span>;
}
function JsonPanel({ title, value }: { title:string; value:unknown }) { return <div><div className="mono mb-2 text-[9px] uppercase tracking-[0.18em] text-slate-600">{title}</div><pre className="max-h-[330px] overflow-auto rounded-lg border border-white/[0.06] bg-[#01040A] p-3 font-mono text-[10px] leading-5 text-slate-400">{value ? JSON.stringify(value,null,2) : "null"}</pre></div>; }
function LoadingBlock({ label }: { label:string }) { return <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-[#030814] p-8 text-sm text-slate-600"><Loader2 size={15} className="animate-spin"/>{label}</div>; }
function EmptyBlock({ title, body }: { title:string; body:string }) { return <div className="rounded-xl border border-white/[0.07] bg-[#030814] p-8 text-center"><div className="text-sm text-slate-300">{title}</div><p className="mt-2 text-xs text-slate-600">{body}</p></div>; }
function toString(value: unknown) { return String(value ?? ""); }
