import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdmin";
import { useClients, useProjects, useSiteSettings } from "@/hooks/useSiteData";
import { FALLBACK_SETTINGS, PROJECT_CATEGORIES, TOOL_OPTIONS, isCampaignCategory, normalizeCategory, type DbClient, type DbProject } from "@/lib/cms";
import { readImageDimensions, aspectFromDims } from "@/lib/image-utils";
import { snapshotBefore } from "@/lib/history";
import { RequestsInbox } from "@/components/admin/RequestsInbox";
import { HistoryManager } from "@/components/admin/HistoryManager";
import { toast } from "sonner";
import {
  LogOut, Save, Trash2, Plus, Upload, Loader2, Image as ImageIcon,
  Briefcase, Users, FileText, Eye, EyeOff, Copy, Star, ChevronDown, ChevronRight,
  Home, User as UserIcon, Mail, Code2, Inbox, History, ArrowUp, ArrowDown,
} from "lucide-react";

export const Route = createFileRoute("/edmundo-control-room")({
  component: ControlRoom,
});

type Section = "site" | "clients" | "portfolio" | "about" | "contact" | "inbox" | "history" | "advanced";

function ControlRoom() {
  const { session, isAdmin, loading } = useAdminAuth();
  const [section, setSection] = useState<Section>("site");

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#01040A] text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!session || !isAdmin) return <LoginForm hasSession={!!session} />;

  const items = [
    { id: "site" as const, label: "Site Content", Icon: Home },
    { id: "clients" as const, label: "Clients", Icon: Users },
    { id: "portfolio" as const, label: "Portfolio", Icon: Briefcase },
    { id: "about" as const, label: "About", Icon: UserIcon },
    { id: "contact" as const, label: "Contact", Icon: Mail },
    { id: "inbox" as const, label: "Inbox", Icon: Inbox },
    { id: "history" as const, label: "History", Icon: History },
    { id: "advanced" as const, label: "Advanced", Icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200 flex">
      <aside className="w-60 shrink-0 border-r border-white/[0.08] bg-[#030814] p-5 flex flex-col">
        <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM</div>
        <div className="display text-xl mt-1">Edmundo</div>
        <nav className="mt-8 space-y-1 flex-1">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
                section === item.id
                  ? "bg-sky-300/10 text-sky-100 border border-sky-300/20"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <item.Icon size={14} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="text-[11px] text-slate-500 mb-3 truncate">{session.user.email}</div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
        >
          <LogOut size={14} /> Sign out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-auto">
        {section === "site" && <SiteContentManager />}
        {section === "clients" && <ClientsManager />}
        {section === "portfolio" && <PortfolioManager />}
        {section === "about" && <AboutManager />}
        {section === "contact" && <ContactManager />}
        {section === "inbox" && <RequestsInbox />}
        {section === "history" && <HistoryManager />}
        {section === "advanced" && <AdvancedJSONManager />}
      </main>
    </div>
  );
}

// ============================================================================
// LOGIN
// ============================================================================
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
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-white/[0.08] bg-[#030814] p-8 rounded-lg"
      >
        <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM</div>
        <h1 className="display text-2xl mt-2 text-metal">Sign in</h1>
        {hasSession && <p className="mt-2 text-xs text-amber-400">Signed in but not authorized.</p>}
        <Field label="Email">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="adm-input"
          />
        </Field>
        <Field label="Password">
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="adm-input"
          />
        </Field>
        <button
          type="submit" disabled={busy}
          className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded bg-sky-300 text-[#01040A] px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : null} Enter Control Room
        </button>
      </form>
    </div>
  );
}

// ============================================================================
// SHARED PRIMITIVES
// ============================================================================
function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4">
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500">{label}</span>
      {hint && <span className="block text-[11px] text-slate-600 mt-0.5">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`adm-input ${props.className ?? ""}`} />;
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`adm-input ${props.className ?? ""}`} />;
}

function SectionCard({
  title, description, children, footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className="bg-[#030814] border border-white/[0.08] rounded-lg p-6 mt-6">
      <header className="mb-4">
        <h3 className="display text-lg text-metal">{title}</h3>
        {description && <p className="text-[12px] text-slate-500 mt-1">{description}</p>}
      </header>
      <div className="space-y-1">{children}</div>
      {footer && <div className="mt-5 flex items-center justify-end gap-2">{footer}</div>}
    </section>
  );
}

function SaveButton({ saving, onClick, label = "Save" }: { saving: boolean; onClick: () => void; label?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
    >
      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {label}
    </button>
  );
}

