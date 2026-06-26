import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Search, X, Layers, Play } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import {
  PROJECT_CATEGORIES,
  normalizeCategory,
  type DbProject,
} from "@/lib/cms";
import { aspectFromDims } from "@/lib/image-utils";

const ALL_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;

function attachmentCount(p: DbProject) {
  return (p.cover_url ? 1 : 0) + (p.gallery?.length ?? 0);
}

function ProjectCard({ project, index }: { project: DbProject; index: number }) {
  const ratio = aspectFromDims(project.cover_width, project.cover_height) || "4 / 5";
  const palette = project.palette || "from-[#01040A] via-[#071A33] to-[#0B3B73]";
  const count = attachmentCount(project);
  const showCount = count > 2;
  const slug = project.slug || project.id;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030814] text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] focus:outline-none focus:ring-2 focus:ring-sky-300/60"
      >
        <div
          className="relative w-full overflow-hidden bg-[#01040A]"
          style={{ aspectRatio: ratio }}
        >
          {project.cover_url ? (
            <img
              src={project.cover_url}
              alt={project.title}
              width={project.cover_width ?? undefined}
              height={project.cover_height ?? undefined}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-[1.015]"
            />
          ) : (
            <div className={clsx("absolute inset-0 bg-gradient-to-br", palette)} />
          )}
          {showCount && (
            <div className="mono pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#01040A]/75 px-2.5 py-1 text-[10px] tracking-[0.16em] text-slate-200 backdrop-blur">
              <Layers size={11} strokeWidth={1.8} />
              {count} files
            </div>
          )}
          {project.video_url && (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/30 bg-[#01040A]/55 text-white backdrop-blur transition group-hover:scale-105">
                <Play size={20} strokeWidth={1.8} className="translate-x-[1px]" />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-1 items-end justify-between gap-3 border-t border-white/[0.06] bg-[#030814] px-5 py-4">
          <div className="min-w-0">
            {project.client_name && (
              <div className="truncate text-[13px] font-medium text-slate-100">
                {project.client_name}
              </div>
            )}
            <div className="mono mt-1 text-[10px] tracking-[0.18em] text-slate-500">
              {project.year ?? "-"} · {project.category}
            </div>
            <div className="display mt-1.5 truncate text-base leading-tight tracking-[-0.02em] text-slate-200">
              {project.title}
            </div>
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.1] bg-white/[0.02] text-slate-300 transition group-hover:border-sky-300/40 group-hover:text-sky-200">
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function useDebounced<T>(value: T, delay = 180) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function PortfolioGrid() {
  const { data: projects = [], isLoading } = useProjects();
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return projects.filter((p) => {
      const cat = normalizeCategory(p.category);
      if (filter !== "All" && cat !== filter) return false;
      if (!q) return true;
      const title = p.title.toLowerCase();
      const year = (p.year ?? "").toLowerCase();
      const client = (p.client_name ?? "").toLowerCase();
      return title.includes(q) || year.includes(q) || client.includes(q);
    });
  }, [filter, projects, debouncedQuery]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-1 md:flex-wrap md:overflow-visible">
          {ALL_CATEGORIES.map((category) => {
            const isActive = filter === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilter(category)}
                className={clsx(
                  "mono shrink-0 rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] transition duration-300",
                  isActive
                    ? "border-sky-300/35 bg-sky-300/[0.1] text-sky-100"
                    : "border-white/[0.1] bg-white/[0.025] text-slate-400 hover:border-sky-300/25 hover:text-white",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
        <div className="relative w-full md:w-72">
          <Search
            size={14}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client, title or year"
            aria-label="Search portfolio"
            className="w-full rounded-full border border-white/[0.1] bg-white/[0.025] py-2 pl-9 pr-9 text-sm text-slate-200 placeholder:text-slate-500 focus:border-sky-300/40 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-slate-500 hover:text-white"
            >
              <X size={12} strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] py-20 text-center">
          <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">No results</div>
          <p className="mt-3 max-w-sm text-sm text-slate-400">
            No projects match your search. Try a different title, year or category.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
