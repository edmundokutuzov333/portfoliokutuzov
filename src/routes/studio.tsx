import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";
import { StudioConstructionSignal } from "@/components/studio/StudioConstructionSignal";
import { trackStudioClientEvent } from "@/lib/studio/analytics";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio | Under Construction" },
      {
        name: "description",
        content:
          "Kutuzov Studio is currently under construction. Explore the Edmundo Kutuzov portfolio while the Studio tools are being built privately.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StudioLanding,
});

function StudioLanding() {
  useEffect(() => {
    trackStudioClientEvent({ eventName: "studio_opened" });
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] px-5 pb-20 pt-28 sm:px-8 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-cyan-400/[0.045] blur-3xl" />
      <div className="relative mx-auto grid max-w-[1240px] items-center gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14">
        <div className="relative z-10 max-w-xl">
          <p className="mono mt-7 text-[10px] uppercase tracking-[0.34em] text-[var(--color-accent-base)]">
            Kutuzov Studio
          </p>

          <h1 className="display mt-4 max-w-4xl text-[clamp(2.65rem,7vw,7.6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-[var(--color-text-primary)]">
            <span className="whitespace-nowrap">Something is</span>
            <br />
            <span className="whitespace-nowrap">taking shape.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
            Kutuzov Studio is currently under construction. The tools are being
            built privately and will only be released when the complete
            experience is ready.
          </p>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/40">
            While the Studio takes shape, explore the portfolio and see the work
            that is already live.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--color-bg)] transition hover:-translate-y-0.5"
            >
              Explore the portfolio
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.05]"
            >
              Return home
            </Link>
          </div>
        </div>

        <div className="relative z-0 flex items-center justify-center lg:min-h-[720px]">
          <StudioConstructionSignal />
        </div>
      </div>
    </section>
  );
}
