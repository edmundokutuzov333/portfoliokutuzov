import { useEffect, useState } from "react";
import { Globe2 } from "lucide-react";
import { getSiteLocale, setSiteLocale, type SiteLocale } from "@/lib/site-locale";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<SiteLocale>("en");

  useEffect(() => {
    const sync = (next: SiteLocale) => setLocale(next);
    sync(getSiteLocale());
    const handler = (event: Event) =>
      sync((event as CustomEvent<SiteLocale>).detail === "pt-PT" ? "pt-PT" : "en");
    window.addEventListener("ek-locale-change", handler);
    return () => window.removeEventListener("ek-locale-change", handler);
  }, []);

  const next: SiteLocale = locale === "en" ? "pt-PT" : "en";
  return (
    <button
      type="button"
      onClick={() => setSiteLocale(next)}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-border-base)] bg-white/[0.02] px-3 text-[10px] font-semibold tracking-[0.12em] text-[var(--color-text-secondary)] uppercase transition hover:border-[var(--color-accent-hover)] hover:text-[var(--color-text-primary)]"
      aria-label={
        locale === "en" ? "Switch site language to Portuguese" : "Mudar idioma do site para inglês"
      }
      title={locale === "en" ? "Português (Portugal)" : "English"}
    >
      <Globe2 size={13} aria-hidden="true" />
      <span>{locale === "en" ? "PT" : "EN"}</span>
    </button>
  );
}
