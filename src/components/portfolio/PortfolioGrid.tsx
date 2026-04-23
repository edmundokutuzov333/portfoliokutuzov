import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import type { DbProject } from "@/lib/cms";

const ALL_CATEGORIES = [
  "All",
  "Brand Identity",
  "Campaign Design",
  "Art Direction",
  "Visual Systems",
  "Social Media Assets",
  "Digital Design",
  "Motion / Content Direction",
  "Editorial Systems",
] as const;

function ProjectVisual({ project }: { project: DbProject }) {
  if (project.cover_url) {
    return (
      <div className="absolute inset-0">
        <img src={project.cover_url} alt={project.title} loading="lazy"
          className="h-full w-full object-cover opacity-85 grayscale transition duration-500 group-hover:scale-[1.04] group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#01040A] via-[#01040A]/35 to-transparent" />
      </div>
    );
  }
  const palette = project.palette || "from-[#01040A] via-[#071A33] to-[#0B3B73]";
  return (
    <div className={clsx("absolute inset-0 bg-gradient-to-br", palette)}>
      <div className="absolute inset-0 opacity-45 mix-blend-screen" style={{
        background: "radial-gradient(520px circle at 24% 18%, rgba(125,211,252,0.32), transparent 52%), radial-gradient(640px circle at 82% 80%, rgba(30,64,175,0.45), transparent 60%)",
      }} />
      <div className="absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: "linear-gradient(rgba(226,232,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(226,232,240,0.6) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />
      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-200/10 transition duration-500 group-hover:scale-125" />
    </div>
  );
}

function ProjectCard({ project, index, onOpen }: { project: DbProject; index: number; onOpen: (p: DbProject) => void }) {
  return (
    <motion.button
      type="button" onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.045, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={clsx(
        "group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030814] text-left shadow-[0_24px_90px_rgba(0,0,0,0.28)] focus:outline-none focus:ring-2 focus:ring-sky-300/60",
        project.span === "tall" && "lg:row-span-2",
        project.span === "wide" && "lg:col-span-2"
      )}
    >
      <div className="absolute inset-0"><ProjectVisual project={project} /></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#01040A]/92 via-[#01040A]/18 to-[#01040A]/8 transition duration-300 group-hover:from-[#01040A]/82" />
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between mono text-[10px] tracking-[0.18em] text-slate-300/80">
        <span>{project.category}</span><span>{project.year}</span>
      </div>
      <div className="absolute right-4 top-12 grid h-9 w-9 place-items-center rounded-full border border-white/[0.1] bg-[#01040A]/45 text-slate-200 opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100 group-hover:border-sky-300/35 group-hover:text-sky-200">
        <ArrowUpRight size={14} strokeWidth={1.8} />
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="display text-3xl leading-[1] tracking-[-0.03em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-[34px]">{project.title}</div>
        <div className="mt-2 text-[12px] tracking-[0.04em] text-slate-300/85">{project.subtitle}</div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-sky-300/80 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </motion.button>
  );
}

export function PortfolioGrid() {
  const { data: projects = [], isLoading } = useProjects();
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<DbProject | null>(null);

  const filtered = useMemo(
    () => filter === "All" ? projects : projects.filter((p) => p.category === filter),
    [filter, projects]
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {ALL_CATEGORIES.map((category) => {
          const isActive = filter === category;
          return (
            <button key={category} type="button" onClick={() => setFilter(category)}
              className={clsx(
                "mono rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] transition duration-300",
                isActive ? "border-sky-300/35 bg-sky-300/[0.1] text-sky-100" : "border-white/[0.1] bg-white/[0.025] text-slate-400 hover:border-sky-300/25 hover:text-white"
              )}
            >{category}</button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid auto-rows-[280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid auto-rows-[280px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onOpen={setActive} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-[#01040A]/82 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-white/[0.1] bg-[#030814] shadow-[0_40px_160px_rgba(0,0,0,0.6)]"
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" onClick={() => setActive(null)} aria-label="Close"
                className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/[0.1] bg-[#01040A]/65 text-slate-200 backdrop-blur transition hover:border-sky-300/35"
              ><X size={16} strokeWidth={1.8} /></button>
              <div className="group relative h-72 overflow-hidden md:h-[430px]">
                <ProjectVisual project={active} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030814] via-transparent to-[#01040A]/20" />
              </div>
              <div className="grid gap-8 p-6 md:grid-cols-3 md:p-10">
                <div className="md:col-span-2">
                  <div className="mono text-[10px] tracking-[0.22em] text-sky-300/75">{active.category} · {active.year}</div>
                  <h3 className="display mt-3 text-4xl leading-[1] tracking-[-0.035em] text-slate-100 md:text-6xl">{active.title}</h3>
                  <p className="mt-2 text-sm tracking-[0.02em] text-slate-400">{active.subtitle}</p>
                  <p className="mt-6 max-w-2xl text-[15px] leading-7 text-slate-400">{active.description}</p>
                  {active.tags && active.tags.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {active.tags.map((tag) => (
                        <span key={tag} className="mono rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] tracking-[0.16em] text-slate-400">{tag}</span>
                      ))}
                    </div>
                  )}
                  <a href={`mailto:edmundokutuzov@phantom-mz.com?subject=${encodeURIComponent(`Project similar to ${active.title}`)}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200">
                    Request a similar project<ArrowUpRight size={14} strokeWidth={1.8} />
                  </a>
                </div>
                <div className="space-y-5 border-t border-white/[0.08] pt-6 text-[12px] text-slate-400 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                  {[["Category", active.category], ["Year", active.year], ["Discipline", active.subtitle]].map(([label, value]) => (
                    <div key={label as string}>
                      <div className="mono tracking-[0.2em] text-slate-600">{label}</div>
                      <div className="mt-1 text-slate-100">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
