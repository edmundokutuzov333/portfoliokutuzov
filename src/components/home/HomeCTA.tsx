import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting, SITE_EMAIL } from "@/lib/cms";
import { ShinyButton } from "@/components/ui/shiny-button";

export function HomeCTA() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "cta_home", f, fb);
  const email = r("email", SITE_EMAIL);

  return (
    <section className="relative px-5 md:px-8 py-28">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[var(--color-surface)] p-8 md:p-16"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(600px circle at 80% 20%, rgba(29,155,255,0.18), transparent 60%), radial-gradient(500px circle at 10% 90%, rgba(11,59,115,0.28), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="mono text-[10px] tracking-[0.28em] text-sky-300/80 uppercase">
              {r("eyebrow", "Let's collaborate")}
            </p>
            <h2 className="display text-3xl sm:text-5xl md:text-6xl mt-6 max-w-4xl leading-[1.02] tracking-[-0.025em]">
              <span className="text-metal">{r("title_1", "Let's build a visual presence")}</span>{" "}
              <span className="italic text-accent">
                {r("title_accent", "impossible to ignore.")}
              </span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ShinyButton to="/contact">
                {r("cta_primary", "Start a project")}
                <ArrowUpRight size={16} />
              </ShinyButton>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white border-b border-white/15 pb-1 ml-2"
              >
                {email}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
