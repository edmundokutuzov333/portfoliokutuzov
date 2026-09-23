import { useEffect, useMemo, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Check, Copy, FileText, Globe2, Image as ImageIcon, LayoutDashboard, Loader2, Plus, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { FALLBACK_NAVIGATION, FALLBACK_SETTINGS, SITE_EMAIL, SITE_PHONE, type NavigationItem } from "@/lib/cms";
import {
  createAdminMediaAsset,
  createAdminMethod,
  createAdminService,
  createAdminStat,
  deleteAdminMediaAsset,
  deleteAdminMethod,
  deleteAdminService,
  deleteAdminStat,
  duplicateAdminService,
  getAdminAuditLog,
  listAdminMediaAssets,
  prepareAdminMediaUpload,
  replaceAdminMediaAsset,
  reorderAdminMethods,
  reorderAdminServices,
  reorderAdminStats,
  saveAdminMethod,
  saveAdminService,
  saveAdminSiteSetting,
  saveAdminStat,
  setAdminProjectFeatured,
} from "@/lib/admin.functions";
import { useClients, useMethod, useProjects, useServices, useSiteSettings, useStats } from "@/hooks/useSiteData";
import { supabase } from "@/integrations/supabase/client";
import { generateUuid } from "@/lib/utils";
import { setAdminDirty } from "@/lib/admin-dirty";
import { readImageDimensions } from "@/lib/image-utils";

function Card(p: { title: string; description?: string; children: ReactNode }) {
  return <section className="mt-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030814]">
    <header className="border-b border-white/[0.06] px-5 py-4">
      <h3 className="display text-lg text-white">{p.title}</h3>
      {p.description ? <p className="mt-1 text-xs text-slate-500">{p.description}</p> : null}
    </header>
    <div className="p-5">{p.children}</div>
  </section>;
}

function FieldLabel(p: { children: ReactNode }) {
  return <span className="mono text-[10px] uppercase tracking-[0.18em] text-slate-500">{p.children}</span>;
}

function Input(p: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={"w-full rounded-lg border border-white/[0.09] bg-black/10 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-300/50 " + (p.className || "")} />;
}

function Textarea(p: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={"w-full resize-y rounded-lg border border-white/[0.09] bg-black/10 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-300/50 " + (p.className || "")} />;
}

function SaveButton(p: { saving: boolean; onClick: () => void; label?: string }) {
  return <button type="button" onClick={p.onClick} disabled={p.saving} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-300 px-4 text-sm font-semibold text-[#01040A] hover:bg-sky-200 disabled:opacity-50">
    {p.saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
    {p.label || "Save changes"}
  </button>;
}

function getValue<T>(draft: Record<string, unknown>, key: string, fallback: T): T {
  return draft[key] === undefined || draft[key] === null ? fallback : (draft[key] as T);
}

function useSettingsDraft(key: string) {
  const saveServer = useServerFn(saveAdminSiteSetting);
  const { data: settings } = useSiteSettings();
  const merged = useMemo(() => ({ ...(FALLBACK_SETTINGS[key] || {}), ...(settings?.[key] || {}) }), [key, settings]);
  const [draft, setDraft] = useState<Record<string, unknown>>(merged);
  const [dirty, setDirty] = useState(false);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setAdminDirty("settings:" + key, dirty);
    return () => setAdminDirty("settings:" + key, false);
  }, [dirty, key]);

  useEffect(() => {
    if (!dirty && !hasSavedDraft) setDraft(merged);
  }, [dirty, hasSavedDraft, merged]);

  const update = (field: string, value: unknown) => {
    setDirty(true);
    setHasSavedDraft(false);
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveServer({ data: { key, value: draft } });
      setDirty(false);
      setHasSavedDraft(true);
      toast.success(key + " draft saved to Release Management");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save draft");
    } finally {
      setSaving(false);
    }
  };

  return { draft, update, save, saving };
}

export function Phase2Overview(p: { onNavigate?: (section: string) => void }) {
  const qc = useQueryClient();
  const { data: projects = [] } = useProjects(true);
  const { data: clients = [] } = useClients(true);
  const { data: services = [] } = useServices(true);
  const { data: audit = [], isLoading } = useQuery({
    queryKey: ["admin", "phase2", "audit-preview"],
    queryFn: async () => (await getAdminAuditLog({ data: { limit: 6 } })).rows || [],
    staleTime: 30000,
  });
  const { data: ops } = useQuery({
    queryKey: ["admin", "phase2", "ops-summary"],
    queryFn: async () => {
      const rows = await Promise.all([
        (supabase as any).from("contact_requests").select("id,status", { count: "exact" }),
        (supabase as any).from("booking_requests").select("id,status", { count: "exact" }),
        (supabase as any).from("newsletter_subscribers").select("id", { count: "exact" }),
        (supabase as any).from("studio_waitlist").select("id", { count: "exact" }),
        (supabase as any).from("briefing_submissions").select("id,invoice_status", { count: "exact" }),
      ]);
      return {
        leads: ((rows[0].data || []) as Array<{ status?: string }>).filter((r) => r.status === "new" || r.status === "unread").length,
        bookings: ((rows[1].data || []) as Array<{ status?: string }>).filter((r) => r.status === "requested" || r.status === "pending").length,
        subscribers: rows[2].count ?? 0,
        waitlist: rows[3].count ?? 0,
        outstandingInvoices: ((rows[4].data || []) as Array<{ invoice_status?: string }>).filter((r) => r.invoice_status && !["none","paid","cancelled"].includes(r.invoice_status)).length,
      };
    },
    staleTime: 30000,
  });
  const tiles: Array<[string, number, string]> = [
    ["Published projects", projects.filter((p) => p.is_published).length, "portfolio"],
    ["Draft projects", projects.filter((p) => !p.is_published).length, "portfolio"],
    ["Active clients", clients.filter((p) => p.is_active).length, "clients"],
    ["Active services", services.filter((p) => p.is_active).length, "services"],
    ["Unread leads", ops?.leads || 0, "inbox"],
    ["Pending bookings", ops?.bookings || 0, "inbox"],
    ["Newsletter", ops?.subscribers || 0, "inbox"],
    ["Studio waitlist", ops?.waitlist || 0, "inbox"],
    ["Outstanding invoices", ops?.outstandingInvoices || 0, "invoice"],
  ];
  return <div>
    <header className="flex items-end justify-between gap-4">
      <div>
        <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM / OVERVIEW</p>
        <h2 className="display mt-1 text-3xl text-white">Operating surface.</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">A single operational view for public content and the active pipeline.</p>
      </div>
      <button type="button" onClick={() => { void qc.invalidateQueries({ queryKey: ["admin", "phase2"] }); }} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.09] px-3 text-xs text-slate-300 hover:text-white"><RefreshCw size={13} /> Refresh</button>
    </header>
    <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.05] lg:grid-cols-4">
      {tiles.map((tile) => <button key={tile[0]} type="button" onClick={() => p.onNavigate?.(tile[2])} className="min-h-28 bg-[#030814] p-5 text-left transition hover:bg-sky-950/10"><div className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{tile[0]}</div><div className="mt-4 display text-3xl text-white">{tile[1]}</div></button>)}
    </div>
    <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
      <Card title="Recent changes" description="Latest immutable administrative events.">
        {isLoading ? <div className="grid min-h-36 place-items-center"><Loader2 size={18} className="animate-spin text-sky-300" /></div> : audit.length === 0 ? <p className="py-10 text-center text-sm text-slate-600">No recent changes.</p> : <div className="divide-y divide-white/[0.06]">{audit.map((row: any) => <div key={row.id} className="py-3"><div className="text-sm text-white">{row.entity_label || row.entity_type}</div><div className="mono mt-1 text-[9px] uppercase tracking-wider text-slate-600">{row.action + " · " + (row.actor_email || "system")}</div></div>)}</div>}
      </Card>
      <Card title="System surface" description="Protected boundaries exposed without secrets.">
        <div className="space-y-2">{[["Database","Supabase / PostgreSQL"],["Realtime","Content channels"],["Storage","Signed uploads"],["Audit","Immutable log"],["Public sync","Query invalidation"]].map((row) => <div key={row[0]} className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3"><div><div className="text-sm text-slate-200">{row[0]}</div><div className="mono mt-1 text-[9px] text-slate-600">{row[1]}</div></div><span className="rounded-full border border-emerald-300/20 px-2 py-1 text-[9px] uppercase text-emerald-300">Protected</span></div>)}</div>
      </Card>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[["New project","portfolio",Plus],["Edit homepage","homepage",LayoutDashboard],["Add service","services",Plus],["Manage media","media",ImageIcon]].map((row) => { const Icon = row[2] as typeof Plus; return <button key={String(row[0])} type="button" onClick={() => p.onNavigate?.(String(row[1]))} className="flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#030814] px-4 text-sm text-slate-300 hover:border-sky-300/30 hover:text-white"><Icon size={14} className="text-sky-300" />{String(row[0])}</button>; })}</div>
  </div>;
}

