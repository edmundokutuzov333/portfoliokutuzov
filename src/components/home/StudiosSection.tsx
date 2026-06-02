import { motion } from "framer-motion";
import { useStudios } from "@/hooks/useSiteData";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";

export const STUDIO_LOGO_SIZES = {
  xs: { row: "h-28 md:h-32", img: "max-h-10" },
  sm: { row: "h-32 md:h-36", img: "max-h-14" },
  md: { row: "h-40 md:h-44", img: "max-h-20" },
  lg: { row: "h-48 md:h-56", img: "max-h-28" },
  xl: { row: "h-56 md:h-64", img: "max-h-36" },
  xxl: { row: "h-64 md:h-80", img: "max-h-48" },
} as const;

export type StudioLogoSize = keyof typeof STUDIO_LOGO_SIZES;

export function StudiosSection() {
  const { data: studios = [] } = useStudios();
  const { data: settings } = useSiteSettings();
  const visible = studios.slice(0, 3);
  if (visible.length === 0) return null;

  const sizeKey = readSetting<StudioLogoSize>(
    settings,
    "studios_section",
    "logo_size",
    "md",
  );
  const size = STUDIO_LOGO_SIZES[sizeKey] ?? STUDIO_LOGO_SIZES.md;

  return (
    <section className="relative px-5 md:px-8 py-20">
      <div className="max-w-[1240px] mx-auto">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-7">
            <h2 className="display text-3xl md:text-4xl text-metal leading-[1.05]">
              Forged across the studios of
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08] border border-white/[0.08]">
          {visible.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className={`group relative ${size.row} bg-[#01040A] flex items-center justify-center text-[var(--color-text-muted)] hover:text-white transition-colors`}
            >
              {s.logo_url ? (
                <img
                  src={s.logo_url}
                  alt={s.name}
                  width={s.logo_width ?? undefined}
                  height={s.logo_height ?? undefined}
                  className={`${size.img} max-w-[75%] w-auto h-auto object-contain opacity-80 group-hover:opacity-100 transition`}
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
