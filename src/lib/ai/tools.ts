import { Type, FunctionDeclaration } from "@google/genai";
import {
  getProductionProjects,
  getProductionClients,
  SITE_INFO,
  SERVICES_KNOWLEDGE,
  EXPERIENCE_KNOWLEDGE,
  CREATIVE_PROCESS,
} from "./knowledge";

export const searchProjectsDecl: FunctionDeclaration = {
  name: "searchProjects",
  description:
    "Search and filter projects from Edmundo Kutuzov's real portfolio using keywords, category, client, year, discipline, or tags.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      query: {
        type: Type.STRING,
        description: "Text query searching titles, descriptions, and concepts",
      },
      client: {
        type: Type.STRING,
        description: "Filter by client name (e.g. Absa, Vodacom, TotalEnergies)",
      },
      year: {
        type: Type.STRING,
        description: "Filter by project year (e.g. 2024, 2023)",
      },
      category: {
        type: Type.STRING,
        description: "Category: Ad Campaigns, Social Media, Videos, Web Design, Image Manipulation",
      },
      discipline: {
        type: Type.STRING,
        description: "Discipline such as Brand Identity, Art Direction, Editorial, Digital Design",
      },
      tag: {
        type: Type.STRING,
        description: "Specific tag or deliverable",
      },
    },
  },
};

export const getProjectDecl: FunctionDeclaration = {
  name: "getProject",
  description: "Get detailed information about a specific project by slug, title, or ID.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      slugOrTitle: {
        type: Type.STRING,
        description: "The slug or title of the project to retrieve",
      },
    },
    required: ["slugOrTitle"],
  },
};

export const filterProjectsDecl: FunctionDeclaration = {
  name: "filterProjects",
  description: "Filter projects strictly by category or year.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      category: { type: Type.STRING, description: "Category to filter by" },
      year: { type: Type.STRING, description: "Year to filter by" },
    },
  },
};

export const getRelatedProjectsDecl: FunctionDeclaration = {
  name: "getRelatedProjects",
  description:
    "Find real related projects based on shared client, category, discipline, and visual tags.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      slug: {
        type: Type.STRING,
        description: "The slug or title of the current project",
      },
    },
    required: ["slug"],
  },
};

export const getClientDecl: FunctionDeclaration = {
  name: "getClient",
  description:
    "Get information about a specific client or brand Edmundo has collaborated with, including all projects created for them.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      clientName: {
        type: Type.STRING,
        description: "Name of the client (e.g., Absa, Vodacom, TotalEnergies, Pernod Ricard)",
      },
    },
    required: ["clientName"],
  },
};

export const getExperienceDecl: FunctionDeclaration = {
  name: "getExperience",
  description:
    "Get Edmundo Kutuzov's professional background, career timeline, studios/agencies, and key metrics.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const getServicesDecl: FunctionDeclaration = {
  name: "getServices",
  description:
    "Get creative capabilities, disciplines, deliverables, and service scopes offered by Edmundo Kutuzov.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const getCredentialsDecl: FunctionDeclaration = {
  name: "getCredentials",
  description:
    "Get verified credentials, career stats (6+ years, 150+ projects, 30+ brands, 3 continents), and notable achievements.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const getSiteInfoDecl: FunctionDeclaration = {
  name: "getSiteInfo",
  description:
    "Get verified information about Edmundo Kutuzov, location (Maputo, Mozambique), role, bio, and creative process.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const getAvailabilityDecl: FunctionDeclaration = {
  name: "getAvailability",
  description:
    "Check current availability status for freelance, commissions, and creative advisory engagements.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const getContactMethodsDecl: FunctionDeclaration = {
  name: "getContactMethods",
  description:
    "Get verified contact channels: direct email, WhatsApp number & link, LinkedIn, and booking options.",
  parameters: {
    type: Type.OBJECT,
    properties: {},
  },
};

export const startBriefDecl: FunctionDeclaration = {
  name: "startBrief",
  description:
    "Activate the interactive project brief flow to help the user specify their goals, timeline, deliverables, and scope.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      projectType: {
        type: Type.STRING,
        description:
          "The anticipated project type if mentioned (e.g., Brand Identity, Campaign, Art Direction)",
      },
    },
  },
};

