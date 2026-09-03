import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useProjects, useSiteSettings } from "@/hooks/useSiteData";
import { MAX_FEATURED, readSetting, type DbProject } from "@/lib/cms";
import clsx from "clsx";

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

  return (
    <section className="relative px-4 md:px-8 py-32 bg-[var(--color-bg)]">
      <div className="max-w-[var(--width-wide)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24"
        >
          <div>
            <h2 className="display text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-[-0.03em] text-[var(--color-text-primary)] max-w-xl">
              {r("title", "Selected work")}
            </h2>
          </div>
          <Link
            to="/portfolio"
            className="group flex items-center gap-2 text-[12px] mono tracking-[0.15em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition"
          >
            Full Archive{" "}
            <ArrowUpRight
              size={14}
              className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>
        </motion.div>

        <div className="flex flex-col gap-24 md:gap-40">
          {featured.map((p, index) => (
            <FeaturedCard key={p.id} project={p} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 flex justify-center border-t border-[var(--color-border-subtle)] pt-16"
        >
          <Link
            to="/portfolio"
            className="group flex h-14 items-center justify-center gap-3 rounded-full bg-[var(--color-text-primary)] px-8 text-[13px] font-semibold text-[var(--color-bg)] transition-all hover:bg-[var(--color-text-secondary)]"
          >
            View all projects
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function FeaturedCard({ project, index }: { project: DbProject; index: number }) {
  const isEven = index % 2 === 0;

  // First item gets a massive hero treatment
  if (index === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative"
      >
        <Link
          to="/portfolio/$slug"
          params={{ slug: project.slug || project.id }}
          className="block focus:outline-none"
        >
          <div className="relative w-full overflow-hidden bg-[var(--color-surface)]">
            {project.cover_url && (
              <img
                src={project.cover_url}
                alt={project.title}
                loading="lazy"
                decoding="async"
                style={{ display: "block", width: "100%", height: "auto" }}
                className="transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.02]"
              />
            )}
          </div>
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
            <div className="md:col-span-8">
              <h3 className="display text-4xl md:text-5xl lg:text-6xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors">
                {project.title}
              </h3>
            </div>
            <div className="md:col-span-4 md:text-right flex flex-col md:items-end justify-start pt-2">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-2">
                {project.category} {project.year ? `· ${project.year}` : ""}
              </div>
              {project.client_name && (
                <div className="text-[14px] font-medium text-[var(--color-text-secondary)]">
                  Client: {project.client_name}
                </div>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Subsequent items alternate left/right with different aspect ratios
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={clsx("group grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center")}
    >
      <div
        className={clsx(
          "md:col-span-7 relative overflow-hidden bg-[var(--color-surface)]",
          isEven ? "md:order-1" : "md:order-2",
        )}
      >
        <Link
          to="/portfolio/$slug"
          params={{ slug: project.slug || project.id }}
          className="block focus:outline-none"
        >
          {project.cover_url && (
            <img
              src={project.cover_url}
              alt={project.title}
              loading="lazy"
              decoding="async"
              style={{ display: "block", width: "100%", height: "auto" }}
              className="transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-[1.02]"
            />
          )}
        </Link>
      </div>
      <div className={clsx("md:col-span-5 flex flex-col", isEven ? "md:order-2" : "md:order-1")}>
        <Link
          to="/portfolio/$slug"
          params={{ slug: project.slug || project.id }}
          className="block focus:outline-none"
        >
          <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
            {project.category} {project.year ? `· ${project.year}` : ""}
          </div>
          <h3 className="display text-3xl md:text-4xl lg:text-5xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors">
            {project.title}
          </h3>
          {project.client_name && (
            <div className="mt-4 text-[15px] font-medium text-[var(--color-text-secondary)]">
              {project.client_name}
            </div>
          )}
          <div className="mt-8 flex items-center gap-3 text-[13px] font-medium text-[var(--color-text-primary)]">
            <span className="h-[1px] w-8 bg-[var(--color-text-primary)] transition-all duration-300 group-hover:w-12 group-hover:bg-[var(--color-accent-hover)]" />
            <span className="group-hover:text-[var(--color-accent-hover)] transition-colors">
              Explore project
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