export function HomepageManager() {
  const hero = useSettingsDraft("hero");
  const manifesto = useSettingsDraft("manifesto");
  const clients = useSettingsDraft("clients_section");
  const featured = useSettingsDraft("featured_section");
  const services = useSettingsDraft("services_section");
  const cta = useSettingsDraft("cta_home");
  const footer = useSettingsDraft("footer");
  const structure = useSettingsDraft("homepage_structure");
  const { data: projects = [] } = useProjects(true);
  const setFeatured = useServerFn(setAdminProjectFeatured);
  const qc = useQueryClient();
  const [featuredDrafts, setFeaturedDrafts] = useState<Record<string, boolean>>({});

  const defaultSections = [
    { id: "hero", label: "Hero", visible: true, order: 1 },
    { id: "manifesto", label: "Manifesto", visible: true, order: 2 },
    { id: "services", label: "Services", visible: true, order: 3 },
    { id: "clients", label: "Clients", visible: true, order: 4 },
    { id: "featured", label: "Featured Work", visible: true, order: 5 },
    { id: "experience", label: "Experience / Numbers", visible: true, order: 6 },
    { id: "cta", label: "CTA", visible: true, order: 7 },
    { id: "footer", label: "Footer (global)", visible: true, order: 8 },
  ];
  const sections = getValue<Array<{ id: string; label: string; visible: boolean; order: number }>>(
    structure.draft,
    "sections",
    defaultSections,
  ).slice().sort((a, b) => a.order - b.order);

  const setSections = (next: Array<{ id: string; label: string; visible: boolean; order: number }>) =>
    structure.update(
      "sections",
      next.map((item, index) => ({ ...item, order: index + 1 })),
    );

  const effectiveFeatured = (project: { id: string; featured?: boolean }) =>
    featuredDrafts[project.id] ?? Boolean(project.featured);
  const selected = projects.filter((p) => effectiveFeatured(p)).length;
  const toggle = async (project: (typeof projects)[number], isFeatured: boolean, priority: number | undefined) => {
    if (isFeatured && selected >= 3 && !effectiveFeatured(project)) {
      toast.error("Featured Work allows a maximum of 3 projects.");
      return;
    }
    try {
      await setFeatured({
        data: {
          id: project.id,
          featured: isFeatured,
          featured_priority: isFeatured ? Math.max(1, priority ?? 0) : 0,
        },
      });
      setFeaturedDrafts((current) => ({ ...current, [project.id]: isFeatured }));
      await qc.invalidateQueries({ queryKey: ["admin", "drafts"] });
      toast.success("Featured Work change staged. Publish it from Release Management.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not stage Featured Work change");
    }
  };

  return (
    <div className="space-y-7">
      <header>
        <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">WEBSITE / HOMEPAGE</p>
        <h2 className="display mt-1 text-3xl text-white">Homepage control.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Control every editable homepage surface, its visibility and order. Content saves are staged as drafts and published through Release Management.
        </p>
      </header>

      <Card title="Homepage structure" description="Reorder and show/hide homepage sections without editing code. Footer copy remains global, while the footer itself stays outside the page flow.">
        <div className="space-y-2">
          {sections.map((item, index) => (
            <div key={item.id} className="grid items-center gap-3 rounded-xl border border-white/[0.07] bg-black/10 p-3 md:grid-cols-[1fr_auto_auto_auto]">
              <div className="min-w-0">
                <div className="text-sm text-white">{item.label}</div>
                <div className="mono mt-1 text-[9px] uppercase tracking-wider text-slate-600">{item.id}</div>
              </div>
              <button
                type="button"
                onClick={() => setSections(sections.map((row) => row.id === item.id ? { ...row, visible: !row.visible } : row))}
                className={"rounded-lg border px-3 py-2 text-[10px] " + (item.visible ? "border-emerald-300/20 text-emerald-300" : "border-white/[0.08] text-slate-600")}
              >
                {item.visible ? "Visible" : "Hidden"}
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label={"Move " + item.label + " up"}
                  disabled={index === 0}
                  onClick={() => {
                    if (index === 0) return;
                    const next = [...sections];
                    [next[index - 1], next[index]] = [next[index], next[index - 1]];
                    setSections(next);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] disabled:opacity-30"
                ><ArrowUp size={13} /></button>
                <button
                  type="button"
                  aria-label={"Move " + item.label + " down"}
                  disabled={index === sections.length - 1}
                  onClick={() => {
                    if (index === sections.length - 1) return;
                    const next = [...sections];
                    [next[index], next[index + 1]] = [next[index + 1], next[index]];
                    setSections(next);
                  }}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] disabled:opacity-30"
                ><ArrowDown size={13} /></button>
              </div>
              <span className="mono text-[9px] text-slate-700">ORDER {item.order}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <SaveButton saving={structure.saving} onClick={structure.save} label="Save structure draft" />
        </div>
      </Card>

      <Card title="Hero" description="Headline, supporting copy, availability, CTAs and disciplines.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["top_left", "Top left badge", ""],
            ["top_right", "Top right badge", ""],
            ["eyebrow", "Eyebrow", ""],
            ["year", "Year", "2026"],
            ["title_1", "Title · line 1", ""],
            ["title_2", "Title · line 2", ""],
            ["title_3", "Title · line 3", ""],
            ["title_accent", "Title · accent", ""],
            ["status", "Availability status", ""],
            ["status_label", "Status label", ""],
            ["location", "Location", ""],
            ["cta_primary", "Primary CTA label", ""],
            ["cta_primary_route", "Primary CTA route", "/portfolio"],
            ["cta_secondary", "Secondary CTA label", ""],
            ["cta_secondary_route", "Secondary CTA route", "/contact"],
          ].map(([key, label, fallback]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input value={getValue(hero.draft, key, fallback)} onChange={(e) => hero.update(key, e.target.value)} />
            </label>
          ))}
          <label className="space-y-2 md:col-span-2">
            <FieldLabel>Subtitle</FieldLabel>
            <Textarea rows={4} value={getValue(hero.draft, "subtitle", "")} onChange={(e) => hero.update("subtitle", e.target.value)} />
          </label>
          <label className="space-y-2 md:col-span-2">
            <FieldLabel>Disciplines · comma separated</FieldLabel>
            <Input
              value={getValue<string[]>(hero.draft, "disciplines", []).join(", ")}
              onChange={(e) => hero.update("disciplines", e.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={hero.restore} className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-500 hover:text-white">Restore defaults</button>
          <SaveButton saving={hero.saving} onClick={hero.save} />
        </div>
      </Card>

      <Card title="Manifesto" description="Philosophy, title treatment, body copy and principles used by the public Manifesto component.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["eyebrow", "Eyebrow"],
            ["sidebar", "Sidebar text"],
            ["title_1", "Title · line 1"],
            ["title_accent", "Title · accent"],
            ["title_2", "Title · line 2"],
            ["title_muted", "Title · muted"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input value={getValue(manifesto.draft, key, "")} onChange={(e) => manifesto.update(key, e.target.value)} />
            </label>
          ))}
          <label className="space-y-2">
            <FieldLabel>Paragraph 1</FieldLabel>
            <Textarea rows={4} value={getValue(manifesto.draft, "col1", "")} onChange={(e) => manifesto.update("col1", e.target.value)} />
          </label>
          <label className="space-y-2">
            <FieldLabel>Paragraph 2</FieldLabel>
            <Textarea rows={4} value={getValue(manifesto.draft, "col2", "")} onChange={(e) => manifesto.update("col2", e.target.value)} />
          </label>
        </div>
        <div className="mt-5 rounded-xl border border-white/[0.06] p-4">
          <div className="flex items-center justify-between">
            <FieldLabel>Principles</FieldLabel>
            <button
              type="button"
              onClick={() => manifesto.update("principles", [...getValue<any[]>(manifesto.draft, "principles", []), { meta: "", key: "", value: "" }])}
              className="inline-flex items-center gap-1 text-xs text-sky-300"
            ><Plus size={12} /> Add principle</button>
          </div>
          <div className="mt-3 space-y-2">
            {getValue<any[]>(manifesto.draft, "principles", []).map((row, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-[0.8fr_1fr_1.6fr_auto]">
                <Input value={String(row.meta ?? "")} placeholder="01 / Strategy" onChange={(e) => manifesto.update("principles", getValue<any[]>(manifesto.draft, "principles", []).map((p, i) => i === index ? { ...p, meta: e.target.value } : p))} />
                <Input value={String(row.key ?? "")} placeholder="Clarity" onChange={(e) => manifesto.update("principles", getValue<any[]>(manifesto.draft, "principles", []).map((p, i) => i === index ? { ...p, key: e.target.value } : p))} />
                <Input value={String(row.value ?? "")} placeholder="Idea before aesthetic." onChange={(e) => manifesto.update("principles", getValue<any[]>(manifesto.draft, "principles", []).map((p, i) => i === index ? { ...p, value: e.target.value } : p))} />
                <button type="button" aria-label={"Delete principle " + (index + 1)} onClick={() => manifesto.update("principles", getValue<any[]>(manifesto.draft, "principles", []).filter((_, i) => i !== index))} className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={manifesto.restore} className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-500 hover:text-white">Restore defaults</button>
          <SaveButton saving={manifesto.saving} onClick={manifesto.save} />
        </div>
      </Card>

      <Card title="Clients section" description="Public heading, supporting copy and maximum visible client logos.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["eyebrow", "Eyebrow"],
            ["title", "Title"],
            ["subtitle", "Subtitle"],
            ["max_items", "Maximum visible clients"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input
                type={key === "max_items" ? "number" : undefined}
                value={getValue(clients.draft, key, key === "max_items" ? 16 : "") as string | number}
                onChange={(e) => clients.update(key, key === "max_items" ? Math.max(1, Math.min(100, Number(e.target.value) || 1)) : e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end"><SaveButton saving={clients.saving} onClick={clients.save} /></div>
      </Card>

      <Card title="Featured Work" description={selected + " / 3 projects selected. Selection is persisted as structured project relationships."}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2"><FieldLabel>Eyebrow</FieldLabel><Input value={getValue(featured.draft, "eyebrow", "Featured work")} onChange={(e) => featured.update("eyebrow", e.target.value)} /></label>
          <label className="space-y-2"><FieldLabel>Title</FieldLabel><Input value={getValue(featured.draft, "title", "Selected projects.")} onChange={(e) => featured.update("title", e.target.value)} /></label>
          <label className="space-y-2 md:col-span-2"><FieldLabel>Subtitle</FieldLabel><Textarea rows={3} value={getValue(featured.draft, "subtitle", "")} onChange={(e) => featured.update("subtitle", e.target.value)} /></label>
        </div>
        <div className="mt-5 flex justify-end"><SaveButton saving={featured.saving} onClick={featured.save} /></div>
        <div className="mt-5 divide-y divide-white/[0.06] rounded-xl border border-white/[0.06]">
          {projects.map((project) => (
            <div key={project.id} className="flex items-center gap-3 p-3">
              {project.cover_url ? <img src={project.cover_url} alt="" className="h-12 w-16 rounded object-cover" /> : <div className="grid h-12 w-16 place-items-center rounded bg-white/[0.03]"><ImageIcon size={14} className="text-slate-600" /></div>}
              <div className="min-w-0 flex-1"><div className="truncate text-sm text-white">{project.title}</div><div className="mono mt-1 text-[9px] uppercase tracking-wider text-slate-600">{project.category}</div></div>
              <button type="button" onClick={() => void toggle(project, !effectiveFeatured(project), project.featured_priority)} className={"inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[10px] uppercase tracking-wider " + (effectiveFeatured(project) ? "border-sky-300/30 bg-sky-300/10 text-sky-200" : "border-white/[0.08] text-slate-500")}>
                <Check size={12} />{effectiveFeatured(project) ? "Staged / Featured" : "Add to draft"}
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Services preview" description="Controls the homepage capabilities block while the full Services page remains managed by the Services workspace.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["eyebrow", "Eyebrow"],
            ["title", "Title"],
            ["sidebar", "Sidebar"],
            ["cta_label", "CTA label"],
            ["cta_route", "CTA route"],
            ["preview_limit", "Number of services shown"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input
                type={key === "preview_limit" ? "number" : undefined}
                value={getValue(services.draft, key, key === "preview_limit" ? 6 : "") as string | number}
                onChange={(e) => services.update(key, key === "preview_limit" ? Math.max(1, Math.min(20, Number(e.target.value) || 1)) : e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end"><SaveButton saving={services.saving} onClick={services.save} /></div>
      </Card>

      <Card title="Home CTA" description="Call-to-action content and destination used by the public homepage.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["eyebrow", "Eyebrow"],
            ["title_1", "Title · line 1"],
            ["title_accent", "Title · accent"],
            ["cta_primary", "CTA label"],
            ["cta_route", "CTA route"],
            ["email", "Contact email"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input type={key === "email" ? "email" : undefined} value={getValue(cta.draft, key, "")} onChange={(e) => cta.update(key, e.target.value)} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end"><SaveButton saving={cta.saving} onClick={cta.save} /></div>
      </Card>

      <Card title="Footer" description="Global footer copy, edited from the Homepage workspace so all homepage-related presentation content stays in one place.">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["eyebrow", "Eyebrow"],
            ["title_1", "Title · line 1"],
            ["title_2", "Title · line 2"],
            ["cta", "CTA label"],
            ["email", "Email"],
            ["phone", "Phone"],
            ["location", "Location"],
            ["copyright", "Copyright"],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <FieldLabel>{label}</FieldLabel>
              <Input type={key === "email" ? "email" : undefined} value={getValue(footer.draft, key, "")} onChange={(e) => footer.update(key, e.target.value)} />
            </label>
          ))}
        </div>
        <div className="mt-5 flex justify-end"><SaveButton saving={footer.saving} onClick={footer.save} /></div>
      </Card>
    </div>
  );
}

export function CredentialsManager() {
  const s = useSettingsDraft("credentials");
  const { data: stats = [] } = useStats(true);
  const { data: methods = [] } = useMethod(true);
  const saveStat = useServerFn(saveAdminStat);
  const createStat = useServerFn(createAdminStat);
  const deleteStat = useServerFn(deleteAdminStat);
  const reorderStat = useServerFn(reorderAdminStats);
  const saveMethod = useServerFn(saveAdminMethod);
  const createMethod = useServerFn(createAdminMethod);
  const deleteMethod = useServerFn(deleteAdminMethod);
  const reorderMethod = useServerFn(reorderAdminMethods);
  const qc = useQueryClient();

  const [statDrafts, setStatDrafts] = useState<Record<string, any>>({});
  const [methodDrafts, setMethodDrafts] = useState<Record<string, any>>({});

  useEffect(() => {
    setStatDrafts((current) => {
      const next = { ...current };
      stats.forEach((row) => { if (!next[row.id]) next[row.id] = { ...row }; });
      return next;
    });
  }, [stats]);

  useEffect(() => {
    setMethodDrafts((current) => {
      const next = { ...current };
      methods.forEach((row) => { if (!next[row.id]) next[row.id] = { ...row }; });
      return next;
    });
  }, [methods]);

  const patchStat = (id: string, key: string, value: unknown) =>
    setStatDrafts((current) => ({ ...current, [id]: { ...(current[id] || {}), [key]: value } }));

  const patchMethod = (id: string, key: string, value: unknown) =>
    setMethodDrafts((current) => ({ ...current, [id]: { ...(current[id] || {}), [key]: value } }));

  const saveRow = async (
    fn: (arg: { data: any }) => Promise<any>,
    data: any,
    message: string,
    invalidate: string[] = [],
  ) => {
    try {
      const result = await fn({ data });
      for (const key of invalidate) await qc.invalidateQueries({ queryKey: [key] });
      toast.success(message);
      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operation failed");
      return null;
    }
  };

  const saveStatDraft = async (row: any) => {
    const result = await saveRow(saveStat, row, "Stat draft saved", ["stats"]);
    if (result?.draft) setStatDrafts((current) => ({ ...current, [row.id]: { ...row } }));
  };

  const saveMethodDraft = async (row: any) => {
    const result = await saveRow(saveMethod, row, "Method draft saved", ["about_method"]);
    if (result?.draft) setMethodDrafts((current) => ({ ...current, [row.id]: { ...row } }));
  };

  const move = async (
    ids: string[],
    index: number,
    direction: -1 | 1,
    fn: (arg: { data: { ids: string[] } }) => Promise<any>,
    message: string,
    invalidate: string,
  ) => {
    const target = index + direction;
    if (target < 0 || target >= ids.length) return;
    const next = [...ids];
    [next[index], next[target]] = [next[target], next[index]];
    await saveRow(fn, { ids: next }, message, [invalidate]);
  };

  const exp = getValue<Array<{ role: string; company: string; period: string }>>(s.draft, "experience", []);
  const skills = getValue<Array<{ name: string; value: number }>>(s.draft, "skills", []);
  const brands = getValue<string[]>(s.draft, "brands", []);

  return <div>
    <header>
      <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">WEBSITE / CREDENTIALS</p>
      <h2 className="display mt-1 text-3xl text-white">Credentials control.</h2>
      <p className="mt-2 text-sm text-slate-500">Experience, skills, brands, metrics and method.</p>
    </header>

    <Card title="Credentials identity">
      <div className="grid gap-4 md:grid-cols-2">{[["eyebrow","Eyebrow"],["top_right","Top right"],["title_1","Title"],["title_accent","Title accent"],["email","Email"],["phone","Phone"],["location","Location"],["reference","Reference"]].map((row)=><label key={row[0]} className="space-y-2"><FieldLabel>{row[1]}</FieldLabel><Input value={getValue(s.draft,row[0],"")} onChange={(e)=>s.update(row[0],e.target.value)} /></label>)}</div>
      <div className="mt-4 grid gap-4">{["bio_p1","bio_p2","bio_p3"].map((key)=><label key={key} className="space-y-2"><FieldLabel>{key.replaceAll("_"," ")}</FieldLabel><Textarea rows={3} value={getValue(s.draft,key,"")} onChange={(e)=>s.update(key,e.target.value)} /></label>)}</div>
      <div className="mt-5 flex justify-end"><SaveButton saving={s.saving} onClick={s.save} /></div>
    </Card>

    <Card title="Experience"><div className="space-y-2">{exp.map((row,index)=><div key={index} className="grid gap-2 md:grid-cols-[.7fr_1.2fr_1fr_auto]"><Input value={row.period} placeholder="Period" onChange={(e)=>{const n=[...exp];n[index]={...row,period:e.target.value};s.update("experience",n);}}/><Input value={row.role} placeholder="Role" onChange={(e)=>{const n=[...exp];n[index]={...row,role:e.target.value};s.update("experience",n);}}/><Input value={row.company} placeholder="Company" onChange={(e)=>{const n=[...exp];n[index]={...row,company:e.target.value};s.update("experience",n);}}/><button type="button" onClick={()=>s.update("experience",exp.filter((_,i)=>i!==index))} className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={14}/></button></div>)}</div><div className="mt-4 flex justify-between"><button type="button" onClick={()=>s.update("experience",[...exp,{period:"",role:"",company:""}])} className="inline-flex items-center gap-2 text-xs text-sky-300"><Plus size={13}/>Add experience</button><SaveButton saving={s.saving} onClick={s.save}/></div></Card>

    <Card title="Skills"><div className="space-y-2">{skills.map((row,index)=><div key={index} className="grid gap-2 md:grid-cols-[1fr_120px_auto]"><Input value={row.name} placeholder="Skill" onChange={(e)=>{const n=[...skills];n[index]={...row,name:e.target.value};s.update("skills",n);}}/><Input type="number" min={0} max={100} value={row.value} onChange={(e)=>{const n=[...skills];n[index]={...row,value:Number(e.target.value)||0};s.update("skills",n);}}/><button type="button" onClick={()=>s.update("skills",skills.filter((_,i)=>i!==index))} className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={14}/></button></div>)}</div><div className="mt-4 flex justify-between"><button type="button" onClick={()=>s.update("skills",[...skills,{name:"",value:50}])} className="inline-flex items-center gap-2 text-xs text-sky-300"><Plus size={13}/>Add skill</button><SaveButton saving={s.saving} onClick={s.save}/></div></Card>

    <Card title="Brands"><Textarea rows={5} value={brands.join(", ")} onChange={(e)=>s.update("brands",e.target.value.split(",").map((x)=>x.trim()).filter(Boolean))}/><div className="mt-4 flex justify-end"><SaveButton saving={s.saving} onClick={s.save}/></div></Card>

    <Card title="Structured Stats" description="Database records used by /credentials.">
      <div className="space-y-2">
        {stats.map((row) => {
          const draft = statDrafts[row.id] || row;
          return <div key={row.id} className="grid gap-2 rounded-xl border border-white/[0.06] p-3 md:grid-cols-[110px_1fr_90px_80px_auto_auto_auto]">
            <Input value={draft.value} onChange={(e)=>patchStat(row.id,"value",e.target.value)} />
            <Input value={draft.label} onChange={(e)=>patchStat(row.id,"label",e.target.value)} />
            <Input type="number" value={draft.sort_order} onChange={(e)=>patchStat(row.id,"sort_order",Number(e.target.value)||0)} />
            <button type="button" onClick={()=>patchStat(row.id,"is_active",!draft.is_active)} className={"rounded-lg border px-2 text-[10px] "+(draft.is_active?"border-emerald-300/20 text-emerald-300":"border-white/[0.08] text-slate-600")}>{draft.is_active?"Active":"Hidden"}</button>
            <button type="button" onClick={()=>void saveStatDraft(draft)} className="rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-300 hover:text-white">Save draft</button>
            <button type="button" onClick={()=>void move(stats.map((r)=>r.id),stats.findIndex((r)=>r.id===row.id),-1,reorderStat,"Order updated","stats")} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowUp size={13}/></button>
            <button type="button" onClick={()=>void move(stats.map((r)=>r.id),stats.findIndex((r)=>r.id===row.id),1,reorderStat,"Order updated","stats")} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowDown size={13}/></button>
            <button type="button" onClick={()=>void saveRow(deleteStat,{id:row.id},"Stat deleted",["stats"])} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={13}/></button>
          </div>;
        })}
      </div>
      <div className="mt-4 flex justify-end"><button type="button" onClick={()=>void saveRow(createStat,{value:"00",label:"NEW METRIC",sort_order:stats.length+1,is_active:false},"Stat created",["stats"])} className="inline-flex items-center gap-2 text-xs text-sky-300"><Plus size={13}/>Add stat</button></div>
    </Card>

    <Card title="Method" description="Database records used by /credentials.">
      <div className="space-y-2">
        {methods.map((row) => {
          const draft = methodDrafts[row.id] || row;
          return <div key={row.id} className="grid gap-2 rounded-xl border border-white/[0.06] p-3 md:grid-cols-[80px_1fr_1.6fr_80px_auto_auto_auto]">
            <Input value={draft.number} onChange={(e)=>patchMethod(row.id,"number",e.target.value)} />
            <Input value={draft.title} onChange={(e)=>patchMethod(row.id,"title",e.target.value)} />
            <Textarea rows={1} value={draft.description||""} onChange={(e)=>patchMethod(row.id,"description",e.target.value)} />
            <button type="button" onClick={()=>patchMethod(row.id,"is_active",!draft.is_active)} className={"rounded-lg border px-2 text-[10px] "+(draft.is_active?"border-emerald-300/20 text-emerald-300":"border-white/[0.08] text-slate-600")}>{draft.is_active?"Active":"Hidden"}</button>
            <button type="button" onClick={()=>void saveMethodDraft(draft)} className="rounded-lg border border-white/[0.08] px-3 text-[10px] text-slate-300 hover:text-white">Save draft</button>
            <button type="button" onClick={()=>void move(methods.map((r)=>r.id),methods.findIndex((r)=>r.id===row.id),-1,reorderMethod,"Order updated","about_method")} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowUp size={13}/></button>
            <button type="button" onClick={()=>void move(methods.map((r)=>r.id),methods.findIndex((r)=>r.id===row.id),1,reorderMethod,"Order updated","about_method")} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowDown size={13}/></button>
            <button type="button" onClick={()=>void saveRow(deleteMethod,{id:row.id},"Method deleted",["about_method"])} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={13}/></button>
          </div>;
        })}
      </div>
      <div className="mt-4 flex justify-end"><button type="button" onClick={()=>void saveRow(createMethod,{number:String(methods.length+1).padStart(2,"0"),title:"New method",description:"",sort_order:methods.length+1,is_active:false},"Method created",["about_method"])} className="inline-flex items-center gap-2 text-xs text-sky-300"><Plus size={13}/>Add method</button></div>
    </Card>
  </div>;
}

export function ServicesManager() {
  const { data: services = [] } = useServices(true);
  const [drafts, setDrafts] = useState<Record<string, any>>({});
  const save = useServerFn(saveAdminService);
  const create = useServerFn(createAdminService);
  const remove = useServerFn(deleteAdminService);
  const duplicate = useServerFn(duplicateAdminService);
  const reorder = useServerFn(reorderAdminServices);
  const qc = useQueryClient();
  useEffect(() => { setDrafts((current) => { const next={...current}; services.forEach((row)=>{if(!next[row.id])next[row.id]={...row};}); return next; }); }, [services]);
  const patch = (id:string,key:string,value:unknown)=>setDrafts((current)=>({...current,[id]:{...(current[id]||{}),[key]:value}}));
  const run = async (fn:(arg:{data:any})=>Promise<any>,data:any,message:string)=>{try{await fn({data});await qc.invalidateQueries({queryKey:["services"]});toast.success(message);}catch(error){toast.error(error instanceof Error?error.message:"Operation failed");}};
  const move = async (index:number,direction:-1|1)=>{const target=index+direction;if(target<0||target>=services.length)return;const ids=services.map((s)=>s.id);const current=ids[index];ids[index]=ids[target];ids[target]=current;await run(reorder,{ids},"Order updated");};
  return <div>
    <header><p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">WEBSITE / SERVICES</p><h2 className="display mt-1 text-3xl text-white">Services manager.</h2><p className="mt-2 text-sm text-slate-500">Structured CRUD. Changes feed /services and the homepage services preview.</p></header>
    <div className="mt-6 flex justify-end"><button type="button" onClick={()=>void run(create,{number:String(services.length+1).padStart(2,"0"),title:"New service",description:"",icon:"Sparkles",sort_order:services.length+1,is_active:false},"Service created")} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-300/30 px-4 text-xs text-sky-300"><Plus size={13}/>Add service</button></div>
    <Card title="Service records">
      <div className="space-y-3">{services.map((row,index)=>{const draft=drafts[row.id]||row;return <article key={row.id} className="rounded-xl border border-white/[0.06] p-4"><div className="grid gap-3 md:grid-cols-[90px_1fr_1.5fr_120px]"><label className="space-y-2"><FieldLabel>Number</FieldLabel><Input value={draft.number||""} onChange={(e)=>patch(row.id,"number",e.target.value)}/></label><label className="space-y-2"><FieldLabel>Title</FieldLabel><Input value={draft.title||""} onChange={(e)=>patch(row.id,"title",e.target.value)}/></label><label className="space-y-2"><FieldLabel>Description</FieldLabel><Textarea rows={2} value={draft.description||""} onChange={(e)=>patch(row.id,"description",e.target.value)}/></label><label className="space-y-2"><FieldLabel>Icon</FieldLabel><Input value={draft.icon||""} onChange={(e)=>patch(row.id,"icon",e.target.value)}/></label></div><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={()=>patch(row.id,"is_active",!draft.is_active)} className={"rounded-full border px-3 py-1.5 text-[10px] uppercase "+(draft.is_active?"border-emerald-300/20 text-emerald-300":"border-white/[0.08] text-slate-500")}>{draft.is_active?"Published":"Hidden"}</button><button type="button" onClick={()=>void run(save,draft,"Service draft saved")} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-slate-300 hover:text-white">Save draft</button><button type="button" onClick={()=>void run(duplicate,{id:row.id},"Service duplicated")} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[10px] text-slate-300 hover:text-white">Duplicate</button><button type="button" onClick={()=>void move(index,-1)} className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08]"><ArrowUp size={12}/></button><button type="button" onClick={()=>void move(index,1)} className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.08]"><ArrowDown size={12}/></button><button type="button" onClick={()=>void run(remove,{id:row.id},"Service deleted")} className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/[0.08] text-slate-500 hover:text-red-300"><Trash2 size={12}/></button></div></article>;})}</div>
    </Card>
  </div>;
}

function normalizeNavigation(raw: unknown): NavigationItem[] {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const items = raw.map((item,index)=>{if(!item||typeof item!=="object")return null;const row=item as Record<string,unknown>;const label=typeof row.label==="string"?row.label.trim():"";const route=typeof row.route==="string"?row.route.trim():"";if(!label||!route)return null;return {id:typeof row.id==="string"&&row.id?row.id:"nav-"+String(index+1),label,route,order:typeof row.order==="number"?row.order:index+1,visible:row.visible!==false,external:row.external===true,cta:row.cta===true} as NavigationItem;}).filter(Boolean) as NavigationItem[];
  return items.length ? items.sort((a,b)=>a.order-b.order) : FALLBACK_NAVIGATION;
}

export function NavigationManager() {
  const s=useSettingsDraft("navigation");
  const items=normalizeNavigation(getValue(s.draft,"items",FALLBACK_NAVIGATION));
  const setItems=(next:NavigationItem[])=>s.update("items",next.map((row,index)=>({...row,order:index+1})));
  return <div>
    <header><p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">WEBSITE / NAVIGATION</p><h2 className="display mt-1 text-3xl text-white">Navigation manager.</h2><p className="mt-2 text-sm text-slate-500">Labels, routes, order, visibility, external/internal and CTA intent.</p></header>
    <Card title="Navigation structure">
      <div className="space-y-2">{items.map((item,index)=><div key={item.id} className="grid gap-2 rounded-xl border border-white/[0.06] p-3 lg:grid-cols-[1fr_1.4fr_90px_90px_90px_auto_auto]"><Input value={item.label} onChange={(e)=>{const n=[...items];n[index]={...item,label:e.target.value};setItems(n);}}/><Input value={item.route} onChange={(e)=>{const n=[...items];n[index]={...item,route:e.target.value};setItems(n);}}/><button type="button" onClick={()=>{const n=[...items];n[index]={...item,external:!item.external};setItems(n);}} className={"rounded-lg border text-[10px] "+(item.external?"border-sky-300/20 text-sky-300":"border-white/[0.08] text-slate-500")}>{item.external?"External":"Internal"}</button><button type="button" onClick={()=>{const n=[...items];n[index]={...item,visible:!item.visible};setItems(n);}} className={"rounded-lg border text-[10px] "+(item.visible?"border-emerald-300/20 text-emerald-300":"border-white/[0.08] text-slate-600")}>{item.visible?"Visible":"Hidden"}</button><button type="button" onClick={()=>{const n=[...items];n[index]={...item,cta:!item.cta};setItems(n);}} className={"rounded-lg border text-[10px] "+(item.cta?"border-sky-300/20 text-sky-300":"border-white/[0.08] text-slate-500")}>{item.cta?"CTA":"Standard"}</button><button type="button" onClick={()=>setItems(items.filter((_,i)=>i!==index))} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07] text-slate-500 hover:text-red-300"><Trash2 size={13}/></button><div className="flex gap-1"><button type="button" onClick={()=>{if(index===0)return;const n=[...items];const cur=n[index];n[index]=n[index-1];n[index-1]=cur;setItems(n);}} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowUp size={13}/></button><button type="button" onClick={()=>{if(index===items.length-1)return;const n=[...items];const cur=n[index];n[index]=n[index+1];n[index+1]=cur;setItems(n);}} className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.07]"><ArrowDown size={13}/></button></div></div>)}</div>
      <div className="mt-4 flex justify-between"><button type="button" onClick={()=>setItems([...items,{id:generateUuid(),label:"New item",route:"/",order:items.length+1,visible:true,external:false,cta:false}])} className="inline-flex items-center gap-2 text-xs text-sky-300"><Plus size={13}/>Add item</button><SaveButton saving={s.saving} onClick={s.save}/></div>
    </Card>
    <Card title="Preview"><div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/[0.06] p-4">{items.filter((i)=>i.visible&&!i.cta).map((item)=><span key={item.id} className="rounded-full border border-white/[0.08] px-3 py-2 text-xs text-slate-300">{item.label}</span>)}{items.find((i)=>i.visible&&i.cta)?<span className="ml-auto rounded-full bg-sky-300 px-3 py-2 text-xs font-semibold text-[#01040A]">{items.find((i)=>i.visible&&i.cta)?.label}</span>:null}</div></Card>
  </div>;
}

export function GlobalSettingsManager() {
  const s=useSettingsDraft("global");
  const social=useSettingsDraft("social");
  const fields=[["site_name","Site name","Edmundo Kutuzov"],["email","Email",SITE_EMAIL],["phone","Phone",SITE_PHONE],["location","Location",'Magoanine "C", Maputo · Mozambique'],["copyright","Copyright","Edmundo Kutuzov. All rights reserved. The only one."],["favicon_url","Favicon URL","/favicon.webp"]];
  return <div>
    <header><p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">WEBSITE / GLOBAL</p><h2 className="display mt-1 text-3xl text-white">Global settings.</h2><p className="mt-2 text-sm text-slate-500">Public identity, contact coordinates and behaviour controls. Secret infrastructure stays out.</p></header>
    <Card title="Identity & contact"><div className="grid gap-4 md:grid-cols-2">{fields.map((row)=><label key={row[0]} className="space-y-2"><FieldLabel>{row[1]}</FieldLabel><Input value={getValue(s.draft,row[0],row[2])} onChange={(e)=>s.update(row[0],e.target.value)}/></label>)}</div><div className="mt-5 grid gap-2 md:grid-cols-3">{[["studio_visible","Studio public visibility"],["newsletter_enabled","Newsletter enabled"],["analytics_enabled","Analytics enabled"]].map((row)=>{const on=Boolean(getValue(s.draft,row[0],true));return <button key={row[0]} type="button" onClick={()=>s.update(row[0],!on)} className={"flex items-center justify-between rounded-lg border px-3 py-3 text-xs "+(on?"border-emerald-300/20 text-emerald-300":"border-white/[0.08] text-slate-600")}><span>{row[1]}</span><span>{on?"ON":"OFF"}</span></button>;})}</div><div className="mt-5 flex justify-end"><SaveButton saving={s.saving} onClick={s.save}/></div></Card>
    <Card title="Social links"><div className="grid gap-4 md:grid-cols-3">{["instagram","linkedin","facebook"].map((key)=><label key={key} className="space-y-2"><FieldLabel>{key}</FieldLabel><Input value={getValue(social.draft,key,"")} onChange={(e)=>social.update(key,e.target.value)}/></label>)}</div><div className="mt-5 flex justify-end"><SaveButton saving={social.saving} onClick={social.save}/></div></Card>
  </div>;
}

export function SeoManager() {
  const global=useSettingsDraft("seo_global");
  const pages=useSettingsDraft("seo_pages");
  const map=getValue<Record<string,Record<string,string>>>(pages.draft,"pages",{});
  const routes=["/","/portfolio","/services","/credentials","/contact"];
  const updatePage=(path:string,key:string,value:string)=>pages.update("pages",{...map,[path]:{...(map[path]||{}),[key]:value}});
  return <div>
    <header><p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">SYSTEM / SEO</p><h2 className="display mt-1 text-3xl text-white">SEO manager.</h2><p className="mt-2 text-sm text-slate-500">Global metadata, page metadata, canonical, Open Graph, Twitter, sitemap flag and robots meta.</p></header>
    <Card title="Global metadata"><div className="grid gap-4 md:grid-cols-2">{[["title","SEO title"],["description","Meta description"],["og_title","Open Graph title"],["og_description","Open Graph description"],["og_image","Open Graph image"],["canonical_base","Canonical base"],["robots_meta","Robots meta"],["twitter_card","Twitter card"]].map((row)=><label key={row[0]} className="space-y-2"><FieldLabel>{row[1]}</FieldLabel>{row[0].includes("description")?<Textarea rows={3} value={getValue(global.draft,row[0],"")} onChange={(e)=>global.update(row[0],e.target.value)}/>:<Input value={getValue(global.draft,row[0],"")} onChange={(e)=>global.update(row[0],e.target.value)}/>}</label>)}</div><div className="mt-5 flex justify-end"><SaveButton saving={global.saving} onClick={global.save}/></div></Card>
    <Card title="Per-page metadata"><div className="space-y-3">{routes.map((path)=>{const row=map[path]||{};return <div key={path} className="rounded-xl border border-white/[0.06] p-4"><div className="mono text-[9px] uppercase tracking-[0.18em] text-sky-300/80">{path}</div><div className="mt-3 grid gap-3 md:grid-cols-2"><Input value={row.title||""} placeholder="Page title" onChange={(e)=>updatePage(path,"title",e.target.value)}/><Input value={row.canonical||path} placeholder="Canonical" onChange={(e)=>updatePage(path,"canonical",e.target.value)}/><Textarea className="md:col-span-2" rows={2} value={row.description||""} placeholder="Meta description" onChange={(e)=>updatePage(path,"description",e.target.value)}/><Input value={row.og_image||""} placeholder="OG image URL" onChange={(e)=>updatePage(path,"og_image",e.target.value)}/></div></div>;})}</div><div className="mt-5 flex justify-end"><SaveButton saving={pages.saving} onClick={pages.save}/></div></Card>
  </div>;
}

type MediaAsset = { id:string; storage_path:string; public_url:string; filename:string; mime_type:string; width:number|null; height:number|null; size_bytes:number; kind:"image"|"video"|"logo"|"document"; alt_text:string|null; entity_type:string|null; entity_id:string|null; is_public:boolean; created_at:string; };

export function MediaLibrary() {
  const qc=useQueryClient();
  const list=useServerFn(listAdminMediaAssets);
  const prepare=useServerFn(prepareAdminMediaUpload);
  const create=useServerFn(createAdminMediaAsset);
  const remove=useServerFn(deleteAdminMediaAsset);
  const replace=useServerFn(replaceAdminMediaAsset);
  const [query,setQuery]=useState("");
  const [kind,setKind]=useState<MediaAsset["kind"]|"all">("all");
  const [busy,setBusy]=useState(false);
  const {data:assets=[],isFetching}=useQuery({queryKey:["admin","media-library",query,kind],queryFn:async()=>{const result=await list({data:{search:query||undefined,kind}});return result.rows||[];},staleTime:10000});
  const upload=async(file:File)=>{setBusy(true);try{const allowed=["image/png","image/jpeg","image/webp","image/svg+xml","video/mp4","video/webm","video/ogg","application/pdf"];if(!allowed.includes(file.type))throw new Error("Unsupported media type");const id=generateUuid();let width:number|null=null;let height:number|null=null;if(file.type.startsWith("image/")){const dims=await readImageDimensions(file);width=dims.width;height=dims.height;}const detected=file.type==="application/pdf"?"document":file.type.startsWith("video/")?"video":kind==="logo"?"logo":"image";const signed=await prepare({data:{entity_id:id,kind:"library",filename:file.name,content_type:file.type,size_bytes:file.size}});const put=await supabase.storage.from("site-assets").uploadToSignedUrl(signed.path,signed.token,file);if(put.error)throw new Error(put.error.message);await create({data:{id,storage_path:signed.path,public_url:signed.publicUrl,filename:file.name,mime_type:file.type,width,height,size_bytes:file.size,kind:detected as "image"|"video"|"logo"|"document",alt_text:null,entity_type:null,entity_id:null,is_public:true}});await qc.invalidateQueries({queryKey:["admin","media-library"]});toast.success("Asset added");}catch(error){toast.error(error instanceof Error?error.message:"Upload failed");}finally{setBusy(false);}};
  const del=async(id:string)=>{if(!window.confirm("Delete this asset and its stored file?"))return;try{await remove({data:{id}});await qc.invalidateQueries({queryKey:["admin","media-library"]});toast.success("Asset deleted");}catch(error){toast.error(error instanceof Error?error.message:"Delete failed");}};
  const replaceAsset=async(asset:MediaAsset,file:File)=>{
    try{
      const allowed=asset.kind==="document"?["application/pdf"]:asset.kind==="video"?["video/mp4","video/webm","video/ogg"]:["image/png","image/jpeg","image/webp","image/svg+xml"];
      if(!allowed.includes(file.type)) throw new Error("Replacement format does not match the asset type.");
      let width:number|null=null; let height:number|null=null;
      if(file.type.startsWith("image/")){const dims=await readImageDimensions(file);width=dims.width;height=dims.height;}
      const signed=await prepare({data:{entity_id:asset.id,kind:"library",filename:file.name,content_type:file.type,size_bytes:file.size}});
      const put=await supabase.storage.from("site-assets").uploadToSignedUrl(signed.path,signed.token,file);
      if(put.error) throw new Error(put.error.message);
      await replace({data:{id:asset.id,storage_path:signed.path,public_url:signed.publicUrl,filename:file.name,mime_type:file.type,width,height,size_bytes:file.size}});
      await qc.invalidateQueries({queryKey:["admin","media-library"]});
      toast.success("Asset replaced");
    }catch(error){toast.error(error instanceof Error?error.message:"Replacement failed");}
  };
  return <div>
    <header className="flex items-end justify-between gap-4"><div><p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTENT / MEDIA</p><h2 className="display mt-1 text-3xl text-white">Media library.</h2><p className="mt-2 text-sm text-slate-500">Persistent asset registry with physical file metadata and lifecycle state.</p></div><label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-sky-300 px-4 text-xs font-semibold text-[#01040A]">{busy?<Loader2 size={14} className="animate-spin"/>:<Upload size={14}/>}Add asset<input type="file" className="sr-only" disabled={busy} accept="image/png,image/jpeg,image/webp,image/svg+xml,video/mp4,video/webm,video/ogg,application/pdf" onChange={(e)=>{const f=e.target.files?.[0];if(f)void upload(f);e.currentTarget.value="";}}/></label></header>
    <Card title="Library" description="Images, videos, logos and documents. Unassigned records are visible as unused."><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search size={14} className="absolute left-3 top-3 text-slate-600"/><Input className="pl-9" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search filename"/></div><select value={kind} onChange={(e)=>setKind(e.target.value as MediaAsset["kind"]|"all")} className="rounded-lg border border-white/[0.09] bg-[#030814] px-3 text-sm text-slate-300"><option value="all">All types</option><option value="image">Images</option><option value="video">Videos</option><option value="logo">Logos</option><option value="document">Documents</option></select></div>{isFetching&&assets.length===0?<div className="grid min-h-40 place-items-center"><Loader2 size={18} className="animate-spin text-sky-300"/></div>:assets.length===0?<div className="mt-4 grid min-h-40 place-items-center rounded-xl border border-dashed border-white/[0.08] text-sm text-slate-600">No assets match this view.</div>:<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{(assets as unknown as MediaAsset[]).map((asset)=><article key={asset.id} className="overflow-hidden rounded-xl border border-white/[0.06] bg-[#01040A]"><div className="aspect-video overflow-hidden border-b border-white/[0.06] bg-white/[0.02]">{asset.mime_type.startsWith("image/")?<img src={asset.public_url} alt={asset.alt_text||asset.filename} className="h-full w-full object-cover" loading="lazy"/>:asset.mime_type.startsWith("video/")?<video src={asset.public_url} className="h-full w-full object-cover" muted playsInline preload="metadata"/>:<div className="grid h-full place-items-center"><FileText size={28} className="text-slate-600"/></div>}</div><div className="p-3"><div className="truncate text-sm text-white" title={asset.filename}>{asset.filename}</div><div className="mono mt-1 text-[9px] uppercase tracking-wider text-slate-600">{asset.kind+" · "+Math.max(1,Math.round(asset.size_bytes/1024))+" KB"+(asset.width&&asset.height?" · "+asset.width+"×"+asset.height:"")}</div><div className="mt-2 text-[11px] text-slate-500">{asset.entity_id?String(asset.entity_type||"entity")+":"+asset.entity_id:"Unused / library asset"}</div><div className="mt-3 flex gap-2"><button type="button" onClick={()=>navigator.clipboard.writeText(asset.public_url).then(()=>toast.success("Asset URL copied")).catch(()=>toast.error("Clipboard unavailable"))} className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-slate-300"><Copy size={11}/>Copy URL</button><label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-slate-300">Replace<input type="file" className="sr-only" accept={asset.kind==="document"?"application/pdf":asset.kind==="video"?"video/*":"image/*"} onChange={(e)=>{const f=e.target.files?.[0];if(f)void replaceAsset(asset,f);e.currentTarget.value="";}}/></label><a href={asset.public_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-slate-300"><Globe2 size={11}/>Open</a>{asset.entity_id || asset.entity_type ? (
  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-amber-300/15 bg-amber-300/[0.03] px-3 py-1.5 text-[10px] text-amber-200" title="Linked assets must be replaced, not deleted.">
    In use
  </span>
) : (
  <button type="button" onClick={()=>void del(asset.id)} className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] px-3 py-1.5 text-[10px] text-slate-500 hover:text-red-300"><Trash2 size={11}/>Delete</button>
)}</div></div></article>)}</div>}</Card>
  </div>;
}
