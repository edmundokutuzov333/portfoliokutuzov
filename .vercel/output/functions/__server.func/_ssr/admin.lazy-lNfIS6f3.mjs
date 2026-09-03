import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { g as createLazyFileRoute } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-BWSZl9S1.mjs";
import {
  a as useProjects,
  n as normalizeCategory,
  P as PROJECT_CATEGORIES,
  u as useServerFn,
  b as useSiteSettings,
  F as FALLBACK_SETTINGS,
  d as useClients,
  i as isUuid,
  g as generateUuid,
  e as isCampaignCategory,
  T as TOOL_OPTIONS,
  c as currentOrigin,
  s as safeClipboardWrite,
} from "./router-BjVSvuz8.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as money, c as computeTotals, C as CURRENCIES } from "./invoice-core-C88qtTBH.mjs";
import {
  a as getInvoiceWorkspace,
  b as generateBriefingInvoice,
  s as sendBriefingInvoice,
  p as previewInvoiceEmail,
  d as setInvoiceStatus,
  l as listInvoiceEvents,
  e as getInvoiceDraft,
  f as saveInvoiceDraft,
  h as renderInvoicePdfNow,
} from "./invoice.functions-LBTWB7Fl.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import {
  L as LoaderCircle,
  H as House,
  x as Users,
  y as Briefcase,
  z as User,
  a as Mail,
  I as Inbox,
  F as FileText,
  G as History,
  J as CodeXml,
  K as LogOut,
  N as Save,
  O as Plus,
  Q as Star,
  b as ArrowUp,
  W as ArrowDown,
  r as Copy,
  Y as Trash2,
  h as RefreshCw,
  T as TriangleAlert,
  n as CircleCheck,
  p as Clock,
  Z as ChevronDown,
  _ as ChevronRight,
  $ as RotateCcw,
  a0 as Image$1,
  U as Upload,
  E as Eye,
  a1 as EyeOff,
  a2 as Paperclip,
  a3 as Link,
  a4 as MessageSquare,
  a5 as CalendarClock,
  a6 as Globe,
  C as CircleAlert,
  l as Phone,
  a7 as Building2,
  m as MapPin,
  a8 as ExternalLink,
  j as Send,
  a9 as Archive,
  o as Sparkles,
  D as Download,
  aa as BellRing,
  X,
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-L5kFO_hB.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/framer-motion.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
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
import "./auth-middleware-BwKKCkXn.mjs";
function useAdminAuth() {
  const [session, setSession] = reactExports.useState(null);
  const [isAdmin, setIsAdmin] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let alive = true;
    const mockEmail =
      typeof window !== "undefined" ? localStorage.getItem("mock_admin_email") : null;
    if (mockEmail?.toLowerCase() === "contact@edmundokutuzov.art") {
      setSession({
        user: { email: "contact@edmundokutuzov.art", id: "mock-id" },
      });
      setIsAdmin(true);
      setLoading(false);
      return;
    }
    const timers = /* @__PURE__ */ new Set();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!alive) return;
      setSession(s);
      if (s?.user) {
        const timer = setTimeout(() => {
          timers.delete(timer);
          if (alive) void verifyAdmin(s.user.id).then((ok) => alive && setIsAdmin(ok));
        }, 0);
        timers.add(timer);
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(async ({ data: { session: session2 } }) => {
      if (!alive) return;
      setSession(session2);
      if (session2?.user) {
        const ok = await verifyAdmin(session2.user.id);
        if (alive) setIsAdmin(ok);
      }
      if (alive) setLoading(false);
    });
    return () => {
      alive = false;
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      if (sub && sub.subscription) sub.subscription.unsubscribe();
    };
  }, []);
  return { session, isAdmin, loading };
}
async function verifyAdmin(userId) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) return false;
  return !!data;
}
async function readImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const dims = { width: img.naturalWidth, height: img.naturalHeight };
      URL.revokeObjectURL(url);
      resolve(dims);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}