// Local style helper: registers a single utility for inputs.
const STYLE_TAG_ID = "adm-input-style";
if (typeof document !== "undefined" && !document.getElementById(STYLE_TAG_ID)) {
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .adm-input {
      width: 100%;
      background: transparent;
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 6px;
      padding: 0.5rem 0.75rem;
      font-size: 13px;
      color: #e2e8f0;
      transition: border-color .15s;
    }
    .adm-input:focus { outline: none; border-color: rgba(125,211,252,0.55); }
  `;
  document.head.appendChild(style);
}

// ============================================================================
// SETTINGS HELPERS - read merged value (DB over fallback) and save per-key
// ============================================================================
function useSectionDraft(key: string) {
  const { data: settings } = useSiteSettings();
  const merged = useMemo(
    () => ({ ...(FALLBACK_SETTINGS[key] ?? {}), ...(settings?.[key] ?? {}) }),
    [settings, key]
  );
  const [draft, setDraft] = useState<Record<string, unknown>>(merged);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Resync only when DB changes & not editing locally.
  useEffect(() => {
    if (!dirty) setDraft(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(merged)]);

  const update = <T,>(field: string, value: T) => {
    setDirty(true);
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    await snapshotBefore("site_settings", key, key);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        [{ key, value: draft as never, updated_at: new Date().toISOString() }],
        { onConflict: "key" }
      );
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved ${key}`);
      setDirty(false);
    }
  };

  const restore = () => {
    setDraft(FALLBACK_SETTINGS[key] ?? {});
    setDirty(true);
  };

  return { draft, update, save, saving, dirty, restore };
}

function get<T>(d: Record<string, unknown>, k: string, fb: T): T {
  const v = d[k];
  return (v === undefined || v === null ? fb : (v as T));
}

// ============================================================================
// SITE CONTENT (Home: hero, manifesto, clients_section, services_section, cta_home, footer, navbar)
// ============================================================================
function SiteContentManager() {
  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal">Site content</h2>
        <p className="text-sm text-slate-500 mt-1">Edit the homepage and shared layout sections. Changes go live immediately.</p>
      </header>

      <HeroEditor />
      <ManifestoEditor />
      <SectionLabelEditor sectionKey="clients_section" title="Clients section" fields={["eyebrow", "title", "subtitle"]} multiline={["title", "subtitle"]} />
      <SectionLabelEditor sectionKey="services_section" title="Services section" fields={["eyebrow", "title", "sidebar"]} multiline={["title"]} />
      <CtaHomeEditor />
      <NavbarEditor />
      <FooterEditor />
      <SocialEditor />
    </div>
  );
}

