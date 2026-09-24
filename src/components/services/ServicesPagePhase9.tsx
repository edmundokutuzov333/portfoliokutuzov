import * as React from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Link } from "@tanstack/react-router";
import { ChevronDown, MessageCircle, Minus, Plus } from "lucide-react";
import { useProjects, useServices, useMethod } from "@/hooks/useSiteData";
import { STATIC_DISCIPLINES, type Discipline } from "@/data/disciplines";
import { darkenWorkColor, pickFg, setWorkColor } from "@/lib/work-color";
import {
  disciplineArchiveQuery,
  selectServiceProjects,
  SERVICE_DISCIPLINE_CONFIGS,
  type ServiceDisciplineId,
} from "@/lib/service-projects";
import type { DbMethod, DbProject } from "@/lib/cms";

const FALLBACK_SERVICE_TITLES: Record<ServiceDisciplineId, string> = {
  identity: "Visual Identity",
  "art-direction": "Art Direction",
  editorial: "Editorial & Print",
  digital: "Digital Design",
};

const FALLBACK_METHODS: DbMethod[] = [];

type FAQItem = { id: string; question: string; answer: string };
const FAQ_ITEMS: FAQItem[] = [];

type RenderDiscipline = Discipline & {
  title: string;
  description: string;
  id: ServiceDisciplineId;
};

function mergeDisciplines(
  services: Array<{ title: string; description: string | null; number: string | null }>,
): RenderDiscipline[] {
  return STATIC_DISCIPLINES.map((base, index) => {
    const service = services[index];
    const id = base.id as ServiceDisciplineId;

    return {
      ...base,
      id,
      title: service?.title?.trim() || FALLBACK_SERVICE_TITLES[id] || base.title,
      description: service?.description?.trim() || base.description,
      number: service?.number?.trim() || base.number,
    };
  });
}

function workColor(project: DbProject): string {
  const palette = project.palette?.match(/#[0-9a-f]{6}\b/i)?.[0];
  return palette || "#2f4bff";
}

function openChat(prompt: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("ek:open-chat", {
      detail: { prompt },
    }),
  );
}

