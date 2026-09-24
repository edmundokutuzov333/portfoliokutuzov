import type { DbProject } from "@/lib/cms";
import { SITE_ORIGIN } from "@/lib/seo";

export type CaseStudySectionType =
  | "context"
  | "challenge"
  | "direction"
  | "execution"
  | "outcome"
  | "custom";

export type CaseStudySection = {
  id: string;
  project_id: string;
  section_type: CaseStudySectionType;
  heading: string | null;
  body: string | null;
  sort_order: number;
};

export type CaseStudyMedia = {
  id?: string;
  project_id?: string;
  media_type: "image" | "video" | "embed" | string;
  url: string;
  poster_url?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  sort_order?: number;
  is_featured?: boolean;
};

export type CaseStudyMetric = {
  id: string;
  project_id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type CaseStudyCredit = {
  id: string;
  project_id: string;
  role: string;
  name: string;
  organization: string | null;
  sort_order: number;
};

export type CaseStudyPayload = {
  project: DbProject;
  sections: CaseStudySection[];
  media: CaseStudyMedia[];
  metrics: CaseStudyMetric[];
  credits: CaseStudyCredit[];
  previous: DbProject | null;
  next: DbProject | null;
  related: DbProject[];
};

export type CaseStudyTemplate = "editorial" | "gallery";

export const CASE_STUDY_FALLBACK_WORK = "#2f4bff";

export function projectKey(project: Pick<DbProject, "id" | "slug">): string {
  return project.slug || project.id;
}

export function projectDisplayName(project: Pick<DbProject, "title" | "client_name">): string {
  return project.client_name?.trim() || project.title;
}

export function firstHexColor(value: string | null | undefined, fallback = CASE_STUDY_FALLBACK_WORK): string {
  const raw = String(value ?? "");
  const match = raw.match(/#[0-9a-f]{6}\b/i) || raw.match(/#[0-9a-f]{3}\b/i);
  return match ? match[0].toLowerCase() : fallback;
}

export function getCaseStudyMedia(project: DbProject, relationalMedia: CaseStudyMedia[]): CaseStudyMedia[] {
  if (relationalMedia.length) return relationalMedia.filter((item) => Boolean(item.url));

  if (project.gallery_meta?.length) {
    return project.gallery_meta
      .filter((item) => Boolean(item.url))
      .map((item, index) => ({
        id: "gallery-" + String(index + 1),
        project_id: project.id,
        media_type: "image",
        url: item.url,
        width: item.width ?? null,
        height: item.height ?? null,
        alt: item.alt ?? null,
        sort_order: index,
      }));
  }

  return (project.gallery ?? [])
    .filter(Boolean)
    .map((url, index) => ({
      id: "gallery-" + String(index + 1),
      project_id: project.id,
      media_type: "image",
      url,
      sort_order: index,
    }));
}

export function getCaseStudyTemplate(
  payload: Pick<CaseStudyPayload, "sections" | "media" | "metrics" | "credits">,
): CaseStudyTemplate {
  return payload.sections.length || payload.media.length || payload.metrics.length || payload.credits.length
    ? "editorial"
    : "gallery";
}

export function caseStudyOgImageUrl(slug: string): string {
  return SITE_ORIGIN + "/api/portfolio/" + encodeURIComponent(slug) + "/og";
}

export function caseStudyPdfUrl(slug: string): string {
  return SITE_ORIGIN + "/api/portfolio/" + encodeURIComponent(slug) + "/pdf";
}
