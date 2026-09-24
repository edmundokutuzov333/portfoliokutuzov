import { createLazyFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
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
  AnalyticsCenter,
  UsersRolesCenter,
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
const HistoryManager = lazy(() =>
  import("@/components/admin/HistoryManager").then((module) => ({
    default: module.HistoryManager,
  })),
);
const InvoiceWorkspace = lazy(() =>
  import("@/components/admin/InvoiceWorkspace").then((module) => ({
    default: module.InvoiceWorkspace,
  })),
);
const PortfolioManager = lazy(() =>
  import("@/components/admin/PortfolioModule").then((module) => ({
    default: module.PortfolioManager,
  })),
);
const StudioAdminPage = lazy(() =>
  import("@/components/admin/StudioIntelligenceSurface").then((module) => ({
    default: module.StudioAdminPage,
  })),
);

import {
  getAdminOverviewSnapshot,
  getAdminSystemHealth,
  globalAdminSearch,
  getAdminAuditLogPhase4,
  restoreAdminAuditState,
} from "@/lib/admin.phase4.functions";

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
  Sparkles,
  BarChart3,
  CircleDollarSign,
  RefreshCw,
} from "lucide-react";

export const Route = createLazyFileRoute("/admin")({
  component: ControlRoom,
});

type Section =
  | "overview"
  | "homepage"
  | "navigation"
  | "about"
  | "credentials"
  | "services"
  | "contact"
  | "seo"
  | "availability"
  | "global"
  | "portfolio"
  | "clients"
  | "media"
  | "inbox"
  | "leads"
  | "bookings"
  | "newsletter"
  | "studioWaitlist"
  | "invoices"
  | "payments"
  | "invoiceSettings"
  | "studioOverview"
  | "studioLibrary"
  | "studioGeneration"
  | "studioExports"
  | "studioEmail"
  | "digitalCards"
  | "studioAI"
  | "history"
  | "audit"
  | "analytics"
  | "users"
  | "system"
  | "advanced";

