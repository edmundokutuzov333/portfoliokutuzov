import { motion } from "framer-motion";
import { useClients, useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

export function ClientLogos() {
  const { data: settings } = useSiteSettings();
  const { data: clients = [] } = useClients();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "clients_section", f, fb);
  const title = r("title", "Brands and teams\nI have worked with.");

  return (
    <section className="relative px-5 md:px-8 py-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-5">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">
              {r("eyebrow", "Selected Clients")}
            </p>
            <h2 className="display text-3xl md:text-4xl mt-4 text-metal leading-[1.05] whitespace-pre-line">
              {title}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8 self-end">
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              {r("subtitle", "")}
            </p>
          </div>
        </div>

        <div className="border-t border-white/[0.08] grid grid-cols-2 md:grid-cols-4">
          {clients.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="group relative h-28 md:h-32 border-b border-r border-white/[0.08] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              <span className="absolute top-2 left-3 mono text-[9px] text-[var(--color-text-ghost)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              {c.logo_url ? (
                <img src={c.logo_url} alt={c.name} className="max-h-12 max-w-[70%] object-contain opacity-70 group-hover:opacity-100 transition" loading="lazy" />
              ) : (
                <span className="display text-base md:text-lg font-medium tracking-[0.04em]">{c.name}</span>
              )}
              <span className="absolute inset-x-0 bottom-0 h-px bg-sky-300/70 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
