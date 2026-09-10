import { useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useProjects } from "@/hooks/useSiteData";
import { SITE_ORIGIN, socialImageUrl } from "@/lib/seo";

export function ProjectEntitySchema() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: projects = [] } = useProjects();

  const schema = useMemo(() => {
    if (!pathname.startsWith("/portfolio/") || pathname === "/portfolio/") return null;
    const slug = pathname.replace(/^\/portfolio\//, "").split("/")[0];
    const project = projects.find(
      (item) => (item.slug || item.id) === slug && item.is_published !== false,
    );
    if (!project) return null;

    const image = project.cover_url || socialImageUrl();
    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${SITE_ORIGIN}/portfolio/${project.slug || project.id}#work`,
      name: project.title,
      headline: project.client_name || project.title,
      description: project.description || project.concept || `Case study for ${project.title}.`,
      url: `${SITE_ORIGIN}/portfolio/${project.slug || project.id}`,
      image: [image],
      dateCreated: project.year || undefined,
      creator: { "@id": `${SITE_ORIGIN}/#person` },
      contributor: (project.collaborators || []).map((name) => ({ "@type": "Person", name })),
      keywords: [project.category, ...(project.tags || [])].filter(Boolean).join(", "),
      about: [project.category, ...(project.tags || [])].filter(Boolean),
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
    };
  }, [pathname, projects]);

  if (!schema) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  );
}
