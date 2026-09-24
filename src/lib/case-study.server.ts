import { supabaseAdmin } from "@/integrations/supabase/server/index.server";
import { normalizeCategory, type DbProject } from "@/lib/cms";
import type {
  CaseStudyCredit,
  CaseStudyMedia,
  CaseStudyMetric,
  CaseStudyPayload,
  CaseStudySection,
} from "@/lib/case-study";
import { logObservability } from "@/lib/observability";

const PROJECT_FIELDS = [
  "id",
  "slug",
  "title",
  "subtitle",
  "category",
  "year",
  "description",
  "cover_url",
  "cover_width",
  "cover_height",
  "gallery",
  "tags",
  "palette",
  "span",
  "sort_order",
  "is_published",
  "featured",
  "featured_priority",
  "client_name",
  "image_fit",
  "concept",
  "idea",
  "role",
  "notes",
  "collaborators",
  "tools_used",
  "deliverables",
  "gallery_meta",
  "video_url",
  "video_provider",
].join(",");

type RawProject = Record<string, unknown>;

function projectFromRow(row: RawProject): DbProject {
  return {
    ...(row as unknown as DbProject),
    category: normalizeCategory(String(row.category ?? "")),
    gallery: Array.isArray(row.gallery) ? (row.gallery as string[]).filter(Boolean) : [],
    tags: Array.isArray(row.tags) ? (row.tags as string[]).filter(Boolean) : [],
    collaborators: Array.isArray(row.collaborators) ? (row.collaborators as string[]).filter(Boolean) : [],
    tools_used: Array.isArray(row.tools_used) ? (row.tools_used as string[]).filter(Boolean) : [],
    deliverables: Array.isArray(row.deliverables) ? (row.deliverables as string[]).filter(Boolean) : [],
    gallery_meta: Array.isArray(row.gallery_meta)
      ? (row.gallery_meta as Array<{ url: string; width?: number; height?: number; alt?: string }>).filter((item) => Boolean(item.url))
      : [],
  };
}

function bySortOrder(a: DbProject, b: DbProject): number {
  return (a.sort_order ?? 0) - (b.sort_order ?? 0);
}

async function readEditorial<T>(
  query: PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  route: string,
): Promise<T[]> {
  const result = await query;
  if (result.error) {
    logObservability("dependency_error", {
      route,
      dependency: "supabase",
      code: "CASE_STUDY_OPTIONAL_BLOCK_FAILED",
      message: result.error.message,
    });
    return [];
  }
  return result.data ?? [];
}

export async function getCaseStudyBySlug(slug: string): Promise<CaseStudyPayload | null> {
  const key = decodeURIComponent(slug).trim().slice(0, 180);
  if (!key) return null;

  const { data: projectRows, error: projectError } = await supabaseAdmin
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .limit(500);

  if (projectError) {
    logObservability("dependency_error", {
      route: "/api/portfolio-case-study",
      dependency: "supabase",
      code: "CASE_STUDY_PROJECT_READ_FAILED",
      message: projectError.message,
    });
    throw new Error("Case study project data could not be loaded.");
  }

  const projects = ((projectRows ?? []) as unknown as RawProject[]).map(projectFromRow);
  const project = projects.find((candidate) => (candidate.slug || candidate.id) === key);
  if (!project) return null;

  const [sections, media, metrics, credits, relationRows] = await Promise.all([
    readEditorial(
      supabaseAdmin
        .from("project_sections")
        .select("id,project_id,section_type,heading,body,sort_order")
        .eq("project_id", project.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }) as unknown as PromiseLike<{
        data: CaseStudySection[] | null;
        error: { message: string } | null;
      }>,
      "/api/portfolio-case-study/sections",
    ),
    readEditorial(
      supabaseAdmin
        .from("project_media")
        .select("id,project_id,media_type,url,poster_url,alt,caption,width,height,sort_order,is_featured")
        .eq("project_id", project.id)
        .eq("is_published", true)
        .order("sort_order", { ascending: true }) as unknown as PromiseLike<{
        data: CaseStudyMedia[] | null;
        error: { message: string } | null;
      }>,
      "/api/portfolio-case-study/media",
    ),
    readEditorial(
      supabaseAdmin
        .from("project_metrics")
        .select("id,project_id,label,value,sort_order")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true }) as unknown as PromiseLike<{
        data: CaseStudyMetric[] | null;
        error: { message: string } | null;
      }>,
      "/api/portfolio-case-study/metrics",
    ),
    readEditorial(
      supabaseAdmin
        .from("project_credits")
        .select("id,project_id,role,name,organization,sort_order")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true }) as unknown as PromiseLike<{
        data: CaseStudyCredit[] | null;
        error: { message: string } | null;
      }>,
      "/api/portfolio-case-study/credits",
    ),
    readEditorial(
      supabaseAdmin
        .from("project_relations")
        .select("id,project_id,related_project_id,relation_type,sort_order")
        .eq("project_id", project.id)
        .order("sort_order", { ascending: true }) as unknown as PromiseLike<{
        data: Array<{
          id: string;
          project_id: string;
          related_project_id: string;
          relation_type: string;
          sort_order: number;
        }> | null;
        error: { message: string } | null;
      }>,
      "/api/portfolio-case-study/relations",
    ),
  ]);

  const relationTargets = new Map(projects.map((candidate) => [candidate.id, candidate]));
  const getTarget = (id: string) => relationTargets.get(id) ?? null;
  const ordered = [...projects].sort(bySortOrder);
  const index = ordered.findIndex((candidate) => candidate.id === project.id);

  const explicitPrevious = relationRows.find((row) => row.relation_type === "previous");
  const explicitNext = relationRows.find((row) => row.relation_type === "next");

  const previous = explicitPrevious
    ? getTarget(explicitPrevious.related_project_id)
    : index > 0
      ? ordered[index - 1]
      : ordered[ordered.length - 1] ?? null;

  const next = explicitNext
    ? getTarget(explicitNext.related_project_id)
    : index >= 0 && ordered.length > 1
      ? ordered[index + 1] ?? ordered[0]
      : ordered[0] ?? null;

  const explicitRelated = relationRows
    .filter((row) => ["related", "same_client", "same_discipline"].includes(row.relation_type))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((row) => getTarget(row.related_project_id))
    .filter((candidate): candidate is DbProject => Boolean(candidate));

  const fallbackRelated = ordered.filter((candidate) => {
    if (candidate.id === project.id) return false;
    if (explicitRelated.some((item) => item.id === candidate.id)) return false;

    const sameClient =
      Boolean(project.client_name) &&
      Boolean(candidate.client_name) &&
      project.client_name === candidate.client_name;

    const sameDiscipline =
      normalizeCategory(candidate.category) === normalizeCategory(project.category);

    return sameClient || sameDiscipline;
  });

  return {
    project,
    sections,
    media,
    metrics,
    credits,
    previous,
    next,
    related: [...explicitRelated, ...fallbackRelated].slice(0, 3),
  };
}
