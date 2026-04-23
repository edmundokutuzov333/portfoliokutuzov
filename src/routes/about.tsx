import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The Credentials — Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "About Edmundo Kutuzov: art director rooted in Mozambique's creative ecosystem. Experience, skills, brands and contact.",
      },
      { property: "og:title", content: "The Credentials — Edmundo Kutuzov" },
      {
        property: "og:description",
        content:
          "Experience, skills and selected brands worked with as art director and graphic designer.",
      },
    ],
  }),
  component: AboutPage,
});

const experience = [
  { role: "Art Director", company: "SPOT Comunicação", period: "2023 — 2024" },
  { role: "Senior Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
  },
  { role: "Graphic Designer", company: "Agência Creer", period: "2020 — 2023" },
];

const skills: { name: string; value: number }[] = [
  { name: "Adobe Photoshop", value: 95 },
  { name: "Adobe Illustrator", value: 75 },
  { name: "Adobe Premiere", value: 75 },
  { name: "Adobe After Effects", value: 45 },
  { name: "Artificial Intelligence", value: 95 },
];

const brands = [
  "Absa",
  "Vodacom",
  "TotalEnergies",
  "Galp",
  "Nissan",
  "Toyota",
  "Hyundai",
  "MultiChoice",
  "DStv",
  "GOtv",
  "Pernod Ricard",
  "Flying Fish",
  "Brutal",
  "Kit Kat",
  "EMOSE",
  "Moçambique Companhia de Seguros",
  "MEREC",
  "Joaquim Chaves Saúde",
  "PROMAR",
  "Hotel Cardoso",
  "Ponta Apart Hotel",
  "GIZ",
  "RONIL",
];

export function AboutPage() {
  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>The Credentials</div>
          <div>Edmundo Kutuzov — Art Director</div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="display text-4xl sm:text-6xl md:text-7xl mt-8 leading-[0.98] tracking-[-0.02em] max-w-5xl"
        >
          <span className="text-metal">Strategy, craft and a sharp </span>
          <span className="italic text-accent">point of view.</span>
        </motion.h1>

        {/* Bio */}
        <div className="mt-16 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-7 text-[15px] text-slate-400 leading-relaxed space-y-5">
            <p>
              I make ideas stop, take notice, and act. I design visual
              identities and communication pieces that capture attention and
              drive action — blending storytelling, visual hierarchy, and
              typographic craft.
            </p>
            <p>
              I’m Edmundo Kutuzov, an art director deeply rooted in
              Mozambique’s creative ecosystem. I lead projects ranging from ad
              campaigns and music videos to clothing collections and brand
              development. I collaborate with local and international brands,
              with hands-on experience in art direction, graphic design,
              branding, audiovisual creative direction, and creative strategy.
            </p>
            <p>
              My focus is always on experiences that generate recognition and
              measurable results — every choice I make is designed to maximise
              impact and perception.
            </p>
          </div>

          {/* Quick contact panel */}
          <div className="md:col-span-5">
            <div className="border border-white/[0.08] bg-[#030814] p-6 rounded-lg">
              <p className="mono text-[10px] tracking-[0.24em] text-slate-500">
                Direct contact
              </p>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div>
                  <div className="text-slate-500 text-[12px]">Email</div>
                  <a
                    href="mailto:edmundokutuzov@phantom-mz.com"
                    className="hover:text-sky-200 transition"
                  >
                    edmundokutuzov@phantom-mz.com
                  </a>
                </div>
                <div>
                  <div className="text-slate-500 text-[12px]">Phone</div>
                  <a href="tel:+258876013121" className="hover:text-sky-200 transition">
                    +258 87 601 312 1
                  </a>
                </div>
                <div>
                  <div className="text-slate-500 text-[12px]">Location</div>
                  <div>Magoanine “C”, Maputo, Mozambique</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/[0.08] flex flex-wrap gap-2">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4" },
                  { label: "Instagram", href: "https://www.instagram.com/edmundo.kutuzov/" },
                  { label: "Facebook", href: "https://www.facebook.com/edmundoku/" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mono text-[11px] tracking-[0.16em] rounded-full border border-white/[0.1] px-3 py-1.5 text-slate-300 hover:text-sky-200 hover:border-sky-300/30 transition"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mt-28">
          <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">
            Experience
          </p>
          <h2 className="display text-3xl md:text-5xl mt-4 text-metal max-w-2xl">
            A studio-grounded path.
          </h2>

          <div className="mt-10 border-t border-white/[0.08]">
            {experience.map((item, i) => (
              <motion.div
                key={item.role + item.company}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className="grid grid-cols-12 gap-4 py-7 border-b border-white/[0.08] items-baseline"
              >
                <div className="col-span-12 md:col-span-3 mono text-[11px] tracking-[0.2em] text-sky-300/75">
                  {item.period}
                </div>
                <div className="col-span-12 md:col-span-5 display text-xl md:text-2xl text-slate-100">
                  {item.role}
                </div>
                <div className="col-span-12 md:col-span-4 text-sm text-slate-400">
                  {item.company}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-28">
          <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">Skills</p>
          <h2 className="display text-3xl md:text-5xl mt-4 text-metal max-w-2xl">
            Tools and craft.
          </h2>

          <div className="mt-10 grid md:grid-cols-2 gap-x-12 gap-y-6">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[15px] text-slate-200">{skill.name}</span>
                  <span className="mono text-[11px] tracking-[0.16em] text-slate-500">
                    {skill.value}%
                  </span>
                </div>
                <div className="mt-3 h-px bg-white/[0.06] relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.value}%` }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-300 to-sky-500"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div className="mt-28">
          <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">
            Selected Brands
          </p>
          <h2 className="display text-3xl md:text-5xl mt-4 text-metal max-w-3xl">
            Brands and collaborations.
          </h2>
          <p className="mt-5 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
            A non-exhaustive list of brands I have worked with — directly or
            through agency engagements — across campaigns, identity work and
            content systems.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {brands.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-[13px] text-slate-300"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
