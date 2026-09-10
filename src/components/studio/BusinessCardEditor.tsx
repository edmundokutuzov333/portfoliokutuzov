import { useMemo, useRef, useState } from "react";
import { Check, ChevronLeft, GripVertical, Save, Upload, WandSparkles } from "lucide-react";
import clsx from "clsx";
import { useSiteLocale } from "@/lib/site-locale";
import { getStudioSessionId } from "@/lib/studio/session";
import { createStudioDesign, saveDraftLocally, updateBackground, updateElementPosition, updateTextElement } from "@/lib/studio/design-document";
import { saveStudioCard } from "@/lib/studio/persistence";
import { STUDIO_CARD_HEIGHT_MM, STUDIO_CARD_WIDTH_MM, STUDIO_STYLES, type StudioDesignDocument, type StudioStyle } from "@/lib/studio/types";

type FieldKey = "name" | "role" | "company" | "email" | "phone" | "website";

type Copy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  back: string;
  details: string;
  brand: string;
  style: string;
  preview: string;
  save: string;
  saved: string;
  upload: string;
  editorHint: string;
};

const copy: Record<"en" | "pt", Copy> = {
  en: {
    eyebrow: "Kutuzov Studio / Business Card Studio",
    title: "Build a business card that looks considered.",
    subtitle: "Start with your information. The Studio handles hierarchy, spacing and composition. No AI required for the editor.",
    back: "Back to Studio",
    details: "Your details",
    brand: "Brand asset",
    style: "Direction",
    preview: "Live preview",
    save: "Save draft",
    saved: "Saved locally",
    upload: "Upload logo",
    editorHint: "Drag text blocks directly on the card. Everything here is a real editable design document.",
  },
  pt: {
    eyebrow: "Kutuzov Studio / Business Card Studio",
    title: "Crie um cartão de visita com intenção.",
    subtitle: "Comece pelos seus dados. O Studio trata da hierarquia, do espaçamento e da composição. O editor não depende de IA.",
    back: "Voltar ao Studio",
    details: "Os seus dados",
    brand: "Elemento de marca",
    style: "Direcção",
    preview: "Pré-visualização",
    save: "Guardar rascunho",
    saved: "Guardado localmente",
    upload: "Carregar logotipo",
    editorHint: "Arraste os blocos de texto directamente no cartão. Tudo aqui é um documento de design editável.",
  },
};

const fields: Array<{ key: FieldKey; label: string; placeholder: string; type?: string }> = [
  { key: "name", label: "Name", placeholder: "João Manuel" },
  { key: "role", label: "Role", placeholder: "Managing Director" },
  { key: "company", label: "Company", placeholder: "ABC Logistics" },
  { key: "email", label: "Email", placeholder: "hello@company.com", type: "email" },
  { key: "phone", label: "Phone", placeholder: "+258 84 000 0000", type: "tel" },
  { key: "website", label: "Website", placeholder: "company.com", type: "url" },
];

