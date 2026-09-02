import * as React from "react";
import { motion } from "framer-motion";
import { useClients, useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import { CinematicLogoCloud } from "@/components/ui/cinematic-logo-cloud";

export function ClientLogos() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "clients_section", f, fb);
  const title = r("title", "Brands and teams\nI have worked with.");

  return (
    <section className="relative px-5 md:px-8 py-24 bg-[var(--color-bg)]">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-5">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase"
            >
              {r("eyebrow", "Selected Clients")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="display text-3xl md:text-4xl mt-4 text-metal leading-[1.05] whitespace-pre-line"
            >
              {title}
            </motion.h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-[var(--color-text-muted)] leading-relaxed"
            >
              {r("subtitle", "")}
            </motion.p>
          </div>
        </div>

        {/* 2 Horizontal Rows Animated Continuous Marquee */}
        <CinematicLogoCloud clients={clients} className="mt-8 md:mt-12" />
      </div>
    </section>
  );
}
