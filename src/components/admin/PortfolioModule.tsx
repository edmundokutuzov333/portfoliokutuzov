import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProjects } from "@/hooks/useSiteData";
import {
  PROJECT_CATEGORIES,
  TOOL_OPTIONS,
  isCampaignCategory,
  normalizeCategory,
  type DbProject,
} from "@/lib/cms";
import { readImageDimensions, aspectFromDims } from "@/lib/image-utils";
import { isUuid, generateUuid } from "@/lib/utils";
import {
  createAdminProject,
  createAdminProjectsBatch,
  deleteAdminProject,
  duplicateAdminProject,
  publishAdminProject,
  reorderAdminProjects,
  saveAdminProject,
  prepareAdminMediaUpload,
} from "@/lib/admin.functions";
import { toast } from "sonner";
import { setAdminDirty } from "@/lib/admin-dirty";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  Upload,
} from "lucide-react";

export function PortfolioManager() {
  const qc = useQueryClient();
  const createProject = useServerFn(createAdminProject);
  const deleteProject = useServerFn(deleteAdminProject);
  const duplicateProject = useServerFn(duplicateAdminProject);
  const publishProject = useServerFn(publishAdminProject);
  const reorderProjects = useServerFn(reorderAdminProjects);
  const { data: projects = [] } = useProjects(true);
  const [editing, setEditing] = useState<DbProject | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "draft">("all");
  const [batchOpen, setBatchOpen] = useState(false);

  const ordered = useMemo(
    () => [...projects].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)),
    [projects],
  );

  const filtered = useMemo(() => {
    return ordered
      .filter((p) => filter === "All" || normalizeCategory(p.category) === filter)
      .filter(
        (p) =>
          statusFilter === "all" || (statusFilter === "live" ? p.is_published : !p.is_published),
      );
  }, [ordered, filter, statusFilter]);

  // Move a project up or down in the global order. Swaps sort_order with the
  // adjacent project so the persisted order matches what the public site renders.
  const move = async (p: DbProject, dir: -1 | 1) => {
    const idx = ordered.findIndex((x) => x.id === p.id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= ordered.length) return;
    const other = ordered[swapIdx];
    const a = p.sort_order;
    const b = other.sort_order === a ? a + dir : other.sort_order;
    if (!isUuid(p.id) || !isUuid(other.id)) return;

    try {
      await reorderProjects({
        data: {
          project_id: p.id,
          other_project_id: other.id,
          project_order: b,
          other_order: a,
        },
      });
      qc.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Reorder failed");
    }
  };

  const create = async () => {
    const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    try {
      const result = (await createProject({
        data: { title: "New project", category: "Digital Design", sort_order: max + 1 },
      })) as unknown as { row: DbProject };
      qc.invalidateQueries({ queryKey: ["projects"] });
      if (result.row) setEditing(result.row);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    if (!isUuid(id)) return;
    try {
      await deleteProject({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const duplicate = async (p: DbProject) => {
    if (!isUuid(p.id)) return;
    try {
      await duplicateProject({ data: { id: p.id } });
      toast.success("Duplicated");
      qc.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Duplicate failed");
    }
  };

  const togglePublish = async (p: DbProject) => {
    if (!isUuid(p.id)) return;
    try {
      await publishProject({ data: { id: p.id, is_published: !p.is_published } });
      qc.invalidateQueries({ queryKey: ["projects"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Publish failed");
    }
  };

  return (
    <div>
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="display text-2xl text-metal">Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1">
            Selected work shown on /portfolio. Images preserve real proportions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setBatchOpen(true)}
            className="inline-flex items-center gap-2 border border-white/10 hover:border-sky-300/40 px-4 py-2 rounded text-sm"
          >
            <Plus size={14} /> Batch add
          </button>
          <button
            onClick={create}
            className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold"
          >
            <Plus size={14} /> New project
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2 items-center">
        <div className="mono text-[10px] text-slate-500 mr-2">CATEGORY</div>
        {["All", ...PROJECT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              filter === c
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <div className="mono text-[10px] text-slate-500 mr-2">STATUS</div>
        {(["all", "live", "draft"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setStatusFilter(c)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              statusFilter === c
                ? "bg-sky-300/15 border-sky-300/40 text-sky-100"
                : "border-white/10 text-slate-400 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const ratio = aspectFromDims(p.cover_width, p.cover_height) || "16 / 10";
          const orderIdx = ordered.findIndex((x) => x.id === p.id);
          const isFirst = orderIdx <= 0;
          const isLast = orderIdx === ordered.length - 1;
          const cat = normalizeCategory(p.category);
          return (
            <div
              key={p.id}
              className="bg-[#030814] border border-white/[0.08] rounded-lg overflow-hidden flex flex-col"
            >
              <div
                className="relative bg-[#01040A] border-b border-white/[0.06] grid place-items-center"
                style={{ aspectRatio: ratio }}
              >
                {p.cover_url ? (
                  <img
                    src={p.cover_url}
                    alt={p.title}
                    className={`w-full h-full ${p.image_fit === "cover" ? "object-cover" : "object-contain"}`}
                  />
                ) : (
                  <div className="text-slate-600 text-xs">No cover</div>
                )}
                <div className="absolute top-2 left-2 mono text-[10px] tracking-[0.18em] rounded bg-[#01040A]/80 border border-white/10 text-slate-300 px-2 py-0.5">
                  #{orderIdx + 1}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {p.client_name && (
                      <div className="text-[12px] text-slate-200">{p.client_name}</div>
                    )}
                    <div className="mono text-[10px] tracking-[0.16em] text-slate-500 mt-0.5">
                      {p.year ?? "-"} · {cat}
                    </div>
                    <div className="text-sm font-medium text-slate-100 mt-1">{p.title}</div>
                  </div>
                  <span
                    className={`mono text-[9px] px-2 py-0.5 rounded ${p.is_published ? "bg-sky-300/10 text-sky-200" : "bg-amber-300/10 text-amber-200"}`}
                  >
                    {p.is_published ? "LIVE" : "DRAFT"}
                  </span>
                </div>
                {p.featured && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-300">
                    <Star size={10} /> Featured
                  </div>
                )}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs">
                  <button
                    onClick={() => move(p, -1)}
                    disabled={isFirst}
                    title="Move up"
                    className="inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ArrowUp size={12} />
                  </button>
                  <button
                    onClick={() => move(p, 1)}
                    disabled={isLast}
                    title="Move down"
                    className="inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400"
                  >
                    <ArrowDown size={12} />
                  </button>
                  <span className="w-px h-4 bg-white/10 mx-1" />
                  <button onClick={() => setEditing(p)} className="text-sky-300 hover:text-sky-200">
                    Edit
                  </button>
                  <button
                    onClick={() => duplicate(p)}
                    className="text-slate-400 hover:text-white inline-flex items-center gap-1"
                  >
                    <Copy size={11} /> Duplicate
                  </button>
                  <button
                    onClick={() => togglePublish(p)}
                    className="text-slate-400 hover:text-white"
                  >
                    {p.is_published ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => remove(p.id)}
                    className="ml-auto text-slate-500 hover:text-red-300 inline-flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} />}
      {batchOpen && (
        <BatchAddProjects
          onClose={() => setBatchOpen(false)}
          startSort={projects.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1}
        />
      )}
    </div>
  );
}

function ProjectEditor({ project, onClose }: { project: DbProject; onClose: () => void }) {
  const qc = useQueryClient();
  const saveProject = useServerFn(saveAdminProject);
  const prepareMediaUpload = useServerFn(prepareAdminMediaUpload);
  const [form, setForm] = useState<DbProject>(project);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(project);

  useEffect(() => {
    setAdminDirty("project:" + project.id, dirty);
    return () => setAdminDirty("project:" + project.id, false);
  }, [dirty, project.id]);
  const set = <K extends keyof DbProject>(k: K, v: DbProject[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }
    const isVideoCat = normalizeCategory(form.category) === "Videos";
    if (isVideoCat) {
      if (!form.video_url) {
        toast.error("Video file or external link is required for Videos");
        return;
      }
      if (!form.cover_url) {
        toast.error("Poster image is required for Videos");
        return;
      }
    }
    setSaving(true);
    try {
      const safeId = isUuid(form.id) ? form.id : generateUuid();
      await saveProject({
        data: {
          id: safeId,
          title: form.title,
          subtitle: form.subtitle,
          category: normalizeCategory(form.category),
          year: form.year,
          description: form.description,
          cover_url: form.cover_url,
          cover_width: form.cover_width ?? null,
          cover_height: form.cover_height ?? null,
          palette: form.palette,
          span: form.span,
          sort_order: form.sort_order,
          tags: Array.isArray(form.tags) ? form.tags : [],
          gallery: Array.isArray(form.gallery) ? form.gallery : [],
          gallery_meta: Array.isArray(form.gallery_meta) ? form.gallery_meta : [],
          is_published: form.is_published,
          featured: form.featured ?? false,
          featured_priority: form.featured_priority ?? 0,
          client_name: form.client_name ?? null,
          image_fit: form.image_fit ?? "contain",
          concept: form.concept ?? null,
          idea: form.idea ?? null,
          role: form.role ?? null,
          notes: form.notes ?? null,
          collaborators: Array.isArray(form.collaborators) ? form.collaborators : [],
          tools_used: Array.isArray(form.tools_used) ? form.tools_used : [],
          deliverables: Array.isArray(form.deliverables) ? form.deliverables : [],
          video_url: form.video_url ?? null,
          video_provider: form.video_provider ?? null,
        },
      });
      toast.success("Project draft saved to Release Management");
      qc.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      if (!isUuid(form.id)) throw new Error("Save the project before uploading media.");
      const up = await prepareMediaUpload({
        data: {
          entity_id: form.id,
          kind: "cover",
          filename: file.name,
          content_type: file.type,
          size_bytes: file.size,
        },
      });
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .uploadToSignedUrl(up.path, up.token, file);
      if (upErr) throw upErr;
      set("cover_url", up.publicUrl);
      if (dims) {
        set("cover_width", dims.width);
        set("cover_height", dims.height);
      }
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const uploadGalleryItem = async (file: File) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      if (!isUuid(form.id)) throw new Error("Save the project before uploading media.");
      const up = await prepareMediaUpload({
        data: {
          entity_id: form.id,
          kind: "gallery",
          filename: file.name,
          content_type: file.type,
          size_bytes: file.size,
        },
      });
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .uploadToSignedUrl(up.path, up.token, file);
      if (upErr) throw upErr;
      set("gallery", [...(form.gallery ?? []), up.publicUrl]);
      set("gallery_meta", [
        ...(form.gallery_meta ?? []),
        { url: up.publicUrl, width: dims?.width, height: dims?.height },
      ]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const MAX_VIDEO_MB = 200;
  const VIDEO_MIME = ["video/mp4", "video/webm", "video/ogg"];
  const uploadVideo = async (file: File) => {
    if (!VIDEO_MIME.includes(file.type) && !/\.(mp4|webm|ogg)$/i.test(file.name)) {
      toast.error("Unsupported video format. Use .mp4, .webm or .ogg");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video is too large (max ${MAX_VIDEO_MB}MB)`);
      return;
    }
    setUploading(true);
    try {
      if (!isUuid(form.id)) throw new Error("Save the project before uploading media.");
      const up = await prepareMediaUpload({
        data: {
          entity_id: form.id,
          kind: "video",
          filename: file.name,
          content_type: file.type,
          size_bytes: file.size,
        },
      });
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .uploadToSignedUrl(up.path, up.token, file);
      if (upErr) throw upErr;
      set("video_url", up.publicUrl);
      set("video_provider", "file");
      toast.success("Video uploaded");
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const detectProvider = (url: string): "youtube" | "vimeo" | "file" => {
    if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
    if (/vimeo\.com/i.test(url)) return "vimeo";
    return "file";
  };

  const ratio = aspectFromDims(form.cover_width, form.cover_height) || "16 / 10";
  const isCampaign = isCampaignCategory(form.category);
  const toggleTool = (t: string) => {
    const cur = form.tools_used ?? [];
    set("tools_used", cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <h3 className="display text-xl text-metal">Edit project</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          {/* FORM */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project title">
                <TextInput value={form.title} onChange={(e) => set("title", e.target.value)} />
              </Field>
              <Field label="Client">
                <TextInput
                  value={form.client_name ?? ""}
                  onChange={(e) => set("client_name", e.target.value)}
                />
              </Field>
              <Field label="Category">
                <select
                  className="adm-input"
                  value={normalizeCategory(form.category)}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {PROJECT_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Year">
                <TextInput value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} />
              </Field>
              <Field label="Subtitle / discipline">
                <TextInput
                  value={form.subtitle ?? ""}
                  onChange={(e) => set("subtitle", e.target.value)}
                />
              </Field>
              <Field label="Sort order">
                <TextInput
                  type="number"
                  value={String(form.sort_order)}
                  onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
                />
              </Field>
            </div>

            <Field label="Short description">
              <TextArea
                rows={4}
                value={form.description ?? ""}
                onChange={(e) => set("description", e.target.value)}
              />
            </Field>

            <Field label="Tags (comma separated)">
              <TextInput
                value={(form.tags ?? []).join(", ")}
                onChange={(e) =>
                  set(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Image fit"
                hint="Contain keeps the full image visible. Cover crops to fill."
              >
                <select
                  className="adm-input"
                  value={form.image_fit ?? "contain"}
                  onChange={(e) => set("image_fit", e.target.value)}
                >
                  <option value="contain">Contain (preserve full image)</option>
                  <option value="cover">Cover (fill, may crop)</option>
                </select>
              </Field>
              <Field label="Card size" hint="Layout span on the public grid.">
                <select
                  className="adm-input"
                  value={form.span ?? "normal"}
                  onChange={(e) => set("span", e.target.value)}
                >
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                  <option value="tall">Tall</option>
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => set("is_published", e.target.checked)}
                />{" "}
                Published (live)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={!!form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                />{" "}
                Featured (max 3 on home)
              </label>
              {form.featured && (
                <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                  Priority
                  <input
                    type="number"
                    className="adm-input w-20"
                    value={String(form.featured_priority ?? 0)}
                    onChange={(e) => set("featured_priority", Number(e.target.value) || 0)}
                  />
                </label>
              )}
            </div>

            {/* CASE STUDY (campaign-aware, but available for all) */}
            <div className="mt-2 rounded-lg border border-white/[0.08] bg-[#01040A]/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">CASE STUDY</div>
                {isCampaign && (
                  <span className="mono text-[9px] tracking-[0.2em] text-amber-300/80">
                    CAMPAIGN
                  </span>
                )}
              </div>

              {isCampaign && (
                <>
                  <Field label="Campaign concept" hint="The strategic angle behind the campaign.">
                    <TextArea
                      rows={3}
                      value={form.concept ?? ""}
                      onChange={(e) => set("concept", e.target.value)}
                    />
                  </Field>
                  <Field label="Creative idea" hint="The big creative idea or headline thought.">
                    <TextArea
                      rows={3}
                      value={form.idea ?? ""}
                      onChange={(e) => set("idea", e.target.value)}
                    />
                  </Field>
                </>
              )}

              <Field label="My role">
                <TextInput
                  value={form.role ?? ""}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="e.g. Art Director, lead design"
                />
              </Field>

              <Field label="Collaborators (comma separated)">
                <TextInput
                  value={(form.collaborators ?? []).join(", ")}
                  onChange={(e) =>
                    set(
                      "collaborators",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="e.g. Agency, Photographer, Copywriter"
                />
              </Field>

              <Field label="Tools used" hint="Pick the tools used to produce this work.">
                <div className="flex flex-wrap gap-2">
                  {TOOL_OPTIONS.map((t) => {
                    const active = (form.tools_used ?? []).includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => toggleTool(t)}
                        className={`mono text-[10px] tracking-[0.16em] rounded-full px-3 py-1.5 border transition ${
                          active
                            ? "bg-sky-300/15 border-sky-300/50 text-sky-100"
                            : "border-white/10 text-slate-400 hover:text-white"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </Field>

              <Field label="Deliverables (comma separated)">
                <TextInput
                  value={(form.deliverables ?? []).join(", ")}
                  onChange={(e) =>
                    set(
                      "deliverables",
                      e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean),
                    )
                  }
                  placeholder="e.g. Key visual, Social cutdowns, OOH"
                />
              </Field>

              <Field label="Notes / outcome">
                <TextArea
                  rows={3}
                  value={form.notes ?? ""}
                  onChange={(e) => set("notes", e.target.value)}
                />
              </Field>
            </div>
          </div>

          {/* PREVIEW + UPLOADS */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">
                COVER PREVIEW
              </div>
              <div
                className="bg-[#01040A] border border-white/[0.06] rounded grid place-items-center overflow-hidden"
                style={{ aspectRatio: ratio }}
              >
                {form.cover_url ? (
                  <img
                    src={form.cover_url}
                    alt=""
                    className={`w-full h-full ${form.image_fit === "cover" ? "object-cover" : "object-contain"}`}
                  />
                ) : (
                  <div className="text-slate-600 text-xs">No image yet</div>
                )}
              </div>
              {form.cover_width && form.cover_height && (
                <div className="text-[11px] text-slate-500 mt-1">
                  Real size: {form.cover_width}×{form.cover_height}px
                </div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {form.cover_url ? "Replace cover" : "Upload cover"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])}
                  />
                </label>
                {form.cover_url && (
                  <button
                    onClick={() => {
                      set("cover_url", null);
                      set("cover_width", null);
                      set("cover_height", null);
                    }}
                    className="text-xs text-slate-500 hover:text-red-300"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center justify-between">
                <span>VIDEO {form.video_provider ? `(${form.video_provider})` : ""}</span>
                {form.video_url && <span className="text-emerald-300/80">Ready</span>}
              </div>
              {form.video_url && form.video_provider === "file" ? (
                <video
                  src={form.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full rounded border border-white/[0.06] bg-[#01040A]"
                />
              ) : form.video_url ? (
                <div className="text-[12px] text-slate-400 break-all border border-white/[0.06] rounded p-2 bg-[#01040A]">
                  {form.video_url}
                </div>
              ) : (
                <div className="text-slate-600 text-xs border border-dashed border-white/10 rounded p-3">
                  No video yet
                </div>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40">
                  {uploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {form.video_url ? "Replace video" : "Upload video"}
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0])}
                  />
                </label>
                {form.video_url && (
                  <button
                    onClick={() => {
                      set("video_url", null);
                      set("video_provider", null);
                    }}
                    className="text-xs text-slate-500 hover:text-red-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="mt-2">
                <input
                  type="url"
                  placeholder="...or paste YouTube / Vimeo URL"
                  className="adm-input w-full text-sm"
                  defaultValue={form.video_provider !== "file" ? (form.video_url ?? "") : ""}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!v) return;
                    set("video_url", v);
                    set("video_provider", detectProvider(v));
                  }}
                />
                <div className="text-[11px] text-slate-500 mt-1">
                  Accepts .mp4 / .webm / .ogg (max 200MB) or an external link.
                </div>
              </div>
            </div>

            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">
                GALLERY ({(form.gallery ?? []).length})
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(form.gallery ?? []).map((url, i) => (
                  <div
                    key={url + i}
                    className="relative bg-[#01040A] border border-white/[0.06] rounded overflow-hidden aspect-square"
                  >
                    <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        set(
                          "gallery",
                          form.gallery.filter((_, j) => j !== i),
                        );
                        set(
                          "gallery_meta",
                          (form.gallery_meta ?? []).filter((m) => m.url !== url),
                        );
                      }}
                      className="absolute top-1 right-1 bg-[#01040A]/80 rounded p-1 text-slate-300 hover:text-red-300"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square grid place-items-center border border-dashed border-white/10 rounded text-xs text-slate-500 hover:border-sky-300/50 hover:text-sky-300 cursor-pointer">
                  <Plus size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && uploadGalleryItem(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2">
            Cancel
          </button>
          <SaveButton saving={saving} onClick={save} />
        </div>
      </div>
    </div>
  );
}

// ----- Batch add up to 10 projects -----
type BatchRow = { title: string; client_name: string; category: string; year: string };

function BatchAddProjects({ onClose, startSort }: { onClose: () => void; startSort: number }) {
  const [rows, setRows] = useState<BatchRow[]>(
    Array.from({ length: 10 }).map(() => ({
      title: "",
      client_name: "",
      category: "Digital Design",
      year: String(new Date().getFullYear()),
    })),
  );
  const createBatch = useServerFn(createAdminProjectsBatch);
  const [saving, setSaving] = useState(false);

  const setRow = (i: number, patch: Partial<BatchRow>) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const submit = async () => {
    const valid = rows
      .map((r, i) => ({ ...r, sort_order: startSort + i }))
      .filter((r) => r.title.trim().length > 0);
    if (valid.length === 0) {
      toast.error("Add at least one title.");
      return;
    }
    setSaving(true);
    try {
      await createBatch({
        data: {
          rows: valid.map((r) => ({
            title: r.title,
            client_name: r.client_name,
            category: r.category,
            year: r.year || null,
            sort_order: r.sort_order,
          })),
        },
      });
      toast.success(`Added ${valid.length} project${valid.length > 1 ? "s" : ""} as drafts`);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Batch create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <div>
            <h3 className="display text-xl text-metal">Batch add projects</h3>
            <p className="text-xs text-slate-500 mt-1">
              Up to 10 at once. Created as drafts - open each to add cover, description and tags.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">
            Close
          </button>
        </div>
        <div className="p-5 space-y-2">
          <div className="grid grid-cols-12 gap-2 mono text-[10px] text-slate-500 px-2">
            <div className="col-span-1">#</div>
            <div className="col-span-4">TITLE</div>
            <div className="col-span-3">CLIENT</div>
            <div className="col-span-3">CATEGORY</div>
            <div className="col-span-1">YEAR</div>
          </div>
          {rows.map((r, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2"
            >
              <div className="col-span-1 text-xs text-slate-500 pl-2">{i + 1}</div>
              <input
                className="adm-input col-span-4"
                placeholder="Project title"
                value={r.title}
                onChange={(e) => setRow(i, { title: e.target.value })}
              />
              <input
                className="adm-input col-span-3"
                placeholder="Client name"
                value={r.client_name}
                onChange={(e) => setRow(i, { client_name: e.target.value })}
              />
              <select
                className="adm-input col-span-3"
                value={r.category}
                onChange={(e) => setRow(i, { category: e.target.value })}
              >
                {PROJECT_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                className="adm-input col-span-1"
                placeholder="2026"
                value={r.year}
                onChange={(e) => setRow(i, { year: e.target.value })}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2">
            Cancel
          </button>
          <SaveButton saving={saving} onClick={submit} label="Create projects" />
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block mt-4">
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500">{label}</span>
      {hint && <span className="block text-[11px] text-slate-600 mt-0.5">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`adm-input ${props.className ?? ""}`} />;
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`adm-input ${props.className ?? ""}`} />;
}

function SaveButton({ saving, onClick, label = "Save" }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {label}
    </button>
  );
}
