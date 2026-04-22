import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail, Instagram, Linkedin, Dribbble } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contato — Edmundo" },
      {
        name: "description",
        content: "Vamos desenhar uma presença visual impossível de ignorar.",
      },
      { property: "og:title", content: "Contato — Edmundo" },
      {
        property: "og:description",
        content: "Briefing, colaboração e novos projetos visuais.",
      },
    ],
  }),
  component: ContactPage,
});

const projectTypes = ["Identidade Visual", "Direção de Arte", "Editorial", "Digital", "Outro"];
const budgets = ["< 5K€", "5K — 15K€", "15K — 40K€", "40K€ +"];

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState(projectTypes[0]);
  const [budget, setBudget] = useState(budgets[1]);
  const [msg, setMsg] = useState("");
  const [ready, setReady] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReady(true);
  };

  const mailto = `mailto:edmundo@studio.com?subject=${encodeURIComponent(
    `Briefing — ${type} — ${name || "novo projeto"}`
  )}&body=${encodeURIComponent(
    `Nome: ${name}\nEmail: ${email}\nTipo: ${type}\nOrçamento: ${budget}\n\n${msg}`
  )}`;

  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] text-[var(--color-text-ghost)]">
          <div>N° 004 — INDEX</div>
          <div>OPEN FOR 2026 PROJECTS</div>
        </div>

        <div className="mt-8 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <h1 className="display text-5xl md:text-7xl leading-[0.98] tracking-[-0.02em]">
              <span className="text-metal">Vamos </span>
              <span className="italic text-acid">conversar.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] text-[var(--color-text-muted)] leading-relaxed">
              Conta-me sobre o teu projeto. Respondo a todas as mensagens em
              até 48 horas, com uma proposta inicial de processo.
            </p>

            <div className="mt-12 space-y-5">
              <a
                href="mailto:edmundo@studio.com"
                className="flex items-center gap-3 group"
              >
                <span className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-[var(--color-acc-cyan)]">
                  <Mail size={15} />
                </span>
                <span className="text-sm group-hover:text-[var(--color-acc-cyan)]">
                  edmundo@studio.com
                </span>
              </a>

              <div className="flex items-center gap-2">
                {[
                  { icon: Instagram, label: "Instagram" },
                  { icon: Dribbble, label: "Dribbble" },
                  { icon: Linkedin, label: "LinkedIn" },
                ].map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="h-10 w-10 rounded-full border border-white/10 grid place-items-center text-[var(--color-text-muted)] hover:text-white hover:border-white/30"
                  >
                    <Icon size={15} />
                  </a>
                ))}
                <a
                  href="#"
                  aria-label="Behance"
                  className="h-10 px-3 rounded-full border border-white/10 grid place-items-center mono text-[10px] text-[var(--color-text-muted)] hover:text-white hover:border-white/30"
                >
                  Be.
                </a>
              </div>

              <div className="pt-8 border-t border-white/8 mono text-[10px] text-[var(--color-text-ghost)] space-y-1">
                <div>MAPUTO — MZ &nbsp;·&nbsp; UTC+02</div>
                <div>SÃO PAULO — BR &nbsp;·&nbsp; UTC-03</div>
                <div>REMOTE / WORLDWIDE</div>
              </div>
            </div>
          </div>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-6 relative rounded-2xl border border-white/8 bg-[var(--color-surface)] p-6 md:p-8"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nome" required>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field"
                  placeholder="Maria Silva"
                />
              </Field>
              <Field label="Email" required>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="field"
                  placeholder="maria@empresa.com"
                />
              </Field>
            </div>

            <Field label="Tipo de projeto" className="mt-5">
              <div className="flex flex-wrap gap-2">
                {projectTypes.map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setType(p)}
                    className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${
                      type === p
                        ? "bg-white text-black border-white"
                        : "border-white/10 text-[var(--color-text-muted)] hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Orçamento estimado" className="mt-5">
              <div className="flex flex-wrap gap-2">
                {budgets.map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`px-3 py-1.5 rounded-full text-[12px] mono border transition ${
                      budget === b
                        ? "bg-[var(--color-acc-acid)] text-black border-[var(--color-acc-acid)]"
                        : "border-white/10 text-[var(--color-text-muted)] hover:text-white"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Mensagem" className="mt-5" required>
              <textarea
                required
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                rows={5}
                className="field resize-none"
                placeholder="Conta-me sobre a marca, o desafio e os prazos…"
              />
            </Field>

            <div className="mt-6 flex items-center justify-between gap-4">
              {ready ? (
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-acc-acid)] text-black px-5 py-3 text-sm font-semibold"
                >
                  <Check size={15} /> Mensagem preparada — abrir email
                </a>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-[var(--color-acc-acid)] transition"
                >
                  Preparar mensagem <Send size={14} />
                </button>
              )}
              <span className="mono text-[10px] text-[var(--color-text-ghost)]">
                / FORM-001
              </span>
            </div>

            <style>{`
              .field {
                width: 100%;
                background: transparent;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 12px 14px;
                font-size: 14px;
                color: #f4f1ff;
                transition: border-color .2s, background .2s;
              }
              .field::placeholder { color: #464254; }
              .field:focus { outline: none; border-color: #22d3ee; background: rgba(34,211,238,0.04); }
            `}</style>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mono text-[10px] text-[var(--color-text-ghost)]">
        {label.toUpperCase()} {required && <span className="text-[var(--color-acc-acid)]">*</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
