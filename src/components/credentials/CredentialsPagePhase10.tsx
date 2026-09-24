import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { useClients, useSiteSettings, useStats } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import { whatsappLink } from "@/lib/whatsapp";
import {
  FALLBACK_CAPABILITY_GROUPS,
  FALLBACK_EXPERIENCE,
  FALLBACK_METRICS,
  FALLBACK_PRINCIPLES,
  FALLBACK_PROFILE,
  FALLBACK_SKILLS,
  deriveSkillLevel,
  sortExperience,
  type CredentialExperience,
  type CredentialMetric,
  type CredentialSkill,
} from "@/lib/credentials-data";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/credentials")({
  head: () =>
    createSeo({
      title: "The Credentials - Edmundo Kutuzov",
      description:
        "Experience, skills and selected brands worked with as art director and graphic designer by Edmundo Kutuzov.",
      path: "/credentials",
    }),
  component: CredentialsPage,
});

const CHAPTERS = [
  ["profile", "Profile"],
  ["numbers", "Numbers"],
  ["experience", "Experience"],
  ["toolbelt", "Toolbelt"],
  ["competencies", "Competencies"],
  ["clients", "Clients"],
  ["principles", "Principles"],
] as const;

function normalizeSkills(value: unknown): CredentialSkill[] {
  if (!Array.isArray(value)) return FALLBACK_SKILLS;

  const parsed = value
    .map((item) => {
      const raw = item as { name?: unknown; value?: unknown; level?: unknown };
      const value = Math.max(0, Math.min(100, Number(raw.value) || 0));
      const rawLevel = String(raw.level ?? "");
      const level =
        rawLevel === "Core" || rawLevel === "Fluent" || rawLevel === "Exploring"
          ? (rawLevel as CredentialSkill["level"])
          : undefined;

      return {
        name: String(raw.name ?? "").trim(),
        value,
        level,
      };
    })
    .filter((item) => item.name);

  return parsed.length ? parsed : FALLBACK_SKILLS;
}

