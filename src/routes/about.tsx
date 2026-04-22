import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre — Edmundo" },
      {
        name: "description",
        content:
          "Edmundo é designer gráfico e art director: estratégia visual, sistemas e direção criativa.",
      },
      { property: "og:title", content: "Sobre — Edmundo" },
      {
        property: "og:description",
        content: "Entre precisão estratégica e acidente visual controlado.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  ["08", "anos de experiência"],
  ["120+", "projetos"],
  ["16", "setores"],
  ["03", "continentes"],
];

const method = [
  ["01", "Diagnóstico", "Imersão estratégica, análise competitiva e definição de território visual."],
  ["02", "Sistema", "Construção de identidade modular: tipografia, cor, grelhas, motion e tokens."],
  ["03", "Direção", "Aplicação em campanhas, produtos digitais, editorial e ambiente físico."],
  ["04", "Entrega", "Guidelines, ativos finais, governance e suporte de implementação."],
];

export function AboutPage() {
  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] text-[var(--color-text-ghost)]">
          <div>N° 003 — INDEX</div>
          <div>EDMUNDO — DESIGNER &amp; ART DIRECTOR</div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="display text-4xl sm:text-6xl md:text-7xl mt-8 leading-[0.98] tracking-[-0.02em] max-w-5xl"
        >
          <span className="text-metal">Entre </span>
          <span className="italic text-acid">precisão estratégica</span>
          <span className="text-metal"> e acidente visual </span>
          <span className="italic text-metal">controlado.</span>
        </motion.h1>

        <div className="mt-16 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 text-[15px] text-[var(--color-text-muted)] leading-relaxed space-y-5">
            <p>
              Sou Edmundo — designer gráfico e art director, focado em construir
              sistemas visuais para marcas que recusam aparência genérica.
              Trabalho na intersecção entre estratégia de marca, direção de
              arte e design digital.
            </p>
            <p>
              Combino metodologia rígida com instinto visual: cada projeto
              começa com diagnóstico estratégico e termina em sistemas que
              escalam. Acredito em tipografia como arquitetura, cor como
              temperatura emocional e contraste como ferramenta narrativa.
            </p>
            <p>
              Trabalho remotamente desde Maputo e São Paulo, com clientes em
              três continentes — startups tecnológicas, marcas culturais,
              produtos digitais e instituições.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="grid grid-cols-2 gap-px bg-white/8 border border-white/8">
              {stats.map(([n, label]) => (
                <div key={label} className="bg-[var(--color-bg)] p-5">
                  <div className="display text-4xl md:text-5xl text-metal">{n}</div>
                  <div className="mono text-[10px] text-[var(--color-text-ghost)] mt-2">
                    {label.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-28">
          <p className="mono text-[10px] text-[var(--color-acc-cyan)]">/// MÉTODO</p>
          <h2 className="display text-3xl md:text-5xl mt-4 text-metal max-w-2xl">
            Quatro fases. Um sistema.
          </h2>

          <div className="mt-10 border-t border-white/8">
            {method.map(([n, t, d], i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="grid grid-cols-12 gap-4 py-8 border-b border-white/8"
              >
                <div className="col-span-2 md:col-span-1 mono text-[11px] text-[var(--color-acc-acid)]">
                  {n}
                </div>
                <div className="col-span-10 md:col-span-4 display text-2xl md:text-3xl">
                  {t}
                </div>
                <div className="col-span-12 md:col-span-7 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {d}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <p className="mono text-[10px] text-[var(--color-acc-magenta)]">/// VALORES</p>
          <div className="mt-6 grid md:grid-cols-3 gap-px bg-white/8 border border-white/8">
            {[
              ["Precisão", "Cada decisão visual responde a uma intenção estratégica."],
              ["Autoria", "Sistemas próprios, não templates. Linguagem reconhecível."],
              ["Resistência", "Marcas que sobrevivem ao tempo, ao scroll e ao ruído."],
            ].map(([t, d]) => (
              <div key={t} className="bg-[var(--color-bg)] p-6">
                <div className="display text-2xl">{t}</div>
                <p className="mt-2 text-sm text-[var(--color-text-muted)] leading-relaxed">
                  {d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
