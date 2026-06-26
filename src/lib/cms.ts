// CMS types and English fallback content. The site reads from Supabase; if a
// key is missing or the request fails, these fallbacks render so the site
// never looks empty.

export type SiteSettings = Record<string, Record<string, unknown>>;

export const SITE_EMAIL = "contact@edmundokutuzov.art";
export const SITE_PHONE = "+258 87 601 312 1";
export const SITE_PHONE_DIGITS = "258876013121";
export const LINKEDIN_URL = "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4";

export type DbClient = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  kind?: string;
  logo_width?: number | null;
  logo_height?: number | null;
};

export type DbProject = {
  id: string;
  slug?: string | null;
  title: string;
  subtitle: string | null;
  category: string;
  year: string | null;
  description: string | null;
  cover_url: string | null;
  cover_width?: number | null;
  cover_height?: number | null;
  gallery: string[];
  tags: string[];
  palette: string | null;
  span: string | null;
  sort_order: number;
  is_published: boolean;
  featured?: boolean;
  featured_priority?: number;
  client_name?: string | null;
  image_fit?: "contain" | "cover" | string | null;
  concept?: string | null;
  idea?: string | null;
  role?: string | null;
  notes?: string | null;
  collaborators?: string[];
  tools_used?: string[];
  deliverables?: string[];
  gallery_meta?: { url: string; width?: number; height?: number; alt?: string }[];
  video_url?: string | null;
  video_provider?: "file" | "youtube" | "vimeo" | string | null;
};

export const TOOL_OPTIONS = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere",
  "Adobe After Effects",
  "Artificial Intelligence",
] as const;

// Final category set used by the public site and admin.
// Order: Social Media, Ad Campaigns, Digital Design, Videos (new), Web Design, Offline Actions.
export const PROJECT_CATEGORIES = [
  "Social Media",
  "Ad Campaigns",
  "Digital Design",
  "Offline Actions",
  "Clothes Design",
  "Videos",
  "Web Design",
] as const;

export const MAX_FEATURED = 3;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

// Maps any legacy category label to the new canonical label.
export function normalizeCategory(input: string | null | undefined): ProjectCategory {
  const v = (input ?? "").trim().toLowerCase();
  if (!v) return "Digital Design";
  if (v === "social media" || v === "social media assets" || v === "social-media")
    return "Social Media";
  if (v === "ad campaigns" || v === "campaign design" || v === "ad-campaigns")
    return "Ad Campaigns";
  if (v === "videos" || v === "video") return "Videos";
  if (v === "offline actions" || v === "motion / content direction" || v === "motion")
    return "Offline Actions";
  if (v === "web design" || v === "web-design") return "Web Design";
  if (
    v === "clothes design" ||
    v === "clothes-design" ||
    v === "clothing" ||
    v === "clothing design" ||
    v === "fashion"
  )
    return "Clothes Design";
  if (
    v === "digital design" ||
    v === "image manipulation" ||
    v === "brand identity" ||
    v === "visual systems" ||
    v === "art direction" ||
    v === "editorial systems" ||
    v === "digital-design"
  )
    return "Digital Design";
  return "Digital Design";
}

