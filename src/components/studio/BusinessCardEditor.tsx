import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Check, ChevronLeft, ChevronDown, ChevronUp, Download, FileImage, FileText, GripVertical, Layers3, Save, Undo2, Redo2, Upload } from "lucide-react";
import clsx from "clsx";
import { useSiteLocale } from "@/lib/site-locale";
import { getStudioSessionId } from "@/lib/studio/session";
import { alignElement, createStudioDesign, loadDraftLocally, reorderElement, saveDraftLocally, updateBackground, updateElementPosition, updateElementSize, updateTextElement } from "@/lib/studio/design-document";
import { saveStudioCard } from "@/lib/studio/persistence";
import { downloadBlob, exportPdf, exportPng, exportSvg } from "@/lib/studio/export";
import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioDesignDocument, type StudioElement, type StudioStyle, type StudioTextRole } from "@/lib/studio/types";

type FieldKey = StudioTextRole;
type Interaction = { mode: "drag" | "resize"; id: string; before: StudioDesignDocument; startX: number; startY: number; startW: number; startH: number };

const fields: Array<{ key: FieldKey; en: string; pt: string; placeholder: string; type?: string }> = [
  { key: "name", en: "Name", pt: "Nome", placeholder: "João Manuel" },
  { key: "role", en: "Role", pt: "Cargo", placeholder: "Managing Director" },
  { key: "company", en: "Company", pt: "Empresa", placeholder: "ABC Logistics" },
  { key: "email", en: "Email", pt: "Email", placeholder: "hello@company.com", type: "email" },
  { key: "phone", en: "Phone", pt: "Telefone", placeholder: "+258 84 000 0000", type: "tel" },
  { key: "website", en: "Website", pt: "Website", placeholder: "company.com", type: "url" },
];

const labels: Record<string, { en: string; pt: string }> = {
  name: { en: "Name", pt: "Nome" }, role: { en: "Role", pt: "Cargo" }, company: { en: "Company", pt: "Empresa" }, email: { en: "Email", pt: "Email" }, phone: { en: "Phone", pt: "Telefone" }, website: { en: "Website", pt: "Website" }, logo: { en: "Company logo", pt: "Logótipo da empresa" }, accent: { en: "Accent line", pt: "Linha de destaque" },
};

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
}

function elementLabel(element: StudioElement, pt: boolean) { return (labels[element.id] ?? labels[element.type] ?? { en: element.type, pt: element.type })[pt ? "pt" : "en"]; }

function bounds(element: StudioElement) { return { x: element.x, y: element.y, width: element.width, height: element.height }; }