export function CredentialsPage() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const { data: stats = [] } = useStats();

  const legacy = <T,>(field: string, fallback: T) =>
    readSetting<T>(settings, "about", field, fallback);
  const readCredentials = <T,>(field: string, fallback: T) =>
    readSetting<T>(settings, "credentials", field, legacy(field, fallback));
  const readSocial = <T,>(field: string, fallback: T) =>
    readSetting<T>(settings, "social", field, fallback);

  const experience = sortExperience(
    readCredentials<CredentialExperience[]>("experience", FALLBACK_EXPERIENCE),
  );

  const metrics = (
    stats.length
      ? stats
          .filter((item) => item.is_active !== false)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((item) => ({ value: item.value, label: item.label }))
      : readCredentials<CredentialMetric[]>("cards", FALLBACK_METRICS)
  ).filter((item) => String(item.value ?? "").trim() && String(item.label ?? "").trim());

  const skills = normalizeSkills(
    readCredentials<CredentialSkill[]>("skills", FALLBACK_SKILLS),
  );

  const profile = {
    eyebrow: readCredentials("eyebrow", FALLBACK_PROFILE.eyebrow),
    topRight: readCredentials("top_right", FALLBACK_PROFILE.topRight),
    title1: readCredentials("title_1", "Strategy, craft and a sharp"),
    titleAccent: readCredentials("title_accent", "point of view."),
    bio: [
      readCredentials("bio_p1", FALLBACK_PROFILE.bio[0]),
      readCredentials("bio_p2", FALLBACK_PROFILE.bio[1]),
      readCredentials("bio_p3", FALLBACK_PROFILE.bio[2]),
    ],
    email: readCredentials("email", FALLBACK_PROFILE.email),
    phone: readCredentials("phone", FALLBACK_PROFILE.phone),
    location: readCredentials("location", FALLBACK_PROFILE.location),
  };

  const social = [
    {
      label: "LinkedIn",
      href: readSocial(
        "linkedin",
        "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4",
      ),
    },
    {
      label: "Instagram",
      href: readSocial("instagram", "https://www.instagram.com/edmundo.kutuzov/"),
    },
    {
      label: "Facebook",
      href: readSocial("facebook", "https://www.facebook.com/edmundoku/"),
    },
  ];

  const selectedClients = clients.filter((client) => client.name.trim());
  const reference = String(readCredentials("reference", "GOD"));
  const principles = readCredentials("principles", FALLBACK_PRINCIPLES);

  return (
    <main className="bg-betao text-preto">
      <CredentialsIndex />

      <section id="profile" data-tone="preto" className="border-b-2 border-cal/20 text-cal">
        <div className="mx-auto max-w-[1500px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
          <div className="flex items-start justify-between gap-8">
            <p className="text-base text-fumo">{profile.eyebrow}</p>
            <p className="hidden text-base text-fumo md:block">{profile.topRight}</p>
          </div>

          <h1
            className="mt-9 max-w-7xl font-cartaz text-[clamp(3.6rem,9vw,9.5rem)] font-extrabold leading-[0.84] tracking-[-0.06em]"
            style={{ fontVariationSettings: '"wdth" 72, "wght" 800' }}
          >
            {profile.title1} {profile.titleAccent}
          </h1>

          <div className="mt-10 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-9 md:col-start-2">
              {profile.bio.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-5 max-w-4xl font-livro text-[clamp(1.2rem,2vw,2rem)] leading-[1.55] text-fumo"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-14 grid border-y-2 border-cal/25 md:grid-cols-4">
            <a
              href={"mailto:" + profile.email}
              className="flex min-h-20 items-center gap-3 border-b-2 border-cal/25 px-0 py-5 text-base text-cal hover:text-work focus:outline-none focus-visible:ring-2 focus-visible:ring-work md:border-b-0 md:border-r-2 md:px-5"
            >
              <Mail size={19} aria-hidden="true" />
              <span>{profile.email}</span>
            </a>

            <a
              href={whatsappLink(
                "Hello Edmundo, I found your credentials page and I would like to discuss a project.",
              )}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-20 items-center gap-3 border-b-2 border-cal/25 px-0 py-5 text-base text-cal hover:text-work focus:outline-none focus-visible:ring-2 focus-visible:ring-work md:border-b-0 md:border-r-2 md:px-5"
            >
              <Phone size={19} aria-hidden="true" />
              <span>{profile.phone} · WhatsApp</span>
            </a>

            <div className="flex min-h-20 items-center gap-3 border-b-2 border-cal/25 px-0 py-5 text-base text-cal md:border-b-0 md:border-r-2 md:px-5">
              <MapPin size={19} aria-hidden="true" />
              <span>{profile.location}</span>
            </div>

            <div className="grid grid-cols-3">
              {social.map((item) => (
                <a
                  key={item.label}
                  href={String(item.href)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-20 items-center justify-center border-l-2 border-cal/25 px-3 text-sm font-semibold text-cal hover:bg-cal hover:text-preto focus:outline-none focus-visible:ring-2 focus-visible:ring-work"
                >
                  {item.label}
                  <ExternalLink className="ml-2" size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact" className="ds-button" data-variant="primary" data-tone="dark">
              Start a project
            </Link>
            <a
              href="/api/credentials/press-kit.pdf"
              className="ds-button"
              data-variant="secondary"
            >
              <Download size={17} aria-hidden="true" />
              Press kit / CV
            </a>
          </div>
        </div>
      </section>

      <section id="numbers" data-tone="betao" className="border-b-2 border-preto">
        <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
          <div className="mb-10 flex items-end justify-between gap-8 border-b-2 border-preto pb-6">
            <h2 className="font-cartaz text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-8xl">
              Numbers
            </h2>
            <p className="hidden max-w-sm text-base leading-6 text-chapa md:block">
              Public credentials use the active CMS metrics source. No placeholder cells are shown.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="border-b-2 border-preto p-5 md:border-b-0 md:border-r-2 md:p-7 last:md:border-r-0"
              >
                <div
                  className="font-cartaz text-6xl font-extrabold leading-none tracking-[-0.05em] md:text-8xl"
                  style={{ fontVariationSettings: '"wdth" 72, "wght" 800' }}
                >
                  {metric.value}
                </div>
                <div className="mt-5 max-w-44 text-base leading-6 text-chapa">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" data-tone="preto" className="text-cal">
        <div className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-4">
            <h2 className="font-cartaz text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-7xl">
              Experience
            </h2>
            <p className="mt-5 max-w-sm font-livro text-xl leading-[1.55] text-fumo">
              Five recorded roles, ordered from the most recent to the oldest.
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="border-t-2 border-cal/30">
              {experience.map((item) => {
                const current = item.period.toLowerCase().includes("present");
                return (
                  <div
                    key={item.company + item.role + item.period}
                    className="grid gap-5 border-b-2 border-cal/20 py-7 md:grid-cols-[150px_1fr_auto] md:items-baseline"
                  >
                    <div className="font-cartaz text-base tabular-nums text-fumo">{item.period}</div>
                    <div>
                      <h3 className="font-cartaz text-3xl font-bold leading-none tracking-[-0.03em] md:text-4xl">
                        {item.role}
                      </h3>
                      <p className="mt-2 text-base text-fumo">{item.company}</p>
                    </div>
                    <div className="text-base text-work md:text-right">{current ? "Current role" : ""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="toolbelt" data-tone="cal" className="border-y-2 border-preto">
        <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="font-cartaz text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-7xl">
                Toolbelt
              </h2>
              <p className="mt-5 max-w-sm font-livro text-xl leading-[1.55] text-chapa">
                The current source contains five skills. Original scores remain visible and grouping is derived from 90+ Core, 70–89 Fluent and below 70 Exploring.
              </p>
            </div>

            <div className="md:col-span-8">
              {(["Core", "Fluent", "Exploring"] as const).map((level) => {
                const items = skills.filter(
                  (skill) => (skill.level ?? deriveSkillLevel(skill.value)) === level,
                );
                if (!items.length) return null;

                return (
                  <div key={level} className="border-t-2 border-preto py-7">
                    <h3 className="font-cartaz text-3xl font-bold">{level}</h3>
                    <div className="mt-5 divide-y-2 divide-black/20 border-b-2 border-black">
                      {items.map((skill) => (
                        <div key={skill.name} className="grid grid-cols-[1fr_auto] items-baseline gap-6 py-4 text-base">
                          <span>{skill.name}</span>
                          <span className="font-cartaz text-2xl font-bold tabular-nums">{skill.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="competencies" data-tone="betao" className="border-b-2 border-preto">
        <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-col gap-8 border-b-2 border-preto pb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-cartaz text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-8xl">
                Competencies
              </h2>
              <p className="mt-4 max-w-xl font-livro text-xl leading-[1.55] text-chapa">
                Capability breadth remains separate from Services, which describes the four public disciplines.
              </p>
            </div>

            <Link to="/services" className="ds-button shrink-0" data-variant="secondary">
              View Services
            </Link>
          </div>

          <div className="mt-10 grid gap-0 md:grid-cols-3">
            {FALLBACK_CAPABILITY_GROUPS.map((group) => (
              <div key={group.category} className="border-b-2 border-preto p-6 md:border-b-0 md:border-r-2 md:p-8 last:md:border-r-0">
                <h3 className="font-cartaz text-2xl font-bold leading-none md:text-3xl">{group.category}</h3>
                <ul className="mt-7 space-y-4 text-base">
                  {group.items.map((item) => (
                    <li key={item} className="border-b border-preto/30 pb-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="clients" data-tone="preto" className="text-cal">
        <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-10 md:py-24">
          <h2 className="font-cartaz text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-8xl">
            Clients
          </h2>
          <p className="mt-5 max-w-2xl font-livro text-xl leading-[1.55] text-fumo">
            {selectedClients.length} active client records are available in the public source. No logo files are currently present, so names are the accessible representation.
          </p>

          <div className="mt-10 grid grid-cols-2 border-t-2 border-cal/25 md:grid-cols-4">
            {selectedClients.map((client, index) => (
              <div
                key={client.id}
                className="border-b-2 border-r-2 border-cal/20 px-4 py-5 text-lg font-semibold text-cal md:px-6 md:py-6 md:text-2xl"
              >
                <span className="mr-4 text-fumo tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" data-tone="cor" className="text-[var(--work-fg)]">
        <div className="mx-auto grid min-h-[90vh] max-w-[1500px] gap-10 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-7">
            <p className="text-lg opacity-80">Principles</p>
            <h2
              className="mt-8 max-w-6xl font-cartaz text-[clamp(3.6rem,9vw,9.5rem)] font-extrabold leading-[0.84] tracking-[-0.06em]"
              style={{ fontVariationSettings: '"wdth" 72, "wght" 800' }}
            >
              A brand does not need to shout to be noticed. It needs structure, clarity, and memory.
            </h2>
          </div>

          <div className="md:col-span-5 md:pt-3">
            <div className="border-t-2 border-current">
              {principles.map((item) => (
                <div key={item.key} className="border-b-2 border-current py-7">
                  <h3 className="font-cartaz text-3xl font-bold">{item.key}</h3>
                  <p className="mt-3 font-livro text-xl leading-[1.55] opacity-90">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex min-h-11 items-center justify-between border-b-2 border-current py-3 text-base">
              <span>Reference</span>
              <span className="font-cartaz text-2xl font-bold">{reference}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CredentialsIndex() {
  return (
    <aside
      aria-label="Credentials chapters"
      className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 border-2 border-black bg-cal px-2 py-2 lg:top-1/2 lg:bottom-auto lg:left-4 lg:block lg:translate-x-0 lg:-translate-y-1/2"
    >
      <nav className="grid gap-1">
        {CHAPTERS.map(([id, label]) => (
          <a
            key={id}
            href={"#" + id}
            className="min-h-11 px-3 py-2 text-sm font-semibold text-preto hover:bg-preto hover:text-cal focus:outline-none focus-visible:ring-2 focus-visible:ring-work"
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