function ControlRoom() {
  useAdminInputStyle();
  const { session, isAdmin, role, loading } = useAdminAuth();
  const [section, setSection] = useState<Section>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [releaseOpen, setReleaseOpen] = useState(false);
  const [dirty, setDirty] = useState(hasAdminDirty());

  useEffect(() => {
    const unsubscribe = subscribeAdminDirty(() => setDirty(hasAdminDirty()));
    return () => {
      unsubscribe();
    };
  }, []);

  const requestSection = (next: string) => {
    const target = next as Section;
    if (!items.some((item) => item.id === target)) {
      toast.error("This Control Room workspace is not available for your role.");
      return;
    }
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
    { id: "navigation" as const, label: "Navigation", group: "WEBSITE", Icon: Menu, roles: ["owner", "admin", "editor"] },
    { id: "about" as const, label: "About", group: "WEBSITE", Icon: UserIcon, roles: ["owner", "admin", "editor"] },
    { id: "credentials" as const, label: "Credentials", group: "WEBSITE", Icon: UserIcon, roles: ["owner", "admin", "editor"] },
    { id: "services" as const, label: "Services", group: "WEBSITE", Icon: Briefcase, roles: ["owner", "admin", "editor"] },
    { id: "contact" as const, label: "Contact", group: "WEBSITE", Icon: Mail, roles: ["owner", "admin", "editor"] },
    { id: "seo" as const, label: "SEO", group: "WEBSITE", Icon: Globe2, roles: ["owner", "admin", "editor"] },
    { id: "availability" as const, label: "Availability", group: "WEBSITE", Icon: Globe2, roles: ["owner", "admin", "editor"] },
    { id: "global" as const, label: "Global Settings", group: "WEBSITE", Icon: Settings2, roles: ["owner", "admin", "editor"] },
    { id: "portfolio" as const, label: "Portfolio", group: "CONTENT", Icon: Briefcase, roles: ["owner", "admin", "editor"] },
    { id: "clients" as const, label: "Clients", group: "CONTENT", Icon: Users, roles: ["owner", "admin", "editor"] },
    { id: "media" as const, label: "Media", group: "CONTENT", Icon: ImageIcon, roles: ["owner", "admin", "editor"] },
    { id: "inbox" as const, label: "Inbox", group: "OPERATIONS", Icon: Inbox, roles: ["owner", "admin", "finance"] },
    { id: "leads" as const, label: "Leads", group: "OPERATIONS", Icon: Users, roles: ["owner", "admin", "finance"] },
    { id: "bookings" as const, label: "Bookings", group: "OPERATIONS", Icon: FileText, roles: ["owner", "admin", "finance"] },
    { id: "newsletter" as const, label: "Newsletter", group: "OPERATIONS", Icon: Mail, roles: ["owner", "admin", "finance"] },
    { id: "studioWaitlist" as const, label: "Studio Waitlist", group: "OPERATIONS", Icon: Sparkles, roles: ["owner", "admin", "finance"] },
    { id: "invoices" as const, label: "Invoices", group: "FINANCE", Icon: FileText, roles: ["owner", "admin", "finance"] },
    { id: "payments" as const, label: "Payments", group: "FINANCE", Icon: CircleDollarSign, roles: ["owner", "admin", "finance"] },
    { id: "invoiceSettings" as const, label: "Invoice settings", group: "FINANCE", Icon: Settings2, roles: ["owner", "admin", "finance"] },
    { id: "studioOverview" as const, label: "Studio Overview", group: "STUDIO", Icon: LayoutDashboard, roles: ["owner", "admin", "editor"] },
    { id: "studioLibrary" as const, label: "Card Library", group: "STUDIO", Icon: ImageIcon, roles: ["owner", "admin", "editor"] },
    { id: "studioGeneration" as const, label: "Generation", group: "STUDIO", Icon: Sparkles, roles: ["owner", "admin", "editor"] },
    { id: "studioExports" as const, label: "Exports", group: "STUDIO", Icon: Upload, roles: ["owner", "admin", "editor"] },
    { id: "studioEmail" as const, label: "Email", group: "STUDIO", Icon: Mail, roles: ["owner", "admin", "editor"] },
    { id: "digitalCards" as const, label: "Digital Cards", group: "STUDIO", Icon: Sparkles, roles: ["owner", "admin", "editor"] },
    { id: "studioAI" as const, label: "AI", group: "STUDIO", Icon: Sparkles, roles: ["owner", "admin", "editor"] },
    { id: "analytics" as const, label: "Analytics", group: "SYSTEM", Icon: BarChart3, roles: ["owner", "admin"] },
    { id: "history" as const, label: "History", group: "SYSTEM", Icon: History, roles: ["owner", "admin", "editor"] },
    { id: "audit" as const, label: "Audit Log", group: "SYSTEM", Icon: History, roles: ["owner", "admin"] },
    { id: "users" as const, label: "Users & Roles", group: "SYSTEM", Icon: Users, roles: ["owner", "admin"] },
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
      {section === "overview" && <ControlRoomOverview onNavigate={requestSection} />}
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
      {section === "availability" && (
        <Phase2WebsiteCMS section="availability" onNavigate={requestSection} />
      )}
      {section === "media" && (
        <Phase2WebsiteCMS section="media" onNavigate={requestSection} />
      )}
      {section === "clients" && <ClientsManager />}
      {section === "portfolio" && <PortfolioManager />}
      {section === "about" && <AboutManager />}
      {section === "contact" && <ContactManager />}
      {section === "inbox" && <InboxHub />}
      {section === "leads" && <Phase3OperationsOS initialTab="leads" />}
      {section === "bookings" && <Phase3OperationsOS initialTab="bookings" />}
      {section === "newsletter" && <Phase3OperationsOS initialTab="audience" audienceMode="newsletter" />}
      {section === "studioWaitlist" && <Phase3OperationsOS initialTab="audience" audienceMode="studio" />}
      {section === "payments" && <Phase3OperationsOS initialTab="finance" financeMode="payments" />}
      {section === "invoices" && (
        <Suspense fallback={<WorkspaceLoader label="Loading invoices workspace..." />}>
          <InvoiceWorkspace />
        </Suspense>
      )}
      {section === "invoiceSettings" && <InvoiceSettingsEditor />}
      {section === "studioOverview" && <StudioAdminPage initialTab="overview" />}
      {section === "studioLibrary" && <StudioAdminPage initialTab="library" />}
      {section === "studioGeneration" && <StudioAdminPage initialTab="generation" />}
      {section === "studioExports" && <StudioAdminPage initialTab="export" />}
      {section === "studioEmail" && <StudioAdminPage initialTab="email" />}
      {section === "digitalCards" && <StudioAdminPage initialTab="digital" />}
      {section === "studioAI" && <StudioAdminPage initialTab="ai" />}
      {section === "history" && <HistoryManager />}
      {section === "audit" && <AuditCenter />}
      {section === "system" && <SystemHealthCenter />}
      {section === "analytics" && <AnalyticsCenter />}
      {section === "users" && <UsersRolesCenter />}
      {section === "advanced" && <AdvancedControlCenter onNavigate={requestSection} />}
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
          onOpenRelease={() => setReleaseOpen(true)}
          onOpenSystem={() => requestSection("system")}
        />

        <Suspense fallback={<WorkspaceLoader label="Loading workspace..." />}>
          {renderContent()}
        </Suspense>

        {releaseOpen ? (
          <div
            className="fixed inset-0 z-[120] flex items-start justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Release management"
          >
            <div className="flex max-h-[calc(100vh-24px)] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#01040A] shadow-2xl sm:max-h-[calc(100vh-48px)]">
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-3 sm:px-6">
                <div>
                  <div className="mono text-[9px] uppercase tracking-[0.22em] text-sky-300/70">Governance</div>
                  <h2 className="display mt-1 text-lg text-metal">Manage releases.</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setReleaseOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.08] text-slate-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
                  aria-label="Close release management"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
                <ReleaseCenter />
              </div>
            </div>
          </div>
        ) : null}
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

function ControlRoomOverview({ onNavigate }: { onNavigate: (section: string) => void }) {
  const load = useServerFn(getAdminOverviewSnapshot);
  const [data, setData] = useState<any>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setBusy(true);
    try {
      const result = (await load({ data: {} })) as { snapshot: Record<string, unknown> };
      setData(result.snapshot);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Control Room overview could not be loaded");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  if (!data) {
    return <WorkspaceLoader label="Loading Control Room overview..." />;
  }

  const financeEntries = Object.entries((data.finance?.outstanding_by_currency ?? {}) as Record<string, number>);
  const recentChanges = (data.recent_changes ?? []) as Array<{ id: string; action: string; entity_type: string; entity_label: string | null; actor_email: string | null; created_at: string }>;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mono text-[10px] uppercase tracking-[0.25em] text-sky-300/70">KUTUZOV CONTROL ROOM</div>
          <h1 className="display mt-1 text-3xl text-metal">Operational overview.</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
            One entry point for site content, release work, operations, finance and system governance.
          </p>
        </div>
        <button type="button" onClick={() => void refresh()} disabled={busy} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-400 hover:text-white disabled:opacity-50">
          <RefreshCw size={12} className={busy ? "animate-spin" : ""} /> Refresh
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewMetric label="Published projects" value={data.projects?.published ?? 0} detail={`${data.projects?.drafts ?? 0} live-independent drafts`} />
        <OverviewMetric label="Release queue" value={data.release?.pending_drafts ?? 0} detail="Drafts waiting in release management" />
        <OverviewMetric label="New leads" value={data.leads?.new ?? 0} detail={data.leads ? `${data.leads.total} total leads` : "Lead access not enabled for this role"} />
        <OverviewMetric label="Pending bookings" value={data.bookings?.pending ?? 0} detail={data.bookings ? `${data.bookings.total} total bookings` : "Booking access not enabled for this role"} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Quick actions</div>
          <h2 className="display mt-1 text-xl text-metal">Move directly into work.</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              ["Edit Homepage", "homepage", Home],
              ["Manage Services", "services", Briefcase],
              ["Open Leads", "leads", Users],
              ["System Health", "system", ShieldCheck],
              ["Manage Media", "media", ImageIcon],
              ["Open Invoices", "invoices", FileText],
            ].map(([label, target, Icon]) => (
              <button key={String(target)} type="button" onClick={() => onNavigate(String(target))} className="inline-flex min-h-11 items-center gap-3 rounded-lg border border-white/[0.07] px-3 text-left text-xs text-slate-400 hover:border-sky-300/25 hover:text-white">
                <Icon size={13} className="text-sky-300" />
                {String(label)}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Finance</div>
          <h2 className="display mt-1 text-xl text-metal">Outstanding invoices.</h2>
          {financeEntries.length ? (
            <div className="mt-4 space-y-2">
              {financeEntries.map(([currency, amount]) => (
                <div key={currency} className="flex items-center justify-between rounded-lg border border-white/[0.06] p-3">
                  <span className="mono text-[10px] text-slate-600">{currency}</span>
                  <span className="text-sm font-medium text-white">{Number(amount).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-600">No finance exposure is available for this role or there are no outstanding invoices.</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Recent changes</div>
            <h2 className="display mt-1 text-xl text-metal">Latest governance events.</h2>
          </div>
          <button type="button" onClick={() => onNavigate("audit")} className="text-[10px] text-sky-300 hover:text-white">Open Audit Center</button>
        </div>
        <div className="mt-4 space-y-2">
          {recentChanges.length ? recentChanges.map((row) => (
            <div key={row.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/[0.06] p-3">
              <span className="inline-flex rounded-full border border-white/[0.08] px-2 py-1 text-[9px] uppercase tracking-wider text-slate-500">{row.action}</span>
              <span className="mono text-[9px] uppercase tracking-wider text-slate-600">{row.entity_type}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-slate-300">{row.entity_label ?? row.entity_type}</span>
              <span className="text-[10px] text-slate-600">{row.actor_email ?? "system"} · {new Date(row.created_at).toLocaleString()}</span>
            </div>
          )) : (
            <p className="text-sm text-slate-600">Recent audit events are available to roles with system audit access.</p>
          )}
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        <button type="button" onClick={() => onNavigate("clients")} className="rounded-xl border border-white/[0.07] bg-[#030814] p-4 text-left hover:border-sky-300/25">
          <Users size={15} className="text-sky-300" />
          <div className="mt-3 text-sm text-white">Clients</div>
          <div className="mt-1 text-[10px] text-slate-600">Identity and relationship management</div>
        </button>
        <button type="button" onClick={() => onNavigate("studioOverview")} className="rounded-xl border border-white/[0.07] bg-[#030814] p-4 text-left hover:border-sky-300/25">
          <Sparkles size={15} className="text-sky-300" />
          <div className="mt-3 text-sm text-white">Studio</div>
          <div className="mt-1 text-[10px] text-slate-600">{data.studio ? `${data.studio.waitlist_active ?? 0} active waitlist records` : "Studio workspace"} </div>
        </button>
        <button type="button" onClick={() => onNavigate("system")} className="rounded-xl border border-white/[0.07] bg-[#030814] p-4 text-left hover:border-sky-300/25">
          <ShieldCheck size={15} className="text-sky-300" />
          <div className="mt-3 text-sm text-white">System Health</div>
          <div className="mt-1 text-[10px] text-slate-600">Provider, database and recovery checks</div>
        </button>
      </div>
    </div>
  );
}

function OverviewMetric({ label, value, detail }: { label: string; value: string | number; detail?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#030814] p-4">
      <div className="text-[10px] uppercase tracking-[0.15em] text-slate-600">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{typeof value === "number" ? value.toLocaleString() : value}</div>
      {detail ? <div className="mt-1 text-[10px] text-slate-600">{detail}</div> : null}
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
function Panel({ kicker, title, children }: { kicker?: string; title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5 md:p-6">{kicker ? <div className="mono text-[9px] uppercase tracking-[0.2em] text-sky-300/60">{kicker}</div> : null}<h3 className="display mt-1 text-lg text-metal">{title}</h3><div className="mt-4">{children}</div></section>;
}

function InvoiceSettingsEditor() {
  const { draft, update, save, saving, dirty } = useSectionDraft("invoice_settings");
  const fields: Array<[string, string, string]> = [
    ["studio_name", "Studio name", "e.g. Edmundo Kutuzov"],
    ["studio_email", "Studio email", "billing email"],
    ["studio_phone", "Studio phone", "phone"],
    ["studio_address", "Studio address", "address"],
    ["studio_tax_id", "Tax ID", "tax or registration number"],
    ["bank_name", "Bank name", "bank"],
    ["bank_account_name", "Account name", "account holder"],
    ["bank_iban", "IBAN", "IBAN"],
    ["bank_swift", "SWIFT", "SWIFT/BIC"],
    ["mpesa_number", "M-Pesa", "payment number"],
    ["payment_terms", "Payment terms", "e.g. Net 15"],
    ["footer_note", "Footer note", "invoice footer"],
    ["legal_text", "Legal text", "legal notice"],
  ];
  return (
    <div className="space-y-6">
      <header>
        <div className="mono text-[10px] uppercase tracking-[0.24em] text-sky-300/70">FINANCE / INVOICE SETTINGS</div>
        <h2 className="display mt-1 text-2xl text-metal">Invoice settings.</h2>
        <p className="mt-2 text-sm text-slate-500">Branding, payment coordinates and legal text used by invoice generation. Changes remain protected by the finance permission boundary.</p>
      </header>
      <Panel title="Billing identity" kicker="Invoice configuration">
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map(([key, label, placeholder]) => (
            <label key={key} className="space-y-2">
              <span className="mono text-[9px] uppercase tracking-[0.18em] text-slate-600">{label}</span>
              <input
                value={String(draft[key] ?? "")}
                onChange={(event) => update(key, event.target.value)}
                placeholder={placeholder}
                className="adm-input"
              />
            </label>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
          <span className="text-xs text-slate-500">{dirty ? "Unsaved changes" : "Saved"}</span>
          <button type="button" onClick={() => void save()} disabled={saving || !dirty} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-300 px-4 text-xs font-semibold text-[#01040A] disabled:opacity-40">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />} Save draft
          </button>
        </div>
      </Panel>
    </div>
  );
}

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
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  useEffect(() => {
    setAdminDirty("settings:" + key, dirty);
    return () => setAdminDirty("settings:" + key, false);
  }, [dirty, key]);

  useEffect(() => {
    if (!dirty && !hasSavedDraft) setDraft(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(merged), hasSavedDraft, dirty]);

  const update = <T,>(field: string, value: T) => {
    setDirty(true);
    setHasSavedDraft(false);
    setDraft((d) => ({ ...d, [field]: value }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveAdminSetting({ data: { key, value: draft } });
      toast.success(`Draft saved for ${key}. Publish it from Release Management.`);
      setHasSavedDraft(true);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save draft");
    } finally {
      setSaving(false);
    }
  };

  const restore = () => {
    setDraft(FALLBACK_SETTINGS[key] ?? {});
    setHasSavedDraft(false);
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
          Edit the homepage and shared layout sections. Saves are staged as drafts and published from Release Management.
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
// ADVANCED - technical operations only
// ============================================================================
function AdvancedControlCenter({ onNavigate }: { onNavigate?: (section: string) => void }) {
  const { session, isAdmin } = useAdminAuth();
  const qc = useQueryClient();
  const systemHealth = useServerFn(getAdminSystemHealth);
  const search = useServerFn(globalAdminSearch);
  const audit = useServerFn(getAdminAuditLogPhase4);
  const restore = useServerFn(restoreAdminAuditState);
  const [health, setHealth] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const runHealth = async () => {
    setBusy(true);
    try {
      const result: any = await systemHealth({ data: {} as never });
      setHealth(result);
      toast.success("Technical integrity check completed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Integrity check failed");
    } finally {
      setBusy(false);
    }
  };

  const loadEvents = async () => {
    try {
      const result: any = await audit({ data: { limit: 25 } as never });
      setEvents(result.rows ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Audit inspection failed");
    }
  };

  const runSearch = async () => {
    const needle = query.trim();
    if (!needle) {
      setResults([]);
      return;
    }
    try {
      const result: any = await search({ data: { query: needle, limit: 20 } as never });
      setResults(result.results ?? []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Diagnostic search failed");
    }
  };

  const invalidateAdminCache = async () => {
    await qc.invalidateQueries();
    toast.success("Admin query cache invalidated");
  };

  const restoreSelected = async () => {
    if (!selectedEvent?.before_data || !selectedEvent?.entity_type || !selectedEvent?.entity_id) return;
    if (!window.confirm("Restore the selected entity to the audited previous state?")) return;
    try {
      await restore({
        data: {
          id: selectedEvent.id,
          entity_type: selectedEvent.entity_type,
          entity_id: selectedEvent.entity_id,
          snapshot: selectedEvent.before_data,
        } as never,
      });
      toast.success("Previous state restored");
      setSelectedEvent(null);
      await loadEvents();
      await invalidateAdminCache();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Recovery operation failed");
    }
  };

  // The command functions are stable server-function wrappers; rerun when admin session changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!session?.access_token || !isAdmin) return;
    void Promise.all([runHealth(), loadEvents()]);
  }, [session?.access_token, isAdmin]);

  return (
    <div className="space-y-6">
      <header>
        <div className="mono text-[10px] uppercase tracking-[0.28em] text-sky-300/80">System / Advanced</div>
        <h2 className="display mt-1 text-2xl text-metal">Technical operations.</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
          Diagnostics, cache recovery, event inspection and controlled restore tooling. Public content is not edited here.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5">
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Integrity</div>
          <h3 className="mt-1 text-sm font-medium text-slate-100">System diagnostics</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">Database, public site and configured providers are checked through the privileged health function.</p>
          <button type="button" onClick={() => void runHealth()} disabled={busy} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-300/25 px-3 text-xs text-sky-200 disabled:opacity-50">
            {busy ? <Loader2 size={13} className="animate-spin" /> : <ShieldCheck size={13} />} Run integrity check
          </button>
          {health ? <div className="mt-4 space-y-2 text-[11px]">{Object.entries(health.providers ?? {}).map(([key, value]: any) => <div key={key} className="flex items-center justify-between gap-3"><span className="text-slate-500">{key}</span><span className={value.status === "healthy" ? "text-emerald-200" : value.status === "warning" ? "text-amber-200" : "text-rose-200"}>{value.status}</span></div>)}</div> : null}
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5">
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Recovery</div>
          <h3 className="mt-1 text-sm font-medium text-slate-100">Cache and state recovery</h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">Invalidate the admin query cache or restore a previously captured audited state.</p>
          <button type="button" onClick={() => void invalidateAdminCache()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-300">Invalidate admin cache</button>
          <div className="mt-4 rounded-lg border border-amber-300/10 bg-amber-300/[0.03] p-3 text-[11px] text-amber-100/70">Restore is deliberately gated by audit snapshots and an explicit confirmation.</div>
          {selectedEvent ? <button type="button" onClick={() => void restoreSelected()} disabled={!selectedEvent.before_data} className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-rose-300/20 px-3 text-xs text-rose-200 disabled:opacity-40">Restore selected snapshot</button> : null}
        </section>

        <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5">
          <div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Diagnostics</div>
          <h3 className="mt-1 text-sm font-medium text-slate-100">Global technical search</h3>
          <div className="mt-3 flex gap-2">
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void runSearch(); }} placeholder="Project, lead, invoice, media..." className="adm-input min-w-0 flex-1" />
            <button type="button" onClick={() => void runSearch()} className="rounded-lg border border-white/[0.08] px-3 text-xs text-slate-300">Search</button>
          </div>
          <div className="mt-3 space-y-2">{results.map((row) => <button type="button" key={row.id} onClick={() => onNavigate?.(row.target)} className="block w-full rounded-lg border border-white/[0.06] p-3 text-left hover:border-sky-300/20"><div className="text-xs text-slate-200">{row.title}</div><div className="mt-1 text-[10px] text-slate-600">{row.type} · {row.subtitle}</div></button>)}</div>
        </section>
      </div>

      <section className="rounded-xl border border-white/[0.08] bg-[#030814] p-5">
        <div className="flex items-center justify-between gap-3">
          <div><div className="mono text-[9px] uppercase tracking-[0.2em] text-slate-600">Event inspection</div><h3 className="mt-1 text-sm font-medium text-slate-100">Recent admin events</h3></div>
          <button type="button" onClick={() => void loadEvents()} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/[0.08] px-3 text-xs text-slate-300"><History size={12} /> Refresh</button>
        </div>
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead><tr className="bg-white/[0.03] mono text-[9px] tracking-[0.14em] text-slate-600"><th className="px-3 py-2">TIME</th><th className="px-3 py-2">ACTION</th><th className="px-3 py-2">ENTITY</th><th className="px-3 py-2">ACTOR</th><th className="px-3 py-2"></th></tr></thead><tbody>{events.map((row:any) => <tr key={row.id} className="border-t border-white/[0.06] text-[11px]"><td className="px-3 py-2 text-slate-500">{new Date(row.created_at).toLocaleString()}</td><td className="px-3 py-2 text-slate-300">{row.action}</td><td className="px-3 py-2 text-slate-400">{row.entity_type} · {row.entity_label ?? row.entity_id}</td><td className="px-3 py-2 text-slate-500">{row.actor_email ?? row.actor_user_id}</td><td className="px-3 py-2 text-right"><button type="button" disabled={!row.before_data} onClick={() => setSelectedEvent(row)} className="rounded border border-white/10 px-2 py-1 disabled:opacity-30">Select</button></td></tr>)}</tbody></table></div>
        {events.length === 0 ? <p className="mt-4 text-xs text-slate-600">No audit events available.</p> : null}
      </section>
    </div>
  );
}