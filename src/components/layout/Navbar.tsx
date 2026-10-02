import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { FALLBACK_NAVIGATION, readSetting, type NavigationItem } from "@/lib/cms";
import { useSiteSettings } from "@/hooks/useSiteData";
import { UI_COPY, localizePath, useSiteLocale, type SiteLocale } from "@/lib/site-locale";

function normalizeNavigation(raw: unknown): NavigationItem[] {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const items = raw.map((item, index) => {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    const label = typeof row.label === "string" ? row.label.trim() : "";
    const route = typeof row.route === "string" ? row.route.trim() : "";
    if (!label || !route) return null;
    return {
      id: typeof row.id === "string" && row.id ? row.id : `nav-${index + 1}`,
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

function ToneBridge({ onTone }: { onTone: (tone: string) => void }) {
  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tone]"));
        let tone = "preto";
        let best = Number.POSITIVE_INFINITY;
        for (const section of sections) {
          const rect = section.getBoundingClientRect();
          const distance = Math.abs(rect.top - 72);
          if (rect.bottom > 72 && distance < best) {
            best = distance;
            tone = section.dataset.tone || "preto";
          }
        }
        onTone(tone);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-tone"] });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [onTone]);
  return null;
}

function InternalNavLink({ to, active, children, onClick }: { to: string; active: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <Link
      to={to as never}
      viewTransition
      onClick={onClick}
      className="ek-nav__item"
      data-active={active ? "true" : "false"}
    >
      {children}
    </Link>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locale = useSiteLocale();
  const copy = UI_COPY[locale];
  const { data: settings } = useSiteSettings();
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState("preto");
  const items = useMemo(
    () => normalizeNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)),
    [settings],
  );
  const publicItems = items.filter((item) => item.visible && !item.cta);
  const cta = items.find((item) => item.visible && item.cta);
  const toggleLocale = (next: SiteLocale) => {
    navigate({ to: localizePath(pathname, next) as never, viewTransition: true }).catch(() => {});
    setOpen(false);
  };

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <ToneBridge onTone={setTone} />
      <header className="ek-global-header" data-tone={tone}>
        <nav className="ek-nav" aria-label={locale === "pt-PT" ? "Navegação principal" : "Main navigation"}>
          <Link to={localizePath("/", locale) as never} viewTransition className="ek-wordmark" aria-label="Edmundo Kutuzov">
            <span className="ek-wordmark__ek">EK.</span>
            <span className="ek-wordmark__name">Edmundo Kutuzov</span>
          </Link>

          <div className="ek-nav__links" aria-label={copy.navigation}>
            {publicItems.map((item) => {
              const path = localizePath(item.route, locale);
              const active = pathname === path || (path !== localizePath("/", locale) && pathname.startsWith(path));
              return item.external ? (
                <a key={item.id} href={item.route} target="_blank" rel="noreferrer" className="ek-nav__item">{item.label}</a>
              ) : (
                <InternalNavLink key={item.id} to={path} active={active}>{item.id === "home" ? copy.home : item.id === "portfolio" ? copy.portfolio : item.id === "credentials" ? copy.credentials : item.id === "services" ? copy.services : item.id === "contact" ? copy.contact : item.id === "studio" ? copy.studio : item.label}</InternalNavLink>
              );
            })}
          </div>

          <div className="flex items-center justify-end">
            {cta ? (
              <Link to={localizePath("/contact", locale) as never} viewTransition className="ek-nav__cta">
                {copy.startProject}
              </Link>
            ) : null}
            <div className="ek-language" aria-label={copy.changeLanguage}>
              <button type="button" data-active={locale === "en" ? "true" : "false"} onClick={() => toggleLocale("en")}>EN</button>
              <button type="button" data-active={locale === "pt-PT" ? "true" : "false"} onClick={() => toggleLocale("pt-PT")}>PT</button>
            </div>
            <button
              type="button"
              className="ek-mobile-toggle ml-3"
              aria-expanded={open}
              aria-controls="ek-mobile-navigation"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? copy.close : copy.menu}
            </button>
          </div>
        </nav>

        {open ? (
          <div id="ek-mobile-navigation" className="ek-mobile-menu">
            {publicItems.map((item) => {
              const path = localizePath(item.route, locale);
              const active = pathname === path || (path !== localizePath("/", locale) && pathname.startsWith(path));
              return item.external ? (
                <a key={item.id} href={item.route} target="_blank" rel="noreferrer">{item.label}</a>
              ) : (
                <InternalNavLink key={item.id} to={path} active={active} onClick={() => setOpen(false)}>
                  {item.id === "home" ? copy.home : item.id === "portfolio" ? copy.portfolio : item.id === "credentials" ? copy.credentials : item.id === "services" ? copy.services : item.id === "contact" ? copy.contact : item.id === "studio" ? copy.studio : item.label}
                </InternalNavLink>
              );
            })}
            <Link to={localizePath("/contact", locale) as never} viewTransition onClick={() => setOpen(false)} className="ek-nav__cta mt-2">
              {copy.startProject}
            </Link>
          </div>
        ) : null}
      </header>
    </>
  );
}