function StudioCanvas({ design, selectedId, onSelect, onChange, onCommitStart }: { design: StudioDesignDocument; selectedId: string | null; onSelect: (id: string | null) => void; onChange: (design: StudioDesignDocument) => void; onCommitStart: (interaction: Interaction) => void }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const interactionRef = useRef<Interaction | null>(null);
  const scale = 10;
  const width = STUDIO_CARD_WIDTH_MM * scale;
  const height = STUDIO_CARD_HEIGHT_MM * scale;

  const point = (event: PointerEvent<SVGSVGElement>) => { const rect = svgRef.current?.getBoundingClientRect(); if (!rect) return null; return { x: (event.clientX - rect.left) / rect.width * STUDIO_CARD_WIDTH_MM, y: (event.clientY - rect.top) / rect.height * STUDIO_CARD_HEIGHT_MM }; };
  const finish = () => { interactionRef.current = null; };

  useEffect(() => {
    const onWindowUp = () => finish();
    window.addEventListener("pointerup", onWindowUp);
    return () => window.removeEventListener("pointerup", onWindowUp);
  }, []);

  return <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-2xl">
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="application" aria-label="Business card vector editor" className="block h-auto w-full select-none touch-none" onPointerDown={(event) => { if (event.target === event.currentTarget) onSelect(null); }} onPointerMove={(event) => {
      const interaction = interactionRef.current; if (!interaction) return; const p = point(event); if (!p) return;
      if (interaction.mode === "drag") onChange(updateElementPosition(interaction.before, interaction.id, interaction.startX + p.x - interaction.startX, interaction.startY + p.y - interaction.startY));
      else onChange(updateElementSize(interaction.before, interaction.id, interaction.startW + p.x - interaction.startX, interaction.startH + p.y - interaction.startY));
    }} onPointerUp={finish}>
      <defs>{design.background.type === "gradient" && design.background.secondary && <linearGradient id="studio-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={design.background.value}/><stop offset="100%" stopColor={design.background.secondary}/></linearGradient>}</defs>
      <rect width={width} height={height} fill={design.background.type === "gradient" ? "url(#studio-background)" : design.background.value} />
      <rect x={6} y={6} width={width - 12} height={height - 12} rx={22} fill="none" stroke="rgba(255,255,255,0.1)" />
      {design.elements.map((element) => {
        const x = element.x * scale, y = element.y * scale, w = element.width * scale, h = element.height * scale, selected = element.id === selectedId;
        const start = (event: PointerEvent<SVGElement>) => { event.preventDefault(); event.stopPropagation(); const p = point(event as PointerEvent<SVGSVGElement>); if (!p) return; const b = bounds(element); const interaction: Interaction = { mode: "drag", id: element.id, before: structuredClone(design), startX: p.x - b.x, startY: p.y - b.y, startW: b.width, startH: b.height }; interactionRef.current = interaction; onCommitStart(interaction); onSelect(element.id); };
        const resizeStart = (event: PointerEvent<SVGRectElement>) => { event.preventDefault(); event.stopPropagation(); const p = point(event as unknown as PointerEvent<SVGSVGElement>); if (!p) return; const b = bounds(element); const interaction: Interaction = { mode: "resize", id: element.id, before: structuredClone(design), startX: p.x, startY: p.y, startW: b.width, startH: b.height }; interactionRef.current = interaction; onCommitStart(interaction); };
        const frame = selected ? <><rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={6} fill="none" stroke="rgba(213,255,66,.92)" strokeWidth={1.5}/><rect x={x+w-5} y={y+h-5} width={10} height={10} rx={3} fill="#d5ff42" stroke="#05070a" strokeWidth={1.5} onPointerDown={resizeStart}/></> : null;
        if (element.type === "line") return <g key={element.id} onPointerDown={start}><rect x={x} y={y} width={w} height={Math.max(2,h)} rx={Math.max(1,h/2)} fill={element.fill} opacity={element.opacity}/>{frame}</g>;
        if (element.type === "logo") return <g key={element.id} onPointerDown={start}>{element.src ? <image href={element.src} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" opacity={element.opacity}/> : <rect x={x} y={y} width={w} height={h} rx={10} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.18)" strokeDasharray="7 6"/>}<text x={x+w/2} y={y+h/2+4} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,.45)" fontFamily="Inter, sans-serif">{element.src ? "" : "LOGO"}</text>{frame}</g>;
        return <g key={element.id} onPointerDown={start}><text x={x} y={y + element.fontSize*scale} fontFamily={element.fontFamily} fontSize={element.fontSize*scale} fontWeight={element.fontWeight} letterSpacing={element.letterSpacing} fill={element.fill} opacity={element.opacity}>{element.text || labels[element.role]?.en}</text>{frame}</g>;
      })}
    </svg>
  </div>;
}

