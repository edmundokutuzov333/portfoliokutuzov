import { useMemo, useState } from "react";
import { ArrowRight, ImagePlus, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSiteLocale } from "@/lib/site-locale";
import { createStudioDesign, loadDraftLocally, saveDraftLocally } from "@/lib/studio/design-document";
import { getStudioSessionId } from "@/lib/studio/session";
import { getStudioDraftMeta, saveStudioCard } from "@/lib/studio/persistence";
import type { StudioDesignDocument, StudioElement } from "@/lib/studio/types";

const DEFAULT_NEGATIVE = "text, letters, logos, watermark, UI, frame, border, portrait, face, person";

type Result = { dataUrl: string; width: number; height: number; seed?: number; model: string };

function withMagnificBackground(design: StudioDesignDocument, dataUrl: string): StudioDesignDocument {
  const backgroundElement: StudioElement = {
    id: "magnific-background",
    type: "logo",
    x: 0,
    y: 0,
    width: design.widthMm,
    height: design.heightMm,
    fit: "cover",
    opacity: 1,
    src: dataUrl,
  };
  return { ...design, elements: [backgroundElement, ...design.elements.filter((element) => element.id !== "magnific-background")] };
}

export function MagnificBackgroundEngine() {
  const locale = useSiteLocale();
  const pt = locale === "pt-PT";
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState(DEFAULT_NEGATIVE);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState(false);

  async function generate() {
    setBusy(true); setError(""); setApplied(false);
    try {
      const response = await fetch("/api/studio/background", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, negativePrompt }) });
      const payload = await response.json() as Result & { error?: { message?: string } };
      if (!response.ok || !payload.dataUrl) throw new Error(payload.error?.message || (pt ? "O Magnific não devolveu um fundo válido." : "Magnific did not return a valid background."));
      setResult(payload);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (pt ? "Falha ao gerar o fundo." : "Background generation failed."));
    } finally { setBusy(false); }
  }

  async function apply() {
    if (!result) return;
    setBusy(true); setError("");
    try {
      const draft = loadDraftLocally();
      const fallbackValues = { name: "", role: "", company: "", email: "", phone: "", website: "" };
      const design = draft?.design ?? createStudioDesign("corporate", fallbackValues);
      const nextDesign = withMagnificBackground(design, result.dataUrl);
      const identity = {
        sessionId: draft?.sessionId ?? sessionId,
        name: draft?.name ?? "",
        role: draft?.role ?? "",
        company: draft?.company ?? "",
        email: draft?.email ?? "",
        phone: draft?.phone ?? "",
        website: draft?.website ?? "",
        design: nextDesign,
      };
      saveDraftLocally({ ...identity, ...(draft?.id ? { id: draft.id } : {}) });
      await saveStudioCard({ ...identity, ...getStudioDraftMeta() });
      window.dispatchEvent(new CustomEvent("studio:magnific-background-applied"));
      setApplied(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (pt ? "Não foi possível guardar o fundo no servidor." : "Could not save the background to the server."));
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28 pb-20">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="mono mb-4 text-[10px] uppercase tracking-[0.32em] text-[var(--color-accent-base)]">Kutuzov Studio / Background Engine</p>
            <h1 className="display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-7xl">{pt ? "Crie o ambiente do cartão." : "Create the card's environment."}</h1>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{pt ? "O Magnific é usado exclusivamente para gerar o fundo visual. Não altera layout, tipografia, camadas de conteúdo nem decisões do Creative Engine." : "Magnific is used exclusively to generate the visual background. It does not control layout, typography, content layers or Creative Engine decisions."}</p>
          </div>
          <Link to="/studio/business-card" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/[.04]">{pt ? "Abrir editor" : "Open editor"}<ArrowRight size={16} /></Link>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <section className="rounded-[26px] border border-white/10 bg-white/[.025] p-5">
            <div className="mb-5 flex items-center gap-2"><Sparkles size={16} className="text-[var(--color-accent-base)]"/><h2 className="text-sm font-semibold text-white">Magnific</h2></div>
            <label className="block"><span className="mono mb-2 block text-[9px] uppercase tracking-[.18em] text-white/35">{pt ? "Prompt do fundo" : "Background prompt"}</span><textarea value={prompt} onChange={(event) => setPrompt(event.target.value.slice(0, 1200))} rows={7} placeholder={pt ? "Ex.: textura arquitectónica escura, luz lateral suave, profundidade cinematográfica, espaço negativo para informação de contacto" : "E.g. dark architectural texture, soft side light, cinematic depth, negative space for contact information"} className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[var(--color-accent-base)]" /></label>
            <label className="mt-4 block"><span className="mono mb-2 block text-[9px] uppercase tracking-[.18em] text-white/35">{pt ? "Elementos a evitar" : "Avoid"}</span><textarea value={negativePrompt} onChange={(event) => setNegativePrompt(event.target.value.slice(0, 800))} rows={4} className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-3.5 py-3 text-xs leading-relaxed text-white/70 outline-none" /></label>
            <button type="button" onClick={() => void generate()} disabled={busy || prompt.trim().length < 3} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent-base)] px-4 py-3 text-sm font-semibold text-black disabled:opacity-40"><ImagePlus size={17}/>{busy ? (pt ? "A processar…" : "Processing…") : (pt ? "Gerar com Magnific" : "Generate with Magnific")}</button>
            {error && <p className="mt-3 rounded-xl border border-red-400/10 bg-red-400/5 p-3 text-xs leading-relaxed text-red-200/80">{error}</p>}
          </section>

          <section className="rounded-[26px] border border-white/10 bg-white/[.025] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4"><div><p className="mono text-[9px] uppercase tracking-[.2em] text-white/35">Preview</p><p className="mt-1 text-xs text-white/35">{result ? `${result.width} × ${result.height}px · ${result.model}` : (pt ? "O resultado aparece aqui." : "The generated result appears here.")}</p></div>{result && <button type="button" onClick={() => void generate()} disabled={busy || prompt.trim().length < 3} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs text-white/65"><RefreshCw size={14}/>{pt ? "Regenerar" : "Regenerate"}</button>}</div>
            <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0b1118]">{result ? <img src={result.dataUrl} alt={pt ? "Fundo gerado pelo Magnific" : "Magnific generated background"} className="block aspect-[1.8] h-auto w-full object-cover" /> : <div className="grid aspect-[1.8] place-items-center px-8 text-center text-sm text-white/25">{pt ? "Descreva o ambiente visual e gere o fundo." : "Describe the visual environment and generate the background."}</div>}</div>
            {result && <div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-white/35">{pt ? "Aplicar grava o mesmo documento no servidor para continuar no editor." : "Apply persists the same document on the server so it remains available in the editor."}</p><button type="button" onClick={() => void apply()} disabled={busy} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-black disabled:opacity-50">{applied ? (pt ? "Aplicado e sincronizado" : "Applied and synced") : (pt ? "Usar no cartão" : "Use in card")}</button></div>}
          </section>
        </div>
      </div>
    </div>
  );
}
