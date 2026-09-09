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

const getCarouselConfig = (width: number): CarouselConfig => {
  if (width < 640) {
    return { distanceDivisor: 120, velocityDivisor: 500, sensitivity: 180, xMultiplier: 90, yMultiplier: 20, rotationMultiplier: 8, scaleReduction: 0.06 };
  }
  if (width < 1024) {
    return { distanceDivisor: 160, velocityDivisor: 650, sensitivity: 220, xMultiplier: 130, yMultiplier: 30, rotationMultiplier: 10, scaleReduction: 0.09 };
  }
  return { distanceDivisor: 200, velocityDivisor: 800, sensitivity: 250, xMultiplier: 170, yMultiplier: 40, rotationMultiplier: 12, scaleReduction: 0.12 };
};

function stableProjectOrder(projects: DbProject[]) {
  return [...projects].sort((a, b) => {
    const left = `${a.sort_order ?? 0}:${a.id}`;
    const right = `${b.sort_order ?? 0}:${b.id}`;
    return left.localeCompare(right);
  });
}

export function CinematicPortfolioReel() {
  const { data: projectsData } = useProjects();
  const baseProjects = React.useMemo(
    () => (projectsData || []).filter((project) => Boolean(project.cover_url)),
    [projectsData],
  );
  const slides = React.useMemo(() => {
    if (!baseProjects.length) return [];
    const ordered = stableProjectOrder(baseProjects);
    const result: DbProject[] = [];
    const targetCount = Math.min(16, Math.max(8, ordered.length * 2));
    for (let index = 0; index < targetCount; index += 1) {
      result.push(ordered[index % ordered.length]);
    }
    return result;
  }, [baseProjects]);

  if (!slides.length) return null;

  return (
    <section
      aria-label="Selected portfolio reel"
      className="relative w-full overflow-hidden bg-[var(--color-bg)] pt-28 pb-8 md:pt-32 md:pb-12"
    >
      <div className="w-full flex justify-center mb-10 px-4 relative z-10">
        <p className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
          Selected Portfolio Reel
        </p>
      </div>
      <CarouselStacked slides={slides} />
    </section>
  );
}

const CarouselStacked = ({ slides }: { slides: DbProject[] }) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const total = slides.length;
  const prefersReducedMotion = useReducedMotion();
  const animationRef = React.useRef<number | undefined>(undefined);
  const isDragging = React.useRef(false);
  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();
    window.addEventListener("resize", updateWidth, { passive: true });
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion || isPaused) return;
    const play = () => {
      if (!isDragging.current) scrollProgress.set(scrollProgress.get() + 0.02);
      animationRef.current = requestAnimationFrame(play);
    };
    animationRef.current = requestAnimationFrame(play);
    return () => {
      if (animationRef.current !== undefined) cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused, prefersReducedMotion, scrollProgress]);

  const moveBy = React.useCallback((amount: number) => {
    setIsPaused(true);
    const target = Math.round(scrollProgress.get()) + amount;
    animate(scrollProgress, target, { type: "spring", stiffness: 220, damping: 28, mass: 0.9 });
  }, [scrollProgress]);

  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;
    const totalShift = Math.max(-3, Math.min(3, Math.round(distanceShift + velocityShift)));
    animate(scrollProgress, Math.round(startProgress.current) + totalShift, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden select-none">
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.button
          type="button"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => scrollProgress.set(scrollProgress.get() - info.delta.x / config.sensitivity)}
          onDragEnd={handleDragEnd}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              moveBy(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              moveBy(1);
            } else if (event.key === " ") {
              event.preventDefault();
              setIsPaused((paused) => !paused);
            }
          }}
          aria-label="Portfolio reel. Use the left and right arrow keys to navigate, or space to pause."
          className="absolute inset-0 z-50 cursor-grab border-0 bg-transparent p-0 active:cursor-grabbing touch-pan-y focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)] focus-visible:outline-offset-[-4px]"
        />

        {slides.map((slide, index) => (
          <CarouselCard key={`${slide.id}-${index}`} slide={slide} index={index} total={total} progress={scrollProgress} config={config} />
        ))}
      </div>

      {!prefersReducedMotion && (
        <button
          type="button"
          onClick={() => setIsPaused((paused) => !paused)}
          aria-label={isPaused ? "Resume portfolio reel" : "Pause portfolio reel"}
          className="absolute bottom-5 right-5 z-[60] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70 focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]"
        >
          {isPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
        </button>
      )}
    </div>
  );
};

interface CarouselCardProps {
  slide: DbProject;
  index: number;
  total: number;
  progress: MotionValue<number>;
  config: CarouselConfig;
}

const CarouselCard = ({ slide, index, total, progress, config }: CarouselCardProps) => {
  const offset = useTransform(progress, (p) => {
    let diff = (index - p) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });
  const x = useTransform(offset, (value) => value * config.xMultiplier);
  const y = useTransform(offset, (value) => Math.abs(value) < 0.05 ? 0 : Math.abs(value) * config.yMultiplier);
  const rotate = useTransform(offset, (value) => Math.abs(value) < 0.05 ? 0 : value * config.rotationMultiplier);
  const scale = useTransform(offset, (value) => 1 - Math.abs(value) * config.scaleReduction);
  const opacity = useTransform(offset, [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(offset, (value) => Math.round(100 - Math.abs(value) * 10));
  const badge = slide.category + (slide.year ? ` · ${slide.year}` : "");

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, zIndex }}
      aria-hidden="true"
      className="absolute h-[85%] w-auto aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-black border border-[var(--color-border-subtle)]"
    >
      <div className="relative w-full h-full bg-[#050505]">
        <img
          src={slide.cover_url!}
          alt=""
          width={slide.cover_width ?? undefined}
          height={slide.cover_height ?? undefined}
          loading={index < 3 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : "auto"}
          decoding="async"
          draggable={false}
          className="w-full h-full object-contain object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">{badge}</div>
          <h3 className="display text-2xl md:text-3xl text-white font-medium leading-[1.1] tracking-[-0.02em]">{slide.title}</h3>
          {slide.subtitle && <div className="text-white/80 text-sm mt-1">{slide.subtitle}</div>}
        </div>
      </div>
    </motion.div>
  );
};
