import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export type SiteLocale = "en" | "pt-PT";

const listeners = new Set<(locale: SiteLocale) => void>();

export function localeFromPath(pathname: string): SiteLocale {
  return pathname === "/pt" || pathname.startsWith("/pt/") ? "pt-PT" : "en";
}

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/pt(?=\/|$)/, "");
  return stripped || "/";
}

export function localizePath(pathname: string, locale: SiteLocale): string {
  const base = stripLocalePrefix(pathname);
  return locale === "pt-PT" ? (base === "/" ? "/pt" : `/pt${base}`) : base;
}

export const UI_COPY: Record<SiteLocale, Record<string, string>> = {
  en: {
    menu: "Menu", close: "Close", startProject: "Start a project", search: "Search",
    searchPortfolio: "Search portfolio", changeLanguage: "Language",
    home: "Home", portfolio: "Portfolio", credentials: "Credentials", services: "Services",
    contact: "Contact", studio: "Kutuzov Studio", actions: "Actions", navigation: "Navigation",
    recent: "Recent", noResults: "No published projects match that search.",
    openChat: "Open AI assistant", switchPortuguese: "Português", switchEnglish: "English",
    allRights: "All rights reserved.", maputo: "Maputo time",
    newsletterLabel: "Get occasional notes.", newsletterDescription: "New work, availability and studio news.",
    newsletterEmail: "Email address", join: "Join",
  },
  "pt-PT": {
    menu: "Menu", close: "Fechar", startProject: "Iniciar um projecto", search: "Pesquisar",
    searchPortfolio: "Pesquisar portfolio", changeLanguage: "Idioma",
    home: "Início", portfolio: "Portfolio", credentials: "Credenciais", services: "Serviços",
    contact: "Contacto", studio: "Kutuzov Studio", actions: "Acções", navigation: "Navegação",
    recent: "Recentes", noResults: "Não existem projectos publicados que correspondam à pesquisa.",
    openChat: "Abrir assistente IA", switchPortuguese: "Português", switchEnglish: "English",
    allRights: "Todos os direitos reservados.", maputo: "Hora de Maputo",
    newsletterLabel: "Receba notas ocasionais.", newsletterDescription: "Novo trabalho, disponibilidade e novidades do studio.",
    newsletterEmail: "Endereço de email", join: "Subscrever",
  },
};

export function setSiteLocale(locale: SiteLocale): void {
  if (typeof document !== "undefined") document.documentElement.lang = locale;
  for (const listener of listeners) listener(locale);
}

export function installSiteLocaleDomBridge(pathname = typeof window !== "undefined" ? window.location.pathname : "/"): () => void {
  setSiteLocale(localeFromPath(pathname));
  return () => {};
}

export function subscribeSiteLocale(listener: (locale: SiteLocale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteLocale(): SiteLocale {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = localeFromPath(pathname);

  useEffect(() => {
    setSiteLocale(locale);
  }, [locale]);

  return locale;
}

export function localizeArchiveYears(value: string): string {
  return value;
}

export function translateSiteText(value: string): string {
  return value;
}
