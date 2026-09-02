import * as React from "react";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { type DbProject } from "@/lib/cms";

export interface Discipline {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  deliverables: string[];
  projectMatcher: (p: DbProject) => boolean;
  defaultProjectTitle: string;
}

const DISCIPLINES: Discipline[] = [
  {
    id: "identity",
    number: "01",
    title: "Identity Visual",
    tagline: "Strategic brand marks, typography systems & identity architecture",
    description:
      "Transforming strategic brand intent into unmistakable visual form. Developing comprehensive visual grammar, logo systems, bespoke typographic pairings, colour scales, and rigorous brand guideline books built for permanence.",
    tags: ["Brand Identity", "Visual Grammar", "Typography", "Guidelines"],
    deliverables: [
      "Brand Architecture & Strategy",
      "Logo Marks & Symbol Systems",
      "Custom Typographic Scales",
      "Comprehensive Identity Guidelines",
    ],
    projectMatcher: (p) =>
      p.category === "Brand Identity" ||
      p.category === "Web Design" ||
      p.title.toLowerCase().includes("emose") ||
      p.title.toLowerCase().includes("cardoso"),
    defaultProjectTitle: "EMOSE",
  },
  {
    id: "art-direction",
    number: "02",
    title: "Art Direction",
    tagline: "Campaign conception, visual storytelling & photography direction",
    description:
      "Crafting the visual soul of campaigns and brand narratives. Directing photography, set styling, cinematic color grading, and commercial rollout systems that stop scrolling and demand attention across national and global markets.",
    tags: ["Campaign Design", "Photography Direction", "Commercial Rollout", "Visual Hierarchy"],
    deliverables: [
      "Campaign Visual Concepts",
      "Photography & Video Treatments",
      "Master Key Visuals (KV)",
      "Multi-Channel Rollout Systems",
    ],
    projectMatcher: (p) =>
      p.category === "Ad Campaigns" ||
      p.category === "Videos" ||
      p.title.toLowerCase().includes("absa") ||
      p.title.toLowerCase().includes("flying fish") ||
      p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Absa",
  },
  {
    id: "editorial",
    number: "03",
    title: "Editorial & Print",
    tagline: "Tactile publications, large-format OOH & packaging design",
    description:
      "Bringing precision and rhythm to tangible media. Editorial compositions, annual reports, large-format outdoor billboards, product packaging, and tactile print production oversight engineered with uncompromising typographic restraint.",
    tags: ["Publication Design", "OOH Billboards", "Packaging", "Print Production"],
    deliverables: [
      "Editorial Books & Publications",
      "Large-Format OOH & Billboards",
      "Packaging & Structural Design",
      "Print Production & Finish Specs",
    ],
    projectMatcher: (p) =>
      p.category === "Offline Actions" ||
      p.title.toLowerCase().includes("totalenergies") ||
      p.title.toLowerCase().includes("automotive") ||
      p.tags.some((t) => t.toLowerCase().includes("print")),
    defaultProjectTitle: "TotalEnergies",
  },
  {
    id: "digital",
    number: "04",
    title: "Digital Design",
    tagline: "Social-first content engines, motion assets & digital systems",
    description:
      "Designing modular digital ecosystems for continuous brand momentum. Social-first publication engines, UI/UX aesthetics, digital campaign kits, dynamic motion graphics, and interactive web interfaces optimized for high engagement.",
    tags: ["Social Systems", "Digital Campaign Kits", "Motion Assets", "UI Design Systems"],
    deliverables: [
      "Social-First Content Systems",
      "Dynamic Motion Language",
      "Digital Design Systems",
      "Interactive Web Experiences",
    ],
    projectMatcher: (p) =>
      p.category === "Social Media" ||
      p.category === "Digital Design" ||
      p.title.toLowerCase().includes("vodacom") ||
      p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Vodacom",
  },
];

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export function ServicesInteractive() {
  const { data: projects = [] } = useProjects();
  const [activeId, setActiveId] = useState<string>(DISCIPLINES[0].id);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const reducedMotion = useReducedMotion();

  // Floating cursor indicator position state
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHoveringList, setIsHoveringList] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const currentId = hoveredId || activeId;
  const currentDiscipline = DISCIPLINES.find((d) => d.id === currentId) || DISCIPLINES[0];

  // Resolve matching real project from portfolio
  const matchedProject = React.useMemo(() => {
    if (!projects || projects.length === 0) return null;

    // 1. Try finding project matching specific criteria
    const found = projects.find(currentDiscipline.projectMatcher);
    if (found && found.cover_url) return found;

    // 2. Try finding by title name
    const byName = projects.find(
      (p) =>
        p.title.toLowerCase().includes(currentDiscipline.defaultProjectTitle.toLowerCase()) &&
        p.cover_url,
    );
    if (byName) return byName;

    // 3. Fallback to any project with valid cover_url
    return projects.find((p) => Boolean(p.cover_url)) || projects[0] || null;
  }, [projects, currentDiscipline]);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHoveringList(true)}
      onMouseLeave={() => {
        setIsHoveringList(false);
        setHoveredId(null);
      }}
      className="relative px-4 md:px-8 py-16 md:py-24 bg-[var(--color-bg)] text-[var(--color-text-primary)]"
    >
      {/* Contextual Floating Follower on Desktop */}
      {!reducedMotion && isHoveringList && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 hidden lg:flex items-center gap-1.5 rounded-full bg-sky-400 text-black px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(56,189,248,0.4)] backdrop-blur-md"
          style={{
            left: 0,
            top: 0,
            transform: `translate3d(${mousePos.x + 20}px, ${mousePos.y + 20}px, 0)`,
          }}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
        >
          <span>VIEW</span>
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </motion.div>
      )}

      <div className="max-w-[var(--width-wide)] mx-auto">
        {/* Section Eyebrow */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-6 mb-12">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase">
              Core Disciplines & Capabilities
            </p>
          </div>
          <p className="mono text-[10px] tracking-[0.2em] text-slate-500 uppercase hidden sm:block">
            Interactive Architecture
          </p>
        </div>

        {/* 2-Column Responsive Layout: Left Disciplines List + Right Preview Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* LEFT: Disciplines Interactive List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {DISCIPLINES.map((discipline) => {
              const isHovered = hoveredId === discipline.id;
              const isActive = currentId === discipline.id;
              const isOtherHovered = hoveredId !== null && !isHovered;

              return (
                <motion.div
                  key={discipline.id}
                  onMouseEnter={() => {
                    setHoveredId(discipline.id);
                    setActiveId(discipline.id);
                  }}
                  onClick={() => setActiveId(discipline.id)}
                  initial="rest"
                  animate={isActive ? "hover" : "rest"}
                  variants={{
                    rest: { x: 0, opacity: isOtherHovered ? 0.38 : 0.85 },
                    hover: { x: reducedMotion ? 0 : 6, opacity: 1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                  }}
                  className={`group relative rounded-2xl border transition-all duration-300 p-6 md:p-8 cursor-pointer ${
                    isActive
                      ? "border-sky-400/30 bg-gradient-to-r from-sky-950/20 via-white/[0.02] to-transparent shadow-[0_0_30px_rgba(56,189,248,0.06)]"
                      : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.025]"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    {/* Header: Number + Title + Arrow */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Animated Section Number */}
                        <motion.span
                          variants={{
                            rest: { color: "rgba(148, 163, 184, 0.7)" },
                            hover: { color: "rgb(56, 189, 248)" },
                          }}
                          className="mono text-sm md:text-base font-semibold tracking-wider transition-colors duration-300"
                        >
                          {discipline.number}
                        </motion.span>

                        <h3 className="display text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-tight group-hover:text-sky-200 transition-colors">
                          {discipline.title}
                        </h3>
                      </div>

                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                          isActive
                            ? "border-sky-400/40 bg-sky-400/10 text-sky-300 scale-110"
                            : "border-white/[0.08] text-slate-500 group-hover:text-white group-hover:border-white/[0.2]"
                        }`}
                      >
                        <ArrowUpRight
                          size={15}
                          className={`transition-transform duration-300 ${
                            isActive ? "translate-x-0.5 -translate-y-0.5" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Tagline */}
                    <p className="text-[13px] md:text-sm text-sky-300/80 font-medium tracking-wide">
                      {discipline.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-[14px] md:text-[15px] leading-relaxed text-slate-300/90 font-normal">
                      {discipline.description}
                    </p>

                    {/* Deliverables / Scope Chips */}
                    <div className="pt-3 border-t border-white/[0.05] flex flex-wrap gap-2">
                      {discipline.deliverables.map((deliv) => (
                        <span
                          key={deliv}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-normal tracking-wide bg-white/[0.03] border border-white/[0.06] text-slate-300"
                        >
                          <Check size={11} className="text-sky-400" />
                          {deliv}
                        </span>
                      ))}
                    </div>

                    {/* Mobile Inline Visual Preview */}
                    <div className="lg:hidden mt-3 pt-3 border-t border-white/[0.08]">
                      {matchedProject && matchedProject.cover_url && (
                        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/[0.1] bg-[#050a14]">
                          <img
                            src={matchedProject.cover_url}
                            alt={matchedProject.title}
                            className="w-full h-full object-cover opacity-90"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-white">
                                {matchedProject.title}
                              </p>
                              <p className="mono text-[9px] text-sky-300 uppercase tracking-widest">
                                {matchedProject.category}
                              </p>
                            </div>
                            <Link
                              to="/portfolio/$slug"
                              params={{ slug: matchedProject.slug || matchedProject.id }}
                              className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white text-black"
                            >
                              Explore
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* RIGHT: Cinematic Visual Preview Area (5 cols, Desktop Sticky) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="relative rounded-2xl border border-white/[0.1] bg-[#030712] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-sky-400" />
                  <span className="mono text-[10px] tracking-[0.2em] text-slate-400 uppercase">
                    Portfolio Reference
                  </span>
                </div>
                <span className="mono text-[10px] tracking-[0.15em] text-sky-300 font-semibold uppercase">
                  {currentDiscipline.number} / 04
                </span>
              </div>

              {/* AnimatePresence Project Image Swapping */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#070e1c]">
                <AnimatePresence mode="wait">
                  {matchedProject && matchedProject.cover_url ? (
                    <motion.div
                      key={matchedProject.id + currentDiscipline.id}
                      initial={
                        reducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 1.04, filter: "blur(8px)" }
                      }
                      animate={{
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        transition: { duration: 0.6, ease: EASE_EDITORIAL },
                      }}
                      exit={
                        reducedMotion
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.98, filter: "blur(4px)" }
                      }
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={matchedProject.cover_url}
                        alt={matchedProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      />
                      {/* Subtle Vignette & Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#061122] to-[#02050c]">
                      <span className="mono text-xs text-sky-300 uppercase tracking-widest mb-2">
                        {currentDiscipline.title}
                      </span>
                      <p className="text-sm text-slate-400 max-w-xs">{currentDiscipline.tagline}</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Floating pill badge on preview */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/[0.15]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    {currentDiscipline.title}
                  </span>
                </div>
              </div>

              {/* Matched Project Metadata & Quick Action */}
              {matchedProject && (
                <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                  <div>
                    <h4 className="display text-lg text-white font-medium">
                      {matchedProject.title}
                    </h4>
                    <p className="mono text-[11px] text-slate-400 tracking-wider uppercase mt-0.5">
                      {matchedProject.subtitle || matchedProject.category}
                      {matchedProject.year ? ` · ${matchedProject.year}` : ""}
                    </p>
                  </div>

                  <Link
                    to="/portfolio/$slug"
                    params={{ slug: matchedProject.slug || matchedProject.id }}
                    className="group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/[0.08] hover:bg-sky-400 hover:text-black border border-white/[0.12] transition-all duration-300"
                  >
                    <span>View Case</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
