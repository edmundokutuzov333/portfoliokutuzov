// CMS types and English fallback content. The site reads from Supabase; if a
// key is missing or the request fails, these fallbacks render so the site
// never looks empty.

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
    top_left: "Edmundo Kutuzov — Art Director",
    top_right: "Maputo · Mozambique",
    eyebrow: "Brand Identity · Art Direction · Campaign Design",
    title_1: "I make ideas",
    title_2: "stop, take notice,",
    title_accent: "and act.",
    subtitle:
      "I'm Edmundo Kutuzov, an art director rooted in Mozambique's creative ecosystem. I design visual identities and communication pieces that capture attention and drive action — blending storytelling, visual hierarchy, and typographic craft.",
    cta_primary: "I'm ready for the immersion!",
    cta_secondary: "View Portfolio",
    status_label: "Current Status",
    status: "Available for selected projects",
    location: "Maputo · Remote",
    year: "2026",
    disciplines: ["Art Direction", "Brand Identity", "Campaign Design", "Audiovisual Direction"],
  },
  manifesto: {
    eyebrow: "Manifesto",
    sidebar: "Strategy / Form / Motion / Identity Systems",
    title_1: "A brand doesn't need to take up",
    title_accent: "more space.",
    title_2: "It needs to occupy",
    title_muted: "memory.",
    col1: "I treat brands as decision systems: strategy translated into form, rhythm, contrast, typography and behaviour. Every element has to justify its own existence — from the first mark to the last touchpoint.",
    col2: "The process combines strategic thinking, editorial composition and technical precision. Strict grids, controlled ruptures, cool contrast and visual systems built to grow without losing identity.",
    principles: [
      { meta: "01 / Strategy", key: "Clarity", value: "Idea before aesthetic." },
      { meta: "02 / Composition", key: "Rhythm", value: "Hierarchy, pause, tension." },
      { meta: "03 / System", key: "Precision", value: "Every detail has a function." },
      { meta: "04 / Impact", key: "Memory", value: "Recognition, on every touchpoint." },
    ],
  },
  clients_section: {
    eyebrow: "Selected Clients",
    title: "Brands and teams\nI have worked with.",
    subtitle:
      "A selection of local and international brands I have collaborated with as art director, graphic designer and creative lead.",
  },
  services_section: {
    eyebrow: "Services",
    title: "Visual disciplines for brands that move with precision.",
    sidebar: "Brand Logic / Visual Systems / Digital Presence",
  },
  cta_home: {
    eyebrow: "Let's collaborate",
    title_1: "Let's build a visual presence",
    title_accent: "impossible to ignore.",
    cta_primary: "Start a project",
    email: "edmundokutuzov@phantom-mz.com",
  },
  footer: {
    eyebrow: "Edmundo Kutuzov — Art Director",
    title_1: "Available for selected",
    title_2: "projects in 2026.",
    cta: "Start a conversation",
    email: "edmundokutuzov@phantom-mz.com",
    copyright: "Edmundo Kutuzov. All rights reserved.",
    location: 'Magoanine "C", Maputo · Mozambique',
    phone: "+258 87 601 312 1",
  },
  navbar: { brand: "Edmundo Kutuzov", cta: "Start a project" },
  contact: {
    eyebrow: "Contact",
    status: "Open for 2026 projects",
    title_1: "Let's",
    title_accent: "talk.",
    subtitle:
      "Tell me about your project. I respond to every message within 48 hours with an initial process proposal.",
    email: "edmundokutuzov@phantom-mz.com",
    phone: "+258 87 601 312 1",
    location: 'Magoanine "C", Maputo, Mozambique',
    project_types: ["Brand Identity", "Art Direction", "Campaign Design", "Digital Design", "Other"],
    budgets: ["< 5K€", "5K — 15K€", "15K — 40K€", "40K€ +"],
  },
  about: {
    eyebrow: "The Credentials",
    top_right: "Edmundo Kutuzov — Art Director",
    title_1: "Strategy, craft and a sharp",
    title_accent: "point of view.",
    bio_p1:
      "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action — blending storytelling, visual hierarchy, and typographic craft.",
    bio_p2:
      "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
    bio_p3:
      "My focus is always on experiences that generate recognition and measurable results — every choice I make is designed to maximise impact and perception.",
    email: "edmundokutuzov@phantom-mz.com",
    phone: "+258 87 601 312 1",
    location: 'Magoanine "C", Maputo, Mozambique',
    experience: [
      { role: "Art Director", company: "SPOT Comunicação", period: "2023 — 2024" },
      { role: "Senior Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
      { role: "Marketing Assistant & Social Media Manager", company: "Imperial Seguros", period: "2023" },
      { role: "Graphic Designer", company: "Agência Creer", period: "2020 — 2023" },
    ],
    skills: [
      { name: "Adobe Photoshop", value: 95 },
      { name: "Adobe Illustrator", value: 75 },
      { name: "Adobe Premiere", value: 75 },
      { name: "Adobe After Effects", value: 45 },
      { name: "Artificial Intelligence", value: 95 },
    ],
    brands: [
      "Absa", "Vodacom", "TotalEnergies", "Galp", "Nissan", "Toyota", "Hyundai",
      "MultiChoice", "DStv", "GOtv", "Pernod Ricard", "Flying Fish", "Brutal", "Kit Kat",
      "EMOSE", "Moçambique Companhia de Seguros", "MEREC", "Joaquim Chaves Saúde",
      "PROMAR", "Hotel Cardoso", "Ponta Apart Hotel", "GIZ", "RONIL",
    ],
  },
  social: {
    instagram: "https://www.instagram.com/edmundo.kutuzov/",
    linkedin: "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4",
    facebook: "https://www.facebook.com/edmundoku/",
  },
};

export function readSetting<T = unknown>(
  settings: SiteSettings | undefined,
  key: string,
  field: string,
  fallback: T,
): T {
  const fromDb = settings?.[key]?.[field];
  if (fromDb !== undefined && fromDb !== null && fromDb !== "") return fromDb as T;
  const fb = FALLBACK_SETTINGS[key]?.[field];
  return (fb as T) ?? fallback;
}
