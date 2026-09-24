import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { usePortfolioArchive, prefetchPortfolioProject, type PortfolioFilters, type PortfolioFacets } from "@/hooks/usePortfolioArchive";
import { darkenWorkColor, pickFg, setWorkColor } from "@/lib/work-color";
import { PROJECT_CATEGORIES, normalizeCategory, type DbProject } from "@/lib/cms";

type SearchState = { view?: "grid" | "index"; d?: string; y?: string; c?: string; q?: string };
const DEFAULT_VIEW = "grid" as const;
const DEFAULT_FILTERS: PortfolioFilters = { categories: [], years: [], clients: [], query: "" };

function listValue(value?: string) { return [...new Set((value ?? "").split(",").map((part) => part.trim()).filter(Boolean))]; }
function joinValue(value: string[]) { return value.length ? value.join(",") : undefined; }
function paletteColor(project: DbProject) {
  const matches = project.palette?.match(/#[0-9a-f]{6}\b/gi) ?? [];
  return matches.at(-1) ?? "#2f4bff";
}
function projectAspect(project: DbProject) {
  if (project.cover_width && project.cover_height && project.cover_height > 0) return project.cover_width / project.cover_height;
  const meta = project.gallery_meta?.[0];
  if (meta?.width && meta.height && meta.height > 0) return meta.width / meta.height;
  return 4 / 3;
}
function searchKey(filters: PortfolioFilters) { return JSON.stringify(filters); }

function justifiedRows(projects: DbProject[]) {
  const rows: DbProject[][] = [];
  let row: DbProject[] = [];
  let ratio = 0;
  for (const project of projects) {
    row.push(project);
    ratio += projectAspect(project);
    if (row.length >= 3 || ratio >= 3.8) { rows.push(row); row = []; ratio = 0; }
  }
  if (row.length) rows.push(row);
  return rows;
}

function WorkPoster({ project, className = "" }: { project: DbProject; className?: string }) {
  const work = paletteColor(project);
  const dark = darkenWorkColor(work);
  const fg = pickFg(dark);
  const style = { background: dark, color: fg, "--work-local": work } as CSSProperties;
  return project.cover_url ? (
    <img src={project.cover_url} alt="" width={project.cover_width ?? 720} height={project.cover_height ?? 540} loading="lazy" decoding="async" className={"h-full w-full object-contain " + className} style={{ background: dark }} />
  ) : (
    <div className={"flex h-full w-full flex-col justify-between p-6 md:p-8 " + className} style={style}>
      <div className="flex items-start justify-between gap-4 text-sm font-semibold"><span>{normalizeCategory(project.category)}</span><span>{project.year ?? ""}</span></div>
      <div>
        <div className="font-cartaz text-[clamp(2rem,5vw,5rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">{project.title}</div>
        {project.client_name ? <div className="mt-3 text-sm font-semibold">{project.client_name}</div> : null}
      </div>
    </div>
  );
}

function ProjectLink({ project, children }: { project: DbProject; children: ReactNode }) {
  const queryClient = useQueryClient();
  const slug = project.slug || project.id;
  return (
    <Link
      to="/portfolio/$slug"
      params={{ slug }}
      viewTransition
      onMouseEnter={() => void queryClient.prefetchQuery({ queryKey: ["portfolio-project", slug], queryFn: () => prefetchPortfolioProject(String(slug)) })}
      onMouseEnter={() => setWorkColor(paletteColor(project))}
      onFocus={() => { setWorkColor(paletteColor(project)); }}
      onBlur={() => setWorkColor("#2f4bff")}
      onMouseLeave={() => setWorkColor("#2f4bff")}
      className="block min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--work)]"
    >
      {children}
    </Link>
  );
}

function GridView({ projects }: { projects: DbProject[] }) {
  const rows = justifiedRows(projects);
  return (
    <div data-testid="portfolio-project-grid" className="space-y-5 md:space-y-6">
      {rows.map((row, rowIndex) => {
        return (
          <div key={"row-" + rowIndex} className="flex gap-3 md:gap-5">
            {row.map((project) => {
              const ratio = projectAspect(project);
              return (
                <ProjectLink key={project.id} project={project}>
                  <article className="group flex h-[230px] w-full min-w-0 flex-col overflow-hidden border-2 border-black bg-[#d6d4ce] md:h-[360px]" style={{ flex: `${ratio} 1 0%`, minWidth: 0 }}>
                    <div className="relative min-h-0 flex-1 overflow-hidden">
                      <WorkPoster project={project} className="transition-transform duration-700 ease-[var(--ease-signature)] group-hover:scale-[1.015]" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 border-t-2 border-black/30 bg-black/75 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <div className="text-sm font-semibold">{project.title}</div>
                        <div className="mt-1 text-sm text-[#b9b7b0]">{[project.client_name, project.year].filter(Boolean).join(" · ")}</div>
                      </div>
                    </div>
                  </article>
                </ProjectLink>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

function IndexView({ projects }: { projects: DbProject[] }) {
  const [preview, setPreview] = useState<{ project: DbProject; x: number; y: number } | null>(null);
  useEffect(() => { setWorkColor(preview ? paletteColor(preview.project) : "#2f4bff"); return () => setWorkColor("#2f4bff"); }, [preview]);
  return (
    <div className="relative">
      <div className="hidden md:block" aria-hidden={!preview}>
        {preview ? (
          <div className="pointer-events-none fixed z-[80] w-[min(28vw,360px)] border-2 border-black bg-[#d6d4ce] shadow-none" style={{ left: typeof window === "undefined" ? 20 : Math.min(preview.x + 20, window.innerWidth - 390), top: typeof window === "undefined" ? 120 : Math.min(preview.y + 20, window.innerHeight - 310) }}>
            <div className="aspect-[4/3] w-full"><WorkPoster project={preview.project} /></div>
            <div className="border-t-2 border-black bg-[#d6d4ce] p-4 text-black"><div className="font-cartaz text-3xl font-extrabold leading-none">{preview.project.title}</div><div className="mt-2 text-sm">{[preview.project.client_name, preview.project.year, preview.project.category].filter(Boolean).join(" · ")}</div></div>
          </div>
        ) : null}
      </div>
      <div className="overflow-x-auto border-t-2 border-black">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead><tr className="border-b-2 border-black text-sm font-semibold"><th className="px-0 py-4 pr-4">Year</th><th className="px-0 py-4 pr-4">Project</th><th className="px-0 py-4 pr-4">Client</th><th className="px-0 py-4">Discipline</th></tr></thead>
          <tbody>
            {projects.map((project) => {
              const update = (clientX: number, clientY: number) => setPreview({ project, x: clientX, y: clientY });
              return (
                <tr key={project.id} className="group border-b-2 border-black/15 transition-colors hover:bg-[var(--work-dark)]" onMouseMove={(event) => update(event.clientX, event.clientY)} onMouseEnter={() => setPreview({ project, x: 24, y: 120 })} onMouseLeave={() => setPreview(null)}>
                  <td className="px-0 py-5 pr-4 text-sm">{project.year ?? "—"}</td>
                  <td className="px-0 py-5 pr-4"><ProjectLink project={project}><span className="font-cartaz text-[clamp(1.8rem,3vw,3rem)] font-extrabold leading-none tracking-[-0.05em]">{project.title}</span></ProjectLink></td>
                  <td className="px-0 py-5 pr-4 text-sm">{project.client_name || "—"}</td>
                  <td className="px-0 py-5 text-sm">{normalizeCategory(project.category)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ItemListSchema({ projects }: { projects: DbProject[] }) {
  const itemList = useMemo(() => ({ "@context": "https://schema.org", "@type": "ItemList", itemListElement: projects.map((project, index) => ({ "@type": "ListItem", position: index + 1, name: project.title, url: "https://edmundokutuzov.art/portfolio/" + (project.slug || project.id) })) }), [projects]);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />;
}

export function PortfolioArchive() {
  const search = useSearch({ strict: false }) as SearchState;
  const navigate = useNavigate();
  const view = search.view === "index" ? "index" : DEFAULT_VIEW;
  const categories = useMemo(() => listValue(search.d), [search.d]);
  const years = useMemo(() => listValue(search.y), [search.y]);
  const clients = useMemo(() => listValue(search.c), [search.c]);
  const urlQuery = search.q ?? "";
  const [inputQuery, setInputQuery] = useState(urlQuery);
  const [mounted, setMounted] = useState(false);
  const filters = useMemo<PortfolioFilters>(() => ({ categories, years, clients, query: urlQuery }), [categories, clients, urlQuery, years]);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, isError } = usePortfolioArchive(filters);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef(false);
  const initialScrollKeyRef = useRef<string | null>(null);
  const pages = data?.pages ?? [];
  const projects = pages.flatMap((page) => page.projects);
  const total = pages[0]?.total ?? 0;
  const facets: PortfolioFacets | undefined = pages[0]?.facets;
  const yearsList = useMemo(() => Object.keys(facets?.years ?? {}).sort((a, b) => b.localeCompare(a)), [facets?.years]);
  const clientsList = useMemo(() => Object.keys(facets?.clients ?? {}).sort((a, b) => a.localeCompare(b)), [facets?.clients]);

  useEffect(() => { setInputQuery(urlQuery); }, [urlQuery]);
  useEffect(() => {
    setMounted(true);
    if (!initialScrollKeyRef.current) initialScrollKeyRef.current = "portfolio-scroll:" + searchKey(filters);
    const saved = sessionStorage.getItem(initialScrollKeyRef.current);
    if (saved) requestAnimationFrame(() => window.scrollTo(0, Number(saved)));
    return () => {
      if (initialScrollKeyRef.current) sessionStorage.setItem(initialScrollKeyRef.current, String(window.scrollY));
    };
  }, []);
  useEffect(() => { const onScroll = () => { if (!restoreRef.current) return; sessionStorage.setItem("portfolio-scroll:" + searchKey(filters), String(window.scrollY)); }; restoreRef.current = true; window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll); }, [filters]);
  useEffect(() => { if (!sentinelRef.current || !hasNextPage) return; const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) void fetchNextPage(); }, { rootMargin: "800px 0px" }); observer.observe(sentinelRef.current); return () => observer.disconnect(); }, [fetchNextPage, hasNextPage]);
  const baseSearch = useMemo(
    () => ({ view: search.view, d: search.d, y: search.y, c: search.c }),
    [search.c, search.d, search.view, search.y],
  );
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (inputQuery === urlQuery) return;
      void navigate({
        to: "/portfolio",
        search: { ...baseSearch, q: inputQuery.trim() || undefined },
        replace: true,
      });
    }, 280);
    return () => window.clearTimeout(timeout);
  }, [baseSearch, inputQuery, navigate, urlQuery]);

  const updateSearch = (patch: Partial<SearchState>) => {
    void navigate({ to: "/portfolio", search: { ...search, ...patch }, replace: true });
  };
  const toggleCategory = (category: string) => updateSearch({ d: joinValue(categories.includes(category) ? categories.filter((item) => item !== category) : [...categories, category]) });
  const clearFilters = () => updateSearch({ view, d: undefined, y: undefined, c: undefined, q: undefined });

  return (
    <div data-testid="portfolio-archive" data-tone="betao" className="relative w-full">
      <ItemListSchema projects={projects.slice(0, 24)} />
      <div className="mb-10 border-b-2 border-black pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="text-sm" aria-live="polite">{isLoading ? "Loading archive" : `${total} ${total === 1 ? "project" : "projects"}`}</p>
          <div className="flex items-center gap-2 border-2 border-black p-1" aria-label="Portfolio view">
            <button type="button" aria-pressed={view === "grid"} onClick={() => updateSearch({ view: "grid" })} className={"min-h-11 border-2 px-4 py-2 text-sm font-semibold " + (view === "grid" ? "bg-black text-[#f2f2ef]" : "bg-[#d6d4ce] text-black")}>Grid</button>
            <button type="button" aria-pressed={view === "index"} onClick={() => updateSearch({ view: "index" })} className={"min-h-11 border-2 px-4 py-2 text-sm font-semibold " + (view === "index" ? "bg-black text-[#f2f2ef]" : "bg-[#d6d4ce] text-black")}>Index</button>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by discipline">
            {PROJECT_CATEGORIES.map((category) => {
              const active = categories.includes(category);
              const count = facets?.categories?.[category] ?? 0;
              return <button key={category} type="button" aria-pressed={active} onClick={() => toggleCategory(category)} className={"min-h-11 border-2 px-3 py-2 text-sm font-semibold transition-colors " + (active ? "border-black bg-black text-[#f2f2ef]" : "border-black/25 bg-transparent text-black hover:border-black")}>{category}{count ? " · " + count : ""}</button>;
            })}
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_2fr]">
            <label className="flex flex-col gap-2 text-sm font-semibold">Year<select value={years[0] ?? ""} onChange={(event) => updateSearch({ y: event.target.value || undefined })} className="min-h-12 border-2 border-black bg-[#f2f2ef] px-3 py-2 text-sm font-normal"><option value="">All years</option>{yearsList.map((year) => <option key={year} value={year}>{year} · {facets?.years?.[year] ?? 0}</option>)}</select></label>
            <label className="flex flex-col gap-2 text-sm font-semibold">Client<select value={clients[0] ?? ""} onChange={(event) => updateSearch({ c: event.target.value || undefined })} className="min-h-12 border-2 border-black bg-[#f2f2ef] px-3 py-2 text-sm font-normal"><option value="">All clients</option>{clientsList.map((client) => <option key={client} value={client}>{client} · {facets?.clients?.[client] ?? 0}</option>)}</select></label>
            <label className="flex flex-col gap-2 text-sm font-semibold">Search<input value={inputQuery} onChange={(event) => setInputQuery(event.target.value)} placeholder="Search archive…" aria-label="Search portfolio archive" className="min-h-12 border-2 border-black bg-[#f2f2ef] px-3 py-2 text-sm font-normal outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)]" /></label>
          </div>
        </div>
      </div>

      {isError ? (
        <div className="border-2 border-black bg-[#d6d4ce] px-6 py-20 text-center"><p className="font-cartaz text-4xl font-extrabold">The archive could not be loaded.</p><p className="mt-3 text-sm">Reload to retry the content service.</p></div>
      ) : projects.length === 0 && !isLoading ? (
        <div data-testid="portfolio-empty" className="border-2 border-black bg-[#d6d4ce] px-6 py-20 text-center"><p className="font-cartaz text-5xl font-extrabold leading-none">No matching projects.</p><button type="button" onClick={clearFilters} className="mt-6 min-h-11 border-2 border-black bg-black px-4 py-2 text-sm font-semibold text-[#f2f2ef]">Clear filters</button></div>
      ) : view === "grid" ? (
        <GridView projects={projects} />
      ) : (
        <IndexView projects={projects} />
      )}

      <div ref={sentinelRef} className="flex min-h-16 items-center justify-center" aria-live="polite">{isFetchingNextPage ? <span className="text-sm">Loading more projects…</span> : hasNextPage ? <span className="text-sm">Loading as you scroll</span> : null}</div>
      {mounted && (categories.length || years.length || clients.length || urlQuery) ? <div className="mt-3 flex justify-end"><button type="button" onClick={clearFilters} className="border-b-2 border-black pb-1 text-sm font-semibold">Clear filters</button></div> : null}
    </div>
  );
}