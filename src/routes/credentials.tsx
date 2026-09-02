import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Globe, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { useSiteSettings, useClients } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

export const Route = createFileRoute("/credentials")({
  head: () => ({
    meta: [
      { title: "The Credentials - Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Experience, skills and selected brands worked with as art director and graphic designer by Edmundo Kutuzov.",
      },
      { property: "og:title", content: "The Credentials - Edmundo Kutuzov" },
      {
        property: "og:description",
        content:
          "Experience, skills and selected brands worked with as art director and graphic designer.",
      },
    ],
  }),
  component: CredentialsPage,
});

type Exp = { role: string; company: string; period: string };

const FALLBACK_EXPERIENCE: Exp[] = [
  {
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
    period: "2024 - Present",
  },
  { role: "Art Director", company: "SPOT Comunicação", period: "2023 - 2024" },
  { role: "Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
  },
  { role: "Graphic Designer", company: "Agência Creer", period: "2020 - 2023" },
];

const METRICS = [
  { value: "6+", label: "Years", context: "Directing visual communication & strategy" },
  { value: "150+", label: "Projects", context: "Delivered across brand, digital & print" },
  { value: "30+", label: "Brands", context: "National and international collaborations" },
  { value: "3", label: "Continents", context: "Global creative exposure & delivery" },
  { value: "360º", label: "Capability", context: "From high-level strategy to craft execution" },
];

const CAPABILITY_GROUPS = [
  {
    category: "Core Disciplines",
    items: [
      "Art Direction",
      "Brand Identity Systems",
      "Campaign Design",
      "Creative Direction",
      "Visual Hierarchy & Typography",
    ],
  },
  {
    category: "Digital & Motion",
    items: [
      "Social-First Content Systems",
      "Motion Design & Key Art",
      "UI/UX Design Systems",
      "AI Creative Direction",
      "Audiovisual Storytelling",
    ],
  },
  {
    category: "Print & Special Projects",
    items: [
      "Editorial & Publications",
      "Large-Format OOH Billboards",
      "Packaging & Print Prep",
      "Music Video & Single Rollouts",
      "Streetwear Curation",
    ],
  },
];

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

