import { useEffect, useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowUpRight, Search, X, Layers, Play } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import { PROJECT_CATEGORIES, normalizeCategory, type DbProject } from "@/lib/cms";
import type { PortfolioSearch } from "@/routes/portfolio.index";
import { ContextualCursor } from "@/components/portfolio/ContextualCursor";

const ALL_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;

function attachmentCount(p: DbProject) {
  return (p.cover_url ? 1 : 0) + (p.gallery?.length ?? 0);
}

function ProjectCard({ project, index = 0 }: { project: DbProject; index?: number }) {
  const count = attachmentCount(project);
  const showCount = count > 2;
  const slug = project.slug || project.id;

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{
        duration: 0.65,
        delay: Math.min((index % 2) * 0.08, 0.16),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex flex-col w-full col-span-1"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug }}
        data-cursor={project.video_url ? "PLAY" : "VIEW"}
        className="flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)] rounded-sm"
      >
        {/* Media Frame - Preserves artwork aspect ratio without cropping */}
        <div className="relative w-full overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border-subtle)] transition-colors duration-500 group-hover:border-[var(--color-border-base)]">
          {project.cover_url ? (
            <motion.img
              layoutId={`project-cover-${project.id}`}
              src={project.cover_url}
              alt={project.title}
              width={project.cover_width ?? undefined}
              height={project.cover_height ?? undefined}
              loading="lazy"
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              className="transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.025]"
            />
          ) : (
            <div className="aspect-[4/3] w-full flex items-center justify-center text-[var(--color-text-muted)] mono text-xs">
              No artwork
            </div>
          )}

          {/* Floating Hover Badge on Desktop */}
          <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <span className="mono inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)]/90 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-primary)] border border-white/20 backdrop-blur-md shadow-lg">
              VIEW PROJECT <ArrowUpRight size={12} strokeWidth={2} />
            </span>
          </div>

          {showCount && (
            <div className="mono pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 bg-[var(--color-bg)]/80 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[var(--color-text-primary)] backdrop-blur-md border border-white/10">
              <Layers size={10} strokeWidth={2} />
              {count}
            </div>
          )}

          {project.video_url && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg)]/60 text-white backdrop-blur-md border border-white/15 transition-transform duration-300 group-hover:scale-110">
                <Play size={20} strokeWidth={1.5} className="translate-x-[2px]" />
              </div>
            </div>
          )}
        </div>

        {/* Metadata Hierarchy - Uniform across all archive projects */}
        <div className="flex flex-col gap-1.5 px-0.5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.01em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-[1.1]">
              {project.title}
            </h3>
            <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-text-primary)] transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
              <ArrowUpRight size={18} strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-text-secondary)] mt-0.5">
            {project.client_name && (
              <>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {project.client_name}
                </span>
                <span className="text-[var(--color-text-muted)] opacity-40">/</span>
              </>
            )}
            <span className="mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-text-secondary)]">
              {project.category}
            </span>
            {project.year && (
              <>
                <span className="text-[var(--color-text-muted)] opacity-40">/</span>
                <span className="mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
                  {project.year}
                </span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function PortfolioGrid() {
  const { data: projects = [], isLoading } = useProjects();
  const searchParams = useSearch({ from: "/portfolio/", strict: false }) as
    PortfolioSearch | undefined;
  const navigate = useNavigate();

  // Initialize state from URL search params if present
  const categoryParam =
    searchParams?.category && (ALL_CATEGORIES as readonly string[]).includes(searchParams.category)
      ? searchParams.category
      : "All";
  const queryParam = searchParams?.q || "";

  const [filter, setFilter] = useState<string>(categoryParam);
  const [query, setQuery] = useState<string>(queryParam);

  // Sync state if URL query changes externally (e.g. back/forward button)
  useEffect(() => {
    setFilter(categoryParam);
    setQuery(queryParam);
  }, [categoryParam, queryParam]);

  // Update URL search parameters without reloading
  const updateUrlState = useCallback(
    (newFilter: string, newQuery: string) => {
      const searchObj: Record<string, string> = {};
      if (newFilter && newFilter !== "All") {
        searchObj.category = newFilter;
      }
      if (newQuery.trim()) {
        searchObj.q = newQuery.trim();
      }
      navigate({
        to: "/portfolio",
        search: searchObj,
        replace: true,
      }).catch(() => {});
    },
    [navigate],
  );

  const handleFilterChange = (category: string) => {
    setFilter(category);
    updateUrlState(category, query);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    updateUrlState(filter, val);
  };

  const handleReset = () => {
    setFilter("All");
    setQuery("");
    updateUrlState("All", "");
  };

  const publishedProjects = useMemo(() => {
    return projects.filter((p) => p.is_published !== false);
  }, [projects]);

  // Smart search across title, client, year, discipline, category, tags, role, concept, description
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedProjects.filter((p) => {
      const cat = normalizeCategory(p.category);
      if (filter !== "All" && cat !== filter) return false;
      if (!q) return true;

      const title = (p.title ?? "").toLowerCase();
      const year = (p.year ?? "").toLowerCase();
      const client = (p.client_name ?? "").toLowerCase();
      const role = (p.role ?? "").toLowerCase();
      const concept = (p.concept ?? "").toLowerCase();
      const description = (p.description ?? "").toLowerCase();
      const tags = (p.tags ?? []).join(" ").toLowerCase();
      const deliverables = (p.deliverables ?? []).join(" ").toLowerCase();
      const categoryName = (p.category ?? "").toLowerCase();

      return (
        title.includes(q) ||
        year.includes(q) ||
        client.includes(q) ||
        role.includes(q) ||
        concept.includes(q) ||
        description.includes(q) ||
        tags.includes(q) ||
        deliverables.includes(q) ||
        categoryName.includes(q)
      );
    });
  }, [filter, publishedProjects, query]);

  return (
    <div className="w-full relative">
      <ContextualCursor />

      {/* Control Bar: Categories & Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-12 md:mb-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-[var(--color-border-subtle)] pb-8"
      >
        <LayoutGroup id="portfolio-categories">
          <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-2 md:pb-0 md:flex-wrap md:overflow-visible no-scrollbar">
            {ALL_CATEGORIES.map((category) => {
              const isActive = filter === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleFilterChange(category)}
                  className={clsx(
                    "relative mono shrink-0 rounded-full px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-300",
                    isActive
                      ? "text-[var(--color-bg)] font-bold"
                      : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-base)]",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryHighlight"
                      className="absolute inset-0 bg-[var(--color-text-primary)] rounded-full z-0"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* Search Input & Live Count */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          {!isLoading && (
            <span className="mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-muted)] self-center sm:self-auto shrink-0">
              Showing {filtered.length} of {publishedProjects.length}
            </span>
          )}

          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search archive..."
              aria-label="Search portfolio archive"
              className="w-full rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] py-3 pl-11 pr-10 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-hover)] focus:bg-[var(--color-surface-elevated)] focus:outline-none transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Grid States */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 col-span-1">
              <div className="aspect-[4/3] bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] animate-pulse" />
              <div className="h-6 w-2/3 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
              <div className="h-3 w-1/3 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="grid place-items-center border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-28 px-6 text-center"
        >
          <div className="mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-3">
            No matching projects
          </div>
          <p className="max-w-md text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
            {query
              ? `No projects found for "${query}"${filter !== "All" ? ` in category "${filter}"` : ""}.`
              : `No projects found in category "${filter}".`}
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-6 mono text-[11px] tracking-[0.15em] uppercase font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-text-primary)] pb-0.5 hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)] transition-colors"
          >
            Clear filters & search
          </button>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
