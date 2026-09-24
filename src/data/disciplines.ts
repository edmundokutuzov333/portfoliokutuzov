import type { DbProject } from "@/lib/cms";

export interface Discipline {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  deliverables: string[];
  projectMatcher: (p: DbProject) => boolean;
  defaultProjectTitle: string;
}

export const STATIC_DISCIPLINES: Discipline[] = [
  {
    id: "identity",
    number: "01",
    title: "Identity Visual",
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
    projectMatcher: (p) =>
      p.category === "Brand Identity" ||
      p.category === "Web Design" ||
      p.title.toLowerCase().includes("emose") ||
      p.title.toLowerCase().includes("cardoso"),
    defaultProjectTitle: "EMOSE",
  },
  {
    id: "art-direction",
    number: "02",
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
    projectMatcher: (p) =>
      p.category === "Ad Campaigns" ||
      p.category === "Videos" ||
      p.title.toLowerCase().includes("absa") ||
      p.title.toLowerCase().includes("flying fish") ||
      p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Absa",
  },
  {
    id: "editorial",
    number: "03",
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
    projectMatcher: (p) =>
      p.category === "Offline Actions" ||
      p.title.toLowerCase().includes("totalenergies") ||
      p.title.toLowerCase().includes("automotive") ||
      p.tags.some((t) => t.toLowerCase().includes("print")),
    defaultProjectTitle: "TotalEnergies",
  },
  {
    id: "digital",
    number: "04",
    title: "Digital Design",
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
    projectMatcher: (p) =>
      p.category === "Social Media" ||
      p.category === "Digital Design" ||
      p.title.toLowerCase().includes("vodacom") ||
      p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Vodacom",
  },
];

