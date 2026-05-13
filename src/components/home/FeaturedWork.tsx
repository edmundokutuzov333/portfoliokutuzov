import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useProjects, useSiteSettings } from "@/hooks/useSiteData";
import { MAX_FEATURED, readSetting, type DbProject } from "@/lib/cms";

function pickFeatured(projects: DbProject[] | undefined): DbProject[] {
  if (!projects?.length) return [];
  return [...projects]
    .filter((p) => p.featured && p.is_published !== false)
    .sort((a, b) => {
      const pa = a.featured_priority ?? 0;
      const pb = b.featured_priority ?? 0;
      if (pb !== pa) return pb - pa;
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    })
    .slice(0, MAX_FEATURED);
}

export function FeaturedWork() {
  const { data: projects } = useProjects();
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "featured_section", f, fb);

  const featured = pickFeatured(projects);
  if (featured.length === 0) return null;

  const [primary, ...rest] = featured;

  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">
              {r("eyebrow", "Featured work")}
            </p>
            <h2 className="display text-3xl sm:text-5xl mt-4 leading-[1.02] tracking-[-0.025em] text-metal">
              {r("title", "Selected projects.")}
            </h2>
            <p className="mt-3 max-w-md text-[14px] text-slate-400">
              {r("subtitle", "A handful of recent pieces currently defining the direction.")}
            </p>
          </div>
          <Link
            to="/portfolio"
            className="hidden sm:inline-flex items-center gap-2 text-[12px] mono tracking-[0.18em] text-slate-400 hover:text-sky-200 transition"
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <FeaturedCard project={primary} primary />
          <div className="grid gap-4 md:col-span-1 md:contents">
            {rest.map((p) => (
              <FeaturedCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ project, primary = false }: { project: DbProject; primary?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={primary ? "md:col-span-2 md:row-span-1" : ""}
    >
      <Link
        to="/portfolio"
        className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-[#030814] shadow-[0_24px_90px_rgba(0,0,0,0.32)]"
      >
        <div
          className="relative w-full overflow-hidden bg-[#01040A]"
          style={{ aspectRatio: primary ? "16 / 11" : "4 / 5" }}
        >
          {project.cover_url ? (
            <img
              src={project.cover_url}
              alt={project.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#01040A] via-[#071A33] to-[#0B3B73]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#01040A]/85 via-[#01040A]/20 to-transparent" />
          <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="mono text-[10px] tracking-[0.22em] text-sky-300/80">
                {project.category}
                {project.year ? ` · ${project.year}` : ""}
              </div>
              <div
                className={
                  primary
                    ? "display text-2xl sm:text-3xl mt-2 text-white truncate"
                    : "display text-lg mt-2 text-white truncate"
                }
              >
                {project.title}
              </div>
              {project.client_name && (
                <div className="text-[12px] text-slate-300 mt-0.5 truncate">
                  {project.client_name}
                </div>
              )}
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/15 bg-white/[0.06] text-white transition group-hover:border-sky-300/55 group-hover:bg-sky-300/[0.12]">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
