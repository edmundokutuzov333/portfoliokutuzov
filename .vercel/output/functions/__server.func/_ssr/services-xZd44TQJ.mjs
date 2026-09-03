import { d as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useProjects } from "./router--IsihV5_.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import { m as motion, u as useReducedMotion, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { A as ArrowUpRight, k as Check, o as Sparkles } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "./client-BWSZl9S1.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-BjuWTvBY.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/zod.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
import "../_libs/p-retry.mjs";
import "../_libs/retry.mjs";
import "../_libs/google-auth-library.mjs";
import "child_process";
import "querystring";
import "fs";
import "../_libs/gaxios.mjs";
import "https";
import "../_libs/extend.mjs";
import "../_libs/gcp-metadata.mjs";
import "os";
import "../_libs/json-bigint.mjs";
import "../_libs/bignumber.js.mjs";
import "../_libs/google-logging-utils.mjs";
import "events";
import "process";
import "path";
import "../_libs/base64-js.mjs";
import "../_libs/ecdsa-sig-formatter.mjs";
import "../_libs/safe-buffer.mjs";
import "buffer";
import "../_libs/jws.mjs";
import "../_libs/jwa.mjs";
import "../_libs/buffer-equal-constant-time.mjs";
import "fs/promises";
import "node:stream/promises";
import "../_libs/ws.mjs";
import "http";
import "net";
import "tls";
import "url";
import "zlib";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const DISCIPLINES = [
  {
    id: "identity",
    number: "01",
    title: "Identity Visual",
    tagline: "Strategic brand marks, typography systems & identity architecture",
    description: "Transforming strategic brand intent into unmistakable visual form. Developing comprehensive visual grammar, logo systems, bespoke typographic pairings, colour scales, and rigorous brand guideline books built for permanence.",
    tags: ["Brand Identity", "Visual Grammar", "Typography", "Guidelines"],
    deliverables: [
      "Brand Architecture & Strategy",
      "Logo Marks & Symbol Systems",
      "Custom Typographic Scales",
      "Comprehensive Identity Guidelines"
    ],
    projectMatcher: (p) => p.category === "Brand Identity" || p.category === "Web Design" || p.title.toLowerCase().includes("emose") || p.title.toLowerCase().includes("cardoso"),
    defaultProjectTitle: "EMOSE"
  },
  {
    id: "art-direction",
    number: "02",
    title: "Art Direction",
    tagline: "Campaign conception, visual storytelling & photography direction",
    description: "Crafting the visual soul of campaigns and brand narratives. Directing photography, set styling, cinematic color grading, and commercial rollout systems that stop scrolling and demand attention across national and global markets.",
    tags: ["Campaign Design", "Photography Direction", "Commercial Rollout", "Visual Hierarchy"],
    deliverables: [
      "Campaign Visual Concepts",
      "Photography & Video Treatments",
      "Master Key Visuals (KV)",
      "Multi-Channel Rollout Systems"
    ],
    projectMatcher: (p) => p.category === "Ad Campaigns" || p.category === "Videos" || p.title.toLowerCase().includes("absa") || p.title.toLowerCase().includes("flying fish") || p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Absa"
  },
  {
    id: "editorial",
    number: "03",
    title: "Editorial & Print",
    tagline: "Tactile publications, large-format OOH & packaging design",
    description: "Bringing precision and rhythm to tangible media. Editorial compositions, annual reports, large-format outdoor billboards, product packaging, and tactile print production oversight engineered with uncompromising typographic restraint.",
    tags: ["Publication Design", "OOH Billboards", "Packaging", "Print Production"],
    deliverables: [
      "Editorial Books & Publications",
      "Large-Format OOH & Billboards",
      "Packaging & Structural Design",
      "Print Production & Finish Specs"
    ],
    projectMatcher: (p) => p.category === "Offline Actions" || p.title.toLowerCase().includes("totalenergies") || p.title.toLowerCase().includes("automotive") || p.tags.some((t) => t.toLowerCase().includes("print")),
    defaultProjectTitle: "TotalEnergies"
  },
  {
    id: "digital",
    number: "04",
    title: "Digital Design",
    tagline: "Social-first content engines, motion assets & digital systems",
    description: "Designing modular digital ecosystems for continuous brand momentum. Social-first publication engines, UI/UX aesthetics, digital campaign kits, dynamic motion graphics, and interactive web interfaces optimized for high engagement.",
    tags: ["Social Systems", "Digital Campaign Kits", "Motion Assets", "UI Design Systems"],
    deliverables: [
      "Social-First Content Systems",
      "Dynamic Motion Language",
      "Digital Design Systems",
      "Interactive Web Experiences"
    ],
    projectMatcher: (p) => p.category === "Social Media" || p.category === "Digital Design" || p.title.toLowerCase().includes("vodacom") || p.title.toLowerCase().includes("multichoice"),
    defaultProjectTitle: "Vodacom"
  }
];
const EASE_EDITORIAL = [0.16, 1, 0.3, 1];
function ServicesInteractive() {
  const { data: projects = [] } = useProjects();
  const [activeId, setActiveId] = reactExports.useState(DISCIPLINES[0].id);
  const [hoveredId, setHoveredId] = reactExports.useState(null);
  const reducedMotion = useReducedMotion();
  const containerRef = reactExports.useRef(null);
  const [mousePos, setMousePos] = reactExports.useState({ x: 0, y: 0 });
  const [isHoveringList, setIsHoveringList] = reactExports.useState(false);
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };
  const currentId = hoveredId || activeId;
  const currentDiscipline = DISCIPLINES.find((d) => d.id === currentId) || DISCIPLINES[0];
  const matchedProject = reactExports.useMemo(() => {
    if (!projects || projects.length === 0) return null;
    const found = projects.find(currentDiscipline.projectMatcher);
    if (found && found.cover_url) return found;
    const byName = projects.find(
      (p) => p.title.toLowerCase().includes(currentDiscipline.defaultProjectTitle.toLowerCase()) && p.cover_url
    );
    if (byName) return byName;
    return projects.find((p) => Boolean(p.cover_url)) || projects[0] || null;
  }, [projects, currentDiscipline]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      ref: containerRef,
      onMouseMove: handleMouseMove,
      onMouseEnter: () => setIsHoveringList(true),
      onMouseLeave: () => {
        setIsHoveringList(false);
        setHoveredId(null);
      },
      className: "relative px-4 md:px-8 py-16 md:py-24 bg-[var(--color-bg)] text-[var(--color-text-primary)]",
      children: [
        !reducedMotion && isHoveringList && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          motion.div,
          {
            "aria-hidden": "true",
            className: "pointer-events-none fixed z-50 hidden lg:flex items-center gap-1.5 rounded-full bg-sky-400 text-black px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider shadow-[0_0_24px_rgba(56,189,248,0.4)] backdrop-blur-md",
            style: {
              left: 0,
              top: 0,
              transform: `translate3d(${mousePos.x + 20}px, ${mousePos.y + 20}px, 0)`
            },
            initial: { opacity: 0, scale: 0.7 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.7 },
            transition: { duration: 0.2 },
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "VIEW" }, void 0, false, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 181,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 13, strokeWidth: 2.5 }, void 0, false, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 182,
                columnNumber: 11
              }, this)
            ]
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
            lineNumber: 168,
            columnNumber: 9
          },
          this
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-wide)] mx-auto", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between border-b border-white/[0.08] pb-6 mb-12", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-2 h-2 rounded-full bg-sky-400 animate-pulse" }, void 0, false, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 190,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase", children: "Core Disciplines & Capabilities" }, void 0, false, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 191,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
              lineNumber: 189,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[10px] tracking-[0.2em] text-slate-500 uppercase hidden sm:block", children: "Interactive Architecture" }, void 0, false, {
              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
              lineNumber: 195,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
            lineNumber: 188,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:col-span-7 flex flex-col space-y-4", children: DISCIPLINES.map((discipline) => {
              const isHovered = hoveredId === discipline.id;
              const isActive = currentId === discipline.id;
              const isOtherHovered = hoveredId !== null && !isHovered;
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                motion.div,
                {
                  onMouseEnter: () => {
                    setHoveredId(discipline.id);
                    setActiveId(discipline.id);
                  },
                  onClick: () => setActiveId(discipline.id),
                  initial: "rest",
                  animate: isActive ? "hover" : "rest",
                  variants: {
                    rest: { x: 0, opacity: isOtherHovered ? 0.38 : 0.85 },
                    hover: { x: reducedMotion ? 0 : 6, opacity: 1 }
                  },
                  transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 24
                  },
                  className: `group relative rounded-2xl border transition-all duration-300 p-6 md:p-8 cursor-pointer ${isActive ? "border-sky-400/30 bg-gradient-to-r from-sky-950/20 via-white/[0.02] to-transparent shadow-[0_0_30px_rgba(56,189,248,0.06)]" : "border-white/[0.06] bg-white/[0.01] hover:border-white/[0.15] hover:bg-white/[0.025]"}`,
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-4", children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-4 md:gap-6", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.span,
                          {
                            variants: {
                              rest: { color: "rgba(148, 163, 184, 0.7)" },
                              hover: { color: "rgb(56, 189, 248)" }
                            },
                            className: "mono text-sm md:text-base font-semibold tracking-wider transition-colors duration-300",
                            children: discipline.number
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                            lineNumber: 239,
                            columnNumber: 25
                          },
                          this
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl sm:text-3xl md:text-4xl text-white font-medium tracking-tight group-hover:text-sky-200 transition-colors", children: discipline.title }, void 0, false, {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 249,
                          columnNumber: 25
                        }, this)
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 237,
                        columnNumber: 23
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: `flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${isActive ? "border-sky-400/40 bg-sky-400/10 text-sky-300 scale-110" : "border-white/[0.08] text-slate-500 group-hover:text-white group-hover:border-white/[0.2]"}`,
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            ArrowUpRight,
                            {
                              size: 15,
                              className: `transition-transform duration-300 ${isActive ? "translate-x-0.5 -translate-y-0.5" : ""}`
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                              lineNumber: 261,
                              columnNumber: 25
                            },
                            this
                          )
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 254,
                          columnNumber: 23
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 236,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[13px] md:text-sm text-sky-300/80 font-medium tracking-wide", children: discipline.tagline }, void 0, false, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 271,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[14px] md:text-[15px] leading-relaxed text-slate-300/90 font-normal", children: discipline.description }, void 0, false, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 276,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-3 border-t border-white/[0.05] flex flex-wrap gap-2", children: discipline.deliverables.map((deliv) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "span",
                      {
                        className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-normal tracking-wide bg-white/[0.03] border border-white/[0.06] text-slate-300",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { size: 11, className: "text-sky-400" }, void 0, false, {
                            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                            lineNumber: 287,
                            columnNumber: 27
                          }, this),
                          deliv
                        ]
                      },
                      deliv,
                      true,
                      {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 283,
                        columnNumber: 25
                      },
                      this
                    )) }, void 0, false, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 281,
                      columnNumber: 21
                    }, this),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "lg:hidden mt-3 pt-3 border-t border-white/[0.08]", children: matchedProject && matchedProject.cover_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-white/[0.1] bg-[#050a14]", children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "img",
                        {
                          src: matchedProject.cover_url,
                          alt: matchedProject.title,
                          className: "w-full h-full object-cover opacity-90",
                          loading: "lazy"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 297,
                          columnNumber: 27
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }, void 0, false, {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 303,
                        columnNumber: 27
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute bottom-3 left-3 right-3 flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-xs font-semibold text-white", children: matchedProject.title }, void 0, false, {
                            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                            lineNumber: 306,
                            columnNumber: 31
                          }, this),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[9px] text-sky-300 uppercase tracking-widest", children: matchedProject.category }, void 0, false, {
                            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                            lineNumber: 309,
                            columnNumber: 31
                          }, this)
                        ] }, void 0, true, {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 305,
                          columnNumber: 29
                        }, this),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Link,
                          {
                            to: "/portfolio/$slug",
                            params: { slug: matchedProject.slug || matchedProject.id },
                            className: "px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white text-black",
                            children: "Explore"
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                            lineNumber: 313,
                            columnNumber: 29
                          },
                          this
                        )
                      ] }, void 0, true, {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 304,
                        columnNumber: 27
                      }, this)
                    ] }, void 0, true, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 296,
                      columnNumber: 25
                    }, this) }, void 0, false, {
                      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                      lineNumber: 294,
                      columnNumber: 21
                    }, this)
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 234,
                    columnNumber: 19
                  }, this)
                },
                discipline.id,
                false,
                {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 210,
                  columnNumber: 17
                },
                this
              );
            }) }, void 0, false, {
              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
              lineNumber: 203,
              columnNumber: 11
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "hidden lg:block lg:col-span-5 sticky top-28", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative rounded-2xl border border-white/[0.1] bg-[#030712] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Sparkles, { size: 14, className: "text-sky-400" }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 336,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.2em] text-slate-400 uppercase", children: "Portfolio Reference" }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 337,
                    columnNumber: 19
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 335,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.15em] text-sky-300 font-semibold uppercase", children: [
                  currentDiscipline.number,
                  " / 04"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 341,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 334,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#070e1c]", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatePresence, { mode: "wait", children: matchedProject && matchedProject.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  motion.div,
                  {
                    initial: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04, filter: "blur(8px)" },
                    animate: {
                      opacity: 1,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: { duration: 0.6, ease: EASE_EDITORIAL }
                    },
                    exit: reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(4px)" },
                    className: "absolute inset-0 w-full h-full",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "img",
                        {
                          src: matchedProject.cover_url,
                          alt: matchedProject.title,
                          className: "w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 370,
                          columnNumber: 23
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-80" }, void 0, false, {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 376,
                        columnNumber: 23
                      }, this)
                    ]
                  },
                  matchedProject.id + currentDiscipline.id,
                  true,
                  {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 350,
                    columnNumber: 21
                  },
                  this
                ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#061122] to-[#02050c]", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-xs text-sky-300 uppercase tracking-widest mb-2", children: currentDiscipline.title }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 380,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-sm text-slate-400 max-w-xs", children: currentDiscipline.tagline }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 383,
                    columnNumber: 23
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 379,
                  columnNumber: 21
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 348,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "absolute top-3 left-3 z-10", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-black/60 text-white backdrop-blur-md border border-white/[0.15]", children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "w-1.5 h-1.5 rounded-full bg-sky-400" }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 391,
                    columnNumber: 21
                  }, this),
                  currentDiscipline.title
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 390,
                  columnNumber: 19
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 389,
                  columnNumber: 17
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 347,
                columnNumber: 15
              }, this),
              matchedProject && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h4", { className: "display text-lg text-white font-medium", children: matchedProject.title }, void 0, false, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 401,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "mono text-[11px] text-slate-400 tracking-wider uppercase mt-0.5", children: [
                    matchedProject.subtitle || matchedProject.category,
                    matchedProject.year ? ` · ${matchedProject.year}` : ""
                  ] }, void 0, true, {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 404,
                    columnNumber: 21
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                  lineNumber: 400,
                  columnNumber: 19
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  Link,
                  {
                    to: "/portfolio/$slug",
                    params: { slug: matchedProject.slug || matchedProject.id },
                    className: "group inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-white/[0.08] hover:bg-sky-400 hover:text-black border border-white/[0.12] transition-all duration-300",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "View Case" }, void 0, false, {
                        fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                        lineNumber: 415,
                        columnNumber: 21
                      }, this),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        ArrowUpRight,
                        {
                          size: 14,
                          className: "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                          lineNumber: 416,
                          columnNumber: 21
                        },
                        this
                      )
                    ]
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                    lineNumber: 410,
                    columnNumber: 19
                  },
                  this
                )
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
                lineNumber: 399,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
              lineNumber: 332,
              columnNumber: 13
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
              lineNumber: 331,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
            lineNumber: 201,
            columnNumber: 9
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
          lineNumber: 186,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/services/ServicesInteractive.tsx",
      lineNumber: 156,
      columnNumber: 5
    },
    this
  );
}
function ServicesPage() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "bg-[var(--color-bg)] min-h-screen", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "relative px-4 md:px-8 pt-44 md:pt-48 pb-12 md:pb-16 overflow-hidden", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-wide)] mx-auto relative z-10", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
        opacity: 0,
        y: 15
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }, className: "flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase mb-12", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "Methodology · Practice" }, void 0, false, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 19,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "Capabilities" }, void 0, false, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 20,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 9,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.h1, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        delay: 0.1,
        ease: [0.16, 1, 0.3, 1]
      }, className: "display text-[clamp(2.75rem,7vw+1rem,7.5rem)] leading-[0.96] tracking-[-0.025em] text-[var(--color-text-primary)] max-w-5xl", children: [
        "Visual capabilities &",
        " ",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "italic text-sky-300 font-normal", children: "disciplines." }, void 0, false, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 35,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 23,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.p, { initial: {
        opacity: 0
      }, animate: {
        opacity: 1
      }, transition: {
        duration: 0.8,
        delay: 0.25
      }, className: "mt-8 max-w-2xl text-[16px] md:text-lg text-[var(--color-text-secondary)] leading-relaxed", children: "The core disciplines used to construct enduring brand identities, direct high-impact campaigns, and engineer modular digital systems. Hover each discipline to inspect relevant case studies." }, void 0, false, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 38,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 8,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 7,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ServicesInteractive, {}, void 0, false, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 53,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "relative px-4 md:px-8 py-32 border-t border-[var(--color-border-subtle)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-standard)] mx-auto", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, whileInView: {
      opacity: 1,
      y: 0
    }, viewport: {
      once: true,
      amount: 0.3
    }, transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }, className: "text-center", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h2", { className: "display text-4xl md:text-6xl mt-8 max-w-3xl mx-auto leading-[1.05] tracking-[-0.02em]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-primary)]", children: [
          "Tell me about your brand and",
          " "
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 71,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "italic text-[var(--color-accent-hover)]", children: "let's get to work." }, void 0, false, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 74,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 70,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-16 flex justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/contact", className: "group flex h-14 items-center gap-3 rounded-full bg-[var(--color-text-primary)] px-8 text-[15px] font-semibold text-[var(--color-bg)] transition-all hover:bg-sky-300 hover:text-black focus:outline-none", children: [
        "Send a project brief",
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 18, className: "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" }, void 0, false, {
          fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
          lineNumber: 79,
          columnNumber: 17
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 77,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
        lineNumber: 76,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 57,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 56,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
      lineNumber: 55,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/services.tsx?tsr-split=component",
    lineNumber: 6,
    columnNumber: 10
  }, this);
}
export {
  ServicesPage as component
};
