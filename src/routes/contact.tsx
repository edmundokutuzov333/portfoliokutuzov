import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail, Instagram, Linkedin, Facebook, Phone, MapPin } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Edmundo Kutuzov" },
      { name: "description", content: "Get in touch with Edmundo Kutuzov, art director based in Maputo, Mozambique." },
      { property: "og:title", content: "Contact - Edmundo Kutuzov" },
      { property: "og:description", content: "Briefing, collaborations and new visual projects." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "contact", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);

  const projectTypes = r<string[]>("project_types", ["Brand Identity", "Art Direction", "Other"]);
  const budgets = r<string[]>("budgets", ["< 5K€", "5K - 15K€", "15K - 40K€", "40K€ +"]);
  const email = r("email", "edmundokutuzov.mz@gmail.com");
  const phone = r("phone", "+258 87 601 312 1");

  const [name, setName] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets[1] ?? budgets[0]);
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setReady(true); };

  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Briefing - ${type} - ${name || "new project"}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${emailVal}\nProject type: ${type}\nBudget: ${budget}\n\n${msg}`)}`;

  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>{r("eyebrow", "Contact")}</div>
          <div>{r("status", "Open for 2026 projects")}</div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <h1 className="display text-5xl md:text-7xl leading-[0.98] tracking-[-0.02em]">
              <span className="text-metal">{r("title_1", "Let's")} </span>
              <span className="italic text-accent">{r("title_accent", "talk.")}</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] text-slate-400 leading-relaxed">{r("subtitle", "")}</p>

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

          <motion.form onSubmit={onSubmit}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="md:col-span-6 relative rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-6 md:p-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name" required>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="field" placeholder="Your name" />
              </Field>
              <Field label="Email" required>
                <input required type="email" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="field" placeholder="you@company.com" />
              </Field>
            </div>

            <Field label="Project type" className="mt-5">
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((p) => (
                  <button type="button" key={p} onClick={() => setType(p)}
                    className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${type === p ? "bg-white text-black border-white" : "border-white/10 text-slate-400 hover:text-white"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Estimated budget" className="mt-5">
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button type="button" key={b} onClick={() => setBudget(b)}
                    className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${budget === b ? "bg-sky-300 text-[#01040A] border-sky-300" : "border-white/10 text-slate-400 hover:text-white"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Message" className="mt-5" required>
              <textarea required value={msg} onChange={(e) => setMsg(e.target.value)} rows={5} className="field resize-none"
                placeholder="Tell me about the brand, the challenge and the timeline…" />
            </Field>

            <div className="mt-6 flex items-center justify-between gap-4">
              {ready ? (
                <a href={mailto} className="inline-flex items-center gap-2 rounded-full bg-sky-300 text-[#01040A] px-5 py-3 text-sm font-semibold">
                  <Check size={15} /> Message ready - open email
                </a>
              ) : (
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition">
                  Prepare message <Send size={14} />
                </button>
              )}
            </div>

            <style>{`
              .field { width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 14px; font-size: 14px; color: #f5f8ff; transition: border-color .2s, background .2s; }
              .field::placeholder { color: #64748b; }
              .field:focus { outline: none; border-color: #6ddcff; background: rgba(109,220,255,0.04); }
            `}</style>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, required, className = "", children }: { label: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mono text-[10px] tracking-[0.2em] text-slate-500">
        {label} {required && <span className="text-sky-300">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
