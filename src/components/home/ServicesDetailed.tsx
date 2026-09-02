import { motion } from "framer-motion";
import { useServices } from "@/hooks/useSiteData";
import { type DbService } from "@/lib/cms";

function ServiceBlock({ service, index }: { service: DbService; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative border-t border-[var(--color-border-subtle)] py-12 md:py-20 flex flex-col md:flex-row md:items-start gap-4 md:gap-16 transition-colors hover:bg-[rgba(255,255,255,0.015)] -mx-4 px-4 md:-mx-8 md:px-8"
    >
      <div className="mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase shrink-0 w-8 md:pt-2 transition-colors group-hover:text-[var(--color-text-primary)]">
        0{index + 1}
      </div>
      <h2 className="display text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-[var(--color-text-primary)] md:w-1/3 transition-colors group-hover:text-[var(--color-accent-hover)]">
        {service.title}
      </h2>
      <div className="md:w-2/3 md:pt-2">
        <p className="text-[15px] md:text-lg leading-relaxed text-[var(--color-text-secondary)] max-w-2xl">
          {service.description}
        </p>
      </div>
    </motion.article>
  );
}

export function ServicesDetailed() {
  const { data: services = [] } = useServices();

  return (
    <section className="relative px-4 md:px-8 pb-32 bg-[var(--color-bg)]">
      <div className="max-w-[var(--width-standard)] mx-auto">
        <div className="flex flex-col">
          {services.map((service, index) => (
            <ServiceBlock key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
