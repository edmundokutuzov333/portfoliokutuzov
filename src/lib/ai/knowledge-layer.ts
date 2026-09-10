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
  currentProject?: KnowledgeProject;
  taxonomy: {
    categories: string[];
    disciplines: string[];
    years: string[];
    clients: string[];
    tags: string[];
  };
}

function normalize(value: string): string {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[^a-z0-9+]+/i)
    .filter((token) => token.length > 1);
}

function scoreProject(project: NormalizedProject, query: string): number {
  const qTokens = tokens(query);
  if (!qTokens.length) return 0;

  const fields = [
    [project.title, 8],
    [project.client, 7],
    [project.category, 6],
    [project.discipline, 6],
    [project.tags.join(" "), 5],
    [project.services.join(" "), 4],
    [project.description, 3],
    [project.role, 2],
    [project.year, 2],
  ] as const;

  let score = 0;
  for (const [field, weight] of fields) {
    const haystack = normalize(field);
    for (const token of qTokens) {
      if (haystack === token) score += weight * 2;
      else if (haystack.includes(token)) score += weight;
    }
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

export async function getPortfolioKnowledgeSnapshot(
  query: string,
  context: ChatContext,
): Promise<PortfolioKnowledgeSnapshot> {
  const projects = await getProductionProjects();
  const currentProject = context.projectSlug
    ? projects.find((project) => normalize(project.slug) === normalize(context.projectSlug!))
    : undefined;

  const scored = projects
    .map((project) => ({ project, score: scoreProject(project, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
    .slice(0, 8)
    .map(({ project }) => asKnowledgeProject(project));

  const categories = [...new Set(projects.map((project) => project.category).filter(Boolean))].sort();
  const disciplines = [...new Set(projects.map((project) => project.discipline).filter(Boolean))].sort();
  const years = [...new Set(projects.map((project) => project.year).filter(Boolean))].sort().reverse();
  const clients = [...new Set(projects.map((project) => project.client).filter(Boolean))].sort();
  const tags = [
    ...new Set(projects.flatMap((project) => project.tags).filter(Boolean)),
  ].sort();

  return {
    source: "portfolio-records",
    generatedAt: new Date().toISOString(),
    visitorContext: {
      pathname: context.pathname,
      projectSlug: context.projectSlug,
      projectTitle: context.projectTitle,
      selectedCategory: context.selectedCategory,
    },
    matchingProjects: scored,
    currentProject: currentProject ? asKnowledgeProject(currentProject) : undefined,
    taxonomy: { categories, disciplines, years, clients, tags },
  };
}

export function formatKnowledgeForModel(snapshot: PortfolioKnowledgeSnapshot): string {
  return JSON.stringify(
    {
      mandate: "This snapshot is the source of truth for portfolio facts. Do not invent facts that are absent here.",
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
      taxonomy: snapshot.taxonomy,
    },
    null,
    2,
  );
}
