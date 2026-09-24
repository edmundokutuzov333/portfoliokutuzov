import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Plus } from "lucide-react";
import { useClients, useProjects, useSiteMetrics, useSiteSettings, useStats } from "@/hooks/useSiteData";
import { readSetting, type DbProject, type DbStat } from "@/lib/cms";
import { setWorkColor, darkenWorkColor, pickFg } from "@/lib/work-color";
import { DeferredReel } from "@/components/home/DeferredReel";
import { STATIC_DISCIPLINES, type Discipline } from "@/data/disciplines";

const DEFAULT_WORK = "#2f4bff";
const HERO_COPY = "I shape ideas that cut through noise, stay in memory, and move people.";
const HERO_ROLES = "Art director · Social media manager · AI expert";

function paletteColor(project: DbProject): string {
  const matches = project.palette?.match(/#[0-9a-f]{6}\b/gi) ?? [];
  return matches.at(-1) ?? DEFAULT_WORK;
}

function metricCards(settings: Record<string, Record<string, unknown>> | undefined) {
  const cards = readSetting<Array<{ value?: unknown; label?: unknown }>>(settings, "credentials", "cards", []);
  return cards
    .filter((card) => String(card.value ?? "").trim() && String(card.label ?? "").trim())
    .slice(0, 5)
    .map((card) => ({ value: String(card.value), label: String(card.label) }));
}

function experienceRows(settings: Record<string, Record<string, unknown>> | undefined) {
  const rows = readSetting<Array<{ period?: unknown; role?: unknown; company?: unknown }>>(
    settings,
    "credentials",
    "experience",
    [],
  );
  return rows
    .map((row) => ({
      period: String(row.period ?? ""),
      role: String(row.role ?? ""),
      company: String(row.company ?? ""),
      current: String(row.period ?? "").toLowerCase().includes("present"),
    }))
    .filter((row) => row.period || row.role || row.company)
    .sort((a, b) => Number(b.current) - Number(a.current));
}

function HomeHero() {
  const { data: settings } = useSiteSettings();
  const reducedMotion = useReducedMotion();
  const availability = readSetting<boolean>(settings, "availability", "enabled", true);
  const availabilityLabel = String(readSetting(settings, "availability", "label", "Available for projects"));
  const availabilityYear = Number(readSetting(settings, "availability", "year", new Date().getFullYear()));
  const bio = String(
    readSetting(
      settings,
      "about",
      "bio_p1",
      "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    ),
  );

  return (
    <section
      data-tone="preto"
      aria-labelledby="home-hero-title"
      className="relative isolate min-h-[calc(100svh-72px)] overflow-visible bg-[#000] px-4 pb-24 pt-10 text-[#f2f2ef] md:px-8 md:pb-28"
    >
      <div className="mx-auto flex min-h-[calc(100svh-100px)] w-full max-w-[1600px] flex-col">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-12">
            <p className="text-sm font-medium text-[#b9b7b0]">Edmundo Kutuzov — Art Director</p>
          </div>

          <div className="col-span-4 pt-10 md:col-span-10 md:pt-16">
            <motion.h1
              id="home-hero-title"
              initial={reducedMotion ? false : { opacity: 0, fontVariationSettings: '"wdth" 70, "wght" 730' }}
              animate={reducedMotion ? { opacity: 1 } : { opacity: 1, fontVariationSettings: '"wdth" 62, "wght" 800' }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-cartaz text-[clamp(3.6rem,10.2vw,10.8rem)] font-extrabold leading-[0.84] tracking-[-0.06em] text-[#f2f2ef]"
              style={{ contain: "layout" }}
            >
              {HERO_COPY}
            </motion.h1>
          </div>

          <div className="col-span-4 mt-8 md:col-span-4 md:col-start-1 md:mt-12">
            <p className="font-livro max-w-[620px] text-[clamp(1.1rem,1rem+0.45vw,1.45rem)] leading-[1.55] text-[#b9b7b0]">
              {bio}
            </p>
          </div>

          <div className="col-span-4 mt-8 flex flex-col gap-5 md:col-span-4 md:col-start-9 md:mt-12 md:items-end">
            <p className="text-sm font-semibold text-[#f2f2ef]">{HERO_ROLES}</p>
            {availability ? (
              <div className="flex items-center gap-3 text-sm text-[#f2f2ef]">
                <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-[#4ade80]" />
                <span>{availabilityLabel} {availabilityYear}</span>
              </div>
            ) : null}
            <Link
              to="/contact"
              viewTransition
              className="inline-flex min-h-12 items-center justify-center border-2 border-[#f2f2ef] bg-[#f2f2ef] px-5 py-3 text-sm font-bold text-black transition-[background-color,color,border-color] duration-300 hover:border-[var(--work)] hover:bg-[var(--work)] hover:text-[var(--work-fg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--work)]"
            >
              Start a project
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-10 min-h-[300px] items-end md:mt-auto md:flex md:min-h-[360px]">
          <div className="pointer-events-auto absolute inset-x-[-1rem] bottom-[-7rem] md:inset-x-[-2rem]">
            <div className="mx-auto w-full max-w-[1500px] overflow-visible">
              <DeferredReel />
            </div>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-3 text-sm text-[#b9b7b0] md:hidden">
          <ArrowDown size={16} aria-hidden />
          <span>Selected work below</span>
        </div>
      </div>
    </section>
  );
}

function FeaturedWorkBlock() {
  const { data: projects = [] } = useProjects();
  const { data: settings } = useSiteSettings();
  const featured = useMemo(
    () =>
      projects
        .filter((project) => project.featured && project.is_published !== false)
        .sort(
          (a, b) =>
            (b.featured_priority ?? 0) - (a.featured_priority ?? 0) ||
            (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
        .slice(0, 8),
    [projects],
  );
  const [activeId, setActiveId] = useState<string | null>(featured[0]?.id ?? null);
  const featuredTitle = String(readSetting(settings, "featured_section", "title", "Selected projects."));

  useEffect(() => {
    if (featured.length && !featured.some((project) => project.id === activeId)) {
      setActiveId(featured[0].id);
    }
  }, [featured, activeId]);

  const active = featured.find((project) => project.id === activeId) ?? featured[0];
  const activeColor = active ? paletteColor(active) : DEFAULT_WORK;

  useEffect(() => {
    setWorkColor(activeColor);
    return () => { setWorkColor(DEFAULT_WORK); };
  }, [activeColor]);

  if (!featured.length) return null;

  return (
    <section
      data-tone="betao"
      aria-labelledby="featured-title"
      className="bg-[#d6d4ce] px-4 py-20 text-black md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-8">
            <p className="text-sm font-semibold">Featured work</p>
            <h2 id="featured-title" className="mt-4 max-w-[900px] font-cartaz text-[clamp(3.2rem,8vw,8.5rem)] font-extrabold leading-[0.84] tracking-[-0.06em]">
              {featuredTitle}
            </h2>
          </div>
          <div className="col-span-4 flex items-end justify-end md:col-span-4">
            <Link
              to="/portfolio"
              viewTransition
              className="inline-flex min-h-11 items-center border-b-2 border-black px-0 py-2 text-sm font-bold"
            >
              All projects — {projects.length}
            </Link>
          </div>
        </div>

        <div className="mt-14 border-t-2 border-black">
          {featured.map((project, index) => {
            const work = paletteColor(project);
            const dark = darkenWorkColor(work);
            const fg = pickFg(dark);
            const hasMedia = Boolean(project.cover_url || project.gallery?.length);

            return (
              <Link
                key={project.id}
                to="/portfolio/$slug"
                params={{ slug: project.slug || project.id }}
                viewTransition
                onMouseEnter={() => {
                  setActiveId(project.id);
                  setWorkColor(work);
                }}
                onFocus={() => {
                  setActiveId(project.id);
                  setWorkColor(work);
                }}
                onMouseLeave={() => setWorkColor(DEFAULT_WORK)}
                onBlur={() => setWorkColor(DEFAULT_WORK)}
                className="group grid grid-cols-4 gap-3 border-b-2 border-black py-7 transition-colors duration-300 md:grid-cols-12 md:gap-6 md:py-8"
                style={
                  {
                    "--work-local": work,
                    "--work-dark-local": dark,
                    "--work-fg-local": fg,
                  } as CSSProperties
                }
              >
                <span className="col-span-1 text-sm font-semibold md:col-span-1 md:text-base">
                  {index + 1}
                </span>
                <span className="col-span-3 md:col-span-5">
                  <span className="block font-cartaz text-[clamp(2rem,4.7vw,5rem)] font-bold leading-[0.88] tracking-[-0.045em] transition-colors duration-300 group-hover:text-[var(--work-fg-local)]">
                    {project.title}
                  </span>
                  <span className="mt-2 block text-sm text-[#3f3e3b] transition-colors group-hover:text-[var(--work-fg-local)]">
                    {project.client_name ?? "Client"} · {project.category} · {project.year ?? ""}
                  </span>
                </span>
                <span className="col-span-4 hidden items-end justify-end md:col-span-3 md:flex">
                  <span className="max-w-[18rem] text-right text-sm leading-6 text-[#3f3e3b] transition-colors group-hover:text-[var(--work-fg-local)]">
                    {project.subtitle || project.description || project.tags?.slice(0, 3).join(" · ") || project.category}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={
                    "col-span-4 mt-3 hidden min-h-[9rem] items-center justify-center px-6 transition-[background-color] duration-500 md:col-span-3 md:mt-0 md:flex " +
                    (hasMedia ? "bg-[var(--work-local)]" : "bg-[var(--work-local)] opacity-40")
                  }
                >
                  <span className={hasMedia ? "text-sm font-semibold text-white" : "sr-only"}>{hasMedia ? "View work" : "Featured project"}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServicesBlock() {
  const [active, setActive] = useState(0);
  const rows: Discipline[] = STATIC_DISCIPLINES.slice(0, 4);

  return (
    <section
      data-tone="preto"
      aria-labelledby="services-home-title"
      className="bg-black px-4 py-20 text-[#f2f2ef] md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-12">
            <p className="text-sm font-semibold text-[#b9b7b0]">Services</p>
            <h2 id="services-home-title" className="mt-4 max-w-[1200px] font-cartaz text-[clamp(3rem,7.5vw,8rem)] font-extrabold leading-[0.86] tracking-[-0.06em]">
              Strategic design for brands that need clarity and impact.
            </h2>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-[#3f3e3b]">
          {rows.map((service, index) => {
            const isActive = index === active;
            return (
              <button
                type="button"
                key={service.id}
                aria-expanded={isActive}
                onClick={() => setActive((current) => (current === index ? -1 : index))}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className="group grid w-full grid-cols-4 gap-4 border-b-2 border-[#3f3e3b] py-6 text-left md:grid-cols-12 md:gap-6 md:py-8"
              >
                <span className="col-span-1 text-sm text-[#b9b7b0] md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
                <span className="col-span-3 md:col-span-7">
                  <span className="block font-cartaz text-[clamp(2.2rem,5vw,5.8rem)] font-extrabold leading-[0.88] tracking-[-0.05em]">
                    {service.title}
                  </span>
                  <span
                    className={
                      "grid transition-[grid-template-rows,opacity] duration-300 " +
                      (isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                    }
                  >
                    <span className="min-h-0 overflow-hidden pt-3 font-livro text-lg leading-[1.55] text-[#b9b7b0]">
                      {service.description}
                    </span>
                  </span>
                </span>
                <span className="col-span-4 flex items-start justify-end md:col-span-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center border-2 border-[#f2f2ef]">
                    <Plus className={isActive ? "rotate-45" : ""} size={18} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Link
            to="/services"
            viewTransition
            className="inline-flex min-h-11 items-center border-b-2 border-[#f2f2ef] px-0 py-2 text-sm font-bold text-[#f2f2ef]"
          >
            View capabilities
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProofBlock() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const { data: stats = [] } = useStats();
  const { data: siteMetrics = [] } = useSiteMetrics();
  const metrics = metricCards(settings);
  const experience = experienceRows(settings);
  const currentRole = experience.find((row) => row.current) ?? experience[0];
  const dbMetrics: DbStat[] = stats.filter((row) => row.is_active);
  const resolvedMetrics = siteMetrics.length
    ? siteMetrics.slice(0, 5).map((row) => ({ value: row.value ?? "", label: row.label }))
    : dbMetrics.length
      ? dbMetrics.slice(0, 5).map((row) => ({ value: row.value, label: row.label }))
      : metrics;

  return (
    <section
      data-tone="betao"
      aria-labelledby="proof-title"
      className="bg-[#d6d4ce] px-4 py-20 text-black md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-12">
            <p className="text-sm font-semibold">Proof</p>
            <h2 id="proof-title" className="mt-4 font-cartaz text-[clamp(3rem,8vw,8.4rem)] font-extrabold leading-[0.84] tracking-[-0.06em]">
              Built from real work.
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-4 gap-px border-2 border-black bg-black md:grid-cols-12">
          {resolvedMetrics.map((metric, index) => (
            <div key={metric.label + String(index)} className="col-span-4 border-2 border-black bg-[#d6d4ce] p-5 md:col-span-3 md:p-7">
              <div className="font-cartaz text-[clamp(3.2rem,6vw,6rem)] font-extrabold leading-none tracking-[-0.05em]">
                {metric.value}
              </div>
              <div className="mt-4 max-w-[13rem] text-sm leading-6 text-[#3f3e3b]">{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-8">
            <p className="text-sm font-semibold">Clients — {clients.length}</p>
            <div className="mt-5 grid grid-cols-2 border-t-2 border-black md:grid-cols-4">
              {clients.map((client) => (
                <span
                  key={client.id}
                  className="border-b-2 border-r-2 border-black px-3 py-4 text-[clamp(1rem,1.35vw,1.3rem)] font-semibold"
                >
                  {client.name}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-4 border-t-2 border-black pt-5 md:col-span-4">
            <p className="text-sm font-semibold">Current role</p>
            {currentRole ? (
              <Link to="/credentials" viewTransition className="mt-4 block border-b-2 border-black pb-5">
                <span className="block font-cartaz text-[clamp(2.1rem,3vw,3.6rem)] font-extrabold leading-[0.9] tracking-[-0.04em]">
                  {currentRole.role}
                </span>
                <span className="mt-3 block text-sm text-[#3f3e3b]">{currentRole.company}</span>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferenceBlock() {
  const { data: settings } = useSiteSettings();
  const reference = String(readSetting(settings, "credentials", "reference", "GOD"));

  return (
    <section
      data-tone="preto"
      aria-labelledby="reference-title"
      className="bg-black px-4 py-20 text-[#f2f2ef] md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-[1600px]">
        <p id="reference-title" className="text-sm font-semibold text-[#b9b7b0]">Reference</p>
        <div className="mt-10 grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-10 md:col-start-2">
            <p className="font-cartaz text-[clamp(7rem,23vw,24rem)] font-extrabold leading-[0.72] tracking-[-0.08em] text-[#f2f2ef]">
              {reference}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomePhase5() {
  return (
    <>
      <HomeHero />
      <FeaturedWorkBlock />
      <ServicesBlock />
      <ProofBlock />
      <ReferenceBlock />
    </>
  );
}
