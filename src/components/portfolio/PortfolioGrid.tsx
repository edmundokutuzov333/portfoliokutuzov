import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import { isCampaignCategory, type DbProject } from "@/lib/cms";
import { aspectFromDims } from "@/lib/image-utils";

const ALL_CATEGORIES = [
  "All",
  "Social Media",
  "Ad Campaigns",
  "Videos",
  "Image Manipulation",
  "Web Design",
] as const;

function ProjectCard({ project, index, onOpen }: { project: DbProject; index: number; onOpen: (p: DbProject) => void }) {
  const ratio = aspectFromDims(project.cover_width, project.cover_height) || "4 / 5";
  const palette = project.palette || "from-[#01040A] via-[#071A33] to-[#0B3B73]";
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.04, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
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
      </div>
      <div className="flex flex-1 items-end justify-between gap-3 border-t border-white/[0.06] bg-[#030814] px-5 py-4">
        <div className="min-w-0">
          <div className="mono text-[10px] tracking-[0.18em] text-slate-500">
            {project.category} · {project.year ?? ""}
          </div>
          <div className="display mt-1 truncate text-lg leading-tight tracking-[-0.02em] text-slate-100">
            {project.title}
          </div>
          {project.subtitle && (
            <div className="mt-0.5 truncate text-[12px] text-slate-500">{project.subtitle}</div>
          )}
        </div>
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/[0.1] bg-white/[0.02] text-slate-300 transition group-hover:border-sky-300/40 group-hover:text-sky-200">
          <ArrowUpRight size={14} strokeWidth={1.8} />
        </div>
      </div>
    </motion.button>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="mono text-[10px] tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm text-slate-100">{value}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-white/[0.06] pt-6">
      <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">{title}</div>
      <div className="mt-3 text-[15px] leading-7 text-slate-300">{children}</div>
    </section>
  );
}

function ProjectDetail({ project, onClose }: { project: DbProject; onClose: () => void }) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const isCampaign = isCampaignCategory(project.category);
  const tools = project.tools_used ?? [];
  const collaborators = project.collaborators ?? [];
  const deliverables = project.deliverables ?? [];
  const galleryMeta = project.gallery_meta ?? [];
  const galleryUrls = project.gallery ?? [];
  const allGallery: { url: string; width?: number; height?: number; alt?: string }[] =
    galleryMeta.length > 0
      ? galleryMeta
      : galleryUrls.map((url) => ({ url }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] overflow-y-auto bg-[#01040A]/92 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto my-6 w-full max-w-6xl rounded-2xl border border-white/[0.1] bg-[#030814] shadow-[0_40px_160px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="sticky top-4 left-full z-10 mr-4 grid h-10 w-10 -translate-y-2 place-items-center rounded-full border border-white/[0.1] bg-[#01040A]/80 text-slate-200 backdrop-blur transition hover:border-sky-300/40"
        >
          <X size={16} strokeWidth={1.8} />
        </button>

        {/* HERO IMAGE - full proportions, never cropped */}
        {project.cover_url && (
          <div className="px-4 pt-4 md:px-8 md:pt-8">
            <div className="grid place-items-center rounded-xl bg-[#01040A]">
              <img
                src={project.cover_url}
                alt={project.title}
                width={project.cover_width ?? undefined}
                height={project.cover_height ?? undefined}
                className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
              />
            </div>
          </div>
        )}

        <div className="grid gap-10 p-6 md:grid-cols-3 md:p-10">
          <div className="md:col-span-2 space-y-6">
            <header>
              <div className="mono text-[10px] tracking-[0.22em] text-sky-300/75">
                {project.category} · {project.year ?? ""}
              </div>
              <h3 className="display mt-3 text-4xl leading-[1] tracking-[-0.035em] text-slate-100 md:text-6xl">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="mt-3 text-base text-slate-400">{project.subtitle}</p>
              )}
            </header>

            {project.description && (
              <p className="text-[15px] leading-7 text-slate-300">{project.description}</p>
            )}

            {isCampaign && project.concept && (
              <Section title="Campaign concept">{project.concept}</Section>
            )}
            {isCampaign && project.idea && (
              <Section title="Creative idea">{project.idea}</Section>
            )}
            {project.role && <Section title="My role">{project.role}</Section>}
            {project.notes && <Section title="Notes / outcome">{project.notes}</Section>}

            {tools.length > 0 && (
              <Section title="Tools used">
                <div className="flex flex-wrap gap-2">
                  {tools.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-3 py-1.5 text-[10px] tracking-[0.16em] text-sky-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {deliverables.length > 0 && (
              <Section title="Deliverables">
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {deliverables.map((d) => (
                    <li key={d} className="text-slate-300">- {d}</li>
                  ))}
                </ul>
              </Section>
            )}

            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="mono rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] tracking-[0.16em] text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <a
              href={`mailto:edmundokutuzov.mz@gmail.com?subject=${encodeURIComponent(`Project similar to ${project.title}`)}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200"
            >
              Request a similar project <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
          </div>

          <aside className="space-y-5 border-t border-white/[0.08] pt-6 text-[12px] text-slate-400 md:border-l md:border-t-0 md:pl-7 md:pt-0">
            {project.client_name && <MetaRow label="Client" value={project.client_name} />}
            <MetaRow label="Category" value={project.category} />
            {project.year && <MetaRow label="Year" value={project.year} />}
            {project.subtitle && <MetaRow label="Discipline" value={project.subtitle} />}
            {collaborators.length > 0 && (
              <MetaRow
                label="Collaborators"
                value={
                  <ul className="space-y-0.5">
                    {collaborators.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                }
              />
            )}
          </aside>
        </div>

        {allGallery.length > 0 && (
          <div className="border-t border-white/[0.06] p-6 md:p-10">
            <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">Gallery</div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {allGallery.map((g, i) => (
                <div
                  key={g.url + i}
                  className="grid place-items-center overflow-hidden rounded-xl border border-white/[0.06] bg-[#01040A]"
                  style={{ aspectRatio: aspectFromDims(g.width, g.height) || "4 / 5" }}
                >
                  <img
                    src={g.url}
                    alt={g.alt || `${project.title} - ${i + 1}`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function PortfolioGrid() {
  const { data: projects = [], isLoading } = useProjects();
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<DbProject | null>(null);

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter, projects],
  );

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {ALL_CATEGORIES.map((category) => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              className={clsx(
                "mono rounded-full border px-4 py-2 text-[11px] tracking-[0.16em] transition duration-300",
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} onOpen={setActive} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <AnimatePresence>
        {active && <ProjectDetail project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </div>
  );
}
