import { motion } from "framer-motion";
import { clients } from "@/data/clients";

// Each client gets a slightly different typographic treatment so the
// placeholders read as real wordmarks, not boxes.
const styles: Record<string, { font: string; letter: string; mark?: string }> = {
  NOVA: { font: "display font-semibold", letter: "tracking-[0.18em]", mark: "★" },
  KORA: { font: "display font-medium italic", letter: "tracking-[0.04em]" },
  ALMA: { font: "font-light", letter: "tracking-[0.42em]" },
  VOLT: { font: "display font-bold", letter: "tracking-[-0.04em]", mark: "/" },
  NEXUS: { font: "mono", letter: "tracking-[0.3em]" },
  AURORA: { font: "display font-medium", letter: "tracking-[0.08em]", mark: "○" },
  MINT: { font: "font-semibold", letter: "tracking-[0.02em]" },
  ORBIT: { font: "display font-light", letter: "tracking-[0.24em]", mark: "◐" },
  LUME: { font: "display font-semibold italic", letter: "tracking-[0]" },
  ATLAS: { font: "mono font-semibold", letter: "tracking-[0.18em]", mark: "△" },
  NOIR: { font: "font-bold", letter: "tracking-[0.4em]" },
  BRAVA: { font: "display font-medium", letter: "tracking-[0.08em]", mark: "·" },
};

export function ClientLogos() {
  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-4">
            <p className="mono text-[10px] text-[var(--color-acc-cyan)]">
              /// CLIENTES &amp; COLABORAÇÕES
            </p>
            <h2 className="display text-3xl md:text-4xl mt-4 text-metal leading-[1.05]">
              Marcas que passaram
              <br /> pelo processo.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Algumas marcas, equipas e projetos que já passaram pelo meu
              processo visual — entre identidade, direção de arte e sistemas
              digitais.
            </p>
          </div>
        </div>

        <div className="border-t border-white/8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {clients.map((c, i) => {
            const s = styles[c];
            return (
              <motion.div
                key={c}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.04, duration: 0.5 }}
                className="group relative h-28 md:h-32 border-b border-r border-white/8 flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors"
              >
                <span className="absolute top-2 left-3 mono text-[9px] text-[var(--color-text-ghost)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={${s.font} ${s.letter} text-base md:text-lg uppercase}>
                  {s.mark && <span className="mr-1.5 opacity-60">{s.mark}</span>}
                  {c}
                </span>
                <span className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-acc-cyan)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
