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
  tags?: string[];
  coverUrl?: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "NEXUS",
    subtitle: "Identity System",
    category: "Branding",
    year: "2026",
    palette: "from-[#01040A] via-[#071A33] to-[#1D4ED8]",
    description:
      "Sistema de identidade visual para uma marca tecnológica, com linguagem modular, tipografia proprietária, grelhas flexíveis e aplicações digitais preparadas para escala.",
    span: "tall",
    tags: ["Brand Strategy", "Logo System", "Guidelines", "Digital Assets"],
  },
  {
    id: 2,
    title: "AURORA",
    subtitle: "Editorial Series",
    category: "Editorial",
    year: "2025",
    palette: "from-[#020617] via-[#0F172A] to-[#075985]",
    description:
      "Série editorial construída com grelhas rígidas, contraste tipográfico, fotografia tratada em tons frios e uma sequência visual pensada para leitura lenta e impacto imediato.",
    tags: ["Editorial Grid", "Typography", "Print System"],
  },
  {
    id: 3,
    title: "VOLT",
    subtitle: "Campaign Language",
    category: "Campaign",
    year: "2025",
    palette: "from-[#01040A] via-[#082F49] to-[#0EA5E9]",
    description:
      "Direção visual para campanha com narrativa clara, sistema de peças escalável, linguagem de motion e variações para social-first rollout.",
    span: "wide",
    tags: ["Campaign Concept", "Key Visuals", "Motion Direction", "Social Kit"],
  },
  {
    id: 4,
    title: "CHRONOS",
    subtitle: "Poster System",
    category: "Experimental",
    year: "2024",
    palette: "from-[#030814] via-[#111827] to-[#1E3A8A]",
    description:
      "Sistema experimental de cartazes explorando tipografia variável, ruído digital, camadas translúcidas e composições assimétricas em ambiente visual frio.",
    tags: ["Poster System", "Variable Type", "Visual Research"],
  },
  {
    id: 5,
    title: "LUME",
    subtitle: "Digital Launch",
    category: "Digital",
    year: "2026",
    palette: "from-[#01040A] via-[#0B1120] to-[#0369A1]",
    description:
      "Lançamento digital com interface editorial, microinterações, sistema de motion e arquitetura visual pensada para conversão sem perder sofisticação.",
    span: "tall",
    tags: ["Web Design", "Motion System", "Launch Page", "UI Direction"],
  },
  {
    id: 6,
    title: "NOIR",
    subtitle: "Visual Identity",
    category: "Branding",
    year: "2024",
    palette: "from-[#F8FAFC] via-[#64748B] to-[#01040A]",
    description:
      "Identidade minimalista baseada em contraste, silêncio visual, composição precisa e um sistema tipográfico de alta presença.",
    tags: ["Minimal Identity", "Typography", "Brand Applications"],
  },
  {
    id: 7,
    title: "ATLAS",
    subtitle: "Brand Architecture",
    category: "Branding",
    year: "2025",
    palette: "from-[#01040A] via-[#172554] to-[#38BDF8]",
    description:
      "Arquitetura de marca para grupo multi-vertical, com submarcas, regras de aplicação, tokens visuais e governance para consistência em escala.",
    span: "wide",
    tags: ["Brand Architecture", "Subbrands", "Design Tokens", "Governance"],
  },
  {
    id: 8,
    title: "BRAVA",
    subtitle: "Social Campaign",
    category: "Campaign",
    year: "2026",
    palette: "from-[#020617] via-[#1E293B] to-[#0284C7]",
    description:
      "Campanha social com linguagem visual direta, formatos verticais nativos, ritmo tipográfico forte e sistema de assets para publicação contínua.",
    tags: ["Social Campaign", "Content System", "Visual Rollout"],
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
