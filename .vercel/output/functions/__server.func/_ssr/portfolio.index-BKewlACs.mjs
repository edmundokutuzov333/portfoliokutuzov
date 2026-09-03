import { d as jsxDevRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { f as useSearch, e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { a as useProjects, P as PROJECT_CATEGORIES, n as normalizeCategory } from "./router--IsihV5_.mjs";
import { C as ContextualCursor } from "./ContextualCursor-Ca8EVY8I.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import { m as motion, L as LayoutGroup, A as AnimatePresence } from "../_libs/framer-motion.mjs";
import { s as Search, X, A as ArrowUpRight, g as Layers, t as Play } from "../_libs/lucide-react.mjs";
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
const ALL_CATEGORIES = ["All", ...PROJECT_CATEGORIES];
function attachmentCount(p) {
  return (p.cover_url ? 1 : 0) + (p.gallery?.length ?? 0);
}
function ProjectCard({ project, index = 0 }) {
  const count = attachmentCount(project);
  const showCount = count > 2;
  const slug = project.slug || project.id;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.article,
    {
      layout: "position",
      initial: { opacity: 0, y: 32 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-60px" },
      exit: { opacity: 0, scale: 0.96 },
      transition: {
        duration: 0.65,
        delay: Math.min(index % 2 * 0.08, 0.16),
        ease: [0.16, 1, 0.3, 1]
      },
      className: "group flex flex-col w-full col-span-1",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        Link,
        {
          to: "/portfolio/$slug",
          params: { slug },
          "data-cursor": project.video_url ? "PLAY" : "VIEW",
          className: "flex flex-col gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)] rounded-sm",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative w-full overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border-subtle)] transition-colors duration-500 group-hover:border-[var(--color-border-base)]", children: [
              project.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                motion.img,
                {
                  layoutId: `project-cover-${project.id}`,
                  src: project.cover_url,
                  alt: project.title,
                  width: project.cover_width ?? void 0,
                  height: project.cover_height ?? void 0,
                  loading: "lazy",
                  decoding: "async",
                  style: {
                    display: "block",
                    width: "100%",
                    height: "auto",
                    objectFit: "contain"
                  },
                  className: "transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-[1.025]"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 45,
                  columnNumber: 13
                },
                this
              ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-[4/3] w-full flex items-center justify-center text-[var(--color-text-muted)] mono text-xs", children: "No artwork" }, void 0, false, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 62,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pointer-events-none absolute inset-x-0 bottom-4 flex justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg)]/90 px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-[var(--color-text-primary)] border border-white/20 backdrop-blur-md shadow-lg", children: [
                "VIEW PROJECT ",
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 12, strokeWidth: 2 }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 70,
                  columnNumber: 28
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 69,
                columnNumber: 13
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 68,
                columnNumber: 11
              }, this),
              showCount && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 bg-[var(--color-bg)]/80 px-2.5 py-1 text-[9px] tracking-[0.2em] text-[var(--color-text-primary)] backdrop-blur-md border border-white/10", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Layers, { size: 10, strokeWidth: 2 }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 76,
                  columnNumber: 15
                }, this),
                count
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 75,
                columnNumber: 13
              }, this),
              project.video_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pointer-events-none absolute inset-0 grid place-items-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg)]/60 text-white backdrop-blur-md border border-white/15 transition-transform duration-300 group-hover:scale-110", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Play, { size: 20, strokeWidth: 1.5, className: "translate-x-[2px]" }, void 0, false, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 84,
                columnNumber: 17
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 83,
                columnNumber: 15
              }, this) }, void 0, false, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 82,
                columnNumber: 13
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
              lineNumber: 43,
              columnNumber: 9
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-1.5 px-0.5", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.01em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-[1.1]", children: project.title }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 93,
                  columnNumber: 13
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--color-text-muted)] opacity-0 group-hover:opacity-100 group-hover:text-[var(--color-text-primary)] transition-all duration-300 transform translate-y-1 group-hover:translate-y-0", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 18, strokeWidth: 1.5 }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 97,
                  columnNumber: 15
                }, this) }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 96,
                  columnNumber: 13
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 92,
                columnNumber: 11
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-text-secondary)] mt-0.5", children: [
                project.client_name && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "font-medium text-[var(--color-text-primary)]", children: project.client_name }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 104,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-muted)] opacity-40", children: "/" }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 107,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 103,
                  columnNumber: 15
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-text-secondary)]", children: project.category }, void 0, false, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 110,
                  columnNumber: 13
                }, this),
                project.year && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-muted)] opacity-40", children: "/" }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 115,
                    columnNumber: 17
                  }, this),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] tracking-[0.15em] uppercase text-[var(--color-text-muted)]", children: project.year }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 116,
                    columnNumber: 17
                  }, this)
                ] }, void 0, true, {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 114,
                  columnNumber: 15
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 101,
                columnNumber: 11
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
              lineNumber: 91,
              columnNumber: 9
            }, this)
          ]
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
          lineNumber: 36,
          columnNumber: 7
        },
        this
      )
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
      lineNumber: 23,
      columnNumber: 5
    },
    this
  );
}
function PortfolioGrid() {
  const { data: projects = [], isLoading } = useProjects();
  const searchParams = useSearch({ strict: false });
  const navigate = useNavigate();
  const categoryParam = searchParams?.category && ALL_CATEGORIES.includes(searchParams.category) ? searchParams.category : "All";
  const queryParam = searchParams?.q || "";
  const [filter, setFilter] = reactExports.useState(categoryParam);
  const [query, setQuery] = reactExports.useState(queryParam);
  reactExports.useEffect(() => {
    setFilter(categoryParam);
    setQuery(queryParam);
  }, [categoryParam, queryParam]);
  const updateUrlState = reactExports.useCallback(
    (newFilter, newQuery) => {
      const searchObj = {};
      if (newFilter && newFilter !== "All") {
        searchObj.category = newFilter;
      }
      if (newQuery.trim()) {
        searchObj.q = newQuery.trim();
      }
      navigate({
        to: "/portfolio",
        search: searchObj,
        replace: true
      }).catch(() => {
      });
    },
    [navigate]
  );
  const handleFilterChange = (category) => {
    setFilter(category);
    updateUrlState(category, query);
  };
  const handleQueryChange = (val) => {
    setQuery(val);
    updateUrlState(filter, val);
  };
  const handleReset = () => {
    setFilter("All");
    setQuery("");
    updateUrlState("All", "");
  };
  const publishedProjects = reactExports.useMemo(() => {
    return projects.filter((p) => p.is_published !== false);
  }, [projects]);
  const filtered = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    return publishedProjects.filter((p) => {
      const cat = normalizeCategory(p.category);
      if (filter !== "All" && cat !== filter) return false;
      if (!q) return true;
      const title = (p.title ?? "").toLowerCase();
      const year = (p.year ?? "").toLowerCase();
      const client = (p.client_name ?? "").toLowerCase();
      const role = (p.role ?? "").toLowerCase();
      const concept = (p.concept ?? "").toLowerCase();
      const description = (p.description ?? "").toLowerCase();
      const tags = (p.tags ?? []).join(" ").toLowerCase();
      const deliverables = (p.deliverables ?? []).join(" ").toLowerCase();
      const categoryName = (p.category ?? "").toLowerCase();
      return title.includes(q) || year.includes(q) || client.includes(q) || role.includes(q) || concept.includes(q) || description.includes(q) || tags.includes(q) || deliverables.includes(q) || categoryName.includes(q);
    });
  }, [filter, publishedProjects, query]);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "w-full relative", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ContextualCursor, {}, void 0, false, {
      fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
      lineNumber: 222,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-40px" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        className: "mb-12 md:mb-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-[var(--color-border-subtle)] pb-8",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LayoutGroup, { id: "portfolio-categories", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "-mx-1 flex flex-nowrap items-center gap-2 overflow-x-auto px-1 pb-2 md:pb-0 md:flex-wrap md:overflow-visible no-scrollbar", children: ALL_CATEGORIES.map((category) => {
            const isActive = filter === category;
            return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                type: "button",
                onClick: () => handleFilterChange(category),
                className: clsx(
                  "relative mono shrink-0 rounded-full px-4 py-2.5 text-[11px] tracking-[0.15em] uppercase transition-all duration-300",
                  isActive ? "text-[var(--color-bg)] font-bold" : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-base)]"
                ),
                children: [
                  isActive && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    motion.div,
                    {
                      layoutId: "activeCategoryHighlight",
                      className: "absolute inset-0 bg-[var(--color-text-primary)] rounded-full z-0",
                      transition: { type: "spring", bounce: 0.15, duration: 0.5 }
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                      lineNumber: 249,
                      columnNumber: 21
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "relative z-10", children: category }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 255,
                    columnNumber: 19
                  }, this)
                ]
              },
              category,
              true,
              {
                fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                lineNumber: 237,
                columnNumber: 17
              },
              this
            );
          }) }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
            lineNumber: 233,
            columnNumber: 11
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
            lineNumber: 232,
            columnNumber: 9
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto", children: [
            !isLoading && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[11px] tracking-[0.15em] uppercase text-[var(--color-text-muted)] self-center sm:self-auto shrink-0", children: [
              "Showing ",
              filtered.length,
              " of ",
              publishedProjects.length
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
              lineNumber: 265,
              columnNumber: 13
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative w-full md:w-80", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Search,
                {
                  size: 16,
                  className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 271,
                  columnNumber: 13
                },
                this
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  type: "text",
                  value: query,
                  onChange: (e) => handleQueryChange(e.target.value),
                  placeholder: "Search archive...",
                  "aria-label": "Search portfolio archive",
                  className: "w-full rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] py-3 pl-11 pr-10 text-[14px] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-hover)] focus:bg-[var(--color-surface-elevated)] focus:outline-none transition-colors"
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 275,
                  columnNumber: 13
                },
                this
              ),
              query && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  type: "button",
                  onClick: () => handleQueryChange(""),
                  "aria-label": "Clear search",
                  className: "absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(X, { size: 14 }, void 0, false, {
                    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                    lineNumber: 290,
                    columnNumber: 17
                  }, this)
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
                  lineNumber: 284,
                  columnNumber: 15
                },
                this
              )
            ] }, void 0, true, {
              fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
              lineNumber: 270,
              columnNumber: 11
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
            lineNumber: 263,
            columnNumber: 9
          }, this)
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 225,
        columnNumber: 7
      },
      this
    ),
    isLoading ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-col gap-4 col-span-1", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "aspect-[4/3] bg-[var(--color-surface-elevated)] border border-[var(--color-border-subtle)] animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 302,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-6 w-2/3 bg-[var(--color-surface-elevated)] rounded animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 303,
        columnNumber: 15
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-3 w-1/3 bg-[var(--color-surface-elevated)] rounded animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 304,
        columnNumber: 15
      }, this)
    ] }, i, true, {
      fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
      lineNumber: 301,
      columnNumber: 13
    }, this)) }, void 0, false, {
      fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
      lineNumber: 299,
      columnNumber: 9
    }, this) : filtered.length === 0 ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.div,
      {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.4 },
        className: "grid place-items-center border border-[var(--color-border-subtle)] bg-[var(--color-surface)] py-28 px-6 text-center",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-3", children: "No matching projects" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
            lineNumber: 316,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "max-w-md text-[15px] text-[var(--color-text-secondary)] leading-relaxed", children: query ? `No projects found for "${query}"${filter !== "All" ? ` in category "${filter}"` : ""}.` : `No projects found in category "${filter}".` }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
            lineNumber: 319,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "button",
            {
              type: "button",
              onClick: handleReset,
              className: "mt-6 mono text-[11px] tracking-[0.15em] uppercase font-semibold text-[var(--color-text-primary)] border-b border-[var(--color-text-primary)] pb-0.5 hover:text-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)] transition-colors",
              children: "Clear filters & search"
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
              lineNumber: 324,
              columnNumber: 11
            },
            this
          )
        ]
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 309,
        columnNumber: 9
      },
      this
    ) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      motion.div,
      {
        layout: true,
        className: "grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-x-12 md:gap-y-16 lg:gap-x-14 lg:gap-y-20",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(AnimatePresence, { mode: "popLayout", children: filtered.map((project, index) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ProjectCard, { project, index }, project.id, false, {
          fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
          lineNumber: 339,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
          lineNumber: 337,
          columnNumber: 11
        }, this)
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
        lineNumber: 333,
        columnNumber: 9
      },
      this
    )
  ] }, void 0, true, {
    fileName: "/app/applet/src/components/portfolio/PortfolioGrid.tsx",
    lineNumber: 221,
    columnNumber: 5
  }, this);
}
function PortfolioPage() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "relative px-4 md:px-8 pt-48 pb-32 bg-[var(--color-bg)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-wide)] mx-auto", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
      opacity: 0,
      y: 15
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1]
    }, className: "flex items-start justify-between mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-16", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "Archive" }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
        lineNumber: 16,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: "2018—2026" }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
        lineNumber: 17,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
      lineNumber: 6,
      columnNumber: 9
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
    }, className: "display text-[clamp(3rem,8vw+1rem,9rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]", children: "Selected Work." }, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
      lineNumber: 20,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
      opacity: 0,
      y: 30
    }, animate: {
      opacity: 1,
      y: 0
    }, transition: {
      duration: 1,
      delay: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }, className: "mt-20 md:mt-32", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(PortfolioGrid, {}, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
      lineNumber: 45,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
      lineNumber: 34,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
    lineNumber: 5,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "/app/applet/src/routes/portfolio.index.tsx?tsr-split=component",
    lineNumber: 4,
    columnNumber: 10
  }, this);
}
export {
  PortfolioPage as component
};
