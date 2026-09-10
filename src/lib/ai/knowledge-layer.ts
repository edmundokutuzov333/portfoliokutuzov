import { getProductionProjects, SITE_INFO, SERVICES_KNOWLEDGE, EXPERIENCE_KNOWLEDGE, CREATIVE_PROCESS, type NormalizedProject } from "./knowledge";
import type { ChatContext } from "./contracts";

export interface KnowledgeProject {
  slug: string;
  title: string;
  client: string;
  year: string;
  category: string;
  discipline: string;
  description: string;
  tags: string[];
  role: string;
  services: string[];
  featured: boolean;
  thumbnail: string;
}

export interface PortfolioKnowledgeSnapshot {
  source: "portfolio-records";
  generatedAt: string;
  visitorContext: Pick<ChatContext, "pathname" | "projectSlug" | "projectTitle" | "selectedCategory">;
  matchingProjects: KnowledgeProject[];
  allProjects: KnowledgeProject[];
  currentProject?: KnowledgeProject;
  taxonomy: { categories: string[]; disciplines: string[]; years: string[]; clients: string[]; tags: string[] };
  platform: { routes: readonly string[]; capabilities: readonly string[]; stack: readonly string[]; safeguards: readonly string[] };
}

const PLATFORM_KNOWLEDGE = {
  routes: ["/", "/portfolio", "/portfolio/:slug", "/credentials", "/services", "/contact"],
  capabilities: ["dynamic portfolio records", "case-study discovery and related work", "AI text streaming", "real-time AI voice conversation", "live speech transcription", "text-to-speech playback", "portfolio search and command palette", "contact project briefing", "booking request", "client logo system", "analytics and product telemetry", "server-side observability", "responsive mobile experience"],
  stack: ["React 19", "TanStack Start", "TypeScript", "Vite", "Supabase", "Google Gemini", "Framer Motion"],
  safeguards: ["server-side Gemini API key", "ephemeral Live API voice tokens", "origin allowlist", "rate limiting", "request size limits", "published-data grounding"],
} as const;

function normalize(value: string): string {
  return value.toLocaleLowerCase("en").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}
function tokens(value: string): string[] {
  return normalize(value).split(/[^a-z0-9+]+/i).filter((token) => token.length > 1);
}
function scoreProject(project: NormalizedProject, query: string): number {
  const qTokens = tokens(query);
  if (!qTokens.length) return 0;
  const fields = [[project.title, 8], [project.client, 7], [project.category, 6], [project.discipline, 6], [project.tags.join(" "), 5], [project.services.join(" "), 4], [project.description, 3], [project.role, 2], [project.year, 2]] as const;
  let score = 0;
  for (const [field, weight] of fields) {
    const haystack = normalize(field);
    for (const token of qTokens) score += haystack === token ? weight * 2 : haystack.includes(token) ? weight : 0;
  }
  return score;
}
function asKnowledgeProject(project: NormalizedProject): KnowledgeProject {
  return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    discipline: project.discipline,
    description: project.description,
    tags: project.tags,
    role: project.role,
    services: project.services,
    featured: project.featured,
    thumbnail: project.thumbnail,
  };
}
function asCompactProject(project: Pick<KnowledgeProject, "slug" | "title" | "client" | "year" | "category" | "discipline" | "tags" | "services" | "role" | "featured">) {
  return {
    slug: project.slug,
    title: project.title,
    client: project.client,
    year: project.year,
    category: project.category,
    discipline: project.discipline,
    tags: project.tags,
    services: project.services,
    role: project.role,
    featured: project.featured,
  };
}

let projectsCache: { expiresAt: number; projects: NormalizedProject[] } | null = null;
let projectsPromise: Promise<NormalizedProject[]> | null = null;
const PROJECT_CACHE_TTL_MS = 5 * 60 * 1000;
async function getCachedProjects(): Promise<NormalizedProject[]> {
  if (projectsCache && projectsCache.expiresAt > Date.now()) return projectsCache.projects;
  if (!projectsPromise) {
    projectsPromise = getProductionProjects()
      .then((projects) => {
        projectsCache = { projects, expiresAt: Date.now() + PROJECT_CACHE_TTL_MS };
        return projects;
      })
      .finally(() => {
        projectsPromise = null;
      });
  }
  return projectsPromise;
}

export async function getPortfolioKnowledgeSnapshot(query: string, context: ChatContext): Promise<PortfolioKnowledgeSnapshot> {
  const projects = await getCachedProjects();
  const currentProject = context.projectSlug ? projects.find((project) => normalize(project.slug) === normalize(context.projectSlug!)) : undefined;
  const matchingProjects = projects
    .map((project) => ({ project, score: scoreProject(project, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
    .slice(0, 8)
    .map(({ project }) => asKnowledgeProject(project));
  const allProjects = projects.slice(0, 150).map(asKnowledgeProject);
  const categories = [...new Set(projects.map((project) => project.category).filter(Boolean))].sort();
  const disciplines = [...new Set(projects.map((project) => project.discipline).filter(Boolean))].sort();
  const years = [...new Set(projects.map((project) => project.year).filter(Boolean))].sort().reverse();
  const clients = [...new Set(projects.map((project) => project.client).filter(Boolean))].sort();
  const tags = [...new Set(projects.flatMap((project) => project.tags).filter(Boolean))].sort();

  return {
    source: "portfolio-records",
    generatedAt: new Date().toISOString(),
    visitorContext: {
      pathname: context.pathname,
      projectSlug: context.projectSlug,
      projectTitle: context.projectTitle,
      selectedCategory: context.selectedCategory,
    },
    matchingProjects,
    allProjects,
    currentProject: currentProject ? asKnowledgeProject(currentProject) : undefined,
    taxonomy: { categories, disciplines, years, clients, tags },
    platform: PLATFORM_KNOWLEDGE,
  };
}

export function formatKnowledgeForModel(snapshot: PortfolioKnowledgeSnapshot, options: { includeAllProjects?: boolean } = {}): string {
  return JSON.stringify(
    {
      mandate: "This snapshot is the source of truth for public portfolio facts. Never invent facts that are absent.",
      site: {
        name: SITE_INFO.name,
        title: SITE_INFO.title,
        location: SITE_INFO.location,
        bio: SITE_INFO.bio,
        availability: SITE_INFO.availability,
        metrics: {
          years: SITE_INFO.yearsOfExperience,
          projects: SITE_INFO.projectsDelivered,
          brands: SITE_INFO.brandsCollaborated,
          continents: SITE_INFO.continentsActive,
        },
      },
      services: SERVICES_KNOWLEDGE,
      experience: EXPERIENCE_KNOWLEDGE,
      process: CREATIVE_PROCESS,
      currentProject: snapshot.currentProject ?? null,
      matchingProjects: snapshot.matchingProjects,
      allProjects: options.includeAllProjects ? snapshot.allProjects.map(asCompactProject) : undefined,
      taxonomy: snapshot.taxonomy,
      platform: snapshot.platform,
    },
    null,
    2,
  );
}
