import { motion } from "framer-motion";
import { useStudios } from "@/hooks/useSiteData";

export function StudiosSection() {
  const { data: studios = [] } = useStudios();
  const visible = studios.slice(0, 3);
  if (visible.length === 0) return null;

  return (
    <section className="relative px-5 md:px-8 py-20">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-12">
          <p className="mono text-[10px] tracking-[0.28em] text-sky-300/75">Studios</p>
          <h2 className="display text-3xl md:text-4xl mt-4 text-metal leading-[1.05]">
            Forged across the studios of
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
          {visible.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="group relative h-32 md:h-36 bg-[#01040A] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              {s.logo_url ? (
                <img
                  src={s.logo_url}
                  alt={s.name}
                  width={s.logo_width ?? undefined}
                  height={s.logo_height ?? undefined}
                  className="max-h-14 max-w-[60%] w-auto h-auto object-contain opacity-70 group-hover:opacity-100 transition"
                  loading="lazy"
                />
              ) : (
                <span className="display text-base md:text-lg font-medium tracking-[0.04em] text-center px-3">
                  {s.name}
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 h-px bg-sky-300/70 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
