import { d as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import {
  a as useProjects,
  b as useSiteSettings,
  o as ShinyButton,
  d as useClients,
  r as readSetting,
  x as cn,
  v as SITE_EMAIL,
} from "./router-BjVSvuz8.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import {
  m as motion,
  u as useReducedMotion,
  a as useScroll,
  b as useTransform,
  c as useMotionValue,
  d as useInView,
  e as animate,
} from "../_libs/framer-motion.mjs";
import { A as ArrowUpRight } from "../_libs/lucide-react.mjs";
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
import "./server-L5kFO_hB.mjs";
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
const EASE_EDITORIAL$1 = [0.16, 1, 0.3, 1];
function Hero() {
  const { data: settings } = useSiteSettings();
  const r = (f, fb) => readSetting(settings, "hero", f, fb);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className:
        "relative pt-12 pb-20 px-4 md:px-8 flex flex-col justify-center bg-[var(--color-bg)]",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "max-w-[var(--width-wide)] mx-auto w-full relative z-10",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, ease: EASE_EDITORIAL$1 },
                className:
                  "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-12 md:mb-16",
                children: r("top_left", "Edmundo Kutuzov · Art Director"),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/home/Hero.tsx",
                lineNumber: 17,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[1200px]",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "h1",
                  {
                    className:
                      "display text-[clamp(2.5rem,6vw+1rem,8rem)] leading-[0.95] font-medium tracking-[-0.03em]",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "span",
                        {
                          className: "block overflow-hidden pb-1",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            motion.span,
                            {
                              initial: { y: "100%" },
                              animate: { y: 0 },
                              transition: { duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL$1 },
                              className:
                                "block text-[var(--color-text-muted)] text-[clamp(1.5rem,4vw+1rem,4.5rem)] mb-2",
                              children: r("title_1", "I shape ideas that"),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/home/Hero.tsx",
                              lineNumber: 31,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/Hero.tsx",
                          lineNumber: 30,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "span",
                        {
                          className: "block overflow-hidden pb-2",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            motion.span,
                            {
                              initial: { y: "100%" },
                              animate: { y: 0 },
                              transition: { duration: 0.8, delay: 0.15, ease: EASE_EDITORIAL$1 },
                              className: "block text-[var(--color-text-primary)]",
                              children: r("title_2", "cut through noise,"),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/home/Hero.tsx",
                              lineNumber: 41,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/Hero.tsx",
                          lineNumber: 40,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "span",
                        {
                          className: "block overflow-hidden pb-2",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            motion.span,
                            {
                              initial: { y: "100%" },
                              animate: { y: 0 },
                              transition: { duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL$1 },
                              className: "block text-[var(--color-text-primary)]",
                              children: r("title_3", "stay in memory,"),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/home/Hero.tsx",
                              lineNumber: 51,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/Hero.tsx",
                          lineNumber: 50,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "span",
                        {
                          className: "block overflow-hidden pb-2",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            motion.span,
                            {
                              initial: { opacity: 0, x: -15 },
                              animate: { opacity: 1, x: 0 },
                              transition: { duration: 0.8, delay: 0.35, ease: EASE_EDITORIAL$1 },
                              className: "block text-[var(--color-accent-base)] italic pr-4",
                              children: r("title_accent", "and move people."),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/home/Hero.tsx",
                              lineNumber: 63,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/Hero.tsx",
                          lineNumber: 62,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/home/Hero.tsx",
                    lineNumber: 28,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/home/Hero.tsx",
                lineNumber: 27,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 10 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.8, delay: 0.45, ease: EASE_EDITORIAL$1 },
                      className: "md:col-span-5 lg:col-span-4",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "p",
                        {
                          className:
                            "text-[16px] md:text-[18px] text-[var(--color-text-secondary)] leading-relaxed",
                          children: r(
                            "subtitle",
                            "Building visual systems, digital products, and campaigns that establish authority on an international scale.",
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/Hero.tsx",
                          lineNumber: 84,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/Hero.tsx",
                      lineNumber: 78,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: { opacity: 0, y: 10 },
                      animate: { opacity: 1, y: 0 },
                      transition: { duration: 0.8, delay: 0.55, ease: EASE_EDITORIAL$1 },
                      className:
                        "md:col-span-7 lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-6 sm:gap-8",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: { opacity: 0, scale: 0.9 },
                            animate: { opacity: 1, scale: 1 },
                            transition: { duration: 0.6, delay: 0.65, ease: EASE_EDITORIAL$1 },
                            className: "flex items-center gap-3",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "span",
                                {
                                  className: "relative flex h-2 w-2",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className:
                                        "relative inline-flex rounded-full h-2 w-2 bg-green-400",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/home/Hero.tsx",
                                      lineNumber: 107,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/Hero.tsx",
                                  lineNumber: 106,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "span",
                                {
                                  className:
                                    "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-secondary)]",
                                  children: r("status", "Available for projects"),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/Hero.tsx",
                                  lineNumber: 109,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/components/home/Hero.tsx",
                            lineNumber: 100,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "flex items-center gap-4",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                ShinyButton,
                                { to: "/portfolio", children: r("cta_primary", "Explore work") },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/Hero.tsx",
                                  lineNumber: 115,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Link,
                                {
                                  to: "/contact",
                                  className:
                                    "group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)]",
                                  "aria-label": "Start a project",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    ArrowUpRight,
                                    {
                                      size: 16,
                                      className:
                                        "transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/home/Hero.tsx",
                                      lineNumber: 121,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/Hero.tsx",
                                  lineNumber: 116,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/components/home/Hero.tsx",
                            lineNumber: 114,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/home/Hero.tsx",
                      lineNumber: 93,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/home/Hero.tsx",
                lineNumber: 76,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/home/Hero.tsx",
          lineNumber: 15,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/home/Hero.tsx",
      lineNumber: 14,
      columnNumber: 5,
    },
    this,
  );
}
const getCarouselConfig = (width) => {
  if (width < 640) {
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }
  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }
  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};
function CinematicPortfolioReel() {
  const { data: projectsData } = useProjects();
  const baseProjects = (projectsData || []).filter((p) => p.cover_url);
  const [slides, setSlides] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (baseProjects.length > 0) {
      const shuffled = [...baseProjects].sort(() => Math.random() - 0.5);
      const newSlides = [];
      while (newSlides.length < 20) {
        newSlides.push(...shuffled);
      }
      setSlides(newSlides);
    }
  }, [baseProjects.length]);
  if (slides.length === 0) {
    return null;
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className:
        "relative w-full overflow-hidden bg-[var(--color-bg)] pt-28 pb-8 md:pt-32 md:pb-12",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "w-full flex justify-center mb-10 px-4 relative z-10",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              motion.p,
              {
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
                className:
                  "mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]",
                children: "Selected Portfolio Reel",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                lineNumber: 85,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
            lineNumber: 84,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          CarouselStacked,
          { slides },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
            lineNumber: 94,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
      lineNumber: 83,
      columnNumber: 5,
    },
    this,
  );
}
const CarouselStacked = ({ slides }) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = reactExports.useRef(0);
  const [windowWidth, setWindowWidth] = reactExports.useState(0);
  const total = slides.length;
  const prefersReducedMotion = useReducedMotion();
  const animationRef = reactExports.useRef(void 0);
  const isDragging = reactExports.useRef(false);
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  reactExports.useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const play = () => {
      if (!isDragging.current) {
        scrollProgress.set(scrollProgress.get() + 0.02);
      }
      animationRef.current = requestAnimationFrame(play);
    };
    animationRef.current = requestAnimationFrame(play);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scrollProgress, prefersReducedMotion]);
  const config = reactExports.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);
  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };
  const handleDragEnd = (_, info) => {
    isDragging.current = false;
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;
    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;
    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));
    const target = Math.round(startProgress.current) + totalShift;
    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden select-none",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "relative flex h-full w-full items-center justify-center",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              motion.div,
              {
                drag: "x",
                dragConstraints: { left: 0, right: 0 },
                onDragStart: handleDragStart,
                onDrag: (_, info) => {
                  const delta = -info.delta.x / config.sensitivity;
                  scrollProgress.set(scrollProgress.get() + delta);
                },
                onDragEnd: handleDragEnd,
                className: "absolute inset-0 z-50 cursor-grab active:cursor-grabbing touch-pan-y",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                lineNumber: 169,
                columnNumber: 9,
              },
              void 0,
            ),
            slides.map((slide, index) =>
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                CarouselCard,
                {
                  slide,
                  index,
                  total,
                  progress: scrollProgress,
                  config,
                },
                `${slide.id}-${index}`,
                false,
                {
                  fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                  lineNumber: 182,
                  columnNumber: 11,
                },
                void 0,
              ),
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
          lineNumber: 168,
          columnNumber: 7,
        },
        void 0,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
      lineNumber: 167,
      columnNumber: 5,
    },
    void 0,
  );
};
const CarouselCard = ({ slide, index, total, progress, config }) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });
  const x = useTransform(offset, (value) => value * config.xMultiplier);
  const y = useTransform(offset, (value) => {
    const abs = Math.abs(value);
    if (abs < 0.05) return 0;
    return abs * config.yMultiplier;
  });
  const rotate = useTransform(offset, (value) => {
    if (Math.abs(value) < 0.05) return 0;
    return value * config.rotationMultiplier;
  });
  const scale = useTransform(offset, (value) => {
    return 1 - Math.abs(value) * config.scaleReduction;
  });
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (value) => {
    return Math.round(100 - Math.abs(value) * 10);
  });
  const badge = slide.category + (slide.year ? ` · ${slide.year}` : "");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      style: { x, y, rotate, scale, opacity, zIndex },
      className:
        "absolute h-[85%] w-auto aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-black border border-[var(--color-border-subtle)]",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "relative w-full h-full bg-[#050505]",
          children: [
            slide.cover_url &&
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "img",
                {
                  src: slide.cover_url,
                  alt: slide.title,
                  className: "w-full h-full object-contain object-center",
                  draggable: false,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                  lineNumber: 259,
                  columnNumber: 11,
                },
                void 0,
              ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className:
                  "pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                lineNumber: 266,
                columnNumber: 9,
              },
              void 0,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "absolute bottom-6 left-6 right-6",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2",
                      children: badge,
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                      lineNumber: 268,
                      columnNumber: 11,
                    },
                    void 0,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "h3",
                    {
                      className:
                        "display text-2xl md:text-3xl text-white font-medium leading-[1.1] tracking-[-0.02em]",
                      children: slide.title,
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                      lineNumber: 271,
                      columnNumber: 11,
                    },
                    void 0,
                  ),
                  slide.subtitle &&
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      { className: "text-white/80 text-sm mt-1", children: slide.subtitle },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                        lineNumber: 274,
                        columnNumber: 30,
                      },
                      void 0,
                    ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
                lineNumber: 267,
                columnNumber: 9,
              },
              void 0,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
          lineNumber: 257,
          columnNumber: 7,
        },
        void 0,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/ui/cinematic-portfolio-reel.tsx",
      lineNumber: 242,
      columnNumber: 5,
    },
    void 0,
  );
};
const capabilities = [
  "Art Direction",
  "Brand Identity",
  "Campaign Design",
  "Creative Direction",
  "AI Creative Direction",
  "Digital Experience",
];
function CapabilitiesShort() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className: "py-24 md:py-32 px-4 md:px-8 bg-[var(--color-bg)]",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className:
            "max-w-[var(--width-wide)] mx-auto border-t border-[var(--color-border-subtle)] pt-16",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "md:col-span-4 lg:col-span-3",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4",
                          children: "Capabilities",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                          lineNumber: 20,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "h2",
                        {
                          className:
                            "text-[1.5rem] md:text-[2rem] leading-tight font-medium tracking-tight text-[var(--color-text-primary)]",
                          children: "Strategy, craft and a sharp point of view.",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                          lineNumber: 23,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                    lineNumber: 19,
                    columnNumber: 11,
                  },
                  this,
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "md:col-span-8 lg:col-span-9 flex flex-col md:flex-row md:items-end justify-between gap-12",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "ul",
                        {
                          className: "grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12",
                          children: capabilities.map((cap, i) =>
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              motion.li,
                              {
                                initial: { opacity: 0, y: 10 },
                                whileInView: { opacity: 1, y: 0 },
                                viewport: { once: true, margin: "-100px" },
                                transition: {
                                  duration: 0.6,
                                  delay: i * 0.05,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                                className:
                                  "text-[1.25rem] md:text-[1.5rem] tracking-tight text-[var(--color-text-primary)]",
                                children: cap,
                              },
                              cap,
                              false,
                              {
                                fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                                lineNumber: 31,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                          lineNumber: 29,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        Link,
                        {
                          to: "/services",
                          className:
                            "group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-6 py-3 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)]",
                          children: [
                            "View capabilities",
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              ArrowUpRight,
                              {
                                size: 14,
                                className:
                                  "opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                                lineNumber: 49,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                          lineNumber: 44,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
                    lineNumber: 28,
                    columnNumber: 11,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
              lineNumber: 18,
              columnNumber: 9,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
          lineNumber: 17,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/home/CapabilitiesShort.tsx",
      lineNumber: 16,
      columnNumber: 5,
    },
    this,
  );
}
function Marquee({
  speed = 35,
  pauseOnHover = true,
  reverse = false,
  className,
  children,
  style,
  ...props
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      style: {
        "--duration": `${speed}s`,
        ...style,
      },
      className: cn(
        "group flex overflow-hidden p-2 [--gap:1.5rem] md:[--gap:2rem] gap-[var(--gap)]",
        "[mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]",
        className,
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: cn(
              "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee items-center",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]",
            ),
            children,
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ui/marquee.tsx",
            lineNumber: 35,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            "aria-hidden": "true",
            className: cn(
              "flex shrink-0 justify-around gap-[var(--gap)] animate-marquee items-center",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
              reverse && "[animation-direction:reverse]",
            ),
            children,
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/ui/marquee.tsx",
            lineNumber: 44,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/ui/marquee.tsx",
      lineNumber: 21,
      columnNumber: 5,
    },
    this,
  );
}
function CinematicLogoCloud({ clients, className }) {
  const row1 = clients.slice(0, Math.ceil(clients.length / 2));
  const row2 = clients.slice(Math.ceil(clients.length / 2));
  const renderClient = (c) => {
    if (c.logo_url) {
      return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "img",
        {
          src: c.logo_url,
          alt: c.name,
          width: c.logo_width ?? void 0,
          height: c.logo_height ?? void 0,
          className:
            "h-8 md:h-10 w-auto max-w-[130px] md:max-w-[160px] object-contain opacity-75 group-hover:opacity-100 transition-opacity",
          loading: "lazy",
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
          lineNumber: 30,
          columnNumber: 9,
        },
        this,
      );
    }
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "span",
      {
        className:
          "display text-sm md:text-base font-medium tracking-[0.04em] text-center text-slate-200 opacity-75 group-hover:opacity-100 transition-opacity",
        children: c.name,
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
        lineNumber: 41,
        columnNumber: 7,
      },
      this,
    );
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: cn("w-full py-4", className),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        motion.div,
        {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, margin: "-50px" },
          variants: {
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          },
          className: "space-y-4 md:space-y-6 w-full",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Marquee,
              {
                speed: 35,
                className: "[--gap:1.25rem] md:[--gap:2rem]",
                children: row1.map((client, idx) =>
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      variants: itemVariants,
                      className:
                        "group flex shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5 md:px-8 md:py-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]",
                      children: renderClient(client),
                    },
                    client.id || `${client.name}-${idx}`,
                    false,
                    {
                      fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
                      lineNumber: 82,
                      columnNumber: 13,
                    },
                    this,
                  ),
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
                lineNumber: 80,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Marquee,
              {
                speed: 35,
                reverse: true,
                className: "[--gap:1.25rem] md:[--gap:2rem]",
                children: row2.map((client, idx) =>
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      variants: itemVariants,
                      className:
                        "group flex shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5 md:px-8 md:py-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]",
                      children: renderClient(client),
                    },
                    client.id || `${client.name}-${idx}`,
                    false,
                    {
                      fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
                      lineNumber: 94,
                      columnNumber: 13,
                    },
                    this,
                  ),
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
                lineNumber: 92,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
          lineNumber: 66,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/ui/cinematic-logo-cloud.tsx",
      lineNumber: 65,
      columnNumber: 5,
    },
    this,
  );
}
function ClientLogos() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const r = (f, fb) => readSetting(settings, "clients_section", f, fb);
  const title = r("title", "Brands and teams\nI have worked with.");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className: "relative px-5 md:px-8 py-24 bg-[var(--color-bg)]",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "max-w-[1240px] mx-auto",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "grid grid-cols-12 gap-6 mb-12",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "col-span-12 md:col-span-5",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.p,
                          {
                            initial: { opacity: 0, y: 10 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true },
                            className:
                              "mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase",
                            children: r("eyebrow", "Selected Clients"),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                            lineNumber: 18,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.h2,
                          {
                            initial: { opacity: 0, y: 15 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true },
                            transition: { delay: 0.1 },
                            className:
                              "display text-3xl md:text-4xl mt-4 text-metal leading-[1.05] whitespace-pre-line",
                            children: title,
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                            lineNumber: 26,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                      lineNumber: 17,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "col-span-12 md:col-span-5 md:col-start-8 self-end",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        motion.p,
                        {
                          initial: { opacity: 0, y: 15 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true },
                          transition: { delay: 0.2 },
                          className: "text-sm text-[var(--color-text-muted)] leading-relaxed",
                          children: r("subtitle", ""),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                          lineNumber: 37,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                      lineNumber: 36,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                lineNumber: 16,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              CinematicLogoCloud,
              { clients, className: "mt-8 md:mt-12" },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/home/ClientLogos.tsx",
                lineNumber: 50,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/home/ClientLogos.tsx",
          lineNumber: 15,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/home/ClientLogos.tsx",
      lineNumber: 14,
      columnNumber: 5,
    },
    this,
  );
}
const EXPERIENCE_DATA = [
  {
    period: "2024 – Present",
    role: "Art Director & Content Creator",
    company: "WEBMASTERS",
    isCurrent: true,
  },
  {
    period: "2023 – 2024",
    role: "Art Director",
    company: "SPOT Comunicação",
  },
  {
    period: "2023",
    role: "Senior Graphic Designer",
    company: "Ikigai Moçambique",
  },
  {
    period: "2023",
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
  },
  {
    period: "2020 – 2023",
    role: "Graphic Designer",
    company: "Agência Creer",
  },
];
const NUMBERS_DATA = [
  {
    num: 6,
    suffix: "+",
    label: "Years of experience",
  },
  {
    num: 150,
    suffix: "+",
    label: "Projects delivered",
  },
  {
    num: 30,
    suffix: "+",
    label: "National and international brands",
  },
  {
    num: 3,
    suffix: "",
    label: "Continents",
  },
  {
    num: 360,
    suffix: "°",
    label: "Art direction, branding, strategy, AI, marketing",
  },
];
const EASE_EDITORIAL = [0.16, 1, 0.3, 1];
function CountUpNumber({ num, suffix, reducedMotion }) {
  const [displayValue, setDisplayValue] = reactExports.useState(reducedMotion ? num : 0);
  const ref = reactExports.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  reactExports.useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(num);
      return;
    }
    if (!isInView) return;
    const controls = animate(0, num, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [isInView, num, reducedMotion]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "span",
    { ref, className: "tabular-nums", children: [displayValue, suffix] },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
      lineNumber: 115,
      columnNumber: 5,
    },
    this,
  );
}
function HomeExperience() {
  const reducedMotion = useReducedMotion();
  const referenceSectionRef = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({
    target: referenceSectionRef,
    offset: ["start end", "end start"],
  });
  const rawGodX = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const godX = reducedMotion ? 0 : rawGodX;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className:
        "relative px-5 md:px-8 py-24 bg-[var(--color-bg)] text-[var(--color-text-primary)]",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "max-w-[1240px] mx-auto",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "mb-8",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        motion.p,
                        {
                          initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true },
                          transition: { duration: 0.6, ease: EASE_EDITORIAL },
                          className: "mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase",
                          children: "Experience",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                          lineNumber: 142,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 141,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 },
                      whileInView: reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 },
                      viewport: { once: true, margin: "-10% 0px" },
                      transition: { duration: 0.7, ease: EASE_EDITORIAL },
                      style: { transformOrigin: "left" },
                      className: "w-full h-px bg-white/[0.08]",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 154,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "space-y-0",
                      children: EXPERIENCE_DATA.map((item, i) =>
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                motion.div,
                                {
                                  initial: "hidden",
                                  whileInView: "visible",
                                  viewport: { once: true, margin: "-10% 0px" },
                                  variants: {
                                    hidden: {},
                                    visible: {
                                      transition: {
                                        staggerChildren: reducedMotion ? 0 : 0.12,
                                        delayChildren: i * 0.05,
                                      },
                                    },
                                  },
                                  whileHover: reducedMotion
                                    ? void 0
                                    : {
                                        opacity: 1,
                                        x: 4,
                                      },
                                  transition: {
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 24,
                                  },
                                  className: `group grid grid-cols-12 gap-4 py-6 items-baseline transition-colors px-4 -mx-4 rounded-lg cursor-default ${item.isCurrent ? "bg-white/[0.02] hover:bg-white/[0.04]" : "hover:bg-white/[0.02]"}`,
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      motion.div,
                                      {
                                        variants: {
                                          hidden: reducedMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: 14 },
                                          visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                              duration: 0.6,
                                              ease: EASE_EDITORIAL,
                                            },
                                          },
                                        },
                                        className:
                                          "col-span-12 md:col-span-3 flex items-center gap-2",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "span",
                                            {
                                              className: `mono text-[11px] tracking-[0.2em] uppercase ${item.isCurrent ? "text-sky-300 font-medium" : "text-slate-400 group-hover:text-slate-300 transition-colors"}`,
                                              children: item.period,
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/home/HomeExperience.tsx",
                                              lineNumber: 213,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          item.isCurrent &&
                                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "span",
                                              {
                                                className:
                                                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-sky-400/10 text-sky-300 border border-sky-400/25",
                                                children: [
                                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                    "span",
                                                    {
                                                      className:
                                                        "w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse",
                                                    },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "/app/applet/src/components/home/HomeExperience.tsx",
                                                      lineNumber: 224,
                                                      columnNumber: 25,
                                                    },
                                                    this,
                                                  ),
                                                  "Present",
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/home/HomeExperience.tsx",
                                                lineNumber: 223,
                                                columnNumber: 23,
                                              },
                                              this,
                                            ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/components/home/HomeExperience.tsx",
                                        lineNumber: 199,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      motion.div,
                                      {
                                        variants: {
                                          hidden: reducedMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: 14 },
                                          visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                              duration: 0.6,
                                              ease: EASE_EDITORIAL,
                                            },
                                          },
                                        },
                                        className: `col-span-12 md:col-span-6 display text-lg md:text-xl transition-colors ${item.isCurrent ? "text-white font-medium group-hover:text-sky-100" : "text-[var(--color-text-primary)] group-hover:text-white"}`,
                                        children: item.role,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/home/HomeExperience.tsx",
                                        lineNumber: 231,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      motion.div,
                                      {
                                        variants: {
                                          hidden: reducedMotion
                                            ? { opacity: 0 }
                                            : { opacity: 0, y: 14 },
                                          visible: {
                                            opacity: 1,
                                            y: 0,
                                            transition: {
                                              duration: 0.6,
                                              ease: EASE_EDITORIAL,
                                            },
                                          },
                                        },
                                        className: `col-span-12 md:col-span-3 text-sm md:text-right font-medium transition-all ${item.isCurrent ? "text-slate-200 group-hover:text-sky-300" : "text-[var(--color-text-secondary)] group-hover:text-slate-200"}`,
                                        children: item.company,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/home/HomeExperience.tsx",
                                        lineNumber: 253,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                                  lineNumber: 166,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                motion.div,
                                {
                                  initial: reducedMotion
                                    ? { opacity: 0 }
                                    : { scaleX: 0, opacity: 0 },
                                  whileInView: reducedMotion
                                    ? { opacity: 1 }
                                    : { scaleX: 1, opacity: 1 },
                                  viewport: { once: true, margin: "-10% 0px" },
                                  transition: {
                                    duration: 0.7,
                                    ease: EASE_EDITORIAL,
                                  },
                                  style: { transformOrigin: "left" },
                                  className: "w-full h-px bg-white/[0.08]",
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                                  lineNumber: 276,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ],
                          },
                          `${item.role}-${item.company}-${i}`,
                          true,
                          {
                            fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                            lineNumber: 165,
                            columnNumber: 15,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 163,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                lineNumber: 140,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "mt-28",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "flex items-center justify-between mb-8",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        motion.p,
                        {
                          initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
                          whileInView: { opacity: 1, y: 0 },
                          viewport: { once: true },
                          transition: { duration: 0.6, ease: EASE_EDITORIAL },
                          className: "mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase",
                          children: "In Numbers",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                          lineNumber: 297,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 296,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 },
                      whileInView: reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 },
                      viewport: { once: true, margin: "-10% 0px" },
                      transition: { duration: 0.8, ease: EASE_EDITORIAL },
                      style: { transformOrigin: "left" },
                      className:
                        "w-full h-px bg-gradient-to-r from-sky-400/40 via-sky-400/10 to-transparent mb-6",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 309,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className:
                        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl",
                      children: NUMBERS_DATA.map((c, i) =>
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
                            whileInView: { opacity: 1, y: 0 },
                            viewport: { once: true, margin: "-15%" },
                            transition: {
                              duration: 0.65,
                              delay: i * 0.08,
                              ease: EASE_EDITORIAL,
                            },
                            className: `bg-[#030814] p-7 min-h-[180px] flex flex-col justify-between group hover:bg-[#06111f] transition-colors duration-300 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : "col-span-1"}`,
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "display text-4xl md:text-5xl text-white tracking-[-0.02em] font-medium group-hover:scale-105 origin-left transition-transform duration-500",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    CountUpNumber,
                                    { num: c.num, suffix: c.suffix, reducedMotion },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/home/HomeExperience.tsx",
                                      lineNumber: 336,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                                  lineNumber: 335,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                motion.div,
                                {
                                  initial: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                                  whileInView: { opacity: 1, y: 0 },
                                  viewport: { once: true },
                                  transition: {
                                    duration: 0.5,
                                    delay: i * 0.08 + 0.15,
                                    ease: EASE_EDITORIAL,
                                  },
                                  className: "mt-6",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "text-[13px] leading-snug text-slate-300 font-normal",
                                      children: c.label,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/home/HomeExperience.tsx",
                                      lineNumber: 351,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                                  lineNumber: 340,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ],
                          },
                          c.label,
                          true,
                          {
                            fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                            lineNumber: 320,
                            columnNumber: 15,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 318,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                lineNumber: 295,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                ref: referenceSectionRef,
                className: "mt-32",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 },
                      whileInView: reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 },
                      viewport: { once: true, margin: "-10% 0px" },
                      transition: { duration: 0.8, ease: EASE_EDITORIAL },
                      style: { transformOrigin: "left" },
                      className: "w-full h-px bg-white/[0.08]",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 365,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: "hidden",
                      whileInView: "visible",
                      viewport: { once: true },
                      variants: {
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.15,
                            duration: 0.6,
                          },
                        },
                      },
                      className: "flex items-center justify-between pt-8",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.p,
                          {
                            variants: {
                              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.6, ease: EASE_EDITORIAL },
                              },
                            },
                            className:
                              "mono text-[10px] tracking-[0.28em] text-slate-500 uppercase",
                            children: "Reference",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                            lineNumber: 391,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.p,
                          {
                            style: { x: godX },
                            variants: {
                              hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                              visible: {
                                opacity: 1,
                                y: 0,
                                transition: { duration: 0.7, ease: EASE_EDITORIAL },
                              },
                            },
                            className:
                              "display text-2xl md:text-3xl tracking-[0.05em] text-[var(--color-accent-base)] italic font-serif",
                            children: "GOD",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                            lineNumber: 406,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                      lineNumber: 374,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/home/HomeExperience.tsx",
                lineNumber: 363,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/home/HomeExperience.tsx",
          lineNumber: 136,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/home/HomeExperience.tsx",
      lineNumber: 135,
      columnNumber: 5,
    },
    this,
  );
}
function HomeCTA() {
  const { data: settings } = useSiteSettings();
  const r = (f, fb) => readSetting(settings, "cta_home", f, fb);
  const email = r("email", SITE_EMAIL);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className: "relative px-5 md:px-8 py-28",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "max-w-[1240px] mx-auto",
          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            motion.div,
            {
              initial: { opacity: 0, y: 18 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.3 },
              transition: { duration: 0.7 },
              className:
                "relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-8 md:p-16",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    "aria-hidden": true,
                    className: "absolute inset-0 opacity-50",
                    style: {
                      background:
                        "radial-gradient(600px circle at 80% 20%, rgba(29,155,255,0.18), transparent 60%), radial-gradient(500px circle at 10% 90%, rgba(11,59,115,0.28), transparent 60%)",
                    },
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                    lineNumber: 22,
                    columnNumber: 11,
                  },
                  this,
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "relative",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "p",
                        {
                          className: "mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase",
                          children: r("eyebrow", "Let's collaborate"),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                          lineNumber: 31,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "h2",
                        {
                          className:
                            "display text-3xl sm:text-5xl md:text-6xl mt-6 max-w-4xl leading-[1.02] tracking-[-0.025em]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "text-metal",
                                children: r("title_1", "Let's build a visual presence"),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                                lineNumber: 35,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            " ",
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "italic text-accent",
                                children: r("title_accent", "impossible to ignore."),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                                lineNumber: 36,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                          lineNumber: 34,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "mt-10 flex flex-wrap items-center gap-4",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              ShinyButton,
                              {
                                to: "/contact",
                                children: [
                                  r("cta_primary", "Start a project"),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    ArrowUpRight,
                                    { size: 16 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                                      lineNumber: 43,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                                lineNumber: 41,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "a",
                              {
                                href: `mailto:${email}`,
                                className:
                                  "inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white border-b border-white/15 pb-1 ml-2",
                                children: email,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                                lineNumber: 45,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                          lineNumber: 40,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/home/HomeCTA.tsx",
                    lineNumber: 30,
                    columnNumber: 11,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/home/HomeCTA.tsx",
              lineNumber: 15,
              columnNumber: 9,
            },
            this,
          ),
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/components/home/HomeCTA.tsx",
          lineNumber: 14,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/home/HomeCTA.tsx",
      lineNumber: 13,
      columnNumber: 5,
    },
    this,
  );
}
function HomePage() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    jsxDevRuntimeExports.Fragment,
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          CinematicPortfolioReel,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 9,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          Hero,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 10,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          CapabilitiesShort,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 11,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          ClientLogos,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 12,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          HomeExperience,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 13,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          HomeCTA,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
            lineNumber: 14,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/index.tsx?tsr-split=component",
      lineNumber: 8,
      columnNumber: 10,
    },
    this,
  );
}
export { HomePage as component };
