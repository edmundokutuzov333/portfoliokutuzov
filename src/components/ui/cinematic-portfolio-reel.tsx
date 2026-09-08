import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useProjects } from "@/hooks/useSiteData";
import { type DbProject } from "@/lib/cms";
import { projects as staticProjects } from "@/data/projects";
import { toDeterministicUuid } from "@/lib/utils";

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

/**
 * The reel must have a useful first paint even when Supabase is not configured.
 * The static project data supplies the metadata and ProjectArtwork supplies a
 * deterministic visual cover until a CMS cover is available.
 */
const FALLBACK_PROJECTS: DbProject[] = staticProjects.map((project) => ({
  id: toDeterministicUuid("00000004", project.id),
  slug: project.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: project.title,
  subtitle: project.subtitle,
  category: project.category,
  year: project.year,
  description: project.description,
  cover_url: project.coverUrl ?? null,
  gallery: [],
  tags: project.tags ?? [],
  palette: project.palette,
  span: project.span ?? null,
  sort_order: project.id,
  is_published: true,
  featured: project.id <= 3,
  featured_priority: 4 - project.id,
  client_name: project.title,
}));

const ARTWORK_STYLES = [
  {
    background: "linear-gradient(145deg, #07122b 0%, #0a4d9b 45%, #02050c 100%)",
    accent: "#57c7ff",
    shape: "rounded-full",
  },
  {
    background: "linear-gradient(145deg, #02050c 0%, #102e64 50%, #087fbd 100%)",
    accent: "#38bdf8",
    shape: "rounded-[42%]",
  },
  {
    background: "linear-gradient(145deg, #05172b 0%, #087e9c 50%, #031018 100%)",
    accent: "#8be9ff",
    shape: "rounded-[30%]",
  },
  {
    background: "linear-gradient(145deg, #17100a 0%, #713c14 44%, #050505 100%)",
    accent: "#f6ba6d",
    shape: "rounded-full",
  },
  {
    background: "linear-gradient(145deg, #080516 0%, #3a1f7a 46%, #071a3d 100%)",
    accent: "#b7a2ff",
    shape: "rounded-[36%]",
  },
  {
    background: "linear-gradient(145deg, #041c1b 0%, #0f766e 48%, #020b13 100%)",
    accent: "#6ee7b7",
    shape: "rounded-[24%]",
  },
] as const;

export function CinematicPortfolioReel() {
  const { data: projectsData } = useProjects();

  const baseProjects = React.useMemo(() => {
    const availableProjects = projectsData?.length ? projectsData : FALLBACK_PROJECTS;
    return availableProjects.filter((project) => project.is_published !== false);
  }, [projectsData]);

  const slides = React.useMemo(() => {
    if (baseProjects.length === 0) return [];

    // Repeat the available work so the stack remains cinematic with a small
    // CMS dataset, while keeping the order stable between renders.
    return Array.from({ length: Math.max(20, baseProjects.length * 3) }, (_, index) => {
      return baseProjects[index % baseProjects.length];
    });
  }, [baseProjects]);

  return (
    <section
      aria-labelledby="portfolio-reel-heading"
      className="relative w-full overflow-hidden bg-[var(--color-bg)] pt-28 pb-8 md:pt-32 md:pb-12"
    >
      <div className="mx-auto flex w-full max-w-[var(--width-wide)] items-center justify-between gap-6 px-5 md:px-8">
        <motion.p
          id="portfolio-reel-heading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]"
        >
          Selected Portfolio Reel
        </motion.p>
        <p className="mono text-right text-[9px] uppercase tracking-[0.22em] text-sky-400/80 md:text-[10px] md:tracking-[0.3em]">
          Drag to browse <span aria-hidden="true">·</span> Click to open case
        </p>
      </div>

      {slides.length > 0 && <CarouselStacked slides={slides} />}
    </section>
  );
}

