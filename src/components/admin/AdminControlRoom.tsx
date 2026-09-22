import { createLazyFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdmin";
import { useClients, useProjects, useSiteSettings } from "@/hooks/useSiteData";
import {
  FALLBACK_SETTINGS,
  PROJECT_CATEGORIES,
  TOOL_OPTIONS,
  isCampaignCategory,
  normalizeCategory,
  type DbClient,
  type DbProject,
} from "@/lib/cms";
import { readImageDimensions, aspectFromDims } from "@/lib/image-utils";
import { isUuid, generateUuid } from "@/lib/utils";
import { setAdminDirty, clearAdminDirty, hasAdminDirty, subscribeAdminDirty } from "@/lib/admin-dirty";
import {
  Phase4AdminToolbar,
  ReleaseCenter,
  SystemHealthCenter,
  AuditCenter,
} from "@/components/admin/Phase4ControlRoom";

const Phase2WebsiteCMS = lazy(() =>
  import("@/components/admin/Phase2AdminSurface").then((module) => ({
    default: module.Phase2AdminSurface,
  })),
);
const Phase3OperationsOS = lazy(() =>
  import("@/components/admin/Phase3OperationsOS").then((module) => ({
    default: module.Phase3OperationsOS,
  })),
);
const InboxHub = lazy(() =>
  import("@/components/admin/InboxHub").then((module) => ({
    default: module.InboxHub,
  })),
);
const AuditManager = lazy(() =>
  import("@/components/admin/AuditManager").then((module) => ({
    default: module.AuditManager,
  })),
);
const HistoryManager = lazy(() =>
  import("@/components/admin/HistoryManager").then((module) => ({
    default: module.HistoryManager,
  })),
);
const InvoiceWorkspace = lazy(() =>
  import("@/components/admin/InvoiceWorkspace").then((module) => ({
    default: module.InvoiceWorkspace,
  })),
);const PortfolioManager = lazy(() =>
  import("@/components/admin/PortfolioModule").then((module) => ({
    default: module.PortfolioManager,
  })),
);

import { toast } from "sonner";
import {
  createAdminProject,
  createAdminProjectsBatch,
  createAdminClient,
  deleteAdminClient,
  deleteAdminProject,
  duplicateAdminProject,
  publishAdminProject,
  reorderAdminProjects,
  saveAdminClient,
  saveAdminProject,
  saveAdminSiteSetting,
  prepareAdminMediaUpload,
} from "@/lib/admin.functions";
import {
  LogOut,
  Save,
  Trash2,
  Plus,
  Upload,
  Loader2,
  Image as ImageIcon,
  Briefcase,
  Users,
  FileText,
  Eye,
  EyeOff,
  Copy,
  Star,
  ChevronDown,
  ChevronRight,
  Home,
  User as UserIcon,
  Mail,
  Code2,
  Inbox,
  History,
  ArrowUp,
  ArrowDown,
  LayoutDashboard,
  Globe2,
  Settings2,
  Menu,
  X,
  Send,
  ShieldCheck,
} from "lucide-react";

export const Route = createLazyFileRoute("/admin")({
  component: ControlRoom,
});

type Section =
  | "overview"
  | "homepage"
  | "navigation"
  | "credentials"
  | "services"
  | "global"
  | "seo"
  | "media"
  | "site"
  | "clients"
  | "studios"
  | "portfolio"
  | "about"
  | "contact"
  | "operations"
  | "inbox"
  | "invoice"
  | "history"
  | "audit"
  | "release"
  | "system"
  | "advanced";

function ControlRoom() {
  useAdminInputStyle();
  const { session, isAdmin, role, loading } = useAdminAuth();
  const [section, setSection] = useState<Section>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [dirty, setDirty] = useState(hasAdminDirty());

  useEffect(() => subscribeAdminDirty(() => setDirty(hasAdminDirty())), []);

  const requestSection = (next: string) => {
    const target = next as Section;
    if (target === section) {
      setMobileNavOpen(false);
      return;
    }
    if (dirty) {
      const proceed = window.confirm(
        "Existem alterações não guardadas. Quer sair sem guardar?",
      );
      if (!proceed) return;
      clearAdminDirty();
    }
    setSection(target);
    setMobileNavOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#01040A] text-slate-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }
  if (!session || !isAdmin) return <LoginForm hasSession={!!session} />;

  const allItems = [
    { id: "overview" as const, label: "Overview", group: "CONTROL", Icon: LayoutDashboard, roles: ["owner", "admin", "editor", "finance"] },
    { id: "homepage" as const, label: "Homepage", group: "WEBSITE", Icon: Home, roles: ["owner", "admin", "editor"] },
    { id: "navigation" as const, label: "Navigation", group: "WEBSITE", Icon: ArrowUp, roles: ["owner", "admin", "editor"] },
    { id: "about" as const, label: "About", group: "WEBSITE", Icon: UserIcon, roles: ["owner", "admin", "editor"] },
    { id: "credentials" as const, label: "Credentials", group: "WEBSITE", Icon: UserIcon, roles: ["owner", "admin", "editor"] },
    { id: "services" as const, label: "Services", group: "WEBSITE", Icon: Briefcase, roles: ["owner", "admin", "editor"] },
    { id: "contact" as const, label: "Contact", group: "WEBSITE", Icon: Mail, roles: ["owner", "admin", "editor"] },
    { id: "seo" as const, label: "SEO", group: "WEBSITE", Icon: Globe2, roles: ["owner", "admin", "editor"] },
    { id: "global" as const, label: "Global Settings", group: "WEBSITE", Icon: Settings2, roles: ["owner", "admin", "editor"] },
    { id: "portfolio" as const, label: "Portfolio", group: "CONTENT", Icon: Briefcase, roles: ["owner", "admin", "editor"] },
    { id: "clients" as const, label: "Clients", group: "CONTENT", Icon: Users, roles: ["owner", "admin", "editor"] },
    { id: "studios" as const, label: "Studios", group: "CONTENT", Icon: Users, roles: ["owner", "admin", "editor"] },
    { id: "media" as const, label: "Media Library", group: "CONTENT", Icon: ImageIcon, roles: ["owner", "admin", "editor"] },
    { id: "site" as const, label: "Site Content", group: "CONTENT", Icon: Home, roles: ["owner", "admin", "editor"] },
    { id: "operations" as const, label: "Operations OS", group: "OPERATIONS", Icon: LayoutDashboard, roles: ["owner", "admin", "finance"] },
    { id: "inbox" as const, label: "Legacy Inbox", group: "OPERATIONS", Icon: Inbox, roles: ["owner", "admin", "finance"] },
    { id: "invoice" as const, label: "Invoicing", group: "FINANCE", Icon: FileText, roles: ["owner", "admin", "finance"] },
    { id: "history" as const, label: "History", group: "SYSTEM", Icon: History, roles: ["owner", "admin", "editor"] },
    { id: "audit" as const, label: "Audit Center", group: "SYSTEM", Icon: History, roles: ["owner", "admin"] },
    { id: "release" as const, label: "Release Center", group: "SYSTEM", Icon: Send, roles: ["owner", "admin", "editor"] },
    { id: "system" as const, label: "System Health", group: "SYSTEM", Icon: ShieldCheck, roles: ["owner", "admin"] },
    { id: "advanced" as const, label: "Advanced", group: "SYSTEM", Icon: Code2, roles: ["owner", "admin"] },
  ] as const;
  const items = allItems.filter((item) => item.roles.includes(role as never));

  let lastGroup = "";
  const nav = items.map((item) => {
    const showGroup = item.group !== lastGroup;
    lastGroup = item.group;
    return { item, showGroup };
  });

  const renderContent = () => (
    <>
      {section === "overview" && (
        <Phase2WebsiteCMS
          section="overview"
          onNavigate={requestSection}
        />
      )}
      {section === "homepage" && (
        <Phase2WebsiteCMS section="homepage" onNavigate={requestSection} />
      )}
      {section === "navigation" && (
        <Phase2WebsiteCMS section="navigation" onNavigate={requestSection} />
      )}
      {section === "credentials" && (
        <Phase2WebsiteCMS section="credentials" onNavigate={requestSection} />
      )}
      {section === "services" && (
        <Phase2WebsiteCMS section="services" onNavigate={requestSection} />
      )}
      {section === "global" && (
        <Phase2WebsiteCMS section="global" onNavigate={requestSection} />
      )}
      {section === "seo" && (
        <Phase2WebsiteCMS section="seo" onNavigate={requestSection} />
      )}
      {section === "media" && (
        <Phase2WebsiteCMS section="media" onNavigate={requestSection} />
      )}
      {section === "site" && <SiteContentManager />}
      {section === "clients" && <ClientsManager />}
      {section === "studios" && <StudiosManager />}
      {section === "portfolio" && <PortfolioManager />}
      {section === "about" && <AboutManager />}
      {section === "contact" && <ContactManager />}
      {section === "operations" && (
        <Phase3OperationsOS onNavigate={requestSection} />
      )}
      {section === "inbox" && <InboxHub />}
      {section === "invoice" && (
        <div className="space-y-12">
          <Suspense fallback={<WorkspaceLoader label="Loading invoicing workspace..." />}>
            <InvoiceWorkspace />
          </Suspense>
          <InvoiceSettingsEditor />
        </div>
      )}
      {section === "history" && <HistoryManager />}
      {section === "audit" && <AuditCenter />}
      {section === "release" && <ReleaseCenter />}
      {section === "system" && <SystemHealthCenter />}
      {section === "advanced" && <AdvancedJSONManager />}
    </>
  );

  return (
    <div className="min-h-screen bg-[#01040A] text-slate-200 flex">
      <a
        href="#control-room-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[140] focus:rounded-lg focus:bg-sky-300 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#01040A]"
      >
        Skip to main content
      </a>

      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-[80] bg-black/70 lg:hidden"
        />
      ) : null}

      <aside
        className={
          "fixed inset-y-0 left-0 z-[90] flex w-[280px] shrink-0 flex-col border-r border-white/[0.08] bg-[#030814] p-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:translate-x-0 " +
          (mobileNavOpen ? "translate-x-0" : "-translate-x-full")
        }
        aria-label="Control Room navigation"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">CONTROL ROOM</div>
            <div className="display text-xl mt-1">Edmundo</div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.08] text-slate-500 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X size={14} />
          </button>
        </div>

        <nav className="mt-7 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          {nav.map(({ item, showGroup }) => (
            <div key={item.id}>
              {showGroup ? (
                <div className="mono mb-1 px-3 text-[8px] uppercase tracking-[0.24em] text-slate-700">
                  {item.group}
                </div>
              ) : null}
              <button
                type="button"
                onClick={() => requestSection(item.id)}
                aria-current={section === item.id ? "page" : undefined}
                className={
                  "w-full flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50 " +
                  (section === item.id
                    ? "border-sky-300/20 bg-sky-300/10 text-sky-100"
                    : "border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white")
                }
              >
                <item.Icon size={14} aria-hidden="true" />
                {item.label}
              </button>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-white/[0.06] pt-4">
          {dirty ? (
            <div className="mb-3 rounded-lg border border-amber-300/20 bg-amber-300/[0.04] px-3 py-2 text-[10px] text-amber-200">
              Unsaved changes. Navigation will ask before leaving this surface.
            </div>
          ) : null}
          <div className="mb-3 truncate text-[11px] text-slate-500">{session.user.email}</div>
          <button
            type="button"
            onClick={() => {
              void supabase.auth.signOut();
              window.location.reload();
            }}
            className="flex min-h-9 items-center gap-2 text-sm text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
          >
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      <main id="control-room-main" tabIndex={-1} className="min-w-0 flex-1 overflow-auto p-4 sm:p-6 md:p-10">
        <div className="mb-3 flex items-center justify-between gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.09] px-3 text-xs text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
            aria-label="Open admin navigation"
          >
            <Menu size={14} /> Menu
          </button>
          <span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">
            {items.find((item) => item.id === section)?.label}
          </span>
        </div>

        <Phase4AdminToolbar
          onNavigate={requestSection}
          onOpenRelease={() => requestSection("release")}
          onOpenSystem={() => requestSection("system")}
        />

        <Suspense fallback={<WorkspaceLoader label="Loading workspace..." />}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
}