function HeroEditor() {
  const s = useSectionDraft("hero");
  return (
    <SectionCard
      title="Hero"
      description="Top of the homepage. Headline, subtitle, CTAs and status panel."
      footer={
        <>
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Top left badge"><TextInput value={get(s.draft, "top_left", "")} onChange={(e) => s.update("top_left", e.target.value)} /></Field>
        <Field label="Top right badge"><TextInput value={get(s.draft, "top_right", "")} onChange={(e) => s.update("top_right", e.target.value)} /></Field>
        <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
        <Field label="Year"><TextInput value={get(s.draft, "year", "")} onChange={(e) => s.update("year", e.target.value)} /></Field>
        <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
        <Field label="Title - line 2"><TextInput value={get(s.draft, "title_2", "")} onChange={(e) => s.update("title_2", e.target.value)} /></Field>
        <Field label="Title - accent (italic)"><TextInput value={get(s.draft, "title_accent", "")} onChange={(e) => s.update("title_accent", e.target.value)} /></Field>
        <Field label="Status">
          <TextInput value={get(s.draft, "status", "")} onChange={(e) => s.update("status", e.target.value)} />
        </Field>
        <Field label="Subtitle" hint="Short paragraph below the headline.">
          <TextArea rows={4} value={get(s.draft, "subtitle", "")} onChange={(e) => s.update("subtitle", e.target.value)} />
        </Field>
        <Field label="CTA primary"><TextInput value={get(s.draft, "cta_primary", "")} onChange={(e) => s.update("cta_primary", e.target.value)} /></Field>
        <Field label="CTA secondary"><TextInput value={get(s.draft, "cta_secondary", "")} onChange={(e) => s.update("cta_secondary", e.target.value)} /></Field>
        <Field label="Status label"><TextInput value={get(s.draft, "status_label", "")} onChange={(e) => s.update("status_label", e.target.value)} /></Field>
        <Field label="Location"><TextInput value={get(s.draft, "location", "")} onChange={(e) => s.update("location", e.target.value)} /></Field>
        <Field label="Disciplines (comma separated)" hint="Shown in the right side panel.">
          <TextInput
            value={(get<string[]>(s.draft, "disciplines", [])).join(", ")}
            onChange={(e) => s.update("disciplines", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

type Principle = { meta: string; key: string; value: string };

function ManifestoEditor() {
  const s = useSectionDraft("manifesto");
  const principles = get<Principle[]>(s.draft, "principles", []);
  const setPrinciples = (next: Principle[]) => s.update("principles", next);
  return (
    <SectionCard
      title="Manifesto"
      description="The philosophical block on the homepage."
      footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
        <Field label="Sidebar text"><TextInput value={get(s.draft, "sidebar", "")} onChange={(e) => s.update("sidebar", e.target.value)} /></Field>
        <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
        <Field label="Title - accent"><TextInput value={get(s.draft, "title_accent", "")} onChange={(e) => s.update("title_accent", e.target.value)} /></Field>
        <Field label="Title - line 2"><TextInput value={get(s.draft, "title_2", "")} onChange={(e) => s.update("title_2", e.target.value)} /></Field>
        <Field label="Title - muted"><TextInput value={get(s.draft, "title_muted", "")} onChange={(e) => s.update("title_muted", e.target.value)} /></Field>
        <Field label="Paragraph 1"><TextArea rows={4} value={get(s.draft, "col1", "")} onChange={(e) => s.update("col1", e.target.value)} /></Field>
        <Field label="Paragraph 2"><TextArea rows={4} value={get(s.draft, "col2", "")} onChange={(e) => s.update("col2", e.target.value)} /></Field>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="mono text-[10px] tracking-[0.2em] text-slate-500">PRINCIPLES</div>
          <button
            onClick={() => setPrinciples([...principles, { meta: "", key: "", value: "" }])}
            className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
          >
            <Plus size={12} /> Add principle
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {principles.map((p, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2">
              <input className="adm-input col-span-3" placeholder="Meta (e.g. 01 / Strategy)" value={p.meta} onChange={(e) => { const n = [...principles]; n[i] = { ...p, meta: e.target.value }; setPrinciples(n); }} />
              <input className="adm-input col-span-3" placeholder="Key" value={p.key} onChange={(e) => { const n = [...principles]; n[i] = { ...p, key: e.target.value }; setPrinciples(n); }} />
              <input className="adm-input col-span-5" placeholder="Value" value={p.value} onChange={(e) => { const n = [...principles]; n[i] = { ...p, value: e.target.value }; setPrinciples(n); }} />
              <button onClick={() => setPrinciples(principles.filter((_, j) => j !== i))} className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function SectionLabelEditor({
  sectionKey, title, fields, multiline = [],
}: { sectionKey: string; title: string; fields: string[]; multiline?: string[] }) {
  const s = useSectionDraft(sectionKey);
  return (
    <SectionCard
      title={title}
      footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <Field key={f} label={f.replace(/_/g, " ")}>
            {multiline.includes(f)
              ? <TextArea rows={3} value={get(s.draft, f, "")} onChange={(e) => s.update(f, e.target.value)} />
              : <TextInput value={get(s.draft, f, "")} onChange={(e) => s.update(f, e.target.value)} />}
          </Field>
        ))}
      </div>
    </SectionCard>
  );
}

function CtaHomeEditor() {
  const s = useSectionDraft("cta_home");
  return (
    <SectionCard
      title="Home CTA block"
      footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
        <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
        <Field label="Title - accent"><TextInput value={get(s.draft, "title_accent", "")} onChange={(e) => s.update("title_accent", e.target.value)} /></Field>
        <Field label="Primary CTA"><TextInput value={get(s.draft, "cta_primary", "")} onChange={(e) => s.update("cta_primary", e.target.value)} /></Field>
        <Field label="Email"><TextInput type="email" value={get(s.draft, "email", "")} onChange={(e) => s.update("email", e.target.value)} /></Field>
      </div>
    </SectionCard>
  );
}

function NavbarEditor() {
  const s = useSectionDraft("navbar");
  return (
    <SectionCard title="Navbar" footer={<SaveButton saving={s.saving} onClick={s.save} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Brand"><TextInput value={get(s.draft, "brand", "")} onChange={(e) => s.update("brand", e.target.value)} /></Field>
        <Field label="CTA label"><TextInput value={get(s.draft, "cta", "")} onChange={(e) => s.update("cta", e.target.value)} /></Field>
      </div>
    </SectionCard>
  );
}

function FooterEditor() {
  const s = useSectionDraft("footer");
  return (
    <SectionCard
      title="Footer"
      footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
        <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
        <Field label="Title - line 2"><TextInput value={get(s.draft, "title_2", "")} onChange={(e) => s.update("title_2", e.target.value)} /></Field>
        <Field label="CTA label"><TextInput value={get(s.draft, "cta", "")} onChange={(e) => s.update("cta", e.target.value)} /></Field>
        <Field label="Email"><TextInput type="email" value={get(s.draft, "email", "")} onChange={(e) => s.update("email", e.target.value)} /></Field>
        <Field label="Phone"><TextInput value={get(s.draft, "phone", "")} onChange={(e) => s.update("phone", e.target.value)} /></Field>
        <Field label="Location"><TextInput value={get(s.draft, "location", "")} onChange={(e) => s.update("location", e.target.value)} /></Field>
        <Field label="Copyright text"><TextInput value={get(s.draft, "copyright", "")} onChange={(e) => s.update("copyright", e.target.value)} /></Field>
      </div>
    </SectionCard>
  );
}

function SocialEditor() {
  const s = useSectionDraft("social");
  return (
    <SectionCard title="Social links" footer={<SaveButton saving={s.saving} onClick={s.save} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Instagram URL"><TextInput value={get(s.draft, "instagram", "")} onChange={(e) => s.update("instagram", e.target.value)} /></Field>
        <Field label="LinkedIn URL"><TextInput value={get(s.draft, "linkedin", "")} onChange={(e) => s.update("linkedin", e.target.value)} /></Field>
        <Field label="Facebook URL"><TextInput value={get(s.draft, "facebook", "")} onChange={(e) => s.update("facebook", e.target.value)} /></Field>
      </div>
    </SectionCard>
  );
}

// ============================================================================
// ABOUT
// ============================================================================
type Exp = { role: string; company: string; period: string };
type Skill = { name: string; value: number };

function AboutManager() {
  const s = useSectionDraft("about");
  const experience = get<Exp[]>(s.draft, "experience", []);
  const skills = get<Skill[]>(s.draft, "skills", []);
  const brands = get<string[]>(s.draft, "brands", []);

  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal">About page</h2>
        <p className="text-sm text-slate-500 mt-1">Bio, contact, experience, skills and selected brands shown on /about.</p>
      </header>

      <SectionCard
        title="Headline & bio"
        footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
          <Field label="Top right tag"><TextInput value={get(s.draft, "top_right", "")} onChange={(e) => s.update("top_right", e.target.value)} /></Field>
          <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
          <Field label="Title - accent"><TextInput value={get(s.draft, "title_accent", "")} onChange={(e) => s.update("title_accent", e.target.value)} /></Field>
          <Field label="Bio paragraph 1"><TextArea rows={4} value={get(s.draft, "bio_p1", "")} onChange={(e) => s.update("bio_p1", e.target.value)} /></Field>
          <Field label="Bio paragraph 2"><TextArea rows={4} value={get(s.draft, "bio_p2", "")} onChange={(e) => s.update("bio_p2", e.target.value)} /></Field>
          <Field label="Bio paragraph 3"><TextArea rows={4} value={get(s.draft, "bio_p3", "")} onChange={(e) => s.update("bio_p3", e.target.value)} /></Field>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Email"><TextInput type="email" value={get(s.draft, "email", "")} onChange={(e) => s.update("email", e.target.value)} /></Field>
          <Field label="Phone"><TextInput value={get(s.draft, "phone", "")} onChange={(e) => s.update("phone", e.target.value)} /></Field>
          <Field label="Location"><TextInput value={get(s.draft, "location", "")} onChange={(e) => s.update("location", e.target.value)} /></Field>
        </div>

        {/* Experience */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="mono text-[10px] tracking-[0.2em] text-slate-500">EXPERIENCE</div>
            <button onClick={() => s.update("experience", [...experience, { role: "", company: "", period: "" }])}
              className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"><Plus size={12} /> Add</button>
          </div>
          <div className="mt-3 space-y-2">
            {experience.map((x, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2">
                <input className="adm-input col-span-4" placeholder="Role" value={x.role} onChange={(e) => { const n = [...experience]; n[i] = { ...x, role: e.target.value }; s.update("experience", n); }} />
                <input className="adm-input col-span-4" placeholder="Company" value={x.company} onChange={(e) => { const n = [...experience]; n[i] = { ...x, company: e.target.value }; s.update("experience", n); }} />
                <input className="adm-input col-span-3" placeholder="Period" value={x.period} onChange={(e) => { const n = [...experience]; n[i] = { ...x, period: e.target.value }; s.update("experience", n); }} />
                <button onClick={() => s.update("experience", experience.filter((_, j) => j !== i))} className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="mono text-[10px] tracking-[0.2em] text-slate-500">SKILLS</div>
            <button onClick={() => s.update("skills", [...skills, { name: "", value: 50 }])}
              className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"><Plus size={12} /> Add</button>
          </div>
          <div className="mt-3 space-y-2">
            {skills.map((sk, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2">
                <input className="adm-input col-span-7" placeholder="Skill" value={sk.name} onChange={(e) => { const n = [...skills]; n[i] = { ...sk, name: e.target.value }; s.update("skills", n); }} />
                <input type="number" min={0} max={100} className="adm-input col-span-3" value={sk.value} onChange={(e) => { const n = [...skills]; n[i] = { ...sk, value: Math.min(100, Math.max(0, Number(e.target.value) || 0)) }; s.update("skills", n); }} />
                <span className="col-span-1 text-xs text-slate-500">%</span>
                <button onClick={() => s.update("skills", skills.filter((_, j) => j !== i))} className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mt-8">
          <Field label="Selected brands (comma separated)" hint="Names shown in the brands list.">
            <TextArea rows={3} value={brands.join(", ")} onChange={(e) => s.update("brands", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================================
// CONTACT
// ============================================================================
function ContactManager() {
  const s = useSectionDraft("contact");
  const projectTypes = get<string[]>(s.draft, "project_types", []);
  const budgets = get<string[]>(s.draft, "budgets", []);
  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal">Contact page</h2>
        <p className="text-sm text-slate-500 mt-1">Headline, status, contact details and form options.</p>
      </header>
      <SectionCard
        title="Contact content"
        footer={<><button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">Restore default</button><SaveButton saving={s.saving} onClick={s.save} /></>}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow"><TextInput value={get(s.draft, "eyebrow", "")} onChange={(e) => s.update("eyebrow", e.target.value)} /></Field>
          <Field label="Status"><TextInput value={get(s.draft, "status", "")} onChange={(e) => s.update("status", e.target.value)} /></Field>
          <Field label="Title - line 1"><TextInput value={get(s.draft, "title_1", "")} onChange={(e) => s.update("title_1", e.target.value)} /></Field>
          <Field label="Title - accent"><TextInput value={get(s.draft, "title_accent", "")} onChange={(e) => s.update("title_accent", e.target.value)} /></Field>
          <Field label="Subtitle"><TextArea rows={3} value={get(s.draft, "subtitle", "")} onChange={(e) => s.update("subtitle", e.target.value)} /></Field>
          <Field label="Email"><TextInput type="email" value={get(s.draft, "email", "")} onChange={(e) => s.update("email", e.target.value)} /></Field>
          <Field label="Phone"><TextInput value={get(s.draft, "phone", "")} onChange={(e) => s.update("phone", e.target.value)} /></Field>
          <Field label="Location"><TextInput value={get(s.draft, "location", "")} onChange={(e) => s.update("location", e.target.value)} /></Field>
          <Field label="Project types (comma separated)"><TextInput value={projectTypes.join(", ")} onChange={(e) => s.update("project_types", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></Field>
          <Field label="Budgets (comma separated)"><TextInput value={budgets.join(", ")} onChange={(e) => s.update("budgets", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} /></Field>
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================================
// CLIENTS
// ============================================================================
function ClientsManager() {
  const { data: clients = [] } = useClients(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const labelOf = (id: string) => clients.find((c) => c.id === id)?.name ?? id;

  const update = async (id: string, patch: Partial<DbClient>) => {
    setBusyId(id);
    await snapshotBefore("clients", id, labelOf(id));
    const { error } = await supabase
      .from("clients")
      .update({ ...(patch as Record<string, unknown>), updated_at: new Date().toISOString() })
      .eq("id", id);
    setBusyId(null);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  };

  const create = async () => {
    const max = clients.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const { error } = await supabase.from("clients").insert({ name: "New client", sort_order: max + 1, is_active: true });
    if (error) toast.error(error.message);
    else toast.success("Client added");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await snapshotBefore("clients", id, `${labelOf(id)} (deleted)`);
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted");
  };

  const uploadLogo = async (id: string, file: File) => {
    setBusyId(id);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `clients/${id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      const patch: Partial<DbClient> = { logo_url: data.publicUrl };
      if (dims) { patch.logo_width = dims.width; patch.logo_height = dims.height; }
      await update(id, patch);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <header className="flex items-start justify-between">
        <div>
          <h2 className="display text-2xl text-metal">Clients</h2>
          <p className="text-sm text-slate-500 mt-1">Logos appear on the homepage strip in real time. Logos preserve their natural proportion.</p>
        </div>
        <button onClick={create} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold">
          <Plus size={14} /> Add client
        </button>
      </header>

      <div className="mt-6 space-y-3">
        {clients.length === 0 && (
          <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
            No clients yet. Click "Add client".
          </div>
        )}
        {clients.map((c) => (
          <div key={c.id} className="grid grid-cols-12 gap-3 items-center bg-[#030814] border border-white/[0.08] rounded p-3">
            <div className="col-span-2 grid place-items-center h-16 bg-[#01040A] border border-white/[0.06] rounded p-2">
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                <ImageIcon size={16} className="text-slate-600" />
              )}
            </div>
            <div className="col-span-3">
              <input className="adm-input" placeholder="Name" defaultValue={c.name}
                onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })} />
            </div>
            <div className="col-span-3">
              <input className="adm-input" placeholder="https://..." defaultValue={c.website_url ?? ""}
                onBlur={(e) => update(c.id, { website_url: e.target.value || null })} />
            </div>
            <div className="col-span-1">
              <input type="number" className="adm-input" defaultValue={c.sort_order}
                onBlur={(e) => update(c.id, { sort_order: Number(e.target.value) || 0 })} />
            </div>
            <label className="col-span-2 inline-flex items-center gap-2 text-xs text-slate-300 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-sky-300/40">
              <Upload size={13} /> {c.logo_url ? "Replace logo" : "Upload logo"}
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadLogo(c.id, e.target.files[0])} />
            </label>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <button onClick={() => update(c.id, { is_active: !c.is_active })} className="text-slate-400 hover:text-white" title={c.is_active ? "Visible" : "Hidden"}>
                {c.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-slate-600" />}
              </button>
              <button onClick={() => remove(c.id)} className="text-slate-500 hover:text-red-300">
                {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// PORTFOLIO
// ============================================================================
// Categories come from src/lib/cms.ts (PROJECT_CATEGORIES).

function PortfolioManager() {
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
      .filter((p) => statusFilter === "all" || (statusFilter === "live" ? p.is_published : !p.is_published));
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
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("projects").update({ sort_order: b, updated_at: new Date().toISOString() }).eq("id", p.id),
      supabase.from("projects").update({ sort_order: a, updated_at: new Date().toISOString() }).eq("id", other.id),
    ]);
    if (e1 || e2) toast.error((e1 || e2)!.message);
  };

  const create = async () => {
    const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { data, error } = await supabase
      .from("projects")
      .insert({ title: "New project", category: "Digital Design", sort_order: max + 1, is_published: false })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) setEditing(data as unknown as DbProject);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const proj = projects.find((p) => p.id === id);
    await snapshotBefore("projects", id, `${proj?.title ?? id} (deleted)`);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Deleted");
  };

  const duplicate = async (p: DbProject) => {
    const { id, ...rest } = p;
    void id;
    const payload = {
      ...rest,
      title: `${p.title} (copy)`,
      sort_order: p.sort_order + 1,
      is_published: false,
    } as unknown as never;
    const { error } = await supabase.from("projects").insert(payload);
    if (error) toast.error(error.message);
    else toast.success("Duplicated");
  };

  const togglePublish = async (p: DbProject) => {
    await snapshotBefore("projects", p.id, p.title);
    const { error } = await supabase.from("projects").update({ is_published: !p.is_published, updated_at: new Date().toISOString() }).eq("id", p.id);
    if (error) toast.error(error.message);
  };

  return (
    <div>
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="display text-2xl text-metal">Portfolio</h2>
          <p className="text-sm text-slate-500 mt-1">Selected work shown on /portfolio. Images preserve real proportions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBatchOpen(true)} className="inline-flex items-center gap-2 border border-white/10 hover:border-sky-300/40 px-4 py-2 rounded text-sm">
            <Plus size={14} /> Batch add
          </button>
          <button onClick={create} className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold">
            <Plus size={14} /> New project
          </button>
        </div>
      </header>

      <div className="mt-5 flex flex-wrap gap-2 items-center">
        <div className="mono text-[10px] text-slate-500 mr-2">CATEGORY</div>
        {["All", ...PROJECT_CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              filter === c ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"
            }`}>{c}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <div className="mono text-[10px] text-slate-500 mr-2">STATUS</div>
        {(["all", "live", "draft"] as const).map((c) => (
          <button key={c} onClick={() => setStatusFilter(c)}
            className={`mono text-[11px] px-3 py-1.5 rounded-full border transition ${
              statusFilter === c ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"
            }`}>{c}</button>
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
            <div key={p.id} className="bg-[#030814] border border-white/[0.08] rounded-lg overflow-hidden flex flex-col">
              <div className="relative bg-[#01040A] border-b border-white/[0.06] grid place-items-center" style={{ aspectRatio: ratio }}>
                {p.cover_url ? (
                  <img src={p.cover_url} alt={p.title}
                    className={`w-full h-full ${p.image_fit === "cover" ? "object-cover" : "object-contain"}`} />
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
                    {p.client_name && <div className="text-[12px] text-slate-200">{p.client_name}</div>}
                    <div className="mono text-[10px] tracking-[0.16em] text-slate-500 mt-0.5">{p.year ?? "-"} · {cat}</div>
                    <div className="text-sm font-medium text-slate-100 mt-1">{p.title}</div>
                  </div>
                  <span className={`mono text-[9px] px-2 py-0.5 rounded ${p.is_published ? "bg-sky-300/10 text-sky-200" : "bg-amber-300/10 text-amber-200"}`}>
                    {p.is_published ? "LIVE" : "DRAFT"}
                  </span>
                </div>
                {p.featured && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-300"><Star size={10} /> Featured</div>
                )}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs">
                  <button onClick={() => move(p, -1)} disabled={isFirst} title="Move up"
                    className="inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400">
                    <ArrowUp size={12} />
                  </button>
                  <button onClick={() => move(p, 1)} disabled={isLast} title="Move down"
                    className="inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400">
                    <ArrowDown size={12} />
                  </button>
                  <span className="w-px h-4 bg-white/10 mx-1" />
                  <button onClick={() => setEditing(p)} className="text-sky-300 hover:text-sky-200">Edit</button>
                  <button onClick={() => duplicate(p)} className="text-slate-400 hover:text-white inline-flex items-center gap-1"><Copy size={11} /> Duplicate</button>
                  <button onClick={() => togglePublish(p)} className="text-slate-400 hover:text-white">{p.is_published ? "Unpublish" : "Publish"}</button>
                  <button onClick={() => remove(p.id)} className="ml-auto text-slate-500 hover:text-red-300 inline-flex items-center gap-1"><Trash2 size={11} /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editing && <ProjectEditor project={editing} onClose={() => setEditing(null)} />}
      {batchOpen && <BatchAddProjects onClose={() => setBatchOpen(false)} startSort={projects.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1} />}
    </div>
  );
}

function ProjectEditor({ project, onClose }: { project: DbProject; onClose: () => void }) {
  const [form, setForm] = useState<DbProject>(project);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = <K extends keyof DbProject>(k: K, v: DbProject[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    if (!form.category.trim()) { toast.error("Category is required"); return; }
    setSaving(true);
    await snapshotBefore("projects", form.id, form.title);
    const { error } = await supabase.from("projects").update({
      title: form.title,
      subtitle: form.subtitle,
      category: form.category,
      year: form.year,
      description: form.description,
      cover_url: form.cover_url,
      cover_width: form.cover_width ?? null,
      cover_height: form.cover_height ?? null,
      palette: form.palette,
      span: form.span,
      sort_order: form.sort_order,
      tags: form.tags as unknown as never,
      gallery: form.gallery as unknown as never,
      gallery_meta: (form.gallery_meta ?? []) as unknown as never,
      is_published: form.is_published,
      featured: form.featured ?? false,
      client_name: form.client_name ?? null,
      image_fit: form.image_fit ?? "contain",
      concept: form.concept ?? null,
      idea: form.idea ?? null,
      role: form.role ?? null,
      notes: form.notes ?? null,
      collaborators: (form.collaborators ?? []) as unknown as never,
      tools_used: (form.tools_used ?? []) as unknown as never,
      deliverables: (form.deliverables ?? []) as unknown as never,
      updated_at: new Date().toISOString(),
    }).eq("id", form.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); onClose(); }
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `projects/${form.id}-cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("cover_url", data.publicUrl);
      if (dims) { set("cover_width", dims.width); set("cover_height", dims.height); }
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  const uploadGalleryItem = async (file: File) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `projects/${form.id}-gallery-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage.from("site-assets").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("gallery", [...(form.gallery ?? []), data.publicUrl]);
      set("gallery_meta", [
        ...(form.gallery_meta ?? []),
        { url: data.publicUrl, width: dims?.width, height: dims?.height },
      ]);
    } catch (e) { toast.error((e as Error).message); }
    finally { setUploading(false); }
  };

  const ratio = aspectFromDims(form.cover_width, form.cover_height) || "16 / 10";
  const isCampaign = isCampaignCategory(form.category);
  const toggleTool = (t: string) => {
    const cur = form.tools_used ?? [];
    set("tools_used", cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-5xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <h3 className="display text-xl text-metal">Edit project</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">Close</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          {/* FORM */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Project title"><TextInput value={form.title} onChange={(e) => set("title", e.target.value)} /></Field>
              <Field label="Client"><TextInput value={form.client_name ?? ""} onChange={(e) => set("client_name", e.target.value)} /></Field>
              <Field label="Category">
                <select className="adm-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Year"><TextInput value={form.year ?? ""} onChange={(e) => set("year", e.target.value)} /></Field>
              <Field label="Subtitle / discipline"><TextInput value={form.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
              <Field label="Sort order"><TextInput type="number" value={String(form.sort_order)} onChange={(e) => set("sort_order", Number(e.target.value) || 0)} /></Field>
            </div>

            <Field label="Short description">
              <TextArea rows={4} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
            </Field>

            <Field label="Tags (comma separated)">
              <TextInput value={(form.tags ?? []).join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Image fit" hint="Contain keeps the full image visible. Cover crops to fill.">
                <select className="adm-input" value={form.image_fit ?? "contain"} onChange={(e) => set("image_fit", e.target.value)}>
                  <option value="contain">Contain (preserve full image)</option>
                  <option value="cover">Cover (fill, may crop)</option>
                </select>
              </Field>
              <Field label="Card size" hint="Layout span on the public grid.">
                <select className="adm-input" value={form.span ?? "normal"} onChange={(e) => set("span", e.target.value)}>
                  <option value="normal">Normal</option>
                  <option value="wide">Wide</option>
                  <option value="tall">Tall</option>
                </select>
              </Field>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} /> Published (live)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={!!form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured
              </label>
            </div>

            {/* CASE STUDY (campaign-aware, but available for all) */}
            <div className="mt-2 rounded-lg border border-white/[0.08] bg-[#01040A]/40 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">CASE STUDY</div>
                {isCampaign && (
                  <span className="mono text-[9px] tracking-[0.2em] text-amber-300/80">CAMPAIGN</span>
                )}
              </div>

              {isCampaign && (
                <>
                  <Field label="Campaign concept" hint="The strategic angle behind the campaign.">
                    <TextArea rows={3} value={form.concept ?? ""} onChange={(e) => set("concept", e.target.value)} />
                  </Field>
                  <Field label="Creative idea" hint="The big creative idea or headline thought.">
                    <TextArea rows={3} value={form.idea ?? ""} onChange={(e) => set("idea", e.target.value)} />
                  </Field>
                </>
              )}

              <Field label="My role">
                <TextInput value={form.role ?? ""} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Art Director, lead design" />
              </Field>

              <Field label="Collaborators (comma separated)">
                <TextInput
                  value={(form.collaborators ?? []).join(", ")}
                  onChange={(e) => set("collaborators", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
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
                  onChange={(e) => set("deliverables", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                  placeholder="e.g. Key visual, Social cutdowns, OOH"
                />
              </Field>

              <Field label="Notes / outcome">
                <TextArea rows={3} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
              </Field>
            </div>
          </div>

          {/* PREVIEW + UPLOADS */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">COVER PREVIEW</div>
              <div className="bg-[#01040A] border border-white/[0.06] rounded grid place-items-center overflow-hidden" style={{ aspectRatio: ratio }}>
                {form.cover_url ? (
                  <img src={form.cover_url} alt="" className={`w-full h-full ${form.image_fit === "cover" ? "object-cover" : "object-contain"}`} />
                ) : (
                  <div className="text-slate-600 text-xs">No image yet</div>
                )}
              </div>
              {form.cover_width && form.cover_height && (
                <div className="text-[11px] text-slate-500 mt-1">Real size: {form.cover_width}×{form.cover_height}px</div>
              )}
              <div className="flex items-center gap-2 mt-3">
                <label className="inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  {form.cover_url ? "Replace cover" : "Upload cover"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
                </label>
                {form.cover_url && (
                  <button onClick={() => { set("cover_url", null); set("cover_width", null); set("cover_height", null); }}
                    className="text-xs text-slate-500 hover:text-red-300">Clear</button>
                )}
              </div>
            </div>

            <div>
              <div className="mono text-[10px] tracking-[0.2em] text-slate-500 mb-2">GALLERY ({(form.gallery ?? []).length})</div>
              <div className="grid grid-cols-3 gap-2">
                {(form.gallery ?? []).map((url, i) => (
                  <div key={url + i} className="relative bg-[#01040A] border border-white/[0.06] rounded overflow-hidden aspect-square">
                    <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <button onClick={() => { set("gallery", form.gallery.filter((_, j) => j !== i)); set("gallery_meta", (form.gallery_meta ?? []).filter((m) => m.url !== url)); }}
                      className="absolute top-1 right-1 bg-[#01040A]/80 rounded p-1 text-slate-300 hover:text-red-300">
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square grid place-items-center border border-dashed border-white/10 rounded text-xs text-slate-500 hover:border-sky-300/50 hover:text-sky-300 cursor-pointer">
                  <Plus size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadGalleryItem(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2">Cancel</button>
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
    Array.from({ length: 10 }).map(() => ({ title: "", client_name: "", category: "Digital Design", year: String(new Date().getFullYear()) }))
  );
  const [saving, setSaving] = useState(false);

  const setRow = (i: number, patch: Partial<BatchRow>) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };

  const submit = async () => {
    const valid = rows
      .map((r, i) => ({ ...r, sort_order: startSort + i }))
      .filter((r) => r.title.trim().length > 0);
    if (valid.length === 0) { toast.error("Add at least one title."); return; }
    setSaving(true);
    const { error } = await supabase.from("projects").insert(
      valid.map((r) => ({
        title: r.title.trim(),
        client_name: r.client_name.trim() || null,
        category: r.category,
        year: r.year || null,
        sort_order: r.sort_order,
        is_published: false,
      }))
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success(`Added ${valid.length} project${valid.length > 1 ? "s" : ""} as drafts`); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08]">
          <div>
            <h3 className="display text-xl text-metal">Batch add projects</h3>
            <p className="text-xs text-slate-500 mt-1">Up to 10 at once. Created as drafts - open each to add cover, description and tags.</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white text-sm">Close</button>
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
            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2">
              <div className="col-span-1 text-xs text-slate-500 pl-2">{i + 1}</div>
              <input className="adm-input col-span-4" placeholder="Project title" value={r.title} onChange={(e) => setRow(i, { title: e.target.value })} />
              <input className="adm-input col-span-3" placeholder="Client name" value={r.client_name} onChange={(e) => setRow(i, { client_name: e.target.value })} />
              <select className="adm-input col-span-3" value={r.category} onChange={(e) => setRow(i, { category: e.target.value })}>
                {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input className="adm-input col-span-1" placeholder="2026" value={r.year} onChange={(e) => setRow(i, { year: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]">
          <button onClick={onClose} className="text-sm text-slate-400 hover:text-white px-4 py-2">Cancel</button>
          <SaveButton saving={saving} onClick={submit} label="Create projects" />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED - raw JSON editor (kept for power use)
// ============================================================================
function AdvancedJSONManager() {
  const { data: settings } = useSiteSettings();
  const keys = Object.keys(FALLBACK_SETTINGS);
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal">Advanced</h2>
        <p className="text-sm text-slate-500 mt-1">Raw JSON editing for every setting key. Use only if you know the schema.</p>
      </header>

      <div className="mt-6 space-y-2">
        {keys.map((k) => {
          const merged = { ...(FALLBACK_SETTINGS[k] ?? {}), ...(settings?.[k] ?? {}) };
          const isOpen = open === k;
          return (
            <div key={k} className="bg-[#030814] border border-white/[0.08] rounded">
              <button onClick={() => setOpen(isOpen ? null : k)} className="w-full flex items-center justify-between p-4 text-left">
                <div className="font-mono text-sm text-slate-200">{k}</div>
                {isOpen ? <ChevronDown size={14} className="text-slate-500" /> : <ChevronRight size={14} className="text-slate-500" />}
              </button>
              {isOpen && <RawEditor sectionKey={k} initial={merged} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RawEditor({ sectionKey, initial }: { sectionKey: string; initial: Record<string, unknown> }) {
  const [text, setText] = useState(JSON.stringify(initial, null, 2));
  const [saving, setSaving] = useState(false);
  const save = async () => {
    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(text); } catch { toast.error("Invalid JSON"); return; }
    setSaving(true);
    await snapshotBefore("site_settings", sectionKey, sectionKey);
    const { error } = await supabase.from("site_settings").upsert(
      [{ key: sectionKey, value: parsed as never, updated_at: new Date().toISOString() }],
      { onConflict: "key" }
    );
    setSaving(false);
    if (error) toast.error(error.message); else toast.success(`Saved ${sectionKey}`);
  };
  return (
    <div className="px-4 pb-4">
      <textarea
        spellCheck={false}
        rows={Math.min(24, Math.max(6, text.split("\n").length))}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full bg-[#01040A] border border-white/10 rounded p-3 text-[12px] font-mono text-slate-200 focus:outline-none focus:border-sky-300/50"
      />
      <div className="mt-2 flex justify-end">
        <SaveButton saving={saving} onClick={save} />
      </div>
    </div>
  );
}
