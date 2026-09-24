import type { DbProject } from "@/lib/cms";
import { normalizeCategory } from "@/lib/cms";

export type ServiceDisciplineId = "identity" | "art-direction" | "editorial" | "digital";

export type ServiceDisciplineConfig = {
  id: ServiceDisciplineId;
  archiveCategories: string[];
  keywords: Array<[string, number]>;
  categoryWeights: Record<string, number>;
};

export const SERVICE_DISCIPLINE_CONFIGS: ServiceDisciplineConfig[] = [
  {
    id: "identity",
    archiveCategories: ["Digital Design", "Web Design"],
    keywords: [
      ["identity", 6],
      ["system", 5],
      ["architecture", 4],
      ["institutional", 3],
      ["brand", 2],
    ],
    categoryWeights: { "Digital Design": 2, "Web Design": 2 },
  },
  {
    id: "art-direction",
    archiveCategories: ["Ad Campaigns", "Videos"],
    keywords: [
      ["art direction", 6],
      ["photography direction", 5],
      ["campaign", 4],
      ["motion", 3],
      ["key visual", 2],
    ],
    categoryWeights: { "Ad Campaigns": 5, Videos: 4 },
  },
  {
    id: "editorial",
    archiveCategories: ["Digital Design", "Web Design", "Ad Campaigns"],
    keywords: [
      ["editorial", 5],
      ["print", 5],
      ["poster", 5],
      ["publication", 4],
      ["print + digital", 3],
    ],
    categoryWeights: { "Digital Design": 2, "Web Design": 1, "Ad Campaigns": 1 },
  },
  {
    id: "digital",
    archiveCategories: ["Social Media", "Digital Design", "Videos", "Web Design"],
    keywords: [
      ["digital", 5],
      ["content", 4],
      ["social", 3],
      ["motion", 3],
      ["launch", 2],
      ["template", 2],
    ],
    categoryWeights: {
      "Social Media": 5,
      Videos: 4,
      "Digital Design": 3,
      "Web Design": 3,
    },
  },
];

function scoreProject(project: DbProject, config: ServiceDisciplineConfig): number {
  const category = normalizeCategory(project.category);
  const searchable = [
    project.title,
    project.subtitle,
    project.description,
    project.client_name,
    category,
    ...(project.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = config.categoryWeights[category] ?? 0;

  for (const [keyword, weight] of config.keywords) {
    if (searchable.includes(keyword)) score += weight;
  }

  return score;
}

export function selectServiceProjects(
  projects: DbProject[],
  config: ServiceDisciplineConfig,
  max = 4,
): DbProject[] {
  return projects
    .filter((project) => project.is_published !== false && scoreProject(project, config) > 0)
    .map((project) => ({ project, score: scoreProject(project, config) }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.project.sort_order - b.project.sort_order ||
        a.project.title.localeCompare(b.project.title),
    )
    .slice(0, max)
    .map(({ project }) => project);
}

export function disciplineArchiveQuery(config: ServiceDisciplineConfig): string {
  return config.archiveCategories.join(",");
}

export function serviceBriefType(id: ServiceDisciplineId): string {
  switch (id) {
    case "identity":
      return "Brand Identity";
    case "art-direction":
      return "Art Direction";
    case "editorial":
      return "Visual Systems";
    case "digital":
      return "Web Design";
  }
}