export const navigateActionDecl: FunctionDeclaration = {
  name: "navigateAction",
  description:
    "Trigger an in-app navigation action or open an external communication link (WhatsApp, Email, Calendar).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description:
          "Target action: 'open_project', 'open_portfolio', 'open_services', 'open_credentials', 'open_contact', 'open_whatsapp', 'open_calendar', 'open_email'",
      },
      projectSlug: {
        type: Type.STRING,
        description:
          "The project slug if navigating to a specific project (e.g., 'absa', 'vodacom')",
      },
    },
    required: ["action"],
  },
};

export const allTools: FunctionDeclaration[] = [
  searchProjectsDecl,
  getProjectDecl,
  filterProjectsDecl,
  getRelatedProjectsDecl,
  getClientDecl,
  getExperienceDecl,
  getServicesDecl,
  getCredentialsDecl,
  getSiteInfoDecl,
  getAvailabilityDecl,
  getContactMethodsDecl,
  startBriefDecl,
  navigateActionDecl,
];

export type ToolHandlerFn = (args: Record<string, unknown>) => Promise<Record<string, unknown>>;

export const toolHandlers: Record<string, ToolHandlerFn> = {
  searchProjects: async (args) => {
    const projects = await getProductionProjects();
    let filtered = projects;

    const clientArg = typeof args.client === "string" ? args.client.toLowerCase() : "";
    if (clientArg) {
      filtered = filtered.filter(
        (p) =>
          p.client.toLowerCase().includes(clientArg) || p.title.toLowerCase().includes(clientArg),
      );
    }
    const yearArg = typeof args.year === "string" ? args.year : "";
    if (yearArg) {
      filtered = filtered.filter((p) => p.year.includes(yearArg));
    }
    const categoryArg = typeof args.category === "string" ? args.category.toLowerCase() : "";
    if (categoryArg) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(categoryArg));
    }
    const disciplineArg = typeof args.discipline === "string" ? args.discipline.toLowerCase() : "";
    if (disciplineArg) {
      filtered = filtered.filter(
        (p) =>
          p.discipline.toLowerCase().includes(disciplineArg) ||
          p.category.toLowerCase().includes(disciplineArg),
      );
    }
    const tagArg = typeof args.tag === "string" ? args.tag.toLowerCase() : "";
    if (tagArg) {
      filtered = filtered.filter((p) => p.tags.some((tag) => tag.toLowerCase().includes(tagArg)));
    }
    const queryArg = typeof args.query === "string" ? args.query.toLowerCase() : "";
    if (queryArg) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(queryArg) ||
          p.description.toLowerCase().includes(queryArg) ||
          p.client.toLowerCase().includes(queryArg) ||
          p.category.toLowerCase().includes(queryArg) ||
          p.tags.some((tag) => tag.toLowerCase().includes(queryArg)),
      );
    }

    return {
      results: filtered.map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        year: p.year,
        category: p.category,
        discipline: p.discipline,
        description: p.description,
        thumbnail: p.thumbnail,
        slug: p.slug,
        tags: p.tags,
      })),
      count: filtered.length,
    };
  },

  getProject: async (args) => {
    const projects = await getProductionProjects();
    const query = typeof args.slugOrTitle === "string" ? args.slugOrTitle.toLowerCase().trim() : "";
    const project = projects.find(
      (p) =>
        p.slug.toLowerCase() === query ||
        p.title.toLowerCase() === query ||
        p.id === query ||
        p.slug.toLowerCase().includes(query) ||
        p.title.toLowerCase().includes(query),
    );

    if (!project) {
      return {
        found: false,
        error: `No project found matching "${query}".`,
      };
    }

    return {
      found: true,
      project: {
        id: project.id,
        title: project.title,
        client: project.client,
        year: project.year,
        category: project.category,
        discipline: project.discipline,
        description: project.description,
        thumbnail: project.thumbnail,
        images: project.images,
        slug: project.slug,
        tags: project.tags,
        role: project.role,
        services: project.services,
      },
    };
  },

  filterProjects: async (args) => {
    const projects = await getProductionProjects();
    let filtered = projects;
    const catArg = typeof args.category === "string" ? args.category.toLowerCase() : "";
    if (catArg) {
      filtered = filtered.filter((p) => p.category.toLowerCase().includes(catArg));
    }
    const yrArg = typeof args.year === "string" ? args.year : "";
    if (yrArg) {
      filtered = filtered.filter((p) => p.year.includes(yrArg));
    }
    return {
      results: filtered.map((p) => ({
        id: p.id,
        title: p.title,
        client: p.client,
        year: p.year,
        category: p.category,
        thumbnail: p.thumbnail,
        slug: p.slug,
      })),
      count: filtered.length,
    };
  },

  getRelatedProjects: async (args) => {
    const projects = await getProductionProjects();
    const targetSlug = typeof args.slug === "string" ? args.slug.toLowerCase() : "";
    const target = projects.find(
      (p) => p.slug.toLowerCase() === targetSlug || p.title.toLowerCase() === targetSlug,
    );

    if (!target) {
      return { found: false, results: [] };
    }

    const scored = projects
      .filter((p) => p.id !== target.id)
      .map((p) => {
        let score = 0;
        if (p.category.toLowerCase() === target.category.toLowerCase()) score += 3;
        if (p.client.toLowerCase() === target.client.toLowerCase()) score += 4;
        const sharedTags = p.tags.filter((t) => target.tags.includes(t));
        score += sharedTags.length * 2;
        return { project: p, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => ({
        id: item.project.id,
        title: item.project.title,
        client: item.project.client,
        year: item.project.year,
        category: item.project.category,
        thumbnail: item.project.thumbnail,
        slug: item.project.slug,
        tags: item.project.tags,
      }));

    return { found: true, results: scored, count: scored.length };
  },

  getClient: async (args) => {
    const clients = await getProductionClients();
    const projects = await getProductionProjects();
    const name = typeof args.clientName === "string" ? args.clientName.toLowerCase() : "";

    const matchedClient = clients.find((c) => c.toLowerCase().includes(name));
    const clientProjects = projects.filter(
      (p) => p.client.toLowerCase().includes(name) || p.title.toLowerCase().includes(name),
    );

    return {
      client: matchedClient || name,
      isVerifiedClient: Boolean(matchedClient),
      projects: clientProjects.map((p) => ({
        id: p.id,
        title: p.title,
        year: p.year,
        category: p.category,
        slug: p.slug,
        thumbnail: p.thumbnail,
      })),
    };
  },

  getExperience: async () => {
    return {
      bio: SITE_INFO.bio,
      experience: EXPERIENCE_KNOWLEDGE,
      metrics: {
        years: SITE_INFO.yearsOfExperience,
        projects: SITE_INFO.projectsDelivered,
        brands: SITE_INFO.brandsCollaborated,
        continents: SITE_INFO.continentsActive,
      },
    };
  },

  getServices: async () => {
    return {
      services: SERVICES_KNOWLEDGE,
      process: CREATIVE_PROCESS,
    };
  },

  getCredentials: async () => {
    const clients = await getProductionClients();
    return {
      metrics: {
        years: SITE_INFO.yearsOfExperience,
        projects: SITE_INFO.projectsDelivered,
        brands: SITE_INFO.brandsCollaborated,
        continents: SITE_INFO.continentsActive,
      },
      experience: EXPERIENCE_KNOWLEDGE,
      notableClients: clients,
    };
  },

  getSiteInfo: async () => {
    return {
      ...SITE_INFO,
      process: CREATIVE_PROCESS,
    };
  },

  getAvailability: async () => {
    return {
      status: "Available",
      details: SITE_INFO.availability,
      bookingMethod: "Schedule a discovery conversation or send a project brief directly.",
    };
  },

  getContactMethods: async () => {
    return {
      email: SITE_INFO.contact.email,
      whatsapp: SITE_INFO.contact.whatsapp,
      whatsappLink: SITE_INFO.contact.whatsappLink,
      linkedin: SITE_INFO.contact.linkedin,
      location: SITE_INFO.contact.location,
    };
  },

  startBrief: async (args) => {
    return {
      status: "brief_started",
      projectType: typeof args.projectType === "string" ? args.projectType : null,
      steps: [
        "1. Identify project goals & brand context",
        "2. Define key deliverables (Identity, Campaign, Digital, Motion)",
        "3. Timeline & Target rollout date",
        "4. Scope & Budget expectations",
      ],
      message:
        "Guided briefing activated. Ask the user about their vision and deliverables step by step.",
    };
  },

  navigateAction: async (args) => {
    return {
      executed: true,
      action: args.action,
      projectSlug: typeof args.projectSlug === "string" ? args.projectSlug : null,
    };
  },
};
