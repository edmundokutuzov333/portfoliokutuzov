import { useQuery } from "@tanstack/react-query";
import type { DbProject } from "@/lib/cms";

export type PortfolioCaseSection = {
  id: string;
  section_type: string;
  heading: string | null;
  body: string | null;
  sort_order: number;
};

export type PortfolioCaseMedia = {
  id: string;
  media_type: string;
  url: string;
  poster_url: string | null;
  alt: string | null;
  caption: string | null;
  width: number | null;
  height: number | null;
  sort_order: number;
  is_featured: boolean;
};

export type PortfolioCaseMetric = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type PortfolioCaseCredit = {
  id: string;
  role: string;
  name: string;
  organization: string | null;
  sort_order: number;
};

export type PortfolioCaseRelation = {
  id: string;
  related_project_id: string;
  relation_type: string;
  sort_order: number;
};

export type PortfolioCaseResponse = {
  project: DbProject;
  sections: PortfolioCaseSection[];
  media: PortfolioCaseMedia[];
  metrics: PortfolioCaseMetric[];
  credits: PortfolioCaseCredit[];
  relations: PortfolioCaseRelation[];
  related: DbProject[];
};

async function fetchPortfolioCase(slug: string): Promise<PortfolioCaseResponse> {
  const response = await fetch("/api/portfolio-case/" + encodeURIComponent(slug), {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error("PORTFOLIO_CASE_READ_FAILED");
  return (await response.json()) as PortfolioCaseResponse;
}

export function usePortfolioCase(slug: string) {
  return useQuery({
    queryKey: ["portfolio-case", slug],
    queryFn: () => fetchPortfolioCase(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  });
}
