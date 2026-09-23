import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useServices, useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

const FALLBACK_CAPABILITIES = [
  "Art Direction",
  "Brand Identity",
  "Campaign Design",
  "Creative Direction",
  "AI Creative Direction",
  "Digital Experience",
];

export function CapabilitiesShort() {
  const { data: settings } = useSiteSettings();
  const { data: services = [] } = useServices();
  const r = <T,>(field: string, fallback: T) =>
    readSetting<T>(settings, "services_section", field, fallback);
  const limit = Math.max(1, Math.min(20, Number(r("preview_limit", 6))));
  const capabilities = (services.length ? services.map((service) => service.title) : FALLBACK_CAPABILITIES).slice(0, limit);
  const ctaLabel = r("cta_label", "View capabilities");
  const ctaRoute = r("cta_route", "/services");

  return (
    <section className="py-24 md:py-32 px-4 md:px-8 bg-[var(--color-bg)]">
      <div className="max-w-[var(--width-wide)] mx-auto border-t border-[var(--color-border-subtle)] pt-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          <div className="md:col-span-4 lg:col-span-3">
            <div className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
              {r("eyebrow", "Capabilities")}
            </div>
            <h2 className="text-[1.5rem] md:text-[2rem] leading-tight font-medium tracking-tight text-[var(--color-text-primary)]">
              {r("title", "Strategy, craft and a sharp point of view.")}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-muted)]">{r("sidebar", "Brand Logic / Visual Systems / Digital Presence")}</p>
          </div>

          <div className="md:col-span-8 lg:col-span-9 flex flex-col md:flex-row md:items-end justify-between gap-12">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
              {capabilities.map((cap, i) => (
                <motion.li
                  key={cap + i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[1.25rem] md:text-[1.5rem] tracking-tight text-[var(--color-text-primary)]"
                >
                  {cap}
                </motion.li>
              ))}
            </ul>

            <Link
              to={ctaRoute}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-6 py-3 text-[13px] font-medium text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)]"
            >
              {ctaLabel}
              <ArrowUpRight size={14} className="opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
