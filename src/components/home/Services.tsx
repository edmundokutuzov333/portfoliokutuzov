import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  Layers,
  Megaphone,
  Monitor,
  type LucideIcon,
} from "lucide-react";
import { useRef, type MouseEvent } from "react";

type Service = {
  n: string;
  title: string;
  desc: string;
  eyebrow: string;
  deliverables: string[];
  Icon: LucideIcon;
};

const services: Service[] = [
  {
    n: "01",
    title: "Direção de Arte",
    eyebrow: "ART DIRECTION",
    desc: "Construção de linguagens visuais para campanhas, marcas e produtos digitais com consistência estética, intenção narrativa e precisão de execução.",
    deliverables: ["Conceito visual", "Moodboards", "Key visuals", "Guidelines"],
    Icon: Eye,
  },
  {
    n: "02",
    title: "Identidade Visual",
    eyebrow: "BRAND SYSTEM",
    desc: "Sistemas de marca completos, pensados para funcionar em múltiplos pontos de contacto: logotipo, tipografia, cor, grelhas, aplicações e manual visual.",
    deliverables: ["Logo system", "Typography", "Color logic", "Brand book"],
    Icon: Layers,
  },
  {
    n: "03",
    title: "Concepção de Campanhas",
    eyebrow: "CAMPAIGN DESIGN",
    desc: "Desenvolvimento de campanhas com conceito forte, direção visual memorável e peças preparadas para ambientes digitais, impressos e sociais.",
    deliverables: ["Big idea", "Visual rollout", "Social assets", "Launch kit"],
    Icon: Megaphone,
  },
  {
    n: "04",
    title: "Design Digital",
    eyebrow: "DIGITAL EXPERIENCE",
    desc: "Websites, landing pages, interfaces editoriais e sistemas digitais com atenção a hierarquia, interação, movimento, responsividade e experiência visual.",
    deliverables: ["Web design", "UI systems", "Motion language", "Responsive layouts"],
    Icon: Monitor,
  },
];

function ServiceRow({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;

    const rect = element.getBoundingClientRect();
    element.style.setProperty("--lx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--ly", `${event.clientY - rect.top}px`);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={handleMove}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        delay: index * 0.075,
        duration: 0.72,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden border-b border-white/[0.08] px-2 py-8 md:px-4 md:py-11"
      style={{
        backgroundImage:
          "radial-gradient(420px circle at var(--lx, -220px) var(--ly, -220px), rgba(29,155,255,0.13), transparent 58%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/45 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-sky-400/35 to-transparent" />
      </div>

      <div className="grid grid-cols-12 items-start gap-x-5 gap-y-6">
        <div className="col-span-3 md:col-span-1">
          <div className="mono text-[10px] font-medium tracking-[0.24em] text-sky-300/80">
            {service.n}
          </div>
        </div>

        <div className="col-span-9 md:col-span-3">
          <p className="mono mb-3 text-[10px] font-medium tracking-[0.28em] text-slate-500 transition group-hover:text-sky-200/70">
            {service.eyebrow}
          </p>

          <h3 className="display max-w-[12ch] text-3xl leading-[0.96] tracking-[-0.02em] text-slate-100 md:text-5xl">
            {service.title}
          </h3>
        </div>

        <div className="col-span-12 md:col-span-4">
          <p className="max-w-xl text-sm leading-7 text-slate-400 md:text-[15px]">
            {service.desc}
          </p>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="flex flex-wrap gap-2">
            {service.deliverables.map((item) => (
              <span
                key={item}
                className="mono rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[10px] tracking-[0.16em] text-slate-400 transition group-hover:border-sky-300/20 group-hover:text-sky-100"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="col-span-12 flex items-center justify-between md:col-span-1 md:justify-end">
          <div className="mono text-[10px] tracking-[0.2em] text-slate-600 md:hidden">
            SERVICE / {service.n}
          </div>

          <div className="relative grid h-12 w-12 place-items-center rounded-full border border-white/[0.1] bg-slate-950/40 text-slate-300 transition duration-300 group-hover:border-sky-300/40 group-hover:bg-sky-400/[0.08] group-hover:text-sky-100 group-hover:shadow-[0_0_42px_rgba(29,155,255,0.22)]">
            <service.Icon
              size={18}
              strokeWidth={1.7}
              className="transition duration-300 group-hover:scale-90 group-hover:opacity-0"
            />
            <ArrowUpRight
              size={18}
              strokeWidth={1.7}
              className="absolute scale-75 opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 flex items-end justify-between gap-8">
          <div>
            <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
              /// SERVIÇOS — N° 03
            </p>

            <h2 className="display mt-5 max-w-3xl text-4xl leading-[0.98] tracking-[-0.03em] text-metal md:text-6xl">
              Disciplinas visuais para marcas com precisão.
            </h2>
          </div>

          <div className="hidden max-w-[260px] border-l border-white/[0.08] pl-6 md:block">
            <p className="mono text-[10px] leading-5 tracking-[0.2em] text-slate-500">
              BRAND LOGIC / VISUAL SYSTEMS / DIGITAL PRESENCE
            </p>
          </div>
        </div>

        <div className="relative border-t border-white/[0.08]">
          <div className="pointer-events-none absolute -top-px left-0 h-px w-40 bg-gradient-to-r from-sky-300/70 to-transparent" />

          {services.map((service, index) => (
            <ServiceRow key={service.n} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
