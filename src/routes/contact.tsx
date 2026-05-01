import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Send, Check, Mail, Instagram, Linkedin, Facebook, Phone, MapPin,
  Paperclip, X, Loader2, AlertCircle,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  CURRENCIES,
  CURRENCY_META,
  contactSchema,
  type Currency,
} from "@/lib/contact-schema";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Edmundo Kutuzov" },
      { name: "description", content: "Briefing, collaborations and new visual projects with Edmundo Kutuzov, art director in Maputo." },
      { property: "og:title", content: "Contact - Edmundo Kutuzov" },
      { property: "og:description", content: "Briefing, collaborations and new visual projects." },
    ],
  }),
  component: ContactPage,
});

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024; // 8 MB each

type Uploaded = { url: string; name: string; size: number };

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "contact", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);

  const projectTypes = r<string[]>("project_types", ["Brand Identity", "Other"]);
  const email = r("email", "edmundokutuzov.mz@gmail.com");
  const phone = r("phone", "+258 87 601 312 1");

  // form state
  const [name, setName] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [phoneVal, setPhoneVal] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [currency, setCurrency] = useState<Currency>("EUR");
  const [budgetIdx, setBudgetIdx] = useState<number>(1);
  const [timeline, setTimeline] = useState("");
  const [msg, setMsg] = useState("");
  const [files, setFiles] = useState<Uploaded[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brackets = CURRENCY_META[currency].brackets;
  const selectedBudget = brackets[budgetIdx] ?? brackets[0];

  const onFiles = async (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Max ${MAX_FILES} files`);
      return;
    }
    setUploading(true);
    try {
      const uploads: Uploaded[] = [];
      for (const file of incoming) {
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name} is over 8 MB`);
          continue;
        }
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `contact-uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
        const { error: upErr } = await supabase.storage
          .from("site-assets")
          .upload(path, file, { upsert: false });
        if (upErr) {
          toast.error(`${file.name}: ${upErr.message}`);
          continue;
        }
        const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
        uploads.push({ url: data.publicUrl, name: file.name, size: file.size });
      }
      setFiles((f) => [...f, ...uploads]);
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (i: number) => setFiles((f) => f.filter((_, j) => j !== i));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name,
      email: emailVal,
      phone: phoneVal,
      company,
      project_type: type,
      budget_amount: selectedBudget?.value ?? null,
      budget_currency: currency,
      budget_label: selectedBudget?.label ?? "",
      timeline,
      message: msg,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0]?.toString() ?? "_";
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      toast.error("Please check the highlighted fields");
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("contact_requests").insert({
      ...parsed.data,
      attachments: files,
      source: "website",
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 240) : null,
    });
    setSubmitting(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    setDone(true);
    toast.success("Message sent. I'll be in touch within 48h.");
  };

  const formattedAmount = useMemo(() => {
    if (!selectedBudget) return "";
    return `${CURRENCY_META[currency].symbol} ${selectedBudget.label}`;
  }, [currency, selectedBudget]);

  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>{r("eyebrow", "Contact")}</div>
          <div>{r("status", "Open for 2026 projects")}</div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-10">
          {/* LEFT — info */}
          <div className="md:col-span-5">
            <h1 className="display text-5xl md:text-7xl leading-[0.98] tracking-[-0.02em]">
              <span className="text-metal">{r("title_1", "Let's")} </span>
              <span className="italic text-accent">{r("title_accent", "talk.")}</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] text-slate-400 leading-relaxed">
              {r("subtitle", "Tell me about your project. I respond within 48 hours.")}
            </p>

            <div className="mt-12 space-y-5">
              <a href={`mailto:${email}`} className="flex items-center gap-3 group">
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-sky-300/50 transition">
                  <Mail size={15} />
                </span>
                <span className="text-sm group-hover:text-sky-200 transition">{email}</span>
              </a>
              <a href={`tel:${String(phone).replace(/\s/g, "")}`} className="flex items-center gap-3 group">
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-sky-300/50 transition">
                  <Phone size={15} />
                </span>
                <span className="text-sm group-hover:text-sky-200 transition">{phone}</span>
              </a>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center">
                  <MapPin size={15} />
                </span>
                <span className="text-sm text-slate-300">{r("location", "")}</span>
              </div>

              <div className="flex items-center gap-2 pt-4">
                {[
                  { icon: Instagram, label: "Instagram", href: s("instagram", "#") },
                  { icon: Linkedin, label: "LinkedIn", href: s("linkedin", "#") },
                  { icon: Facebook, label: "Facebook", href: s("facebook", "#") },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                    className="h-10 w-10 rounded-full border border-white/10 grid place-items-center text-slate-300 hover:text-white hover:border-sky-300/50 transition">
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — form or success */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-7 relative rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-6 md:p-8"
          >
            {done ? (
              <div className="py-14 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-sky-300/15 grid place-items-center">
                  <Check className="text-sky-200" />
                </div>
                <h2 className="display text-2xl mt-4 text-metal">Message received.</h2>
                <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
                  Thanks {name.split(" ")[0] || "for reaching out"}. I'll get back to you at <span className="text-sky-200">{emailVal}</span> within 48 hours.
                </p>
                <button
                  onClick={() => {
                    setDone(false);
                    setName(""); setEmailVal(""); setPhoneVal(""); setCompany("");
                    setMsg(""); setFiles([]); setTimeline("");
                  }}
                  className="mt-6 text-xs mono text-slate-500 hover:text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Name" required error={errors.name}>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Your name" />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <input type="email" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="field" placeholder="you@company.com" />
                  </Field>
                  <Field label="Phone" error={errors.phone}>
                    <input value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)} className="field" placeholder="Optional" />
                  </Field>
                  <Field label="Company" error={errors.company}>
                    <input value={company} onChange={(e) => setCompany(e.target.value)} className="field" placeholder="Optional" />
                  </Field>
                </div>

                <Field label="Project type" className="mt-5" required error={errors.project_type}>
                  <div className="flex flex-wrap gap-2">
                    {projectTypes.map((p) => (
                      <button type="button" key={p} onClick={() => setType(p)}
                        className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${type === p ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Estimated budget" className="mt-5" hint={`Currency: ${currency} - ${formattedAmount}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {CURRENCIES.map((c) => (
                      <button type="button" key={c} onClick={() => setCurrency(c)}
                        className={`px-2.5 py-1 rounded text-[11px] mono border transition ${currency === c ? "bg-sky-300 text-[#01040A] border-sky-300" : "border-white/10 text-slate-400 hover:text-white"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {brackets.map((b, i) => (
                      <button type="button" key={b.label} onClick={() => setBudgetIdx(i)}
                        className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${budgetIdx === i ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                        {b.label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Timeline" className="mt-5" hint="Optional - when do you need this?">
                  <div className="flex flex-wrap gap-2">
                    {["ASAP", "1-2 months", "3-6 months", "Flexible"].map((t) => (
                      <button type="button" key={t} onClick={() => setTimeline(t === timeline ? "" : t)}
                        className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${timeline === t ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="Message" className="mt-5" required error={errors.message}>
                  <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} className="field resize-none"
                    placeholder="Tell me about the brand, the challenge, the timeline and any references…" />
                </Field>

                <Field label={`References (${files.length}/${MAX_FILES})`} className="mt-5" hint="Optional. Up to 5 files, 8 MB each.">
                  <div className="flex flex-wrap gap-2">
                    {files.map((f, i) => (
                      <div key={f.url} className="inline-flex items-center gap-2 text-[12px] bg-white/[0.04] border border-white/10 rounded px-3 py-1.5">
                        <a href={f.url} target="_blank" rel="noreferrer" className="text-sky-200 hover:underline truncate max-w-[160px]">{f.name}</a>
                        <button type="button" onClick={() => removeFile(i)} className="text-slate-500 hover:text-red-300"><X size={12} /></button>
                      </div>
                    ))}
                    {files.length < MAX_FILES && (
                      <label className="inline-flex items-center gap-2 text-[12px] mono border border-dashed border-white/15 hover:border-sky-300/50 hover:text-sky-200 text-slate-400 rounded px-3 py-1.5 cursor-pointer">
                        {uploading ? <Loader2 size={12} className="animate-spin" /> : <Paperclip size={12} />}
                        Attach file
                        <input type="file" multiple className="hidden" onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
                      </label>
                    )}
                  </div>
                </Field>

                <div className="mt-7 flex items-center justify-between gap-4">
                  <p className="text-[11px] text-slate-500">I respond within 48 hours.</p>
                  <button type="submit" disabled={submitting || uploading}
                    className="inline-flex items-center gap-2 rounded-full bg-white text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition disabled:opacity-60">
                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                    {submitting ? "Sending…" : "Send message"}
                  </button>
                </div>

                <style>{`
                  .field { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #f5f8ff; transition: border-color .2s, background .2s; }
                  .field::placeholder { color: #64748b; }
                  .field:focus { outline: none; border-color: #6ddcff; background: rgba(109,220,255,0.04); }
                `}</style>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, required, hint, error, className = "", children,
}: {
  label: string; required?: boolean; hint?: string; error?: string;
  className?: string; children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500 flex items-center justify-between">
        <span>{label} {required && <span className="text-sky-300">*</span>}</span>
        {hint && <span className="text-[10px] text-slate-600 normal-case tracking-normal">{hint}</span>}
      </span>
      <div className="mt-2">{children}</div>
      {error && (
        <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-red-300">
          <AlertCircle size={11} /> {error}
        </span>
      )}
    </label>
  );
}