function CredentialsPage() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const reducedMotion = useReducedMotion();

  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "about", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);

  const experience = r<Exp[]>("experience", FALLBACK_EXPERIENCE);
  const brands = r<string[]>("brands", []);

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text-primary)]">
      {/* 1. HERO HEADER */}
      <section className="relative px-4 md:px-8 pt-44 md:pt-48 pb-16 overflow-hidden">
        <div className="max-w-[var(--width-wide)] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            className="flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase mb-12"
          >
            <div>{r("eyebrow", "The Credentials")}</div>
            <div>{r("top_right", "Edmundo Kutuzov · Art Director")}</div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
            className="display text-[clamp(2.75rem,7vw+1rem,7.5rem)] leading-[0.96] tracking-[-0.025em] max-w-5xl"
          >
            <span className="text-[var(--color-text-primary)]">
              {r("title_1", "Strategy, craft and a sharp")}{" "}
            </span>
            <span className="italic text-sky-300 font-normal">
              {r("title_accent", "point of view.")}
            </span>
          </motion.h1>

          {/* Bio & Contact Sidebar */}
          <div className="mt-16 md:mt-24 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="lg:col-span-7 text-[16px] md:text-[18px] text-slate-300 leading-relaxed space-y-6 font-normal"
            >
              <p>
                {r(
                  "bio_p1",
                  "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action — blending storytelling, visual hierarchy, and typographic craft.",
                )}
              </p>
              <p>
                {r(
                  "bio_p2",
                  "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
                )}
              </p>
              <p>
                {r(
                  "bio_p3",
                  "My focus is always on experiences that generate recognition and measurable results — every choice I make is designed to maximise impact, perception, and brand memory.",
                )}
              </p>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-semibold bg-white text-black hover:bg-sky-300 transition-colors"
                >
                  <span>Start a Conversation</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-slate-300 hover:text-white border border-white/[0.1] hover:border-white/[0.2] transition-colors"
                >
                  Explore Capabilities
                </Link>
              </div>
            </motion.div>

            {/* Direct Contact Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: EASE_EDITORIAL }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl border border-white/[0.1] bg-[#030712] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between pb-6 border-b border-white/[0.08]">
                  <p className="mono text-[10px] tracking-[0.24em] text-sky-300/80 uppercase">
                    Direct Contact &amp; Studio
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Available 2026
                  </span>
                </div>

                <div className="mt-6 space-y-5 text-sm">
                  <div className="flex items-start gap-3.5">
                    <Mail size={16} className="text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="mono text-[10px] uppercase text-slate-500 tracking-wider">
                        Email
                      </div>
                      <a
                        href={`mailto:${r("email", "contact@edmundokutuzov.art")}`}
                        className="text-white hover:text-sky-300 transition-colors font-medium"
                      >
                        {r("email", "contact@edmundokutuzov.art")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <Phone size={16} className="text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="mono text-[10px] uppercase text-slate-500 tracking-wider">
                        Phone / WhatsApp
                      </div>
                      <a
                        href={`tel:${String(r("phone", "+258 87 601 312 1")).replace(/\s/g, "")}`}
                        className="text-white hover:text-sky-300 transition-colors font-medium"
                      >
                        {r("phone", "+258 87 601 312 1")}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <MapPin size={16} className="text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="mono text-[10px] uppercase text-slate-500 tracking-wider">
                        Location
                      </div>
                      <div className="text-slate-300">
                        {r("location", 'Magoanine "C", Maputo · Mozambique')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-wrap gap-2">
                  {[
                    { label: "LinkedIn", href: s("linkedin", "#") },
                    { label: "Instagram", href: s("instagram", "#") },
                    { label: "Facebook", href: s("facebook", "#") },
                  ].map((soc) => (
                    <a
                      key={soc.label}
                      href={soc.href}
                      target="_blank"
                      rel="noreferrer"
                      className="mono text-[10px] tracking-[0.15em] uppercase rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 text-slate-300 hover:text-white hover:border-sky-400/40 hover:bg-sky-950/20 transition-all duration-300"
                    >
                      {soc.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. IN NUMBERS METRICS GRID */}
      <section className="relative px-4 md:px-8 py-16 border-y border-white/[0.08] bg-[#02050c]">
        <div className="max-w-[var(--width-wide)] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
            {METRICS.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06, duration: 0.6, ease: EASE_EDITORIAL }}
                className="bg-[#040915] p-6 md:p-8 flex flex-col justify-between group hover:bg-[#081326] transition-colors duration-500"
              >
                <div className="display text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight group-hover:text-sky-300 transition-colors">
                  {c.value}
                </div>
                <div className="mt-6">
                  <div className="mono text-[10px] tracking-[0.2em] text-sky-400 font-semibold uppercase">
                    {c.label}
                  </div>
                  <div className="mt-1 text-[12px] leading-snug text-slate-400">{c.context}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE TIMELINE */}
      <section className="relative px-4 md:px-8 py-24 md:py-32">
        <div className="max-w-[var(--width-wide)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-white/[0.08] gap-4"
          >
            <div>
              <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase">
                Career History
              </p>
              <h2 className="display text-3xl md:text-5xl text-white mt-2 tracking-tight">
                Professional Experience
              </h2>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Chronological track record of agency and studio leadership across Mozambique.
            </p>
          </motion.div>

          <div className="flex flex-col">
            {experience.map((item, i) => {
              const isPresent = item.period.toLowerCase().includes("present");

              return (
                <motion.div
                  key={`${item.role}-${item.company}-${i}`}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.06, duration: 0.6, ease: EASE_EDITORIAL }}
                  className={`group relative grid grid-cols-1 md:grid-cols-12 gap-4 py-8 border-b border-white/[0.08] items-baseline rounded-xl transition-all duration-300 px-4 -mx-4 ${
                    isPresent
                      ? "bg-sky-950/10 border-sky-400/20 hover:bg-sky-950/20"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  <div className="md:col-span-3 mono text-xs tracking-[0.2em] text-sky-300/90 uppercase flex items-center gap-2">
                    {item.period}
                    {isPresent && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    )}
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="display text-xl sm:text-2xl text-white font-medium group-hover:text-sky-200 transition-colors">
                      {item.role}
                    </h3>
                  </div>

                  <div className="md:col-span-4 text-sm md:text-[15px] text-slate-300 font-normal">
                    {item.company}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. CAPABILITIES HIERARCHY */}
      <section className="relative px-4 md:px-8 py-20 border-t border-white/[0.08] bg-[#02050c]">
        <div className="max-w-[var(--width-wide)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="mb-12 pb-6 border-b border-white/[0.08]"
          >
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase">
              Skill Taxonomy
            </p>
            <h2 className="display text-3xl md:text-5xl text-white mt-2 tracking-tight">
              Scope of Competencies
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {CAPABILITY_GROUPS.map((group, gIdx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: gIdx * 0.1, duration: 0.6, ease: EASE_EDITORIAL }}
                className="rounded-2xl border border-white/[0.08] bg-[#040915] p-8"
              >
                <div className="mono text-[11px] tracking-[0.2em] text-sky-300 font-semibold uppercase mb-6 pb-3 border-b border-white/[0.06]">
                  {group.category}
                </div>
                <ul className="space-y-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm md:text-base text-slate-300 group cursor-default"
                    >
                      <CheckCircle2
                        size={15}
                        className="text-sky-400 shrink-0 group-hover:scale-110 transition-transform"
                      />
                      <span className="group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SELECTED BRANDS & COLLABORATIONS */}
      <section className="relative px-4 md:px-8 py-24 md:py-32 border-t border-white/[0.08]">
        <div className="max-w-[var(--width-wide)] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            className="flex items-center justify-between mb-12 pb-6 border-b border-white/[0.08]"
          >
            <div>
              <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase">
                Proven Track Record
              </p>
              <h2 className="display text-3xl md:text-5xl text-white mt-2 tracking-tight">
                Selected Collaborations
              </h2>
            </div>
            <span className="mono text-[11px] tracking-[0.2em] text-slate-500 uppercase hidden sm:block">
              {brands.length || clients.length}+ Brands
            </span>
          </motion.div>

          <div className="flex flex-wrap gap-2.5 md:gap-3">
            {brands.map((brandName, bIdx) => (
              <motion.div
                key={brandName}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: bIdx * 0.02, duration: 0.4 }}
                className="mono rounded-xl bg-white/[0.02] hover:bg-sky-950/25 px-4 py-2.5 text-[11px] tracking-[0.1em] uppercase text-slate-300 hover:text-sky-200 border border-white/[0.08] hover:border-sky-400/40 transition-all duration-300 cursor-default"
              >
                {brandName}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. REFERENCE TYPOGRAPHIC SIGNATURE */}
      <section className="relative px-4 md:px-8 py-16 border-t border-white/[0.08] bg-[#02050c]">
        <div className="max-w-[var(--width-wide)] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-sky-400" />
            <p className="mono text-[10px] tracking-[0.28em] text-slate-400 uppercase">Reference</p>
          </div>
          <p className="display text-3xl md:text-4xl tracking-[0.04em] text-sky-300 font-medium italic">
            GOD
          </p>
        </div>
      </section>
    </div>
  );
}
