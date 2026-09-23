import { createFileRoute } from "@tanstack/react-router";
import { DeferredReel } from "@/components/home/DeferredReel";
import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { CapabilitiesShort } from "@/components/home/CapabilitiesShort";
import { ClientLogos } from "@/components/home/ClientLogos";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeCTA } from "@/components/home/HomeCTA";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    createSeo({
      title: "Edmundo Kutuzov - Art Director",
      description:
        "Edmundo Kutuzov is an art director based in Maputo, Mozambique. Visual identities, art direction and campaign design for brands that want to be remembered.",
      path: "/",
    }),
  component: HomePage,
});

type HomeSection = {
  id: "hero" | "manifesto" | "services" | "clients" | "featured" | "experience" | "cta" | "footer";
  label: string;
  visible: boolean;
  order: number;
};

const FALLBACK_HOME_SECTIONS: HomeSection[] = [
  { id: "hero", label: "Hero", visible: true, order: 1 },
  { id: "manifesto", label: "Manifesto", visible: true, order: 2 },
  { id: "services", label: "Services", visible: true, order: 3 },
  { id: "clients", label: "Clients", visible: true, order: 4 },
  { id: "featured", label: "Featured Work", visible: true, order: 5 },
  { id: "experience", label: "Experience / Numbers", visible: true, order: 6 },
  { id: "cta", label: "CTA", visible: true, order: 7 },
  { id: "footer", label: "Footer (global)", visible: true, order: 8 },
];

function HomePage() {
  const { data: settings } = useSiteSettings();
  const configured = readSetting<HomeSection[]>(settings, "homepage_structure", "sections", FALLBACK_HOME_SECTIONS);
  const sections = [...configured]
    .filter((item) => FALLBACK_HOME_SECTIONS.some((fallback) => fallback.id === item.id))
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const renderSection = (id: HomeSection["id"]) => {
    if (id === "hero") return <Hero />;
    if (id === "manifesto") return <Manifesto />;
    if (id === "services") return <CapabilitiesShort />;
    if (id === "clients") return <ClientLogos />;
    if (id === "featured") return <FeaturedWork />;
    if (id === "experience") return <HomeExperience />;
    if (id === "cta") return <HomeCTA />;
    return null;
  };

  return (
    <>
      <DeferredReel />
      {sections.filter((item) => item.visible && item.id !== "footer").map((item) => (
        <div key={item.id} data-home-section={item.id}>
          {renderSection(item.id)}
        </div>
      ))}
    </>
  );
}
