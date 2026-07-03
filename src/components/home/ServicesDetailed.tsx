import { motion } from "framer-motion";
import { ArrowUpRight, Eye, Layers, Megaphone, Monitor, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useServices, useProjects } from "@/hooks/useSiteData";
import type { DbService, DbProject } from "@/lib/cms";

const ICONS: Record<string, LucideIcon> = {
  eye: Eye,
  layers: Layers,
  megaphone: Megaphone,
  monitor: Monitor,
};

const DELIVERABLES: Record<string, string[]> = {
  "Art Direction": ["Concept", "Moodboards", "Key visuals", "Guidelines"],
  "Brand Identity": ["Logo system", "Typography", "Colour logic", "Brand book"],
  "Campaign Design": ["Big idea", "Visual rollout", "Social assets", "Launch kit"],
  "Digital Design": ["Web design", "UI systems", "Motion language", "Responsive layouts"],
};

const PROCESS: Record<string, string[]> = {
  "Art Direction": [
    "Discovery — territory, tone, references.",
    "Direction — 2 to 3 visual routes with rationale.",
    "Craft — key visuals, layouts, guidelines.",
    "Handoff — production-ready system and rules.",
  ],
  "Brand Identity": [
    "Positioning check — audience, category, edges.",
    "System design — logo, type, colour, grid.",
    "Applications — packaging, digital, print.",
    "Brand book — usage, rules, tone.",
  ],
  "Campaign Design": [
    "Insight — sharp brief, one clear idea.",
    "Direction — visual world and message hierarchy.",
    "Rollout — social, film, print, activation.",
    "Launch kit — ready-to-ship assets.",
  ],
  "Digital Design": [
    "Architecture — content, flows, hierarchy.",
    "Design system — grid, type, components.",
    "Motion — micro-interactions and pacing.",
    "Build — handoff or full delivery.",
  ],
};

function matchProjects(service: DbService, projects: DbProject[]): DbProject[] {
  const title = service.title.toLowerCase();
  const scored = projects
    .map((p) => {
      const cat = String(p.category || "").toLowerCase();
      const tags = (p.tags || []).map((t) => t.toLowerCase());
      let score = 0;
      if (cat && title.includes(cat)) score += 3;
      if (cat && cat.includes(title.split(" ")[0])) score += 2;
      if (tags.some((t) => title.includes(t) || t.includes(title.split(" ")[0]))) score += 1;
      return { p, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.p);
  return scored;
}

function ServiceBlock({
  service,
  index,
  projects,
}: {
  service: DbService;
  index: number;
  projects: DbProject[];
}) {
  const Icon = ICONS[service.icon ?? ""] ?? Eye;
  const deliverables = DELIVERABLES[service.title] ?? [];
  const process = PROCESS[service.title] ?? [];
  const related = matchProjects(service, projects);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.05, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative border-t border-white/[0.08] py-16 md:py-20"
    >
      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        {/* Left: number + icon */}
        <div className="col-span-12 md:col-span-2">
          <div className="mono text-[10px] tracking-[0.28em] text-sky-300/80">
            {service.number || String(index + 1).padStart(2, "0")}
          </div>
          <div className="mt-4 grid h-14 w-14 place-items-center rounded-full border border-white/[0.1] bg-slate-950/40 text-slate-200">
            <Icon size={20} strokeWidth={1.6} />
          </div>
        </div>

        {/* Middle: title + description */}
        <div className="col-span-12 md:col-span-6">
          <h2 className="display text-3xl md:text-5xl leading-[0.98] tracking-[-0.02em] text-metal">
            {service.title}
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-slate-400">
            {service.description}
          </p>

          {process.length > 0 && (
            <div className="mt-8">
              <p className="mono text-[10px] tracking-[0.24em] text-slate-500">Process</p>
              <ol className="mt-3 space-y-2.5">
                {process.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-300">
                    <span className="mono text-[11px] tracking-[0.16em] text-sky-300/70 pt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right: deliverables + related */}
        <div className="col-span-12 md:col-span-4 space-y-8">
          {deliverables.length > 0 && (
            <div>
              <p className="mono text-[10px] tracking-[0.24em] text-slate-500">Deliverables</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {deliverables.map((d) => (
                  <span
                    key={d}
                    className="mono rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[10px] tracking-[0.16em] text-slate-300"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <p className="mono text-[10px] tracking-[0.24em] text-slate-500">Selected work</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    to="/portfolio/$slug"
                    params={{ slug: p.slug ?? p.id }}
                    className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-white/[0.08] bg-slate-950/40"
                  >
                    {p.cover_url && (
                      <img
                        src={p.cover_url}
                        alt={p.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#01040A] to-transparent p-3">
                      <div className="mono text-[9px] tracking-[0.18em] text-sky-200/80 truncate">
                        {p.client_name || p.category}
                      </div>
                      <div className="text-[12px] text-slate-100 truncate">{p.title}</div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="absolute right-2 top-2 text-white/70 opacity-0 transition group-hover:opacity-100"
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ServicesDetailed() {
  const { data: services = [] } = useServices();
  const { data: projects = [] } = useProjects();

  return (
    <section className="relative px-5 md:px-8 py-20">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-6 flex items-end justify-between gap-8">
          <div>
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">Services in detail</p>
            <h2 className="display mt-4 text-3xl md:text-5xl max-w-2xl leading-[1.02] tracking-[-0.025em] text-metal">
              Four disciplines, one system of work.
            </h2>
          </div>
        </div>

        <div>
          {services.map((service, index) => (
            <ServiceBlock
              key={service.id}
              service={service}
              index={index}
              projects={projects}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
