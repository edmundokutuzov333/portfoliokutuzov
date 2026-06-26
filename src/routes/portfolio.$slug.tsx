import { useMemo } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Play } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { aspectFromDims } from "@/lib/image-utils";
import { SITE_EMAIL, type DbProject } from "@/lib/cms";

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
    <section className="px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto text-center">
        <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">/// 404</div>
        <h1 className="display text-5xl md:text-6xl mt-4 text-metal">Project not found.</h1>
        <Link
          to="/portfolio"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition"
        >
          <ArrowLeft size={14} /> Back to portfolio
        </Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto text-center text-slate-300">
        <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">/// Error</div>
        <h1 className="display text-4xl md:text-5xl mt-4 text-metal">
          Could not load this project.
        </h1>
        <p className="mt-3 text-sm text-slate-500">{error.message}</p>
        <Link
          to="/portfolio"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-100 text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition"
        >
          <ArrowLeft size={14} /> Back to portfolio
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
      className="h-auto max-h-[78vh] w-full bg-black"
    />
  );
}

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: projects = [], isLoading } = useProjects();

  const { project, next } = useMemo(() => {
    if (!projects.length) return { project: null as DbProject | null, next: null as DbProject | null };
    const idx = projects.findIndex((p) => (p.slug || p.id) === slug);
    if (idx === -1) return { project: null, next: null };
    const nextIdx = (idx + 1) % projects.length;
    return { project: projects[idx], next: projects[nextIdx] };
  }, [projects, slug]);

  if (isLoading) {
    return (
      <section className="px-5 md:px-8 pt-36 pb-24">
        <div className="max-w-[1240px] mx-auto">
          <div className="h-6 w-40 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-16 w-3/4 mt-6 bg-white/[0.04] rounded animate-pulse" />
          <div className="h-[60vh] mt-12 bg-white/[0.04] rounded-2xl animate-pulse" />
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
    <article className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <Link
          to="/portfolio"
          className="mono inline-flex items-center gap-2 text-[10px] tracking-[0.22em] text-slate-500 hover:text-sky-200 transition"
        >
          <ArrowLeft size={12} /> Back to portfolio
        </Link>

        <header className="mt-8">
          <div className="mono text-[10px] tracking-[0.22em] text-sky-300/75">
            {project.year ? `${project.year} · ` : ""}
            {project.category}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="display mt-4 text-5xl md:text-7xl lg:text-8xl leading-[0.96] tracking-[-0.03em] text-metal"
          >
            {project.client_name || project.title}
          </motion.h1>
          {project.client_name && project.title !== project.client_name && (
            <p className="mt-3 text-lg text-slate-400">{project.title}</p>
          )}

          {disciplines.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {disciplines.map((d) => (
                <span
                  key={d}
                  className="mono rounded-full border border-sky-300/25 bg-sky-300/[0.08] px-3 py-1.5 text-[10px] tracking-[0.16em] text-sky-100"
                >
                  {d}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Hero media */}
        {project.video_url ? (
          <div className="mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-black">
            <VideoPlayer
              url={project.video_url}
              provider={project.video_provider}
              poster={project.cover_url}
              title={project.title}
            />
          </div>
        ) : project.cover_url ? (
          <div className="mt-12 grid place-items-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#01040A]">
            <img
              src={project.cover_url}
              alt={project.title}
              width={project.cover_width ?? undefined}
              height={project.cover_height ?? undefined}
              className="h-auto max-h-[78vh] w-auto max-w-full object-contain"
            />
          </div>
        ) : null}

        {/* Body */}
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-16">
          <div className="md:col-span-2 space-y-12">
            {brief && (
              <section>
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">
                  The brief
                </div>
                <p className="mt-4 text-[15px] leading-7 text-slate-400">{brief}</p>
              </section>
            )}

            {approach && (
              <section>
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">
                  The approach
                </div>
                <p className="mt-4 text-[15px] leading-7 text-slate-200">{approach}</p>
              </section>
            )}

            {outcome && (
              <section className="relative border-l-2 border-sky-300/60 pl-6 py-2">
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/80">
                  The outcome
                </div>
                <p className="mt-3 text-[16px] leading-7 text-slate-100">{outcome}</p>
              </section>
            )}

            {project.deliverables && project.deliverables.length > 0 && (
              <section>
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">
                  Deliverables
                </div>
                <ul className="mt-4 grid grid-cols-1 gap-1 sm:grid-cols-2 text-slate-300">
                  {project.deliverables.map((d) => (
                    <li key={d}>— {d}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6 border-t border-white/[0.08] pt-8 text-[13px] text-slate-400 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            {project.client_name && (
              <div>
                <div className="mono text-[10px] tracking-[0.22em] text-slate-500">Client</div>
                <div className="mt-1 text-slate-100">{project.client_name}</div>
              </div>
            )}
            {project.year && (
              <div>
                <div className="mono text-[10px] tracking-[0.22em] text-slate-500">Year</div>
                <div className="mt-1 text-slate-100">{project.year}</div>
              </div>
            )}
            <div>
              <div className="mono text-[10px] tracking-[0.22em] text-slate-500">Category</div>
              <div className="mt-1 text-slate-100">{project.category}</div>
            </div>
            {project.tools_used && project.tools_used.length > 0 && (
              <div>
                <div className="mono text-[10px] tracking-[0.22em] text-slate-500">Tools</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {project.tools_used.map((t) => (
                    <span
                      key={t}
                      className="mono rounded-full border border-white/[0.1] bg-white/[0.025] px-2.5 py-1 text-[10px] tracking-[0.16em] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {project.collaborators && project.collaborators.length > 0 && (
              <div>
                <div className="mono text-[10px] tracking-[0.22em] text-slate-500">
                  Collaborators
                </div>
                <ul className="mt-1 space-y-0.5 text-slate-100">
                  {project.collaborators.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`Project similar to ${project.client_name || project.title}`)}`}
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-[#01040A] transition hover:bg-sky-200"
            >
              Request a similar project <ArrowUpRight size={14} strokeWidth={1.8} />
            </a>
          </aside>
        </div>

        {/* Gallery */}
        {allGallery.length > 0 && (
          <section className="mt-20 border-t border-white/[0.06] pt-12">
            <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">Gallery</div>
            <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          </section>
        )}

        {/* Next project */}
        {next && (
          <section className="mt-24 border-t border-white/[0.08] pt-10">
            <Link
              to="/portfolio/$slug"
              params={{ slug: next.slug || next.id }}
              className="group grid gap-6 md:grid-cols-[1fr_auto] md:items-end"
            >
              <div>
                <div className="mono text-[10px] tracking-[0.22em] text-sky-300/70">
                  Next project
                </div>
                <h2 className="display mt-3 text-3xl md:text-5xl tracking-[-0.025em] text-metal group-hover:text-sky-100 transition">
                  {next.client_name || next.title}
                </h2>
                <div className="mono mt-2 text-[10px] tracking-[0.18em] text-slate-500">
                  {next.year ? `${next.year} · ` : ""}
                  {next.category}
                </div>
              </div>
              <div className="grid h-14 w-14 place-items-center rounded-full border border-white/[0.15] bg-white/[0.025] text-slate-200 transition group-hover:border-sky-300/50 group-hover:bg-sky-300/[0.08] group-hover:text-sky-100">
                {next.video_url ? (
                  <Play size={18} strokeWidth={1.6} className="translate-x-[1px]" />
                ) : (
                  <ArrowUpRight size={18} strokeWidth={1.6} />
                )}
              </div>
            </Link>
          </section>
        )}
      </div>
    </article>
  );
}
