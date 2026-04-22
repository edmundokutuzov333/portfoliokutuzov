import { motion } from "framer-motion";
import { Layers, Eye, BookOpen, Monitor, ArrowUpRight, type LucideIcon } from "lucide-react";
import { useRef } from "react";

type Service = {
  n: string;
  title: string;
  desc: string;
  Icon: LucideIcon;
};

const services: Service[] = [
  {
    n: "01",
    title: "Identidade Visual",
    desc: "Sistemas de marca completos: estratégia, naming visual, logotipo, tipografia, cor, grelhas e guidelines.",
    Icon: Layers,
  },
  {
    n: "02",
    title: "Direção de Arte",
    desc: "Direção visual para campanhas, produtos digitais e séries editoriais com linguagem consistente.",
    Icon: Eye,
  },
  {
    n: "03",
    title: "Editorial & Print",
    desc: "Revistas, livros, catálogos, posters e relatórios anuais com tipografia e ritmo cuidados.",
    Icon: BookOpen,
  },
  {
    n: "04",
    title: "Design Digital",
    desc: "Websites editoriais, landing pages, design systems e interfaces com motion language própria.",
    Icon: Monitor,
  },
];

function Row({ s, i }: { s: Service; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.06, duration: 0.6 }}
      className="group relative border-b border-white/8 py-8 md:py-10 px-2 overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(280px circle at var(--lx, -200px) var(--ly, -200px), rgba(34,211,238,0.08), transparent 60%)",
      }}
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        <div className="col-span-2 md:col-span-1 mono text-[11px] text-[var(--color-acc-acid)]">
          {s.n}
        </div>
        <div className="col-span-10 md:col-span-5">
          <h3 className="display text-2xl md:text-4xl tracking-tight">{s.title}</h3>
        </div>
        <div className="col-span-12 md:col-span-5 text-sm text-[var(--color-text-muted)] leading-relaxed">
          {s.desc}
        </div>
        <div className="col-span-12 md:col-span-1 flex md:justify-end">
          <div className="h-10 w-10 rounded-full border border-white/10 grid place-items-center group-hover:border-[var(--color-acc-cyan)] group-hover:text-[var(--color-acc-cyan)] transition">
            <s.Icon size={16} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section className="relative px-5 md:px-8 py-28">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <p className="mono text-[10px] text-[var(--color-acc-violet)]">
              /// SERVIÇOS — N° 03
            </p>
            <h2 className="display text-3xl md:text-5xl mt-4 text-metal max-w-2xl leading-[1.05]">
              Quatro disciplinas. Um sistema.
            </h2>
          </div>
          <ArrowUpRight className="text-[var(--color-text-ghost)] hidden md:block" />
        </div>

        <div className="border-t border-white/8">
          {services.map((s, i) => (
            <Row key={s.n} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