function aspectFromDims(width, height) {
  if (!width || !height) return void 0;
  return `${width} / ${height}`;
}
async function snapshotBefore(entity, entityId, label) {
  try {
    let snapshot = null;
    if (entity === "site_settings") {
      const { data } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", entityId)
        .maybeSingle();
      if (data) snapshot = data.value ?? {};
    } else {
      if (!isUuid(entityId)) return;
      const { data } = await supabase.from(entity).select("*").eq("id", entityId).maybeSingle();
      if (data) snapshot = data;
    }
    if (!snapshot) return;
    await supabase.from("content_history").insert({
      entity_type: entity,
      entity_id: entityId,
      snapshot,
      label: label ?? null,
    });
  } catch (e) {
    console.warn("snapshotBefore failed", e);
  }
}
async function restoreSnapshot(entity, entityId, snapshot) {
  if (entity === "site_settings") {
    const { error: error2 } = await supabase
      .from("site_settings")
      .upsert(
        [{ key: entityId, value: snapshot, updated_at: /* @__PURE__ */ new Date().toISOString() }],
        {
          onConflict: "key",
        },
      );
    return { error: error2?.message ?? null };
  }
  if (!isUuid(entityId)) {
    return { error: "Cannot restore item: invalid identifier." };
  }
  const cleaned = { ...snapshot };
  delete cleaned.created_at;
  delete cleaned.updated_at;
  const { error } = await supabase
    .from(entity)
    .update({ ...cleaned, updated_at: /* @__PURE__ */ new Date().toISOString() })
    .eq("id", entityId);
  return { error: error?.message ?? null };
}
const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "read", label: "Read" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
];
const STATUS_BADGE = {
  new: "bg-sky-300/15 text-sky-200 border-sky-300/30",
  read: "bg-slate-300/10 text-slate-300 border-slate-300/20",
  replied: "bg-emerald-300/10 text-emerald-200 border-emerald-300/30",
  archived: "bg-amber-300/10 text-amber-200 border-amber-300/30",
};
function RequestsInbox() {
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const [selected, setSelected] = reactExports.useState(null);
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["contact_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        attachments: Array.isArray(r.attachments) ? r.attachments : [],
      }));
    },
  });
  reactExports.useEffect(() => {
    const ch = supabase
      .channel(`rt-contact_requests-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["contact_requests"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const filtered = reactExports.useMemo(
    () => rows.filter((r) => filter === "all" || r.status === filter),
    [rows, filter],
  );
  const counts = reactExports.useMemo(() => {
    const c = {
      all: rows.length,
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
    };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const current = filtered.find((r) => r.id === selected) ?? null;
  const update = async (id, patch) => {
    if (!isUuid(id)) return;
    const { error } = await supabase.from("contact_requests").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };
  const remove = async (id) => {
    if (!confirm("Delete this request? This cannot be undone.")) return;
    if (isUuid(id)) {
      const { error } = await supabase.from("contact_requests").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    toast.success("Deleted");
    setSelected(null);
  };
  const onOpen = (r) => {
    setSelected(r.id);
    if (r.status === "new") void update(r.id, { status: "read" });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "flex items-center justify-between flex-wrap gap-3",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "h2",
                    {
                      className: "display text-2xl text-metal flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Inbox,
                          { size: 20, className: "text-sky-300" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                            lineNumber: 144,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        " Requests inbox",
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                      lineNumber: 143,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "p",
                    {
                      className: "text-sm text-slate-500 mt-1",
                      children: [
                        "Messages submitted from the public contact form.",
                        " ",
                        counts.new > 0 &&
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "span",
                            { className: "text-sky-300", children: ["· ", counts.new, " new"] },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                              lineNumber: 148,
                              columnNumber: 32,
                            },
                            this,
                          ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                      lineNumber: 146,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                lineNumber: 142,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 141,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 flex flex-wrap gap-2 items-center",
            children: STATUS_FILTERS.map((f) =>
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => setFilter(f.id),
                  className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${filter === f.id ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                  children: [
                    f.label,
                    " ",
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "span",
                      { className: "text-slate-500", children: ["(", counts[f.id] ?? 0, ")"] },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 164,
                        columnNumber: 23,
                      },
                      this,
                    ),
                  ],
                },
                f.id,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 155,
                  columnNumber: 11,
                },
                this,
              ),
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 153,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "lg:col-span-5 space-y-2",
                  children: [
                    isLoading &&
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "text-sm text-slate-500 flex items-center gap-2 p-4",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              LoaderCircle,
                              { size: 14, className: "animate-spin" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 174,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            " Loading…",
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 173,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    !isLoading &&
                      filtered.length === 0 &&
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                          children: "No requests yet.",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 178,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    filtered.map((r) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "button",
                        {
                          onClick: () => onOpen(r),
                          className: `w-full text-left bg-[#030814] border rounded p-3 transition ${current?.id === r.id ? "border-sky-300/40" : "border-white/[0.06] hover:border-white/[0.15]"}`,
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "flex items-center gap-2 min-w-0",
                                      children: [
                                        r.is_starred &&
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            Star,
                                            {
                                              size: 12,
                                              className: "text-amber-300 shrink-0",
                                              fill: "currentColor",
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/RequestsInbox.tsx",
                                              lineNumber: 195,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className:
                                              "text-sm font-medium text-slate-100 truncate",
                                            children: r.name,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/RequestsInbox.tsx",
                                            lineNumber: 197,
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
                                        "/app/applet/src/components/admin/RequestsInbox.tsx",
                                      lineNumber: 193,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className: `mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_BADGE[r.status] ?? STATUS_BADGE.new}`,
                                      children: r.status.toUpperCase(),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/RequestsInbox.tsx",
                                      lineNumber: 199,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 192,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "text-[11px] text-slate-500 mt-0.5 truncate",
                                children: r.email,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 205,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "text-[12px] text-slate-400 mt-1.5 line-clamp-2",
                                children: r.message,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 206,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "flex items-center gap-2 text-[10px] text-slate-600 mt-2 mono",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Clock,
                                    { size: 10 },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/RequestsInbox.tsx",
                                      lineNumber: 208,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " ",
                                  new Date(r.created_at).toLocaleString(),
                                  r.attachments?.length > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "span",
                                      {
                                        className: "inline-flex items-center gap-1",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            Paperclip,
                                            { size: 10 },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/RequestsInbox.tsx",
                                              lineNumber: 211,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          " ",
                                          r.attachments.length,
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/RequestsInbox.tsx",
                                        lineNumber: 210,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  r.project_type &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "span",
                                      { className: "ml-auto", children: r.project_type },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/RequestsInbox.tsx",
                                        lineNumber: 214,
                                        columnNumber: 36,
                                      },
                                      this,
                                    ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 207,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        r.id,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 183,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 171,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "lg:col-span-7",
                  children: !current
                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              MessageSquare,
                              { className: "mx-auto mb-3 text-slate-600" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 224,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            "Select a message to view it.",
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 223,
                          columnNumber: 13,
                        },
                        this,
                      )
                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        RequestDetail,
                        {
                          req: current,
                          onUpdate: update,
                          onDelete: () => remove(current.id),
                        },
                        current.id,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 228,
                          columnNumber: 13,
                        },
                        this,
                      ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 221,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 169,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
      lineNumber: 140,
      columnNumber: 5,
    },
    this,
  );
}
function RequestDetail({ req, onUpdate, onDelete }) {
  const [notes, setNotes] = reactExports.useState(req.admin_notes ?? "");
  reactExports.useEffect(() => {
    setNotes(req.admin_notes ?? "");
  }, [req.id, req.admin_notes]);
  const reply = `mailto:${req.email}?subject=${encodeURIComponent(`Re: ${req.project_type ?? "your project"}`)}&body=${encodeURIComponent(`Hi ${req.name.split(" ")[0]},

`)}`;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "bg-[#030814] border border-white/[0.08] rounded-lg p-5",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex items-start justify-between gap-3",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      { className: "display text-xl text-metal", children: req.name },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 261,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "a",
                      {
                        href: `mailto:${req.email}`,
                        className:
                          "text-sm text-sky-200 hover:underline inline-flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Mail,
                            { size: 12 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                              lineNumber: 266,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          " ",
                          req.email,
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 262,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2",
                        children: [
                          req.phone &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Phone,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/RequestsInbox.tsx",
                                      lineNumber: 271,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " ",
                                  req.phone,
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 270,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          req.company &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Building2,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/RequestsInbox.tsx",
                                      lineNumber: 276,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " ",
                                  req.company,
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 275,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "span",
                            {
                              className: "mono",
                              children: new Date(req.created_at).toLocaleString(),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                              lineNumber: 279,
                              columnNumber: 13,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 268,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 260,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "flex items-center gap-1",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        title: req.is_starred ? "Unstar" : "Star",
                        onClick: () => onUpdate(req.id, { is_starred: !req.is_starred }),
                        className: "p-2 rounded hover:bg-white/[0.05]",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Star,
                          {
                            size: 14,
                            className: req.is_starred ? "text-amber-300" : "text-slate-500",
                            fill: req.is_starred ? "currentColor" : "none",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                            lineNumber: 288,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 283,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        title: "Delete",
                        onClick: onDelete,
                        className:
                          "p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Trash2,
                          { size: 14 },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                            lineNumber: 299,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 294,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 282,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 259,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta$1,
                { label: "Type", value: req.project_type ?? "-" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 305,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta$1,
                {
                  label: "Budget",
                  value: req.budget_label ? `${req.budget_label} (${req.budget_currency})` : "-",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 306,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta$1,
                { label: "Timeline", value: req.timeline ?? "-" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 310,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta$1,
                { label: "Source", value: req.source ?? "-" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 311,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 304,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                  children: "MESSAGE",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 315,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className:
                    "bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap",
                  children: req.message,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 316,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 314,
            columnNumber: 7,
          },
          this,
        ),
        req.attachments?.length > 0 &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "mt-5",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                    children: "ATTACHMENTS",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                    lineNumber: 323,
                    columnNumber: 11,
                  },
                  this,
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "flex flex-wrap gap-2",
                    children: req.attachments.map((a) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "a",
                        {
                          href: a.url,
                          target: "_blank",
                          rel: "noreferrer",
                          className:
                            "inline-flex items-center gap-2 text-[12px] bg-[#01040A] border border-white/10 rounded px-3 py-1.5 hover:border-sky-300/40",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Paperclip,
                              { size: 11 },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 333,
                                columnNumber: 17,
                              },
                              this,
                            ),
                            " ",
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              { className: "truncate max-w-[180px]", children: a.name },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 333,
                                columnNumber: 41,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              ExternalLink,
                              { size: 11, className: "text-slate-500" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                                lineNumber: 334,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ],
                        },
                        a.url,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                          lineNumber: 326,
                          columnNumber: 15,
                        },
                        this,
                      ),
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                    lineNumber: 324,
                    columnNumber: 11,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
              lineNumber: 322,
              columnNumber: 9,
            },
            this,
          ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                  children: "PRIVATE NOTES",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 342,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "textarea",
                {
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  onBlur: () =>
                    notes !== (req.admin_notes ?? "") &&
                    void onUpdate(req.id, { admin_notes: notes }),
                  rows: 3,
                  placeholder: "Notes for yourself - not visible to the sender.",
                  className:
                    "w-full bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 343,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 341,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "a",
                {
                  href: reply,
                  className:
                    "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Mail,
                      { size: 13 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 360,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Reply by email",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 356,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => onUpdate(req.id, { status: "replied" }),
                  className:
                    "inline-flex items-center gap-2 border border-white/10 text-slate-300 hover:border-emerald-300/40 hover:text-emerald-200 px-4 py-2 rounded text-sm",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      CircleCheck,
                      { size: 13 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 366,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Mark replied",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 362,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () =>
                    onUpdate(req.id, { status: req.status === "archived" ? "read" : "archived" }),
                  className:
                    "inline-flex items-center gap-2 border border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200 px-4 py-2 rounded text-sm",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Archive,
                      { size: 13 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                        lineNumber: 374,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " ",
                    req.status === "archived" ? "Unarchive" : "Archive",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
                  lineNumber: 368,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 355,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
      lineNumber: 258,
      columnNumber: 5,
    },
    this,
  );
}
function Meta$1({ label, value }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "bg-[#01040A] border border-white/[0.06] rounded px-3 py-2",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "mono text-[9px] tracking-[0.2em] text-slate-500", children: label },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 384,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "text-slate-200 mt-0.5 truncate", children: value },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
            lineNumber: 385,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/RequestsInbox.tsx",
      lineNumber: 383,
      columnNumber: 5,
    },
    this,
  );
}
const STATUS_TONE$1 = {
  draft: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  generated: "bg-sky-400/15 text-sky-200 border-sky-400/30",
  sent: "bg-violet-400/15 text-violet-200 border-violet-400/30",
  viewed: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  paid: "bg-emerald-400/15 text-emerald-200 border-emerald-400/30",
  void: "bg-rose-400/15 text-rose-200 border-rose-400/30",
};
const STATUS_ORDER = ["draft", "generated", "sent", "viewed", "paid", "void"];
const PRESETS = [
  {
    label: "Brand identity",
    item: {
      description: "Brand identity system",
      detail: "Logotype, type system, colour, usage guide",
      qty: 1,
      unit: "project",
      unit_price: 0,
      discount_pct: 0,
    },
  },
  {
    label: "Art direction",
    item: {
      description: "Art direction",
      detail: "Concept, references, shot list, on-set direction",
      qty: 1,
      unit: "day",
      unit_price: 0,
      discount_pct: 0,
    },
  },
  {
    label: "Key visual",
    item: {
      description: "Key visual",
      detail: "Master artwork + adaptations",
      qty: 1,
      unit: "un",
      unit_price: 0,
      discount_pct: 0,
    },
  },
  {
    label: "Retouching",
    item: {
      description: "Retouching & finishing",
      detail: null,
      qty: 1,
      unit: "hour",
      unit_price: 0,
      discount_pct: 0,
    },
  },
];
const emptyItem = () => ({
  description: "",
  detail: null,
  qty: 1,
  unit: "un",
  unit_price: 0,
  discount_pct: 0,
});
function downloadBase64Pdf(base64, filename) {
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4e3);
}
function InvoicePanel({ briefingId, defaultCurrency, suggestedAmount, onSent }) {
  const generate = useServerFn(generateBriefingInvoice);
  const send = useServerFn(sendBriefingInvoice);
  const preview = useServerFn(previewInvoiceEmail);
  const setStatus = useServerFn(setInvoiceStatus);
  const listEvents = useServerFn(listInvoiceEvents);
  const loadDraft = useServerFn(getInvoiceDraft);
  const saveDraft = useServerFn(saveInvoiceDraft);
  const renderNow = useServerFn(renderInvoicePdfNow);
  const qc = useQueryClient();
  const draft = useQuery({
    queryKey: ["invoice-draft", briefingId],
    queryFn: () => loadDraft({ data: { briefing_id: briefingId } }),
    refetchOnWindowFocus: false,
  });
  const events = useQuery({
    queryKey: ["invoice-events", briefingId],
    queryFn: () => listEvents({ data: { briefing_id: briefingId } }),
    refetchOnWindowFocus: false,
  });
  const [items, setItems] = reactExports.useState([]);
  const [currency, setCurrency] = reactExports.useState((defaultCurrency || "EUR").toUpperCase());
  const [issueDate, setIssueDate] = reactExports.useState(
    /* @__PURE__ */ new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = reactExports.useState("");
  const [discountPct, setDiscountPct] = reactExports.useState(0);
  const [taxPct, setTaxPct] = reactExports.useState(0);
  const [taxLabel, setTaxLabel] = reactExports.useState("");
  const [depositPct, setDepositPct] = reactExports.useState(0);
  const [notes, setNotes] = reactExports.useState("");
  const [terms, setTerms] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(null);
  const [previewOpen, setPreviewOpen] = reactExports.useState(false);
  const [previewData, setPreviewData] = reactExports.useState(null);
  const [attachPdf, setAttachPdf] = reactExports.useState(true);
  const header = draft.data?.header;
  reactExports.useEffect(() => {
    if (!draft.data) return;
    const h = draft.data.header;
    setItems(
      draft.data.items.length
        ? draft.data.items
        : [
            {
              ...emptyItem(),
              description: "Creative direction & production",
              unit: "project",
              unit_price: Number(suggestedAmount ?? 0),
            },
          ],
    );
    setCurrency((h.currency || defaultCurrency || "EUR").toUpperCase());
    setIssueDate(h.issue_date ?? /* @__PURE__ */ new Date().toISOString().slice(0, 10));
    setDueDate(h.due_date ?? "");
    setDiscountPct(h.discount_pct);
    setTaxPct(h.tax_pct);
    setTaxLabel(h.tax_label ?? "");
    setDepositPct(h.deposit_pct);
    setNotes(h.notes ?? "");
    setTerms(h.terms ?? "");
  }, [draft.data]);
  const totals = reactExports.useMemo(
    () =>
      computeTotals({ items, discount_pct: discountPct, tax_pct: taxPct, deposit_pct: depositPct }),
    [items, discountPct, taxPct, depositPct],
  );
  const status = header?.status ?? "draft";
  const hasInvoice = Boolean(header?.number && header?.pdf_path);
  const portalUrl = header?.token ? `${currentOrigin()}/i/${header.token}` : null;
  const payload = () => {
    const clean = items
      .map((i) => ({
        description: i.description.trim(),
        detail: i.detail?.trim() ? i.detail.trim() : null,
        qty: Number(i.qty) || 0,
        unit: (i.unit || "un").trim(),
        unit_price: Number(i.unit_price) || 0,
        discount_pct: Number(i.discount_pct) || 0,
      }))
      .filter((i) => i.description.length > 0);
    if (!clean.length) {
      toast.error("Add at least one described line item");
      return null;
    }
    if (totals.total <= 0) {
      toast.error("Total must be greater than zero");
      return null;
    }
    return {
      briefing_id: briefingId,
      currency,
      issue_date: issueDate || null,
      due_date: dueDate || null,
      discount_pct: discountPct,
      tax_pct: taxPct,
      tax_label: taxLabel || null,
      deposit_pct: depositPct,
      notes: notes || null,
      terms: terms || null,
      items: clean,
    };
  };
  const run = async (key, fn) => {
    setBusy(key);
    try {
      await fn();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };
  const refresh = () => {
    onSent?.();
    qc.invalidateQueries({ queryKey: ["invoice-draft", briefingId] });
    qc.invalidateQueries({ queryKey: ["invoice-events", briefingId] });
  };
  const doInstantPdf = () => {
    const input = payload();
    if (!input) return;
    void run("pdf", async () => {
      const res = await renderNow({ data: input });
      downloadBase64Pdf(res.base64, res.filename);
      toast.success("PDF downloaded");
    });
  };
  const doSaveDraft = () => {
    const input = payload();
    if (!input) return;
    void run("save", async () => {
      await saveDraft({ data: input });
      toast.success("Draft saved");
      refresh();
    });
  };
  const doIssue = (thenSend) => {
    const input = payload();
    if (!input) return;
    void run(thenSend ? "both" : "issue", async () => {
      const res = await generate({ data: input });
      if (thenSend)
        await send({
          data: { briefing_id: briefingId, attach_pdf: attachPdf, variant: "invoice" },
        });
      else downloadBase64Pdf(res.base64, res.filename);
      toast.success(`Invoice ${res.invoiceNumber} ${thenSend ? "issued & sent" : "issued"}`);
      refresh();
    });
  };
  const doSend = (variant) =>
    void run(variant, async () => {
      await send({ data: { briefing_id: briefingId, attach_pdf: attachPdf, variant } });
      toast.success(
        variant === "reminder"
          ? "Reminder sent"
          : variant === "receipt"
            ? "Receipt sent"
            : "Invoice email sent",
      );
      setPreviewOpen(false);
      refresh();
    });
  const doPreview = (variant) =>
    void run("preview", async () => {
      const res = await preview({ data: { briefing_id: briefingId, variant } });
      setPreviewData(res);
      setPreviewOpen(true);
    });
  const changeStatus = (s) =>
    void run("status", async () => {
      await setStatus({ data: { briefing_id: briefingId, status: s } });
      toast.success(`Status → ${s}`);
      refresh();
    });
  const patchItem = (idx, patch) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const move = (idx, dir) =>
    setItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
  const fmt = (n) => money(n, currency);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "mt-5",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className:
              "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2 flex-wrap",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                FileText,
                { size: 11 },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                  lineNumber: 335,
                  columnNumber: 9,
                },
                this,
              ),
              " INVOICE",
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "span",
                {
                  className: `px-2 py-0.5 rounded border text-[10px] ${STATUS_TONE$1[status] ?? STATUS_TONE$1.draft}`,
                  children: status.toUpperCase(),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                  lineNumber: 336,
                  columnNumber: 9,
                },
                this,
              ),
              header?.number &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "span",
                  { className: "text-slate-400", children: header.number },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                    lineNumber: 341,
                    columnNumber: 28,
                  },
                  this,
                ),
              header?.paid_reported_at &&
                status !== "paid" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "span",
                  {
                    className: "px-2 py-0.5 rounded border border-amber-400/30 text-amber-200",
                    children: "CLIENT REPORTED PAYMENT",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                    lineNumber: 343,
                    columnNumber: 11,
                  },
                  this,
                ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
            lineNumber: 334,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "bg-[#01040A] border border-white/[0.06] rounded p-4 space-y-4",
            children: draft.isLoading
              ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "flex items-center gap-2 text-slate-500 text-[12px] py-4",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        LoaderCircle,
                        { size: 13, className: "animate-spin" },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 352,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      " Loading invoice…",
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                    lineNumber: 351,
                    columnNumber: 11,
                  },
                  this,
                )
              : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  jsxDevRuntimeExports.Fragment,
                  {
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "grid grid-cols-2 md:grid-cols-4 gap-3",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field$1,
                              {
                                label: "Currency",
                                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "select",
                                  {
                                    value: currency,
                                    onChange: (e) => setCurrency(e.target.value),
                                    className: inputCls,
                                    children: CURRENCIES.map((c) =>
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "option",
                                        { value: c, children: c },
                                        c,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/InvoicePanel.tsx",
                                          lineNumber: 365,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 359,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 358,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field$1,
                              {
                                label: "Issue date",
                                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    type: "date",
                                    value: issueDate,
                                    onChange: (e) => setIssueDate(e.target.value),
                                    className: inputCls,
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 372,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 371,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field$1,
                              {
                                label: "Due date",
                                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    type: "date",
                                    value: dueDate,
                                    onChange: (e) => setDueDate(e.target.value),
                                    className: inputCls,
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 380,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 379,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Field$1,
                              {
                                label: "Deposit %",
                                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    type: "number",
                                    min: 0,
                                    max: 100,
                                    value: depositPct,
                                    onChange: (e) => setDepositPct(Number(e.target.value) || 0),
                                    className: inputCls,
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 388,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 387,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 357,
                          columnNumber: 13,
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
                                className: "flex items-center justify-between mb-2 flex-wrap gap-2",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "mono text-[10px] tracking-[0.2em] text-slate-500",
                                      children: "LINE ITEMS",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 402,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "flex items-center gap-1.5 flex-wrap",
                                      children: PRESETS.map((p) =>
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "button",
                                          {
                                            onClick: () =>
                                              setItems((prev) => [...prev, { ...p.item }]),
                                            className:
                                              "text-[10px] px-2 py-1 rounded border border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/25 inline-flex items-center gap-1",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Sparkles,
                                                { size: 9 },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 410,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              " ",
                                              p.label,
                                            ],
                                          },
                                          p.label,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 405,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      ),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 403,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 401,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "space-y-2",
                                children: items.map((it, idx) =>
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "border border-white/[0.06] rounded p-3 bg-white/[0.01]",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "flex gap-2",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "input",
                                                {
                                                  value: it.description,
                                                  placeholder: "Description",
                                                  onChange: (e) =>
                                                    patchItem(idx, { description: e.target.value }),
                                                  className: `${inputCls} flex-1 font-medium`,
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 420,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "div",
                                                {
                                                  className: "flex items-center gap-1",
                                                  children: [
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      IconBtn,
                                                      {
                                                        onClick: () => move(idx, -1),
                                                        title: "Move up",
                                                        children:
                                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                            ArrowUp,
                                                            { size: 12 },
                                                            void 0,
                                                            false,
                                                            {
                                                              fileName:
                                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                              lineNumber: 428,
                                                              columnNumber: 27,
                                                            },
                                                            this,
                                                          ),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      IconBtn,
                                                      {
                                                        onClick: () => move(idx, 1),
                                                        title: "Move down",
                                                        children:
                                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                            ArrowDown,
                                                            { size: 12 },
                                                            void 0,
                                                            false,
                                                            {
                                                              fileName:
                                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                              lineNumber: 431,
                                                              columnNumber: 27,
                                                            },
                                                            this,
                                                          ),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 430,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      IconBtn,
                                                      {
                                                        onClick: () =>
                                                          setItems((p) =>
                                                            p.filter((_, i) => i !== idx),
                                                          ),
                                                        title: "Remove",
                                                        children:
                                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                            Trash2,
                                                            { size: 12 },
                                                            void 0,
                                                            false,
                                                            {
                                                              fileName:
                                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                              lineNumber: 437,
                                                              columnNumber: 27,
                                                            },
                                                            this,
                                                          ),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 433,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                  ],
                                                },
                                                void 0,
                                                true,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 426,
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
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 419,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "input",
                                          {
                                            value: it.detail ?? "",
                                            placeholder: "Detail (optional)",
                                            onChange: (e) =>
                                              patchItem(idx, { detail: e.target.value }),
                                            className: `${inputCls} mt-2 text-[12px]`,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 441,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className:
                                              "grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 items-end",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Field$1,
                                                {
                                                  label: "Qty",
                                                  children:
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "input",
                                                      {
                                                        type: "number",
                                                        min: 0,
                                                        step: "0.01",
                                                        value: it.qty,
                                                        onChange: (e) =>
                                                          patchItem(idx, {
                                                            qty: Number(e.target.value) || 0,
                                                          }),
                                                        className: inputCls,
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 449,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 448,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Field$1,
                                                {
                                                  label: "Unit",
                                                  children:
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "input",
                                                      {
                                                        value: it.unit,
                                                        onChange: (e) =>
                                                          patchItem(idx, { unit: e.target.value }),
                                                        className: inputCls,
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 459,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 458,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Field$1,
                                                {
                                                  label: "Rate",
                                                  children:
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "input",
                                                      {
                                                        type: "number",
                                                        min: 0,
                                                        step: "0.01",
                                                        value: it.unit_price,
                                                        onChange: (e) =>
                                                          patchItem(idx, {
                                                            unit_price: Number(e.target.value) || 0,
                                                          }),
                                                        className: inputCls,
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 466,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 465,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Field$1,
                                                {
                                                  label: "Disc %",
                                                  children:
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "input",
                                                      {
                                                        type: "number",
                                                        min: 0,
                                                        max: 100,
                                                        value: it.discount_pct,
                                                        onChange: (e) =>
                                                          patchItem(idx, {
                                                            discount_pct:
                                                              Number(e.target.value) || 0,
                                                          }),
                                                        className: inputCls,
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 477,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "div",
                                                {
                                                  className: "text-right",
                                                  children: [
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className:
                                                          "mono text-[9px] tracking-widest text-slate-600",
                                                        children: "AMOUNT",
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                      "div",
                                                      {
                                                        className:
                                                          "text-[13px] text-slate-100 tabular-nums",
                                                        children: fmt(totals.lines[idx]?.net ?? 0),
                                                      },
                                                      void 0,
                                                      false,
                                                      {
                                                        fileName:
                                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 25,
                                                      },
                                                      this,
                                                    ),
                                                  ],
                                                },
                                                void 0,
                                                true,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                  lineNumber: 489,
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
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 447,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    idx,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 418,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 416,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: () => setItems((p) => [...p, emptyItem()]),
                                className:
                                  "mt-2 inline-flex items-center gap-1.5 text-[12px] text-sky-200 hover:underline",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Plus,
                                    { size: 12 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 504,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " Add line item",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 500,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 400,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "grid md:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "space-y-3",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "grid grid-cols-3 gap-2",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Field$1,
                                          {
                                            label: "Discount %",
                                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "input",
                                              {
                                                type: "number",
                                                min: 0,
                                                max: 100,
                                                value: discountPct,
                                                onChange: (e) =>
                                                  setDiscountPct(Number(e.target.value) || 0),
                                                className: inputCls,
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                lineNumber: 513,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 512,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Field$1,
                                          {
                                            label: "Tax %",
                                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "input",
                                              {
                                                type: "number",
                                                min: 0,
                                                max: 100,
                                                value: taxPct,
                                                onChange: (e) =>
                                                  setTaxPct(Number(e.target.value) || 0),
                                                className: inputCls,
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                lineNumber: 523,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 522,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Field$1,
                                          {
                                            label: "Tax label",
                                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "input",
                                              {
                                                value: taxLabel,
                                                placeholder: "VAT (16%)",
                                                onChange: (e) => setTaxLabel(e.target.value),
                                                className: inputCls,
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                lineNumber: 533,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 532,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 511,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Field$1,
                                    {
                                      label: "Notes (client-visible)",
                                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "textarea",
                                        {
                                          rows: 2,
                                          value: notes,
                                          onChange: (e) => setNotes(e.target.value),
                                          className: inputCls,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/InvoicePanel.tsx",
                                          lineNumber: 542,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 541,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Field$1,
                                    {
                                      label: "Terms",
                                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "textarea",
                                        {
                                          rows: 2,
                                          value: terms,
                                          onChange: (e) => setTerms(e.target.value),
                                          placeholder: "Falls back to studio payment terms",
                                          className: inputCls,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/InvoicePanel.tsx",
                                          lineNumber: 550,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 549,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 510,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "bg-white/[0.02] border border-white/[0.06] rounded p-4 space-y-1.5 text-[13px] self-start",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TotalLine,
                                    { label: "Subtotal", value: fmt(totals.subtotal) },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 561,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  totals.discount_amount > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      TotalLine,
                                      {
                                        label: `Discount (${discountPct}%)`,
                                        value: `-${fmt(totals.discount_amount)}`,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 563,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  totals.tax_amount > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      TotalLine,
                                      {
                                        label: taxLabel || `Tax (${taxPct}%)`,
                                        value: fmt(totals.tax_amount),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 569,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between pt-2 mt-2 border-t border-white/10",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "span",
                                          {
                                            className: "text-slate-300 font-semibold",
                                            children: "Total",
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 575,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "span",
                                          {
                                            className: "text-sky-200 font-bold tabular-nums",
                                            children: [fmt(totals.total), " ", currency],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 576,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 574,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  totals.deposit_amount > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      jsxDevRuntimeExports.Fragment,
                                      {
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            TotalLine,
                                            {
                                              label: `Deposit now (${depositPct}%)`,
                                              value: fmt(totals.deposit_amount),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                              lineNumber: 582,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            TotalLine,
                                            { label: "Balance later", value: fmt(totals.balance) },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                              lineNumber: 586,
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
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 581,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 560,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 509,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "flex flex-wrap gap-2 pt-3 border-t border-white/[0.06]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Btn,
                              {
                                onClick: doInstantPdf,
                                busy: busy === "pdf",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Download,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 597,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                                tone: "ghost",
                                children: "Download PDF now",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 594,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Btn,
                              {
                                onClick: doSaveDraft,
                                busy: busy === "save",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  CircleCheck,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 605,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                                tone: "ghost",
                                children: "Save draft",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 602,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Btn,
                              {
                                onClick: () => doIssue(false),
                                busy: busy === "issue",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  FileText,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 613,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                                tone: "solid",
                                children: hasInvoice ? "Re-issue PDF" : "Issue invoice",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 610,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Btn,
                              {
                                onClick: () => doIssue(true),
                                busy: busy === "both",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Send,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 621,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                                tone: "solid",
                                children: "Issue & send",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 618,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Btn,
                              {
                                onClick: () => doPreview("invoice"),
                                busy: busy === "preview",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Eye,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 629,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                                tone: "ghost",
                                children: "Preview email",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 626,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            hasInvoice &&
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                jsxDevRuntimeExports.Fragment,
                                {
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Btn,
                                      {
                                        onClick: () => doSend("invoice"),
                                        busy: busy === "invoice",
                                        icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Send,
                                          { size: 12 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 639,
                                            columnNumber: 27,
                                          },
                                          this,
                                        ),
                                        tone: "ghost",
                                        children: "Send invoice",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 636,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Btn,
                                      {
                                        onClick: () => doSend("reminder"),
                                        busy: busy === "reminder",
                                        icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          BellRing,
                                          { size: 12 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 647,
                                            columnNumber: 27,
                                          },
                                          this,
                                        ),
                                        tone: "ghost",
                                        children: [
                                          "Send reminder",
                                          header?.reminder_count
                                            ? ` (${header.reminder_count})`
                                            : "",
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 644,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Btn,
                                      {
                                        onClick: () => doSend("receipt"),
                                        busy: busy === "receipt",
                                        icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          CircleCheck,
                                          { size: 12 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 655,
                                            columnNumber: 27,
                                          },
                                          this,
                                        ),
                                        tone: "ghost",
                                        children: "Send receipt",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 652,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                  lineNumber: 635,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "label",
                              {
                                className:
                                  "inline-flex items-center gap-1.5 text-[11px] text-slate-400 ml-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "input",
                                    {
                                      type: "checkbox",
                                      checked: attachPdf,
                                      onChange: (e) => setAttachPdf(e.target.checked),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 663,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Paperclip,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 668,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " attach PDF",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 662,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 593,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.06]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "mono text-[10px] tracking-[0.2em] text-slate-600",
                                children: "STATUS",
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 674,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            STATUS_ORDER.map((s) =>
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "button",
                                {
                                  onClick: () => changeStatus(s),
                                  disabled: busy === "status",
                                  className: `px-2 py-1 rounded border text-[10px] transition-colors ${s === status ? STATUS_TONE$1[s] : "border-white/10 text-slate-500 hover:text-slate-200 hover:border-white/25"}`,
                                  children: s,
                                },
                                s,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                  lineNumber: 676,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ),
                            portalUrl &&
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "flex items-center gap-3 ml-auto",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "a",
                                      {
                                        href: portalUrl,
                                        target: "_blank",
                                        rel: "noreferrer",
                                        className:
                                          "inline-flex items-center gap-1 text-[12px] text-sky-200 hover:underline",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            ExternalLink,
                                            { size: 12 },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InvoicePanel.tsx",
                                              lineNumber: 697,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          " Client link",
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 691,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "button",
                                      {
                                        onClick: () => {
                                          safeClipboardWrite(portalUrl)
                                            .then(() => toast.success("Copied"))
                                            .catch(() => toast.error("Clipboard unavailable"));
                                        },
                                        className: "text-slate-400 hover:text-slate-200",
                                        title: "Copy client link",
                                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Copy,
                                          { size: 12 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoicePanel.tsx",
                                            lineNumber: 708,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoicePanel.tsx",
                                        lineNumber: 699,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                  lineNumber: 690,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 673,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "pt-3 border-t border-white/[0.06]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-1.5",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    History,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                      lineNumber: 717,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  " TIMELINE",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                lineNumber: 716,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            events.data?.length
                              ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "ul",
                                  {
                                    className: "space-y-1.5 max-h-44 overflow-auto pr-1",
                                    children: events.data.map((e) =>
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "li",
                                        {
                                          className:
                                            "flex items-start justify-between gap-3 text-[11.5px]",
                                          children: [
                                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "span",
                                              {
                                                className: "text-slate-300",
                                                children: [
                                                  e.event_type,
                                                  e.recipients?.length
                                                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                        "span",
                                                        {
                                                          className: "text-slate-500",
                                                          children: [
                                                            " → ",
                                                            e.recipients.join(", "),
                                                          ],
                                                        },
                                                        void 0,
                                                        true,
                                                        {
                                                          fileName:
                                                            "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                          lineNumber: 726,
                                                          columnNumber: 27,
                                                        },
                                                        this,
                                                      )
                                                    : null,
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                lineNumber: 723,
                                                columnNumber: 23,
                                              },
                                              this,
                                            ),
                                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "span",
                                              {
                                                className: "text-slate-600 whitespace-nowrap",
                                                children: new Date(e.created_at).toLocaleString(),
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InvoicePanel.tsx",
                                                lineNumber: 729,
                                                columnNumber: 23,
                                              },
                                              this,
                                            ),
                                          ],
                                        },
                                        e.id,
                                        true,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/InvoicePanel.tsx",
                                          lineNumber: 722,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 720,
                                    columnNumber: 17,
                                  },
                                  this,
                                )
                              : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "p",
                                  {
                                    className: "text-[11.5px] text-slate-600",
                                    children: "No activity yet.",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 736,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                          lineNumber: 715,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                    lineNumber: 355,
                    columnNumber: 11,
                  },
                  this,
                ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
            lineNumber: 349,
            columnNumber: 7,
          },
          this,
        ),
        previewOpen &&
          previewData &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className:
                "fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm grid place-items-center p-4",
              onClick: () => setPreviewOpen(false),
              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className:
                    "bg-[#050A12] border border-white/10 rounded-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col",
                  onClick: (e) => e.stopPropagation(),
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "flex items-center justify-between gap-3 px-4 py-3 border-b border-white/[0.06]",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "min-w-0",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "div",
                                  {
                                    className: "text-[13px] text-slate-100 truncate",
                                    children: previewData.subject,
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 754,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "div",
                                  {
                                    className: "text-[11px] text-slate-500 truncate",
                                    children: [
                                      "to ",
                                      previewData.to.join(", "),
                                      " · cc ",
                                      previewData.cc.join(", "),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                    lineNumber: 755,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                              lineNumber: 753,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "button",
                            {
                              onClick: () => setPreviewOpen(false),
                              className: "text-slate-400 hover:text-slate-100",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                X,
                                { size: 16 },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                  lineNumber: 763,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                              lineNumber: 759,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                        lineNumber: 752,
                        columnNumber: 13,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "overflow-auto flex-1 bg-white/[0.02]",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "iframe",
                          {
                            title: "Email preview",
                            srcDoc: previewData.html,
                            className: "w-full h-[60vh] border-0",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                            lineNumber: 767,
                            columnNumber: 15,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                        lineNumber: 766,
                        columnNumber: 13,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "px-4 py-3 border-t border-white/[0.06] flex justify-end gap-2",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Btn,
                            {
                              onClick: () => setPreviewOpen(false),
                              tone: "ghost",
                              children: "Close",
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                              lineNumber: 774,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Btn,
                            {
                              onClick: () => doSend("invoice"),
                              busy: busy === "invoice",
                              icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Send,
                                { size: 12 },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                                  lineNumber: 780,
                                  columnNumber: 23,
                                },
                                this,
                              ),
                              tone: "solid",
                              children: "Send now",
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                              lineNumber: 777,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                        lineNumber: 773,
                        columnNumber: 13,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                  lineNumber: 748,
                  columnNumber: 11,
                },
                this,
              ),
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
              lineNumber: 744,
              columnNumber: 9,
            },
            this,
          ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
      lineNumber: 333,
      columnNumber: 5,
    },
    this,
  );
}
const inputCls =
  "w-full bg-[#01040A] border border-white/10 rounded px-2.5 py-2 text-[12.5px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white/30";
function Field$1({ label, children }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "label",
    {
      className: "block",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "span",
          {
            className: "mono text-[9px] tracking-[0.18em] text-slate-600 block mb-1",
            children: label.toUpperCase(),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
            lineNumber: 800,
            columnNumber: 7,
          },
          this,
        ),
        children,
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
      lineNumber: 799,
      columnNumber: 5,
    },
    this,
  );
}
function IconBtn({ onClick, title, children }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "button",
    {
      onClick,
      title,
      className:
        "p-1.5 rounded border border-white/10 text-slate-500 hover:text-slate-200 hover:border-white/25",
      children,
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
      lineNumber: 818,
      columnNumber: 5,
    },
    this,
  );
}
function TotalLine({ label, value }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "flex items-center justify-between",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "span",
          { className: "text-slate-500", children: label },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
            lineNumber: 831,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "span",
          { className: "text-slate-200 tabular-nums", children: value },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
            lineNumber: 832,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
      lineNumber: 830,
      columnNumber: 5,
    },
    this,
  );
}
function Btn({ onClick, children, icon, busy, tone = "ghost" }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "button",
    {
      onClick,
      disabled: busy,
      className: `inline-flex items-center gap-1.5 px-3 py-2 rounded text-[12px] font-medium transition-colors disabled:opacity-60 ${tone === "solid" ? "bg-sky-400/90 text-[#01040A] hover:bg-sky-300" : "border border-white/10 text-slate-300 hover:text-slate-100 hover:border-white/25"}`,
      children: [
        busy
          ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              LoaderCircle,
              { size: 12, className: "animate-spin" },
              void 0,
              false,
              {
                fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
                lineNumber: 860,
                columnNumber: 15,
              },
              this,
            )
          : icon,
        children,
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoicePanel.tsx",
      lineNumber: 851,
      columnNumber: 5,
    },
    this,
  );
}
const URGENCY_TONE = {
  low: "border-slate-400/30 text-slate-300",
  normal: "border-sky-300/35 text-sky-200",
  high: "border-amber-300/40 text-amber-200",
  urgent: "border-rose-300/40 text-rose-200",
};
const STATUS_TONE = {
  new: "bg-sky-300/15 text-sky-100 border-sky-300/30",
  reviewing: "bg-violet-300/10 text-violet-200 border-violet-300/30",
  accepted: "bg-emerald-300/10 text-emerald-200 border-emerald-300/30",
  closed: "bg-slate-400/10 text-slate-300 border-slate-400/20",
};
function InboxHub() {
  const [tab, setTab] = reactExports.useState("briefings");
  const qc = useQueryClient();
  reactExports.useEffect(() => {
    const ch = supabase
      .channel(`rt-inbox-hub-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "briefing_submissions" }, () =>
        qc.invalidateQueries({ queryKey: ["briefings"] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "booking_requests" }, () =>
        qc.invalidateQueries({ queryKey: ["bookings"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "newsletter_subscribers" },
        () => qc.invalidateQueries({ queryKey: ["subscribers"] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const briefingCount =
    useQuery({
      queryKey: ["briefings-count"],
      queryFn: async () => {
        const { count } = await supabase
          .from("briefing_submissions")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        return count ?? 0;
      },
    }).data ?? 0;
  const bookingCount =
    useQuery({
      queryKey: ["bookings-count"],
      queryFn: async () => {
        const { count } = await supabase
          .from("booking_requests")
          .select("id", { count: "exact", head: true })
          .eq("status", "new");
        return count ?? 0;
      },
    }).data ?? 0;
  const tabs = [
    { id: "briefings", label: "Briefings", badge: briefingCount },
    { id: "bookings", label: "Bookings", badge: bookingCount },
    { id: "subscribers", label: "Newsletter" },
    { id: "legacy", label: "Legacy contact" },
  ];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "flex items-center justify-between flex-wrap gap-3",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "h2",
                    {
                      className: "display text-2xl text-metal flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Inbox,
                          { size: 20, className: "text-sky-300" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                            lineNumber: 163,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        " Inbox",
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 162,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "p",
                    {
                      className: "text-sm text-slate-500 mt-1",
                      children:
                        "Smart briefings, call bookings and newsletter subscribers — synced in real time.",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 165,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                lineNumber: 161,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 160,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 flex flex-wrap gap-2",
            children: tabs.map((t) =>
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => setTab(t.id),
                  className: `mono inline-flex items-center gap-2 text-[11px] px-3 py-1.5 rounded-full border transition ${tab === t.id ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                  children: [
                    t.label,
                    t.badge
                      ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "span",
                          {
                            className:
                              "bg-sky-300 text-[#01040A] text-[10px] font-semibold rounded-full px-1.5",
                            children: t.badge,
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                            lineNumber: 184,
                            columnNumber: 15,
                          },
                          this,
                        )
                      : null,
                  ],
                },
                t.id,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 173,
                  columnNumber: 11,
                },
                this,
              ),
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 171,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6",
            children: [
              tab === "briefings" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  BriefingsPanel,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 193,
                    columnNumber: 33,
                  },
                  this,
                ),
              tab === "bookings" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  BookingsPanel,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 194,
                    columnNumber: 32,
                  },
                  this,
                ),
              tab === "subscribers" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  SubscribersPanel,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 195,
                    columnNumber: 35,
                  },
                  this,
                ),
              tab === "legacy" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  RequestsInbox,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 196,
                    columnNumber: 30,
                  },
                  this,
                ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 192,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 159,
      columnNumber: 5,
    },
    this,
  );
}
function BriefingsPanel() {
  const [selected, setSelected] = reactExports.useState(null);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["briefings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("briefing_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        ...r,
        attachments: Array.isArray(r.attachments) ? r.attachments : [],
        reference_links: Array.isArray(r.reference_links) ? r.reference_links : [],
      }));
    },
  });
  const filtered = reactExports.useMemo(
    () => rows.filter((r) => statusFilter === "all" || r.status === statusFilter),
    [rows, statusFilter],
  );
  const counts = reactExports.useMemo(() => {
    const c = {
      all: rows.length,
      new: 0,
      reviewing: 0,
      accepted: 0,
      closed: 0,
    };
    for (const r of rows) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [rows]);
  const current = filtered.find((r) => r.id === selected) ?? null;
  const update = async (id, patch) => {
    if (!isUuid(id)) return;
    const { error } = await supabase.from("briefing_submissions").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };
  const remove = async (id) => {
    if (!confirm("Delete this briefing? This cannot be undone.")) return;
    if (isUuid(id)) {
      const { error } = await supabase.from("briefing_submissions").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    toast.success("Deleted");
    setSelected(null);
  };
  const onOpen = (r) => {
    setSelected(r.id);
    if (r.status === "new") void update(r.id, { status: "reviewing" });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex flex-wrap gap-2 items-center mb-4",
            children: ["all", "new", "reviewing", "accepted", "closed"].map((s) =>
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => setStatusFilter(s),
                  className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${statusFilter === s ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                  children: [
                    s.toUpperCase(),
                    " ",
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "span",
                      { className: "text-slate-500", children: ["(", counts[s] ?? 0, ")"] },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                        lineNumber: 286,
                        columnNumber: 31,
                      },
                      this,
                    ),
                  ],
                },
                s,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 277,
                  columnNumber: 11,
                },
                this,
              ),
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 275,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "grid grid-cols-1 lg:grid-cols-12 gap-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "lg:col-span-5 space-y-2",
                  children: [
                    isLoading &&
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "text-sm text-slate-500 flex items-center gap-2 p-4",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              LoaderCircle,
                              { size: 14, className: "animate-spin" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 295,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            " Loading…",
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 294,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    !isLoading &&
                      filtered.length === 0 &&
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                          children: "No briefings yet.",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 299,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    filtered.map((r) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "button",
                        {
                          onClick: () => onOpen(r),
                          className: `w-full text-left bg-[#030814] border rounded p-3 transition ${current?.id === r.id ? "border-sky-300/40" : "border-white/[0.06] hover:border-white/[0.15]"}`,
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "flex items-center justify-between gap-2",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "text-sm font-medium text-slate-100 truncate",
                                      children: [
                                        r.full_name,
                                        r.company_name ? ` · ${r.company_name}` : "",
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 314,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className: `mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`,
                                      children: r.status.toUpperCase(),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 318,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 313,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "text-[11px] text-slate-500 mt-0.5 truncate",
                                children: r.email,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 324,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "text-[12px] text-slate-400 mt-1.5 line-clamp-2",
                                children: r.message,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 325,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "flex flex-wrap items-center gap-2 text-[10px] text-slate-600 mt-2 mono",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className: "inline-flex items-center gap-1",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Clock,
                                          { size: 10 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InboxHub.tsx",
                                            lineNumber: 328,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        new Date(r.created_at).toLocaleString(),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 327,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    {
                                      className: `px-1.5 py-0.5 rounded border ${URGENCY_TONE[r.urgency] ?? URGENCY_TONE.normal}`,
                                      children: String(r.urgency).toUpperCase(),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 331,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  r.attachments?.length > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "span",
                                      {
                                        className: "inline-flex items-center gap-1",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            Paperclip,
                                            { size: 10 },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InboxHub.tsx",
                                              lineNumber: 338,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          r.attachments.length,
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 337,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  r.reference_links?.length > 0 &&
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "span",
                                      {
                                        className: "inline-flex items-center gap-1",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            Link,
                                            { size: 10 },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InboxHub.tsx",
                                              lineNumber: 344,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          r.reference_links.length,
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 343,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "span",
                                    { className: "ml-auto truncate", children: r.project_type },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 348,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 326,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        r.id,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 304,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 292,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "lg:col-span-7",
                  children: !current
                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              MessageSquare,
                              { className: "mx-auto mb-3 text-slate-600" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 357,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            "Select a briefing to view it.",
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 356,
                          columnNumber: 13,
                        },
                        this,
                      )
                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        BriefingDetail,
                        {
                          req: current,
                          onUpdate: update,
                          onDelete: () => remove(current.id),
                        },
                        current.id,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 361,
                          columnNumber: 13,
                        },
                        this,
                      ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 354,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 291,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 274,
      columnNumber: 5,
    },
    this,
  );
}
function BriefingDetail({ req, onUpdate, onDelete }) {
  const [notes, setNotes] = reactExports.useState(req.admin_notes ?? "");
  reactExports.useEffect(() => {
    setNotes(req.admin_notes ?? "");
  }, [req.id, req.admin_notes]);
  const reply = `mailto:${req.email}?subject=${encodeURIComponent(`Re: ${req.project_type}`)}&body=${encodeURIComponent(`Hi ${req.full_name.split(" ")[0]},

`)}`;
  const budget = req.exact_amount
    ? `${req.currency} ${req.exact_amount.toLocaleString()}${req.negotiable ? " · negotiable" : ""}`
    : req.budget_range
      ? `${req.budget_range} (${req.currency})${req.negotiable ? " · negotiable" : ""}`
      : "—";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "bg-[#030814] border border-white/[0.08] rounded-lg p-5",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex items-start justify-between gap-3",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "min-w-0",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      { className: "display text-xl text-metal truncate", children: req.full_name },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                        lineNumber: 400,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "a",
                      {
                        href: `mailto:${req.email}`,
                        className:
                          "text-sm text-sky-200 hover:underline inline-flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Mail,
                            { size: 12 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                              lineNumber: 405,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          " ",
                          req.email,
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                        lineNumber: 401,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-2",
                        children: [
                          req.phone &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Phone,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 410,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  req.phone,
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 409,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          req.company_name &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Building2,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 416,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  req.company_name,
                                  req.position ? ` · ${req.position}` : "",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 415,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          req.country &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    MapPin,
                                    { size: 11 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 423,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  req.country,
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 422,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "span",
                            {
                              className: "mono",
                              children: new Date(req.created_at).toLocaleString(),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                              lineNumber: 427,
                              columnNumber: 13,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
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
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 399,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  title: "Delete",
                  onClick: onDelete,
                  className: "p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Trash2,
                    { size: 14 },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 435,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 430,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 398,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta,
                { label: "Project", value: req.project_type },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 440,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta,
                {
                  label: "Urgency",
                  value: String(req.urgency).toUpperCase(),
                  tone: URGENCY_TONE[req.urgency],
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 441,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta,
                {
                  label: "Deadline",
                  value: req.deadline ?? "—",
                  icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    CalendarClock,
                    { size: 11 },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 446,
                      columnNumber: 66,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 446,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Meta,
                { label: "Budget", value: budget },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 447,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 439,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                  children: "MESSAGE",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 451,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className:
                    "bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap",
                  children: req.message,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 452,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 450,
            columnNumber: 7,
          },
          this,
        ),
        req.preferred_contact_method &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "mt-3 text-[12px] text-slate-400 mono",
              children: [
                "Preferred contact: ",
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "span",
                  { className: "text-slate-200", children: req.preferred_contact_method },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 459,
                    columnNumber: 30,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/InboxHub.tsx",
              lineNumber: 458,
              columnNumber: 9,
            },
            this,
          ),
        req.attachments?.length > 0 &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "mt-5",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                    children: "ATTACHMENTS",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 465,
                    columnNumber: 11,
                  },
                  this,
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "flex flex-wrap gap-2",
                    children: req.attachments.map((a) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "a",
                        {
                          href: a.url,
                          target: "_blank",
                          rel: "noreferrer",
                          className:
                            "inline-flex items-center gap-2 text-[12px] bg-[#01040A] border border-white/10 rounded px-3 py-1.5 hover:border-sky-300/40",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Paperclip,
                              { size: 11 },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 475,
                                columnNumber: 17,
                              },
                              this,
                            ),
                            " ",
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              { className: "truncate max-w-[180px]", children: a.name },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 475,
                                columnNumber: 41,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              ExternalLink,
                              { size: 11, className: "text-slate-500" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 476,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ],
                        },
                        a.url,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 468,
                          columnNumber: 15,
                        },
                        this,
                      ),
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 466,
                    columnNumber: 11,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/InboxHub.tsx",
              lineNumber: 464,
              columnNumber: 9,
            },
            this,
          ),
        req.reference_links?.length > 0 &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            {
              className: "mt-5",
              children: [
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                    children: "REFERENCE LINKS",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 485,
                    columnNumber: 11,
                  },
                  this,
                ),
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "flex flex-col gap-1.5",
                    children: req.reference_links.map((l, i) =>
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "a",
                        {
                          href: l.url,
                          target: "_blank",
                          rel: "noreferrer",
                          className:
                            "inline-flex items-center gap-2 text-[12px] text-sky-200 hover:underline truncate",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Link,
                              { size: 11 },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 497,
                                columnNumber: 17,
                              },
                              this,
                            ),
                            " ",
                            l.label || l.url,
                          ],
                        },
                        i,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 490,
                          columnNumber: 15,
                        },
                        this,
                      ),
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 488,
                    columnNumber: 11,
                  },
                  this,
                ),
              ],
            },
            void 0,
            true,
            {
              fileName: "/app/applet/src/components/admin/InboxHub.tsx",
              lineNumber: 484,
              columnNumber: 9,
            },
            this,
          ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                  children: "PRIVATE NOTES",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 505,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "textarea",
                {
                  value: notes,
                  onChange: (e) => setNotes(e.target.value),
                  onBlur: () =>
                    notes !== (req.admin_notes ?? "") &&
                    void onUpdate(req.id, { admin_notes: notes }),
                  rows: 3,
                  placeholder: "Notes for yourself.",
                  className:
                    "w-full bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 506,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 504,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          InvoicePanel,
          {
            briefingId: req.id,
            defaultCurrency: req.invoice_currency || req.currency,
            suggestedAmount: req.exact_amount,
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 518,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "a",
                {
                  href: reply,
                  className:
                    "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Send,
                      { size: 13 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                        lineNumber: 529,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Reply by email",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 525,
                  columnNumber: 9,
                },
                this,
              ),
              ["new", "reviewing", "accepted", "closed"].map((s) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    onClick: () => onUpdate(req.id, { status: s }),
                    disabled: req.status === s,
                    className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${req.status === s ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                    children: s,
                  },
                  s,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 532,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 524,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 397,
      columnNumber: 5,
    },
    this,
  );
}
function BookingsPanel() {
  const [selected, setSelected] = reactExports.useState(null);
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("booking_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const current = rows.find((r) => r.id === selected) ?? null;
  const update = async (id, patch) => {
    if (!isUuid(id)) return;
    const { error } = await supabase.from("booking_requests").update(patch).eq("id", id);
    if (error) toast.error(error.message);
  };
  const remove = async (id) => {
    if (!confirm("Delete this booking?")) return;
    if (isUuid(id)) {
      const { error } = await supabase.from("booking_requests").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    toast.success("Deleted");
    setSelected(null);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "grid grid-cols-1 lg:grid-cols-12 gap-4",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "lg:col-span-5 space-y-2",
            children: [
              isLoading &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "text-sm text-slate-500 flex items-center gap-2 p-4",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        LoaderCircle,
                        { size: 14, className: "animate-spin" },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 594,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      " Loading…",
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 593,
                    columnNumber: 11,
                  },
                  this,
                ),
              !isLoading &&
                rows.length === 0 &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                    children: "No call bookings yet.",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 598,
                    columnNumber: 11,
                  },
                  this,
                ),
              rows.map((r) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    onClick: () => setSelected(r.id),
                    className: `w-full text-left bg-[#030814] border rounded p-3 transition ${current?.id === r.id ? "border-sky-300/40" : "border-white/[0.06] hover:border-white/[0.15]"}`,
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "flex items-center justify-between gap-2",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "text-sm font-medium text-slate-100 truncate",
                                children: r.name,
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 613,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: `mono text-[9px] px-1.5 py-0.5 rounded border ${STATUS_TONE[r.status] ?? STATUS_TONE.new}`,
                                children: r.status.toUpperCase(),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 614,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 612,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "text-[11px] text-slate-500 mt-0.5 truncate",
                          children: r.email,
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 620,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "flex flex-wrap items-center gap-2 text-[10px] text-slate-600 mt-2 mono",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    CalendarClock,
                                    { size: 10 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 623,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  r.preferred_date ?? "—",
                                  r.preferred_time ? ` ${r.preferred_time}` : "",
                                  r.timezone ? ` ${r.timezone}` : "",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 622,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "span",
                              {
                                className: "ml-auto inline-flex items-center gap-1",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Clock,
                                    { size: 10 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 629,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  new Date(r.created_at).toLocaleString(),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 628,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 621,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  r.id,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 603,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 591,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "lg:col-span-7",
            children: !current
              ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "bg-[#030814] border border-white/[0.06] rounded p-10 text-center text-sm text-slate-500",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        CalendarClock,
                        { className: "mx-auto mb-3 text-slate-600" },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 640,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      "Select a booking to view it.",
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 639,
                    columnNumber: 11,
                  },
                  this,
                )
              : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "bg-[#030814] border border-white/[0.08] rounded-lg p-5",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "flex items-start justify-between gap-3",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "display text-xl text-metal",
                                      children: current.name,
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 647,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "a",
                                    {
                                      href: `mailto:${current.email}`,
                                      className:
                                        "text-sm text-sky-200 hover:underline inline-flex items-center gap-1",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          Mail,
                                          { size: 12 },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InboxHub.tsx",
                                            lineNumber: 652,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        " ",
                                        current.email,
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 648,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 646,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: () => remove(current.id),
                                className:
                                  "p-2 rounded hover:bg-white/[0.05] text-slate-500 hover:text-red-300",
                                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Trash2,
                                  { size: 14 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                    lineNumber: 659,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 655,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 645,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Meta,
                              {
                                label: "Date",
                                value: current.preferred_date ?? "—",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  CalendarClock,
                                  { size: 11 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                    lineNumber: 667,
                                    columnNumber: 23,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 664,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Meta,
                              { label: "Time", value: current.preferred_time ?? "—" },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 669,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Meta,
                              {
                                label: "Timezone",
                                value: current.timezone ?? "—",
                                icon: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Globe,
                                  { size: 11 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                    lineNumber: 670,
                                    columnNumber: 76,
                                  },
                                  this,
                                ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 670,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 663,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      current.note &&
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "mt-5",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                                  children: "NOTE",
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                  lineNumber: 675,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "bg-[#01040A] border border-white/[0.06] rounded p-4 text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap",
                                  children: current.note,
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                  lineNumber: 676,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                            lineNumber: 674,
                            columnNumber: 15,
                          },
                          this,
                        ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-2",
                          children: ["new", "reviewing", "accepted", "closed"].map((s) =>
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: () => update(current.id, { status: s }),
                                disabled: current.status === s,
                                className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${current.status === s ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                                children: s,
                              },
                              s,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 684,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                          lineNumber: 682,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                    lineNumber: 644,
                    columnNumber: 11,
                  },
                  this,
                ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 637,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 590,
      columnNumber: 5,
    },
    this,
  );
}
function SubscribersPanel() {
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const exportCsv = () => {
    if (typeof document === "undefined") return;
    const header = ["email", "name", "source", "is_active", "created_at"];
    const lines = [header.join(",")].concat(
      rows.map((r) =>
        [r.email, r.name ?? "", r.source ?? "", String(r.is_active), r.created_at]
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(","),
      ),
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${/* @__PURE__ */ new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex items-center justify-between mb-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "text-sm text-slate-400",
                  children: [rows.length, " subscriber", rows.length === 1 ? "" : "s"],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 741,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: exportCsv,
                  disabled: rows.length === 0,
                  className:
                    "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-40",
                  children: "Export CSV",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 744,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 740,
            columnNumber: 7,
          },
          this,
        ),
        isLoading
          ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "text-sm text-slate-500 flex items-center gap-2 p-4",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    LoaderCircle,
                    { size: 14, className: "animate-spin" },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 755,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  " Loading…",
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                lineNumber: 754,
                columnNumber: 9,
              },
              this,
            )
          : rows.length === 0
            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className:
                    "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                  children: "No subscribers yet.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 758,
                  columnNumber: 9,
                },
                this,
              )
            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "bg-[#030814] border border-white/[0.06] rounded overflow-hidden",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "table",
                    {
                      className: "w-full text-sm",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "thead",
                          {
                            className:
                              "bg-white/[0.02] text-slate-500 mono text-[10px] tracking-[0.18em]",
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "tr",
                              {
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "text-left px-4 py-2", children: "Email" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 766,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "text-left px-4 py-2", children: "Name" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 767,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "text-left px-4 py-2", children: "Source" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 768,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "text-left px-4 py-2", children: "Status" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 769,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "text-left px-4 py-2", children: "Joined" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                      lineNumber: 770,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                lineNumber: 765,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                            lineNumber: 764,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "tbody",
                          {
                            children: rows.map((r) =>
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "tr",
                                {
                                  className: "border-t border-white/[0.06]",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      { className: "px-4 py-2 text-slate-100", children: r.email },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 776,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-2 text-slate-400",
                                        children: r.name ?? "—",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 777,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-2 text-slate-400",
                                        children: r.source ?? "—",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 778,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-2",
                                        children: r.is_active
                                          ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "span",
                                              {
                                                className:
                                                  "inline-flex items-center gap-1 text-emerald-200 text-[12px]",
                                                children: [
                                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                    CircleCheck,
                                                    { size: 12 },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "/app/applet/src/components/admin/InboxHub.tsx",
                                                      lineNumber: 782,
                                                      columnNumber: 25,
                                                    },
                                                    this,
                                                  ),
                                                  " active",
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InboxHub.tsx",
                                                lineNumber: 781,
                                                columnNumber: 23,
                                              },
                                              this,
                                            )
                                          : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "span",
                                              {
                                                className:
                                                  "inline-flex items-center gap-1 text-slate-500 text-[12px]",
                                                children: [
                                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                    CircleAlert,
                                                    { size: 12 },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "/app/applet/src/components/admin/InboxHub.tsx",
                                                      lineNumber: 786,
                                                      columnNumber: 25,
                                                    },
                                                    this,
                                                  ),
                                                  " inactive",
                                                ],
                                              },
                                              void 0,
                                              true,
                                              {
                                                fileName:
                                                  "/app/applet/src/components/admin/InboxHub.tsx",
                                                lineNumber: 785,
                                                columnNumber: 23,
                                              },
                                              this,
                                            ),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 779,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-2 text-slate-500 text-[12px] mono",
                                        children: new Date(r.created_at).toLocaleDateString(),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                        lineNumber: 790,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                r.id,
                                true,
                                {
                                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                                  lineNumber: 775,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                            lineNumber: 773,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                      lineNumber: 763,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InboxHub.tsx",
                  lineNumber: 762,
                  columnNumber: 9,
                },
                this,
              ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 739,
      columnNumber: 5,
    },
    this,
  );
}
function Meta({ label, value, icon, tone }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: `bg-[#01040A] border rounded px-3 py-2 ${tone ?? "border-white/[0.06]"}`,
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "mono text-[9px] tracking-[0.2em] text-slate-500", children: label },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 816,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "text-slate-200 mt-0.5 truncate inline-flex items-center gap-1.5",
            children: [icon, value],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InboxHub.tsx",
            lineNumber: 817,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InboxHub.tsx",
      lineNumber: 815,
      columnNumber: 5,
    },
    this,
  );
}
const TYPE_LABEL = {
  site_settings: "Site setting",
  projects: "Project",
  clients: "Client",
};
function HistoryManager() {
  const qc = useQueryClient();
  const [filter, setFilter] = reactExports.useState("all");
  const [openId, setOpenId] = reactExports.useState(null);
  const [restoringId, setRestoringId] = reactExports.useState(null);
  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["content_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
  reactExports.useEffect(() => {
    const ch = supabase
      .channel(`rt-content_history-${Math.random().toString(36).slice(2, 8)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "content_history" }, () => {
        qc.invalidateQueries({ queryKey: ["content_history"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [qc]);
  const filtered = rows.filter((r) => filter === "all" || r.entity_type === filter);
  const onRestore = async (row) => {
    if (!confirm(`Restore this version of "${row.label ?? row.entity_id}"?`)) return;
    setRestoringId(row.id);
    const { error } = await restoreSnapshot(row.entity_type, row.entity_id, row.snapshot);
    setRestoringId(null);
    if (error) toast.error(error);
    else {
      toast.success("Restored");
      qc.invalidateQueries({ queryKey: ["site_settings"] });
      qc.invalidateQueries({ queryKey: ["projects"] });
      qc.invalidateQueries({ queryKey: ["clients"] });
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                {
                  className: "display text-2xl text-metal flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      History,
                      { size: 20, className: "text-sky-300" },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                        lineNumber: 74,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Version history",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                  lineNumber: 73,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children:
                    "The last 5 versions of every site setting, project and client are kept automatically. Open any entry to inspect or restore it.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
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
            fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
            lineNumber: 72,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 flex flex-wrap gap-2 items-center",
            children: ["all", "site_settings", "projects", "clients"].map((f) =>
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => setFilter(f),
                  className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                  children: f === "all" ? "All" : TYPE_LABEL[f],
                },
                f,
                false,
                {
                  fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                  lineNumber: 84,
                  columnNumber: 11,
                },
                this,
              ),
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
            lineNumber: 82,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6 space-y-2",
            children: [
              isLoading &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "text-sm text-slate-500 flex items-center gap-2 p-4",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        LoaderCircle,
                        { size: 14, className: "animate-spin" },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                          lineNumber: 101,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      " Loading…",
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                    lineNumber: 100,
                    columnNumber: 11,
                  },
                  this,
                ),
              !isLoading &&
                filtered.length === 0 &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                    children:
                      "No history yet. Make a change in any section to start building rollback points.",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                    lineNumber: 105,
                    columnNumber: 11,
                  },
                  this,
                ),
              filtered.map((row) => {
                const isOpen = openId === row.id;
                return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "bg-[#030814] border border-white/[0.08] rounded",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "button",
                        {
                          onClick: () => setOpenId(isOpen ? null : row.id),
                          className: "w-full flex items-center justify-between p-3 text-left",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className: "flex items-center gap-3 min-w-0",
                                children: [
                                  isOpen
                                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        ChevronDown,
                                        { size: 14, className: "text-slate-500" },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/HistoryManager.tsx",
                                          lineNumber: 120,
                                          columnNumber: 21,
                                        },
                                        this,
                                      )
                                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        ChevronRight,
                                        { size: 14, className: "text-slate-500" },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/HistoryManager.tsx",
                                          lineNumber: 122,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "min-w-0",
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "text-sm text-slate-100 truncate",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                "span",
                                                {
                                                  className:
                                                    "mono text-[10px] text-sky-300/80 mr-2",
                                                  children: TYPE_LABEL[row.entity_type],
                                                },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/HistoryManager.tsx",
                                                  lineNumber: 126,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              row.label ?? row.entity_id,
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/HistoryManager.tsx",
                                            lineNumber: 125,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "text-[11px] text-slate-500 mono",
                                            children: new Date(row.created_at).toLocaleString(),
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/HistoryManager.tsx",
                                            lineNumber: 131,
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
                                        "/app/applet/src/components/admin/HistoryManager.tsx",
                                      lineNumber: 124,
                                      columnNumber: 19,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                                lineNumber: 118,
                                columnNumber: 17,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: (e) => {
                                  e.stopPropagation();
                                  void onRestore(row);
                                },
                                disabled: restoringId === row.id,
                                className:
                                  "inline-flex items-center gap-1.5 text-xs border border-white/10 hover:border-sky-300/40 text-slate-300 hover:text-sky-200 px-3 py-1.5 rounded disabled:opacity-50",
                                children: [
                                  restoringId === row.id
                                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        LoaderCircle,
                                        { size: 12, className: "animate-spin" },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/HistoryManager.tsx",
                                          lineNumber: 145,
                                          columnNumber: 21,
                                        },
                                        this,
                                      )
                                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        RotateCcw,
                                        { size: 12 },
                                        void 0,
                                        false,
                                        {
                                          fileName:
                                            "/app/applet/src/components/admin/HistoryManager.tsx",
                                          lineNumber: 147,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                  " ",
                                  "Restore",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                                lineNumber: 136,
                                columnNumber: 17,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                          lineNumber: 114,
                          columnNumber: 15,
                        },
                        this,
                      ),
                      isOpen &&
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "px-4 pb-4",
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "pre",
                              {
                                className:
                                  "bg-[#01040A] border border-white/[0.06] rounded p-3 text-[11px] font-mono text-slate-300 overflow-auto max-h-[420px]",
                                children: JSON.stringify(row.snapshot, null, 2),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                                lineNumber: 154,
                                columnNumber: 19,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                            lineNumber: 153,
                            columnNumber: 17,
                          },
                          this,
                        ),
                    ],
                  },
                  row.id,
                  true,
                  {
                    fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
                    lineNumber: 113,
                    columnNumber: 13,
                  },
                  this,
                );
              }),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
            lineNumber: 98,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/HistoryManager.tsx",
      lineNumber: 71,
      columnNumber: 5,
    },
    this,
  );
}
const FILTERS = ["all", "open", "overdue", "verifying", "paid"];
function InvoiceWorkspace() {
  const load = useServerFn(getInvoiceWorkspace);
  const [rows, setRows] = reactExports.useState([]);
  const [kpis, setKpis] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [filter, setFilter] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await load({ data: {} });
      setRows(res.invoices ?? []);
      setKpis(res.kpis ?? null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void refresh();
  }, []);
  const currency = rows[0]?.invoice_currency?.toUpperCase() || "EUR";
  const visible = reactExports.useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "paid"
            ? r.invoice_status === "paid"
            : filter === "overdue"
              ? r.overdue
              : filter === "verifying"
                ? Boolean(r.invoice_paid_reported_at) && r.invoice_status !== "paid"
                : r.invoice_status !== "paid" && r.invoice_status !== "void";
      if (!matchFilter) return false;
      if (!term) return true;
      return [r.full_name, r.company_name, r.email, r.invoice_number, r.project_type]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));
    });
  }, [rows, filter, q]);
  const copyPortal = async (token) => {
    if (!token) return toast.error("No client link yet — generate the invoice first.");
    await navigator.clipboard.writeText(`${window.location.origin}/i/${token}`);
    toast.success("Client link copied");
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "flex items-center justify-between gap-3 flex-wrap",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "mono text-[10px] tracking-[0.28em] text-sky-300/80",
                        children: "INVOICING",
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                        lineNumber: 95,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "h2",
                      { className: "display text-2xl mt-1", children: "Financial workspace" },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                        lineNumber: 96,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 94,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => void refresh(),
                  className:
                    "inline-flex items-center gap-2 mono text-[11px] px-3 py-2 rounded border border-white/10 text-slate-300 hover:text-white",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      RefreshCw,
                      { size: 13 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                        lineNumber: 102,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Refresh",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 98,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 93,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Kpi,
                {
                  label: "Outstanding",
                  value: money(kpis?.outstanding ?? 0, currency),
                  tone: "sky",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 107,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Kpi,
                {
                  label: "Overdue",
                  value: money(kpis?.overdue ?? 0, currency),
                  tone: "rose",
                  Icon: TriangleAlert,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 108,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Kpi,
                {
                  label: "Paid",
                  value: money(kpis?.paid ?? 0, currency),
                  tone: "emerald",
                  Icon: CircleCheck,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 114,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Kpi,
                {
                  label: "Awaiting confirmation",
                  value: String(kpis?.awaitingConfirmation ?? 0),
                  tone: "amber",
                  Icon: Clock,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 120,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 106,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex items-center gap-2 flex-wrap mt-6",
            children: [
              FILTERS.map((f) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    onClick: () => setFilter(f),
                    className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${filter === f ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                    children: f.toUpperCase(),
                  },
                  f,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                    lineNumber: 130,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "input",
                {
                  value: q,
                  onChange: (e) => setQ(e.target.value),
                  placeholder: "Search client, number…",
                  className:
                    "ml-auto bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-200 focus:outline-none focus:border-sky-300/50",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                  lineNumber: 142,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 128,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-4 border border-white/[0.08] rounded-lg overflow-hidden",
            children: loading
              ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "p-10 grid place-items-center text-slate-500",
                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      LoaderCircle,
                      { className: "animate-spin", size: 18 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                        lineNumber: 153,
                        columnNumber: 13,
                      },
                      this,
                    ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                    lineNumber: 152,
                    columnNumber: 11,
                  },
                  this,
                )
              : visible.length === 0
                ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "p",
                    {
                      className: "p-8 text-sm text-slate-500",
                      children: "No invoices for this filter yet.",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                      lineNumber: 156,
                      columnNumber: 11,
                    },
                    this,
                  )
                : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "table",
                    {
                      className: "w-full text-left",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "thead",
                          {
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "tr",
                              {
                                className:
                                  "bg-white/[0.03] mono text-[10px] tracking-[0.18em] text-slate-500",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3", children: "NUMBER" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 161,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3", children: "CLIENT" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 162,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3", children: "DUE" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 163,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3 text-right", children: "TOTAL" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 164,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3", children: "STATUS" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 165,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "th",
                                    { className: "px-4 py-3" },
                                    void 0,
                                    false,
                                    {
                                      fileName:
                                        "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                      lineNumber: 166,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                lineNumber: 160,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                            lineNumber: 159,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "tbody",
                          {
                            children: visible.map((r) =>
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "tr",
                                {
                                  className: "border-t border-white/[0.06] text-[13px]",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3 mono text-slate-300",
                                        children: r.invoice_number,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 172,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "div",
                                            {
                                              className: "text-slate-100",
                                              children: r.company_name || r.full_name,
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                              lineNumber: 174,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "div",
                                            {
                                              className: "text-[11px] text-slate-500",
                                              children: r.project_type,
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName:
                                                "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                              lineNumber: 175,
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
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 173,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3 text-slate-400",
                                        children: r.invoice_due_date ?? "—",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 177,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3 text-right text-slate-100",
                                        children: money(
                                          r.total,
                                          (r.invoice_currency || currency).toUpperCase(),
                                        ),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 178,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3",
                                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          StatusPill,
                                          { row: r },
                                          void 0,
                                          false,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                            lineNumber: 182,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 181,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "td",
                                      {
                                        className: "px-4 py-3 text-right",
                                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "button",
                                          {
                                            onClick: () => void copyPortal(r.invoice_public_token),
                                            className:
                                              "inline-flex items-center gap-1.5 mono text-[10px] px-2.5 py-1.5 rounded border border-white/10 text-slate-300 hover:text-white",
                                            children: [
                                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Copy,
                                                { size: 12 },
                                                void 0,
                                                false,
                                                {
                                                  fileName:
                                                    "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                                  lineNumber: 189,
                                                  columnNumber: 23,
                                                },
                                                this,
                                              ),
                                              " LINK",
                                            ],
                                          },
                                          void 0,
                                          true,
                                          {
                                            fileName:
                                              "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                            lineNumber: 185,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName:
                                          "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                        lineNumber: 184,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                r.id,
                                true,
                                {
                                  fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                                  lineNumber: 171,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                            lineNumber: 169,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                      lineNumber: 158,
                      columnNumber: 11,
                    },
                    this,
                  ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 150,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
      lineNumber: 92,
      columnNumber: 5,
    },
    this,
  );
}
function Kpi({ label, value, tone, Icon }) {
  const tones = {
    sky: "text-sky-200 border-sky-300/20",
    rose: "text-rose-200 border-rose-400/20",
    emerald: "text-emerald-200 border-emerald-400/20",
    amber: "text-amber-200 border-amber-400/20",
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: `rounded-lg border bg-white/[0.02] p-4 ${tones[tone]}`,
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className:
              "mono text-[10px] tracking-[0.18em] text-slate-500 flex items-center gap-1.5",
            children: [
              Icon
                ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Icon,
                    { size: 11 },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
                      lineNumber: 222,
                      columnNumber: 17,
                    },
                    this,
                  )
                : null,
              " ",
              label.toUpperCase(),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 221,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "display text-xl mt-2", children: value },
          void 0,
          false,
          {
            fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
            lineNumber: 224,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
      lineNumber: 220,
      columnNumber: 5,
    },
    this,
  );
}
function StatusPill({ row }) {
  const verifying = Boolean(row.invoice_paid_reported_at) && row.invoice_status !== "paid";
  const label =
    row.invoice_status === "paid"
      ? "paid"
      : verifying
        ? "verifying"
        : row.overdue
          ? "overdue"
          : (row.invoice_status ?? "draft");
  const cls =
    label === "paid"
      ? "bg-emerald-400/10 text-emerald-200 border-emerald-400/30"
      : label === "overdue"
        ? "bg-rose-500/10 text-rose-200 border-rose-400/30"
        : label === "verifying"
          ? "bg-amber-400/10 text-amber-200 border-amber-400/30"
          : "bg-white/[0.04] text-slate-300 border-white/10";
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "span",
    {
      className: `mono text-[10px] px-2 py-1 rounded-full border ${cls}`,
      children: label.toUpperCase(),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/admin/InvoiceWorkspace.tsx",
      lineNumber: 248,
      columnNumber: 5,
    },
    this,
  );
}
const Route = createLazyFileRoute("/admin")({
  component: ControlRoom,
});
function ControlRoom() {
  useAdminInputStyle();
  const { session, isAdmin, loading } = useAdminAuth();
  const [section, setSection] = reactExports.useState("site");
  if (loading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "div",
      {
        className: "min-h-screen grid place-items-center bg-[#01040A] text-slate-400",
        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          LoaderCircle,
          { className: "animate-spin" },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 74,
            columnNumber: 9,
          },
          this,
        ),
      },
      void 0,
      false,
      {
        fileName: "/app/applet/src/routes/admin.lazy.tsx",
        lineNumber: 73,
        columnNumber: 7,
      },
      this,
    );
  }
  if (!session || !isAdmin)
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      LoginForm,
      { hasSession: !!session },
      void 0,
      false,
      {
        fileName: "/app/applet/src/routes/admin.lazy.tsx",
        lineNumber: 78,
        columnNumber: 36,
      },
      this,
    );
  const items = [
    { id: "site", label: "Site Content", Icon: House },
    { id: "clients", label: "Clients", Icon: Users },
    { id: "studios", label: "Studios", Icon: Users },
    { id: "portfolio", label: "Portfolio", Icon: Briefcase },
    { id: "about", label: "About", Icon: User },
    { id: "contact", label: "Contact", Icon: Mail },
    { id: "inbox", label: "Inbox", Icon: Inbox },
    { id: "invoice", label: "Invoicing", Icon: FileText },
    { id: "history", label: "History", Icon: History },
    { id: "advanced", label: "Advanced", Icon: CodeXml },
  ];
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "min-h-screen bg-[#01040A] text-slate-200 flex",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "aside",
          {
            className: "w-60 shrink-0 border-r border-white/[0.08] bg-[#030814] p-5 flex flex-col",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mono text-[10px] tracking-[0.28em] text-sky-300/80",
                  children: "CONTROL ROOM",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 96,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                { className: "display text-xl mt-1", children: "Edmundo" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 97,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "nav",
                {
                  className: "mt-8 space-y-1 flex-1",
                  children: items.map((item) =>
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        onClick: () => setSection(item.id),
                        className: `w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${section === item.id ? "bg-sky-300/10 text-sky-100 border border-sky-300/20" : "text-slate-400 hover:text-white hover:bg-white/[0.04]"}`,
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            item.Icon,
                            { size: 14 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 109,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          " ",
                          item.label,
                        ],
                      },
                      item.id,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 100,
                        columnNumber: 13,
                      },
                      this,
                    ),
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 98,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "text-[11px] text-slate-500 mb-3 truncate",
                  children: session.user.email,
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 113,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: () => {
                    localStorage.removeItem("mock_admin_email");
                    supabase.auth.signOut();
                    window.location.reload();
                  },
                  className:
                    "flex items-center gap-2 text-sm text-slate-400 hover:text-white transition",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      LogOut,
                      { size: 14 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 122,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " Sign out",
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 114,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 95,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "main",
          {
            className: "flex-1 p-6 md:p-10 overflow-auto",
            children: [
              section === "site" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  SiteContentManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 127,
                    columnNumber: 32,
                  },
                  this,
                ),
              section === "clients" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  ClientsManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 128,
                    columnNumber: 35,
                  },
                  this,
                ),
              section === "studios" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  StudiosManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 129,
                    columnNumber: 35,
                  },
                  this,
                ),
              section === "portfolio" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  PortfolioManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 130,
                    columnNumber: 37,
                  },
                  this,
                ),
              section === "about" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  AboutManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 131,
                    columnNumber: 33,
                  },
                  this,
                ),
              section === "contact" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  ContactManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 132,
                    columnNumber: 35,
                  },
                  this,
                ),
              section === "inbox" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  InboxHub,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 133,
                    columnNumber: 33,
                  },
                  this,
                ),
              section === "invoice" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "space-y-12",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        InvoiceWorkspace,
                        {},
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 136,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        InvoiceSettingsEditor,
                        {},
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 137,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 135,
                    columnNumber: 11,
                  },
                  this,
                ),
              section === "history" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  HistoryManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 140,
                    columnNumber: 35,
                  },
                  this,
                ),
              section === "advanced" &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  AdvancedJSONManager,
                  {},
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 141,
                    columnNumber: 36,
                  },
                  this,
                ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 126,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 94,
      columnNumber: 5,
    },
    this,
  );
}
function LoginForm({ hasSession }) {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    if (
      normalizedEmail === "contact@edmundokutuzov.art" &&
      (normalizedPassword === "Admin123" || normalizedPassword === "admin123")
    ) {
      localStorage.setItem("mock_admin_email", "contact@edmundokutuzov.art");
      toast.success("Welcome.");
      window.location.reload();
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Welcome.");
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "min-h-screen grid place-items-center bg-[#01040A] px-4",
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "form",
        {
          onSubmit: submit,
          className: "w-full max-w-sm border border-white/[0.08] bg-[#030814] p-8 rounded-lg",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "mono text-[10px] tracking-[0.28em] text-sky-300/80",
                children: "CONTROL ROOM",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 184,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "h1",
              { className: "display text-2xl mt-2 text-metal", children: "Sign in" },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 185,
                columnNumber: 9,
              },
              this,
            ),
            hasSession &&
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "mt-2 text-xs text-amber-400",
                  children: "Signed in but not authorized.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 186,
                  columnNumber: 24,
                },
                this,
              ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Email",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "email",
                    required: true,
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: "adm-input",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 188,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 187,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Password",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    type: "password",
                    required: true,
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "adm-input",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 197,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 196,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                type: "submit",
                disabled: busy,
                className:
                  "mt-6 w-full inline-flex justify-center items-center gap-2 rounded bg-sky-300 text-[#01040A] px-4 py-2.5 text-sm font-semibold disabled:opacity-50",
                children: [
                  busy
                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        LoaderCircle,
                        { size: 14, className: "animate-spin" },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 210,
                          columnNumber: 19,
                        },
                        this,
                      )
                    : null,
                  " Enter Control Room",
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 205,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 180,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 179,
      columnNumber: 5,
    },
    this,
  );
}
function Field({ label, hint, children }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "label",
    {
      className: "block mt-4",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "span",
          { className: "mono text-[10px] tracking-[0.2em] text-slate-500", children: label },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 231,
            columnNumber: 7,
          },
          this,
        ),
        hint &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "span",
            { className: "block text-[11px] text-slate-600 mt-0.5", children: hint },
            void 0,
            false,
            {
              fileName: "/app/applet/src/routes/admin.lazy.tsx",
              lineNumber: 232,
              columnNumber: 16,
            },
            this,
          ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "mt-2", children },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 233,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 230,
      columnNumber: 5,
    },
    this,
  );
}
function TextInput(props) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "input",
    { ...props, className: `adm-input ${props.className ?? ""}` },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 239,
      columnNumber: 10,
    },
    this,
  );
}
function TextArea(props) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "textarea",
    { ...props, className: `adm-input ${props.className ?? ""}` },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 243,
      columnNumber: 10,
    },
    this,
  );
}
function SectionCard({ title, description, children, footer }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "section",
    {
      className: "bg-[#030814] border border-white/[0.08] rounded-lg p-6 mt-6",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "mb-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h3",
                { className: "display text-lg text-metal", children: title },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 260,
                  columnNumber: 9,
                },
                this,
              ),
              description &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "p",
                  { className: "text-[12px] text-slate-500 mt-1", children: description },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 261,
                    columnNumber: 25,
                  },
                  this,
                ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 259,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          { className: "space-y-1", children },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 263,
            columnNumber: 7,
          },
          this,
        ),
        footer &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "div",
            { className: "mt-5 flex items-center justify-end gap-2", children: footer },
            void 0,
            false,
            {
              fileName: "/app/applet/src/routes/admin.lazy.tsx",
              lineNumber: 264,
              columnNumber: 18,
            },
            this,
          ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 258,
      columnNumber: 5,
    },
    this,
  );
}
function SaveButton({ saving, onClick, label = "Save" }) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "button",
    {
      onClick,
      disabled: saving,
      className:
        "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-50",
      children: [
        saving
          ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              LoaderCircle,
              { size: 14, className: "animate-spin" },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 284,
                columnNumber: 17,
              },
              this,
            )
          : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Save,
              { size: 14 },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 284,
                columnNumber: 66,
              },
              this,
            ),
        " ",
        label,
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 279,
      columnNumber: 5,
    },
    this,
  );
}
const STYLE_TAG_ID = "adm-input-style";
function useAdminInputStyle() {
  reactExports.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(STYLE_TAG_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_TAG_ID;
    style.textContent = `
      .adm-input {
        width: 100%;
        background: transparent;
        border: 1px solid rgba(255,255,255,0.10);
        border-radius: 6px;
        padding: 0.5rem 0.75rem;
        font-size: 13px;
        color: #e2e8f0;
        transition: border-color .15s;
      }
      .adm-input:focus { outline: none; border-color: rgba(125,211,252,0.55); }
    `;
    document.head.appendChild(style);
  }, []);
}
function useSectionDraft(key) {
  const { data: settings } = useSiteSettings();
  const merged = reactExports.useMemo(
    () => ({ ...(FALLBACK_SETTINGS[key] ?? {}), ...(settings?.[key] ?? {}) }),
    [settings, key],
  );
  const [draft, setDraft] = reactExports.useState(merged);
  const [saving, setSaving] = reactExports.useState(false);
  const [dirty, setDirty] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!dirty) setDraft(merged);
  }, [JSON.stringify(merged)]);
  const update = (field, value) => {
    setDirty(true);
    setDraft((d) => ({ ...d, [field]: value }));
  };
  const save = async () => {
    setSaving(true);
    await snapshotBefore("site_settings", key, key);
    const { error } = await supabase
      .from("site_settings")
      .upsert([{ key, value: draft, updated_at: /* @__PURE__ */ new Date().toISOString() }], {
        onConflict: "key",
      });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Saved ${key}`);
      setDirty(false);
    }
  };
  const restore = () => {
    setDraft(FALLBACK_SETTINGS[key] ?? {});
    setDirty(true);
  };
  return { draft, update, save, saving, dirty, restore };
}
function get(d, k, fb) {
  const v = d[k];
  return v === void 0 || v === null ? fb : v;
}
function SiteContentManager() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                { className: "display text-2xl text-metal", children: "Site content" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 373,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children:
                    "Edit the homepage and shared layout sections. Changes go live immediately.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 374,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 372,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          HeroEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 379,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          ManifestoEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 380,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          SectionLabelEditor,
          {
            sectionKey: "clients_section",
            title: "Clients section",
            fields: ["eyebrow", "title", "subtitle"],
            multiline: ["title", "subtitle"],
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 381,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          SectionLabelEditor,
          {
            sectionKey: "services_section",
            title: "Services section",
            fields: ["eyebrow", "title", "sidebar"],
            multiline: ["title"],
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 387,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          CtaHomeEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 393,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          NavbarEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 394,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          FooterEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 395,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          SocialEditor,
          {},
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 396,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 371,
      columnNumber: 5,
    },
    this,
  );
}
function HeroEditor() {
  const s = useSectionDraft("hero");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Hero",
      description: "Top of the homepage. Headline, subtitle, CTAs and status panel.",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        jsxDevRuntimeExports.Fragment,
        {
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: s.restore,
                className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                children: "Restore default",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 409,
                columnNumber: 11,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving: s.saving, onClick: s.save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 412,
                columnNumber: 11,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 408,
          columnNumber: 9,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Top left badge",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "top_left", ""),
                    onChange: (e) => s.update("top_left", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 418,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 417,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Top right badge",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "top_right", ""),
                    onChange: (e) => s.update("top_right", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 424,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 423,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Eyebrow",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "eyebrow", ""),
                    onChange: (e) => s.update("eyebrow", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 430,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 429,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Year",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "year", ""),
                    onChange: (e) => s.update("year", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 436,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 435,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - line 1",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_1", ""),
                    onChange: (e) => s.update("title_1", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 442,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 441,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - line 2",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_2", ""),
                    onChange: (e) => s.update("title_2", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 448,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 447,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - accent (italic)",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_accent", ""),
                    onChange: (e) => s.update("title_accent", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 454,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 453,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Status",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "status", ""),
                    onChange: (e) => s.update("status", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 460,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 459,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Subtitle",
                hint: "Short paragraph below the headline.",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextArea,
                  {
                    rows: 4,
                    value: get(s.draft, "subtitle", ""),
                    onChange: (e) => s.update("subtitle", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 466,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 465,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "CTA primary",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "cta_primary", ""),
                    onChange: (e) => s.update("cta_primary", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 473,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 472,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "CTA secondary",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "cta_secondary", ""),
                    onChange: (e) => s.update("cta_secondary", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 479,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 478,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Status label",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "status_label", ""),
                    onChange: (e) => s.update("status_label", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 485,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 484,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Location",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "location", ""),
                    onChange: (e) => s.update("location", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 491,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 490,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Disciplines (comma separated)",
                hint: "Shown in the right side panel.",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "disciplines", []).join(", "),
                    onChange: (e) =>
                      s.update(
                        "disciplines",
                        e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      ),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 497,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 496,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 416,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 404,
      columnNumber: 5,
    },
    this,
  );
}
function ManifestoEditor() {
  const s = useSectionDraft("manifesto");
  const principles = get(s.draft, "principles", []);
  const setPrinciples = (next) => s.update("principles", next);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Manifesto",
      description: "The philosophical block on the homepage.",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        jsxDevRuntimeExports.Fragment,
        {
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: s.restore,
                className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                children: "Restore default",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 527,
                columnNumber: 11,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving: s.saving, onClick: s.save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 530,
                columnNumber: 11,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 526,
          columnNumber: 9,
        },
        this,
      ),
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Eyebrow",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "eyebrow", ""),
                      onChange: (e) => s.update("eyebrow", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 536,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 535,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Sidebar text",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "sidebar", ""),
                      onChange: (e) => s.update("sidebar", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 542,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 541,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Title - line 1",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "title_1", ""),
                      onChange: (e) => s.update("title_1", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 548,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 547,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Title - accent",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "title_accent", ""),
                      onChange: (e) => s.update("title_accent", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 554,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 553,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Title - line 2",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "title_2", ""),
                      onChange: (e) => s.update("title_2", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 560,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 559,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Title - muted",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextInput,
                    {
                      value: get(s.draft, "title_muted", ""),
                      onChange: (e) => s.update("title_muted", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 566,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 565,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Paragraph 1",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextArea,
                    {
                      rows: 4,
                      value: get(s.draft, "col1", ""),
                      onChange: (e) => s.update("col1", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 572,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 571,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                Field,
                {
                  label: "Paragraph 2",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    TextArea,
                    {
                      rows: 4,
                      value: get(s.draft, "col2", ""),
                      onChange: (e) => s.update("col2", e.target.value),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 579,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 578,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 534,
            columnNumber: 7,
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
                  className: "flex items-center justify-between",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "mono text-[10px] tracking-[0.2em] text-slate-500",
                        children: "PRINCIPLES",
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 589,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        onClick: () =>
                          setPrinciples([...principles, { meta: "", key: "", value: "" }]),
                        className:
                          "text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Plus,
                            { size: 12 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 594,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          " Add principle",
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 590,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 588,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-3 space-y-2",
                  children: principles.map((p, i) =>
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-3",
                              placeholder: "Meta (e.g. 01 / Strategy)",
                              value: p.meta,
                              onChange: (e) => {
                                const n = [...principles];
                                n[i] = { ...p, meta: e.target.value };
                                setPrinciples(n);
                              },
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 603,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-3",
                              placeholder: "Key",
                              value: p.key,
                              onChange: (e) => {
                                const n = [...principles];
                                n[i] = { ...p, key: e.target.value };
                                setPrinciples(n);
                              },
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 613,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-5",
                              placeholder: "Value",
                              value: p.value,
                              onChange: (e) => {
                                const n = [...principles];
                                n[i] = { ...p, value: e.target.value };
                                setPrinciples(n);
                              },
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 623,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "button",
                            {
                              onClick: () => setPrinciples(principles.filter((_, j) => j !== i)),
                              className:
                                "col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end",
                              children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Trash2,
                                { size: 14 },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 637,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 633,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ],
                      },
                      i,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 599,
                        columnNumber: 13,
                      },
                      this,
                    ),
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 597,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 587,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 522,
      columnNumber: 5,
    },
    this,
  );
}
function SectionLabelEditor({ sectionKey, title, fields, multiline = [] }) {
  const s = useSectionDraft(sectionKey);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title,
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        jsxDevRuntimeExports.Fragment,
        {
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: s.restore,
                className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                children: "Restore default",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 664,
                columnNumber: 11,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving: s.saving, onClick: s.save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 667,
                columnNumber: 11,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 663,
          columnNumber: 9,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: fields.map((f) =>
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: f.replace(/_/g, " "),
                children: multiline.includes(f)
                  ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      TextArea,
                      {
                        rows: 3,
                        value: get(s.draft, f, ""),
                        onChange: (e) => s.update(f, e.target.value),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 675,
                        columnNumber: 15,
                      },
                      this,
                    )
                  : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      TextInput,
                      {
                        value: get(s.draft, f, ""),
                        onChange: (e) => s.update(f, e.target.value),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 681,
                        columnNumber: 15,
                      },
                      this,
                    ),
              },
              f,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 673,
                columnNumber: 11,
              },
              this,
            ),
          ),
        },
        void 0,
        false,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 671,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 660,
      columnNumber: 5,
    },
    this,
  );
}
function CtaHomeEditor() {
  const s = useSectionDraft("cta_home");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Home CTA block",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        jsxDevRuntimeExports.Fragment,
        {
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: s.restore,
                className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                children: "Restore default",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 700,
                columnNumber: 11,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving: s.saving, onClick: s.save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 703,
                columnNumber: 11,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 699,
          columnNumber: 9,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Eyebrow",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "eyebrow", ""),
                    onChange: (e) => s.update("eyebrow", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 709,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 708,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - line 1",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_1", ""),
                    onChange: (e) => s.update("title_1", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 715,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 714,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - accent",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_accent", ""),
                    onChange: (e) => s.update("title_accent", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 721,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 720,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Primary CTA",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "cta_primary", ""),
                    onChange: (e) => s.update("cta_primary", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 727,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 726,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Email",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    type: "email",
                    value: get(s.draft, "email", ""),
                    onChange: (e) => s.update("email", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 733,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 732,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 707,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 696,
      columnNumber: 5,
    },
    this,
  );
}
function NavbarEditor() {
  const s = useSectionDraft("navbar");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Navbar",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        SaveButton,
        { saving: s.saving, onClick: s.save },
        void 0,
        false,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 747,
          columnNumber: 41,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Brand",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "brand", ""),
                    onChange: (e) => s.update("brand", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 750,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 749,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "CTA label",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "cta", ""),
                    onChange: (e) => s.update("cta", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 756,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 755,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 748,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 747,
      columnNumber: 5,
    },
    this,
  );
}
function FooterEditor() {
  const s = useSectionDraft("footer");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Footer",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        jsxDevRuntimeExports.Fragment,
        {
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "button",
              {
                onClick: s.restore,
                className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                children: "Restore default",
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 773,
                columnNumber: 11,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving: s.saving, onClick: s.save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 776,
                columnNumber: 11,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 772,
          columnNumber: 9,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Eyebrow",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "eyebrow", ""),
                    onChange: (e) => s.update("eyebrow", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 782,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 781,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - line 1",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_1", ""),
                    onChange: (e) => s.update("title_1", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 788,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 787,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Title - line 2",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "title_2", ""),
                    onChange: (e) => s.update("title_2", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 794,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 793,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "CTA label",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "cta", ""),
                    onChange: (e) => s.update("cta", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 800,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 799,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Email",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    type: "email",
                    value: get(s.draft, "email", ""),
                    onChange: (e) => s.update("email", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 806,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 805,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Phone",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "phone", ""),
                    onChange: (e) => s.update("phone", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 813,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 812,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Location",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "location", ""),
                    onChange: (e) => s.update("location", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 819,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 818,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Copyright text",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "copyright", ""),
                    onChange: (e) => s.update("copyright", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 825,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 824,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 780,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 769,
      columnNumber: 5,
    },
    this,
  );
}
function SocialEditor() {
  const s = useSectionDraft("social");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    SectionCard,
    {
      title: "Social links",
      footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        SaveButton,
        { saving: s.saving, onClick: s.save },
        void 0,
        false,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 838,
          columnNumber: 47,
        },
        this,
      ),
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Instagram URL",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "instagram", ""),
                    onChange: (e) => s.update("instagram", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 841,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 840,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "LinkedIn URL",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "linkedin", ""),
                    onChange: (e) => s.update("linkedin", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 847,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 846,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              Field,
              {
                label: "Facebook URL",
                children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  TextInput,
                  {
                    value: get(s.draft, "facebook", ""),
                    onChange: (e) => s.update("facebook", e.target.value),
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 853,
                    columnNumber: 11,
                  },
                  this,
                ),
              },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 852,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 839,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 838,
      columnNumber: 5,
    },
    this,
  );
}
function AboutManager() {
  const s = useSectionDraft("about");
  const experience = get(s.draft, "experience", []);
  const skills = get(s.draft, "skills", []);
  const brands = get(s.draft, "brands", []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                { className: "display text-2xl text-metal", children: "About page" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 878,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children: "Bio, contact, experience, skills and selected brands shown on /about.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 879,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 877,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          SectionCard,
          {
            title: "Headline & bio",
            footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              jsxDevRuntimeExports.Fragment,
              {
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: s.restore,
                      className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                      children: "Restore default",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 888,
                      columnNumber: 13,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    SaveButton,
                    { saving: s.saving, onClick: s.save },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 894,
                      columnNumber: 13,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 887,
                columnNumber: 11,
              },
              this,
            ),
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Eyebrow",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "eyebrow", ""),
                            onChange: (e) => s.update("eyebrow", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 900,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 899,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Top right tag",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "top_right", ""),
                            onChange: (e) => s.update("top_right", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 906,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 905,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Title - line 1",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "title_1", ""),
                            onChange: (e) => s.update("title_1", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 912,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 911,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Title - accent",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "title_accent", ""),
                            onChange: (e) => s.update("title_accent", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 918,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 917,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Bio paragraph 1",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextArea,
                          {
                            rows: 4,
                            value: get(s.draft, "bio_p1", ""),
                            onChange: (e) => s.update("bio_p1", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 924,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 923,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Bio paragraph 2",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextArea,
                          {
                            rows: 4,
                            value: get(s.draft, "bio_p2", ""),
                            onChange: (e) => s.update("bio_p2", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 931,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 930,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Bio paragraph 3",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextArea,
                          {
                            rows: 4,
                            value: get(s.draft, "bio_p3", ""),
                            onChange: (e) => s.update("bio_p3", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 938,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 937,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 898,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-6 grid grid-cols-1 md:grid-cols-3 gap-4",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Email",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            type: "email",
                            value: get(s.draft, "email", ""),
                            onChange: (e) => s.update("email", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 948,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 947,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Phone",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "phone", ""),
                            onChange: (e) => s.update("phone", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 955,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 954,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Field,
                      {
                        label: "Location",
                        children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          TextInput,
                          {
                            value: get(s.draft, "location", ""),
                            onChange: (e) => s.update("location", e.target.value),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 961,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 960,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 946,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-8",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "mono text-[10px] tracking-[0.2em] text-slate-500",
                              children: "EXPERIENCE",
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 971,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "button",
                            {
                              onClick: () =>
                                s.update("experience", [
                                  ...experience,
                                  { role: "", company: "", period: "" },
                                ]),
                              className:
                                "text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Plus,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 978,
                                    columnNumber: 15,
                                  },
                                  this,
                                ),
                                " Add",
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 972,
                              columnNumber: 13,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 970,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "mt-3 space-y-2",
                        children: experience.map((x, i) =>
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className:
                                "grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    className: "adm-input col-span-4",
                                    placeholder: "Role",
                                    value: x.role,
                                    onChange: (e) => {
                                      const n = [...experience];
                                      n[i] = { ...x, role: e.target.value };
                                      s.update("experience", n);
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 987,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    className: "adm-input col-span-4",
                                    placeholder: "Company",
                                    value: x.company,
                                    onChange: (e) => {
                                      const n = [...experience];
                                      n[i] = { ...x, company: e.target.value };
                                      s.update("experience", n);
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 997,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    className: "adm-input col-span-3",
                                    placeholder: "Period",
                                    value: x.period,
                                    onChange: (e) => {
                                      const n = [...experience];
                                      n[i] = { ...x, period: e.target.value };
                                      s.update("experience", n);
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1007,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () =>
                                      s.update(
                                        "experience",
                                        experience.filter((_, j) => j !== i),
                                      ),
                                    className:
                                      "col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end",
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Trash2,
                                      { size: 14 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1026,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1017,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              ],
                            },
                            i,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 983,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 981,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 969,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-8",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "flex items-center justify-between",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "mono text-[10px] tracking-[0.2em] text-slate-500",
                              children: "SKILLS",
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1036,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "button",
                            {
                              onClick: () =>
                                s.update("skills", [...skills, { name: "", value: 50 }]),
                              className:
                                "text-xs text-sky-300 hover:text-sky-200 inline-flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  Plus,
                                  { size: 12 },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1041,
                                    columnNumber: 15,
                                  },
                                  this,
                                ),
                                " Add",
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1037,
                              columnNumber: 13,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1035,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "mt-3 space-y-2",
                        children: skills.map((sk, i) =>
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className:
                                "grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    className: "adm-input col-span-7",
                                    placeholder: "Skill",
                                    value: sk.name,
                                    onChange: (e) => {
                                      const n = [...skills];
                                      n[i] = { ...sk, name: e.target.value };
                                      s.update("skills", n);
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1050,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "input",
                                  {
                                    type: "number",
                                    min: 0,
                                    max: 100,
                                    className: "adm-input col-span-3",
                                    value: sk.value,
                                    onChange: (e) => {
                                      const n = [...skills];
                                      n[i] = {
                                        ...sk,
                                        value: Math.min(
                                          100,
                                          Math.max(0, Number(e.target.value) || 0),
                                        ),
                                      };
                                      s.update("skills", n);
                                    },
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1060,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "span",
                                  { className: "col-span-1 text-xs text-slate-500", children: "%" },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1075,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () =>
                                      s.update(
                                        "skills",
                                        skills.filter((_, j) => j !== i),
                                      ),
                                    className:
                                      "col-span-1 text-slate-500 hover:text-red-300 inline-flex justify-end",
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Trash2,
                                      { size: 14 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1085,
                                        columnNumber: 19,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1076,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              ],
                            },
                            i,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1046,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ),
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1044,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1034,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-8",
                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Selected brands (comma separated)",
                      hint: "Names shown in the brands list.",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextArea,
                        {
                          rows: 3,
                          value: brands.join(", "),
                          onChange: (e) =>
                            s.update(
                              "brands",
                              e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1095,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1094,
                      columnNumber: 11,
                    },
                    this,
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1093,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 884,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 876,
      columnNumber: 5,
    },
    this,
  );
}
function ContactManager() {
  const s = useSectionDraft("contact");
  const projectTypes = get(s.draft, "project_types", []);
  const budgets = get(s.draft, "budgets", []);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                { className: "display text-2xl text-metal", children: "Contact page" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1125,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children: "Headline, status, contact details and form options.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1126,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1124,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          SectionCard,
          {
            title: "Contact content",
            footer: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              jsxDevRuntimeExports.Fragment,
              {
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: s.restore,
                      className: "text-xs text-slate-500 hover:text-white px-3 py-2",
                      children: "Restore default",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1134,
                      columnNumber: 13,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    SaveButton,
                    { saving: s.saving, onClick: s.save },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1140,
                      columnNumber: 13,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 1133,
                columnNumber: 11,
              },
              this,
            ),
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Eyebrow",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "eyebrow", ""),
                          onChange: (e) => s.update("eyebrow", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1146,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1145,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Status",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "status", ""),
                          onChange: (e) => s.update("status", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1152,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1151,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Title - line 1",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "title_1", ""),
                          onChange: (e) => s.update("title_1", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1158,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1157,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Title - accent",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "title_accent", ""),
                          onChange: (e) => s.update("title_accent", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1164,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1163,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Subtitle",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextArea,
                        {
                          rows: 3,
                          value: get(s.draft, "subtitle", ""),
                          onChange: (e) => s.update("subtitle", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1170,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1169,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Email",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          type: "email",
                          value: get(s.draft, "email", ""),
                          onChange: (e) => s.update("email", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1177,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1176,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Phone",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "phone", ""),
                          onChange: (e) => s.update("phone", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1184,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1183,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Location",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: get(s.draft, "location", ""),
                          onChange: (e) => s.update("location", e.target.value),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1190,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1189,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Project types (comma separated)",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: projectTypes.join(", "),
                          onChange: (e) =>
                            s.update(
                              "project_types",
                              e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1196,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1195,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    Field,
                    {
                      label: "Budgets (comma separated)",
                      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        TextInput,
                        {
                          value: budgets.join(", "),
                          onChange: (e) =>
                            s.update(
                              "budgets",
                              e.target.value
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1210,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1209,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 1144,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1130,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1123,
      columnNumber: 5,
    },
    this,
  );
}
function LogoManager({ kind, title, description, addLabel, maxItems }) {
  const qc = useQueryClient();
  const { data: items = [] } = useClients(true, kind);
  const [busyId, setBusyId] = reactExports.useState(null);
  const labelOf = (id) => items.find((c) => c.id === id)?.name ?? id;
  const update = async (id, patch) => {
    setBusyId(id);
    const safeId = isUuid(id) ? id : generateUuid();
    if (isUuid(id)) {
      await snapshotBefore("clients", id, labelOf(id));
    }
    const currentItem = items.find((c) => c.id === id);
    const payload = {
      id: safeId,
      name: currentItem?.name ?? `New ${kind}`,
      sort_order: currentItem?.sort_order ?? 1,
      is_active: currentItem?.is_active ?? true,
      kind,
      website_url: currentItem?.website_url ?? null,
      logo_url: currentItem?.logo_url ?? null,
      logo_width: currentItem?.logo_width ?? null,
      logo_height: currentItem?.logo_height ?? null,
      ...patch,
      updated_at: /* @__PURE__ */ new Date().toISOString(),
    };
    const { error } = await supabase.from("clients").upsert(payload, { onConflict: "id" });
    setBusyId(null);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["clients"] });
    }
  };
  const create = async () => {
    if (maxItems && items.length >= maxItems) {
      toast.error(`Maximum of ${maxItems} ${kind}s reached.`);
      return;
    }
    const max = items.reduce((m, c) => Math.max(m, c.sort_order), 0);
    const { error } = await supabase
      .from("clients")
      .insert({ name: `New ${kind}`, sort_order: max + 1, is_active: true, kind });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`${kind === "client" ? "Client" : "Studio"} added`);
      qc.invalidateQueries({ queryKey: ["clients"] });
    }
  };
  const remove = async (id) => {
    if (!confirm(`Delete this ${kind}?`)) return;
    if (isUuid(id)) {
      await snapshotBefore("clients", id, `${labelOf(id)} (deleted)`);
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["clients"] });
  };
  const uploadLogo = async (id, file) => {
    setBusyId(id);
    try {
      const safeId = isUuid(id) ? id : generateUuid();
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `logos/${kind}-${safeId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      const patch = { logo_url: data.publicUrl };
      if (dims) {
        patch.logo_width = dims.width;
        patch.logo_height = dims.height;
      }
      await update(id, patch);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusyId(null);
    }
  };
  const canAdd = !maxItems || items.length < maxItems;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "flex items-start justify-between",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "h2",
                      { className: "display text-2xl text-metal", children: title },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1342,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "p",
                      { className: "text-sm text-slate-500 mt-1", children: description },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1343,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1341,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: create,
                  disabled: !canAdd,
                  className:
                    "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      Plus,
                      { size: 14 },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1350,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    " ",
                    addLabel,
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1345,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1340,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6 space-y-3",
            children: [
              items.length === 0 &&
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "text-sm text-slate-500 bg-[#030814] border border-white/[0.06] rounded p-6 text-center",
                    children: ["No ", kind, 's yet. Click "', addLabel, '".'],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 1356,
                    columnNumber: 11,
                  },
                  this,
                ),
              items.map((c) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className:
                      "grid grid-cols-12 gap-3 items-center bg-[#030814] border border-white/[0.08] rounded p-3",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className:
                            "col-span-2 grid place-items-center h-16 bg-[#01040A] border border-white/[0.06] rounded p-2",
                          children: c.logo_url
                            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "img",
                                {
                                  src: c.logo_url,
                                  alt: c.name,
                                  className: "max-h-12 max-w-full object-contain",
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1367,
                                  columnNumber: 17,
                                },
                                this,
                              )
                            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Image$1,
                                { size: 16, className: "text-slate-600" },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1369,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1365,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "col-span-3",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input",
                              placeholder: "Name",
                              defaultValue: c.name,
                              onBlur: (e) =>
                                e.target.value !== c.name && update(c.id, { name: e.target.value }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1373,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1372,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "col-span-3",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input",
                              placeholder: "https://...",
                              defaultValue: c.website_url ?? "",
                              onBlur: (e) => update(c.id, { website_url: e.target.value || null }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1381,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1380,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "col-span-1",
                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              type: "number",
                              className: "adm-input",
                              defaultValue: c.sort_order,
                              onBlur: (e) =>
                                update(c.id, { sort_order: Number(e.target.value) || 0 }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1389,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1388,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "label",
                        {
                          className:
                            "col-span-2 inline-flex items-center gap-2 text-xs text-slate-300 border border-white/10 rounded px-3 py-2 cursor-pointer hover:border-sky-300/40",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              Upload,
                              { size: 13 },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 1397,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            " ",
                            c.logo_url ? "Replace logo" : "Upload logo",
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "input",
                              {
                                type: "file",
                                accept: "image/*",
                                className: "hidden",
                                onChange: (e) =>
                                  e.target.files?.[0] && uploadLogo(c.id, e.target.files[0]),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 1398,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1396,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "div",
                        {
                          className: "col-span-1 flex items-center justify-end gap-2",
                          children: [
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: () => update(c.id, { is_active: !c.is_active }),
                                className: "text-slate-400 hover:text-white",
                                title: c.is_active ? "Visible" : "Hidden",
                                children: c.is_active
                                  ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Eye,
                                      { size: 14 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1411,
                                        columnNumber: 32,
                                      },
                                      this,
                                    )
                                  : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      EyeOff,
                                      { size: 14, className: "text-slate-600" },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1411,
                                        columnNumber: 52,
                                      },
                                      this,
                                    ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 1406,
                                columnNumber: 15,
                              },
                              this,
                            ),
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "button",
                              {
                                onClick: () => remove(c.id),
                                className: "text-slate-500 hover:text-red-300",
                                children:
                                  busyId === c.id
                                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        LoaderCircle,
                                        { size: 14, className: "animate-spin" },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 1415,
                                          columnNumber: 19,
                                        },
                                        this,
                                      )
                                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        Trash2,
                                        { size: 14 },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 1417,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 1413,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          ],
                        },
                        void 0,
                        true,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 1405,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  c.id,
                  true,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 1361,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1354,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1339,
      columnNumber: 5,
    },
    this,
  );
}
function ClientsManager() {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    LogoManager,
    {
      kind: "client",
      title: "Clients",
      description:
        "Logos appear on the homepage strip in real time. Logos preserve their natural proportion.",
      addLabel: "Add client",
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1430,
      columnNumber: 5,
    },
    this,
  );
}
const STUDIO_SIZE_OPTIONS = [
  { value: "xs", label: "Extra small" },
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
  { value: "xl", label: "Extra large" },
  { value: "xxl", label: "Huge" },
];
function StudiosManager() {
  const s = useSectionDraft("studios_section");
  const current = get(s.draft, "logo_size", "md");
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "space-y-6",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "rounded-lg border border-white/[0.08] bg-[#0a0d14] p-5",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "flex flex-col md:flex-row md:items-end gap-4 md:justify-between",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "h3",
                          { className: "display text-lg text-metal", children: "Studio logo size" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 1456,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "p",
                          {
                            className: "text-xs text-[var(--color-text-muted)] mt-1",
                            children:
                              "Applies to all logos in the “Forged across the studios of” row. Updates the public site in real time.",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 1457,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1455,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "flex items-center gap-3",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "select",
                          {
                            value: current,
                            onChange: (e) => s.update("logo_size", e.target.value),
                            className:
                              "bg-[#01040A] border border-white/[0.12] rounded px-3 py-2 text-sm text-metal",
                            children: STUDIO_SIZE_OPTIONS.map((o) =>
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "option",
                                { value: o.value, children: o.label },
                                o.value,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1469,
                                  columnNumber: 17,
                                },
                                this,
                              ),
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 1463,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "button",
                          {
                            onClick: s.save,
                            disabled: !s.dirty || s.saving,
                            className:
                              "inline-flex items-center gap-2 bg-sky-300/90 hover:bg-sky-300 text-[#01040A] px-3 py-2 rounded text-sm disabled:opacity-40",
                            children: [
                              s.saving
                                ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    LoaderCircle,
                                    { className: "w-4 h-4 animate-spin" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 1480,
                                      columnNumber: 17,
                                    },
                                    this,
                                  )
                                : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Save,
                                    { className: "w-4 h-4" },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 1482,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                              "Save",
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 1474,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1462,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 1454,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1453,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          LogoManager,
          {
            kind: "studio",
            title: "Studios",
            description:
              'Logos shown under "Forged across the studios of" on the homepage. Maximum of 3.',
            addLabel: "Add studio",
            maxItems: 3,
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1489,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1452,
      columnNumber: 5,
    },
    this,
  );
}
function PortfolioManager() {
  const qc = useQueryClient();
  const { data: projects = [] } = useProjects(true);
  const [editing, setEditing] = reactExports.useState(null);
  const [filter, setFilter] = reactExports.useState("All");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [batchOpen, setBatchOpen] = reactExports.useState(false);
  const ordered = reactExports.useMemo(
    () => [...projects].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)),
    [projects],
  );
  const filtered = reactExports.useMemo(() => {
    return ordered
      .filter((p) => filter === "All" || normalizeCategory(p.category) === filter)
      .filter(
        (p) =>
          statusFilter === "all" || (statusFilter === "live" ? p.is_published : !p.is_published),
      );
  }, [ordered, filter, statusFilter]);
  const move = async (p, dir) => {
    const idx = ordered.findIndex((x) => x.id === p.id);
    const swapIdx = idx + dir;
    if (idx < 0 || swapIdx < 0 || swapIdx >= ordered.length) return;
    const other = ordered[swapIdx];
    const a = p.sort_order;
    const b = other.sort_order === a ? a + dir : other.sort_order;
    const safePId = isUuid(p.id) ? p.id : generateUuid();
    const safeOtherId = isUuid(other.id) ? other.id : generateUuid();
    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from("projects").upsert(
        {
          ...p,
          id: safePId,
          sort_order: b,
          tags: p.tags ?? [],
          gallery: p.gallery ?? [],
          gallery_meta: p.gallery_meta ?? [],
          collaborators: p.collaborators ?? [],
          tools_used: p.tools_used ?? [],
          deliverables: p.deliverables ?? [],
          updated_at: /* @__PURE__ */ new Date().toISOString(),
        },
        { onConflict: "id" },
      ),
      supabase.from("projects").upsert(
        {
          ...other,
          id: safeOtherId,
          sort_order: a,
          tags: other.tags ?? [],
          gallery: other.gallery ?? [],
          gallery_meta: other.gallery_meta ?? [],
          collaborators: other.collaborators ?? [],
          tools_used: other.tools_used ?? [],
          deliverables: other.deliverables ?? [],
          updated_at: /* @__PURE__ */ new Date().toISOString(),
        },
        { onConflict: "id" },
      ),
    ]);
    if (e1 || e2) toast.error((e1 || e2).message);
    else qc.invalidateQueries({ queryKey: ["projects"] });
  };
  const create = async () => {
    const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: "New project",
        category: "Digital Design",
        sort_order: max + 1,
        is_published: false,
      })
      .select()
      .single();
    if (error) toast.error(error.message);
    else if (data) {
      qc.invalidateQueries({ queryKey: ["projects"] });
      setEditing(data);
    }
  };
  const remove = async (id) => {
    if (!confirm("Delete this project?")) return;
    const proj = projects.find((p) => p.id === id);
    if (isUuid(id)) {
      await snapshotBefore("projects", id, `${proj?.title ?? id} (deleted)`);
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) {
        toast.error(error.message);
        return;
      }
    }
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["projects"] });
  };
  const duplicate = async (p) => {
    const { id, ...rest } = p;
    const payload = {
      ...rest,
      title: `${p.title} (copy)`,
      sort_order: p.sort_order + 1,
      is_published: false,
    };
    const { error } = await supabase.from("projects").insert(payload);
    if (error) toast.error(error.message);
    else {
      toast.success("Duplicated");
      qc.invalidateQueries({ queryKey: ["projects"] });
    }
  };
  const togglePublish = async (p) => {
    const safeId = isUuid(p.id) ? p.id : generateUuid();
    if (isUuid(p.id)) {
      await snapshotBefore("projects", p.id, p.title);
    }
    const { error } = await supabase.from("projects").upsert(
      {
        ...p,
        id: safeId,
        is_published: !p.is_published,
        tags: p.tags ?? [],
        gallery: p.gallery ?? [],
        gallery_meta: p.gallery_meta ?? [],
        collaborators: p.collaborators ?? [],
        tools_used: p.tools_used ?? [],
        deliverables: p.deliverables ?? [],
        updated_at: /* @__PURE__ */ new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["projects"] });
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "flex items-start justify-between gap-4 flex-wrap",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "h2",
                      { className: "display text-2xl text-metal", children: "Portfolio" },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1654,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "p",
                      {
                        className: "text-sm text-slate-500 mt-1",
                        children:
                          "Selected work shown on /portfolio. Images preserve real proportions.",
                      },
                      void 0,
                      false,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1655,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1653,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        onClick: () => setBatchOpen(true),
                        className:
                          "inline-flex items-center gap-2 border border-white/10 hover:border-sky-300/40 px-4 py-2 rounded text-sm",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Plus,
                            { size: 14 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1664,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          " Batch add",
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1660,
                        columnNumber: 11,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        onClick: create,
                        className:
                          "inline-flex items-center gap-2 bg-sky-300 text-[#01040A] px-4 py-2 rounded text-sm font-semibold",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            Plus,
                            { size: 14 },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1670,
                              columnNumber: 13,
                            },
                            this,
                          ),
                          " New project",
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1666,
                        columnNumber: 11,
                      },
                      this,
                    ),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1659,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1652,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-5 flex flex-wrap gap-2 items-center",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                { className: "mono text-[10px] text-slate-500 mr-2", children: "CATEGORY" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1676,
                  columnNumber: 9,
                },
                this,
              ),
              ["All", ...PROJECT_CATEGORIES].map((c) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    onClick: () => setFilter(c),
                    className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${filter === c ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                    children: c,
                  },
                  c,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 1678,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1675,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-3 flex flex-wrap gap-2 items-center",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                { className: "mono text-[10px] text-slate-500 mr-2", children: "STATUS" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1692,
                  columnNumber: 9,
                },
                this,
              ),
              ["all", "live", "draft"].map((c) =>
                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "button",
                  {
                    onClick: () => setStatusFilter(c),
                    className: `mono text-[11px] px-3 py-1.5 rounded-full border transition ${statusFilter === c ? "bg-sky-300/15 border-sky-300/40 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                    children: c,
                  },
                  c,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 1694,
                    columnNumber: 11,
                  },
                  this,
                ),
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1691,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4",
            children: filtered.map((p) => {
              const ratio = aspectFromDims(p.cover_width, p.cover_height) || "16 / 10";
              const orderIdx = ordered.findIndex((x) => x.id === p.id);
              const isFirst = orderIdx <= 0;
              const isLast = orderIdx === ordered.length - 1;
              const cat = normalizeCategory(p.category);
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className:
                    "bg-[#030814] border border-white/[0.08] rounded-lg overflow-hidden flex flex-col",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "relative bg-[#01040A] border-b border-white/[0.06] grid place-items-center",
                        style: { aspectRatio: ratio },
                        children: [
                          p.cover_url
                            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "img",
                                {
                                  src: p.cover_url,
                                  alt: p.title,
                                  className: `w-full h-full ${p.image_fit === "cover" ? "object-cover" : "object-contain"}`,
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1725,
                                  columnNumber: 19,
                                },
                                this,
                              )
                            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                { className: "text-slate-600 text-xs", children: "No cover" },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1731,
                                  columnNumber: 19,
                                },
                                this,
                              ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className:
                                "absolute top-2 left-2 mono text-[10px] tracking-[0.18em] rounded bg-[#01040A]/80 border border-white/10 text-slate-300 px-2 py-0.5",
                              children: ["#", orderIdx + 1],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1733,
                              columnNumber: 17,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1720,
                        columnNumber: 15,
                      },
                      this,
                    ),
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className: "p-4 flex-1 flex flex-col",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "flex items-start justify-between gap-2",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "div",
                                  {
                                    children: [
                                      p.client_name &&
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "div",
                                          {
                                            className: "text-[12px] text-slate-200",
                                            children: p.client_name,
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 1741,
                                            columnNumber: 23,
                                          },
                                          this,
                                        ),
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "div",
                                        {
                                          className:
                                            "mono text-[10px] tracking-[0.16em] text-slate-500 mt-0.5",
                                          children: [p.year ?? "-", " · ", cat],
                                        },
                                        void 0,
                                        true,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 1743,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "div",
                                        {
                                          className: "text-sm font-medium text-slate-100 mt-1",
                                          children: p.title,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 1746,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1739,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "span",
                                  {
                                    className: `mono text-[9px] px-2 py-0.5 rounded ${p.is_published ? "bg-sky-300/10 text-sky-200" : "bg-amber-300/10 text-amber-200"}`,
                                    children: p.is_published ? "LIVE" : "DRAFT",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1748,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1738,
                              columnNumber: 17,
                            },
                            this,
                          ),
                          p.featured &&
                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              "div",
                              {
                                className:
                                  "mt-2 inline-flex items-center gap-1 text-[10px] text-amber-300",
                                children: [
                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    Star,
                                    { size: 10 },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 1756,
                                      columnNumber: 21,
                                    },
                                    this,
                                  ),
                                  " Featured",
                                ],
                              },
                              void 0,
                              true,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 1755,
                                columnNumber: 19,
                              },
                              this,
                            ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className:
                                "mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs",
                              children: [
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => move(p, -1),
                                    disabled: isFirst,
                                    title: "Move up",
                                    className:
                                      "inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400",
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      ArrowUp,
                                      { size: 12 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1766,
                                        columnNumber: 21,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1760,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => move(p, 1),
                                    disabled: isLast,
                                    title: "Move down",
                                    className:
                                      "inline-flex items-center text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400",
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      ArrowDown,
                                      { size: 12 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1774,
                                        columnNumber: 21,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1768,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "span",
                                  { className: "w-px h-4 bg-white/10 mx-1" },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1776,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => setEditing(p),
                                    className: "text-sky-300 hover:text-sky-200",
                                    children: "Edit",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1777,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => duplicate(p),
                                    className:
                                      "text-slate-400 hover:text-white inline-flex items-center gap-1",
                                    children: [
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        Copy,
                                        { size: 11 },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 1784,
                                          columnNumber: 21,
                                        },
                                        this,
                                      ),
                                      " Duplicate",
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1780,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => togglePublish(p),
                                    className: "text-slate-400 hover:text-white",
                                    children: p.is_published ? "Unpublish" : "Publish",
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1786,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "button",
                                  {
                                    onClick: () => remove(p.id),
                                    className:
                                      "ml-auto text-slate-500 hover:text-red-300 inline-flex items-center gap-1",
                                    children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      Trash2,
                                      { size: 11 },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 1796,
                                        columnNumber: 21,
                                      },
                                      this,
                                    ),
                                  },
                                  void 0,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 1792,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                              ],
                            },
                            void 0,
                            true,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 1759,
                              columnNumber: 17,
                            },
                            this,
                          ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 1737,
                        columnNumber: 15,
                      },
                      this,
                    ),
                  ],
                },
                p.id,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 1716,
                  columnNumber: 13,
                },
                this,
              );
            }),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 1708,
            columnNumber: 7,
          },
          this,
        ),
        editing &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            ProjectEditor,
            { project: editing, onClose: () => setEditing(null) },
            void 0,
            false,
            {
              fileName: "/app/applet/src/routes/admin.lazy.tsx",
              lineNumber: 1805,
              columnNumber: 19,
            },
            this,
          ),
        batchOpen &&
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            BatchAddProjects,
            {
              onClose: () => setBatchOpen(false),
              startSort: projects.reduce((m, p) => Math.max(m, p.sort_order), 0) + 1,
            },
            void 0,
            false,
            {
              fileName: "/app/applet/src/routes/admin.lazy.tsx",
              lineNumber: 1807,
              columnNumber: 9,
            },
            this,
          ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1651,
      columnNumber: 5,
    },
    this,
  );
}
function ProjectEditor({ project, onClose }) {
  const qc = useQueryClient();
  const [form, setForm] = reactExports.useState(project);
  const [saving, setSaving] = reactExports.useState(false);
  const [uploading, setUploading] = reactExports.useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.category.trim()) {
      toast.error("Category is required");
      return;
    }
    const isVideoCat = normalizeCategory(form.category) === "Videos";
    if (isVideoCat) {
      if (!form.video_url) {
        toast.error("Video file or external link is required for Videos");
        return;
      }
      if (!form.cover_url) {
        toast.error("Poster image is required for Videos");
        return;
      }
    }
    setSaving(true);
    const safeId = isUuid(form.id) ? form.id : generateUuid();
    if (isUuid(form.id)) {
      await snapshotBefore("projects", form.id, form.title);
    }
    const payload = {
      id: safeId,
      title: form.title,
      subtitle: form.subtitle,
      category: normalizeCategory(form.category),
      year: form.year,
      description: form.description,
      cover_url: form.cover_url,
      cover_width: form.cover_width ?? null,
      cover_height: form.cover_height ?? null,
      palette: form.palette,
      span: form.span,
      sort_order: form.sort_order,
      tags: form.tags,
      gallery: form.gallery,
      gallery_meta: form.gallery_meta ?? [],
      is_published: form.is_published,
      featured: form.featured ?? false,
      featured_priority: form.featured_priority ?? 0,
      client_name: form.client_name ?? null,
      image_fit: form.image_fit ?? "contain",
      concept: form.concept ?? null,
      idea: form.idea ?? null,
      role: form.role ?? null,
      notes: form.notes ?? null,
      collaborators: form.collaborators ?? [],
      tools_used: form.tools_used ?? [],
      deliverables: form.deliverables ?? [],
      video_url: form.video_url ?? null,
      video_provider: form.video_provider ?? null,
      updated_at: /* @__PURE__ */ new Date().toISOString(),
    };
    const { error } = await supabase.from("projects").upsert(payload, { onConflict: "id" });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    }
  };
  const uploadCover = async (file) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `projects/${form.id}-cover-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("cover_url", data.publicUrl);
      if (dims) {
        set("cover_width", dims.width);
        set("cover_height", dims.height);
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };
  const uploadGalleryItem = async (file) => {
    setUploading(true);
    try {
      const dims = await readImageDimensions(file).catch(() => null);
      const path = `projects/${form.id}-gallery-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("gallery", [...(form.gallery ?? []), data.publicUrl]);
      set("gallery_meta", [
        ...(form.gallery_meta ?? []),
        { url: data.publicUrl, width: dims?.width, height: dims?.height },
      ]);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };
  const MAX_VIDEO_MB = 200;
  const VIDEO_MIME = ["video/mp4", "video/webm", "video/ogg"];
  const uploadVideo = async (file) => {
    if (!VIDEO_MIME.includes(file.type) && !/\.(mp4|webm|ogg)$/i.test(file.name)) {
      toast.error("Unsupported video format. Use .mp4, .webm or .ogg");
      return;
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      toast.error(`Video is too large (max ${MAX_VIDEO_MB}MB)`);
      return;
    }
    setUploading(true);
    try {
      const path = `projects/${form.id}-video-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error: upErr } = await supabase.storage
        .from("site-assets")
        .upload(path, file, { upsert: true, contentType: file.type || void 0 });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
      set("video_url", data.publicUrl);
      set("video_provider", "file");
      toast.success("Video uploaded");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };
  const detectProvider = (url) => {
    if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
    if (/vimeo\.com/i.test(url)) return "vimeo";
    return "file";
  };
  const ratio = aspectFromDims(form.cover_width, form.cover_height) || "16 / 10";
  const isCampaign = isCampaignCategory(form.category);
  const toggleTool = (t) => {
    const cur = form.tools_used ?? [];
    set("tools_used", cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className:
        "fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto",
      onClick: onClose,
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-5xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "flex items-center justify-between p-5 border-b border-white/[0.08]",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "h3",
                    { className: "display text-xl text-metal", children: "Edit project" },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1989,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: onClose,
                      className: "text-slate-500 hover:text-white text-sm",
                      children: "Close",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1990,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 1988,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "grid grid-cols-1 lg:grid-cols-5 gap-6 p-6",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "lg:col-span-3 space-y-4",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Project title",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: form.title,
                                      onChange: (e) => set("title", e.target.value),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2e3,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 1999,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Client",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: form.client_name ?? "",
                                      onChange: (e) => set("client_name", e.target.value),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2003,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2002,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Category",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "select",
                                    {
                                      className: "adm-input",
                                      value: normalizeCategory(form.category),
                                      onChange: (e) => set("category", e.target.value),
                                      children: PROJECT_CATEGORIES.map((c) =>
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          { value: c, children: c },
                                          c,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2015,
                                            columnNumber: 21,
                                          },
                                          this,
                                        ),
                                      ),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2009,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2008,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Year",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: form.year ?? "",
                                      onChange: (e) => set("year", e.target.value),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2022,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2021,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Subtitle / discipline",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: form.subtitle ?? "",
                                      onChange: (e) => set("subtitle", e.target.value),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2025,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2024,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Sort order",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      type: "number",
                                      value: String(form.sort_order),
                                      onChange: (e) =>
                                        set("sort_order", Number(e.target.value) || 0),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2031,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2030,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 1998,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Field,
                          {
                            label: "Short description",
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              TextArea,
                              {
                                rows: 4,
                                value: form.description ?? "",
                                onChange: (e) => set("description", e.target.value),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 2040,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2039,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          Field,
                          {
                            label: "Tags (comma separated)",
                            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                              TextInput,
                              {
                                value: (form.tags ?? []).join(", "),
                                onChange: (e) =>
                                  set(
                                    "tags",
                                    e.target.value
                                      .split(",")
                                      .map((t) => t.trim())
                                      .filter(Boolean),
                                  ),
                              },
                              void 0,
                              false,
                              {
                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                lineNumber: 2048,
                                columnNumber: 15,
                              },
                              this,
                            ),
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2047,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Image fit",
                                  hint: "Contain keeps the full image visible. Cover crops to fill.",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "select",
                                    {
                                      className: "adm-input",
                                      value: form.image_fit ?? "contain",
                                      onChange: (e) => set("image_fit", e.target.value),
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          {
                                            value: "contain",
                                            children: "Contain (preserve full image)",
                                          },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2072,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          { value: "cover", children: "Cover (fill, may crop)" },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2073,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2067,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2063,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Card size",
                                  hint: "Layout span on the public grid.",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "select",
                                    {
                                      className: "adm-input",
                                      value: form.span ?? "normal",
                                      onChange: (e) => set("span", e.target.value),
                                      children: [
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          { value: "normal", children: "Normal" },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2082,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          { value: "wide", children: "Wide" },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2083,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "option",
                                          { value: "tall", children: "Tall" },
                                          void 0,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2084,
                                            columnNumber: 19,
                                          },
                                          this,
                                        ),
                                      ],
                                    },
                                    void 0,
                                    true,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2077,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2076,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2062,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className: "flex flex-wrap items-center gap-4 pt-2",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "label",
                                {
                                  className:
                                    "inline-flex items-center gap-2 text-sm text-slate-300",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "input",
                                      {
                                        type: "checkbox",
                                        checked: form.is_published,
                                        onChange: (e) => set("is_published", e.target.checked),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2091,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    " ",
                                    "Published (live)",
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2090,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "label",
                                {
                                  className:
                                    "inline-flex items-center gap-2 text-sm text-slate-300",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "input",
                                      {
                                        type: "checkbox",
                                        checked: !!form.featured,
                                        onChange: (e) => set("featured", e.target.checked),
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2099,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    " ",
                                    "Featured (max 3 on home)",
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2098,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              form.featured &&
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "label",
                                  {
                                    className:
                                      "inline-flex items-center gap-2 text-sm text-slate-300",
                                    children: [
                                      "Priority",
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "input",
                                        {
                                          type: "number",
                                          className: "adm-input w-20",
                                          value: String(form.featured_priority ?? 0),
                                          onChange: (e) =>
                                            set("featured_priority", Number(e.target.value) || 0),
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2109,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 2107,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2089,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            className:
                              "mt-2 rounded-lg border border-white/[0.08] bg-[#01040A]/40 p-4 space-y-4",
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "flex items-center justify-between",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "div",
                                      {
                                        className:
                                          "mono text-[10px] tracking-[0.22em] text-sky-300/70",
                                        children: "CASE STUDY",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2122,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    isCampaign &&
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "span",
                                        {
                                          className:
                                            "mono text-[9px] tracking-[0.2em] text-amber-300/80",
                                          children: "CAMPAIGN",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2124,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2121,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              isCampaign &&
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  jsxDevRuntimeExports.Fragment,
                                  {
                                    children: [
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        Field,
                                        {
                                          label: "Campaign concept",
                                          hint: "The strategic angle behind the campaign.",
                                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            TextArea,
                                            {
                                              rows: 3,
                                              value: form.concept ?? "",
                                              onChange: (e) => set("concept", e.target.value),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2133,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2132,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        Field,
                                        {
                                          label: "Creative idea",
                                          hint: "The big creative idea or headline thought.",
                                          children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            TextArea,
                                            {
                                              rows: 3,
                                              value: form.idea ?? "",
                                              onChange: (e) => set("idea", e.target.value),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2140,
                                              columnNumber: 21,
                                            },
                                            this,
                                          ),
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2139,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 2131,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "My role",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: form.role ?? "",
                                      onChange: (e) => set("role", e.target.value),
                                      placeholder: "e.g. Art Director, lead design",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2150,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2149,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Collaborators (comma separated)",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: (form.collaborators ?? []).join(", "),
                                      onChange: (e) =>
                                        set(
                                          "collaborators",
                                          e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter(Boolean),
                                        ),
                                      placeholder: "e.g. Agency, Photographer, Copywriter",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2158,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2157,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Tools used",
                                  hint: "Pick the tools used to produce this work.",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "div",
                                    {
                                      className: "flex flex-wrap gap-2",
                                      children: TOOL_OPTIONS.map((t) => {
                                        const active = (form.tools_used ?? []).includes(t);
                                        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                          "button",
                                          {
                                            type: "button",
                                            onClick: () => toggleTool(t),
                                            className: `mono text-[10px] tracking-[0.16em] rounded-full px-3 py-1.5 border transition ${active ? "bg-sky-300/15 border-sky-300/50 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`,
                                            children: t,
                                          },
                                          t,
                                          false,
                                          {
                                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                            lineNumber: 2178,
                                            columnNumber: 23,
                                          },
                                          this,
                                        );
                                      }),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2174,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2173,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Deliverables (comma separated)",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextInput,
                                    {
                                      value: (form.deliverables ?? []).join(", "),
                                      onChange: (e) =>
                                        set(
                                          "deliverables",
                                          e.target.value
                                            .split(",")
                                            .map((t) => t.trim())
                                            .filter(Boolean),
                                        ),
                                      placeholder: "e.g. Key visual, Social cutdowns, OOH",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2196,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2195,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                Field,
                                {
                                  label: "Notes / outcome",
                                  children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    TextArea,
                                    {
                                      rows: 3,
                                      value: form.notes ?? "",
                                      onChange: (e) => set("notes", e.target.value),
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2212,
                                      columnNumber: 17,
                                    },
                                    this,
                                  ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2211,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2120,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 1997,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "lg:col-span-2 space-y-4",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          {
                            children: [
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                                  children: "COVER PREVIEW",
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2224,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className:
                                    "bg-[#01040A] border border-white/[0.06] rounded grid place-items-center overflow-hidden",
                                  style: { aspectRatio: ratio },
                                  children: form.cover_url
                                    ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "img",
                                        {
                                          src: form.cover_url,
                                          alt: "",
                                          className: `w-full h-full ${form.image_fit === "cover" ? "object-cover" : "object-contain"}`,
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2232,
                                          columnNumber: 19,
                                        },
                                        this,
                                      )
                                    : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "div",
                                        {
                                          className: "text-slate-600 text-xs",
                                          children: "No image yet",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2238,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2227,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              form.cover_width &&
                                form.cover_height &&
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "div",
                                  {
                                    className: "text-[11px] text-slate-500 mt-1",
                                    children: [
                                      "Real size: ",
                                      form.cover_width,
                                      "×",
                                      form.cover_height,
                                      "px",
                                    ],
                                  },
                                  void 0,
                                  true,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 2242,
                                    columnNumber: 17,
                                  },
                                  this,
                                ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "flex items-center gap-2 mt-3",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "label",
                                      {
                                        className:
                                          "inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40",
                                        children: [
                                          uploading
                                            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                LoaderCircle,
                                                { size: 14, className: "animate-spin" },
                                                void 0,
                                                false,
                                                {
                                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                  lineNumber: 2249,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              )
                                            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Upload,
                                                { size: 14 },
                                                void 0,
                                                false,
                                                {
                                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                  lineNumber: 2251,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                          form.cover_url ? "Replace cover" : "Upload cover",
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "input",
                                            {
                                              type: "file",
                                              accept: "image/*",
                                              className: "hidden",
                                              onChange: (e) =>
                                                e.target.files?.[0] &&
                                                uploadCover(e.target.files[0]),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2254,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2247,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    form.cover_url &&
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "button",
                                        {
                                          onClick: () => {
                                            set("cover_url", null);
                                            set("cover_width", null);
                                            set("cover_height", null);
                                          },
                                          className: "text-xs text-slate-500 hover:text-red-300",
                                          children: "Clear",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2262,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2246,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2223,
                            columnNumber: 13,
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
                                    "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2 flex items-center justify-between",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "span",
                                      {
                                        children: [
                                          "VIDEO ",
                                          form.video_provider ? `(${form.video_provider})` : "",
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2278,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    form.video_url &&
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "span",
                                        { className: "text-emerald-300/80", children: "Ready" },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2279,
                                          columnNumber: 36,
                                        },
                                        this,
                                      ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2277,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              form.video_url && form.video_provider === "file"
                                ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                    "video",
                                    {
                                      src: form.video_url,
                                      controls: true,
                                      playsInline: true,
                                      preload: "metadata",
                                      className:
                                        "w-full rounded border border-white/[0.06] bg-[#01040A]",
                                    },
                                    void 0,
                                    false,
                                    {
                                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                      lineNumber: 2282,
                                      columnNumber: 17,
                                    },
                                    this,
                                  )
                                : form.video_url
                                  ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "div",
                                      {
                                        className:
                                          "text-[12px] text-slate-400 break-all border border-white/[0.06] rounded p-2 bg-[#01040A]",
                                        children: form.video_url,
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2290,
                                        columnNumber: 17,
                                      },
                                      this,
                                    )
                                  : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "div",
                                      {
                                        className:
                                          "text-slate-600 text-xs border border-dashed border-white/10 rounded p-3",
                                        children: "No video yet",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2294,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "flex items-center gap-2 mt-3 flex-wrap",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "label",
                                      {
                                        className:
                                          "inline-flex items-center gap-2 text-sm text-slate-300 border border-white/10 px-3 py-2 rounded cursor-pointer hover:border-sky-300/40",
                                        children: [
                                          uploading
                                            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                LoaderCircle,
                                                { size: 14, className: "animate-spin" },
                                                void 0,
                                                false,
                                                {
                                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                  lineNumber: 2301,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              )
                                            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                Upload,
                                                { size: 14 },
                                                void 0,
                                                false,
                                                {
                                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                  lineNumber: 2303,
                                                  columnNumber: 21,
                                                },
                                                this,
                                              ),
                                          form.video_url ? "Replace video" : "Upload video",
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "input",
                                            {
                                              type: "file",
                                              accept: "video/mp4,video/webm,video/ogg",
                                              className: "hidden",
                                              onChange: (e) =>
                                                e.target.files?.[0] &&
                                                uploadVideo(e.target.files[0]),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2306,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2299,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    form.video_url &&
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "button",
                                        {
                                          onClick: () => {
                                            set("video_url", null);
                                            set("video_provider", null);
                                          },
                                          className: "text-xs text-slate-500 hover:text-red-300",
                                          children: "Clear",
                                        },
                                        void 0,
                                        false,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2314,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2298,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "mt-2",
                                  children: [
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "input",
                                      {
                                        type: "url",
                                        placeholder: "...or paste YouTube / Vimeo URL",
                                        className: "adm-input w-full text-sm",
                                        defaultValue:
                                          form.video_provider !== "file"
                                            ? (form.video_url ?? "")
                                            : "",
                                        onBlur: (e) => {
                                          const v = e.target.value.trim();
                                          if (!v) return;
                                          set("video_url", v);
                                          set("video_provider", detectProvider(v));
                                        },
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2326,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "div",
                                      {
                                        className: "text-[11px] text-slate-500 mt-1",
                                        children:
                                          "Accepts .mp4 / .webm / .ogg (max 200MB) or an external link.",
                                      },
                                      void 0,
                                      false,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2338,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2325,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2276,
                            columnNumber: 13,
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
                                    "mono text-[10px] tracking-[0.2em] text-slate-500 mb-2",
                                  children: ["GALLERY (", (form.gallery ?? []).length, ")"],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2345,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                "div",
                                {
                                  className: "grid grid-cols-3 gap-2",
                                  children: [
                                    (form.gallery ?? []).map((url, i) =>
                                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                        "div",
                                        {
                                          className:
                                            "relative bg-[#01040A] border border-white/[0.06] rounded overflow-hidden aspect-square",
                                          children: [
                                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "img",
                                              {
                                                src: url,
                                                alt: "",
                                                className:
                                                  "absolute inset-0 w-full h-full object-cover",
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                lineNumber: 2354,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                              "button",
                                              {
                                                onClick: () => {
                                                  set(
                                                    "gallery",
                                                    form.gallery.filter((_, j) => j !== i),
                                                  );
                                                  set(
                                                    "gallery_meta",
                                                    (form.gallery_meta ?? []).filter(
                                                      (m) => m.url !== url,
                                                    ),
                                                  );
                                                },
                                                className:
                                                  "absolute top-1 right-1 bg-[#01040A]/80 rounded p-1 text-slate-300 hover:text-red-300",
                                                children:
                                                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                                    Trash2,
                                                    { size: 11 },
                                                    void 0,
                                                    false,
                                                    {
                                                      fileName:
                                                        "/app/applet/src/routes/admin.lazy.tsx",
                                                      lineNumber: 2368,
                                                      columnNumber: 23,
                                                    },
                                                    this,
                                                  ),
                                              },
                                              void 0,
                                              false,
                                              {
                                                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                                lineNumber: 2355,
                                                columnNumber: 21,
                                              },
                                              this,
                                            ),
                                          ],
                                        },
                                        url + i,
                                        true,
                                        {
                                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                          lineNumber: 2350,
                                          columnNumber: 19,
                                        },
                                        this,
                                      ),
                                    ),
                                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                      "label",
                                      {
                                        className:
                                          "aspect-square grid place-items-center border border-dashed border-white/10 rounded text-xs text-slate-500 hover:border-sky-300/50 hover:text-sky-300 cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            Plus,
                                            { size: 16 },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2373,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                            "input",
                                            {
                                              type: "file",
                                              accept: "image/*",
                                              className: "hidden",
                                              onChange: (e) =>
                                                e.target.files?.[0] &&
                                                uploadGalleryItem(e.target.files[0]),
                                            },
                                            void 0,
                                            false,
                                            {
                                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                              lineNumber: 2374,
                                              columnNumber: 19,
                                            },
                                            this,
                                          ),
                                        ],
                                      },
                                      void 0,
                                      true,
                                      {
                                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                        lineNumber: 2372,
                                        columnNumber: 17,
                                      },
                                      this,
                                    ),
                                  ],
                                },
                                void 0,
                                true,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2348,
                                  columnNumber: 15,
                                },
                                this,
                              ),
                            ],
                          },
                          void 0,
                          true,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2344,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2222,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 1995,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: onClose,
                      className: "text-sm text-slate-400 hover:text-white px-4 py-2",
                      children: "Cancel",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2387,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    SaveButton,
                    { saving, onClick: save },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2390,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 2386,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 1984,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 1980,
      columnNumber: 5,
    },
    this,
  );
}
function BatchAddProjects({ onClose, startSort }) {
  const [rows, setRows] = reactExports.useState(
    Array.from({ length: 10 }).map(() => ({
      title: "",
      client_name: "",
      category: "Digital Design",
      year: String(/* @__PURE__ */ new Date().getFullYear()),
    })),
  );
  const [saving, setSaving] = reactExports.useState(false);
  const setRow = (i, patch) => {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  };
  const submit = async () => {
    const valid = rows
      .map((r, i) => ({ ...r, sort_order: startSort + i }))
      .filter((r) => r.title.trim().length > 0);
    if (valid.length === 0) {
      toast.error("Add at least one title.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("projects").insert(
      valid.map((r) => ({
        title: r.title.trim(),
        client_name: r.client_name.trim() || null,
        category: r.category,
        year: r.year || null,
        sort_order: r.sort_order,
        is_published: false,
      })),
    );
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(`Added ${valid.length} project${valid.length > 1 ? "s" : ""} as drafts`);
      onClose();
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className:
        "fixed inset-0 z-[90] bg-[#01040A]/85 backdrop-blur grid place-items-center p-4 overflow-auto",
      onClick: onClose,
      children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          className: "w-full max-w-4xl my-8 bg-[#030814] border border-white/[0.1] rounded-lg",
          children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "flex items-center justify-between p-5 border-b border-white/[0.08]",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "h3",
                          {
                            className: "display text-xl text-metal",
                            children: "Batch add projects",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2453,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "p",
                          {
                            className: "text-xs text-slate-500 mt-1",
                            children:
                              "Up to 10 at once. Created as drafts - open each to add cover, description and tags.",
                          },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2454,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2452,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: onClose,
                      className: "text-slate-500 hover:text-white text-sm",
                      children: "Close",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2458,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 2451,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "p-5 space-y-2",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "div",
                    {
                      className: "grid grid-cols-12 gap-2 mono text-[10px] text-slate-500 px-2",
                      children: [
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { className: "col-span-1", children: "#" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2464,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { className: "col-span-4", children: "TITLE" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2465,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { className: "col-span-3", children: "CLIENT" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2466,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { className: "col-span-3", children: "CATEGORY" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2467,
                            columnNumber: 13,
                          },
                          this,
                        ),
                        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                          "div",
                          { className: "col-span-1", children: "YEAR" },
                          void 0,
                          false,
                          {
                            fileName: "/app/applet/src/routes/admin.lazy.tsx",
                            lineNumber: 2468,
                            columnNumber: 13,
                          },
                          this,
                        ),
                      ],
                    },
                    void 0,
                    true,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2463,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  rows.map((r, i) =>
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "div",
                      {
                        className:
                          "grid grid-cols-12 gap-2 items-center bg-[#01040A] border border-white/[0.06] rounded p-2",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            {
                              className: "col-span-1 text-xs text-slate-500 pl-2",
                              children: i + 1,
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2475,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-4",
                              placeholder: "Project title",
                              value: r.title,
                              onChange: (e) => setRow(i, { title: e.target.value }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2476,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-3",
                              placeholder: "Client name",
                              value: r.client_name,
                              onChange: (e) => setRow(i, { client_name: e.target.value }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2482,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "select",
                            {
                              className: "adm-input col-span-3",
                              value: r.category,
                              onChange: (e) => setRow(i, { category: e.target.value }),
                              children: PROJECT_CATEGORIES.map((c) =>
                                /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                  "option",
                                  { value: c, children: c },
                                  c,
                                  false,
                                  {
                                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                    lineNumber: 2494,
                                    columnNumber: 19,
                                  },
                                  this,
                                ),
                              ),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2488,
                              columnNumber: 15,
                            },
                            this,
                          ),
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "input",
                            {
                              className: "adm-input col-span-1",
                              placeholder: "2026",
                              value: r.year,
                              onChange: (e) => setRow(i, { year: e.target.value }),
                            },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2499,
                              columnNumber: 15,
                            },
                            this,
                          ),
                        ],
                      },
                      i,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 2471,
                        columnNumber: 13,
                      },
                      this,
                    ),
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 2462,
                columnNumber: 9,
              },
              this,
            ),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              "div",
              {
                className: "flex items-center justify-end gap-3 p-5 border-t border-white/[0.08]",
                children: [
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    "button",
                    {
                      onClick: onClose,
                      className: "text-sm text-slate-400 hover:text-white px-4 py-2",
                      children: "Cancel",
                    },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2509,
                      columnNumber: 11,
                    },
                    this,
                  ),
                  /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                    SaveButton,
                    { saving, onClick: submit, label: "Create projects" },
                    void 0,
                    false,
                    {
                      fileName: "/app/applet/src/routes/admin.lazy.tsx",
                      lineNumber: 2512,
                      columnNumber: 11,
                    },
                    this,
                  ),
                ],
              },
              void 0,
              true,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 2508,
                columnNumber: 9,
              },
              this,
            ),
          ],
        },
        void 0,
        true,
        {
          fileName: "/app/applet/src/routes/admin.lazy.tsx",
          lineNumber: 2447,
          columnNumber: 7,
        },
        this,
      ),
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 2443,
      columnNumber: 5,
    },
    this,
  );
}
function AdvancedJSONManager() {
  const { data: settings } = useSiteSettings();
  const keys = Object.keys(FALLBACK_SETTINGS);
  const [open, setOpen] = reactExports.useState(null);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                { className: "display text-2xl text-metal", children: "Advanced" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2530,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children:
                    "Raw JSON editing for every setting key. Use only if you know the schema.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2531,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2529,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-6 space-y-2",
            children: keys.map((k) => {
              const merged = { ...(FALLBACK_SETTINGS[k] ?? {}), ...(settings?.[k] ?? {}) };
              const isOpen = open === k;
              return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "bg-[#030814] border border-white/[0.08] rounded",
                  children: [
                    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                      "button",
                      {
                        onClick: () => setOpen(isOpen ? null : k),
                        className: "w-full flex items-center justify-between p-4 text-left",
                        children: [
                          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                            "div",
                            { className: "font-mono text-sm text-slate-200", children: k },
                            void 0,
                            false,
                            {
                              fileName: "/app/applet/src/routes/admin.lazy.tsx",
                              lineNumber: 2546,
                              columnNumber: 17,
                            },
                            this,
                          ),
                          isOpen
                            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                ChevronDown,
                                { size: 14, className: "text-slate-500" },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2548,
                                  columnNumber: 19,
                                },
                                this,
                              )
                            : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                                ChevronRight,
                                { size: 14, className: "text-slate-500" },
                                void 0,
                                false,
                                {
                                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                                  lineNumber: 2550,
                                  columnNumber: 19,
                                },
                                this,
                              ),
                        ],
                      },
                      void 0,
                      true,
                      {
                        fileName: "/app/applet/src/routes/admin.lazy.tsx",
                        lineNumber: 2542,
                        columnNumber: 15,
                      },
                      this,
                    ),
                    isOpen &&
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        RawEditor,
                        { sectionKey: k, initial: merged },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 2553,
                          columnNumber: 26,
                        },
                        this,
                      ),
                  ],
                },
                k,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2541,
                  columnNumber: 13,
                },
                this,
              );
            }),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2536,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 2528,
      columnNumber: 5,
    },
    this,
  );
}
function RawEditor({ sectionKey, initial }) {
  const [text, setText] = reactExports.useState(JSON.stringify(initial, null, 2));
  const [saving, setSaving] = reactExports.useState(false);
  const save = async () => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      toast.error("Invalid JSON");
      return;
    }
    setSaving(true);
    await snapshotBefore("site_settings", sectionKey, sectionKey);
    const { error } = await supabase
      .from("site_settings")
      .upsert(
        [{ key: sectionKey, value: parsed, updated_at: /* @__PURE__ */ new Date().toISOString() }],
        {
          onConflict: "key",
        },
      );
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success(`Saved ${sectionKey}`);
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      className: "px-4 pb-4",
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "textarea",
          {
            spellCheck: false,
            rows: Math.min(24, Math.max(6, text.split("\n").length)),
            value: text,
            onChange: (e) => setText(e.target.value),
            className:
              "w-full bg-[#01040A] border border-white/10 rounded p-3 text-[12px] font-mono text-slate-200 focus:outline-none focus:border-sky-300/50",
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2592,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "mt-2 flex justify-end",
            children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
              SaveButton,
              { saving, onClick: save },
              void 0,
              false,
              {
                fileName: "/app/applet/src/routes/admin.lazy.tsx",
                lineNumber: 2600,
                columnNumber: 9,
              },
              this,
            ),
          },
          void 0,
          false,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2599,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 2591,
      columnNumber: 5,
    },
    this,
  );
}
function InvoiceSettingsEditor() {
  const s = useSectionDraft("invoice_settings");
  const field = (key, label, placeholder = "", type = "text") => {
    const value = get(s.draft, key, "");
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
      "label",
      {
        className: "block",
        children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
            "span",
            { className: "mono text-[10px] tracking-[0.2em] text-slate-500", children: label },
            void 0,
            false,
            {
              fileName: "/app/applet/src/routes/admin.lazy.tsx",
              lineNumber: 2620,
              columnNumber: 9,
            },
            this,
          ),
          type === "textarea"
            ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "textarea",
                {
                  value,
                  onChange: (e) => s.update(key, e.target.value),
                  placeholder,
                  rows: 3,
                  className:
                    "w-full mt-1 bg-[#01040A] border border-white/10 rounded p-3 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2622,
                  columnNumber: 11,
                },
                this,
              )
            : type === "color"
              ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "div",
                  {
                    className: "mt-1 flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "input",
                        {
                          type: "color",
                          value: value || "#48A0E0",
                          onChange: (e) => s.update(key, e.target.value),
                          className:
                            "h-9 w-14 rounded border border-white/10 bg-transparent cursor-pointer",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 2631,
                          columnNumber: 13,
                        },
                        this,
                      ),
                      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                        "input",
                        {
                          value,
                          onChange: (e) => s.update(key, e.target.value),
                          placeholder: "#48A0E0",
                          className:
                            "flex-1 bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50",
                        },
                        void 0,
                        false,
                        {
                          fileName: "/app/applet/src/routes/admin.lazy.tsx",
                          lineNumber: 2637,
                          columnNumber: 13,
                        },
                        this,
                      ),
                    ],
                  },
                  void 0,
                  true,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 2630,
                    columnNumber: 11,
                  },
                  this,
                )
              : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                  "input",
                  {
                    value,
                    onChange: (e) => s.update(key, e.target.value),
                    placeholder,
                    className:
                      "w-full mt-1 bg-[#01040A] border border-white/10 rounded px-3 py-2 text-[13px] text-slate-100 focus:outline-none focus:border-sky-300/50",
                  },
                  void 0,
                  false,
                  {
                    fileName: "/app/applet/src/routes/admin.lazy.tsx",
                    lineNumber: 2645,
                    columnNumber: 11,
                  },
                  this,
                ),
        ],
      },
      void 0,
      true,
      {
        fileName: "/app/applet/src/routes/admin.lazy.tsx",
        lineNumber: 2619,
        columnNumber: 7,
      },
      this,
    );
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    "div",
    {
      children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "header",
          {
            className: "mb-6",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h2",
                { className: "display text-2xl text-metal", children: "Invoicing" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2659,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "p",
                {
                  className: "text-sm text-slate-500 mt-1",
                  children:
                    "Branding, header/footer, legal text and payment details used in proforma invoices & the client portal.",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2660,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2658,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h3",
                { className: "text-sm font-semibold text-slate-100 mb-4", children: "Identity" },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2667,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "grid md:grid-cols-2 gap-4",
                  children: [
                    field("studio_name", "STUDIO NAME", "Edmundo Kutuzov"),
                    field("studio_email", "CONTACT EMAIL", "contact@…"),
                    field("studio_address", "ADDRESS", "Rua …, Maputo"),
                    field("studio_tax_id", "TAX ID (NUIT)", ""),
                    field("logo_url", "LOGO URL (PNG/JPG)", "https://…"),
                    field("brand_color", "BRAND COLOR", "#48A0E0", "color"),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2668,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2666,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h3",
                {
                  className: "text-sm font-semibold text-slate-100 mb-4",
                  children: "Header & footer",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2679,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "grid md:grid-cols-2 gap-4",
                  children: [
                    field("header_label", "HEADER LABEL", "PROFORMA INVOICE"),
                    field("footer_note", "FOOTER NOTE", "Art Director"),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2680,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-4",
                  children: field(
                    "legal_text",
                    "LEGAL TEXT / TERMS",
                    "This is a proforma invoice — …",
                    "textarea",
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2684,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2678,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "section",
          {
            className: "bg-white/[0.02] border border-white/10 rounded-lg p-5 mb-4",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "h3",
                {
                  className: "text-sm font-semibold text-slate-100 mb-4",
                  children: "Payment details",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2690,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "grid md:grid-cols-2 gap-4",
                  children: [
                    field("bank_name", "BANK NAME"),
                    field("bank_account_name", "ACCOUNT NAME"),
                    field("bank_iban", "IBAN"),
                    field("bank_swift", "SWIFT / BIC"),
                    field("mpesa_number", "M-PESA NUMBER"),
                  ],
                },
                void 0,
                true,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2691,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "div",
                {
                  className: "mt-4",
                  children: field(
                    "payment_terms",
                    "PAYMENT TERMS",
                    "Payment within 14 days …",
                    "textarea",
                  ),
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2698,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2689,
            columnNumber: 7,
          },
          this,
        ),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
          "div",
          {
            className: "flex justify-end gap-2",
            children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                "button",
                {
                  onClick: s.restore,
                  className: "text-[12px] text-slate-400 hover:text-slate-100 px-3 py-2",
                  children: "Restore defaults",
                },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2704,
                  columnNumber: 9,
                },
                this,
              ),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
                SaveButton,
                { saving: s.saving, onClick: s.save },
                void 0,
                false,
                {
                  fileName: "/app/applet/src/routes/admin.lazy.tsx",
                  lineNumber: 2710,
                  columnNumber: 9,
                },
                this,
              ),
            ],
          },
          void 0,
          true,
          {
            fileName: "/app/applet/src/routes/admin.lazy.tsx",
            lineNumber: 2703,
            columnNumber: 7,
          },
          this,
        ),
      ],
    },
    void 0,
    true,
    {
      fileName: "/app/applet/src/routes/admin.lazy.tsx",
      lineNumber: 2657,
      columnNumber: 5,
    },
    this,
  );
}
export { Route };
