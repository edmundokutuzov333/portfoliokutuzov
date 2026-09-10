import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "pt-PT";
const STORAGE_KEY = "ek_locale_v1";
const DEFAULT_LOCALE: Locale = "en";

const dictionaries = {
  en: {
    nav: { home: "Home", portfolio: "Portfolio", credentials: "Credentials", services: "Services", contact: "Contact", start: "Start a project" },
    language: { label: "Language", english: "English", portuguese: "Português" },
    ai: {
      name: "Talk to Kutuzov in Real Time",
      subtitle: "AI Creative Director Assistant",
      placeholder: "Ask about the work, services, Edmundo, or a project...",
      open: "Talk to Kutuzov in Real Time",
      send: "Send message",
      listen: "Start voice conversation",
      stopListening: "Stop voice conversation",
      read: "Read response aloud",
      stopReading: "Stop reading",
      connecting: "Connecting...",
      listening: "Listening...",
      processing: "Thinking...",
      speaking: "Speaking...",
      micDenied: "Microphone access is required for voice conversation.",
      fallback: "The voice connection is temporarily unavailable. You can continue by typing.",
      empty: "Ask me anything about Edmundo Kutuzov, the work, services, or how to start a project.",
    },
    search: { label: "Search portfolio", placeholder: "Search portfolio...", explore: "Explore by discipline", empty: "No published projects match that search." },
    contact: { start: "Start a project" },
  },
  "pt-PT": {
    nav: { home: "Início", portfolio: "Portefólio", credentials: "Percurso", services: "Serviços", contact: "Contacto", start: "Iniciar um projecto" },
    language: { label: "Idioma", english: "English", portuguese: "Português" },
    ai: {
      name: "Falar com Kutuzov em Tempo Real",
      subtitle: "Assistente de Direcção Criativa com IA",
      placeholder: "Pergunta sobre o trabalho, serviços, Edmundo ou um projecto...",
      open: "Falar com Kutuzov em Tempo Real",
      send: "Enviar mensagem",
      listen: "Iniciar conversa por voz",
      stopListening: "Parar conversa por voz",
      read: "Ler resposta em voz alta",
      stopReading: "Parar leitura",
      connecting: "A ligar...",
      listening: "A ouvir...",
      processing: "A pensar...",
      speaking: "A falar...",
      micDenied: "É necessário permitir o acesso ao microfone para a conversa por voz.",
      fallback: "A ligação de voz está temporariamente indisponível. Pode continuar a escrever.",
      empty: "Pergunta-me sobre o Edmundo Kutuzov, o trabalho, os serviços ou como iniciar um projecto.",
    },
    search: { label: "Pesquisar portefólio", placeholder: "Pesquisar portefólio...", explore: "Explorar por disciplina", empty: "Não foram encontrados projectos publicados para essa pesquisa." },
    contact: { start: "Iniciar um projecto" },
  },
} as const;

type Dictionary = (typeof dictionaries)[Locale];

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "pt-PT" ? "pt-PT" : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function getInitialLocale(): Locale {
  return readStoredLocale();
}

interface LocaleContextValue {
  locale: Locale;
  language: "en" | "pt";
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Locale persistence is best effort.
      }
      document.documentElement.lang = next;
      window.dispatchEvent(new CustomEvent("ek-locale-change", { detail: next }));
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, language: locale === "pt-PT" ? "pt" : "en", setLocale, t: dictionaries[locale] }),
    [locale, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}
