import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { motion, LayoutGroup } from "framer-motion";
import logoUrl from "@/assets/logo.webp";
import { ShinyButton } from "@/components/ui/shiny-button";
import { FALLBACK_NAVIGATION, readSetting, type NavigationItem } from "@/lib/cms";
import { useSiteSettings } from "@/hooks/useSiteData";

function normalizeNavigation(raw: unknown): NavigationItem[] {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const items = raw.map((item, index) => {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const label = typeof row.label === "string" ? row.label.trim() : "";
    const route = typeof row.route === "string" ? row.route.trim() : "";
    if (!label || !route) return null;
    return {
      id: typeof row.id === "string" && row.id ? row.id : "nav-" + String(index + 1),
      label,
      route,
      order: typeof row.order === "number" ? row.order : index + 1,
      visible: row.visible !== false,
      external: row.external === true,
      cta: row.cta === true,
    } as NavigationItem;
  }).filter(Boolean) as NavigationItem[];
  return items.length ? items.sort((a, b) => a.order - b.order) : FALLBACK_NAVIGATION;
}

function isExternal(item: NavigationItem) {
  return item.external || /^https?:\/\//i.test(item.route);
}

function InternalLink({ item, children, className }: { item: NavigationItem; children: ReactNode; className?: string }) {
  return <Link to={item.route as never} className={className}>{children}</Link>;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: settings } = useSiteSettings();
  const items = useMemo(
    () => normalizeNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)),
    [settings],
  );
  const globalName = readSetting(settings, "global", "site_name", "Edmundo Kutuzov");
  const brand = readSetting(settings, "navbar", "brand", readSetting(settings, "navbar", "subtitle", "Art Director"));
  const ctaFallback = readSetting(settings, "navbar", "cta", "Start a project");
  const visibleLinks = items.filter((item) => item.visible && !item.cta);
  const cta = items.find((item) => item.visible && item.cta);
  const studioActive = pathname === "/studio" || pathname.startsWith("/studio/");

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="fixed inset-x-0 top-4 z-[1000] px-4" style={{ isolation: "isolate" }}>
      <div className="mx-auto max-w-[var(--width-wide)]">
        <nav className="relative z-[1000] flex items-center justify-between rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/70 py-2 pl-4 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-500 hover:bg-[var(--color-surface)]/90" aria-label="Main navigation">
          <Link to="/" className="group flex items-center gap-3 pl-1 focus:outline-none" aria-label={String(globalName) + " - home"}>
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[var(--color-border-base)] bg-white/[0.02] transition duration-300 group-hover:border-[var(--color-accent-subtle)] group-hover:bg-[var(--color-accent-subtle)]">
              <img src={logoUrl} alt={String(globalName) + " logo"} width={24} height={24} className="h-6 w-6 object-contain" />
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="display text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">{String(globalName)}</span>
              <span className="mono mt-1 text-[9px] tracking-[0.2em] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent-hover)]">{String(brand)}</span>
            </span>
          </Link>
          <LayoutGroup>
            <ul className="hidden items-center gap-1.5 pr-4 md:flex">
              {visibleLinks.map((item) => {
                const active = !isExternal(item) && (pathname === item.route || (item.route !== "/" && pathname.startsWith(item.route)));
                const content = <><span className="relative z-10">{item.label}</span>{active ? <motion.span layoutId="navActiveIndicator" transition={{ type: "spring", bounce: 0.15, duration: 0.6 }} className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--color-accent-base)] opacity-80" /> : null}</>;
                return <li key={item.id}>{isExternal(item) ? <a href={item.route} target="_blank" rel="noreferrer" className={clsx("relative flex items-center px-3 py-1.5 text-[13px] font-medium transition-colors duration-300", "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>{content}</a> : <InternalLink item={item} className={clsx("relative flex items-center px-3 py-1.5 text-[13px] font-medium transition-colors duration-300", active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>{content}</InternalLink>}</li>;
              })}
            </ul>
          </LayoutGroup>
          <div className="flex items-center gap-2">
            {cta ? (isExternal(cta) ? <a href={cta.route} target="_blank" rel="noreferrer" className="hidden rounded-full bg-[var(--color-text-primary)] px-4 py-2 text-[13px] font-semibold text-[var(--color-bg)] sm:inline-flex">{cta.label}<ArrowUpRight size={14} className="ml-1" /></a> : <ShinyButton to={cta.route as never} className="hidden !px-4 !py-2 !text-[13px] sm:inline-flex">{cta.label}<ArrowUpRight size={14} strokeWidth={2} /></ShinyButton>) : <ShinyButton to="/contact" className="hidden !px-4 !py-2 !text-[13px] sm:inline-flex">{ctaFallback}<ArrowUpRight size={14} strokeWidth={2} /></ShinyButton>}
            <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border-base)] bg-white/[0.02] text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)] focus:outline-none md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}</button>
          </div>
        </nav>
        {open ? <div id="mobile-navigation" className="relative z-[1000] mt-2 overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"><div className="flex flex-col gap-1">
          {items.filter((item) => item.visible).map((item) => isExternal(item) ? <a key={item.id} href={item.route} target="_blank" rel="noreferrer" className="rounded-2xl px-4 py-3 text-[15px] font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-highlight)] hover:text-[var(--color-text-primary)]">{item.label}</a> : item.cta ? <InternalLink key={item.id} item={item} className="mt-1 flex items-center justify-between rounded-2xl bg-[var(--color-text-primary)] px-4 py-3 text-[15px] font-semibold text-[var(--color-bg)]">{item.label}<ArrowUpRight size={15}/></InternalLink> : <InternalLink key={item.id} item={item} className={clsx("rounded-2xl px-4 py-3 text-[15px] font-medium", pathname === item.route || (item.route !== "/" && pathname.startsWith(item.route)) ? "bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-highlight)] hover:text-[var(--color-text-primary)]")}>{item.label}</InternalLink>)}
        </div></div> : null}
      </div>
    </motion.header>
  );
}
