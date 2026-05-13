import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

type Exp = { period: string; role: string; company: string };
type Card = { value: string; label: string };

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
  { value: "6+", label: "Years of experience" },
  { value: "150+", label: "Projects delivered" },
  { value: "30+", label: "National and international brands" },
  { value: "3", label: "Continents" },
  { value: "360º", label: "Art direction, branding, strategy, AI, marketing" },
];

const FALLBACK_COMPETENCIES: string[] = [
  "Art Direction & Graphic Design",
  "Branding & Brand Strategy",
  "Creative Direction of music videos and commercials",
  "UI/UX and web development",
  "Campaign management and social media content",
  "Creative curation and streetwear collection development",
  "Music release planning (EPs, singles, music videos)",
];

export function Credentials() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "credentials", f, fb);

  const experience = r<Exp[]>("experience", FALLBACK_EXPERIENCE);
  const cards = r<Card[]>("cards", FALLBACK_CARDS);
  const competencies = r<string[]>("competencies", FALLBACK_COMPETENCIES);
  const reference = r<string>("reference", "GOD");

  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 mb-14">
          <div className="col-span-12 md:col-span-5">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">The Credentials</p>
            <h2 className="display text-3xl md:text-5xl mt-4 text-metal leading-[1.02] tracking-[-0.025em]">
              Strategy, craft and a sharp <span className="italic text-accent">point of view.</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <p className="text-sm text-slate-400 leading-relaxed">
              Six years building visual systems and campaigns for brands across Mozambique and
              beyond. The work below is the receipts.
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
                className="grid grid-cols-12 gap-4 py-6 border-b border-white/[0.08] items-baseline"
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

        {/* Summary cards */}
        <div className="mt-20">
          <p className="mono text-[10px] tracking-[0.22em] text-slate-500 mb-6">In numbers</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-lg overflow-hidden">
            {cards.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="bg-[#030814] p-6 md:p-7 min-h-[140px] flex flex-col justify-between"
              >
                <div className="display text-3xl md:text-4xl text-white tracking-[-0.02em]">
                  {c.value}
                </div>
                <div className="mt-3 text-[12px] leading-snug text-slate-400">{c.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key competencies */}
        <div className="mt-20 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <p className="mono text-[10px] tracking-[0.22em] text-slate-500 mb-3">
              Key competencies
            </p>
            <h3 className="display text-2xl md:text-3xl text-metal leading-[1.05]">
              Where I move with confidence.
            </h3>
          </div>
          <div className="md:col-span-8">
            <ul className="space-y-3">
              {competencies.map((skill, i) => (
                <motion.li
                  key={skill}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.04, duration: 0.45 }}
                  className="flex items-start gap-3 text-[15px] text-slate-300 border-b border-white/[0.06] pb-3"
                >
                  <span className="mono text-[10px] tracking-[0.2em] text-sky-300/70 mt-1.5 w-6 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-snug">{skill}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reference */}
        <div className="mt-20 flex items-center justify-between border-t border-white/[0.08] pt-8">
          <p className="mono text-[10px] tracking-[0.28em] text-slate-500">Reference</p>
          <p className="display text-2xl md:text-3xl tracking-[0.02em] text-accent italic">
            {reference}
          </p>
        </div>
      </div>
    </section>
  );
}
