export type SiteLocale = "en" | "pt-PT";

const STORAGE_KEY = "ek_locale_v2";
const DEFAULT_LOCALE: SiteLocale = "en";

type LocaleListener = (locale: SiteLocale) => void;
const listeners = new Set<LocaleListener>();

export function getSiteLocale(): SiteLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "pt-PT" ? "pt-PT" : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function setSiteLocale(locale: SiteLocale): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, locale); } catch { /* best effort */ }
  document.documentElement.lang = locale;
  window.dispatchEvent(new CustomEvent("ek-locale-change", { detail: locale }));
  for (const listener of listeners) listener(locale);
}

export function subscribeSiteLocale(listener: LocaleListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteLocale(): SiteLocale {
  const React = require("react") as typeof import("react");
  const [locale, setLocale] = React.useState<SiteLocale>(getSiteLocale);
  React.useEffect(() => {
    document.documentElement.lang = locale;
    return subscribeSiteLocale(setLocale);
  }, [locale]);
  return locale;
}
