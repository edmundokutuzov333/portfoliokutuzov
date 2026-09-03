import { f as createSsrRpc } from "./router--IsihV5_.mjs";
import { c as createServerFn } from "./server-BjuWTvBY.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-B_96fckz.mjs";
import { _ as _enum, f as object, e as array, d as string, n as number, k as boolean } from "../_libs/zod.mjs";
const LineItemSchema = object({
  id: string().uuid().optional(),
  description: string().trim().min(1).max(300),
  detail: string().trim().max(600).nullable().optional(),
  qty: number().min(0).max(1e5),
  unit: string().trim().min(1).max(24).default("un"),
  unit_price: number().min(0).max(1e8),
  discount_pct: number().min(0).max(100).default(0)
});
const DraftSchema = object({
  briefing_id: string().uuid(),
  currency: _enum(["EUR", "USD", "MZN", "GBP", "BRL", "ZAR"]),
  issue_date: string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  due_date: string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  discount_pct: number().min(0).max(100).default(0),
  tax_pct: number().min(0).max(100).default(0),
  tax_label: string().trim().max(60).nullable().optional(),
  deposit_pct: number().min(0).max(100).default(0),
  notes: string().trim().max(2e3).nullable().optional(),
  terms: string().trim().max(2e3).nullable().optional(),
  items: array(LineItemSchema).min(1).max(60)
});
const IdSchema = object({
  briefing_id: string().uuid()
});
const TokenSchema = object({
  token: string().min(16).max(128)
});
const saveInvoiceDraft = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => DraftSchema.parse(i)).handler(createSsrRpc("3358006f6a9d9625853af82d6e7df3a54258f0523ceffb01a5019a701a84bc88"));
const getInvoiceDraft = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdSchema.parse(i)).handler(createSsrRpc("88c916531dc078a3249f92545c6b038e50f33c99c9111d2292882c8fdf8655ec"));
const renderInvoicePdfNow = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => DraftSchema.parse(i)).handler(createSsrRpc("79fad9d37613ae3016f5456c130980d6d5734c953a5cd0744579762c546f167b"));
const generateBriefingInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => DraftSchema.parse(i)).handler(createSsrRpc("02549197a893ac72fe11ed98120318300b203d66ec24779eb25529bbb5668ee2"));
const previewInvoiceEmail = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdSchema.extend({
  variant: _enum(["invoice", "reminder", "receipt"]).default("invoice")
}).parse(i)).handler(createSsrRpc("1903ed2e0c27bfc3ee700bbb0c7b7d812516f97e0fecfc6ce6030e38e5449bd4"));
const SendSchema = IdSchema.extend({
  to_override: array(string().email()).max(5).optional(),
  cc_override: array(string().email()).max(5).optional(),
  attach_pdf: boolean().default(true),
  variant: _enum(["invoice", "reminder", "receipt"]).default("invoice")
});
const sendBriefingInvoice = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => SendSchema.parse(i)).handler(createSsrRpc("54f48f86b3b05004ee82bbe667b59e39934b23c9ab345cbfca482f40f3275d5e"));
const setInvoiceStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdSchema.extend({
  status: _enum(["draft", "generated", "sent", "viewed", "paid", "void"])
}).parse(i)).handler(createSsrRpc("a3199d2d8d9bc2ca06a4ed0fdd2a1adda6ac21def1962dedbc85f54d8362ead6"));
const listInvoiceEvents = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((i) => IdSchema.parse(i)).handler(createSsrRpc("3df214823d15024d62cdacc52b9ca2675512f5b87909e9277061f1f686b791c2"));
const getInvoiceWorkspace = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).handler(createSsrRpc("b75f10f4d5470089dbbfd03639ced843095b6501e58fbf2bbcf624831011f069"));
const getPublicInvoice = createServerFn({
  method: "POST"
}).inputValidator((i) => TokenSchema.parse(i)).handler(createSsrRpc("7cf99f1f443df70951f16026984e7f7a664d02eb63efa6624ccde1f1d6e46144"));
const createProofUploadUrl = createServerFn({
  method: "POST"
}).inputValidator((i) => TokenSchema.extend({
  filename: string().trim().min(1).max(120),
  content_type: _enum(["image/png", "image/jpeg", "image/webp", "application/pdf"])
}).parse(i)).handler(createSsrRpc("a7e3b9e9169c200b8ece514744acb9313a0c683d5343989dfb3529da8bfc31e6"));
const reportInvoicePayment = createServerFn({
  method: "POST"
}).inputValidator((i) => TokenSchema.extend({
  method: _enum(["bank_transfer", "mpesa", "card", "other"]),
  reference: string().trim().max(120).nullable().optional(),
  proof_path: string().trim().max(300).nullable().optional()
}).parse(i)).handler(createSsrRpc("34eb708ad10955c4086cd44b7d0ad65b10e6df7bc6d5ec0f3ed0b116135766f6"));
export {
  getInvoiceWorkspace as a,
  generateBriefingInvoice as b,
  createProofUploadUrl as c,
  setInvoiceStatus as d,
  getInvoiceDraft as e,
  saveInvoiceDraft as f,
  getPublicInvoice as g,
  renderInvoicePdfNow as h,
  listInvoiceEvents as l,
  previewInvoiceEmail as p,
  reportInvoicePayment as r,
  sendBriefingInvoice as s
};