function WorkspaceLoader({ label }: { label: string }) {
  return (
    <div className="grid min-h-[280px] place-items-center rounded-xl border border-white/[0.07] bg-[#030814] text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <Loader2 size={15} className="animate-spin text-sky-300/70" />
        {label}
      </div>
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
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="adm-input"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="adm-input"
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
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
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
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
  title,
  description,
  children,
  footer,
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

function SaveButton({
  saving,
  onClick,
  label = "Save",
}: {
  saving: boolean;
  onClick: () => void;
  label?: string;
}) {
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
function useAdminInputStyle() {
  useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_TAG_ID)) return;
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
  }, []);
}

// ============================================================================
// SETTINGS HELPERS - read merged value (DB over fallback) and save per-key
// ============================================================================
function useSectionDraft(key: string) {
  const saveAdminSetting = useServerFn(saveAdminSiteSetting);
  const { data: settings } = useSiteSettings();
  const merged = useMemo(
    () => ({ ...(FALLBACK_SETTINGS[key] ?? {}), ...(settings?.[key] ?? {}) }),
    [settings, key],
  );
  const [draft, setDraft] = useState<Record<string, unknown>>(merged);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setAdminDirty("settings:" + key, dirty);
    return () => setAdminDirty("settings:" + key, false);
  }, [dirty, key]);

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
    try {
      await saveAdminSetting({ data: { key, value: draft } });
      toast.success(`Saved ${key}`);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
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
  return v === undefined || v === null ? fb : (v as T);
}

