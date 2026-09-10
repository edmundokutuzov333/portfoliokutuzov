import { useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { trackEvent } from "@/lib/analytics";

function normalize(value: string) {
  return value
    .toLocaleLowerCase("en")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function ContextualRelatedWork() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: projects = [] } = useProjects();

  const related = useMemo(() => {
    if (!pathname.startsWith("/portfolio/")) return [];
    const slug = pathname.replace(/^\/portfolio\//, "").split("/")[0];
    const current = projects.find(
      (project) => (project.slug || project.id) === slug && project.is_published !== false,
    );
    if (!current) return [];
    return projects
      .filter((project) => project.id !== current.id && project.is_published !== false)
      .map((project) => {
        const currentTags = (current.tags || []).map(normalize);
        const projectTags = (project.tags || []).map(normalize);
        const sharedTags = projectTags.filter((tag) => currentTags.includes(tag)).length;
        let score = sharedTags * 3;
        if (normalize(project.category) === normalize(current.category)) score += 5;
        if (normalize(project.client_name || "") === normalize(current.client_name || ""))
          score += 4;
        if (normalize(project.year || "") === normalize(current.year || "")) score += 1;
        return { project, score };
      })
      .sort((a, b) => b.score - a.score || a.project.title.localeCompare(b.project.title))
      .slice(0, 3)
      .map(({ project }) => project);
  }, [pathname, projects]);

  if (!related.length) return null;

  const label = pathname.includes("/") ? "Related work" : "Selected work";
  return (
    <section
      className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg)] px-5 py-16 md:px-8 md:py-20"
      aria-label="Related work"
    >
      <div className="mx-auto max-w-[var(--width-wide)]">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <div className="mono text-[9px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]">
              {label}
            </div>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-text-secondary)]">
              A contextual continuation based on the disciplines and tags of the work you are
              viewing.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {related.map((project) => (
            <Link
              key={project.id}
              to="/portfolio/$slug"
              params={{ slug: project.slug || project.id }}
              onClick={() =>
                trackEvent({
                  action: "case_next",
                  element: "contextual_related",
                  meta: { slug: project.slug || project.id },
                })
              }
              className="group overflow-hidden border border-[var(--color-border-base)] bg-[var(--color-surface)] transition-colors hover:border-[var(--color-border-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]"
            >
              {project.cover_url ? (
                <img
                  src={project.cover_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full object-cover"
                />
              ) : (
                <div className="aspect-[16/10] w-full bg-[var(--color-surface-elevated)]" />
              )}
              <div className="flex items-start justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="mono text-[9px] tracking-[0.16em] uppercase text-[var(--color-text-muted)]">
                    {project.category}
                  </div>
                  <div className="mt-2 truncate text-sm font-medium text-[var(--color-text-primary)]">
                    {project.client_name || project.title}
                  </div>
                </div>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
