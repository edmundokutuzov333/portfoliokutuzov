import { motion } from "framer-motion";
import { clients } from "@/data/clients";

export function ClientLogos() {
  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-5">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">
              Selected Clients
            </p>
            <h2 className="display text-3xl md:text-4xl mt-4 text-metal leading-[1.05]">
              Brands and teams
              <br /> I have worked with.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              A selection of local and international brands I have collaborated
              with as art director, graphic designer and creative lead.
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4">
          {clients.map((c, i) => (
            <motion.div
              key={c}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="group relative h-28 md:h-32 border-b border-r border-white/[0.08] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              <span className="absolute top-2 left-3 mono text-[9px] text-[var(--color-text-ghost)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="display text-base md:text-lg font-medium tracking-[0.04em]">
                {c}
              </span>
              <span className="absolute inset-x-0 bottom-0 h-px bg-sky-300/70 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
