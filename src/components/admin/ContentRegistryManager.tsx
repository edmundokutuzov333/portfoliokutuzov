import { useEffect, useState } from "react";
import { Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { listAdminContentRegistry, upsertAdminFaq, deleteAdminFaq, upsertAdminTestimonial, deleteAdminTestimonial, upsertAdminSiteMetric, deleteAdminSiteMetric } from "@/lib/admin.content-registry.functions";

type Registry = { faq: any[]; testimonials: any[]; metrics: any[] };

export function ContentRegistryManager() {
  const load = useServerFn(listAdminContentRegistry);
  const saveFaq = useServerFn(upsertAdminFaq); const delFaq = useServerFn(deleteAdminFaq);
  const saveTestimonial = useServerFn(upsertAdminTestimonial); const delTestimonial = useServerFn(deleteAdminTestimonial);
  const saveMetric = useServerFn(upsertAdminSiteMetric); const delMetric = useServerFn(deleteAdminSiteMetric);
  const [tab, setTab] = useState<"faq" | "testimonials" | "metrics">("faq");
  const [data, setData] = useState<Registry>({ faq: [], testimonials: [], metrics: [] });
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    setBusy(true);
    try { setData((await load({ data: {} })) as Registry); }
    catch (error) { toast.error(error instanceof Error ? error.message : "Content registry could not be loaded"); }
    finally { setBusy(false); }
  };
  useEffect(() => { void refresh(); }, []);
  const save = async (kind: "faq" | "testimonials" | "metrics", value: string, index: number) => {
    try {
      const parsed = JSON.parse(value);
      if (kind === "faq") await saveFaq({ data: parsed });
      if (kind === "testimonials") await saveTestimonial({ data: parsed });
      if (kind === "metrics") await saveMetric({ data: parsed });
      await refresh();
      toast.success("Registry entry saved");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Invalid registry entry"); }
  };
  const remove = async (kind: "faq" | "testimonials" | "metrics", id: string) => {
    try {
      if (kind === "faq") await delFaq({ data: { id } });
      if (kind === "testimonials") await delTestimonial({ data: { id } });
      if (kind === "metrics") await delMetric({ data: { id } });
      await refresh();
      toast.success("Registry entry deleted");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Delete failed"); }
  };
  const addBlank = () => {
    const blank = tab === "faq" ? { question: "", answer: "", question_pt: null, answer_pt: null, sort_order: data.faq.length, is_published: false }
      : tab === "testimonials" ? { quote: "", quote_pt: null, person: "", role: null, company: null, sort_order: data.testimonials.length, is_published: false }
      : { metric_key: "", value: null, value_pt: null, label: "", label_pt: null, sort_order: data.metrics.length, is_active: false };
    const next = { ...data, [tab]: [...data[tab], blank] } as Registry;
    setData(next);
  };
  const rows = data[tab];
  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><div className="mono text-[10px] tracking-[0.25em] text-sky-300/70">CONTENT / REGISTRY</div><h2 className="display mt-1 text-3xl text-metal">Structured content.</h2><p className="mt-2 text-sm text-slate-500">Real-source-only registries for FAQ, testimonials and site metrics. Empty records remain unpublished.</p></div>
      <button type="button" onClick={() => void refresh()} disabled={busy} className="inline-flex min-h-10 items-center gap-2 border border-white/[0.08] px-3 text-xs text-slate-400"><RefreshCw size={13} className={busy ? "animate-spin" : ""}/>Refresh</button>
    </header>
    <div className="flex flex-wrap gap-2 border-b border-white/[0.08] pb-2">
      {(["faq", "testimonials", "metrics"] as const).map((value) => <button key={value} type="button" onClick={() => setTab(value)} className={`border-2 px-4 py-2 text-sm ${tab === value ? "border-sky-300/50 bg-sky-300/10 text-sky-100" : "border-white/10 text-slate-500"}`}>{value === "faq" ? "FAQ" : value === "testimonials" ? "Testimonials" : "Site metrics"}</button>)}
    </div>
    <section className="space-y-3">
      <div className="flex justify-end"><button type="button" onClick={addBlank} className="inline-flex min-h-10 items-center gap-2 border-2 border-sky-300/30 px-3 text-sm text-sky-100"><Plus size={14}/>New entry</button></div>
      {rows.map((row, index) => <RegistryRow key={row.id ?? `new-${index}`} row={row} kind={tab} index={index} onSave={save} onDelete={row.id ? remove : undefined} />)}
      {rows.length === 0 ? <div className="border-2 border-dashed border-white/[0.08] p-10 text-center text-sm text-slate-600">No real entries exist yet. This registry stays empty until sourced content is supplied.</div> : null}
    </section>
  </div>;
}

function RegistryRow({ row, kind, index, onSave, onDelete }: { row: any; kind: "faq" | "testimonials" | "metrics"; index: number; onSave: (kind: "faq" | "testimonials" | "metrics", value: string, index: number) => Promise<void>; onDelete?: (kind: "faq" | "testimonials" | "metrics", id: string) => Promise<void>; }) {
  const [value, setValue] = useState(JSON.stringify(row, null, 2));
  useEffect(() => setValue(JSON.stringify(row, null, 2)), [row]);
  return <article className="border-2 border-white/[0.08] bg-[#030814] p-4">
    <div className="mb-3 flex items-center justify-between gap-3"><span className="text-sm text-slate-400">{kind} {index + 1}</span>{row.id ? <span className="text-[10px] text-slate-600">{row.id}</span> : <span className="text-[10px] text-amber-300">Unsaved</span>}</div>
    <textarea value={value} onChange={(event) => setValue(event.target.value)} spellCheck={false} aria-label={`${kind} JSON editor`} className="min-h-48 w-full border-2 border-white/10 bg-black px-3 py-3 font-mono text-xs leading-5 text-slate-200 outline-none focus:border-sky-300"/>
    <div className="mt-3 flex justify-end gap-2">
      {row.id && onDelete ? <button type="button" onClick={() => void onDelete(kind, row.id)} className="inline-flex min-h-10 items-center gap-2 border-2 border-red-300/20 px-3 text-sm text-red-200"><Trash2 size={13}/>Delete</button> : null}
      <button type="button" onClick={() => void onSave(kind, value, index)} className="inline-flex min-h-10 items-center gap-2 border-2 border-emerald-300/20 px-3 text-sm text-emerald-200"><Save size={13}/>Save</button>
    </div>
  </article>;
}
