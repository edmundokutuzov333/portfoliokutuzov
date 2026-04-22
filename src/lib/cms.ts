// CMS types and fallback content. The site reads from Supabase; if it fails,
// these fallbacks render so the site never looks empty.

export type SiteSettings = Record<string, Record<string, unknown>>;

export type DbClient = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export type DbProject = {
  id: string;
  title: string;
  subtitle: string | null;
  category: string;
  year: string | null;
  description: string | null;
  cover_url: string | null;
  gallery: string[];
  tags: string[];
  palette: string | null;
  span: string | null;
  sort_order: number;
  is_published: boolean;
};

export type DbService = {
  id: string;
  number: string | null;
  title: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

export type DbStat = {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
};

export type DbMethod = {
  id: string;
  number: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export const FALLBACK_SETTINGS: SiteSettings = {
  hero: {
    eyebrow: "BRAND IDENTITY / ART DIRECTION / DIGITAL SYSTEMS",
    title_1: "Design systems for brands that",
    title_accent: "move",
    title_2: "with precision.",
    subtitle:
      "Identidades visuais, direção de arte e experiências digitais construídas com clareza estratégica, tensão visual e precisão técnica.",
    cta_primary: "Ver portfolio",
    cta_secondary: "Enviar briefing",
    status: "Available for selected projects",
    location: "MAPUTO · SÃO PAULO · REMOTE",
    volume: "VOL. XII / 2026",
  },
  manifesto: {
    title: "A marca não precisa gritar. Ela precisa ficar na memória.",
    col1: "Sistemas visuais nascem do cruzamento entre estratégia, forma e contraste.",
    col2: "Trabalho com ritmo editorial, hierarquia precisa e tensão visual controlada.",
  },
  cta_home: {
    title: "Vamos desenhar uma presença visual impossível de ignorar.",
    button: "Começar conversa",
  },
  footer: {
    studio: "Edmundo Studio",
    tagline: "Design systems & art direction · Built with precision.",
    email: "edmundo@studio.com",
  },
  navbar: { monogram: "ED.", cta: "Iniciar projeto" },
  contact: {
    title: "Vamos construir algo que ninguém esquece.",
    subtitle: "Conta-me sobre o teu projeto.",
    email: "edmundo@studio.com",
    project_types: ["Identidade visual", "Direção de arte", "Editorial & print", "Design digital", "Outro"],
    budgets: ["< 5k", "5k–15k", "15k–40k", "40k+"],
  },
  social: {
    instagram: "https://instagram.com",
    behance: "https://behance.net",
    dribbble: "https://dribbble.com",
    linkedin: "https://linkedin.com",
  },
  about: {
    title: "Entre precisão estratégica e acidente visual controlado.",
    intro: "Edmundo é designer gráfico e art director.",
    bio: "Há mais de uma década que construo marcas, sistemas e experiências visuais.",
    values: ["Precisão", "Tensão visual", "Sistema", "Memória"],
  },
};

export function readSetting<T = unknown>(
  settings: SiteSettings | undefined,
  key: string,
  field: string,
  fallback: T,
): T {
  const merged = { ...FALLBACK_SETTINGS, ...(settings ?? {}) };
  const v = merged[key]?.[field];
  return (v as T) ?? fallback;
}
