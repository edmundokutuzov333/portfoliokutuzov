import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronUp, Download, FileImage, FileText, GripVertical, Layers3, Printer, Redo2, Save, Undo2, Upload } from "lucide-react";
import clsx from "clsx";
import { useSiteLocale } from "@/lib/site-locale";
import { getStudioSessionId } from "@/lib/studio/session";
import { getStudioDraftMeta, loadStudioCard, saveStudioCard } from "@/lib/studio/persistence";
import { alignElement, createStudioDesign, loadDraftLocally, reorderElement, saveDraftLocally, updateBackground, updateElementPosition, updateElementSize, updateTextElement } from "@/lib/studio/design-document";
import { exportPdf, exportPng, exportPrintPdf, exportSvg } from "@/lib/studio/export";
import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_SAFE_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioDesignDocument, type StudioElement, type StudioStyle, type StudioTextRole } from "@/lib/studio/types";
import { CreativeEnginePanel } from "./CreativeEnginePanel";
import { DigitalIdentityPanel } from "./DigitalIdentityPanel";
import { applyCreativeRecommendation } from "@/lib/studio/ai/creative-apply";
import type { StudioCreativeRecommendation } from "@/lib/studio/ai/creative-types";

type FieldKey = StudioTextRole;
type ExportKind = "svg" | "png" | "pdf" | "print-pdf";
type SaveState = "idle" | "saving" | "saved" | "error";
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
  name: { en: "Name", pt: "Nome" },
  role: { en: "Role", pt: "Cargo" },
  company: { en: "Company", pt: "Empresa" },
  email: { en: "Email", pt: "Email" },
  phone: { en: "Phone", pt: "Telefone" },
  website: { en: "Website", pt: "Website" },
  logo: { en: "Company logo", pt: "Logótipo da empresa" },
  accent: { en: "Accent line", pt: "Linha de destaque" },
};