function ServiceWorkList({
  projects,
}: {
  projects: DbProject[];
}) {
  if (projects.length < 3) return null;

  return (
    <div className="mt-8 border-t-2 border-black">
      {projects.map((project) => {
        const work = workColor(project);
        const dark = darkenWorkColor(work);
        const fg = pickFg(dark);

        return (
          <Link
            key={project.id}
            to="/portfolio/$slug"
            params={{ slug: project.slug || project.id }}
            className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-6 border-b-2 border-black py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] focus-visible:ring-inset"
            style={{ backgroundColor: "transparent" }}
            onMouseEnter={() => setWorkColor(work)}
            onFocus={() => setWorkColor(work)}
          >
            <span className="min-w-0">
              <span
                className="block text-2xl font-semibold leading-none tracking-[-0.03em] transition-transform duration-200 group-hover:translate-x-1 md:text-4xl"
                style={{ fontFamily: '"Archivo Variable", sans-serif' }}
              >
                {project.title}
              </span>
              <span className="mt-2 block text-sm text-[#3F3E3B]">
                {project.client_name || project.title}
                {project.year ? " · " + project.year : ""}
              </span>
            </span>
            <span
              className="grid min-h-12 min-w-20 place-items-center border-2 border-black px-3 text-xs font-semibold transition-colors group-hover:border-transparent"
              style={{
                backgroundColor: "var(--case-preview-bg, transparent)",
                color: "var(--case-preview-fg, #000000)",
              }}
              onMouseEnter={(event) => {
                const element = event.currentTarget;
                element.style.setProperty("--case-preview-bg", dark);
                element.style.setProperty("--case-preview-fg", fg);
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.removeProperty("--case-preview-bg");
                event.currentTarget.style.removeProperty("--case-preview-fg");
              }}
            >
              View
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function DisciplineRow({
  discipline,
  projects,
  expanded,
  onExpand,
}: {
  discipline: RenderDiscipline;
  projects: DbProject[];
  expanded: boolean;
  onExpand: (id: ServiceDisciplineId) => void;
}) {
  const archiveConfig = SERVICE_DISCIPLINE_CONFIGS.find((config) => config.id === discipline.id)!;
  const previewProjects = selectServiceProjects(projects, archiveConfig);

  const activateWork = () => {
    const first = previewProjects[0];
    if (first) setWorkColor(workColor(first));
  };

  return (
    <article
      className="border-b-2 border-black"
      onMouseEnter={activateWork}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={"service-panel-" + discipline.id}
        className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-7 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] focus-visible:ring-inset md:gap-8 md:py-10"
        onClick={() => onExpand(discipline.id)}
        onFocus={activateWork}
      >
        <span
          className="text-sm font-semibold text-[#3F3E3B] tabular-nums"
          style={{ fontFamily: '"Archivo Variable", sans-serif' }}
        >
          {discipline.number}
        </span>

        <span
          className="text-4xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-7xl"
          style={{
            fontFamily: '"Archivo Variable", sans-serif',
            fontVariationSettings: '"wdth" 72, "wght" 800',
          }}
        >
          {discipline.title}
        </span>

        <span
          className="grid min-h-11 min-w-11 place-items-center border-2 border-black"
          aria-hidden="true"
        >
          {expanded ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>

      <div
        id={"service-panel-" + discipline.id}
        hidden={!expanded}
        className="pb-10"
      >
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p
              className="max-w-3xl text-xl leading-[1.55] text-black md:text-3xl"
              style={{ fontFamily: '"Newsreader Variable", serif' }}
            >
              {discipline.description}
            </p>

            <div className="mt-8">
              <p className="text-sm font-semibold text-[#3F3E3B]">Capabilities</p>
              <ul className="mt-4 grid gap-0 border-t-2 border-black md:grid-cols-2">
                {discipline.deliverables.map((item) => (
                  <li key={item} className="border-b-2 border-black py-3 text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="border-l-2 border-black pl-6 md:pl-8">
              <p className="text-sm font-semibold text-[#3F3E3B]">Selected work</p>
              <p className="mt-2 text-sm leading-6 text-[#3F3E3B]">
                Real portfolio projects matched from the published archive by category and tags.
              </p>
              <ServiceWorkList projects={previewProjects} />

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/portfolio"
                  search={{ d: disciplineArchiveQuery(archiveConfig) } as never}
                  className="inline-flex min-h-11 items-center border-b-2 border-black px-0 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)]"
                >
                  View discipline in archive
                </Link>

                <button
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 border-2 border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-[#F2F2EF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)]"
                  onClick={() =>
                    openChat(
                      "Ask about the " +
                        discipline.title +
                        " discipline and the relevant projects in the portfolio.",
                    )
                  }
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Ask about this discipline
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function ServicesFaq() {
  if (!FAQ_ITEMS.length) return null;

  return (
    <section className="border-t-2 border-black py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="text-sm font-semibold text-[#3F3E3B]">FAQ</p>
          <h2
            className="mt-3 text-5xl font-extrabold leading-none tracking-[-0.05em]"
            style={{ fontFamily: '"Archivo Variable", sans-serif' }}
          >
            Common questions.
          </h2>
        </div>

        <div className="md:col-span-8">
          <Accordion.Root type="single" collapsible>
            {FAQ_ITEMS.map((item) => (
              <Accordion.Item value={item.id} key={item.id} className="border-b-2 border-black">
                <Accordion.Header>
                  <Accordion.Trigger className="flex w-full items-center justify-between gap-6 py-5 text-left text-lg font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)]">
                    {item.question}
                    <ChevronDown className="shrink-0 transition-transform data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden pb-6 text-base leading-7 text-[#3F3E3B]">
                  {item.answer}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
}

export function ServicesPagePhase9() {
  const { data: projects = [] } = useProjects();
  const { data: services = [] } = useServices();
  const { data: methods = [] } = useMethod();
  const [activeId, setActiveId] = React.useState<ServiceDisciplineId>("identity");

  const disciplines = React.useMemo(
    () => mergeDisciplines(services),
    [services],
  );

  React.useEffect(() => {
    const current = disciplines.find((item) => item.id === activeId);
    const config = SERVICE_DISCIPLINE_CONFIGS.find((item) => item.id === activeId);
    if (!current || !config) return;

    const first = selectServiceProjects(projects, config)[0];
    setWorkColor(first ? workColor(first) : "#2f4bff");
  }, [activeId, disciplines, projects]);

  return (
    <main className="min-h-screen bg-[#D6D4CE] text-black">
      <section className="bg-black text-[#F2F2EF]">
        <div className="mx-auto max-w-[1500px] px-5 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44">
          <p className="text-sm text-[#B9B7B0]">Capabilities</p>
          <h1
            className="mt-6 max-w-6xl text-6xl font-extrabold leading-[0.84] tracking-[-0.055em] md:text-[112px]"
            style={{
              fontFamily: '"Archivo Variable", sans-serif',
              fontVariationSettings: '"wdth" 72, "wght" 800',
            }}
          >
            Visual capabilities &amp; disciplines.
          </h1>
          <p
            className="mt-8 max-w-3xl text-2xl leading-[1.35] text-[#B9B7B0] md:text-4xl"
            style={{ fontFamily: '"Newsreader Variable", serif' }}
          >
            Four disciplines, a clear scope, and direct routes into the work.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-5 py-14 md:px-10 md:py-20">
        <div className="border-t-2 border-black">
          {disciplines.map((discipline) => (
            <DisciplineRow
              key={discipline.id}
              discipline={discipline}
              projects={projects}
              expanded={activeId === discipline.id}
              onExpand={(id) => setActiveId((current) => (current === id ? "" as ServiceDisciplineId : id))}
            />
          ))}
        </div>
      </section>

      {methods.length > 0 || FALLBACK_METHODS.length > 0 ? (
        <section className="bg-black text-[#F2F2EF]">
          <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
            <div className="flex items-end justify-between gap-8 border-b-2 border-[#F2F2EF]/30 pb-6">
              <div>
                <p className="text-sm text-[#B9B7B0]">Method</p>
                <h2
                  className="mt-3 text-5xl font-extrabold leading-none tracking-[-0.05em] md:text-7xl"
                  style={{ fontFamily: '"Archivo Variable", sans-serif' }}
                >
                  How the studio works.
                </h2>
              </div>

              <Link
                to="/credentials"
                className="hidden min-h-11 border-b-2 border-[#F2F2EF] py-2 text-sm font-semibold md:inline-flex"
              >
                View credentials
              </Link>
            </div>

            <div className="mt-10 divide-y divide-[#F2F2EF]/20">
              {(methods.length ? methods : FALLBACK_METHODS).map((method) => (
                <div
                  key={method.id}
                  className="grid gap-4 py-7 md:grid-cols-[70px_1fr_2fr] md:items-start"
                >
                  <span className="text-sm tabular-nums text-[#B9B7B0]">
                    {method.number}
                  </span>
                  <h3
                    className="text-3xl font-bold"
                    style={{ fontFamily: '"Archivo Variable", sans-serif' }}
                  >
                    {method.title}
                  </h3>
                  <p className="text-base leading-7 text-[#B9B7B0]">
                    {method.description}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/credentials"
              className="mt-8 inline-flex min-h-11 border-b-2 border-[#F2F2EF] py-2 text-sm font-semibold md:hidden"
            >
              View credentials
            </Link>
          </div>
        </section>
      ) : null}

      <ServicesFaq />

      <section className="bg-[var(--case-work)] text-[var(--case-work-fg)]">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-8">
            <p className="text-sm opacity-80">Start a project</p>
            <h2
              className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-8xl"
              style={{
                fontFamily: '"Archivo Variable", sans-serif',
                fontVariationSettings: '"wdth" 72, "wght" 800',
              }}
            >
              Tell me what you're building.
            </h2>
          </div>

          <div className="flex items-end md:col-span-4 md:justify-end">
            <Link
              to="/contact"
              search={{ service: disciplines.find((item) => item.id === activeId)?.title || "" } as never}
              className="inline-flex min-h-12 items-center border-2 border-current bg-black px-5 py-3 text-sm font-semibold text-[#F2F2EF] hover:bg-[#F2F2EF] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2EF]"
            >
              Start a project
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
