import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { categories, projects, type Project, type ProjectCategory } from "@/data/projects";

type Filter = "Todos" | ProjectCategory;

function ProjectVisual({ p }: { p: Project }) {
  return (
    <div className={clsx("absolute inset-0 bg-gradient-to-br", p.palette)}>
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6), transparent 50%), radial-gradient(circle at 80% 80%, rgba(0,0,0,0.7), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute inset-0 mix-blend-soft-light opacity-40"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between mono text-[10px] text-white/70">
        <span>{String(p.id).padStart(2, "0")} / {p.category.toUpperCase()}</span>
        <span>{p.year}</span>
      </div>
      <div className="absolute bottom-5 left-5 right-5">
        <div className="display text-3xl md:text-4xl text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.4)]">
          {p.title}
        </div>
        <div className="mono text-[10px] text-white/80 mt-1">{p.subtitle}</div>
      </div>
    </div>
  );
}

export function PortfolioGrid() {
  const [filter, setFilter] = useState<Filter>("Todos");
  const [active, setActive] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === "Todos" ? projects : projects.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setFilter(c)}
            className={clsx(
              "px-4 py-2 rounded-full text-[12px] mono border transition",
              filter === c
                ? "bg-white text-black border-white"
                : "border-white/10 text-[var(--color-text-muted)] hover:text-white hover:border-white/30"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[260px] gap-4">
        {filtered.map((p, i) => (
          <motion.button
            type="button"
            key={p.id}
            onClick={() => setActive(p)}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.05, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className={clsx(
              "group relative overflow-hidden rounded-xl border border-white/8 text-left",
              p.span === "tall" && "lg:row-span-2",
              p.span === "wide" && "lg:col-span-2"
            )}
          >
            <ProjectVisual p={p} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
            <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/10 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition">
              <ArrowUpRight size={14} className="text-white" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm grid place-items-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
              className="relative w-full max-w-5xl max-h-[90vh] overflow-auto rounded-2xl border border-white/10 bg-[var(--color-surface-2)]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-black/40 border border-white/10 grid place-items-center hover:bg-black/60"
                aria-label="Fechar"
              >
                <X size={16} />
              </button>
              <div className="relative h-72 md:h-[420px]">
                <ProjectVisual p={active} />
              </div>
              <div className="p-6 md:p-10 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="mono text-[10px] text-[var(--color-acc-cyan)]">
                    {active.category.toUpperCase()} / {active.year}
                  </div>
                  <h3 className="display text-3xl md:text-5xl mt-3">{active.title}</h3>
                  <p className="mono text-xs text-[var(--color-text-muted)] mt-1">
                    {active.subtitle}
                  </p>
                  <p className="mt-6 text-[15px] text-[var(--color-text-muted)] leading-relaxed">
                    {active.description}
                  </p>
                  <a
                    href={`mailto:edmundo@studio.com?subject=Projeto%20semelhante%20a%20${active.title}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--color-acc-acid)] text-black px-5 py-3 text-sm font-semibold hover:brightness-110 transition"
                  >
                    Solicitar projeto semelhante
                    <ArrowUpRight size={14} />
                  </a>
                </div>
                <div className="space-y-4 mono text-[11px] text-[var(--color-text-muted)]">
                  <div>
                    <div className="text-[var(--color-text-ghost)]">CATEGORIA</div>
                    <div className="text-white mt-1">{active.category}</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-ghost)]">ANO</div>
                    <div className="text-white mt-1">{active.year}</div>
                  </div>
                  <div>
                    <div className="text-[var(--color-text-ghost)]">REF</div>
                    <div className="text-white mt-1">
                      ED-{String(active.id).padStart(3, "0")}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
