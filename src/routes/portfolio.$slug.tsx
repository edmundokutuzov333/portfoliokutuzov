import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Play } from "lucide-react";
import clsx from "clsx";
import { useProjects } from "@/hooks/useSiteData";
import { SITE_EMAIL, type DbProject } from "@/lib/cms";
import { ContextualCursor } from "@/components/portfolio/ContextualCursor";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${humanize(params.slug)} — Portfolio · Edmundo Kutuzov` },
      {
        name: "description",
        content: `Case study: ${humanize(params.slug)} — art direction and visual systems by Edmundo Kutuzov.`,
      },
      { property: "og:title", content: `${humanize(params.slug)} — Edmundo Kutuzov` },
    ],
  }),
  component: ProjectDetailPage,
  notFoundComponent: () => (
    <section className="px-5 md:px-8 pt-36 pb-24 bg-[var(--color-bg)] min-h-screen grid place-items-center">
      <div className="max-w-[var(--width-standard)] mx-auto text-center">
        <div className="mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-6">
          Error 404
        </div>
        <h1 className="display text-5xl md:text-6xl text-[var(--color-text-primary)] tracking-[-0.03em]">
          Project not found.
        </h1>
        <Link
          to="/portfolio"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] px-6 py-3 text-[14px] font-semibold hover:bg-[var(--color-text-secondary)] transition-colors"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="px-5 md:px-8 pt-36 pb-24 bg-[var(--color-bg)] min-h-screen grid place-items-center">
      <div className="max-w-[var(--width-standard)] mx-auto text-center">
        <div className="mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-6">
          Error
        </div>
        <h1 className="display text-4xl md:text-5xl text-[var(--color-text-primary)] tracking-[-0.03em]">
          Could not load this project.
        </h1>
        <p className="mt-4 text-[15px] text-[var(--color-text-secondary)]">{error.message}</p>
        <Link
          to="/portfolio"
          className="mt-12 inline-flex items-center gap-3 rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] px-6 py-3 text-[14px] font-semibold hover:bg-[var(--color-text-secondary)] transition-colors"
        >
          <ArrowLeft size={16} /> Back to portfolio
        </Link>
      </div>
    </section>
  ),
});

function humanize(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function youtubeEmbed(url: string): string | null {
  const m =
    url.match(/youtu\.be\/([\w-]{6,})/i) ||
    url.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([\w-]{6,})/i);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

function vimeoEmbed(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

function VideoPlayer({
  url,
  provider,
  poster,
  title,
}: {
  url: string;
  provider?: string | null;
  poster?: string | null;
  title: string;
}) {
  const yt = provider === "youtube" || /youtu/i.test(url) ? youtubeEmbed(url) : null;
  const vm = provider === "vimeo" || /vimeo/i.test(url) ? vimeoEmbed(url) : null;
  if (yt || vm) {
    return (
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          src={(yt || vm)!}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <video
      src={url}
      poster={poster ?? undefined}
      controls
      playsInline
      preload="metadata"
      className="h-auto max-h-[78vh] w-full bg-[var(--color-bg)]"
    />
  );
}

// Animation variants for staggered editorial reveal
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: rawProjects = [], isLoading } = useProjects();

  const publishedProjects = useMemo(() => {
    return rawProjects.filter((p) => p.is_published !== false);
  }, [rawProjects]);

  const { project, prev, next } = useMemo(() => {
    if (!publishedProjects.length)
      return {
        project: null as DbProject | null,
        prev: null as DbProject | null,
        next: null as DbProject | null,
      };
    const idx = publishedProjects.findIndex((p) => (p.slug || p.id) === slug);
    if (idx === -1) return { project: null, prev: null, next: null };

    // Wrapping previous and next indices
    const prevIdx = (idx - 1 + publishedProjects.length) % publishedProjects.length;
    const nextIdx = (idx + 1) % publishedProjects.length;

    return {
      project: publishedProjects[idx],
      prev: publishedProjects[prevIdx],
      next: publishedProjects[nextIdx],
    };
  }, [publishedProjects, slug]);

  if (isLoading) {
    return (
      <section className="px-5 md:px-8 pt-40 pb-24 bg-[var(--color-bg)] min-h-screen">
        <div className="max-w-[var(--width-wide)] mx-auto">
          <div className="h-4 w-32 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
          <div className="h-16 w-3/4 mt-8 bg-[var(--color-surface-elevated)] rounded animate-pulse" />
          <div className="h-[60vh] mt-16 bg-[var(--color-surface-elevated)] rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (!project) {
    throw notFound();
  }

  const disciplines = [project.category, ...(project.tags ?? [])].filter(Boolean) as string[];
  const brief = project.concept || project.description || "";
  const approach = project.idea || project.role || "";
  const outcome = project.notes || project.subtitle || "";

  const galleryMeta = project.gallery_meta ?? [];
  const galleryUrls = project.gallery ?? [];
  const allGallery: { url: string; width?: number; height?: number; alt?: string }[] =
    galleryMeta.length > 0 ? galleryMeta : galleryUrls.map((url) => ({ url }));

  return (
    <article className="relative px-5 md:px-8 pt-36 md:pt-40 pb-32 bg-[var(--color-bg)]">
      <ContextualCursor />

      <div className="max-w-[var(--width-wide)] mx-auto">
        {/* Navigation Breadcrumb */}
        <Link
          to="/portfolio"
          className="group inline-flex items-center gap-3 mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-hover)]"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to archive
        </Link>

        {/* Header with staggered entrance */}
        <motion.header
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 md:mt-16"
        >
          <motion.div
            variants={itemFadeUp}
            className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]"
          >
            {project.year ? `${project.year} · ` : ""}
            {project.category}
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            className="display mt-5 text-5xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]"
          >
            {project.client_name || project.title}
          </motion.h1>

          {project.client_name && project.title !== project.client_name && (
            <motion.p
              variants={itemFadeUp}
              className="mt-3 text-[18px] md:text-2xl text-[var(--color-text-secondary)] font-normal"
            >
              {project.title}
            </motion.p>
          )}

          {disciplines.length > 0 && (
            <motion.div variants={itemFadeUp} className="mt-8 flex flex-wrap gap-2">
              {disciplines.map((d) => (
                <span
                  key={d}
                  className="mono rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-4 py-1.5 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]"
                >
                  {d}
                </span>
              ))}
            </motion.div>
          )}
        </motion.header>

        {/* Hero Media - Smooth Shared-Element Transition */}
        {project.video_url ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            data-cursor="PLAY"
            className="mt-12 md:mt-16 overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)]"
          >
            <VideoPlayer
              url={project.video_url}
              provider={project.video_provider}
              poster={project.cover_url}
              title={project.title}
            />
          </motion.div>
        ) : project.cover_url ? (
          <div className="mt-12 md:mt-16 overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
            <motion.img
              layoutId={`project-cover-${project.id}`}
              src={project.cover_url}
              alt={project.title}
              width={project.cover_width ?? undefined}
              height={project.cover_height ?? undefined}
              decoding="async"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        ) : null}

        {/* Project Body & Specs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-28 grid gap-12 md:grid-cols-12 md:gap-16 items-start"
        >
          <div className="md:col-span-8 space-y-16">
            {brief && (
              <section>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6">
                  The Brief
                </div>
                <p className="text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-secondary)] max-w-2xl">
                  {brief}
                </p>
              </section>
            )}

            {approach && (
              <section>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6">
                  The Approach
                </div>
                <p className="text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-primary)] max-w-2xl">
                  {approach}
                </p>
              </section>
            )}

            {outcome && (
              <section className="relative border-l border-[var(--color-accent-base)] pl-8 py-2">
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
                  The Outcome
                </div>
                <p className="text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-primary)] max-w-2xl">
                  {outcome}
                </p>
              </section>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <section>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6">
                  Deliverables
                </div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-[15px] text-[var(--color-text-secondary)] max-w-2xl">
                  {project.deliverables.map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="text-[var(--color-text-muted)]">—</span> {d}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="md:col-span-4 space-y-8 border-t border-[var(--color-border-subtle)] pt-12 md:border-t-0 md:pt-0">
            {project.client_name && (
              <div>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2">
                  Client
                </div>
                <div className="text-[15px] text-[var(--color-text-primary)] font-medium">
                  {project.client_name}
                </div>
              </div>
            )}
            {project.role && (
              <div>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2">
                  Role
                </div>
                <div className="text-[15px] text-[var(--color-text-primary)]">{project.role}</div>
              </div>
            )}
            {project.year && (
              <div>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2">
                  Year
                </div>
                <div className="text-[15px] text-[var(--color-text-primary)]">{project.year}</div>
              </div>
            )}
            <div>
              <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2">
                Discipline
              </div>
              <div className="text-[15px] text-[var(--color-text-primary)]">{project.category}</div>
            </div>

            {project.tools_used && project.tools_used.length > 0 && (
              <div>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-3">
                  Tools
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tools_used.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase text-[var(--color-text-secondary)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.collaborators && project.collaborators.length > 0 && (
              <div>
                <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-3">
                  Collaborators
                </div>
                <ul className="space-y-1.5 text-[14px] text-[var(--color-text-secondary)]">
                  {project.collaborators.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-6">
              <a
                href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`Project inquiry similar to ${project.client_name || project.title}`)}`}
                className="group inline-flex w-full justify-between items-center gap-3 rounded-full bg-[var(--color-text-primary)] px-6 py-4 text-[13px] font-semibold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-text-secondary)]"
              >
                Start a similar project
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </a>
            </div>
          </aside>
        </motion.div>

        {/* Gallery / Visual System */}
        {allGallery.length > 0 && (
          <section className="mt-32 border-t border-[var(--color-border-subtle)] pt-16">
            <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-12">
              Visual System & Assets
            </div>
            <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-12">
              {allGallery.map((g, i) => {
                const isFull = i % 3 === 0;
                return (
                  <div
                    key={g.url + i}
                    data-cursor="OPEN"
                    className={clsx(
                      "grid place-items-center bg-[var(--color-surface)] border border-[var(--color-border-subtle)] overflow-hidden",
                      isFull ? "md:col-span-12" : "md:col-span-6",
                    )}
                  >
                    <img
                      src={g.url}
                      alt={g.alt || `${project.title} - asset ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      style={{ display: "block", width: "100%", height: "auto" }}
                      className="transition-transform duration-700 hover:scale-[1.01]"
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Previous & Next Project Navigation Controls */}
        <section className="mt-32 border-t border-[var(--color-border-subtle)] pt-16">
          <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-8">
            Project Index Navigation
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Previous Project Card */}
            {prev && (
              <Link
                to="/portfolio/$slug"
                params={{ slug: prev.slug || prev.id }}
                data-cursor="PREV"
                className="group relative flex flex-col justify-between rounded-none border border-[var(--color-border-base)] bg-[var(--color-surface)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-elevated)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]"
              >
                <div>
                  <div className="flex items-center gap-2 mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-hover)] transition-colors mb-4">
                    <ArrowLeft
                      size={13}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    Previous Project
                  </div>

                  <h3 className="display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-tight">
                    {prev.client_name || prev.title}
                  </h3>

                  <div className="mono mt-3 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]">
                    {prev.year ? `${prev.year} · ` : ""}
                    {prev.category}
                  </div>
                </div>

                {prev.cover_url && (
                  <div className="mt-6 aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                    <img
                      src={prev.cover_url}
                      alt={prev.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            )}

            {/* Next Project Card */}
            {next && (
              <Link
                to="/portfolio/$slug"
                params={{ slug: next.slug || next.id }}
                data-cursor="NEXT"
                className="group relative flex flex-col justify-between rounded-none border border-[var(--color-border-base)] bg-[var(--color-surface)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-elevated)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]"
              >
                <div>
                  <div className="flex items-center justify-between mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-hover)] transition-colors mb-4">
                    <span>Next Project</span>
                    <ArrowRight
                      size={13}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>

                  <h3 className="display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-tight">
                    {next.client_name || next.title}
                  </h3>

                  <div className="mono mt-3 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]">
                    {next.year ? `${next.year} · ` : ""}
                    {next.category}
                  </div>
                </div>

                {next.cover_url && (
                  <div className="mt-6 aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border-subtle)]">
                    <img
                      src={next.cover_url}
                      alt={next.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
