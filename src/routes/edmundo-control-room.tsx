import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdmin";
import {
  useClients, useProjects, useServices, useStats, useMethod, useSiteSettings,
} from "@/hooks/useSiteData";
import { FALLBACK_SETTINGS, type DbClient, type DbProject } from "@/lib/cms";
import { toast } from "sonner";
import {
  LogOut, Save, Trash2, Plus, Upload, Loader2, Settings, Image as ImageIcon,
  Briefcase, Users, FileText, Eye, EyeOff,
} from "lucide-react";

export const Route = createFileRoute("/edmundo-control-room")({
  component: ControlRoom,
});

type Section = "settings" | "clients" | "projects" | "about" | "raw";

function ControlRoom() {
  const { session, isAdmin, loading } = useAdminAuth();
  const [section, setSection] = useState<Section>("settings");

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-[#01040A] text-slate-400">
      <Loader2 className="animate-spin" />
    </div>;
  }

  if (!session || !isAdmin) return <LoginForm hasSession={!!session} />;

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200 flex">
      <aside className="w-60 border-r border-white/[0.08] bg-[#030814] p-5 flex flex-col">
        <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM</div>
        <div className="display text-xl mt-1">Edmundo</div>
        <nav className="mt-8 space-y-1 flex-1">
          {[
            { id: "settings" as const, label: "Site content", Icon: FileText },
            { id: "clients" as const, label: "Clients", Icon: Users },
            { id: "projects" as const, label: "Portfolio", Icon: Briefcase },
            { id: "about" as const, label: "About data", Icon: Settings },
            { id: "raw" as const, label: "Raw JSON", Icon: ImageIcon },
          ].map((item) => (
            <button key={item.id} onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                section === item.id ? "bg-sky-300/10 text-sky-100 border border-sky-300/20" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}>
              <item.Icon size={14} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="text-[11px] text-slate-500 mb-3 truncate">{session.user.email}</div>
        <button onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <LogOut size={14} /> Sign out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {section === "settings" && <SettingsManager keys={["hero", "manifesto", "clients_section", "services_section", "cta_home", "footer", "navbar", "contact", "social"]} />}
        {section === "clients" && <ClientsManager />}
        {section === "projects" && <ProjectsManager />}
        {section === "about" && <SettingsManager keys={["about"]} />}
        {section === "raw" && <SettingsManager keys={Object.keys(FALLBACK_SETTINGS)} />}
      </main>
    </div>
  );
}

// ============== Login ==============
function LoginForm({ hasSession }: { hasSession: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome.");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[#01040A] px-4">
      <form onSubmit={submit} className="w-full max-w-sm border border-white/[0.08] bg-[#030814] p-8 rounded-lg">
        <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM</div>
        <h1 className="display text-2xl mt-2 text-metal">Sign in</h1>
        {hasSession && <p className="mt-2 text-xs text-amber-400">Signed in but not authorized.</p>}
        <label className="block mt-6">
          <span className="mono text-[10px] tracking-[0.2em] text-slate-500">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-300" />
        </label>
        <label className="block mt-4">
          <span className="mono text-[10px] tracking-[0.2em] text-slate-500">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-300" />
        </label>
        <button type="submit" disabled={busy}
          className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded bg-sky-300 text-[#01040A] px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
          {busy ? <Loader2 size={14} className="animate-spin" /> : null} Enter Control Room
        </button>
      </form>
    </div>
  );
}

// ============== Settings Manager (JSON-per-key) ==============
function SettingsManager({ keys }: { keys: string[] }) {
  const { data: settings } = useSiteSettings();
  const [activeKey, setActiveKey] = useState(keys[0]);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const merged = { ...(FALLBACK_SETTINGS[activeKey] ?? {}), ...(settings?.[activeKey] ?? {}) };
    setDraft(JSON.stringify(merged, null, 2));
  }, [activeKey, settings]);

  const save = async () => {
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(draft); }
    catch { toast.error("Invalid JSON"); return; }
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert(
      { key: activeKey, value: parsed, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(`Saved ${activeKey}`);
  };

  return (
    <div>
      <h2 className="display text-2xl text-metal">Site content</h2>
      <p className="text-sm text-slate-500 mt-1">Edit JSON for each section. Changes persist immediately and sync live.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {keys.map((k) => (
          <button key={k} onClick={() => setActiveKey(k)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              activeKey === k ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"
            }`}>{k}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">EDIT — {activeKey}</div>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)}
            spellCheck={false} rows={28}
            className="w-full bg-[#030814] border border-white/10 rounded p-4 text-[12px] font-mono text-slate-200 focus:outline-none focus:border-sky-300/50" />
          <div className="mt-3 flex items-center gap-3">
            <button onClick={save} disabled={saving}
              className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
            </button>
          </div>
        </div>
        <div>
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">FALLBACK REFERENCE</div>
          <pre className="bg-[#01040A] border border-white/[0.06] rounded p-4 text-[11px] text-slate-500 overflow-auto max-h-[640px]">
{JSON.stringify(FALLBACK_SETTINGS[activeKey] ?? {}, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// ============== Clients Manager ==============
function ClientsManager() {
  const { data: clients = [] } = useClients(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const update = async (id: string, patch: Partial<DbClient>) => {
    setBusyId(id);
    const { error } = await supabase.from("clients").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id);
    setBusyId(null);
    if (error) toast.error(error.message);
  };

  const create = async () => {
    const max = clients.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const { error } = await supabase.from("clients").insert({ name: "New client", sort_order: max + 1, is_active: true });
    if (error) toast.error(error.message); else toast.success("Created");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Deleted");
  };

  const uploadLogo = async (id: string, file: File) => {
    setBusyId(id);
    const path = `clients/${id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (upErr) { setBusyId(null); toast.error(upErr.message); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    await update(id, { logo_url: data.publicUrl });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-2xl text-metal">Clients</h2>
          <p className="text-sm text-slate-500 mt-1">Logos shown on the homepage strip.</p>
        </div>
        <button onClick={create} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold">
          <Plus size={14} /> Add client
        </button>
      </div>

      <div className="mt-6 space-y-2">
        {clients.map((c) => (
          <div key={c.id} className="grid grid-cols-12 gap-3 items-center bg-[#030814] border border-white/[0.08] rounded p-3">
            <div className="col-span-1 grid place-items-center h-12 w-12 bg-[#01040A] border border-white/[0.06] rounded">
              {c.logo_url ? <img src={c.logo_url} alt="" className="max-h-10 max-w-10 object-contain" /> : <ImageIcon size={14} className="text-slate-600" />}
            </div>
            <input className="col-span-3 bg-transparent border border-white/10 rounded px-2 py-1.5 text-sm" defaultValue={c.name}
              onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })} />
            <input className="col-span-3 bg-transparent border border-white/10 rounded px-2 py-1.5 text-sm" placeholder="https://..." defaultValue={c.website_url ?? ""}
              onBlur={(e) => update(c.id, { website_url: e.target.value || null })} />
            <input type="number" className="col-span-1 bg-transparent border border-white/10 rounded px-2 py-1.5 text-sm" defaultValue={c.sort_order}
              onBlur={(e) => update(c.id, { sort_order: Number(e.target.value) || 0 })} />
            <label className="col-span-2 inline-flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
              <Upload size={13} /> Logo
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadLogo(c.id, e.target.files[0])} />
            </label>
            <button onClick={() => update(c.id, { is_active: !c.is_active })} className="col-span-1 text-slate-400 hover:text-white" title={c.is_active ? "Active" : "Inactive"}>
              {c.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-slate-600" />}
            </button>
            <button onClick={() => remove(c.id)} className="col-span-1 text-slate-500 hover:text-red-300 inline-flex items-center justify-end">
              {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============== Projects Manager ==============
function ProjectsManager() {
  const { data: projects = [] } = useProjects(true);
  const [editing, setEditing] = useState<DbProject | null>(null);

  const create = async () => {
    const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { data, error } = await supabase.from("projects").insert({
      title: "New project", category: "Brand Identity", sort_order: max + 1, is_published: false,
    }).select().single();
    if (error) toast.error(error.message); else if (data) setEditing(data as unknown as DbProject);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display text-2xl text-metal">Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1">Curated work shown on /portfolio.</p>
        </div>
        <button onClick={create} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold">
          <Plus size={14} /> New project
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        {projects.map((p) => (
          <div key={p.id} className="bg-[#030814] border border-white/[0.08] rounded overflow-hidden">
            <div className="h-28 relative bg-[#01040A]">
              {p.cover_url
                ? <img src={p.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                : <div className="absolute inset-0 bg-gradient-to-br from-[#06111F] to-[#0B3B73] opacity-50" />
              }
            </div>
            <div className="p-3">
              <div className="flex items-baseline justify-between">
                <div className="font-medium text-sm">{p.title}</div>
                <div className="mono text-[10px] text-slate-500">{p.year}</div>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">{p.category}</div>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <button onClick={() => setEditing(p)} className="text-sky-300 hover:text-sky-200">Edit</button>
                <button onClick={() => remove(p.id)} className="ml-auto text-slate-500 hover:text-red-300">Delete</button>
                <span className={`mono text-[10px] px-2 py-0.5 rounded ${p.is_published ? "bg-sky-300/10 text-sky-200" : "bg-white/5 text-slate-500"}`}>
                  {p.is_published ? "Live" : "Draft"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function ProjectEditor({ project, onClose }: { project: DbProject; onClose: () => void }) {
  const [form, setForm] = useState(project);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof DbProject>(k: K, v: DbProject[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title required"); return; }
    setSaving(true);
    const { error } = await supabase.from("projects").update({
      title: form.title, subtitle: form.subtitle, category: form.category, year: form.year,
      description: form.description, cover_url: form.cover_url, palette: form.palette,
      span: form.span, sort_order: form.sort_order, tags: form.tags, gallery: form.gallery,
      is_published: form.is_published, updated_at: new Date().toISOString(),
    }).eq("id", form.id);
    setSaving(false);
    if (error) toast.error(error.message); else { toast.success("Saved"); onClose(); }
  };

  const uploadCover = async (file: File) => {
    const path = `projects/${form.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
    if (upErr) { toast.error(upErr.message); return; }
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    set("cover_url", data.publicUrl);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl max-h-[90vh] overflow-auto bg-[#030814] border border-white/[0.1] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="display text-xl text-metal">Edit project</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white">Close</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Input label="Title" value={form.title} onChange={(v) => set("title", v)} />
          <Input label="Subtitle" value={form.subtitle ?? ""} onChange={(v) => set("subtitle", v)} />
          <Input label="Category" value={form.category} onChange={(v) => set("category", v)} />
          <Input label="Year" value={form.year ?? ""} onChange={(v) => set("year", v)} />
          <Input label="Span (normal/wide/tall)" value={form.span ?? "normal"} onChange={(v) => set("span", v)} />
          <Input label="Sort order" type="number" value={String(form.sort_order)} onChange={(v) => set("sort_order", Number(v) || 0)} />
          <Input label="Palette (tailwind gradient)" value={form.palette ?? ""} onChange={(v) => set("palette", v)} className="col-span-2" />
          <Input label="Tags (comma separated)" value={(form.tags ?? []).join(", ")} onChange={(v) => set("tags", v.split(",").map(s => s.trim()).filter(Boolean))} className="col-span-2" />
          <label className="col-span-2 block">
            <span className="mono text-[10px] tracking-[0.2em] text-slate-500">Description</span>
            <textarea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)}
              className="mt-2 w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-300/50" />
          </label>
          <div className="col-span-2">
            <span className="mono text-[10px] tracking-[0.2em] text-slate-500">Cover image</span>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-20 w-32 bg-[#01040A] border border-white/[0.06] rounded overflow-hidden grid place-items-center">
                {form.cover_url ? <img src={form.cover_url} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-slate-600" />}
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40">
                <Upload size={14} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
              </label>
              {form.cover_url && <button onClick={() => set("cover_url", null)} className="text-xs text-slate-500 hover:text-red-300">Clear</button>}
            </div>
          </div>
          <label className="col-span-2 inline-flex items-center gap-2 mt-2 text-sm">
            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} />
            Published
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2">Cancel</button>
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", className = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none focus:border-sky-300/50" />
    </label>
  );
}

// suppress unused-import warnings for hooks reserved for future panels
void useServices; void useStats; void useMethod; void useMemo;
