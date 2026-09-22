import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowUpRight, ChevronRight, Layers3, Radio, Sparkles, Workflow } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from "react";
import { StudioConstructionSignal } from "@/components/studio/StudioConstructionSignal";
import { trackStudioClientEvent } from "@/lib/studio/analytics";

const BUILD_STATES = [
  { id: "signal", label: "Signal", kicker: "LIVE SURFACE", title: "The Studio is alive before it is public.", body: "The public layer is intentionally minimal. The system underneath is being assembled privately, tested in motion, and kept out of the way until it is ready.", icon: Radio },
  { id: "systems", label: "Systems", kicker: "CREATIVE ENGINE", title: "Tools are being built around the work.", body: "Identity, generation, publishing and delivery are being shaped as one connected workspace instead of a collection of isolated utilities.", icon: Workflow },
  { id: "identity", label: "Identity", kicker: "DIGITAL LAYER", title: "Every output should travel further.", body: "The Studio will turn designed assets into useful digital objects, ready to share, export, publish and carry the Kutuzov signature beyond the canvas.", icon: Layers3 },
] as const;

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio | Under Construction" },
      {
        name: "description",
        content:
          "Kutuzov Studio is a private creative workspace under construction. Explore the public signal and the work already live.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StudioLanding,
});

function StudioLanding() {
  const reducedMotion = useReducedMotion();
  const [activeState, setActiveState] = useState<(typeof BUILD_STATES)[number]["id"]>("signal");
  const [signalAwake, setSignalAwake] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  const active = useMemo(
    () => BUILD_STATES.find((item) => item.id === activeState) ?? BUILD_STATES[0],
    [activeState],
  );

  useEffect(() => {
    trackStudioClientEvent({ eventName: "studio_opened" });
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
    });
  }

  function handlePointerLeave() {
    setPointer({ x: 0, y: 0 });
  }

  function toggleSignal() {
    setSignalAwake((value) => !value);
    trackStudioClientEvent({
      eventName: signalAwake ? "studio_signal_sleep" : "studio_signal_awake",
    });
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] px-5 pb-24 pt-28 sm:px-8 sm:pt-32"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        "--studio-pointer-x": `${pointer.x * 14}px`,
        "--studio-pointer-y": `${pointer.y * 14}px`,
      } as CSSProperties}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "linear-gradient(to bottom, black 0%, transparent 72%)",
      }} />
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-cyan-400/[0.08] blur-[120px]" style={{ transform: "translate(var(--studio-pointer-x), var(--studio-pointer-y))" }} aria-hidden="true" />
      <div className="pointer-events-none absolute right-[-8%] top-[18%] h-[34rem] w-[34rem] rounded-full bg-sky-500/[0.06] blur-[140px]" style={{ transform: "translate(calc(var(--studio-pointer-x) * -0.7), calc(var(--studio-pointer-y) * -0.7))" }} aria-hidden="true" />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="flex items-center justify-between gap-6 border-b border-white/[0.07] pb-4">
          <div className="mono text-[9px] tracking-[0.28em] text-cyan-300/80">KUTUZOV STUDIO / PRIVATE BUILD</div>
          <div className="hidden items-center gap-3 sm:flex">
            <span className="mono text-[9px] tracking-[0.2em] text-white/30">SYSTEM STATUS</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-emerald-300/85">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
              Building
            </span>
          </div>
        </div>

        <div className="grid items-center gap-16 pb-24 pt-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12 lg:pb-28 lg:pt-14">
          <div className="relative z-10 max-w-[690px]">
            <motion.div initial={reducedMotion ? undefined : { opacity: 0, y: 18 }} animate={reducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-cyan-200/80"><Sparkles size={11} aria-hidden="true" />Early access: sealed</span>
                <span className="mono text-[9px] tracking-[0.2em] text-white/25">MAPUTO / 2026</span>
              </div>
              <h1 className="display mt-7 max-w-4xl text-[clamp(3.4rem,8vw,8.4rem)] font-semibold leading-[0.86] tracking-[-0.06em] text-[var(--color-text-primary)]">
                <span className="block">Something</span>
                <span className="block text-white/45">more precise</span>
                <span className="block">is taking shape.</span>
              </h1>
              <div className="mt-8 grid max-w-[620px] gap-4 border-l border-cyan-300/20 pl-5">
                <p className="text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-[17px]">Kutuzov Studio is the private creative layer behind the public work. The tools are being built around one idea: less friction between a thought, a visual system and the final thing people can use.</p>
                <p className="text-sm leading-relaxed text-white/38">The Studio stays closed while the foundations are tested. The portfolio remains open.</p>
              </div>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--color-bg)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(255,255,255,0.08)]">Explore the work <ArrowUpRight size={16} aria-hidden="true" /></Link>
                <button type="button" onClick={toggleSignal} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-3.5 text-sm font-semibold text-white transition duration-300 hover:border-cyan-300/30 hover:bg-cyan-300/[0.05]" aria-pressed={signalAwake}>{signalAwake ? "Signal awake" : "Wake the signal"} <Radio size={15} aria-hidden="true" /></button>
              </div>
              <div className="mt-8 flex items-center gap-3 text-white/25"><ArrowDownRight size={14} aria-hidden="true" /><span className="mono text-[9px] tracking-[0.2em]">Scroll to inspect the build</span></div>
            </motion.div>
          </div>

          <motion.div initial={reducedMotion ? undefined : { opacity: 0, scale: 0.94, y: 20 }} animate={reducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }} transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }} className="relative flex min-h-[500px] items-center justify-center lg:min-h-[680px]">
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <div className="absolute h-[88%] w-[88%] rounded-full border border-cyan-300/[0.05]" />
              <div className="absolute h-[72%] w-[72%] rounded-full border border-cyan-300/[0.045]" />
              <motion.div animate={reducedMotion ? undefined : { rotate: 360 }} transition={reducedMotion ? undefined : { duration: 36, repeat: Infinity, ease: "linear" }} className="absolute h-[76%] w-[76%]"><span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.9)]" /></motion.div>
            </div>
            <div className="relative w-full max-w-[720px]"><StudioConstructionSignal /></div>
            <div className="absolute left-3 top-8 hidden w-40 flex-col gap-2 md:flex">
              {["Creative engine", "Digital identity", "Private workspace"].map((item, index) => (
                <motion.div key={item} initial={reducedMotion ? undefined : { opacity: 0, x: -10 }} animate={reducedMotion ? undefined : { opacity: 1, x: 0 }} transition={{ delay: 0.45 + index * 0.08 }} className="rounded-xl border border-white/[0.07] bg-black/20 px-3 py-2.5 backdrop-blur-sm">
                  <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300/75" /><span className="text-[11px] font-medium text-white/65">{item}</span></div>
                  <div className="mono mt-1 text-[7px] tracking-[0.18em] text-white/20">{index === 0 ? "PROCESS" : index === 1 ? "IDENTITY" : "PRIVATE"}</div>
                </motion.div>
              ))}
            </div>
            <div className="absolute bottom-7 right-1 w-44 rounded-xl border border-white/[0.07] bg-black/25 p-3 backdrop-blur-sm sm:right-8">
              <div className="flex items-center justify-between"><span className="mono text-[8px] tracking-[0.16em] text-white/25">SIGNAL</span><span className={`mono text-[8px] tracking-[0.16em] ${signalAwake ? "text-cyan-300" : "text-white/25"}`}>{signalAwake ? "ACTIVE" : "STANDBY"}</span></div>
              <div className="mt-3 h-px bg-white/[0.08]"><motion.div animate={signalAwake ? { width: ["18%", "84%", "52%", "92%"] } : { width: "18%" }} transition={signalAwake ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }} className="h-px bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.75)]" /></div>
              <p className="mt-2 text-[10px] leading-relaxed text-white/30">{signalAwake ? "Surface responding. Public release stays locked." : "Wake the interface to inspect the build state."}</p>
            </div>
          </motion.div>
        </div>

        <section id="studio-build" className="border-y border-white/[0.07] py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <div className="mono text-[9px] tracking-[0.25em] text-cyan-300/70">BUILD SIGNAL</div>
              <h2 className="display mt-3 text-4xl leading-[0.95] tracking-[-0.04em] text-white sm:text-5xl">A studio is more than a toolbox.</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/40">This is the layer being built now: a connected environment where creative thinking, production systems and digital delivery can live under one roof.</p>
              <div className="mt-8 grid gap-2">
                {[
                  ["01", "Foundation", "Online"],
                  ["02", "Creative systems", "Building"],
                  ["03", "Digital identity", "Building"],
                  ["04", "Public release", "Not yet"],
                ].map(([number, label, status]) => (
                  <div key={number} className="grid grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.015] px-3 py-3">
                    <span className="mono text-[9px] tracking-[0.18em] text-white/20">{number}</span>
                    <span className="text-xs text-white/55">{label}</span>
                    <span className={`mono text-[8px] tracking-[0.16em] ${status === "Online" ? "text-emerald-300/75" : status === "Building" ? "text-cyan-300/75" : "text-white/22"}`}>{status}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-white/[0.07] bg-[linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.012))] p-4 sm:p-6">
              <div className="flex flex-col gap-2 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div><div className="mono text-[9px] tracking-[0.22em] text-white/25">SYSTEM MAP</div><p className="mt-1 text-sm text-white/45">Choose a layer to inspect.</p></div>
                <div className="flex flex-wrap gap-2">
                  {BUILD_STATES.map(({ id, label }) => (
                    <button key={id} type="button" onClick={() => setActiveState(id)} className={`rounded-full border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] transition ${activeState === id ? "border-cyan-300/25 bg-cyan-300/[0.08] text-cyan-200" : "border-white/[0.08] bg-white/[0.02] text-white/28 hover:border-white/15 hover:text-white/55"}`} aria-pressed={activeState === id}>{label}</button>
                  ))}
                </div>
              </div>
              <motion.div key={active.id} initial={reducedMotion ? undefined : { opacity: 0, y: 10 }} animate={reducedMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }} className="grid gap-7 py-7 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.05] text-cyan-200">{(() => { const Icon = active.icon; return <Icon size={22} strokeWidth={1.7} aria-hidden="true" />; })()}</div>
                <div><div className="mono text-[8px] tracking-[0.22em] text-cyan-300/60">{active.kicker}</div><h3 className="display mt-2 max-w-2xl text-3xl leading-tight tracking-[-0.035em] text-white sm:text-4xl">{active.title}</h3><p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/42">{active.body}</p><div className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium text-white/55"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />{active.label === "Signal" ? "Public layer" : active.label === "Systems" ? "Private infrastructure" : "Digital output"}<ChevronRight size={14} aria-hidden="true" className="text-white/25" /></div></div>
              </motion.div>
              <div className="grid gap-3 border-t border-white/[0.07] pt-5 sm:grid-cols-3">
                {[
                  ["Input", "Ideas"],
                  ["Process", "Systems"],
                  ["Output", "Useful objects"],
                ].map(([label, value]) => <div key={label} className="rounded-xl border border-white/[0.06] bg-black/10 px-4 py-3"><div className="mono text-[8px] tracking-[0.16em] text-white/20">{label}</div><div className="mt-2 text-sm text-white/50">{value}</div></div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            <div className="mono text-[9px] tracking-[0.25em] text-cyan-300/70">UNTIL THEN</div>
            <h2 className="display mt-3 text-5xl leading-[0.92] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">The work is already public.</h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/40">Explore the portfolio, the systems and the campaigns that are already live. The Studio can stay private while the work stays visible.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5">Open portfolio <ArrowUpRight size={15} aria-hidden="true" /></Link>
            <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white">Return home</Link>
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-white/20 sm:flex-row sm:items-center sm:justify-between">
          <span className="mono text-[8px] tracking-[0.22em]">KUTUZOV STUDIO / 01</span>
          <span className="mono text-[8px] tracking-[0.22em]">PRIVATE BY DESIGN</span>
        </div>
      </div>
    </section>
  );
}
