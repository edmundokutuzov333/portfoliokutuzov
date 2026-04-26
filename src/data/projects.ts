export type ProjectCategory =
  | "Social Media"
  | "Ad Campaigns"
  | "Videos"
  | "Image Manipulation"
  | "Web Design";

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  description: string;
  palette: string;
  span?: "tall" | "wide" | "normal";
  tags?: string[];
  coverUrl?: string;
};

// Projects described honestly: real client names where the work is public,
// or honest project types where the brief was confidential.
export const projects: Project[] = [
  {
    id: 1,
    title: "Absa",
    subtitle: "Campaign visual rollout",
    category: "Campaign Design",
    year: "2024",
    palette: "from-[#01040A] via-[#071A33] to-[#0B3B73]",
    description:
      "Campaign assets and visual rollout for Absa across digital and social formats. Hierarchy, typographic system and image treatment built to perform at scale.",
    span: "tall",
    tags: ["Visual rollout", "Social assets", "Art direction"],
  },
  {
    id: 2,
    title: "Vodacom",
    subtitle: "Social-first content system",
    category: "Social Media Assets",
    year: "2024",
    palette: "from-[#020617] via-[#0F172A] to-[#075985]",
    description:
      "Modular content system for Vodacom Mozambique: templates, layouts and motion language designed for continuous publication on social channels.",
    tags: ["Templates", "Content system", "Motion"],
  },
  {
    id: 3,
    title: "TotalEnergies",
    subtitle: "Brand activation assets",
    category: "Campaign Design",
    year: "2023",
    palette: "from-[#01040A] via-[#082F49] to-[#0EA5E9]",
    description:
      "Visual assets and key visuals supporting TotalEnergies brand activations - coordinated typography, image treatment and on-brand visual hierarchy.",
    span: "wide",
    tags: ["Key visuals", "Activation", "Print + Digital"],
  },
  {
    id: 4,
    title: "Pernod Ricard - Flying Fish",
    subtitle: "Product campaign visuals",
    category: "Art Direction",
    year: "2023",
    palette: "from-[#030814] via-[#111827] to-[#1E3A8A]",
    description:
      "Product-led campaign visuals for Flying Fish under Pernod Ricard. Photography direction, layout system and tone tuned for consumer-facing surfaces.",
    tags: ["Photography direction", "Layout", "Campaign"],
  },
  {
    id: 5,
    title: "MultiChoice - DStv & GOtv",
    subtitle: "Programming & promo assets",
    category: "Motion / Content Direction",
    year: "2024",
    palette: "from-[#01040A] via-[#0B1120] to-[#0369A1]",
    description:
      "Promotional and programming assets for MultiChoice (DStv and GOtv): motion-ready key art, lower thirds and channel-aware layouts.",
    span: "tall",
    tags: ["Promo", "Motion", "Channel art"],
  },
  {
    id: 6,
    title: "EMOSE",
    subtitle: "Institutional visual identity work",
    category: "Brand Identity",
    year: "2023",
    palette: "from-[#01040A] via-[#172554] to-[#38BDF8]",
    description:
      "Institutional identity and communication assets for EMOSE - Moçambique Companhia de Seguros. Typographic clarity, consistent palette and editorial layouts.",
    tags: ["Identity", "Editorial", "Institutional"],
  },
  {
    id: 7,
    title: "Automotive - Nissan / Toyota / Hyundai",
    subtitle: "Dealer campaign assets",
    category: "Campaign Design",
    year: "2023",
    palette: "from-[#020617] via-[#1E293B] to-[#0284C7]",
    description:
      "Campaign and dealer-facing visual assets across Nissan, Toyota and Hyundai briefs in Mozambique. Consistent layout systems and product-led art direction.",
    span: "wide",
    tags: ["Automotive", "Dealer kit", "Print + Digital"],
  },
  {
    id: 8,
    title: "Hospitality - Hotel Cardoso / Ponta Apart",
    subtitle: "Brand & communication assets",
    category: "Visual Systems",
    year: "2023",
    palette: "from-[#01040A] via-[#06111F] to-[#0B3B73]",
    description:
      "Visual systems and communication assets for hospitality clients including Hotel Cardoso and Ponta Apart Hotel - quiet typography, strong photography hierarchy.",
    tags: ["Hospitality", "Visual system", "Editorial"],
  },
];

export const categories: ("All" | ProjectCategory)[] = [
  "All",
  "Social Media",
  "Ad Campaigns",
  "Videos",
  "Image Manipulation",
  "Web Design",
];