export const CAMPAIGN_CATEGORIES = ["Ad Campaigns", "Videos", "Offline Actions"] as const;
export function isCampaignCategory(c: string) {
  return (CAMPAIGN_CATEGORIES as readonly string[]).includes(normalizeCategory(c));
}

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
    top_left: "Edmundo Kutuzov - Art Director",
    top_right: "Maputo · Mozambique",
    eyebrow: "",
    title_1: "I make ideas",
    title_2: "stop, take notice,",
    title_accent: "and act.",
    subtitle:
      "I'm Edmundo Kutuzov, an art director rooted in Mozambique's creative ecosystem. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    cta_primary: "View Portfolio",
    cta_secondary: "Contact Me",
    status_label: "Current Status",
    status: "Available for projects",
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
    col1: "I treat brands as decision systems: strategy translated into form, rhythm, contrast, typography and behaviour. Every element has to justify its own existence - from the first mark to the last touchpoint.",
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
  featured_section: {
    eyebrow: "Featured work",
    title: "Selected projects.",
    subtitle: "A handful of recent pieces hand-picked from the studio.",
  },
  credentials: {
    experience: [
      { period: "2020 - 2023", role: "Graphic Designer", company: "Agência Creer" },
      {
        period: "2023",
        role: "Marketing Assistant & Social Media Manager",
        company: "Imperial Seguros",
      },
      { period: "2023", role: "Graphic Designer", company: "Ikigai Moçambique" },
      { period: "2023 - 2024", role: "Art Director", company: "SPOT Comunicação" },
      {
        period: "2024 - Present",
        role: "Art Director & Content Creator",
        company: "WEBMASTERS Limitada",
      },
    ],
    cards: [
      { value: "6+", label: "Years of experience" },
      { value: "150+", label: "Projects delivered" },
      { value: "30+", label: "National and international brands" },
      { value: "3", label: "Continents" },
      { value: "360º", label: "Art direction, branding, strategy, AI, marketing" },
    ],
    competencies: [
      "Art Direction & Graphic Design",
      "Branding & Brand Strategy",
      "Creative Direction of music videos and commercials",
      "UI/UX and web development",
      "Campaign management and social media content",
      "Creative curation and streetwear collection development",
      "Music release planning (EPs, singles, music videos)",
    ],
    reference: "GOD",
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
    email: SITE_EMAIL,
  },
  footer: {
    eyebrow: "Edmundo Kutuzov - Art Director",
    title_1: "Available for",
    title_2: "projects in 2026.",
    cta: "Start a conversation",
    email: SITE_EMAIL,
    copyright: "Edmundo Kutuzov. All rights reserved. The only one. Less talk, more design.",
    location: 'Magoanine "C", Maputo · Mozambique',
    phone: SITE_PHONE,
  },
  navbar: { brand: "Edmundo Kutuzov", cta: "Start a project" },
  contact: {
    eyebrow: "Contact",
    status: "Open for 2026 projects",
    title_1: "Let's",
    title_accent: "talk.",
    subtitle:
      "Tell me about your project. I respond to every message within 48 hours with an initial process proposal.",
    email: SITE_EMAIL,
    phone: SITE_PHONE,
    location: 'Magoanine "C", Maputo, Mozambique',
    project_types: [
      "Brand Identity",
      "Art Direction",
      "Campaign Design",
      "Social Media",
      "Motion Content",
      "Web Design",
      "Image Manipulation",
      "Video Direction",
      "Creative Strategy",
      "Content Creation",
      "Product Launch Design",
      "Visual Systems",
    ],
    booking_url: "",
  },
  about: {
    eyebrow: "The Credentials",
    top_right: "Edmundo Kutuzov - Art Director",
    title_1: "Strategy, craft and a sharp",
    title_accent: "point of view.",
    bio_p1:
      "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    bio_p2:
      "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
    bio_p3:
      "My focus is always on experiences that generate recognition and measurable results - every choice I make is designed to maximise impact and perception.",
    email: SITE_EMAIL,
    phone: SITE_PHONE,
    location: 'Magoanine "C", Maputo, Mozambique',
    experience: [
      {
        role: "Art Director & Content Creator",
        company: "WEBMASTERS Limitada",
        period: "2024 - Present",
      },
      { role: "Art Director", company: "SPOT Comunicação", period: "2023 - 2024" },
      { role: "Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
      {
        role: "Marketing Assistant & Social Media Manager",
        company: "Imperial Seguros",
        period: "2023",
      },
      { role: "Graphic Designer", company: "Agência Creer", period: "2020 - 2023" },
    ],
    skills: [
      { name: "Adobe Photoshop", value: 95 },
      { name: "Adobe Illustrator", value: 75 },
      { name: "Adobe Premiere", value: 75 },
      { name: "Adobe After Effects", value: 45 },
      { name: "Artificial Intelligence", value: 95 },
    ],
    brands: [
      "Absa",
      "Toyota Moçambique",
      "Nissan Moçambique",
      "Hyundai Moçambique",
      "Galp",
      "TotalEnergies",
      "Vodacom",
      "Ronil Auto Moçambique",
      "Pernod Ricard Moçambique",
      "GIZ",
      "MultiChoice (DSTV & GOTV)",
      "KitKat",
      "Flying Fish",
      "Brutal Fruit",
      "Joaquim Chaves Saúde",
      "Ponta Apart Hotel",
      "Hotel Cardoso",
      "EMOSE",
      "Moçambique Companhia de Seguros",
      "PROMAR",
    ],
  },
  social: {
    instagram: "https://www.instagram.com/edmundo.kutuzov/",
    linkedin: LINKEDIN_URL,
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
