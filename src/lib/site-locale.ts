import { useEffect, useState } from "react";

export type SiteLocale = "en" | "pt-PT";

const STORAGE_KEY = "ek_locale_v2";
const DEFAULT_LOCALE: SiteLocale = "en";
const listeners = new Set<(locale: SiteLocale) => void>();

export function getSiteLocale(): SiteLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try { return window.localStorage.getItem(STORAGE_KEY) === "pt-PT" ? "pt-PT" : DEFAULT_LOCALE; } catch { return DEFAULT_LOCALE; }
}

export function setSiteLocale(locale: SiteLocale): void {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STORAGE_KEY, locale); } catch { /* best effort */ }
  document.documentElement.lang = locale;
  window.dispatchEvent(new CustomEvent("ek-locale-change", { detail: locale }));
  for (const listener of listeners) listener(locale);
}

export function subscribeSiteLocale(listener: (locale: SiteLocale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>(getSiteLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    return subscribeSiteLocale(setLocale);
  }, [locale]);
  return locale;
}