export function BusinessCardEditor() {
  const locale = useSiteLocale();
  const pt = locale === "pt-PT";
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const empty = { name: "", role: "", company: "", email: "", phone: "", website: "" } as Record<FieldKey, string>;
  const existing = useMemo(() => loadDraftLocally(), []);
  const [values, setValues] = useState<Record<FieldKey, string>>(existing ? { name: existing.name, role: existing.role, company: existing.company, email: existing.email, phone: existing.phone, website: existing.website } : empty);
  const [style, setStyle] = useState<StudioStyle>(existing?.design.style ?? "corporate");
  const [design, setDesign] = useState<StudioDesignDocument>(existing?.design ?? createStudioDesign("corporate", empty));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [past, setPast] = useState<StudioDesignDocument[]>([]);
  const [future, setFuture] = useState<StudioDesignDocument[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [busy, setBusy] = useState<"png" | "pdf" | "svg" | null>(null);
  const [notice, setNotice] = useState<string>("");
  const designRef = useRef(design);
  useEffect(() => { designRef.current = design; }, [design]);

  const commit = (next: StudioDesignDocument) => { const current = designRef.current; setPast((items) => [...items.slice(-39), structuredClone(current)]); setFuture([]); designRef.current = next; setDesign(next); };
  const applyDirect = (next: StudioDesignDocument) => { designRef.current = next; setDesign(next); };
  const endInteraction = () => { const current = designRef.current; if (!current) return; };

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") { event.preventDefault(); if (event.shiftKey) redo(); else undo(); }
      if (meta && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); }
      if (event.key === "Delete" || event.key === "Backspace") { if (selectedId && selectedId !== "accent") { event.preventDefault(); const next = { ...designRef.current, elements: designRef.current.elements.filter((item) => item.id !== selectedId) }; commit(next); setSelectedId(null); } }
      if (selectedId && ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) { event.preventDefault(); const element = designRef.current.elements.find((item) => item.id === selectedId); if (!element) return; const dx = event.shiftKey ? .5 : .1; const x = element.x + (event.key === "ArrowLeft" ? -dx : event.key === "ArrowRight" ? dx : 0); const y = element.y + (event.key === "ArrowUp" ? -dx : event.key === "ArrowDown" ? dx : 0); commit(updateElementPosition(designRef.current, selectedId, x, y)); }
    };
    window.addEventListener("keydown", handler); return () => window.removeEventListener("keydown", handler);
  });

  function undo() { const previous = past[past.length-1]; if (!previous) return; setPast((items) => items.slice(0,-1)); setFuture((items) => [structuredClone(designRef.current), ...items]); applyDirect(previous); }
  function redo() { const next = future[0]; if (!next) return; setFuture((items) => items.slice(1)); setPast((items) => [...items, structuredClone(designRef.current)]); applyDirect(next); }

  function fieldChange(key: FieldKey, value: string) { const next = { ...values, [key]: value }; setValues(next); commit(updateTextElement(design, key, value)); }
  function changeStyle(nextStyle: StudioStyle) { setStyle(nextStyle); const next = createStudioDesign(nextStyle, values); commit(next); setSelectedId(null); }
  function align(alignment: "left" | "center" | "right" | "top" | "middle" | "bottom") { if (!selectedId) return; commit(alignElement(design, selectedId, alignment)); }
  function layer(direction: "up" | "down") { if (!selectedId) return; commit(reorderElement(design, selectedId, direction)); }

  async function uploadLogo(file?: File) { if (!file) return; const allowed = ["image/svg+xml", "image/png", "image/jpeg", "image/webp"]; if (!allowed.includes(file.type)) { setNotice(pt ? "Para edição, use SVG ou uma imagem. PDFs ficam para a etapa de assets." : "For editing, use SVG or an image. PDFs will be handled by the asset pipeline."); return; } if (file.size > 8*1024*1024) { setNotice(pt ? "O ficheiro excede 8 MB." : "The file is larger than 8 MB."); return; } try { const src = await readAsDataUrl(file); const next = { ...design, elements: [...design.elements.filter((item) => item.type !== "logo"), { id: "logo", type: "logo" as const, x: 64, y: 7, width: 20, height: 10, fit: "contain" as const, opacity: .98, src }] }; commit(next); setSelectedId("logo"); setNotice(pt ? "Logótipo adicionado." : "Logo added."); } catch { setNotice(pt ? "Não foi possível ler o logótipo." : "Could not read the logo."); } }

  async function save() { setSaveState("saving"); const record = saveDraftLocally({ sessionId, ...values, design }); try { if (record) await saveStudioCard({ sessionId, ...values, design, id: record.id }); } catch { /* local save remains authoritative for the editor */ } setSaveState("saved"); setTimeout(() => setSaveState("idle"), 1800); }
  async function doExport(kind: "svg" | "png" | "pdf") { setBusy(kind); setNotice(""); try { if (kind === "svg") exportSvg(design); else if (kind === "png") await exportPng(design); else await exportPdf(design); } catch (error) { setNotice(error instanceof Error ? error.message : (pt ? "Falha na exportação." : "Export failed.")); } finally { setBusy(null); } }

  const selected = design.elements.find((item) => item.id === selectedId) ?? null;
  const selectLabel = pt ? "Elemento seleccionado" : "Selected element";

  return <div className="min-h-screen bg-[var(--color-bg)] pt-28 pb-20">
    <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
      <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><a href="/studio" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><ChevronLeft size={16}/>{pt ? "Voltar ao Studio" : "Back to Studio"}</a><div className="flex items-center gap-2"><button type="button" onClick={undo} disabled={!past.length} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white disabled:opacity-30" aria-label={pt ? "Desfazer" : "Undo"}><Undo2 size={15}/></button><button type="button" onClick={redo} disabled={!future.length} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white disabled:opacity-30" aria-label={pt ? "Refazer" : "Redo"}><Redo2 size={15}/></button><button type="button" onClick={save} disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[.09]"><Save size={15}/>{saveState === "saved" ? <>{pt ? "Guardado" : "Saved"} <Check size={14}/></> : pt ? "Guardar" : "Save"}</button></div></div>
      <header className="mb-8"><p className="mono mb-3 text-[10px] uppercase tracking-[.3em] text-[var(--color-accent-base)]">Kutuzov Studio / Business Card Studio</p><h1 className="display text-4xl font-semibold tracking-[-.04em] text-[var(--color-text-primary)] sm:text-6xl">{pt ? "Editor vectorial de cartão de visita." : "Vector business card editor."}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{pt ? "O cartão é um documento editável. Arraste, dimensione, alinhe e organize camadas. A exportação nasce do mesmo documento." : "The card is an editable document. Drag, resize, align and reorder layers. Exports are derived from the same document."}</p></header>
      <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_290px]">
        <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/[.025] p-5">
          <section><h2 className="mb-4 text-sm font-semibold text-white">{pt ? "Conteúdo" : "Content"}</h2><div className="space-y-3">{fields.map((field) => <label key={field.key} className="block"><span className="mono mb-1.5 block text-[9px] uppercase tracking-[.18em] text-white/35">{pt ? field.pt : field.en}</span><input value={values[field.key]} onChange={(event) => fieldChange(field.key, event.target.value)} type={field.type ?? "text"} placeholder={field.placeholder} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[var(--color-accent-base)]" /></label>)}</div></section>
          <section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Logótipo" : "Logo"}</h2><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/15 px-4 py-6 text-center"><Upload size={18} className="mb-2 text-white/50"/><span className="text-sm font-medium text-white">{pt ? "Carregar logótipo" : "Upload logo"}</span><span className="mt-1 text-[10px] text-white/35">SVG · PNG · JPEG · WEBP</span><input type="file" className="hidden" accept="image/svg+xml,image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => uploadLogo(event.target.files?.[0])}/></label></section>
          <section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Direcção visual" : "Design direction"}</h2><div className="grid grid-cols-2 gap-2">{STUDIO_STYLES.map((item) => <button key={item.id} type="button" onClick={() => changeStyle(item.id)} className={clsx("rounded-xl border px-3 py-3 text-left transition", style === item.id ? "border-[var(--color-accent-base)] bg-[var(--color-accent-subtle)]" : "border-white/10 hover:bg-white/[.04]")}><span className="block text-xs font-semibold text-white">{item.label}</span><span className="mt-1 block text-[9px] leading-relaxed text-white/40">{item.description}</span></button>)}</div></section>
        </aside>
        <section className="min-w-0 rounded-[24px] border border-white/10 bg-white/[.025] p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="mono text-[9px] uppercase tracking-[.2em] text-white/35">{pt ? "Canvas" : "Canvas"}</p><p className="mt-1 text-xs text-white/35">{STUDIO_CARD_WIDTH_MM} × {STUDIO_CARD_HEIGHT_MM} mm · {STUDIO_CARD_SAFE_MM} mm safe area</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => doExport("svg")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white disabled:opacity-50"><FileText size={14}/>SVG</button><button type="button" onClick={() => doExport("png")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white disabled:opacity-50"><FileImage size={14}/>{busy === "png" ? "…" : "PNG"}</button><button type="button" onClick={() => doExport("pdf")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-black disabled:opacity-50"><Download size={14}/>{busy === "pdf" ? "…" : "PDF"}</button></div></div><StudioCanvas design={design} selectedId={selectedId} onSelect={setSelectedId} onChange={applyDirect} onCommitStart={(_interaction) => {}}/><div className="mt-4 flex flex-wrap items-center gap-2"><span className="text-xs text-white/35">{selectLabel}: <span className="text-white/65">{selected ? elementLabel(selected, pt) : pt ? "nenhum" : "none"}</span></span>{notice && <span className="text-xs text-white/55">{notice}</span>}</div></section>
        <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/[.025] p-5"><section><div className="mb-3 flex items-center gap-2"><Layers3 size={15} className="text-white/45"/><h2 className="text-sm font-semibold text-white">{pt ? "Camadas" : "Layers"}</h2></div><div className="space-y-1.5">{[...design.elements].reverse().map((element) => <button type="button" key={element.id} onClick={() => setSelectedId(element.id)} className={clsx("flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition", selectedId === element.id ? "border-[var(--color-accent-base)] bg-[var(--color-accent-subtle)] text-white" : "border-white/5 bg-black/10 text-white/55 hover:bg-white/[.04]")}><span className="flex items-center gap-2"><GripVertical size={13} className="text-white/25"/>{elementLabel(element, pt)}</span><span className="mono text-[8px] uppercase text-white/20">{element.type}</span></button>)}</div></section>
          {selected && <><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Alinhar" : "Align"}</h2><div className="grid grid-cols-3 gap-2">{(["left","center","right","top","middle","bottom"] as const).map((value) => <button type="button" key={value} onClick={() => align(value)} className="rounded-xl border border-white/10 px-2 py-2 text-[10px] text-white/60 hover:bg-white/[.04]">{value}</button>)}</div></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Ordem" : "Layer order"}</h2><div className="flex gap-2"><button type="button" onClick={() => layer("up")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 py-2 text-xs text-white"><ChevronUp size={14}/>{pt ? "Subir" : "Up"}</button><button type="button" onClick={() => layer("down")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 py-2 text-xs text-white"><ChevronDown size={14}/>{pt ? "Descer" : "Down"}</button></div></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Fundo" : "Background"}</h2><div className="flex items-center gap-2"><input aria-label={pt ? "Cor de fundo" : "Background colour"} type="color" value={design.background.value} onChange={(event) => commit(updateBackground(design, event.target.value))} className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"/><button type="button" onClick={() => { const second = design.background.secondary ? undefined : "#1d9bff"; commit(updateBackground(design, design.background.value, second)); }} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white">{design.background.secondary ? (pt ? "Sólido" : "Solid") : (pt ? "Gradiente" : "Gradient")}</button></div></section></>}
        </aside>
      </div>
    </div>
  </div>;
}
