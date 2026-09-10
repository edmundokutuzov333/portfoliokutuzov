import { useEffect, useMemo, useState } from "react";
import { Check, Download, Mail, QrCode, Share2 } from "lucide-react";
import { publicConfig } from "@/config/public";
import { safeClipboardWrite } from "@/lib/browser-safe";
import { buildVCard, publicIdentityUrl } from "@/lib/studio/identity-format";
import { qrDataUrl } from "@/lib/studio/qr";
import { createPdfDataUrl, createPngDataUrl } from "@/lib/studio/export";
import { saveStudioCard, getStudioDraftMeta } from "@/lib/studio/persistence";
import type { StudioDesignDocument } from "@/lib/studio/types";

interface Props { design: StudioDesignDocument; values: Record<string, string>; sessionId: string; pt: boolean; }
type IdentityValues = { name: string; role: string; company: string; email: string; phone: string; website: string };
type PublishResponse = { token?: string; cardId?: string; error?: string };
const getIdentity = (values: Record<string, string>): IdentityValues => ({ name: values.name || "", role: values.role || "", company: values.company || "", email: values.email || "", phone: values.phone || "", website: values.website || "" });

export function DigitalIdentityPanel({ design, values, sessionId, pt }: Props) {
  const identity = useMemo(() => getIdentity(values), [values]);
  const [token, setToken] = useState("");
  const [recipient, setRecipient] = useState("");
  const [autoSend, setAutoSend] = useState(true);
  const [busy, setBusy] = useState<"publish" | "email" | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("");
  const digitalUrl = useMemo(() => token ? publicIdentityUrl(publicConfig.siteUrl, token) : "", [token]);
  const vcard = useMemo(() => token ? buildVCard({ ...identity, url: digitalUrl }) : "", [token, digitalUrl, identity]);
  const qr = useMemo(() => digitalUrl ? qrDataUrl(digitalUrl, 5) : "", [digitalUrl]);

  useEffect(() => { const saved = typeof window !== "undefined" ? window.sessionStorage.getItem("ek_studio_public_token_v1") : null; if (saved) setToken(saved); }, []);

  async function sendEmail(nextUrl = digitalUrl, nextVCard = vcard) {
    if (!recipient || !nextUrl || !nextVCard) return;
    setBusy("email"); setStatus("");
    try {
      const [pngDataUrl, pdfDataUrl] = await Promise.all([createPngDataUrl(design), createPdfDataUrl(design)]);
      const response = await fetch("/api/studio/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ to: recipient, name: identity.name || identity.company, digitalUrl: nextUrl, vcard: nextVCard, pngDataUrl, pdfDataUrl }) });
      const payload = await response.json() as { sent?: boolean; error?: string };
      if (!response.ok || !payload.sent) throw new Error(payload.error || "EMAIL_DELIVERY_FAILED");
      setStatus(pt ? "Email enviado." : "Email sent.");
    } catch (error) { setStatus(error instanceof Error ? error.message : (pt ? "Falha no envio." : "Delivery failed.")); }
    finally { setBusy(null); }
  }

  async function publish() {
    setBusy("publish"); setStatus("");
    try {
      const meta = getStudioDraftMeta();
      const saved = await saveStudioCard({ sessionId, ...identity, design, id: meta.id, draftToken: meta.draftToken, revision: meta.revision });
      const response = await fetch("/api/studio/publish", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId, ...identity, design, draftToken: saved.draftToken, cardId: saved.id }) });
      const payload = await response.json() as PublishResponse;
      if (!response.ok || !payload.token) throw new Error(payload.error || "PUBLISH_FAILED");
      setToken(payload.token); window.sessionStorage.setItem("ek_studio_public_token_v1", payload.token);
      const nextUrl = publicIdentityUrl(publicConfig.siteUrl, payload.token); const nextVCard = buildVCard({ ...identity, url: nextUrl });
      setStatus(pt ? "Cartão público publicado." : "Public card published.");
      if (autoSend && recipient) void sendEmail(nextUrl, nextVCard);
    } catch (error) { setStatus(error instanceof Error ? error.message : (pt ? "Falha ao publicar." : "Publishing failed.")); }
    finally { setBusy(null); }
  }

  async function share() {
    if (!digitalUrl) return;
    const data = { title: identity.name || identity.company || "Digital card", text: [identity.name, identity.role, identity.company].filter(Boolean).join(" · "), url: digitalUrl };
    try { if (navigator.share && navigator.canShare?.(data)) await navigator.share(data); else { await safeClipboardWrite(digitalUrl); setCopied(true); setTimeout(() => setCopied(false), 1600); } } catch { /* user cancellation is intentionally silent */ }
  }

  function downloadVCard() {
    if (!token) return;
    const a = document.createElement("a");
    a.href = `/api/studio/vcard?token=${encodeURIComponent(token)}`;
    a.rel = "noopener";
    a.click();
  }

  return <section className="border-t border-white/10 pt-5">
    <div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2"><QrCode size={15} className="text-[var(--color-accent-base)]"/><h2 className="text-sm font-semibold text-white">{pt ? "Identidade digital" : "Digital identity"}</h2></div><span className="mono text-[8px] uppercase tracking-[.16em] text-white/25">QR · vCard · Share · Email</span></div>
    <p className="mb-3 text-[10px] leading-relaxed text-white/40">{pt ? "Publique uma página pública, gere um QR e um contacto vCard. O mesmo URL alimenta partilha e email." : "Publish a public page, generate a QR and vCard contact. The same URL powers sharing and email."}</p>
    <div className="space-y-2.5">
      {!token ? <button type="button" onClick={() => void publish()} disabled={busy === "publish"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black disabled:opacity-50"><Share2 size={14}/>{busy === "publish" ? (pt ? "A publicar…" : "Publishing…") : (pt ? "Publicar cartão digital" : "Publish digital card")}</button> : <>
        <div className="rounded-xl border border-white/10 bg-black/15 p-3"><p className="mono text-[8px] uppercase tracking-[.18em] text-white/25">Digital URL</p><p className="mt-1 break-all text-[10px] leading-relaxed text-white/60">{digitalUrl}</p></div>
        <div className="flex items-center justify-center rounded-2xl bg-white p-4"><img src={qr} alt="QR code for digital card" className="h-40 w-40" /></div>
        <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => void share()} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-[10px] text-white"><Share2 size={13}/>{copied ? (pt ? "Copiado" : "Copied") : (pt ? "Partilhar" : "Share")}</button><button type="button" onClick={downloadVCard} className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/10 py-2 text-[10px] text-white"><Download size={13}/>{pt ? "vCard" : "vCard"}</button></div>
        <input type="email" value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder={pt ? "Email para receber os ficheiros" : "Email to receive the files"} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/20" />
        <label className="flex items-center gap-2 text-[10px] text-white/45"><input type="checkbox" checked={autoSend} onChange={(event) => setAutoSend(event.target.checked)} className="accent-[var(--color-accent-base)]" />{pt ? "Enviar automaticamente após publicar" : "Send automatically after publishing"}</label>
        <button type="button" onClick={() => void sendEmail()} disabled={busy === "email" || !recipient} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-accent-base)]/40 bg-[var(--color-accent-base)]/[.08] px-3 py-2.5 text-[10px] font-semibold text-white disabled:opacity-40"><Mail size={13}/>{busy === "email" ? (pt ? "A enviar…" : "Sending…") : (pt ? "Enviar PDF + PNG + vCard" : "Send PDF + PNG + vCard")}</button>
      </>}
      {status && <p className="rounded-xl border border-white/10 bg-white/[.025] p-2.5 text-[10px] leading-relaxed text-white/50">{status}</p>}
    </div>
  </section>;
}
