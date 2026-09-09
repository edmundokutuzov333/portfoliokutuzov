import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { R as Route$3, u as useServerFn, s as safeClipboardWrite } from "./router-DUKWfrGf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as getPublicInvoice, c as createProofUploadUrl, r as reportInvoicePayment } from "./invoice.functions-Bppvxchk.mjs";
import { s as supabase } from "./client-BWSZl9S1.mjs";
import { m as money } from "./invoice-core-C88qtTBH.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/google__genai.mjs";
import { L as LoaderCircle, T as TriangleAlert, p as Clock, D as Download, q as ShieldCheck, U as Upload, n as CircleCheck, k as Check, r as Copy } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./server-D2mK8el-.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
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
import "./auth-middleware-Cbe76dBb.mjs";
const METHODS = [{
  id: "bank_transfer",
  label: "Bank transfer"
}, {
  id: "mpesa",
  label: "M-Pesa"
}, {
  id: "card",
  label: "Card / other online"
}, {
  id: "other",
  label: "Other"
}];
function PublicInvoicePage() {
  const {
    token
  } = Route$3.useParams();
  const getInvoice = useServerFn(getPublicInvoice);
  const createUpload = useServerFn(createProofUploadUrl);
  const reportPayment = useServerFn(reportInvoicePayment);
  const q = useQuery({
    queryKey: ["public-invoice", token],
    queryFn: () => getInvoice({
      data: {
        token
      }
    }),
    retry: false,
    refetchOnWindowFocus: false
  });
  const [method, setMethod] = reactExports.useState("bank_transfer");
  const [reference, setReference] = reactExports.useState("");
  const [file, setFile] = reactExports.useState(null);
  const report = useMutation({
    mutationFn: async () => {
      let proofPath = null;
      if (file) {
        const ct = file.type;
        const up = await createUpload({
          data: {
            token,
            filename: file.name,
            content_type: ct
          }
        });
        const {
          error
        } = await supabase.storage.from(up.bucket).uploadToSignedUrl(up.path, up.token, file);
        if (error) throw new Error(error.message);
        proofPath = up.path;
      }
      return reportPayment({
        data: {
          token,
          method,
          reference: reference || null,
          proof_path: proofPath
        }
      });
    },
    onSuccess: () => {
      toast.success("Thank you — we'll confirm shortly.");
      void q.refetch();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not submit")
  });
  if (q.isLoading) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-[#01040A] grid place-items-center text-slate-300", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "animate-spin" }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 79,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 78,
      columnNumber: 12
    }, this);
  }
  if (q.isError || !q.data) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-[#01040A] grid place-items-center text-center px-6", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-2xl text-slate-100 font-semibold", children: "Invoice not found" }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 85,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-slate-400 text-sm mt-2", children: "This link may have expired or is invalid. Please contact us." }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 86,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 84,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 83,
      columnNumber: 12
    }, this);
  }
  const {
    branding,
    invoice,
    client,
    payment,
    items,
    totals
  } = q.data;
  const accent = branding.brand_color;
  const cur = invoice.currency;
  const isPaid = invoice.status === "paid";
  const isVoid = invoice.status === "void";
  const reported = Boolean(invoice.paid_reported_at) && !isPaid;
  const overdue = !isPaid && !isVoid && Boolean(invoice.due_date) && invoice.due_date < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const amountNow = totals.deposit_amount > 0 && !isPaid ? totals.deposit_amount : totals.total;
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen bg-[#01040A] text-slate-200", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "h-1 w-full", style: {
      background: accent
    } }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 108,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "max-w-3xl mx-auto py-10 px-5 sm:px-6", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("header", { className: "flex items-start justify-between gap-4 mb-8 flex-wrap", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-3", children: [
          branding.logo_url && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("img", { src: branding.logo_url, alt: branding.studio_name, className: "h-9 w-auto" }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 114,
            columnNumber: 35
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest", style: {
              color: accent
            }, children: branding.header_label }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 116,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("h1", { className: "text-lg font-semibold text-slate-100", children: branding.studio_name }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 121,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 115,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 113,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2", children: [
          overdue && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "px-3 py-1 rounded-full text-[11px] mono tracking-widest border border-rose-400/40 text-rose-300 inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TriangleAlert, { size: 11 }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 126,
              columnNumber: 17
            }, this),
            " OVERDUE"
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 125,
            columnNumber: 25
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: `px-3 py-1 rounded-full text-[11px] mono tracking-widest border ${isPaid ? "border-emerald-400/40 text-emerald-300" : "border-white/15 text-slate-300"}`, children: (invoice.status ?? "sent").toUpperCase() }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 128,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 124,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 112,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "rounded-2xl border border-white/10 p-6 bg-white/[0.02]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-baseline justify-between gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500", children: "INVOICE N°" }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 138,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-xl font-semibold text-slate-100", children: invoice.number }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 139,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[12px] text-slate-500 mt-1", children: [
              invoice.issue_date ? `Issued ${invoice.issue_date}` : null,
              invoice.due_date ? ` · Due ${invoice.due_date}` : null
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 140,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 137,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500", children: isPaid ? "AMOUNT PAID" : totals.deposit_amount > 0 ? `DEPOSIT DUE (${invoice.deposit_pct}%)` : "AMOUNT DUE" }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 146,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-3xl font-bold tabular-nums", style: {
              color: accent
            }, children: [
              money(amountNow, cur),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-sm text-slate-400 ml-2", children: cur }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 153,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 149,
              columnNumber: 15
            }, this),
            totals.deposit_amount > 0 && !isPaid && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[12px] text-slate-500 mt-1", children: [
              "Total ",
              money(totals.total, cur),
              " · balance ",
              money(totals.balance, cur)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 155,
              columnNumber: 56
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 145,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 136,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "grid sm:grid-cols-2 gap-4 mt-6 text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-1", children: "BILLED TO" }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 163,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-slate-100", children: client.name }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 164,
              columnNumber: 15
            }, this),
            client.company && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-slate-400", children: client.company }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 165,
              columnNumber: 34
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 162,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-1", children: "ENGAGEMENT" }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 168,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-slate-300", children: invoice.project_type }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 169,
              columnNumber: 15
            }, this),
            invoice.due_date && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-slate-400 mt-1 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Clock, { size: 11 }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 171,
                columnNumber: 19
              }, this),
              " Payment due ",
              invoice.due_date
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 170,
              columnNumber: 36
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 167,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 161,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 border-t border-white/10 pt-4", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-3", children: "BREAKDOWN" }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 178,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("ul", { className: "space-y-3", children: items.map((l, i) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("li", { className: "flex items-start justify-between gap-4 pb-3 border-b border-white/5 last:border-b-0", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[14px] text-slate-100", children: l.description }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 182,
                columnNumber: 21
              }, this),
              l.detail && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[12px] text-slate-500 mt-0.5", children: l.detail }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 183,
                columnNumber: 34
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[11px] text-slate-500 mt-1 tabular-nums", children: [
                l.qty,
                " ",
                l.unit,
                " × ",
                money(l.unit_price, cur),
                l.discount_pct > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { style: {
                  color: accent
                }, children: [
                  " · -",
                  l.discount_pct,
                  "%"
                ] }, void 0, true, {
                  fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                  lineNumber: 186,
                  columnNumber: 46
                }, this)
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 184,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 181,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "text-[14px] text-slate-100 tabular-nums whitespace-nowrap", children: money(l.net, cur) }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 191,
              columnNumber: 19
            }, this)
          ] }, i, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 180,
            columnNumber: 36
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dl", { className: "mt-4 ml-auto max-w-xs text-[13px] space-y-1.5", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TotalRow, { label: "Subtotal", value: money(totals.subtotal, cur) }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 198,
              columnNumber: 15
            }, this),
            totals.discount_amount > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TotalRow, { label: `Discount (${invoice.discount_pct}%)`, value: `-${money(totals.discount_amount, cur)}` }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 199,
              columnNumber: 46
            }, this),
            totals.tax_amount > 0 && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(TotalRow, { label: invoice.tax_label || `Tax (${invoice.tax_pct}%)`, value: money(totals.tax_amount, cur) }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 200,
              columnNumber: 41
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between pt-2 mt-2 border-t border-white/10", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dt", { className: "text-slate-300 font-semibold", children: "Total" }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 202,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dd", { className: "font-bold tabular-nums", style: {
                color: accent
              }, children: [
                money(totals.total, cur),
                " ",
                cur
              ] }, void 0, true, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 203,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 201,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 197,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 177,
          columnNumber: 11
        }, this),
        invoice.notes && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 pt-4 border-t border-white/10", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-2", children: "NOTES" }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 213,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[13px] text-slate-300 whitespace-pre-wrap", children: invoice.notes }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 214,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 212,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("a", { href: invoice.pdf_url, target: "_blank", rel: "noreferrer", className: "mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold text-[#01040A]", style: {
          background: accent
        }, children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Download, { size: 14 }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 220,
            columnNumber: 13
          }, this),
          " Download PDF invoice"
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 217,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 135,
        columnNumber: 9
      }, this),
      (payment.bank_iban || payment.mpesa_number) && !isVoid && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-6 rounded-2xl border border-white/10 p-6 bg-white/[0.02]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-3", children: "PAYMENT DETAILS" }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 226,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dl", { className: "grid grid-cols-1 gap-2 text-sm", children: [
          payment.bank_name && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "Bank", value: payment.bank_name }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 230,
            columnNumber: 37
          }, this),
          payment.bank_account_name && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "Account", value: payment.bank_account_name }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 231,
            columnNumber: 45
          }, this),
          payment.bank_iban && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "IBAN", value: payment.bank_iban, copyable: true }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 232,
            columnNumber: 37
          }, this),
          payment.bank_swift && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "SWIFT / BIC", value: payment.bank_swift, copyable: true }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 233,
            columnNumber: 38
          }, this),
          payment.mpesa_number && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "M-Pesa", value: payment.mpesa_number, copyable: true }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 234,
            columnNumber: 40
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "Reference", value: invoice.number ?? "", copyable: true }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 235,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Row, { label: "Amount", value: `${money(amountNow, cur)} ${cur}`, copyable: true }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 236,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 229,
          columnNumber: 13
        }, this),
        (invoice.terms || payment.payment_terms) && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[12px] text-slate-500 mt-4 border-t border-white/10 pt-3", children: invoice.terms || payment.payment_terms }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 238,
          columnNumber: 58
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 225,
        columnNumber: 68
      }, this),
      !isPaid && !isVoid && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("section", { className: "mt-6 rounded-2xl border border-white/10 p-6 bg-white/[0.02]", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mono text-[10px] tracking-widest text-slate-500 mb-1", children: "ALREADY PAID?" }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 245,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[13px] text-slate-400 mb-4", children: "Tell us and attach the receipt — we verify and confirm, usually the same day." }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 248,
          columnNumber: 13
        }, this),
        reported ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center gap-2 text-amber-300 text-sm", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ShieldCheck, { size: 15 }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 253,
            columnNumber: 17
          }, this),
          " Payment reported on",
          " ",
          new Date(invoice.paid_reported_at).toLocaleDateString(),
          " — awaiting our confirmation."
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 252,
          columnNumber: 25
        }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex flex-wrap gap-2", children: METHODS.map((m) => /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => setMethod(m.id), className: `px-3 py-1.5 rounded-lg text-[12px] border transition-colors ${method === m.id ? "border-transparent text-[#01040A] font-semibold" : "border-white/15 text-slate-300 hover:border-white/30"}`, style: method === m.id ? {
            background: accent
          } : void 0, children: m.label }, m.id, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 258,
            columnNumber: 37
          }, this)) }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 257,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", { value: reference, onChange: (e) => setReference(e.target.value), placeholder: "Transaction reference (optional)", className: "w-full bg-[#01040A] border border-white/10 rounded-lg px-3 py-2.5 text-[13px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-white/30" }, void 0, false, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 264,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("label", { className: "flex items-center gap-2 text-[13px] text-slate-400 cursor-pointer", children: [
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-white/15 hover:border-white/30", children: [
              /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Upload, { size: 13 }, void 0, false, {
                fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
                lineNumber: 267,
                columnNumber: 21
              }, this),
              " ",
              file ? "Change receipt" : "Attach receipt"
            ] }, void 0, true, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 266,
              columnNumber: 19
            }, this),
            file && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "text-slate-300 truncate max-w-[180px]", children: file.name }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 269,
              columnNumber: 28
            }, this),
            /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("input", { type: "file", accept: "image/png,image/jpeg,image/webp,application/pdf", className: "hidden", onChange: (e) => {
              const f = e.target.files?.[0] ?? null;
              if (f && f.size > 8 * 1024 * 1024) {
                toast.error("Max 8MB");
                return;
              }
              setFile(f);
            } }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 270,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 265,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => report.mutate(), disabled: report.isPending, className: "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-[#01040A] disabled:opacity-60", style: {
            background: accent
          }, children: [
            report.isPending ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { size: 14, className: "animate-spin" }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 282,
              columnNumber: 39
            }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { size: 14 }, void 0, false, {
              fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
              lineNumber: 282,
              columnNumber: 88
            }, this),
            "I've paid this invoice"
          ] }, void 0, true, {
            fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
            lineNumber: 279,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 256,
          columnNumber: 24
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 244,
        columnNumber: 32
      }, this),
      isPaid && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "mt-6 flex items-center gap-2 text-emerald-300 text-sm", children: [
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(CircleCheck, { size: 14 }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 289,
          columnNumber: 13
        }, this),
        " Payment received",
        invoice.paid_at ? ` · ${new Date(invoice.paid_at).toLocaleDateString()}` : "",
        ". Thank you!"
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 288,
        columnNumber: 20
      }, this),
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("footer", { className: "mt-10 border-t border-white/10 pt-5", children: [
        branding.legal_text && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-slate-500 leading-relaxed", children: branding.legal_text }, void 0, false, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 295,
          columnNumber: 35
        }, this),
        /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("p", { className: "text-[11px] text-slate-500 mt-2", children: [
          branding.studio_name,
          branding.footer_note ? ` · ${branding.footer_note}` : "",
          branding.studio_email ? ` · ${branding.studio_email}` : ""
        ] }, void 0, true, {
          fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
          lineNumber: 296,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 294,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 111,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
    lineNumber: 107,
    columnNumber: 10
  }, this);
}
function TotalRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dt", { className: "text-slate-500", children: label }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 313,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dd", { className: "text-slate-200 tabular-nums", children: value }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 314,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
    lineNumber: 312,
    columnNumber: 10
  }, this);
}
function Row({
  label,
  value,
  copyable
}) {
  const [done, setDone] = reactExports.useState(false);
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "flex items-center justify-between gap-4 py-1.5 border-b border-white/5 last:border-b-0", children: [
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dt", { className: "text-slate-500 text-[12px]", children: label }, void 0, false, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 328,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("dd", { className: "text-slate-100 text-[13px] flex items-center gap-2", children: [
      /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "tabular-nums", children: value }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 330,
        columnNumber: 9
      }, this),
      copyable && /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("button", { onClick: () => {
        void safeClipboardWrite(value).then(() => {
          setDone(true);
          setTimeout(() => setDone(false), 1400);
        });
      }, className: "text-slate-500 hover:text-slate-200", "aria-label": `Copy ${label}`, children: done ? /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Check, { size: 12, className: "text-emerald-400" }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 337,
        columnNumber: 21
      }, this) : /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Copy, { size: 12 }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 337,
        columnNumber: 72
      }, this) }, void 0, false, {
        fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
        lineNumber: 331,
        columnNumber: 22
      }, this)
    ] }, void 0, true, {
      fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
      lineNumber: 329,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "/app/applet/src/routes/i.$token.tsx?tsr-split=component",
    lineNumber: 327,
    columnNumber: 10
  }, this);
}
export {
  PublicInvoicePage as component
};
