import { useQuery } from "@tanstack/react-query";
import type { CaseStudyPayload } from "@/lib/case-study";

export function useCaseStudy(slug: string) {
  return useQuery({
    queryKey: ["case-study", slug],
    queryFn: async (): Promise<CaseStudyPayload> => {
      const response = await fetch(
        "/api/portfolio-case-study?slug=" + encodeURIComponent(slug),
      );

      if (!response.ok) {
        throw new Error("Case study could not be loaded.");
      }

      return (await response.json()) as CaseStudyPayload;
    },
    staleTime: 60_000,
    retry: 1,
  });
}
