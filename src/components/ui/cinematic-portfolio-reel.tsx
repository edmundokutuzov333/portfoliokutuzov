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
    return {
      distanceDivisor: 120,
      velocityDivisor: 500,
      sensitivity: 180,
      xMultiplier: 90,
      yMultiplier: 20,
      rotationMultiplier: 8,
      scaleReduction: 0.06,
    };
  }

  if (width < 1024) {
    return {
      distanceDivisor: 160,
      velocityDivisor: 650,
      sensitivity: 220,
      xMultiplier: 130,
      yMultiplier: 30,
      rotationMultiplier: 10,
      scaleReduction: 0.09,
    };
  }

  return {
    distanceDivisor: 200,
    velocityDivisor: 800,
    sensitivity: 250,
    xMultiplier: 170,
    yMultiplier: 40,
    rotationMultiplier: 12,
    scaleReduction: 0.12,
  };
};

export function CinematicPortfolioReel() {
  const { data: projectsData } = useProjects();
  const baseProjects = React.useMemo(() => {
    return (projectsData || []).filter((p) => p.cover_url);
  }, [projectsData]);

  const [slides, setSlides] = React.useState<DbProject[]>([]);

  React.useEffect(() => {
    if (baseProjects.length > 0) {
      // Shuffle on mount/refresh
      const shuffled = [...baseProjects].sort(() => Math.random() - 0.5);
      const newSlides: DbProject[] = [];
      while (newSlides.length < 20) {
        newSlides.push(...shuffled);
      }
      setSlides(newSlides);
    }
  }, [baseProjects]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-[var(--color-bg)] pt-28 pb-8 md:pt-32 md:pb-12">
      <div className="w-full flex justify-center mb-10 px-4 relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]"
        >
          Selected Portfolio Reel
        </motion.p>
      </div>
      <CarouselStacked slides={slides} />
    </section>
  );
}

const CarouselStacked = ({ slides }: { slides: DbProject[] }) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(0);
  const total = slides.length;
  const prefersReducedMotion = useReducedMotion();

  // Continuous Autoplay
  const animationRef = React.useRef<number | undefined>(undefined);
  const isDragging = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      return; // Stop autoplay if user prefers reduced motion
    }

    const play = () => {
      if (!isDragging.current) {
        scrollProgress.set(scrollProgress.get() + 0.02); // Fast, fluid speed
      }
      animationRef.current = requestAnimationFrame(play);
    };
    animationRef.current = requestAnimationFrame(play);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scrollProgress, prefersReducedMotion]);

  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x;

    const distanceShift = -dragDistance / config.distanceDivisor;
    const velocityShift = -velocity / config.velocityDivisor;

    let totalShift = Math.round(distanceShift + velocityShift);
    totalShift = Math.max(-3, Math.min(3, totalShift));

    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden select-none">
      <div className="relative flex h-full w-full items-center justify-center">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragStart={handleDragStart}
          onDrag={(_, info) => {
            const delta = -info.delta.x / config.sensitivity;
            scrollProgress.set(scrollProgress.get() + delta);
          }}
          onDragEnd={handleDragEnd}
          className="absolute inset-0 z-50 cursor-grab active:cursor-grabbing touch-pan-y"
        />

        {slides.map((slide, index) => (
          <CarouselCard
            key={`${slide.id}-${index}`}
            slide={slide}
            index={index}
            total={total}
            progress={scrollProgress}
            config={config}
          />
        ))}
      </div>
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

  const y = useTransform(offset, (value) => {
    const abs = Math.abs(value);
    if (abs < 0.05) return 0;
    return abs * config.yMultiplier;
  });

  const rotate = useTransform(offset, (value) => {
    if (Math.abs(value) < 0.05) return 0;
    return value * config.rotationMultiplier;
  });

  const scale = useTransform(offset, (value) => {
    return 1 - Math.abs(value) * config.scaleReduction;
  });

  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );

  const zIndex = useTransform(offset, (value) => {
    return Math.round(100 - Math.abs(value) * 10);
  });

  const badge = slide.category + (slide.year ? ` · ${slide.year}` : "");

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, zIndex }}
      className="absolute h-[85%] w-auto aspect-[4/5] rounded-xl overflow-hidden shadow-2xl bg-black border border-[var(--color-border-subtle)]"
    >
      {/* 
        Ensure a link handles the click but prevents dragging from triggering it.
        We can do this by wrapping content or checking drag state, but we don't 
        want the link to intercept the global drag div above.
        Actually, since the drag area z-index is 50, standard links won't be clickable.
        To make it clickable, pointer-events on the drag div can be problematic, 
        but in this concept it's typical to have the drag layer covering it.
        Let's allow pointer events to pass through, or just use the drag div to handle clicks.
        Wait, the user's base code has the drag div covering everything. I'll stick to that 
        and render visual only, since dragging is primary.
      */}
      <div className="relative w-full h-full bg-[#050505]">
        {slide.cover_url && (
          <img
            src={slide.cover_url}
            alt={slide.title}
            className="w-full h-full object-contain object-center"
            draggable={false}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">
            {badge}
          </div>
          <h3 className="display text-2xl md:text-3xl text-white font-medium leading-[1.1] tracking-[-0.02em]">
            {slide.title}
          </h3>
          {slide.subtitle && <div className="text-white/80 text-sm mt-1">{slide.subtitle}</div>}
        </div>
      </div>
    </motion.div>
  );
};
