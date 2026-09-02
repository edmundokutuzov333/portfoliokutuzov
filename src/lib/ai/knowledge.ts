import { projects as staticProjects } from "../../data/projects";
import { clients as staticClients } from "../../data/clients";
import { supabase } from "../../integrations/supabase/client";

export interface NormalizedProject {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  discipline: string;
  description: string;
  images: string[];
  thumbnail: string;
  slug: string;
  tags: string[];
  role: string;
  services: string[];
  featured: boolean;
  relatedProjects: string[];
}

export const SITE_INFO = {
  name: "Edmundo Kutuzov",
  title: "Art Director & Graphic Designer",
  location: "Maputo, Mozambique",
  bio: "Edmundo Kutuzov is an Art Director and Graphic Designer based in Maputo, Mozambique, specializing in strategic brand identity, campaign visual rollouts, art direction, and modular digital content systems.",
  yearsOfExperience: "6+",
  projectsDelivered: "150+",
  brandsCollaborated: "30+",
  continentsActive: "3",
  contact: {
    email: "contact@edmundokutuzov.art",
    whatsapp: "+258 87 601 312 1",
    whatsappLink: "https://wa.me/258876013121",
    linkedin: "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4",
    location: "Maputo, Mozambique",
  },
  availability:
    "Currently accepting select commissions, brand identity systems, art direction briefs, and creative advisory worldwide.",
};

export const SERVICES_KNOWLEDGE = [
  {
    id: "identity",
    title: "Brand Identity",
    tagline: "Strategic brand marks, typography systems & identity architecture",
    description:
      "Transforming strategic brand intent into unmistakable visual form. Developing comprehensive visual grammar, logo systems, bespoke typographic pairings, colour scales, and rigorous brand guideline books built for permanence.",
    tags: ["Brand Identity", "Visual Grammar", "Typography", "Guidelines"],
    deliverables: [
      "Brand Architecture & Strategy",
      "Logo Marks & Symbol Systems",
      "Custom Typographic Scales",
      "Comprehensive Identity Guidelines",
    ],
  },
  {
    id: "art-direction",
    title: "Art Direction",
    tagline: "Campaign conception, visual storytelling & photography direction",
    description:
      "Crafting the visual soul of campaigns and brand narratives. Directing photography, set styling, cinematic color grading, and commercial rollout systems that stop scrolling and demand attention across national and global markets.",
    tags: ["Campaign Design", "Photography Direction", "Commercial Rollout", "Visual Hierarchy"],
    deliverables: [
      "Campaign Visual Concepts",
      "Photography & Video Treatments",
      "Master Key Visuals (KV)",
      "Multi-Channel Rollout Systems",
    ],
  },
  {
    id: "editorial",
    title: "Editorial & Print",
    tagline: "Tactile publications, large-format OOH & packaging design",
    description:
      "Bringing precision and rhythm to tangible media. Editorial compositions, annual reports, large-format outdoor billboards, product packaging, and tactile print production oversight engineered with uncompromising typographic restraint.",
    tags: ["Publication Design", "OOH Billboards", "Packaging", "Print Production"],
    deliverables: [
      "Editorial Books & Publications",
      "Large-Format OOH & Billboards",
      "Packaging & Structural Design",
      "Print Production & Finish Specs",
    ],
  },
  {
    id: "digital",
    title: "Digital Design & Social Engines",
    tagline: "Social-first content engines, motion assets & digital systems",
    description:
      "Designing modular digital ecosystems for continuous brand momentum. Social-first publication engines, UI/UX aesthetics, digital campaign kits, dynamic motion graphics, and interactive web interfaces optimized for high engagement.",
    tags: ["Social Systems", "Digital Campaign Kits", "Motion Assets", "UI Design Systems"],
    deliverables: [
      "Social-First Content Systems",
      "Dynamic Motion Language",
      "Digital Design Systems",
      "Interactive Web Experiences",
    ],
  },
];

export const EXPERIENCE_KNOWLEDGE = [
  {
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
    period: "2024 - Present",
    description:
      "Directing high-visibility visual campaigns, motion rollouts, and multi-channel creative systems for enterprise accounts in Mozambique.",
  },
  {
    role: "Art Director",
    company: "SPOT Comunicação",
    period: "2023 - 2024",
    description:
      "Supervised campaign visuals, dealer toolkits, and consumer advertising activations.",
  },
  {
    role: "Graphic Designer",
    company: "Ikigai Moçambique",
    period: "2023",
    description: "Brand identity systems, typography guidelines, and packaging design.",
  },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
    description:
      "Strategic institutional communications, social media strategy, and brand asset production.",
  },
  {
    role: "Graphic Designer",
    company: "Agência Creer",
    period: "2020 - 2023",
    description: "Print, editorial, digital assets, and brand design.",
  },
];

export const CREATIVE_PROCESS = [
  {
    step: "01",
    name: "Discovery & Immersion",
    description: "Deep analysis of strategic goals, competitive landscape, and visual positioning.",
  },
  {
    step: "02",
    name: "Strategic Direction",
    description: "Conceptualizing the core visual idea, moodboards, and narrative hooks.",
  },
  {
    step: "03",
    name: "Design & Craft",
    description: "Iterative execution of typography, marks, layouts, and photographic treatments.",
  },
  {
    step: "04",
    name: "Production & Rollout",
    description:
      "Building scalable guideline systems, motion assets, print finishes, and digital kits.",
  },
];

interface DbProjectRecord {
  id: string | number;
  title?: string;
  client_name?: string;
  year?: string | number;
  category?: string;
  description?: string;
  concept?: string;
  subtitle?: string;
  gallery?: string[];
  cover_url?: string;
  slug?: string;
  tags?: string[];
  role?: string;
  deliverables?: string[];
  featured?: boolean;
  is_published?: boolean;
}

interface DbClientRecord {
  name: string;
}

export async function getProductionProjects(): Promise<NormalizedProject[]> {
  try {
    const { data, error } = await supabase.from("projects").select("*").order("sort_order");

    if (!error && data && data.length > 0) {
      const records = data as unknown as DbProjectRecord[];
      const published = records.filter((p) => p.is_published !== false);
      return published.map((p) => ({
        id: String(p.id),
        title: p.title || "",
        client: p.client_name || p.title || "",
        year: p.year ? String(p.year) : "",
        category: p.category || "General",
        discipline: p.category || "General",
        description: p.description || p.concept || p.subtitle || "",
        images: Array.isArray(p.gallery) ? p.gallery : [],
        thumbnail: p.cover_url || "",
        slug:
          p.slug || (p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : String(p.id)),
        tags: Array.isArray(p.tags) ? p.tags : [],
        role: p.role || "Art Direction",
        services: Array.isArray(p.deliverables) ? p.deliverables : [],
        featured: Boolean(p.featured),
        relatedProjects: [],
      }));
    }
  } catch {
    // Fallback to static data
  }

  return staticProjects.map((p) => ({
    id: String(p.id),
    title: p.title,
    client: p.title,
    year: p.year,
    category: p.category,
    discipline: p.category,
    description: p.description,
    images: [],
    thumbnail: p.coverUrl || "",
    slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tags: p.tags || [],
    role: "Art Direction & Visual Design",
    services: p.tags || [],
    featured: p.id <= 3,
    relatedProjects: [],
  }));
}

export async function getProductionClients(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select("name")
      .eq("is_active", true)
      .order("sort_order");

    if (!error && data && data.length > 0) {
      const clientRecords = data as unknown as DbClientRecord[];
      return clientRecords.map((c) => c.name);
    }
  } catch {
    // Fallback
  }
  return staticClients;
}
