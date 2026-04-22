import { motion } from "framer-motion";

export function Manifesto() {
  return (
    <section className="relative px-5 md:px-8 py-28">
      <div className="max-w-[1240px] mx-auto">
        <p className="mono text-[10px] text-[var(--color-acc-magenta)]">
          /// MANIFESTO — N° 02
        </p>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
          className="display text-[34px] sm:text-5xl md:text-7xl leading-[0.98] mt-6 max-w-5xl tracking-[-0.02em]"
        >
          <span className="text-metal">A marca não precisa</span>{" "}
          <span className="italic text-acid">gritar.</span>{" "}
          <span className="text-metal">Ela precisa ficar na</span>{" "}
          <span className="italic text-metal">memória.</span>
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          className="origin-left mt-12 h-px bg-gradient-to-r from-[var(--color-acc-cyan)] via-[var(--color-acc-violet)] to-transparent"
        />

        <div className="mt-12 grid md:grid-cols-2 gap-10 md:gap-16">
          <p className="text-[15px] md:text-base text-[var(--color-text-muted)] leading-relaxed">
            Trabalho marcas como sistemas vivos: estratégia traduzida em forma,
            ritmo, contraste e tipografia. Cada decisão visual responde a uma
            intenção — e cada intenção carrega uma estética. Não desenho
            “bonitos”. Desenho marcas que resistem ao tempo, ao scroll e ao
            ruído do mercado.
          </p>
          <p className="text-[15px] md:text-base text-[var(--color-text-muted)] leading-relaxed">
            O processo combina precisão de design system com acidente
            controlado: grelhas rígidas, depois rupturas calculadas. Tipografia
            como arquitetura. Cor como temperatura emocional. O resultado é uma
            presença visual que não pede licença para existir.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 border border-white/8">
          {[
            ["FORMA", "tensão e respiração"],
            ["RITMO", "sequência e pausa"],
            ["CONTRASTE", "peso e silêncio"],
            ["SISTEMA", "regra e exceção"],
          ].map(([k, v]) => (
            <div key={k} className="bg-[var(--color-bg)] p-5">
              <div className="mono text-[10px] text-[var(--color-acc-cyan)]">{k}</div>
              <div className="mt-2 text-sm text-[var(--color-text)]">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
