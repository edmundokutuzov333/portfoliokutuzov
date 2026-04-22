import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="relative px-5 md:px-8 py-28">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-2xl border border-white/8 bg-[var(--color-surface)] p-8 md:p-16"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(600px circle at 80% 20%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(500px circle at 10% 90%, rgba(34,211,238,0.18), transparent 60%)",
            }}
          />
          <div className="relative">
            <p className="mono text-[10px] text-[var(--color-acc-cyan)]">
              /// COLABORAÇÃO — N° 04
            </p>
            <h2 className="display text-3xl sm:text-5xl md:text-6xl mt-6 max-w-4xl leading-[1.02] tracking-[-0.02em]">
              <span className="text-metal">Vamos desenhar uma presença visual</span>{" "}
              <span className="italic text-acid">impossível de ignorar.</span>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--color-acc-acid)] text-black px-6 py-3.5 text-sm font-semibold hover:brightness-110 transition"
              >
                Começar conversa
                <ArrowUpRight size={16} />
              </Link>
              <a
                href="mailto:edmundo@studio.com"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white border-b border-white/15 pb-1"
              >
                edmundo@studio.com
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