const CarouselStacked = ({ slides }: { slides: DbProject[] }) => {
  const scrollProgress = useMotionValue(0);
  const startProgress = React.useRef(0);
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window === "undefined" ? 1024 : window.innerWidth,
  );
  const total = slides.length;
  const prefersReducedMotion = useReducedMotion();

  const animationRef = React.useRef<number | undefined>(undefined);
  const isDragging = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const play = () => {
      if (!isDragging.current) {
        // One card takes several seconds to travel through the centre. This
        // keeps the reel alive without racing past the artwork.
        scrollProgress.set(scrollProgress.get() + 0.0025);
      }
      animationRef.current = requestAnimationFrame(play);
    };

    animationRef.current = requestAnimationFrame(play);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReducedMotion, scrollProgress]);

  const config = React.useMemo(() => getCarouselConfig(windowWidth), [windowWidth]);

  const handleDragStart = () => {
    isDragging.current = true;
    startProgress.current = scrollProgress.get();
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.current = false;
    const distanceShift = -info.offset.x / config.distanceDivisor;
    const velocityShift = -info.velocity.x / config.velocityDivisor;
    const totalShift = Math.max(-3, Math.min(3, Math.round(distanceShift + velocityShift)));
    const target = Math.round(startProgress.current) + totalShift;

    animate(scrollProgress, target, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      mass: 1,
    });
  };

  return (
    <div className="relative h-[50vh] w-full select-none overflow-hidden md:h-[60vh] lg:h-[70vh]">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDrag={(_, info) => {
          const delta = -info.delta.x / config.sensitivity;
          scrollProgress.set(scrollProgress.get() + delta);
        }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 z-10 flex h-full w-full cursor-grab items-center justify-center touch-pan-y active:cursor-grabbing"
      >
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
      </motion.div>
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
  const offset = useTransform(progress, (value) => {
    let diff = (index - value) % total;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  });

  const x = useTransform(offset, (value) => value * config.xMultiplier);
  const y = useTransform(offset, (value) => {
    const absoluteValue = Math.abs(value);
    return absoluteValue < 0.05 ? 0 : absoluteValue * config.yMultiplier;
  });
  const rotate = useTransform(offset, (value) =>
    Math.abs(value) < 0.05 ? 0 : value * config.rotationMultiplier,
  );
  const scale = useTransform(offset, (value) => 1 - Math.abs(value) * config.scaleReduction);
  const opacity = useTransform(
    offset,
    [-total / 2, -total / 2 + 0.5, 0, total / 2 - 0.5, total / 2],
    [0, 1, 1, 1, 0],
  );
  const zIndex = useTransform(offset, (value) => Math.round(100 - Math.abs(value) * 10));
  const slug = slide.slug || slide.id;
  const badge = slide.category + (slide.year ? ` · ${slide.year}` : "");

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, zIndex }}
      className="absolute h-[85%] w-auto aspect-[4/5] overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black shadow-2xl"
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug }}
        aria-label={`Open ${slide.title} case`}
        className="group relative block h-full w-full bg-[#050505] focus:outline-none"
      >
        <ProjectArtwork slide={slide} index={index} />
        {slide.cover_url && (
          <img
            src={slide.cover_url}
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-center transition duration-700 group-hover:scale-[1.025]"
            draggable={false}
            onError={(event) => event.currentTarget.remove()}
          />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
        <div className="pointer-events-none absolute bottom-6 left-6 right-6">
          <div className="mono mb-2 text-[10px] uppercase tracking-[0.2em] text-white/70">
            {badge}
          </div>
          <h3 className="display text-2xl font-medium leading-[1.1] tracking-[-0.02em] text-white md:text-3xl">
            {slide.title}
          </h3>
          {slide.subtitle && <div className="mt-1 text-sm text-white/80">{slide.subtitle}</div>}
        </div>
      </Link>
    </motion.div>
  );
};

function ProjectArtwork({ slide, index }: { slide: DbProject; index: number }) {
  const artwork = ARTWORK_STYLES[index % ARTWORK_STYLES.length];
  const number = String((index % 99) + 1).padStart(2, "0");

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ background: artwork.background }}
      aria-hidden="true"
    >
      <div
        className="absolute -right-[20%] -top-[12%] h-[62%] w-[82%] rotate-[18deg] border border-white/20"
        style={{ borderColor: `${artwork.accent}55` }}
      />
      <div
        className={`absolute -bottom-[16%] -left-[20%] h-[62%] w-[82%] ${artwork.shape} border border-white/15`}
        style={{ borderColor: `${artwork.accent}66` }}
      />
      <div
        className="absolute inset-5 rounded-lg border border-white/15"
        style={{ boxShadow: `inset 0 0 80px ${artwork.accent}24` }}
      />
      <div className="absolute left-6 right-6 top-6 flex items-start justify-between gap-4">
        <span className="mono text-[9px] tracking-[0.25em] text-white/65">{slide.category}</span>
        <span className="mono text-[9px] tracking-[0.25em]" style={{ color: artwork.accent }}>
          {number}
        </span>
      </div>
      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2">
        <div className="display max-w-[85%] text-4xl font-semibold uppercase leading-[0.9] tracking-[-0.04em] text-white/90 md:text-5xl">
          {slide.title}
        </div>
        <div className="mt-4 h-px w-16" style={{ backgroundColor: artwork.accent }} />
      </div>
    </div>
  );
}
