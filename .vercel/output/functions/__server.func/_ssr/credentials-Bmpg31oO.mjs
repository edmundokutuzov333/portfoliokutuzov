import { d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { b as useSiteSettings, d as useClients, r as readSetting } from "./router-BjVSvuz8.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import { u as useReducedMotion, m as motion } from "../_libs/framer-motion.mjs";
import {
  A as ArrowUpRight,
  a as Mail,
  l as Phone,
  m as MapPin,
  n as CircleCheck,
  o as Sparkles,
} from "../_libs/lucide-react.mjs";
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
const FALLBACK_EXPERIENCE = [
  {
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
    period: "2024 - Present",
  },
  {
    role: "Art Director",
    company: "SPOT Comunicação",
    period: "2023 - 2024",
  },
  {
    role: "Graphic Designer",
    company: "Ikigai Moçambique",
    period: "2023",
  },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
  },
  {
    role: "Graphic Designer",
    company: "Agência Creer",
    period: "2020 - 2023",
  },
];
const METRICS = [
  {
    value: "6+",
    label: "Years",
    context: "Directing visual communication & strategy",
  },
  {
    value: "150+",
    label: "Projects",
    context: "Delivered across brand, digital & print",
  },
  {
    value: "30+",
    label: "Brands",
    context: "National and international collaborations",
  },
  {
    value: "3",
    label: "Continents",
    context: "Global creative exposure & delivery",
  },
  {
    value: "360º",
    label: "Capability",
    context: "From high-level strategy to craft execution",
  },
];
const CAPABILITY_GROUPS = [
  {
    category: "Core Disciplines",
    items: [
      "Art Direction",
      "Brand Identity Systems",
      "Campaign Design",
      "Creative Direction",
      "Visual Hierarchy & Typography",
    ],
  },
  {
    category: "Digital & Motion",
    items: [
      "Social-First Content Systems",
      "Motion Design & Key Art",
      "UI/UX Design Systems",
      "AI Creative Direction",
      "Audiovisual Storytelling",
    ],
  },
  {
    category: "Print & Special Projects",
    items: [
      "Editorial & Publications",
      "Large-Format OOH Billboards",
      "Packaging & Print Prep",
      "Music Video & Single Rollouts",
      "Streetwear Curation",
    ],
  },
];
const EASE_EDITORIAL = [0.16, 1, 0.3, 1];
function CredentialsPage() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  useReducedMotion();
  const r = (f, fb) => readSetting(settings, "about", f, fb);
  const s = (f, fb) => readSetting(settings, "social", f, fb);
  const experience = r("experience", FALLBACK_EXPERIENCE);
  const brands = r("brands", []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "bg-[var(--color-bg)] min-h-screen text-[var(--color-text-primary)]",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 pt-44 md:pt-48 pb-16 overflow-hidden",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto relative z-10",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: {
                        opacity: 0,
                        y: 15,
                      },
                      animate: {
                        opacity: 1,
                        y: 0,
                      },
                      transition: {
                        duration: 0.8,
                        ease: EASE_EDITORIAL,
                      },
                      className:
                        "flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase mb-12",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { children: r("eyebrow", "The Credentials") },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 91,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { children: r("top_right", "Edmundo Kutuzov · Art Director") },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 92,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 81,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.h1,
                    {
                      initial: {
                        opacity: 0,
                        y: 20,
                      },
                      animate: {
                        opacity: 1,
                        y: 0,
                      },
                      transition: {
                        duration: 0.8,
                        delay: 0.1,
                        ease: EASE_EDITORIAL,
                      },
                      className:
                        "display text-[clamp(2.75rem,7vw+1rem,7.5rem)] leading-[0.96] tracking-[-0.025em] max-w-5xl",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "span",
                          {
                            className: "text-[var(--color-text-primary)]",
                            children: [r("title_1", "Strategy, craft and a sharp"), " "],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 106,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "span",
                          {
                            className: "italic text-sky-300 font-normal",
                            children: r("title_accent", "point of view."),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 109,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 95,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className:
                        "mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: {
                              opacity: 0,
                            },
                            animate: {
                              opacity: 1,
                            },
                            transition: {
                              duration: 0.8,
                              delay: 0.25,
                            },
                            className:
                              "lg:col-span-7 text-[16px] md:text-[18px] text-slate-300 leading-relaxed space-y-6 font-normal",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "p",
                                {
                                  children: r(
                                    "bio_p1",
                                    "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action — blending storytelling, visual hierarchy, and typographic craft.",
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 124,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "p",
                                {
                                  children: r(
                                    "bio_p2",
                                    "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 127,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "p",
                                {
                                  children: r(
                                    "bio_p3",
                                    "My focus is always on experiences that generate recognition and measurable results — every choice I make is designed to maximise impact, perception, and brand memory.",
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 130,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "pt-4 flex items-center gap-4",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Link,
                                      {
                                        to: "/contact",
                                        className:
                                          "group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-sky-300 transition-colors",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "span",
                                            { children: "Start a Conversation" },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                              lineNumber: 136,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            ArrowUpRight,
                                            {
                                              size: 14,
                                              className:
                                                "transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                              lineNumber: 137,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                        lineNumber: 135,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Link,
                                      {
                                        to: "/services",
                                        className:
                                          "inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.1] hover:border-white/[0.2] transition-colors",
                                        children: "Explore Capabilities",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                        lineNumber: 139,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 134,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 116,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: {
                              opacity: 0,
                              y: 20,
                            },
                            animate: {
                              opacity: 1,
                              y: 0,
                            },
                            transition: {
                              duration: 0.8,
                              delay: 0.35,
                              ease: EASE_EDITORIAL,
                            },
                            className: "lg:col-span-5",
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "relative rounded-2xl border border-white/[0.1] bg-[#030712] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between pb-6 border-b border-white/[0.08]",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "p",
                                          {
                                            className:
                                              "mono text-[10px] tracking-[0.24em] text-sky-300/80 uppercase",
                                            children: "Direct Contact & Studio",
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 159,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "span",
                                          {
                                            className:
                                              "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "span",
                                                {
                                                  className:
                                                    "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse",
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 163,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                              "Available 2026",
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 162,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 158,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "mt-6 space-y-5 text-sm",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "flex items-start gap-3.5",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Mail,
                                                {
                                                  size: 16,
                                                  className: "text-sky-400 mt-0.5 shrink-0",
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 170,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "div",
                                                {
                                                  children: [
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className:
                                                          "mono text-[10px] uppercase text-slate-500 tracking-wider",
                                                        children: "Email",
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 172,
                                                        columnNumber: 23,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "a",
                                                      {
                                                        href: `mailto:${r("email", "contact@edmundokutuzov.art")}`,
                                                        className:
                                                          "text-white hover:text-sky-300 transition-colors font-medium",
                                                        children: r(
                                                          "email",
                                                          "contact@edmundokutuzov.art",
                                                        ),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 175,
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
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 171,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 169,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "flex items-start gap-3.5",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Phone,
                                                {
                                                  size: 16,
                                                  className: "text-sky-400 mt-0.5 shrink-0",
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 182,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "div",
                                                {
                                                  children: [
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className:
                                                          "mono text-[10px] uppercase text-slate-500 tracking-wider",
                                                        children: "Phone / WhatsApp",
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 184,
                                                        columnNumber: 23,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "a",
                                                      {
                                                        href: `tel:${String(r("phone", "+258 87 601 312 1")).replace(/\s/g, "")}`,
                                                        className:
                                                          "text-white hover:text-sky-300 transition-colors font-medium",
                                                        children: r("phone", "+258 87 601 312 1"),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 187,
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
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 183,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 181,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "flex items-start gap-3.5",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                MapPin,
                                                {
                                                  size: 16,
                                                  className: "text-sky-400 mt-0.5 shrink-0",
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 194,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "div",
                                                {
                                                  children: [
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className:
                                                          "mono text-[10px] uppercase text-slate-500 tracking-wider",
                                                        children: "Location",
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 196,
                                                        columnNumber: 23,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className: "text-slate-300",
                                                        children: r(
                                                          "location",
                                                          'Magoanine "C", Maputo · Mozambique',
                                                        ),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                        lineNumber: 199,
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
                                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                                  lineNumber: 195,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 193,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 168,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap gap-2",
                                      children: [
                                        {
                                          label: "LinkedIn",
                                          href: s("linkedin", "#"),
                                        },
                                        {
                                          label: "Instagram",
                                          href: s("instagram", "#"),
                                        },
                                        {
                                          label: "Facebook",
                                          href: s("facebook", "#"),
                                        },
                                      ].map((soc) =>
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "a",
                                          {
                                            href: soc.href,
                                            target: "_blank",
                                            rel: "noreferrer",
                                            className:
                                              "mono text-[10px] tracking-[0.15em] uppercase rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-slate-300 hover:text-white hover:border-sky-400/40 hover:bg-sky-950/20 transition-all duration-300",
                                            children: soc.label,
                                          },
                                          soc.label,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                            lineNumber: 217,
                                            columnNumber: 31,
                                          },
                                          this,
                                        ),
                                      ),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 207,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName:
                                  "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                lineNumber: 157,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 146,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 115,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 80,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 79,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 py-16 border-y border-white/[0.08] bg-[#02050c]",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl",
                    children: METRICS.map((c, i) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        motion.div,
                        {
                          initial: {
                            opacity: 0,
                            y: 12,
                          },
                          whileInView: {
                            opacity: 1,
                            y: 0,
                          },
                          viewport: {
                            once: true,
                            amount: 0.3,
                          },
                          transition: {
                            delay: i * 0.06,
                            duration: 0.6,
                            ease: EASE_EDITORIAL,
                          },
                          className:
                            "bg-[#040915] p-6 md:p-8 flex flex-col justify-between group hover:bg-[#081326] transition-colors duration-500",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "display text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight group-hover:text-sky-300 transition-colors",
                                children: c.value,
                              },
                              void 0,
                              false,
                              {
                                fileName:
                                  "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                lineNumber: 245,
                                columnNumber: 17,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "mt-6",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "mono text-[10px] tracking-[0.2em] text-sky-400 font-semibold uppercase",
                                      children: c.label,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 249,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "mt-1 text-[12px] leading-snug text-slate-400",
                                      children: c.context,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 252,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName:
                                  "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                lineNumber: 248,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ],
                        },
                        c.label,
                        true,
                        {
                          fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                          lineNumber: 231,
                          columnNumber: 36,
                        },
                        this,
                      ),
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                    lineNumber: 230,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 229,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 228,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 py-24 md:py-32",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: {
                        opacity: 0,
                        y: 16,
                      },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                      },
                      viewport: {
                        once: true,
                        amount: 0.3,
                      },
                      transition: {
                        duration: 0.7,
                        ease: EASE_EDITORIAL,
                      },
                      className:
                        "flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "p",
                                {
                                  className:
                                    "mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase",
                                  children: "Career History",
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 276,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "h2",
                                {
                                  className:
                                    "display text-3xl md:text-5xl text-white mt-2 tracking-tight",
                                  children: "Professional Experience",
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 279,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 275,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "p",
                          {
                            className: "text-sm text-slate-400 max-w-sm",
                            children:
                              "Chronological track record of agency and studio leadership across Mozambique.",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 283,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 262,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "flex flex-col",
                      children: experience.map((item, i) => {
                        const isPresent = item.period.toLowerCase().includes("present");
                        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: {
                              opacity: 0,
                              y: 15,
                            },
                            whileInView: {
                              opacity: 1,
                              y: 0,
                            },
                            viewport: {
                              once: true,
                              amount: 0.2,
                            },
                            transition: {
                              delay: i * 0.06,
                              duration: 0.6,
                              ease: EASE_EDITORIAL,
                            },
                            className: `group relative grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-white/[0.08] items-baseline rounded-xl transition-all duration-300 px-4 -mx-4 ${isPresent ? "bg-sky-950/10 border-sky-400/20 hover:bg-sky-950/20" : "hover:bg-white/[0.02]"}`,
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "md:col-span-3 mono text-xs tracking-[0.2em] text-sky-300/90 uppercase flex items-center gap-2",
                                  children: [
                                    item.period,
                                    isPresent &&
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "span",
                                        {
                                          className:
                                            "inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                          lineNumber: 307,
                                          columnNumber: 35,
                                        },
                                        this,
                                      ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 305,
                                  columnNumber: 19,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "md:col-span-5",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "h3",
                                    {
                                      className:
                                        "display text-xl sm:text-2xl text-white font-medium group-hover:text-sky-200 transition-colors",
                                      children: item.role,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                      lineNumber: 311,
                                      columnNumber: 21,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 310,
                                  columnNumber: 19,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "md:col-span-4 text-sm md:text-[15px] text-slate-300 font-normal",
                                  children: item.company,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 316,
                                  columnNumber: 19,
                                },
                                this,
                              ),
                            ],
                          },
                          `${item.role}-${item.company}-${i}`,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 291,
                            columnNumber: 20,
                          },
                          this,
                        );
                      }),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 288,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 261,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 260,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 py-20 border-t border-white/[0.08] bg-[#02050c]",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: {
                        opacity: 0,
                        y: 16,
                      },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                      },
                      viewport: {
                        once: true,
                        amount: 0.3,
                      },
                      transition: {
                        duration: 0.7,
                        ease: EASE_EDITORIAL,
                      },
                      className: "mb-12 pb-6 border-b border-white/[0.08]",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "p",
                          {
                            className:
                              "mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase",
                            children: "Skill Taxonomy",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 341,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "h2",
                          {
                            className:
                              "display text-3xl md:text-5xl text-white mt-2 tracking-tight",
                            children: "Scope of Competencies",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 344,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 328,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-8",
                      children: CAPABILITY_GROUPS.map((group, gIdx) =>
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: {
                              opacity: 0,
                              y: 15,
                            },
                            whileInView: {
                              opacity: 1,
                              y: 0,
                            },
                            viewport: {
                              once: true,
                              amount: 0.2,
                            },
                            transition: {
                              delay: gIdx * 0.1,
                              duration: 0.6,
                              ease: EASE_EDITORIAL,
                            },
                            className: "rounded-2xl border border-white/[0.08] bg-[#040915] p-8",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "mono text-[11px] tracking-[0.2em] text-sky-300 font-semibold uppercase mb-6 pb-3 border-b border-white/[0.06]",
                                  children: group.category,
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 364,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "ul",
                                {
                                  className: "space-y-4",
                                  children: group.items.map((item) =>
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "li",
                                      {
                                        className:
                                          "flex items-center gap-3 text-sm md:text-base text-slate-300 group cursor-default",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            CircleCheck,
                                            {
                                              size: 15,
                                              className:
                                                "text-sky-400 shrink-0 group-hover:scale-110 transition-transform",
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                              lineNumber: 369,
                                              columnNumber: 23,
                                            },
                                            this,
                                          ),
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "span",
                                            {
                                              className: "group-hover:text-white transition-colors",
                                              children: item,
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                              lineNumber: 370,
                                              columnNumber: 23,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      item,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                        lineNumber: 368,
                                        columnNumber: 44,
                                      },
                                      this,
                                    ),
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 367,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ],
                          },
                          group.category,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 350,
                            columnNumber: 53,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 349,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 327,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 326,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 py-24 md:py-32 border-t border-white/[0.08]",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      initial: {
                        opacity: 0,
                        y: 16,
                      },
                      whileInView: {
                        opacity: 1,
                        y: 0,
                      },
                      viewport: {
                        once: true,
                        amount: 0.3,
                      },
                      transition: {
                        duration: 0.7,
                        ease: EASE_EDITORIAL,
                      },
                      className:
                        "flex items-center justify-between mb-12 pb-6 border-b border-white/[0.08]",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "p",
                                {
                                  className:
                                    "mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase",
                                  children: "Proven Track Record",
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 395,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "h2",
                                {
                                  className:
                                    "display text-3xl md:text-5xl text-white mt-2 tracking-tight",
                                  children: "Selected Collaborations",
                                },
                                void 0,
                                false,
                                {
                                  fileName:
                                    "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                                  lineNumber: 398,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 394,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "span",
                          {
                            className:
                              "mono text-[11px] tracking-[0.2em] text-slate-500 uppercase hidden sm:block",
                            children: [brands.length || clients.length, "+ Brands"],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 402,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 381,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "flex flex-wrap gap-2.5 md:gap-3",
                      children: brands.map((brandName, bIdx) =>
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          motion.div,
                          {
                            initial: {
                              opacity: 0,
                              scale: 0.95,
                            },
                            whileInView: {
                              opacity: 1,
                              scale: 1,
                            },
                            viewport: {
                              once: true,
                            },
                            transition: {
                              delay: bIdx * 0.02,
                              duration: 0.4,
                            },
                            className:
                              "mono rounded-xl bg-white/[0.02] hover:bg-sky-950/25 px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase text-slate-300 hover:text-sky-200 border border-white/[0.08] hover:border-sky-400/40 transition-all duration-300 cursor-default",
                            children: brandName,
                          },
                          brandName,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 408,
                            columnNumber: 46,
                          },
                          this,
                        ),
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 407,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 380,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 379,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "relative px-4 md:px-8 py-16 border-t border-white/[0.08] bg-[#02050c]",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "max-w-[var(--width-wide)] mx-auto flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "flex items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Sparkles,
                          { size: 14, className: "text-sky-400" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 430,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "p",
                          {
                            className:
                              "mono text-[10px] tracking-[0.28em] text-slate-400 uppercase",
                            children: "Reference",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                            lineNumber: 431,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 429,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "p",
                    {
                      className:
                        "display text-3xl md:text-4xl tracking-[0.04em] text-sky-300 font-medium italic",
                      children: "GOD",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                      lineNumber: 433,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
                lineNumber: 428,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
            lineNumber: 427,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/credentials.tsx?tsr-split=component",
      lineNumber: 77,
      columnNumber: 10,
    },
    this,
  );
}
export { CredentialsPage as component };
