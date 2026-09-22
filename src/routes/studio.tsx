import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, type CSSProperties } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { GenesisVisual } from "@/components/studio/GenesisVisual";
import { WaitlistForm } from "@/components/studio/WaitlistForm";
import { trackStudioClientEvent } from "@/lib/studio/analytics";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio | Edmundo Kutuzov" },
      {
        name: "description",
        content: "Kutuzov Studio is being composed privately, line by line, before its public release.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StudioLanding,
});

function StudioLanding() {
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    trackStudioClientEvent({ eventName: "studio_opened" });
  }, []);

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#0a0c10] px-5 pb-12 pt-28 text-[#edeef0] sm:px-8 sm:pt-32"
      style={
        {
          "--studio-surface": "#10141a",
          "--studio-muted": "#7c8590",
          "--studio-accent": "#25e3c2",
          "--studio-hairline": "rgba(255,255,255,0.08)",
        } as CSSProperties
      }
    >
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-[1240px] flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <span className="font-mono text-[10px] text-white/45">]</span>
          <span className="flex items-center gap-2 font-mono text-[10px] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#25e3c2]" aria-hidden="true" />
          </span>
        </div>

        <div className="grid items-center gap-12 py-16 lg:grid-cols-[3fr_2fr] lg:gap-10 lg:py-20">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px]"
          >
            <p className="font-mono text-xs text-[#7c8590]"></p>
            <h1 className="display mt-6 max-w-[720px] text-[clamp(3.4rem,7.6vw,7.6rem)] leading-[0.94] tracking-[-0.055em] text-[#edeef0]">
              A studio still finding its lines.
            </h1>
            <p className="mt-7 max-w-[520px] text-base leading-relaxed text-[#7c8590] sm:text-lg">
              Kutuzov Studio is where the tools I build for myself live - composed privately, tested in full, and released only once every line holds up in public.
            </p>

            <Link
              to="/portfolio"
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-[#25e3c2] px-5 py-3 text-sm font-semibold text-[#0a0c10] transition hover:brightness-95"
            >
              Explore the portfolio
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>

            <div className="mt-12 border-t border-white/[0.08] pt-6">
              <WaitlistForm />
            </div>

            <dl className="mt-10 grid gap-6 border-t border-white/[0.08] pt-6 sm:grid-cols-3 sm:gap-4">
              <div>
                <dt className="font-mono text-[10px] text-[#7c8590]">Status</dt>
                <dd className="mt-2 text-sm text-[#edeef0]">Composing</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-[#7c8590]">Access</dt>
                <dd className="mt-2 text-sm text-[#edeef0]">Private, by invitation</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] text-[#7c8590]">Release</dt>
                <dd className="mt-2 text-sm text-[#edeef0]">When every layer holds</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center lg:pl-4"
          >
            <GenesisVisual reduceMotion={reducedMotion} />
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.08] pt-4 font-mono text-[10px] text-white/30">
          <span>Maputo / 2026</span>
          <span></span>
        </div>
      </div>
    </main>
  );
}
