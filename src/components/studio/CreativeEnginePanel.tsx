import { useState } from "react";
import { Sparkles, WandSparkles } from "lucide-react";
import type { StudioDesignDocument } from "@/lib/studio/types";
import type { CreativeProvider, StudioCreativeRecommendation } from "@/lib/studio/ai/creative-types";

interface Props {
  design: StudioDesignDocument;
  values: Record<string, string>;
  pt: boolean;
  onApply: (recommendation: StudioCreativeRecommendation) => void;
}

export function CreativeEnginePanel({ design, values, pt, onApply }: Props) {
  const [provider, setProvider] = useState<CreativeProvider>("both");
  const [brief, setBrief] = useState("");
  const [busy, setBusy] = useState(false);
  const [recommendation, setRecommendation] = useState<StudioCreativeRecommendation | null>(null);
  const [error, setError] = useState("");

  async function generate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/studio/creative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, locale: pt ? "pt-PT" : "en", brief, values, design }),
      });
      const payload = (await response.json()) as { recommendation?: StudioCreativeRecommendation; error?: { message?: string } };
      if (!response.ok || !payload.recommendation) throw new Error(payload.error?.message || (pt ? "O Creative Engine não respondeu com uma recomendação válida." : "Creative Engine did not return a valid recommendation."));
      setRecommendation(payload.recommendation);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : (pt ? "Falha ao gerar recomendação." : "Recommendation failed."));
    } finally {
      setBusy(false);
    }
  }

  return <section className="border-t border-white/10 pt-5">
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2"><Sparkles size={15} className="text-[var(--color-accent-base)]"/><h2 className="text-sm font-semibold text-white">{pt ? "AI Creative Engine" : "AI Creative Engine"}</h2></div>
      <span className="mono text-[8px] uppercase tracking-[.16em] text-white/25">OpenAI + Gemini</span>
    </div>
    <p className="mb-3 text-[10px] leading-relaxed text-white/40">{pt ? "Recomenda layout, tipografia, espaçamento, composição e direcção cromática. A aplicação ao canvas continua determinística." : "Recommends layout, typography, spacing, composition and colour direction. Canvas application stays deterministic."}</p>
    <div className="space-y-2.5">
      <select value={provider} onChange={(event) => setProvider(event.target.value as CreativeProvider)} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none">
        <option value="both">{pt ? "OpenAI + Gemini" : "OpenAI + Gemini"}</option>
        <option value="openai">OpenAI</option>
        <option value="gemini">Gemini</option>
      </select>
      <textarea value={brief} onChange={(event) => setBrief(event.target.value.slice(0, 1600))} rows={3} placeholder={pt ? "Brief opcional: sector, posicionamento, público, tom..." : "Optional brief: sector, positioning, audience, tone..."} className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-white outline-none placeholder:text-white/20" />
      <button type="button" onClick={generate} disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-base)] px-3 py-2.5 text-xs font-semibold text-black disabled:opacity-50"><WandSparkles size={14}/>{busy ? (pt ? "A analisar…" : "Analysing…") : (pt ? "Gerar recomendação" : "Generate recommendation")}</button>
    </div>
    {error && <p className="mt-2 rounded-xl border border-red-400/10 bg-red-400/5 p-2.5 text-[10px] leading-relaxed text-red-200/75">{error}</p>}
    {recommendation && <div className="mt-3 space-y-2 rounded-2xl border border-white/10 bg-black/15 p-3">
      <p className="text-xs font-semibold text-white">{recommendation.summary}</p>
      <p className="text-[10px] leading-relaxed text-white/45">{recommendation.rationale}</p>
      <div className="grid grid-cols-2 gap-2 text-[9px] text-white/45">
        <span>Layout: <strong className="text-white/70">{recommendation.layout.direction}</strong></span>
        <span>Style: <strong className="text-white/70">{recommendation.style}</strong></span>
        <span>Heading: <strong className="text-white/70">{recommendation.typography.headingFont}</strong></span>
        <span>Accent: <strong className="text-white/70">{recommendation.colour.accent}</strong></span>
      </div>
      <button type="button" onClick={() => onApply(recommendation)} className="mt-1 w-full rounded-xl border border-white/10 px-3 py-2 text-[10px] font-semibold text-white hover:bg-white/[.04]">{pt ? "Aplicar ao canvas" : "Apply to canvas"}</button>
    </div>}
  </section>;
}
