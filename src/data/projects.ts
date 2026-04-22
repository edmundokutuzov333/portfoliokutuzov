export type ProjectCategory =
  | "Branding"
  | "Editorial"
  | "Digital"
  | "Campaign"
  | "Experimental";

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  description: string;
  palette: string;
  span?: "tall" | "wide" | "normal";
};

export const projects: Project[] = [
  {
    id: 1,
    title: "NEXUS",
    subtitle: "Identity System",
    category: "Branding",
    year: "2026",
    palette: "from-fuchsia-500 via-violet-700 to-cyan-900",
    description:
      "Sistema de identidade visual para uma marca tecnológica com linguagem modular, tipografia proprietária e aplicações digitais.",
    span: "tall",
  },
  {
    id: 2,
    title: "AURORA",
    subtitle: "Editorial Series",
    category: "Editorial",
    year: "2025",
    palette: "from-blue-400 via-slate-800 to-emerald-950",
    description:
      "Série editorial com grelhas rígidas, fotografia tratada e ritmo tipográfico de alto contraste.",
  },
  {
    id: 3,
    title: "VOLT",
    subtitle: "Campaign Language",
    category: "Campaign",
    year: "2025",
    palette: "from-lime-300 via-cyan-700 to-purple-950",
    description:
      "Direção visual para campanha com energia cromática, motion language e peças para social-first rollout.",
    span: "wide",
  },
  {
    id: 4,
    title: "CHRONOS",
    subtitle: "Poster System",
    category: "Experimental",
    year: "2024",
    palette: "from-amber-300 via-rose-700 to-zinc-950",
    description:
      "Sistema experimental de cartazes explorando tipografia variável, ruído e composições assimétricas.",
  },
  {
    id: 5,
    title: "LUME",
    subtitle: "Digital Launch",
    category: "Digital",
    year: "2026",
    palette: "from-cyan-300 via-indigo-700 to-fuchsia-900",
    description:
      "Lançamento digital com microinterações, sistema de motion e arquitetura de marca para escala.",
    span: "tall",
  },
  {
    id: 6,
    title: "NOIR",
    subtitle: "Visual Identity",
    category: "Branding",
    year: "2024",
    palette: "from-zinc-200 via-zinc-700 to-black",
    description:
      "Identidade minimalista preta sobre branco, com foco em silêncio visual, peso tipográfico e ritmo.",
  },
  {
    id: 7,
    title: "ATLAS",
    subtitle: "Brand Architecture",
    category: "Branding",
    year: "2025",
    palette: "from-emerald-300 via-teal-700 to-slate-950",
    description:
      "Arquitetura de marca para um grupo multi-vertical com submarcas, tokens e governance visual.",
    span: "wide",
  },
  {
    id: 8,
    title: "BRAVA",
    subtitle: "Social Campaign",
    category: "Campaign",
    year: "2026",
    palette: "from-rose-400 via-fuchsia-700 to-violet-950",
    description:
      "Campanha social com linguagem ousada, contraste cromático e formatos verticais nativos.",
  },
];

export const categories: ("Todos" | ProjectCategory)[] = [
  "Todos",
  "Branding",
  "Editorial",
  "Digital",
  "Campaign",
  "Experimental",
];
