import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { V as notFound } from "../_libs/tanstack__router-core.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { y as Route$1, a as useProjects, v as SITE_EMAIL } from "./router-DUKWfrGf.mjs";
import { C as ContextualCursor } from "./ContextualCursor-Ca8EVY8I.mjs";
import "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import { v as ArrowLeft, A as ArrowUpRight, w as ArrowRight } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
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
import "./server-D2mK8el-.mjs";
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
function youtubeEmbed(url) {
  const m = url.match(/youtu\.be\/([\w-]{6,})/i) || url.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([\w-]{6,})/i);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
function vimeoEmbed(url) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}
function VideoPlayer({
  url,
  provider,
  poster,
  title
}) {
  const yt = provider === "youtube" || /youtu/i.test(url) ? youtubeEmbed(url) : null;
  const vm = provider === "vimeo" || /vimeo/i.test(url) ? vimeoEmbed(url) : null;
  if (yt || vm) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "relative w-full", style: {
      aspectRatio: "16 / 9"
    }, children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("iframe", { src: yt || vm, title, className: "absolute inset-0 h-full w-full", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true }, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 35,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 32,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("video", { src: url, poster: poster ?? void 0, controls: true, playsInline: true, preload: "metadata", className: "h-auto max-h-[78vh] w-full bg-[var(--color-bg)]" }, void 0, false, {
    fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
    lineNumber: 38,
    columnNumber: 10
  }, this);
}
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};
const itemFadeUp = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};
function ProjectDetailPage() {
  const {
    slug
  } = Route$1.useParams();
  const {
    data: rawProjects = [],
    isLoading
  } = useProjects();
  const publishedProjects = reactExports.useMemo(() => {
    return rawProjects.filter((p) => p.is_published !== false);
  }, [rawProjects]);
  const {
    project,
    prev,
    next
  } = reactExports.useMemo(() => {
    if (!publishedProjects.length) return {
      project: null,
      prev: null,
      next: null
    };
    const idx = publishedProjects.findIndex((p) => (p.slug || p.id) === slug);
    if (idx === -1) return {
      project: null,
      prev: null,
      next: null
    };
    const prevIdx = (idx - 1 + publishedProjects.length) % publishedProjects.length;
    const nextIdx = (idx + 1) % publishedProjects.length;
    return {
      project: publishedProjects[idx],
      prev: publishedProjects[prevIdx],
      next: publishedProjects[nextIdx]
    };
  }, [publishedProjects, slug]);
  if (isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "px-5 md:px-8 pt-40 pb-24 bg-[var(--color-bg)] min-h-screen", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-wide)] mx-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-4 w-32 bg-[var(--color-surface-elevated)] rounded animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 108,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-16 w-3/4 mt-8 bg-[var(--color-surface-elevated)] rounded animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 109,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-[60vh] mt-16 bg-[var(--color-surface-elevated)] rounded-xl animate-pulse" }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 110,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 107,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 106,
      columnNumber: 12
    }, this);
  }
  if (!project) {
    throw notFound();
  }
  const disciplines = [project.category, ...project.tags ?? []].filter(Boolean);
  const brief = project.concept || project.description || "";
  const approach = project.idea || project.role || "";
  const outcome = project.notes || project.subtitle || "";
  const galleryMeta = project.gallery_meta ?? [];
  const galleryUrls = project.gallery ?? [];
  const allGallery = galleryMeta.length > 0 ? galleryMeta : galleryUrls.map((url) => ({
    url
  }));
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("article", { className: "relative px-5 md:px-8 pt-36 md:pt-40 pb-32 bg-[var(--color-bg)]", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ContextualCursor, {}, void 0, false, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 132,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-[var(--width-wide)] mx-auto", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/portfolio", className: "group inline-flex items-center gap-3 mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent-hover)]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { size: 14, className: "transition-transform group-hover:-translate-x-1" }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 137,
          columnNumber: 11
        }, this),
        "Back to archive"
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 136,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.header, { variants: containerVariants, initial: "hidden", animate: "visible", className: "mt-12 md:mt-16", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { variants: itemFadeUp, className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)]", children: [
          project.year ? `${project.year} · ` : "",
          project.category
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 143,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.h1, { variants: itemFadeUp, className: "display mt-5 text-5xl md:text-7xl lg:text-[92px] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]", children: project.client_name || project.title }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 148,
          columnNumber: 11
        }, this),
        project.client_name && project.title !== project.client_name && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.p, { variants: itemFadeUp, className: "mt-3 text-[18px] md:text-2xl text-[var(--color-text-secondary)] font-normal", children: project.title }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 152,
          columnNumber: 76
        }, this),
        disciplines.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { variants: itemFadeUp, className: "mt-8 flex flex-wrap gap-2", children: disciplines.map((d) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-4 py-1.5 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]", children: d }, d, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 157,
          columnNumber: 37
        }, this)) }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 156,
          columnNumber: 38
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 142,
        columnNumber: 9
      }, this),
      project.video_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
        opacity: 0,
        y: 20
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        delay: 0.2
      }, "data-cursor": "PLAY", className: "mt-12 md:mt-16 overflow-hidden rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(VideoPlayer, { url: project.video_url, provider: project.video_provider, poster: project.cover_url, title: project.title }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 174,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 164,
        columnNumber: 30
      }, this) : project.cover_url ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-12 md:mt-16 overflow-hidden border border-[var(--color-border-subtle)] bg-[var(--color-surface)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.img, { layoutId: `project-cover-${project.id}`, src: project.cover_url, alt: project.title, width: project.cover_width ?? void 0, height: project.cover_height ?? void 0, decoding: "async", style: {
        display: "block",
        width: "100%",
        height: "auto",
        objectFit: "contain"
      }, transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      } }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 176,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 175,
        columnNumber: 47
      }, this) : null,
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
        opacity: 0,
        y: 30
      }, animate: {
        opacity: 1,
        y: 0
      }, transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.16, 1, 0.3, 1]
      }, className: "mt-20 md:mt-28 grid gap-12 md:grid-cols-12 md:gap-16 items-start", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "md:col-span-8 space-y-16", children: [
          brief && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6", children: "The Brief" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 201,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-secondary)] max-w-2xl", children: brief }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 204,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 200,
            columnNumber: 23
          }, this),
          approach && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6", children: "The Approach" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 210,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-primary)] max-w-2xl", children: approach }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 213,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 209,
            columnNumber: 26
          }, this),
          outcome && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "relative border-l border-[var(--color-accent-base)] pl-8 py-2", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4", children: "The Outcome" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 219,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[16px] md:text-[18px] leading-relaxed text-[var(--color-text-primary)] max-w-2xl", children: outcome }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 222,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 218,
            columnNumber: 25
          }, this),
          project.deliverables && project.deliverables.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6", children: "Deliverables" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 228,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 text-[15px] text-[var(--color-text-secondary)] max-w-2xl", children: project.deliverables.map((d) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-[var(--color-text-muted)]", children: "—" }, void 0, false, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 233,
                columnNumber: 23
              }, this),
              " ",
              d
            ] }, d, true, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 232,
              columnNumber: 50
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 231,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 227,
            columnNumber: 73
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 199,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("aside", { className: "md:col-span-4 space-y-8 border-t border-[var(--color-border-subtle)] pt-12 md:border-t-0 md:pt-0", children: [
          project.client_name && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2", children: "Client" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 241,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[15px] text-[var(--color-text-primary)] font-medium", children: project.client_name }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 244,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 240,
            columnNumber: 37
          }, this),
          project.role && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2", children: "Role" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 249,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[15px] text-[var(--color-text-primary)]", children: project.role }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 252,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 248,
            columnNumber: 30
          }, this),
          project.year && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2", children: "Year" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 255,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[15px] text-[var(--color-text-primary)]", children: project.year }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 258,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 254,
            columnNumber: 30
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-2", children: "Discipline" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 261,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[15px] text-[var(--color-text-primary)]", children: project.category }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 264,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 260,
            columnNumber: 13
          }, this),
          project.tools_used && project.tools_used.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-3", children: "Tools" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 268,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", children: project.tools_used.map((t) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-3 py-1.5 text-[10px] tracking-[0.1em] uppercase text-[var(--color-text-secondary)]", children: t }, t, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 272,
              columnNumber: 48
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 271,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 267,
            columnNumber: 69
          }, this),
          project.collaborators && project.collaborators.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-3", children: "Collaborators" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 279,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-1.5 text-[14px] text-[var(--color-text-secondary)]", children: project.collaborators.map((c) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { children: c }, c, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 283,
              columnNumber: 51
            }, this)) }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 282,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 278,
            columnNumber: 75
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "pt-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: `mailto:${SITE_EMAIL}?subject=${encodeURIComponent(`Project inquiry similar to ${project.client_name || project.title}`)}`, className: "group inline-flex w-full justify-between items-center gap-3 rounded-full bg-[var(--color-text-primary)] px-6 py-4 text-[13px] font-semibold text-[var(--color-bg)] transition-colors hover:bg-[var(--color-text-secondary)]", children: [
            "Start a similar project",
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 16, strokeWidth: 2, className: "transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 290,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 288,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 287,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 239,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 188,
        columnNumber: 9
      }, this),
      allGallery.length > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-32 border-t border-[var(--color-border-subtle)] pt-16", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
          opacity: 0,
          y: 15
        }, whileInView: {
          opacity: 1,
          y: 0
        }, viewport: {
          once: true,
          margin: "-60px"
        }, transition: {
          duration: 0.6
        }, className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-12", children: "Visual System & Assets" }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 298,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-12", children: allGallery.map((g, i) => {
          const isFull = i % 3 === 0;
          return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.div, { initial: {
            opacity: 0,
            y: 30
          }, whileInView: {
            opacity: 1,
            y: 0
          }, viewport: {
            once: true,
            margin: "-60px"
          }, transition: {
            duration: 0.7,
            delay: i % 3 * 0.08,
            ease: [0.16, 1, 0.3, 1]
          }, "data-cursor": "OPEN", className: clsx("grid place-items-center bg-[var(--color-surface)] border border-[var(--color-border-subtle)] overflow-hidden", isFull ? "md:col-span-12" : "md:col-span-6"), children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: g.url, alt: g.alt || `${project.title} - asset ${i + 1}`, loading: "lazy", decoding: "async", style: {
            display: "block",
            width: "100%",
            height: "auto"
          }, className: "transition-transform duration-700 hover:scale-[1.01]" }, void 0, false, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 329,
            columnNumber: 21
          }, this) }, g.url + i, false, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 315,
            columnNumber: 20
          }, this);
        }) }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 312,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 297,
        columnNumber: 35
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(motion.section, { initial: {
        opacity: 0,
        y: 24
      }, whileInView: {
        opacity: 1,
        y: 0
      }, viewport: {
        once: true,
        margin: "-60px"
      }, transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }, className: "mt-32 border-t border-[var(--color-border-subtle)] pt-16", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-8", children: "Project Index Navigation" }, void 0, false, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 353,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8", children: [
          prev && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/portfolio/$slug", params: {
            slug: prev.slug || prev.id
          }, "data-cursor": "PREV", className: "group relative flex flex-col justify-between rounded-none border border-[var(--color-border-base)] bg-[var(--color-surface)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-elevated)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-hover)] transition-colors mb-4", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { size: 13, className: "transition-transform group-hover:-translate-x-1" }, void 0, false, {
                  fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                  lineNumber: 364,
                  columnNumber: 21
                }, this),
                "Previous Project"
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 363,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-tight", children: prev.client_name || prev.title }, void 0, false, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 368,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono mt-3 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]", children: [
                prev.year ? `${prev.year} · ` : "",
                prev.category
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 372,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 362,
              columnNumber: 17
            }, this),
            prev.cover_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border-subtle)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: prev.cover_url, alt: prev.title, loading: "lazy", decoding: "async", className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 379,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 378,
              columnNumber: 36
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 359,
            columnNumber: 22
          }, this),
          next && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Link, { to: "/portfolio/$slug", params: {
            slug: next.slug || next.id
          }, "data-cursor": "NEXT", className: "group relative flex flex-col justify-between rounded-none border border-[var(--color-border-base)] bg-[var(--color-surface)] p-6 md:p-8 transition-all duration-300 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-elevated)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-hover)]", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-hover)] transition-colors mb-4", children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { children: "Next Project" }, void 0, false, {
                  fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                  lineNumber: 389,
                  columnNumber: 21
                }, this),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { size: 13, className: "transition-transform group-hover:translate-x-1" }, void 0, false, {
                  fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                  lineNumber: 390,
                  columnNumber: 21
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 388,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h3", { className: "display text-2xl md:text-3xl lg:text-4xl text-[var(--color-text-primary)] tracking-[-0.02em] group-hover:text-[var(--color-accent-hover)] transition-colors leading-tight", children: next.client_name || next.title }, void 0, false, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 393,
                columnNumber: 19
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono mt-3 text-[10px] tracking-[0.18em] uppercase text-[var(--color-text-secondary)]", children: [
                next.year ? `${next.year} · ` : "",
                next.category
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
                lineNumber: 397,
                columnNumber: 19
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 387,
              columnNumber: 17
            }, this),
            next.cover_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border-subtle)]", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: next.cover_url, alt: next.title, loading: "lazy", decoding: "async", className: "h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 404,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
              lineNumber: 403,
              columnNumber: 36
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
            lineNumber: 384,
            columnNumber: 22
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
          lineNumber: 357,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
        lineNumber: 340,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
      lineNumber: 134,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/portfolio.$slug.tsx?tsr-split=component",
    lineNumber: 131,
    columnNumber: 10
  }, this);
}
export {
  ProjectDetailPage as component
};