const clone = <T,>(value: T): T => structuredClone(value);
const sameDocument = (a: StudioDesignDocument, b: StudioDesignDocument) => JSON.stringify(a) === JSON.stringify(b);
const snap = (value: number, step = 0.5) => Math.round(value / step) * step;

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function sanitizeSvg(svg: string) {
  if (svg.length > 1_500_000) throw new Error("SVG payload is too large.");
  const document = new DOMParser().parseFromString(svg, "image/svg+xml");
  if (document.querySelector("parsererror")) throw new Error("Invalid SVG file.");
  document.querySelectorAll("script,foreignObject,iframe,object,embed,link,style").forEach((node) => node.remove());
  document.querySelectorAll("*").forEach((node) => {
    for (const attribute of Array.from(node.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on") || name === "style") node.removeAttribute(attribute.name);
      if ((name === "href" || name === "xlink:href" || name === "src") && !value.startsWith("#")) node.removeAttribute(attribute.name);
    }
  });
  return new XMLSerializer().serializeToString(document.documentElement);
}

function elementLabel(element: StudioElement, pt: boolean) {
  return (labels[element.id] ?? labels[element.type] ?? { en: element.type, pt: element.type })[pt ? "pt" : "en"];
}

function StudioCanvas({ design, selectedId, onSelect, onChange, onInteractionEnd }: {
  design: StudioDesignDocument;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (design: StudioDesignDocument) => void;
  onInteractionEnd: (interaction: Interaction) => void;
}) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const interactionRef = useRef<Interaction | null>(null);
  const scale = 10;
  const width = STUDIO_CARD_WIDTH_MM * scale;
  const height = STUDIO_CARD_HEIGHT_MM * scale;

  const point = (event: PointerEvent<Element>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: ((event.clientX - rect.left) / rect.width) * STUDIO_CARD_WIDTH_MM,
      y: ((event.clientY - rect.top) / rect.height) * STUDIO_CARD_HEIGHT_MM,
    };
  };

  const finish = (event?: PointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current;
    interactionRef.current = null;
    if (event && svgRef.current?.hasPointerCapture(event.pointerId)) svgRef.current.releasePointerCapture(event.pointerId);
    if (interaction) onInteractionEnd(interaction);
  };

  const handlePointerMove = (event: PointerEvent<SVGSVGElement>) => {
    const interaction = interactionRef.current;
    if (!interaction) return;
    const p = point(event);
    if (!p) return;
    const current = design;
    if (!current.elements.some((element) => element.id === interaction.id)) return;
    if (interaction.mode === "drag") {
      onChange(updateElementPosition(current, interaction.id, snap(p.x - interaction.startX), snap(p.y - interaction.startY)));
    } else {
      onChange(updateElementSize(current, interaction.id, snap(interaction.startW + p.x - interaction.startX), snap(interaction.startH + p.y - interaction.startY)));
    }
  };

  const startDrag = (event: PointerEvent<SVGElement>, element: StudioElement) => {
    event.preventDefault();
    event.stopPropagation();
    const p = point(event);
    if (!p) return;
    const interaction: Interaction = {
      mode: "drag",
      id: element.id,
      before: clone(design),
      startX: p.x - element.x,
      startY: p.y - element.y,
      startW: element.width,
      startH: element.height,
    };
    interactionRef.current = interaction;
    onSelect(element.id);
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  const startResize = (event: PointerEvent<SVGRectElement>, element: StudioElement) => {
    event.preventDefault();
    event.stopPropagation();
    const p = point(event);
    if (!p) return;
    const interaction: Interaction = {
      mode: "resize",
      id: element.id,
      before: clone(design),
      startX: p.x,
      startY: p.y,
      startW: element.width,
      startH: element.height,
    };
    interactionRef.current = interaction;
    svgRef.current?.setPointerCapture(event.pointerId);
  };

  return <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-2xl">
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} role="application" aria-label="Business card vector editor" className="block h-auto w-full select-none touch-none" onPointerDown={() => onSelect(null)} onPointerMove={handlePointerMove} onPointerUp={finish} onPointerCancel={finish}>
      <defs>
        {design.background.type === "gradient" && design.background.secondary && <linearGradient id="studio-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={design.background.value}/><stop offset="100%" stopColor={design.background.secondary}/></linearGradient>}
      </defs>
      <rect width={width} height={height} fill={design.background.type === "gradient" ? "url(#studio-background)" : design.background.value}/>
      <rect x={6} y={6} width={width - 12} height={height - 12} rx={22} fill="none" stroke="rgba(255,255,255,.1)"/>
      {design.elements.map((element) => {
        const x = element.x * scale;
        const y = element.y * scale;
        const w = element.width * scale;
        const h = element.height * scale;
        const selected = element.id === selectedId;
        const frame = selected ? <><rect x={x - 3} y={y - 3} width={w + 6} height={h + 6} rx={6} fill="none" stroke="rgba(213,255,66,.95)" strokeWidth={1.5}/><rect x={x + w - 5} y={y + h - 5} width={10} height={10} rx={3} fill="#d5ff42" stroke="#05070a" strokeWidth={1.5} onPointerDown={(event) => startResize(event, element)}/></> : null;
        if (element.type === "line") return <g key={element.id} onPointerDown={(event) => startDrag(event, element)}><rect x={x} y={y} width={w} height={Math.max(2, h)} rx={Math.max(1, h / 2)} fill={element.fill} opacity={element.opacity}/>{frame}</g>;
        if (element.type === "logo") return <g key={element.id} onPointerDown={(event) => startDrag(event, element)}>{element.src ? <image href={element.src} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid meet" opacity={element.opacity}/> : <rect x={x} y={y} width={w} height={h} rx={10} fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.18)" strokeDasharray="7 6"/>}{!element.src && <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" fontSize={10} fill="rgba(255,255,255,.45)" fontFamily="Inter, sans-serif">LOGO</text>}{frame}</g>;
        return <g key={element.id} onPointerDown={(event) => startDrag(event, element)}><text x={x} y={y + element.fontSize * scale} fontFamily={element.fontFamily} fontSize={element.fontSize * scale} fontWeight={element.fontWeight} letterSpacing={element.letterSpacing} fill={element.fill} opacity={element.opacity}>{element.text || labels[element.role]?.en}</text>{frame}</g>;
      })}
    </svg>
  </div>;
}

export function BusinessCardEditor() {
  const locale = useSiteLocale();
  const pt = locale === "pt-PT";
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const existing = useMemo(() => loadDraftLocally(), []);
  const empty = { name: "", role: "", company: "", email: "", phone: "", website: "" } as Record<FieldKey, string>;
  const initialValues = existing ? { name: existing.name, role: existing.role, company: existing.company, email: existing.email, phone: existing.phone, website: existing.website } : empty;
  const [values, setValues] = useState<Record<FieldKey, string>>(initialValues);
  const [style, setStyle] = useState<StudioStyle>(existing?.design.style ?? "corporate");
  const [design, setDesign] = useState<StudioDesignDocument>(existing?.design ?? createStudioDesign("corporate", empty));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [past, setPast] = useState<StudioDesignDocument[]>([]);
  const [future, setFuture] = useState<StudioDesignDocument[]>([]);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [busy, setBusy] = useState<ExportKind | null>(null);
  const [notice, setNotice] = useState("");
  const designRef = useRef(design);
  const valuesRef = useRef(values);
  const dirtyRef = useRef(false);
  const changeVersionRef = useRef(0);
  const saveQueueRef = useRef<Promise<void>>(Promise.resolve());
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { designRef.current = design; }, [design]);
  useEffect(() => { valuesRef.current = values; }, [values]);

  const hydrateRemote = useCallback((remote: Awaited<ReturnType<typeof loadStudioCard>>) => {
    if (!remote) return;
    const remoteValues = { name: remote.name, role: remote.role, company: remote.company, email: remote.email, phone: remote.phone, website: remote.website };
    setValues(remoteValues);
    valuesRef.current = remoteValues;
    setDesign(remote.design);
    designRef.current = remote.design;
    setStyle(remote.design.style);
  }, []);

  useEffect(() => {
    let active = true;
    void loadStudioCard()
      .then((remote) => {
        if (!active || !remote) return;
        const localUpdated = existing?.updatedAt ? Date.parse(existing.updatedAt) : 0;
        const remoteUpdated = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
        if (remoteUpdated >= localUpdated) hydrateRemote(remote);
      })
      .catch(() => {
        if (active) setNotice(pt ? "A trabalhar com o rascunho local enquanto o servidor não responde." : "Working from the local draft while the server is unavailable.");
      });
    return () => { active = false; };
  }, [existing?.updatedAt, hydrateRemote, pt]);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    changeVersionRef.current += 1;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      const targetVersion = changeVersionRef.current;
      saveQueueRef.current = saveQueueRef.current.then(async () => {
        setSaveState("saving");
        const snapshot = { ...valuesRef.current, design: clone(designRef.current) };
        try {
          const local = saveDraftLocally({ sessionId, ...snapshot });
          await saveStudioCard({ sessionId, ...snapshot, id: local?.id, ...getStudioDraftMeta() });
          if (targetVersion === changeVersionRef.current) {
            dirtyRef.current = false;
            setSaveState("saved");
            setNotice("");
            window.setTimeout(() => setSaveState((state) => state === "saved" ? "idle" : state), 1400);
          } else {
            dirtyRef.current = true;
          }
        } catch (error) {
          setSaveState("error");
          setNotice(error instanceof Error ? error.message : (pt ? "Não foi possível sincronizar o rascunho." : "Could not sync the draft."));
        }
      }).catch(() => undefined);
    }, 850);
  }, [pt, sessionId]);

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (dirtyRef.current) {
      const snapshot = { ...valuesRef.current, design: clone(designRef.current) };
      saveQueueRef.current = saveQueueRef.current.then(async () => {
        try { const local = saveDraftLocally({ sessionId, ...snapshot }); await saveStudioCard({ sessionId, ...snapshot, id: local?.id, ...getStudioDraftMeta() }); } catch { /* local draft is the final fallback during unmount */ }
      });
    }
  }, [sessionId]);

  const commit = useCallback((next: StudioDesignDocument) => {
    if (sameDocument(designRef.current, next)) return;
    setPast((items) => [...items.slice(-39), clone(designRef.current)]);
    setFuture([]);
    designRef.current = next;
    setDesign(next);
    markDirty();
  }, [markDirty]);

  const direct = useCallback((next: StudioDesignDocument) => {
    designRef.current = next;
    setDesign(next);
  }, []);

  const undo = useCallback(() => {
    const previous = past.at(-1);
    if (!previous) return;
    setPast((items) => items.slice(0, -1));
    setFuture((items) => [clone(designRef.current), ...items]);
    designRef.current = previous;
    setDesign(previous);
    markDirty();
  }, [markDirty, past]);

  const redo = useCallback(() => {
    const next = future[0];
    if (!next) return;
    setFuture((items) => items.slice(1));
    setPast((items) => [...items, clone(designRef.current)]);
    designRef.current = next;
    setDesign(next);
    markDirty();
  }, [future, markDirty]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable = !!target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (isEditable) return;
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "z") { event.preventDefault(); event.shiftKey ? redo() : undo(); return; }
      if (meta && event.key.toLowerCase() === "y") { event.preventDefault(); redo(); return; }
      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedId && selectedId !== "accent") {
          event.preventDefault();
          commit({ ...designRef.current, elements: designRef.current.elements.filter((item) => item.id !== selectedId) });
          setSelectedId(null);
        }
        return;
      }
      if (!selectedId || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const element = designRef.current.elements.find((item) => item.id === selectedId);
      if (!element) return;
      const step = event.shiftKey ? 0.5 : 0.1;
      const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
      const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
      commit(updateElementPosition(designRef.current, selectedId, element.x + dx, element.y + dy));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commit, redo, selectedId, undo]);

  function fieldChange(key: FieldKey, value: string) {
    const nextValues = { ...valuesRef.current, [key]: value };
    valuesRef.current = nextValues;
    setValues(nextValues);
    commit(updateTextElement(designRef.current, key, value));
  }

  function changeStyle(next: StudioStyle) {
    setStyle(next);
    commit(createStudioDesign(next, valuesRef.current));
    setSelectedId(null);
  }

  function align(value: "left" | "center" | "right" | "top" | "middle" | "bottom") {
    if (selectedId) commit(alignElement(designRef.current, selectedId, value));
  }

  function layer(direction: "up" | "down") {
    if (selectedId) commit(reorderElement(designRef.current, selectedId, direction));
  }

  function applyRecommendation(recommendation: StudioCreativeRecommendation) {
    setStyle(recommendation.style);
    commit(applyCreativeRecommendation(designRef.current, recommendation));
    setSelectedId(null);
    setNotice(pt ? "Recomendação aplicada ao canvas." : "Recommendation applied to canvas.");
  }

  async function uploadLogo(file?: File) {
    if (!file) return;
    if (file.type === "application/pdf") { setNotice(pt ? "O editor usa SVG ou imagens; PDF está disponível apenas na exportação." : "The editor uses SVG or images; PDF is available only in export."); return; }
    if (!["image/svg+xml", "image/png", "image/jpeg", "image/webp"].includes(file.type)) { setNotice(pt ? "Formato não suportado." : "Unsupported format."); return; }
    if (file.size > 2 * 1024 * 1024) { setNotice(pt ? "Use um logótipo até 2 MB." : "Use a logo up to 2 MB."); return; }
    try {
      const src = file.type === "image/svg+xml" ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(sanitizeSvg(await file.text()))}` : await readAsDataUrl(file);
      commit({ ...designRef.current, elements: [...designRef.current.elements.filter((item) => item.type !== "logo"), { id: "logo", type: "logo", x: 64, y: 7, width: 20, height: 10, fit: "contain", opacity: 0.98, src }] });
      setSelectedId("logo");
      setNotice(pt ? "Logótipo adicionado." : "Logo added.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : (pt ? "Não foi possível ler o logótipo." : "Could not read the logo."));
    }
  }

  async function save() {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSaveState("saving");
    const snapshot = { ...valuesRef.current, design: clone(designRef.current) };
    saveQueueRef.current = saveQueueRef.current.then(async () => {
      try {
        const local = saveDraftLocally({ sessionId, ...snapshot });
        await saveStudioCard({ sessionId, ...snapshot, id: local?.id, ...getStudioDraftMeta() });
        dirtyRef.current = false;
        setSaveState("saved");
        setNotice(pt ? "Rascunho sincronizado com o servidor." : "Draft synced with the server.");
        window.setTimeout(() => setSaveState((state) => state === "saved" ? "idle" : state), 1800);
      } catch (error) {
        dirtyRef.current = true;
        setSaveState("error");
        setNotice(error instanceof Error ? error.message : (pt ? "Não foi possível guardar no servidor." : "Could not save to the server."));
      }
    });
    await saveQueueRef.current;
  }

  async function doExport(kind: ExportKind) {
    setBusy(kind); setNotice("");
    try {
      const current = designRef.current;
      if (kind === "svg") exportSvg(current);
      else if (kind === "png") await exportPng(current);
      else if (kind === "pdf") await exportPdf(current);
      else await exportPrintPdf(current);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : (pt ? "Falha na exportação." : "Export failed."));
    } finally {
      setBusy(null);
    }
  }

  const selected = design.elements.find((item) => item.id === selectedId) ?? null;
  const saveLabel = saveState === "saving" ? (pt ? "A sincronizar…" : "Syncing…") : saveState === "saved" ? (pt ? "Guardado" : "Saved") : saveState === "error" ? (pt ? "Tentar guardar" : "Retry save") : pt ? "Guardar" : "Save";

  return <div className="min-h-screen bg-[var(--color-bg)] pt-28 pb-20"><div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><a href="/studio" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"><ChevronLeft size={16}/>{pt ? "Voltar ao Studio" : "Back to Studio"}</a><div className="flex items-center gap-2"><span className={clsx("hidden sm:inline-flex items-center rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[.12em]", saveState === "error" ? "border-rose-400/30 text-rose-300" : saveState === "saving" ? "border-sky-400/30 text-sky-300" : "border-white/10 text-white/35")}>{saveState === "saving" ? (pt ? "A sincronizar" : "Syncing") : saveState === "error" ? (pt ? "Local" : "Local") : (pt ? "Sincronizado" : "Synced")}</span><button type="button" onClick={() => void undo()} disabled={!past.length} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white disabled:opacity-30" aria-label={pt ? "Desfazer" : "Undo"}><Undo2 size={15}/></button><button type="button" onClick={() => void redo()} disabled={!future.length} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white disabled:opacity-30" aria-label={pt ? "Refazer" : "Redo"}><Redo2 size={15}/></button><button type="button" onClick={() => void save()} disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-4 py-2 text-sm font-semibold text-white hover:bg-white/[.09] disabled:opacity-60"><Save size={15}/>{saveState === "saved" && <Check size={14}/>} {saveLabel}</button></div></div>
    <header className="mb-8"><p className="mono mb-3 text-[10px] uppercase tracking-[.3em] text-[var(--color-accent-base)]">Kutuzov Studio / Business Card Studio</p><h1 className="display text-4xl font-semibold tracking-[-.04em] text-[var(--color-text-primary)] sm:text-6xl">{pt ? "Editor vectorial de cartão de visita." : "Vector business card editor."}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]">{pt ? "O cartão é um documento editável. Arraste, dimensione, alinhe e organize camadas. O mesmo documento alimenta a persistência, a IA, a identidade digital e as exportações." : "The card is an editable document. Drag, resize, align and reorder layers. The same document powers persistence, AI, digital identity and exports."}</p>{notice && <p className={clsx("mt-3 max-w-2xl text-xs leading-relaxed", saveState === "error" ? "text-rose-300" : "text-white/45")}>{notice}</p>}</header>
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
      <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/[.025] p-5"><section><h2 className="mb-4 text-sm font-semibold text-white">{pt ? "Conteúdo" : "Content"}</h2><div className="space-y-3">{fields.map((field) => <label key={field.key} className="block"><span className="mono mb-1.5 block text-[9px] uppercase tracking-[.18em] text-white/35">{pt ? field.pt : field.en}</span><input value={values[field.key]} onChange={(e) => fieldChange(field.key, e.target.value)} type={field.type ?? "text"} placeholder={field.placeholder} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-[var(--color-accent-base)]" /></label>)}</div></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Logótipo" : "Logo"}</h2><label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/15 px-4 py-6 text-center"><Upload size={18} className="mb-2 text-white/50"/><span className="text-sm font-medium text-white">{pt ? "Carregar logótipo" : "Upload logo"}</span><span className="mt-1 text-[10px] text-white/35">SVG · PNG · JPEG · WEBP</span><input type="file" className="hidden" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(e) => void uploadLogo(e.target.files?.[0])}/></label></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Direcção visual" : "Design direction"}</h2><div className="grid grid-cols-2 gap-2">{STUDIO_STYLES.map((item) => <button key={item.id} type="button" onClick={() => changeStyle(item.id)} className={clsx("rounded-xl border px-3 py-3 text-left transition", style === item.id ? "border-[var(--color-accent-base)] bg-[var(--color-accent-subtle)]" : "border-white/10 hover:bg-white/[.04]")}><span className="block text-xs font-semibold text-white">{item.label}</span><span className="mt-1 block text-[9px] leading-relaxed text-white/40">{pt ? item.id === "editorial" ? "Hierarquia assimétrica e ritmo gráfico refinado." : item.id === "minimal" ? "Composição silenciosa, espaço e tipografia precisa." : item.id === "corporate" ? "Estruturado, legível e com autoridade." : item.id === "bold" ? "Escala forte, contraste e presença distinta." : item.id === "creative" ? "Cor expressiva, camadas e tensão visual." : "Luxo contido e forte presença profissional." : item.description}</span></button>)}</div></section><CreativeEnginePanel design={design} values={values} pt={pt} onApply={applyRecommendation} /><DigitalIdentityPanel design={design} values={values} sessionId={sessionId} pt={pt} /></aside>
      <section className="min-w-0 rounded-[24px] border border-white/10 bg-white/[.025] p-4 sm:p-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="mono text-[9px] uppercase tracking-[.2em] text-white/35">Canvas</p><p className="mt-1 text-xs text-white/35">{STUDIO_CARD_WIDTH_MM} × {STUDIO_CARD_HEIGHT_MM} mm · {STUDIO_CARD_SAFE_MM} mm safe area · snap 0.5 mm</p></div><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => void doExport("svg")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white disabled:opacity-50"><FileText size={14}/>SVG</button><button type="button" onClick={() => void doExport("png")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs text-white disabled:opacity-50"><FileImage size={14}/>{busy === "png" ? "…" : "PNG"}</button><button type="button" onClick={() => void doExport("pdf")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-black disabled:opacity-50"><Download size={14}/>{busy === "pdf" ? "…" : "PDF"}</button><button type="button" onClick={() => void doExport("print-pdf")} disabled={!!busy} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"><Printer size={14}/>{busy === "print-pdf" ? "…" : (pt ? "PDF gráfica" : "Print PDF")}</button></div></div><StudioCanvas design={design} selectedId={selectedId} onSelect={setSelectedId} onChange={direct} onInteractionEnd={(interaction) => { if (!sameDocument(interaction.before, designRef.current)) { setPast((items) => [...items.slice(-39), clone(interaction.before)]); setFuture([]); markDirty(); } }}/><div className="mt-4 text-xs text-white/35">{pt ? "Elemento seleccionado" : "Selected element"}: <span className="text-white/65">{selected ? elementLabel(selected, pt) : pt ? "nenhum" : "none"}</span></div></section>
      <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/[.025] p-5"><section><div className="mb-3 flex items-center gap-2"><Layers3 size={15} className="text-white/45"/><h2 className="text-sm font-semibold text-white">{pt ? "Camadas" : "Layers"}</h2></div><div className="space-y-1.5">{[...design.elements].reverse().map((element) => <button type="button" key={element.id} onClick={() => setSelectedId(element.id)} className={clsx("flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition", selectedId === element.id ? "border-[var(--color-accent-base)] bg-[var(--color-accent-subtle)] text-white" : "border-white/5 bg-black/10 text-white/55 hover:bg-white/[.04]")}><span className="flex items-center gap-2"><GripVertical size={13} className="text-white/25"/>{elementLabel(element, pt)}</span><span className="mono text-[8px] uppercase text-white/20">{element.type}</span></button>)}</div></section>{selected && <><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Alinhar" : "Align"}</h2><div className="grid grid-cols-3 gap-2">{(["left", "center", "right", "top", "middle", "bottom"] as const).map((value) => <button type="button" key={value} onClick={() => align(value)} className="rounded-xl border border-white/10 px-2 py-2 text-[10px] text-white/60 hover:bg-white/[.04]">{pt ? ({ left: "Esquerda", center: "Centro", right: "Direita", top: "Topo", middle: "Meio", bottom: "Base" } as const)[value] : value}</button>)}</div></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Ordem" : "Layer order"}</h2><div className="flex gap-2"><button type="button" onClick={() => layer("up")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 py-2 text-xs text-white"><ChevronUp size={14}/>{pt ? "Subir" : "Up"}</button><button type="button" onClick={() => layer("down")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-white/10 py-2 text-xs text-white"><ChevronDown size={14}/>{pt ? "Descer" : "Down"}</button></div></section><section className="border-t border-white/10 pt-5"><h2 className="mb-3 text-sm font-semibold text-white">{pt ? "Fundo" : "Background"}</h2><div className="flex items-center gap-2"><input aria-label={pt ? "Cor de fundo" : "Background colour"} type="color" value={design.background.value} onChange={(e) => commit(updateBackground(designRef.current, e.target.value, designRef.current.background.secondary))} className="h-9 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"/><button type="button" onClick={() => commit(updateBackground(designRef.current, designRef.current.background.value, designRef.current.background.secondary ? undefined : "#1d9bff"))} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white">{design.background.secondary ? (pt ? "Sólido" : "Solid") : (pt ? "Gradiente" : "Gradient")}</button></div></section></>}</aside>
    </div>
  </div></div>;
}