// ============================================================================
// SITE CONTENT (Home: hero, manifesto, clients_section, services_section, cta_home, footer, navbar)
// ============================================================================
function SiteContentManager() {
  return (
    <div>
      <header>
        <h2 className="display text-2xl text-metal">Site content</h2>
        <p className="text-sm text-slate-500 mt-1">
          Edit the homepage and shared layout sections. Changes go live immediately.
        </p>
      </header>

      <HeroEditor />
      <ManifestoEditor />
      <SectionLabelEditor
        sectionKey="clients_section"
        title="Clients section"
        fields={["eyebrow", "title", "subtitle"]}
        multiline={["title", "subtitle"]}
      />
      <SectionLabelEditor
        sectionKey="services_section"
        title="Services section"
        fields={["eyebrow", "title", "sidebar"]}
        multiline={["title"]}
      />
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
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">
            Restore default
          </button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Top left badge">
          <TextInput
            value={get(s.draft, "top_left", "")}
            onChange={(e) => s.update("top_left", e.target.value)}
          />
        </Field>
        <Field label="Top right badge">
          <TextInput
            value={get(s.draft, "top_right", "")}
            onChange={(e) => s.update("top_right", e.target.value)}
          />
        </Field>
        <Field label="Eyebrow">
          <TextInput
            value={get(s.draft, "eyebrow", "")}
            onChange={(e) => s.update("eyebrow", e.target.value)}
          />
        </Field>
        <Field label="Year">
          <TextInput
            value={get(s.draft, "year", "")}
            onChange={(e) => s.update("year", e.target.value)}
          />
        </Field>
        <Field label="Title - line 1">
          <TextInput
            value={get(s.draft, "title_1", "")}
            onChange={(e) => s.update("title_1", e.target.value)}
          />
        </Field>
        <Field label="Title - line 2">
          <TextInput
            value={get(s.draft, "title_2", "")}
            onChange={(e) => s.update("title_2", e.target.value)}
          />
        </Field>
        <Field label="Title - accent (italic)">
          <TextInput
            value={get(s.draft, "title_accent", "")}
            onChange={(e) => s.update("title_accent", e.target.value)}
          />
        </Field>
        <Field label="Status">
          <TextInput
            value={get(s.draft, "status", "")}
            onChange={(e) => s.update("status", e.target.value)}
          />
        </Field>
        <Field label="Subtitle" hint="Short paragraph below the headline.">
          <TextArea
            rows={4}
            value={get(s.draft, "subtitle", "")}
            onChange={(e) => s.update("subtitle", e.target.value)}
          />
        </Field>
        <Field label="CTA primary">
          <TextInput
            value={get(s.draft, "cta_primary", "")}
            onChange={(e) => s.update("cta_primary", e.target.value)}
          />
        </Field>
        <Field label="CTA secondary">
          <TextInput
            value={get(s.draft, "cta_secondary", "")}
            onChange={(e) => s.update("cta_secondary", e.target.value)}
          />
        </Field>
        <Field label="Status label">
          <TextInput
            value={get(s.draft, "status_label", "")}
            onChange={(e) => s.update("status_label", e.target.value)}
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={get(s.draft, "location", "")}
            onChange={(e) => s.update("location", e.target.value)}
          />
        </Field>
        <Field label="Disciplines (comma separated)" hint="Shown in the right side panel.">
          <TextInput
            value={get<string[]>(s.draft, "disciplines", []).join(", ")}
            onChange={(e) =>
              s.update(
                "disciplines",
                e.target.value
                  .split(",")
                  .map((x) => x.trim())
                  .filter(Boolean),
              )
            }
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
      footer={
        <>
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">
            Restore default
          </button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow">
          <TextInput
            value={get(s.draft, "eyebrow", "")}
            onChange={(e) => s.update("eyebrow", e.target.value)}
          />
        </Field>
        <Field label="Sidebar text">
          <TextInput
            value={get(s.draft, "sidebar", "")}
            onChange={(e) => s.update("sidebar", e.target.value)}
          />
        </Field>
        <Field label="Title - line 1">
          <TextInput
            value={get(s.draft, "title_1", "")}
            onChange={(e) => s.update("title_1", e.target.value)}
          />
        </Field>
        <Field label="Title - accent">
          <TextInput
            value={get(s.draft, "title_accent", "")}
            onChange={(e) => s.update("title_accent", e.target.value)}
          />
        </Field>
        <Field label="Title - line 2">
          <TextInput
            value={get(s.draft, "title_2", "")}
            onChange={(e) => s.update("title_2", e.target.value)}
          />
        </Field>
        <Field label="Title - muted">
          <TextInput
            value={get(s.draft, "title_muted", "")}
            onChange={(e) => s.update("title_muted", e.target.value)}
          />
        </Field>
        <Field label="Paragraph 1">
          <TextArea
            rows={4}
            value={get(s.draft, "col1", "")}
            onChange={(e) => s.update("col1", e.target.value)}
          />
        </Field>
        <Field label="Paragraph 2">
          <TextArea
            rows={4}
            value={get(s.draft, "col2", "")}
            onChange={(e) => s.update("col2", e.target.value)}
          />
        </Field>
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
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2"
            >
              <input
                className="adm-input col-span-3"
                placeholder="Meta (e.g. 01 / Strategy)"
                value={p.meta}
                onChange={(e) => {
                  const n = [...principles];
                  n[i] = { ...p, meta: e.target.value };
                  setPrinciples(n);
                }}
              />
              <input
                className="adm-input col-span-3"
                placeholder="Key"
                value={p.key}
                onChange={(e) => {
                  const n = [...principles];
                  n[i] = { ...p, key: e.target.value };
                  setPrinciples(n);
                }}
              />
              <input
                className="adm-input col-span-5"
                placeholder="Value"
                value={p.value}
                onChange={(e) => {
                  const n = [...principles];
                  n[i] = { ...p, value: e.target.value };
                  setPrinciples(n);
                }}
              />
              <button
                onClick={() => setPrinciples(principles.filter((_, j) => j !== i))}
                className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function SectionLabelEditor({
  sectionKey,
  title,
  fields,
  multiline = [],
}: {
  sectionKey: string;
  title: string;
  fields: string[];
  multiline?: string[];
}) {
  const s = useSectionDraft(sectionKey);
  return (
    <SectionCard
      title={title}
      footer={
        <>
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">
            Restore default
          </button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <Field key={f} label={f.replace(/_/g, " ")}>
            {multiline.includes(f) ? (
              <TextArea
                rows={3}
                value={get(s.draft, f, "")}
                onChange={(e) => s.update(f, e.target.value)}
              />
            ) : (
              <TextInput
                value={get(s.draft, f, "")}
                onChange={(e) => s.update(f, e.target.value)}
              />
            )}
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
      footer={
        <>
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">
            Restore default
          </button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow">
          <TextInput
            value={get(s.draft, "eyebrow", "")}
            onChange={(e) => s.update("eyebrow", e.target.value)}
          />
        </Field>
        <Field label="Title - line 1">
          <TextInput
            value={get(s.draft, "title_1", "")}
            onChange={(e) => s.update("title_1", e.target.value)}
          />
        </Field>
        <Field label="Title - accent">
          <TextInput
            value={get(s.draft, "title_accent", "")}
            onChange={(e) => s.update("title_accent", e.target.value)}
          />
        </Field>
        <Field label="Primary CTA">
          <TextInput
            value={get(s.draft, "cta_primary", "")}
            onChange={(e) => s.update("cta_primary", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={get(s.draft, "email", "")}
            onChange={(e) => s.update("email", e.target.value)}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

function NavbarEditor() {
  const s = useSectionDraft("navbar");
  return (
    <SectionCard title="Navbar" footer={<SaveButton saving={s.saving} onClick={s.save} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Brand">
          <TextInput
            value={get(s.draft, "brand", "")}
            onChange={(e) => s.update("brand", e.target.value)}
          />
        </Field>
        <Field label="CTA label">
          <TextInput
            value={get(s.draft, "cta", "")}
            onChange={(e) => s.update("cta", e.target.value)}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

function FooterEditor() {
  const s = useSectionDraft("footer");
  return (
    <SectionCard
      title="Footer"
      footer={
        <>
          <button onClick={s.restore} className="text-xs text-slate-500 hover:text-white px-3 py-2">
            Restore default
          </button>
          <SaveButton saving={s.saving} onClick={s.save} />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Eyebrow">
          <TextInput
            value={get(s.draft, "eyebrow", "")}
            onChange={(e) => s.update("eyebrow", e.target.value)}
          />
        </Field>
        <Field label="Title - line 1">
          <TextInput
            value={get(s.draft, "title_1", "")}
            onChange={(e) => s.update("title_1", e.target.value)}
          />
        </Field>
        <Field label="Title - line 2">
          <TextInput
            value={get(s.draft, "title_2", "")}
            onChange={(e) => s.update("title_2", e.target.value)}
          />
        </Field>
        <Field label="CTA label">
          <TextInput
            value={get(s.draft, "cta", "")}
            onChange={(e) => s.update("cta", e.target.value)}
          />
        </Field>
        <Field label="Email">
          <TextInput
            type="email"
            value={get(s.draft, "email", "")}
            onChange={(e) => s.update("email", e.target.value)}
          />
        </Field>
        <Field label="Phone">
          <TextInput
            value={get(s.draft, "phone", "")}
            onChange={(e) => s.update("phone", e.target.value)}
          />
        </Field>
        <Field label="Location">
          <TextInput
            value={get(s.draft, "location", "")}
            onChange={(e) => s.update("location", e.target.value)}
          />
        </Field>
        <Field label="Copyright text">
          <TextInput
            value={get(s.draft, "copyright", "")}
            onChange={(e) => s.update("copyright", e.target.value)}
          />
        </Field>
      </div>
    </SectionCard>
  );
}

function SocialEditor() {
  const s = useSectionDraft("social");
  return (
    <SectionCard title="Social links" footer={<SaveButton saving={s.saving} onClick={s.save} />}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Instagram URL">
          <TextInput
            value={get(s.draft, "instagram", "")}
            onChange={(e) => s.update("instagram", e.target.value)}
          />
        </Field>
        <Field label="LinkedIn URL">
          <TextInput
            value={get(s.draft, "linkedin", "")}
            onChange={(e) => s.update("linkedin", e.target.value)}
          />
        </Field>
        <Field label="Facebook URL">
          <TextInput
            value={get(s.draft, "facebook", "")}
            onChange={(e) => s.update("facebook", e.target.value)}
          />
        </Field>
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
        <p className="text-sm text-slate-500 mt-1">
          Bio, contact, experience, skills and selected brands shown on /about.
        </p>
      </header>

      <SectionCard
        title="Headline & bio"
        footer={
          <>
            <button
              onClick={s.restore}
              className="text-xs text-slate-500 hover:text-white px-3 py-2"
            >
              Restore default
            </button>
            <SaveButton saving={s.saving} onClick={s.save} />
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <TextInput
              value={get(s.draft, "eyebrow", "")}
              onChange={(e) => s.update("eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Top right tag">
            <TextInput
              value={get(s.draft, "top_right", "")}
              onChange={(e) => s.update("top_right", e.target.value)}
            />
          </Field>
          <Field label="Title - line 1">
            <TextInput
              value={get(s.draft, "title_1", "")}
              onChange={(e) => s.update("title_1", e.target.value)}
            />
          </Field>
          <Field label="Title - accent">
            <TextInput
              value={get(s.draft, "title_accent", "")}
              onChange={(e) => s.update("title_accent", e.target.value)}
            />
          </Field>
          <Field label="Bio paragraph 1">
            <TextArea
              rows={4}
              value={get(s.draft, "bio_p1", "")}
              onChange={(e) => s.update("bio_p1", e.target.value)}
            />
          </Field>
          <Field label="Bio paragraph 2">
            <TextArea
              rows={4}
              value={get(s.draft, "bio_p2", "")}
              onChange={(e) => s.update("bio_p2", e.target.value)}
            />
          </Field>
          <Field label="Bio paragraph 3">
            <TextArea
              rows={4}
              value={get(s.draft, "bio_p3", "")}
              onChange={(e) => s.update("bio_p3", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Email">
            <TextInput
              type="email"
              value={get(s.draft, "email", "")}
              onChange={(e) => s.update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={get(s.draft, "phone", "")}
              onChange={(e) => s.update("phone", e.target.value)}
            />
          </Field>
          <Field label="Location">
            <TextInput
              value={get(s.draft, "location", "")}
              onChange={(e) => s.update("location", e.target.value)}
            />
          </Field>
        </div>

        {/* Experience */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="mono text-[10px] tracking-[0.2em] text-slate-500">EXPERIENCE</div>
            <button
              onClick={() =>
                s.update("experience", [...experience, { role: "", company: "", period: "" }])
              }
              className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {experience.map((x, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2"
              >
                <input
                  className="adm-input col-span-4"
                  placeholder="Role"
                  value={x.role}
                  onChange={(e) => {
                    const n = [...experience];
                    n[i] = { ...x, role: e.target.value };
                    s.update("experience", n);
                  }}
                />
                <input
                  className="adm-input col-span-4"
                  placeholder="Company"
                  value={x.company}
                  onChange={(e) => {
                    const n = [...experience];
                    n[i] = { ...x, company: e.target.value };
                    s.update("experience", n);
                  }}
                />
                <input
                  className="adm-input col-span-3"
                  placeholder="Period"
                  value={x.period}
                  onChange={(e) => {
                    const n = [...experience];
                    n[i] = { ...x, period: e.target.value };
                    s.update("experience", n);
                  }}
                />
                <button
                  onClick={() =>
                    s.update(
                      "experience",
                      experience.filter((_, j) => j !== i),
                    )
                  }
                  className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div className="mono text-[10px] tracking-[0.2em] text-slate-500">SKILLS</div>
            <button
              onClick={() => s.update("skills", [...skills, { name: "", value: 50 }])}
              className="text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {skills.map((sk, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2"
              >
                <input
                  className="adm-input col-span-7"
                  placeholder="Skill"
                  value={sk.name}
                  onChange={(e) => {
                    const n = [...skills];
                    n[i] = { ...sk, name: e.target.value };
                    s.update("skills", n);
                  }}
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="adm-input col-span-3"
                  value={sk.value}
                  onChange={(e) => {
                    const n = [...skills];
                    n[i] = {
                      ...sk,
                      value: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                    };
                    s.update("skills", n);
                  }}
                />
                <span className="col-span-1 text-xs text-slate-500">%</span>
                <button
                  onClick={() =>
                    s.update(
                      "skills",
                      skills.filter((_, j) => j !== i),
                    )
                  }
                  className="col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mt-8">
          <Field label="Selected brands (comma separated)" hint="Names shown in the brands list.">
            <TextArea
              rows={3}
              value={brands.join(", ")}
              onChange={(e) =>
                s.update(
                  "brands",
                  e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
            />
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
        <p className="text-sm text-slate-500 mt-1">
          Headline, status, contact details and form options.
        </p>
      </header>
      <SectionCard
        title="Contact content"
        footer={
          <>
            <button
              onClick={s.restore}
              className="text-xs text-slate-500 hover:text-white px-3 py-2"
            >
              Restore default
            </button>
            <SaveButton saving={s.saving} onClick={s.save} />
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow">
            <TextInput
              value={get(s.draft, "eyebrow", "")}
              onChange={(e) => s.update("eyebrow", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <TextInput
              value={get(s.draft, "status", "")}
              onChange={(e) => s.update("status", e.target.value)}
            />
          </Field>
          <Field label="Title - line 1">
            <TextInput
              value={get(s.draft, "title_1", "")}
              onChange={(e) => s.update("title_1", e.target.value)}
            />
          </Field>
          <Field label="Title - accent">
            <TextInput
              value={get(s.draft, "title_accent", "")}
              onChange={(e) => s.update("title_accent", e.target.value)}
            />
          </Field>
          <Field label="Subtitle">
            <TextArea
              rows={3}
              value={get(s.draft, "subtitle", "")}
              onChange={(e) => s.update("subtitle", e.target.value)}
            />
          </Field>
          <Field label="Email">
            <TextInput
              type="email"
              value={get(s.draft, "email", "")}
              onChange={(e) => s.update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={get(s.draft, "phone", "")}
              onChange={(e) => s.update("phone", e.target.value)}
            />
          </Field>
          <Field label="Location">
            <TextInput
              value={get(s.draft, "location", "")}
              onChange={(e) => s.update("location", e.target.value)}
            />
          </Field>
          <Field label="Project types (comma separated)">
            <TextInput
              value={projectTypes.join(", ")}
              onChange={(e) =>
                s.update(
                  "project_types",
                  e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="Budgets (comma separated)">
            <TextInput
              value={budgets.join(", ")}
              onChange={(e) =>
                s.update(
                  "budgets",
                  e.target.value
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================================
// CLIENTS / STUDIOS (shared logo manager)
// ============================================================================
function LogoManager({
  kind,
  title,
  description,
  addLabel,
  maxItems,
}: {
  kind: "client" | "studio";
  title: string;
  description: string;
  addLabel: string;
  maxItems?: number;
}) {
  const qc = useQueryClient();
  const saveClient = useServerFn(saveAdminClient);
  const createClient = useServerFn(createAdminClient);
  const prepareMediaUpload = useServerFn(prepareAdminMediaUpload);
  const deleteClient = useServerFn(deleteAdminClient);
  const { data: items = [] } = useClients(true, kind);
  const [busyId, setBusyId] = useState<string | null>(null);

  const labelOf = (id: string) => items.find((c) => c.id === id)?.name ?? id;

  const update = async (id: string, patch: Partial<DbClient>) => {
    setBusyId(id);
    const safeId = isUuid(id) ? id : generateUuid();
    const currentItem = items.find((c) => c.id === id);
    try {
      await saveClient({
        data: {
          id: safeId,
          name: currentItem?.name ?? `New ${kind}`,
          sort_order: currentItem?.sort_order ?? 1,
          is_active: currentItem?.is_active ?? true,
          kind,
          website_url: currentItem?.website_url ?? null,
          logo_url: currentItem?.logo_url ?? null,
          logo_width: currentItem?.logo_width ?? null,
          logo_height: currentItem?.logo_height ?? null,
          ...patch,
        },
      });
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setBusyId(null);
    }
  };

  const create = async () => {
    if (maxItems && items.length >= maxItems) {
      toast.error(`Maximum of ${maxItems} ${kind}s reached.`);
      return;
    }
    const max = items.reduce((m, c) => Math.max(m, c.sort_order), 0);
    try {
      await createClient({
        data: { name: `New ${kind}`, sort_order: max + 1, is_active: true, kind },
      });
      toast.success(`${kind === "client" ? "Client" : "Studio"} added`);
      qc.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Create failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm(`Delete this ${kind}?`)) return;
    if (!isUuid(id)) return;
    try {
      await deleteClient({ data: { id } });
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  };

  const uploadLogo = async (id: string, file: File) => {
    setBusyId(id);
    try {
      const safeId = isUuid(id) ? id : generateUuid();
      const dims = await readImageDimensions(file).catch(() => null);
      const up = await prepareMediaUpload({
        data: {
          entity_id: isUuid(id) ? id : safeId,
          kind: "logo",
          filename: file.name,
          content_type: file.type,
          size_bytes: file.size,
        },
      });
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .uploadToSignedUrl(up.path, up.token, file);
      if (upErr) throw upErr;
      const patch: Partial<DbClient> = { logo_url: up.publicUrl };
      if (dims) {
        patch.logo_width = dims.width;
        patch.logo_height = dims.height;
      }
      await update(id, patch);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const canAdd = !maxItems || items.length < maxItems;

  return (
    <div>
      <header className="flex items-start justify-between">
        <div>
          <h2 className="display text-2xl text-metal">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
        <button
          onClick={create}
          disabled={!canAdd}
          className="inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={14} /> {addLabel}
        </button>
      </header>

      <div className="mt-6 space-y-3">
        {items.length === 0 && (
          <div className="text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center">
            No {kind}s yet. Click "{addLabel}".
          </div>
        )}
        {items.map((c) => (
          <div
            key={c.id}
            className="grid grid-cols-12 gap-3 items-center bg-[#030814] border border-white/[0.08] rounded p-3"
          >
            <div className="col-span-2 grid place-items-center h-16 bg-[#01040A] border border-white/[0.06] rounded p-2">
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="max-h-12 max-w-full object-contain" />
              ) : (
                <ImageIcon size={16} className="text-slate-600" />
              )}
            </div>
            <div className="col-span-3">
              <input
                className="adm-input"
                placeholder="Name"
                defaultValue={c.name}
                onBlur={(e) => e.target.value !== c.name && update(c.id, { name: e.target.value })}
              />
            </div>
            <div className="col-span-3">
              <input
                className="adm-input"
                placeholder="https://..."
                defaultValue={c.website_url ?? ""}
                onBlur={(e) => update(c.id, { website_url: e.target.value || null })}
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                className="adm-input"
                defaultValue={c.sort_order}
                onBlur={(e) => update(c.id, { sort_order: Number(e.target.value) || 0 })}
              />
            </div>
            <label className="col-span-2 inline-flex items-center gap-2 text-xs text-slate-300 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-sky-300/40">
              <Upload size={13} /> {c.logo_url ? "Replace logo" : "Upload logo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadLogo(c.id, e.target.files[0])}
              />
            </label>
            <div className="col-span-1 flex items-center justify-end gap-2">
              <button
                onClick={() => update(c.id, { is_active: !c.is_active })}
                className="text-slate-400 hover:text-white"
                title={c.is_active ? "Visible" : "Hidden"}
              >
                {c.is_active ? <Eye size={14} /> : <EyeOff size={14} className="text-slate-600" />}
              </button>
              <button onClick={() => remove(c.id)} className="text-slate-500 hover:text-red-300">
                {busyId === c.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsManager() {
  return (
    <LogoManager
      kind="client"
      title="Clients"
      description="Logos appear on the homepage strip in real time. Logos preserve their natural proportion."
      addLabel="Add client"
    />
  );
}

const STUDIO_SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: "xs", label: "Extra small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra large" },
  { value: "xxl", label: "Huge" },
];

function StudiosManager() {
  const s = useSectionDraft("studios_section");
  const current = get<string>(s.draft, "logo_size", "md");
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/[0.08] bg-[#0a0d14] p-5">
        <div className="flex flex-col md:flex-row md:items-end gap-4 md:justify-between">
          <div>
            <h3 className="display text-lg text-metal">Studio logo size</h3>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Applies to all logos in the “Forged across the studios of” row. Updates the public
              site in real time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={current}
              onChange={(e) => s.update("logo_size", e.target.value)}
              className="bg-[#01040A] border border-white/[0.12] rounded px-3 py-2 text-sm text-metal"
            >
              {STUDIO_SIZE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={s.save}
              disabled={!s.dirty || s.saving}
              className="inline-flex items-center gap-2 bg-sky-300/90 hover:bg-sky-300 text-[#01040A] px-3 py-2 rounded text-sm disabled:opacity-40"
            >
              {s.saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save
            </button>
          </div>
        </div>
      </div>
      <LogoManager
        kind="studio"
        title="Studios"
        description='Logos shown under "Forged across the studios of" on the homepage. Maximum of 3.'
        addLabel="Add studio"
        maxItems={3}
      />
    </div>
  );
}

// ============================================================================
// PORTFOLIO
// ============================================================================
// Categories come from src/lib/cms.ts (PROJECT_CATEGORIES).

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
        <p className="text-sm text-slate-500 mt-1">
          Raw JSON editing for every setting key. Use only if you know the schema.
        </p>
      </header>

      <div className="mt-6 space-y-2">
        {keys.map((k) => {
          const merged = { ...(FALLBACK_SETTINGS[k] ?? {}), ...(settings?.[k] ?? {}) };
          const isOpen = open === k;
          return (
            <div key={k} className="bg-[#030814] border border-white/[0.08] rounded">
              <button
                onClick={() => setOpen(isOpen ? null : k)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="font-mono text-sm text-slate-200">{k}</div>
                {isOpen ? (
                  <ChevronDown size={14} className="text-slate-500" />
                ) : (
                  <ChevronRight size={14} className="text-slate-500" />
                )}
              </button>
              {isOpen && <RawEditor sectionKey={k} initial={merged} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RawEditor({
  sectionKey,
  initial,
}: {
  sectionKey: string;
  initial: Record<string, unknown>;
}) {
  const [text, setText] = useState(JSON.stringify(initial, null, 2));
  const [saving, setSaving] = useState(false);
  const saveAdminSetting = useServerFn(saveAdminSiteSetting);

  const save = async () => {
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      toast.error("Invalid JSON");
      return;
    }
    setSaving(true);
    try {
      await saveAdminSetting({ data: { key: sectionKey, value: parsed } });
      toast.success(`Saved ${sectionKey}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setSaving(false);
    }
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

// ============================================================================
// INVOICE SETTINGS (branding + payment details for proforma invoices)
// ============================================================================
function InvoiceSettingsEditor() {
  const s = useSectionDraft("invoice_settings");
  const field = (
    key: string,
    label: string,
    placeholder = "",
    type: "text" | "color" | "textarea" = "text",
  ) => {
    const value = get<string>(s.draft, key, "");
    return (
      <label className="block">
        <span className="mono text-[10px] tracking-[0.2em] text-slate-500">{label}</span>
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => s.update(key, e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full mt-1 bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
          />
        ) : type === "color" ? (
          <div className="mt-1 flex items-center gap-2">
            <input
              type="color"
              value={value || "#48A0E0"}
              onChange={(e) => s.update(key, e.target.value)}
              className="h-9 w-14 rounded border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              value={value}
              onChange={(e) => s.update(key, e.target.value)}
              placeholder="#48A0E0"
              className="flex-1 bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
            />
          </div>
        ) : (
          <input
            value={value}
            onChange={(e) => s.update(key, e.target.value)}
            placeholder={placeholder}
            className="w-full mt-1 bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50"
          />
        )}
      </label>
    );
  };

  return (
    <div>
      <header className="mb-6">
        <h2 className="display text-2xl text-metal">Invoicing</h2>
        <p className="text-sm text-slate-500 mt-1">
          Branding, header/footer, legal text and payment details used in proforma invoices &amp;
          the client portal.
        </p>
      </header>

      <section className="bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">Identity</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {field("studio_name", "STUDIO NAME", "Edmundo Kutuzov")}
          {field("studio_email", "CONTACT EMAIL", "contact@…")}
          {field("studio_address", "ADDRESS", "Rua …, Maputo")}
          {field("studio_tax_id", "TAX ID (NUIT)", "")}
          {field("logo_url", "LOGO URL (PNG/JPG)", "https://…")}
          {field("brand_color", "BRAND COLOR", "#48A0E0", "color")}
        </div>
      </section>

      <section className="bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">Header &amp; footer</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {field("header_label", "HEADER LABEL", "PROFORMA INVOICE")}
          {field("footer_note", "FOOTER NOTE", "Art Director")}
        </div>
        <div className="mt-4">
          {field("legal_text", "LEGAL TEXT / TERMS", "This is a proforma invoice — …", "textarea")}
        </div>
      </section>

      <section className="bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4">
        <h3 className="text-sm font-semibold text-slate-100 mb-4">Payment details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {field("bank_name", "BANK NAME")}
          {field("bank_account_name", "ACCOUNT NAME")}
          {field("bank_iban", "IBAN")}
          {field("bank_swift", "SWIFT / BIC")}
          {field("mpesa_number", "M-PESA NUMBER")}
        </div>
        <div className="mt-4">
          {field("payment_terms", "PAYMENT TERMS", "Payment within 14 days …", "textarea")}
        </div>
      </section>

      <div className="flex justify-end gap-2">
        <button
          onClick={s.restore}
          className="text-[12px] text-slate-400 hover:text-slate-100 px-3 py-2"
        >
          Restore defaults
        </button>
        <SaveButton saving={s.saving} onClick={s.save} />
      </div>
    </div>
  );
}
