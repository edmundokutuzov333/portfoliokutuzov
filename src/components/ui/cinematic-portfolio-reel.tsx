import * as React from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type PanInfo,
  type MotionValue,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { type DbProject } from "@/lib/cms";

interface CarouselConfig {
  distanceDivisor: number;
  velocityDivisor: number;
  sensitivity: number;
  xMultiplier: number;
  yMultiplier: number;
  rotationMultiplier: number;
  scaleReduction: number;
}
const getCarouselConfig = (width: number): CarouselConfig =>
  width < 640
    ? { distanceDivisor: 135, velocityDivisor: 560, sensitivity: 190, xMultiplier: 78, yMultiplier: 16, rotationMultiplier: 6, scaleReduction: 0.045 }
    : width < 1024
      ? { distanceDivisor: 160, velocityDivisor: 650, sensitivity: 220, xMultiplier: 125, yMultiplier: 28, rotationMultiplier: 9, scaleReduction: 0.08 }
      : { distanceDivisor: 200, velocityDivisor: 800, sensitivity: 250, xMultiplier: 170, yMultiplier: 40, rotationMultiplier: 12, scaleReduction: 0.12 };

const orderedProjects = (projects: DbProject[]) =>
  [...projects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id.localeCompare(b.id));

export function CinematicPortfolioReel() {
  const { data } = useProjects();
  const projects = React.useMemo(() => orderedProjects((data ?? []).filter((project) => Boolean(project.cover_url))), [data]);
  if (!projects.length) return null;

  return (
    <section aria-labelledby="portfolio-reel-title" className="relative isolate z-0 w-full overflow-hidden bg-[var(--color-bg)] pt-28 pb-8 md:pt-32 md:pb-12">
      <div className="relative z-[5] mb-10 flex w-full justify-center px-4">
        <motion.p id="portfolio-reel-title" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="mono text-[10px] uppercase tracking-[.3em] text-[var(--color-text-muted)]">
          Selected Portfolio Reel
        </motion.p>
      </div>
      <CarouselStacked projects={projects} />
    </section>
  );
}

function CarouselStacked({ projects }: { projects: DbProject[] }) {
  const progress = useMotionValue(0);
  const start = React.useRef(0);
  const [width, setWidth] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [active, setActive] = React.useState(true);
  const reduced = useReducedMotion();
  const raf = React.useRef<number | undefined>(undefined);
  const dragging = React.useRef(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const config = React.useMemo(() => getCarouselConfig(width), [width]);
  const count = width > 0 && width < 640 ? Math.min(10, Math.max(6, projects.length)) : Math.min(16, Math.max(8, projects.length * 2));
  const slides = React.useMemo(() => Array.from({ length: count }, (_, i) => projects[i % projects.length]), [count, projects]);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "160px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    const onVisibility = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const resize = () => setWidth(window.innerWidth);
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);
  React.useEffect(() => {
    if (reduced || paused || !visible || !active) return;
    const loop = () => {
      if (!dragging.current) progress.set(progress.get() + 0.02);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current !== undefined) cancelAnimationFrame(raf.current);
    };
  }, [active, paused, progress, reduced, visible]);

  const move = React.useCallback((amount: number) => {
    setPaused(true);
    animate(progress, Math.round(progress.get()) + amount, { type: "spring", stiffness: 220, damping: 28, mass: 0.9 });
  }, [progress]);
  const onStart = () => {
    dragging.current = true;
    start.current = progress.get();
  };
  const onEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    dragging.current = false;
    const distance = -info.offset.x / config.distanceDivisor;
    const velocity = -info.velocity.x / config.velocityDivisor;
    const shift = Math.max(-3, Math.min(3, Math.round(distance + velocity)));
    animate(progress, Math.round(start.current) + shift, { type: "spring", stiffness: 200, damping: 30, mass: 1 });
  };

  return (
    <div ref={ref} className="relative h-[50vh] w-full select-none overflow-hidden md:h-[60vh] lg:h-[70vh]">
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.button type="button" drag="x" dragConstraints={{ left: 0, right: 0 }} onDragStart={onStart} onDrag={(_, info) => progress.set(progress.get() - info.delta.x / config.sensitivity)} onDragEnd={onEnd} onKeyDown={(event) => { if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } else if (event.key === "ArrowRight") { event.preventDefault(); move(1); } else if (event.key === " ") { event.preventDefault(); setPaused((value) => !value); } }} aria-label="Portfolio reel. Use the left and right arrow keys to navigate, or space to pause." className="absolute inset-0 z-[20] cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing touch-pan-y focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)] focus-visible:outline-offset-[-4px]" />
        {slides.map((slide, index) => <CarouselCard key={`${slide.id}-${index}`} slide={slide} index={index} total={slides.length} progress={progress} config={config} />)}
      </div>
      {!reduced && (
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Resume portfolio reel" : "Pause portfolio reel"} className="absolute bottom-5 right-5 z-[25] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]">
          {paused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}

function CarouselCard({ slide, index, total, progress, config }: { slide: DbProject; index: number; total: number; progress: MotionValue<number>; config: CarouselConfig }) {
  const offset = useTransform(progress, (value) => {
    let distance = (index - value) % total;
    if (distance > total / 2) distance -= total;
    if (distance < -total / 2) distance += total;
    return distance;
  });
  const x = useTransform(offset, (value) => value * config.xMultiplier);
  const y = useTransform(offset, (value) => (Math.abs(value) < 0.05 ? 0 : Math.abs(value) * config.yMultiplier));
  const rotate = useTransform(offset, (value) => (Math.abs(value) < 0.05 ? 0 : value * config.rotationMultiplier));
  const scale = useTransform(offset, (value) => 1 - Math.abs(value) * config.scaleReduction);
  const opacity = useTransform(offset, [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(offset, (value) => Math.round(100 - Math.abs(value) * 10));
  return (
    <motion.div style={{ x, y, rotate, scale, opacity, zIndex }} aria-hidden="true" className="absolute aspect-[4/5] h-[85%] w-auto overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black shadow-2xl">
      <div className="relative h-full w-full bg-[#050505]">
        <img src={slide.cover_url!} alt="" width={slide.cover_width ?? undefined} height={slide.cover_height ?? undefined} loading={index < 3 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" draggable={false} className="h-full w-full object-contain object-center" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="mono mb-2 text-[10px] uppercase tracking-[.2em] text-white/70">{slide.category}{slide.year ? ` · ${slide.year}` : ""}</div>
          <h3 className="display text-2xl font-medium leading-[1.1] tracking-[-.02em] text-white md:text-3xl">{slide.title}</h3>
          {slide.subtitle && <div className="mt-1 text-sm text-white/80">{slide.subtitle}</div>}
        </div>
      </div>
    </motion.div>
  );
}
