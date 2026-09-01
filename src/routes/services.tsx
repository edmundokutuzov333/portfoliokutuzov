import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Manifesto } from "@/components/home/Manifesto";
import { ServicesDetailed } from "@/components/home/ServicesDetailed";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services - Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Art direction, brand identity, campaign design and digital design services by Edmundo Kutuzov, art director based in Maputo, Mozambique.",
      },
      { property: "og:title", content: "Services - Edmundo Kutuzov" },
      {
        property: "og:description",
        content:
          "Visual disciplines for brands that move with precision: strategy, identity, campaigns and digital systems.",
      },
      { property: "og:url", content: "https://portfoliokutuzov.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://portfoliokutuzov.lovable.app/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: "Art Direction",
              serviceType: "Art Direction",
              provider: { "@id": "https://portfoliokutuzov.lovable.app/#person" },
              areaServed: "Worldwide",
              description:
                "Creative direction for campaigns, music videos and content, from concept to final visual output.",
              url: "https://portfoliokutuzov.lovable.app/services",
            },
            {
              "@type": "Service",
              name: "Brand Identity",
              serviceType: "Brand Identity",
              provider: { "@id": "https://portfoliokutuzov.lovable.app/#person" },
              areaServed: "Worldwide",
              description:
                "Visual identity systems: logotype, typography, colour, grid and guidelines built to scale.",
              url: "https://portfoliokutuzov.lovable.app/services",
            },
          ],
        }),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="relative px-5 md:px-8 pt-36 pb-10">
        <div className="max-w-[1240px] mx-auto">
          <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
            <div>Services</div>
            <div>What I do, end to end</div>
          </div>
          <h1 className="display text-5xl md:text-7xl mt-6 leading-[0.98] tracking-[-0.02em] text-metal max-w-4xl">
            Visual disciplines for brands that move with precision.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] text-slate-400 leading-relaxed">
            From the first strategic decision to the last visual asset, every project is built with
            intent. Below, the principles that guide the work and the services I offer.
          </p>
        </div>
      </section>

      <Manifesto />
      <ServicesDetailed />

      <section className="relative px-5 md:px-8 py-24">
        <div className="max-w-[1240px] mx-auto">
          <div className="rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-8 md:p-14 text-center">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80">Ready when you are</p>
            <h2 className="display text-3xl md:text-5xl mt-5 max-w-3xl mx-auto leading-[1.02] tracking-[-0.025em]">
              <span className="text-metal">Tell me about your brand and</span>{" "}
              <span className="italic text-accent">let's get to work.</span>
            </h2>
            <div className="mt-8 inline-flex">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-slate-100 text-[#01040A] px-6 py-3.5 text-sm font-semibold hover:bg-sky-200 transition"
              >
                Start a project
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
