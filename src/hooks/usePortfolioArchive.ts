import { useInfiniteQuery } from "@tanstack/react-query";
import type { DbProject } from "@/lib/cms";

export type PortfolioFilters = { categories: string[]; years: string[]; clients: string[]; query: string };
export type PortfolioFacets = { categories: Record<string, number>; years: Record<string, number>; clients: Record<string, number>; categoryOrder: string[] };
export type PortfolioPage = { projects: DbProject[]; count: number; total: number; page: number; limit: number; nextPage: number | null; hasMore: boolean; facets?: PortfolioFacets };

function buildSearch(filters: PortfolioFilters, page: number, limit: number) {
  const params = new URLSearchParams();
  if (filters.categories.length) params.set("d", filters.categories.join(","));
  if (filters.years.length) params.set("y", filters.years.join(","));
  if (filters.clients.length) params.set("c", filters.clients.join(","));
  if (filters.query.trim()) params.set("q", filters.query.trim());
  params.set("page", String(page));
  params.set("limit", String(limit));
  return params;
}

async function fetchPortfolioPage(filters: PortfolioFilters, page: number): Promise<PortfolioPage> {
  const params = buildSearch(filters, page, 24);
  const response = await fetch("/api/portfolio-projects?" + params.toString(), { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("PORTFOLIO_READ_FAILED");
  return (await response.json()) as PortfolioPage;
}

export function usePortfolioArchive(filters: PortfolioFilters) {
  return useInfiniteQuery({
    queryKey: ["portfolio-archive", filters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchPortfolioPage(filters, pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 60_000,
  });
}

export async function prefetchPortfolioProject(slug: string): Promise<PortfolioPage> {
  if (!slug) throw new Error("MISSING_PROJECT_SLUG");
  const response = await fetch("/api/portfolio-projects?slug=" + encodeURIComponent(slug) + "&limit=1", { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("PORTFOLIO_PROJECT_PREFETCH_FAILED");
  return (await response.json()) as PortfolioPage;
}