function CardCanvas({ design, onMove, logo }: { design: StudioDesignDocument; onMove: (id: string, x: number, y: number) => void; logo?: string }) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [drag, setDrag] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const width = 900;
  const height = 500;
  const sx = width / STUDIO_CARD_WIDTH_MM;
  const sy = height / STUDIO_CARD_HEIGHT_MM;

  function pointFromEvent(event: PointerEvent | React.PointerEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return null;
    return { x: ((event.clientX - rect.left) / rect.width) * STUDIO_CARD_WIDTH_MM, y: ((event.clientY - rect.top) / rect.height) * STUDIO_CARD_HEIGHT_MM };
  }

  return (
    <div className="w-full max-w-[900px] overflow-hidden rounded-[24px] border border-white/10 bg-black/20 shadow-2xl">
      <svg
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Business card editor preview"
        className="block h-auto w-full select-none touch-none"
        onPointerMove={(event) => {
          if (!drag) return;
          const point = pointFromEvent(event);
          if (point) onMove(drag.id, point.x - drag.offsetX, point.y - drag.offsetY);
        }}
        onPointerUp={() => setDrag(null)}
        onPointerLeave={() => setDrag(null)}
      >
        <defs>
          {design.background.type === "gradient" && design.background.secondary && (
            <linearGradient id="studio-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={design.background.value} />
              <stop offset="100%" stopColor={design.background.secondary} />
            </linearGradient>
          )}
        </defs>
        <rect width={width} height={height} fill={design.background.type === "gradient" ? "url(#studio-bg)" : design.background.value} />
        <rect x={18} y={18} width={width - 36} height={height - 36} rx={22} fill="none" stroke="rgba(255,255,255,0.08)" />
        {design.elements.map((element) => {
          const x = element.x * sx;
          const y = element.y * sy;
          if (element.type === "line") return <rect key={element.id} x={x} y={y} width={element.width * sx} height={element.height * sy} rx={element.height * sy} fill={element.fill} opacity={element.opacity} />;
          if (element.type === "logo") {
            return logo ? <image key={element.id} href={logo} x={x} y={y} width={element.width * sx} height={element.height * sy} preserveAspectRatio="xMidYMid meet" opacity="0.98" /> : <rect key={element.id} x={x} y={y} width={element.width * sx} height={element.height * sy} rx={8} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.18)" strokeDasharray="6 6" />;
          }
          return (
            <g
              key={element.id}
              transform={`translate(${x} ${y})`}
              onPointerDown={(event) => {
                event.preventDefault();
                const point = pointFromEvent(event);
                if (point) setDrag({ id: element.id, offsetX: point.x - element.x, offsetY: point.y - element.y });
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <rect x={-7} y={-element.fontSize * sy} width={Math.max(30, element.width * sx)} height={element.fontSize * sy * 1.7} rx={6} fill="transparent" />
              <text fontFamily={element.fontFamily} fontSize={element.fontSize * sy} fontWeight={element.fontWeight} letterSpacing={element.letterSpacing} fill={element.fill} opacity={element.opacity} dominantBaseline="alphabetic">
                {element.text || element.role}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function BusinessCardEditor() {
  const locale = useSiteLocale();
  const t = copy[locale === "pt-PT" ? "pt" : "en"];
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const [values, setValues] = useState<Record<FieldKey, string>>({ name: "", role: "", company: "", email: "", phone: "", website: "" });
  const [style, setStyle] = useState<StudioStyle>("corporate");
  const [design, setDesign] = useState<StudioDesignDocument>(() => createStudioDesign("corporate", values));
  const [logo, setLogo] = useState<string>();
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [background, setBackground] = useState("#0b1118");

  function setField(key: FieldKey, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    setDesign((current) => updateTextElement(current, key, value));
  }

  function changeStyle(nextStyle: StudioStyle) {
    setStyle(nextStyle);
    const nextDesign = createStudioDesign(nextStyle, values);
    setDesign(nextDesign);
    setBackground(nextDesign.background.value);
  }

  async function save() {
    setSaveState("saving");
    const card = { sessionId, ...values, design };
    saveDraftLocally(card);
    try {
      await saveStudioCard(card);
      setSaveState("saved");
    } catch {
      setSaveState("saved");
    }
  }

  function handleLogo(file?: File) {
    if (!file) return;
    const allowed = ["image/svg+xml", "image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowed.includes(file.type) || file.size > 8 * 1024 * 1024) return;
    if (file.type === "application/pdf") return;
    const url = URL.createObjectURL(file);
    setLogo(url);
    setDesign((current) => ({ ...current, elements: [...current.elements.filter((item) => item.type !== "logo"), { id: "logo", type: "logo", x: 62, y: 8, width: 20, height: 10, fit: "contain", src: url }] }));
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-28 pb-16">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center justify-between gap-4">
          <a href="/studio" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"><ChevronLeft size={16} />{t.back}</a>
          <button type="button" onClick={save} disabled={saveState === "saving"} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.09] disabled:opacity-50"><Save size={15} />{saveState === "saved" ? <>{t.saved} <Check size={14} /></> : t.save}</button>
        </div>

        <header className="mb-10 max-w-3xl">
          <p className="mono mb-4 text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-base)]">{t.eyebrow}</p>
          <h1 className="display text-4xl font-semibold tracking-[-0.03em] text-[var(--color-text-primary)] sm:text-6xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-text-secondary)]">{t.subtitle}</p>
        </header>

        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)_300px]">
          <aside className="space-y-5 rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <div>
              <div className="mb-4 flex items-center gap-2"><GripVertical size={15} className="text-[var(--color-text-muted)]" /><h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.details}</h2></div>
              <div className="space-y-3">
                {fields.map((field) => <label key={field.key} className="block"><span className="mono mb-1.5 block text-[9px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">{field.label}</span><input value={values[field.key]} onChange={(event) => setField(field.key, event.target.value)} type={field.type ?? "text"} placeholder={field.placeholder} className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[var(--color-accent-base)]" /></label>)}
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="mb-3 flex items-center gap-2"><Upload size={15} className="text-[var(--color-text-muted)]" /><h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.brand}</h2></div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/15 px-4 py-7 text-center transition hover:border-white/30"><Upload size={18} className="mb-2 text-white/50" /><span className="text-sm font-medium text-white">{t.upload}</span><span className="mt-1 text-xs text-white/35">SVG · PNG · JPEG · WEBP · PDF</span><input type="file" className="hidden" accept="image/svg+xml,image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => handleLogo(event.target.files?.[0])} /></label>
              <p className="mt-2 text-xs leading-relaxed text-white/35">SVG or transparent PNG is preferred. PDF upload is accepted as a foundation format and will be handled by the asset pipeline later.</p>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="mb-3 flex items-center gap-2"><WandSparkles size={15} className="text-[var(--color-text-muted)]" /><h2 className="text-sm font-semibold text-[var(--color-text-primary)]">{t.style}</h2></div>
              <div className="grid grid-cols-2 gap-2">{STUDIO_STYLES.map((item) => <button key={item.id} type="button" onClick={() => changeStyle(item.id)} className={clsx("rounded-xl border px-3 py-3 text-left transition", style === item.id ? "border-[var(--color-accent-base)] bg-[var(--color-accent-subtle)]" : "border-white/10 bg-black/10 hover:bg-white/[0.04]")}><span className="block text-sm font-semibold text-white">{item.label}</span><span className="mt-1 block text-[10px] leading-relaxed text-white/40">{item.description}</span></button>)}</div>
            </div>
          </aside>

          <section className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.025] p-4 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4"><div><p className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">{t.preview}</p><p className="mt-1 text-xs text-white/35">{t.editorHint}</p></div><div className="text-right"><span className="mono text-[9px] uppercase tracking-[0.18em] text-white/30">{STUDIO_CARD_WIDTH_MM} × {STUDIO_CARD_HEIGHT_MM} mm</span></div></div>
            <CardCanvas design={design} logo={logo} onMove={(id, x, y) => setDesign((current) => updateElementPosition(current, id, x, y))} />
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/70">Background <input aria-label="Background colour" type="color" value={background} onChange={(event) => { const next = event.target.value; setBackground(next); setDesign((current) => updateBackground(current, next)); }} className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0" /></label>
              <span className="text-xs text-white/30">Draft is stored locally first so editing never depends on the network.</span>
            </div>
          </section>

          <aside className="rounded-[24px] border border-white/10 bg-white/[0.025] p-5">
            <p className="mono text-[9px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">Foundation status</p>
            <div className="mt-5 space-y-3">
              {[
                ["Editable vector document", true],
                ["Deterministic layouts", true],
                ["Drag positioning", true],
                ["Local draft persistence", true],
                ["Supabase draft adapter", saveState !== "error"],
                ["AI generation", false],
                ["PDF/PNG export", false],
              ].map(([label, ready]) => <div key={String(label)} className="flex items-center justify-between gap-4 border-b border-white/5 pb-3"><span className="text-sm text-white/70">{label as string}</span><span className={clsx("h-2 w-2 rounded-full", ready ? "bg-emerald-400" : "bg-white/20")} aria-label={ready ? "ready" : "not in phase A"} /></div>)}
            </div>
            <div className="mt-6 rounded-2xl border border-white/8 bg-black/15 p-4 text-xs leading-relaxed text-white/35">Phase A intentionally stops before AI, exports and public digital cards. The purpose is to establish a stable editor and document model first.</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
