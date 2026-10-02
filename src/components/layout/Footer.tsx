import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { FALLBACK_NAVIGATION, readSetting, SITE_EMAIL } from "@/lib/cms";

function getNavigation(raw: unknown) {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const parsed = raw.map((item, index) => {
    if (!item || typeof item !== "object") return null;
    const row = item as Record<string, unknown>;
    return {
      id: typeof row.id === "string" ? row.id : "footer-" + String(index),
      label: typeof row.label === "string" ? row.label : "",
      route: typeof row.route === "string" ? row.route : "/",
      order: typeof row.order === "number" ? row.order : index + 1,
      visible: row.visible !== false,
      external: row.external === true,
      cta: row.cta === true,
    };
  }).filter(Boolean).filter((item) => item && item.label && item.visible && !item.cta) as typeof FALLBACK_NAVIGATION;
  return parsed.length ? parsed.sort((a, b) => a.order - b.order) : FALLBACK_NAVIGATION.filter((item) => !item.cta);
}

export function Footer() {
  const { data: settings } = useSiteSettings();
  const navigation = useMemo(() => getNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)), [settings]);
  const footer = <T,>(field: string, fallback: T) => readSetting<T>(settings, "footer", field, fallback);
  const social = <T,>(field: string, fallback: T) => readSetting<T>(settings, "social", field, fallback);
  const email = String(readSetting(settings, "global", "email", footer("email", SITE_EMAIL)));
  const copyright = String(readSetting(settings, "global", "copyright", "Edmundo Kutuzov. All rights reserved."));

  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)]">
      <div className="mx-auto w-full max-w-[var(--width-standard)] px-4 py-16 md:px-8 md:py-24">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Edmundo Kutuzov · Art Director</p>
            <h2 className="display mt-5 max-w-3xl text-4xl leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)] md:text-6xl">
              {footer("title_1", "Available for")}{" "}
              <span className="text-[var(--color-text-muted)]">{footer("title_2", "projects.")}</span>
            </h2>
            <a href={"mailto:" + email} className="mono mt-8 inline-block text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-primary)] underline underline-offset-4">{email}</a>
          </div>
          <div className="grid grid-cols-2 gap-8 md:justify-self-end">
            <div>
              <p className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Navigation</p>
              <ul className="space-y-3">
                {navigation.map((item) => item.external
                  ? <li key={item.id}><a href={item.route} target="_blank" rel="noreferrer" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{item.label}</a></li>
                  : <li key={item.id}><Link to={item.route as never} className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{item.label}</Link></li>
                )}
              </ul>
            </div>
            <div>
              <p className="mono mb-4 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Socials</p>
              <ul className="space-y-3">
                {["instagram", "linkedin", "facebook"].map((key) => <li key={key}><a href={String(social(key, "#"))} target="_blank" rel="noreferrer" className="text-sm capitalize text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]">{key}</a></li>)}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[var(--color-border-subtle)] pt-5 md:flex-row">
          <p className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">© {new Date().getFullYear()} {copyright}</p>
          <p className="mono text-[9px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Maputo, Mozambique</p>
        </div>
      </div>
    </footer>
  );
}
