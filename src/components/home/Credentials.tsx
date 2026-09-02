import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

type Exp = { period: string; role: string; company: string };
type Card = { value: string; label: string; context: string };

const FALLBACK_EXPERIENCE: Exp[] = [
  { period: "2020 - 2023", role: "Graphic Designer", company: "Agência Creer" },
  {
    period: "2023",
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
  },
  { period: "2023", role: "Graphic Designer", company: "Ikigai Moçambique" },
  { period: "2023 - 2024", role: "Art Director", company: "SPOT Comunicação" },
  {
    period: "2024 - Present",
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
  },
];

const FALLBACK_CARDS: Card[] = [
  { value: "6+", label: "Years", context: "directing visual communication" },
  { value: "150+", label: "Projects", context: "across multiple disciplines" },
  { value: "30+", label: "Brands", context: "national and international" },
  { value: "3", label: "Continents", context: "global collaborations" },
  { value: "360º", label: "Capability", context: "from strategy to execution" },
];

export function Credentials() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "credentials", f, fb);

  const experience = r<Exp[]>("experience", FALLBACK_EXPERIENCE);
  const cards = r<Card[]>("cards", FALLBACK_CARDS);
  const reference = r<string>("reference", "GOD");

  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-6">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">The Credentials</p>
            <h2 className="display text-3xl md:text-5xl mt-4 text-metal leading-[1.02] tracking-[-0.025em]">
              Strategy, craft and a sharp <span className="italic text-accent">point of view.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <p className="text-[15px] text-slate-400 leading-relaxed">
              Six years building visual systems and campaigns for brands across Mozambique and
              beyond.
            </p>
          </div>
        </div>

        {/* Experience timeline */}
        <div>
          <p className="mono text-[10px] tracking-[0.22em] text-slate-500 mb-4">Experience</p>
          <div className="border-t border-white/[0.08]">
            {experience.map((item, i) => (
              <motion.div
                key={`${item.role}-${item.company}-${i}`}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="grid grid-cols-12 gap-4 py-6 border-b border-white/[0.08] items-baseline hover:bg-white/[0.02] transition px-4 -mx-4 rounded-lg"
              >
                <div className="col-span-12 md:col-span-3 mono text-[11px] tracking-[0.2em] text-sky-300/75">
                  {item.period}
                </div>
                <div className="col-span-12 md:col-span-6 display text-lg md:text-xl text-slate-100">
                  {item.role}
                </div>
                <div className="col-span-12 md:col-span-3 text-sm text-slate-400">
                  {item.company}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary cards with context */}
        <div className="mt-24">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bg-[#030814] p-8 min-h-[180px] flex flex-col justify-between group hover:bg-[#06111f] transition"
              >
                <div className="display text-4xl md:text-5xl text-white tracking-[-0.02em] group-hover:scale-105 origin-left transition-transform duration-500">
                  {c.value}
                </div>
                <div className="mt-6">
                  <div className="mono text-[10px] tracking-[0.2em] text-sky-300/70">{c.label}</div>
                  <div className="mt-1 text-[13px] leading-snug text-slate-400">{c.context}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Capabilities Hierarchy */}
        <div className="mt-32">
          <p className="mono text-[10px] tracking-[0.22em] text-slate-500 mb-8">Capabilities</p>
          <div className="grid md:grid-cols-3 gap-12 border-t border-white/[0.08] pt-12">
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-sky-200 mb-6">Core</div>
              <ul className="space-y-4">
                <li className="text-lg text-slate-200 display">Art Direction</li>
                <li className="text-lg text-slate-200 display">Brand Identity</li>
                <li className="text-lg text-slate-200 display">Campaign Design</li>
                <li className="text-lg text-slate-200 display">Creative Direction</li>
              </ul>
            </div>
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-slate-400 mb-6">Extended</div>
              <ul className="space-y-4">
                <li className="text-lg text-slate-300 display">AI Creative Direction</li>
                <li className="text-lg text-slate-300 display">Digital Design</li>
                <li className="text-lg text-slate-300 display">Audiovisual</li>
                <li className="text-lg text-slate-300 display">Web / Interactive</li>
              </ul>
            </div>
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-slate-500 mb-6">
                Special Projects
              </div>
              <ul className="space-y-4">
                <li className="text-lg text-slate-400 display">Fashion</li>
                <li className="text-lg text-slate-400 display">Music</li>
                <li className="text-lg text-slate-400 display">Creative Experiments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reference */}
        <div className="mt-32 flex items-center justify-between border-t border-white/[0.08] pt-8">
          <p className="mono text-[10px] tracking-[0.28em] text-slate-500">Reference</p>
          <p className="display text-2xl md:text-3xl tracking-[0.02em] text-accent italic">
            {reference}
          </p>
        </div>
      </div>
    </section>
  );
}
