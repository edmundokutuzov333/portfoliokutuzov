import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: settings } = useSiteSettings();
  const items = useMemo(
    () => normalizeNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)),
    [settings],
  );
  const name = String(readSetting(settings, "global", "site_name", "Edmundo Kutuzov"));
  const brand = String(readSetting(settings, "navbar", "subtitle", "Art Director"));
  const visible = items.filter((item) => item.visible);
  const cta = visible.find((item) => item.cta);
  const links = visible.filter((item) => !item.cta);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="relative z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg)]">
      <nav className="mx-auto flex min-h-20 w-full max-w-[var(--width-wide)] items-center justify-between px-4 py-4 md:px-8" aria-label="Main navigation">
        <Link to="/" className="group flex items-baseline gap-3 text-[var(--color-text-primary)] no-underline">
          <span className="display text-lg font-semibold tracking-[-0.03em]">EK.</span>
          <span className="mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]">{brand}</span>
          <span className="sr-only">{name}</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) => {
            const external = item.external || /^https?:\/\//i.test(item.route);
            const active = !external && (pathname === item.route || (item.route !== "/" && pathname.startsWith(item.route)));
            const className = "mono text-[10px] uppercase tracking-[0.18em] transition-colors " + (active ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]");
            return external
              ? <a key={item.id} href={item.route} target="_blank" rel="noreferrer" className={className}>{item.label}</a>
              : <Link key={item.id} to={item.route as never} className={className}>{item.label}</Link>;
          })}
          <Link to={(cta?.route || "/contact") as never} className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-primary)] underline underline-offset-4">
            {cta?.label || "Start a project"}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center border border-[var(--color-border-base)] text-[var(--color-text-primary)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X size={17} /> : <Menu size={17} />}
        </button>
      </nav>

      {open ? (
        <div id="mobile-navigation" className="border-t border-[var(--color-border-subtle)] px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-[var(--width-wide)] flex-col gap-1">
            {links.map((item) => item.external ? (
              <a key={item.id} href={item.route} target="_blank" rel="noreferrer" className="px-0 py-3 text-sm text-[var(--color-text-secondary)]">{item.label}</a>
            ) : (
              <Link key={item.id} to={item.route as never} className="px-0 py-3 text-sm text-[var(--color-text-secondary)]">{item.label}</Link>
            ))}
            <Link to={(cta?.route || "/contact") as never} className="mt-2 border-t border-[var(--color-border-subtle)] px-0 pt-4 text-sm font-semibold text-[var(--color-text-primary)]">
              {cta?.label || "Start a project"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
