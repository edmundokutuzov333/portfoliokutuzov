import { useEffect, useState } from "react";

export type SiteLocale = "en";

const DEFAULT_LOCALE: SiteLocale = "en";
const listeners = new Set<(locale: SiteLocale) => void>();

export function translateSiteText(value: string, _locale: SiteLocale = DEFAULT_LOCALE): string {
  return value;
}

export function localizeArchiveYears(value: string, _locale: SiteLocale = DEFAULT_LOCALE): string {
  return value;
}

export function getSiteLocale(): SiteLocale {
  return DEFAULT_LOCALE;
}

export function setSiteLocale(_locale: SiteLocale = DEFAULT_LOCALE): void {
  if (typeof document !== "undefined") document.documentElement.lang = DEFAULT_LOCALE;
  for (const listener of listeners) listener(DEFAULT_LOCALE);
}

export function installSiteLocaleDomBridge(): () => void {
  if (typeof document !== "undefined") document.documentElement.lang = DEFAULT_LOCALE;
  return () => {};
}

export function subscribeSiteLocale(listener: (locale: SiteLocale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>(DEFAULT_LOCALE);
  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = DEFAULT_LOCALE;
    return subscribeSiteLocale(setLocale);
  }, []);
  return locale;
}
