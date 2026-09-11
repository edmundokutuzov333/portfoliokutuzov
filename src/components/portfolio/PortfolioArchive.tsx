import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowUpRight, Layers, Play, Search, X } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import { PROJECT_CATEGORIES, normalizeCategory, type DbProject } from "@/lib/cms";
import type { PortfolioSearch } from "@/routes/portfolio.index";
import { ContextualCursor } from "@/components/portfolio/ContextualCursor";

const ALL_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;

function ProjectCard({ project, index }: { project: DbProject; index: number }) {
  const count = (project.cover_url ? 1 : 0) + (project.gallery?.length ?? 0);
  const slug = project.slug || project.id;

  return (
    <article
      data-testid="portfolio-project-card"
      data-project-slug={slug}
      className="group flex w-full flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug }}
        data-cursor={project.video_url ? "PLAY" : "VIEW"}
        className="flex flex-col gap-4 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]"
      >
        <div className="relative w-full overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-surface)] transition-colors duration-500 group-hover:border-[var(--color-border-base)]">
          {project.cover_url ? (
            <img
              src={project.cover_url}
              alt={project.title}
              width={project.cover_width ?? undefined}
              height={project.cover_height ?? undefined}
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={index < 2 ? "high" : "auto"}
              style={{ display: "block", width: "100%", height: "auto", objectFit: "contain" }}
              className="transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.025]"
            />
          ) : (
            <div className="flex aspect-[4/3] w-full items-center justify-center text-[var(--color-text-muted)] mono text-xs">
              No artwork
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-2 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="mono inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-[var(--color-bg)]/90 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-primary)] shadow-lg backdrop-blur-md">
              VIEW PROJECT <ArrowUpRight size={12} strokeWidth={2} />
            </span>
          </div>

          {count > 2 && (
            <div className="mono pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 border border-white/10 bg-[var(--color-bg)]/80 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[var(--color-text-primary)] backdrop-blur-md">
              <Layers size={10} strokeWidth={2} /> {count}
            </div>
          )}

          {project.video_url && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-[var(--color-bg)]/60 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                <Play size={20} strokeWidth={1.5} className="translate-x-[2px]" />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-0.5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="display text-2xl leading-[1.1] tracking-[-0.01em] text-[var(--color-text-primary)] transition-colors group-hover:text-[var(--color-accent-hover)] md:text-3xl lg:text-4xl">
              {project.title}
            </h2>
            <ArrowUpRight size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-[var(--color-text-muted)] opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-[var(--color-text-primary)] group-hover:opacity-100" />
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-text-secondary)]">
            {project.client_name && <><span className="font-medium text-[var(--color-text-primary)]">{project.client_name}</span><span className="text-[var(--color-text-muted)] opacity-40">/</span></>}
            <span className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-secondary)]">{project.category}</span>
            {project.year && <><span className="text-[var(--color-text-muted)] opacity-40">/</span><span className="mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-text-muted)]">{project.year}</span></>}
          </div>
        </div>
      </Link>
    </article>
  );
}

export function PortfolioArchive() {
  const { data: projects = [], isLoading, isFetching, isError } = useProjects();
  const searchParams = useSearch({ strict: false }) as PortfolioSearch | undefined;
  const navigate = useNavigate();
  const categoryParam = searchParams?.category && (ALL_CATEGORIES as readonly string[]).includes(searchParams.category) ? searchParams.category : "All";
  const queryParam = searchParams?.q ?? "";
  const [filter, setFilter] = useState(categoryParam);
  const [query, setQuery] = useState(queryParam);

  useEffect(() => {
    setFilter(categoryParam);
    setQuery(queryParam);
  }, [categoryParam, queryParam]);

  const updateUrlState = useCallback((newFilter: string, newQuery: string) => {
    const search: Record<string, string> = {};
    if (newFilter !== "All") search.category = newFilter;
    if (newQuery.trim()) search.q = newQuery.trim();
    void navigate({ to: "/portfolio", search, replace: true });
  }, [navigate]);

  const publishedProjects = useMemo(() => projects.filter((project) => project.is_published !== false), [projects]);
  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("en");
    return publishedProjects.filter((project) => {
      if (filter !== "All" && normalizeCategory(project.category) !== filter) return false;
      if (!q) return true;
      return [project.title, project.client_name, project.year, project.category, project.role, project.concept, project.description, ...(project.tags ?? []), ...(project.deliverables ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase("en")
        .includes(q);
    });
  }, [filter, publishedProjects, query]);

  const reset = () => {
    setFilter("All");
    setQuery("");
    updateUrlState("All", "");
  };

  return (
    <div data-testid="portfolio-archive" className="relative w-full">
      <ContextualCursor />

      <div className="mb-12 flex flex-col gap-6 border-b border-[var(--color-border-subtle)] pb-8 md:mb-16 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-2 md:flex-wrap md:overflow-visible no-scrollbar" role="tablist" aria-label="Portfolio categories">
          {ALL_CATEGORIES.map((category) => {
            const active = filter === category;
            return (
              <button key={category} type="button" role="tab" aria-selected={active} onClick={() => { setFilter(category); updateUrlState(category, query); }} className={clsx("shrink-0 rounded-full border px-4 py-2.5 mono text-[11px] tracking-[0.15em] uppercase transition-all", active ? "border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-bg)]" : "border-[var(--color-border-base)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]")}>{category}</button>
            );
          })}
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center md:w-auto">
          <span className="mono shrink-0 self-center text-[11px] uppercase tracking-[0.15em] text-[var(--color-text-muted)] sm:self-auto" aria-live="polite">
            {isLoading ? "Loading archive" : `Showing ${filtered.length} of ${publishedProjects.length}`}
          </span>
          <div className="relative w-full md:w-80">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input type="text" value={query} onChange={(event) => { const next = event.target.value; setQuery(next); updateUrlState(filter, next); }} placeholder="Search archive..." aria-label="Search portfolio archive" className="w-full rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] py-3 pl-11 pr-10 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-accent-hover)]" />
            {query && <button type="button" onClick={() => { setQuery(""); updateUrlState(filter, ""); }} aria-label="Clear search" className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"><X size={14} /></button>}
          </div>
        </div>
      </div>

      {isLoading || isFetching ? (
        <div data-testid="portfolio-loading" className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20" aria-busy="true">
          {Array.from({ length: 6 }, (_, index) => <div key={index} className="flex flex-col gap-4"><div className="aspect-[4/3] w-full animate-pulse border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]" /><div className="h-6 w-2/3 animate-pulse rounded bg-[var(--color-surface-elevated)]" /><div className="h-3 w-1/3 animate-pulse rounded bg-[var(--color-surface-elevated)]" /></div>)}
        </div>
      ) : filtered.length > 0 ? (
        <div data-testid="portfolio-project-grid" className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20">
          {filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
        </div>
      ) : (
        <div data-testid="portfolio-empty" className="grid place-items-center border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-6 py-28 text-center">
          <div className="mono mb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{isError ? "Archive temporarily unavailable" : "No matching projects"}</div>
          <p className="max-w-md text-[15px] leading-relaxed text-[var(--color-text-secondary)]">{isError ? "The archive could not be loaded from the content service. Please reload the page." : query ? `No projects found for \"${query}\".` : `No projects found in category \"${filter}\".`}</p>
          <button type="button" onClick={reset} className="mt-6 border-b border-[var(--color-text-primary)] pb-0.5 mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-primary)]">Clear filters & search</button>
        </div>
      )}
    </div>
  );
}
