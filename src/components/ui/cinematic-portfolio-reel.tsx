import * as React from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion, animate, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, Maximize2, Pause, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useProjects } from "@/hooks/useSiteData";
import { type DbProject } from "@/lib/cms";
import { darkenWorkColor, pickFg, setWorkColor } from "@/lib/work-color";

const DEFAULT_WORK = "#2f4bff";
const RENDER_RADIUS = 5;

type ReelEvent = "view" | "hover" | "open" | "cinema";

type ReelItem = {
  id: string;
  title: string;
  client?: string;
  discipline?: string;
  year?: number;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  posterUrl?: string;
  dominantColor?: string;
  accentColor?: string;
  caseSlug: string;
};

function paletteColor(project: DbProject): string {
  const matches = project.palette?.match(/#[0-9a-f]{6}\b/gi) ?? [];
  return matches.at(-1) ?? DEFAULT_WORK;
}

function projectSlug(project: DbProject): string {
  return String(project.slug || project.id).trim() || project.id;
}

function roundRobin(projects: DbProject[]): DbProject[] {
  const sorted = [...projects].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.id.localeCompare(b.id),
  );
  const groups = new Map<string, DbProject[]>();

  for (const project of sorted) {
    const key = project.category?.trim() || "Project";
    const group = groups.get(key) ?? [];
    group.push(project);
    groups.set(key, group);
  }

  const out: DbProject[] = [];
  let moved = true;
  while (moved) {
    moved = false;
    for (const group of groups.values()) {
      const next = group.shift();
      if (!next) continue;
      out.push(next);
      moved = true;
    }
  }
  return out;
}

function mapItem(project: DbProject): ReelItem {
  return {
    id: project.id,
    title: project.title,
    client: project.client_name ?? undefined,
    discipline: project.category || "Project",
    year: project.year ? Number.parseInt(project.year, 10) || undefined : undefined,
    mediaUrl: project.cover_url ?? undefined,
    mediaType: project.video_url ? "video" : project.cover_url ? "image" : undefined,
    posterUrl: project.cover_url ?? undefined,
    dominantColor: paletteColor(project),
    caseSlug: projectSlug(project),
  };
}

function distanceToActive(index: number, active: number, total: number) {
  let distance = index - active;
  if (distance > total / 2) distance -= total;
  if (distance < -total / 2) distance += total;
  return distance;
}

function supports3d() {
  return typeof window !== "undefined"
    ? CSS.supports("transform-style", "preserve-3d") && CSS.supports("perspective", "800px")
    : false;
}

export function CinematicPortfolioReel() {
  const { data } = useProjects();
  const reducedMotion = useReducedMotion();
  const items = React.useMemo(
    () => roundRobin((data ?? []).filter((project) => project.is_published !== false)).map(mapItem),
    [data],
  );
  const [fanMode, setFanMode] = React.useState(false);

  React.useEffect(() => {
    setFanMode(!reducedMotion && supports3d());
  }, [reducedMotion]);

  if (!items.length) return null;
  return <ReelStage items={items} reducedMotion={Boolean(reducedMotion)} fanMode={fanMode} />;
}

function ReelStage({
  items,
  reducedMotion,
  fanMode,
}: {
  items: ReelItem[];
  reducedMotion: boolean;
  fanMode: boolean;
}) {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(reducedMotion);
  const [hovering, setHovering] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [cinema, setCinema] = React.useState(false);
  const [width, setWidth] = React.useState(0);
  const progress = useMotionValue(0);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const sessionSeed = React.useRef("");
  const batch = React.useRef<Array<{ itemId: string; event: ReelEvent; occurredAt: number }>>([]);
  const activeItem = items[active];

  React.useEffect(() => {
    sessionSeed.current =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now()) + "-" + Math.random();
  }, []);

  React.useEffect(() => {
    const resize = () => setWidth(window.innerWidth);
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  React.useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const flush = React.useCallback(() => {
    if (!batch.current.length || typeof navigator === "undefined" || !navigator.sendBeacon) return;
    const payload = {
      sessionSeed: sessionSeed.current,
      events: batch.current.splice(0, batch.current.length),
    };
    navigator.sendBeacon(
      "/api/reel-analytics",
      new Blob([JSON.stringify(payload)], { type: "application/json" }),
    );
  }, []);

  const track = React.useCallback(
    (itemId: string, event: ReelEvent) => {
      batch.current.push({ itemId, event, occurredAt: Date.now() });
      if (batch.current.length >= 8) flush();
    },
    [flush],
  );

  React.useEffect(() => {
    track(activeItem.id, "view");
  }, [activeItem.id, track]);

  React.useEffect(() => {
    const onPageHide = () => flush();
    window.addEventListener("pagehide", onPageHide);
    return () => window.removeEventListener("pagehide", onPageHide);
  }, [flush]);

  React.useEffect(() => {
    setWorkColor(activeItem.accentColor ?? activeItem.dominantColor);
    return () => setWorkColor(DEFAULT_WORK);
  }, [activeItem]);

  const jump = React.useCallback(
    (index: number) => {
      const next = Math.max(0, Math.min(items.length - 1, index));
      setActive(next);
      setPaused(true);
      if (fanMode) animate(progress, next, { type: "spring", stiffness: 220, damping: 28 });
      else progress.set(next);
    },
    [fanMode, items.length, progress],
  );

  const move = React.useCallback(
    (delta: number) => {
      jump((active + delta + items.length) % items.length);
    },
    [active, items.length, jump],
  );

  React.useEffect(() => {
    if (reducedMotion || paused || hovering || focused || !visible) return;
    const timer = window.setInterval(() => {
      const next = (active + 1) % items.length;
      setActive(next);
      animate(progress, next, { duration: 0.7, ease: [0.16, 1, 0.3, 1] });
    }, 3000);
    return () => window.clearInterval(timer);
  }, [active, focused, hovering, items.length, paused, progress, reducedMotion, visible]);

  const togglePause = () => {
    if (reducedMotion) return;
    setPaused((value) => !value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      jump(0);
    } else if (event.key === "End") {
      event.preventDefault();
      jump(items.length - 1);
    } else if (event.key === " ") {
      event.preventDefault();
      togglePause();
    } else if (event.key === "Enter") {
      event.preventDefault();
      setCinema(true);
      track(activeItem.id, "open");
    }
  };


  const dragEndHandler = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const shift = Math.max(-3, Math.min(3, Math.round(-info.offset.x / Math.max(width / 5, 160) - info.velocity.x / 900)));
    if (shift) move(shift);
  };

  return (
    <>
      <section
        ref={rootRef}
        role="region"
        aria-labelledby="portfolio-reel-title"
        aria-roledescription="carousel"
        className="relative isolate w-full overflow-hidden bg-black py-10 text-[#f2f2ef] md:py-14"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
        }}
      >
        <div className="mx-auto flex max-w-[1600px] items-end justify-between gap-6 px-4 md:px-8">
          <div>
            <p id="portfolio-reel-title" className="text-sm font-semibold">
              Selected portfolio reel
            </p>
            <p className="mt-2 text-sm leading-6 text-[#b9b7b0]">
              {activeItem.title}
              {activeItem.client ? " · " + activeItem.client : ""}
              {activeItem.year ? " · " + activeItem.year : ""}
            </p>
          </div>
          <div className="hidden gap-2 md:flex">
            <IconButton label="Previous project" onClick={() => move(-1)} icon={<ArrowLeft size={16} />} />
            <IconButton label="Next project" onClick={() => move(1)} icon={<ArrowRight size={16} />} />
          </div>
        </div>

        <motion.div
          tabIndex={0}
          role="group"
          aria-label="Selected portfolio reel. Use Left and Right arrows to navigate, Home and End to jump, Enter for cinema mode, Space to pause."
          className={
            fanMode
              ? "relative mt-6 h-[54vh] min-h-[360px] w-full [perspective:1100px]"
              : "relative mt-6 flex min-h-[360px] w-full snap-x snap-mandatory items-center gap-5 overflow-x-auto px-[12vw] pb-6"
          }
          drag={fanMode ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={dragEndHandler}
          onKeyDown={onKeyDown}
          style={{ touchAction: fanMode ? "pan-y" : "pan-x" }}
        >
          {items.map((item, index) => {
            const distance = distanceToActive(index, active, items.length);
            if (Math.abs(distance) > RENDER_RADIUS) return null;

            return (
              <ReelCard
                key={item.id}
                item={item}
                active={index === active}
                distance={distance}
                fanMode={fanMode}
                reducedMotion={reducedMotion}
                onHover={() => track(item.id, "hover")}
                onCinema={() => {
                  setCinema(true);
                  track(item.id, "cinema");
                }}
              />
            );
          })}
        </motion.div>

        <div className="mx-auto mt-4 flex max-w-[1600px] items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex gap-2 md:hidden">
              <IconButton label="Previous project" onClick={() => move(-1)} icon={<ArrowLeft size={16} />} />
              <IconButton label="Next project" onClick={() => move(1)} icon={<ArrowRight size={16} />} />
            </div>
            <button
              type="button"
              onClick={togglePause}
              disabled={reducedMotion}
              className="inline-flex min-h-11 items-center gap-2 border-2 border-[#f2f2ef] px-4 py-2 text-sm font-semibold disabled:opacity-50"
              aria-label={paused ? "Resume portfolio reel" : "Pause portfolio reel"}
            >
              {paused ? <Play size={15} aria-hidden /> : <Pause size={15} aria-hidden />}
              {paused ? "Play" : "Pause"}
            </button>
          </div>
          <div aria-live="polite" className="text-sm text-[#b9b7b0]">
            {active + 1} / {items.length} · {activeItem.title}
          </div>
        </div>
      </section>

      <CinemaDialog
        open={cinema}
        onOpenChange={setCinema}
        item={activeItem}
        index={active}
        total={items.length}
        onMove={move}
      />
    </>
  );
}

function IconButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-11 w-11 items-center justify-center border-2 border-[#f2f2ef]"
      aria-label={label}
    >
      {icon}
    </button>
  );
}

function ReelCard({
  item,
  active,
  distance,
  fanMode,
  reducedMotion,
  onHover,
  onCinema,
}: {
  item: ReelItem;
  active: boolean;
  distance: number;
  fanMode: boolean;
  reducedMotion: boolean;
  onHover: () => void;
  onCinema: () => void;
}) {
  const x = useMotionValue(distance * 170);
  const y = useMotionValue(Math.abs(distance) * 34);
  const rotate = useMotionValue(distance * 10);
  const scale = useMotionValue(1 - Math.abs(distance) * 0.085);
  const opacity = useMotionValue(Math.max(0.18, 1 - Math.abs(distance) * 0.12));
  const color = item.accentColor ?? item.dominantColor ?? DEFAULT_WORK;
  const dark = darkenWorkColor(color);
  const fg = pickFg(dark);

  React.useEffect(() => {
    if (!fanMode) return;
    animate(x, distance * 170, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(y, Math.abs(distance) * 34, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(rotate, distance * 10, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(scale, 1 - Math.abs(distance) * 0.085, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
    animate(opacity, active ? 1 : Math.max(0.18, 1 - Math.abs(distance) * 0.12), { duration: 0.5 });
  }, [active, distance, fanMode, opacity, rotate, scale, x, y]);

  const content = item.mediaUrl ? (
    item.mediaType === "video" ? (
      <video
        src={item.mediaUrl}
        poster={item.posterUrl}
        muted
        playsInline
        loop
        autoPlay={active && !reducedMotion}
        preload={active ? "metadata" : "none"}
        className="h-full w-full object-contain"
      />
    ) : (
      <img
        src={item.mediaUrl}
        alt=""
        loading={active ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={active ? "high" : "auto"}
        width={720}
        height={900}
        className="h-full w-full object-contain"
      />
    )
  ) : (
    <div className="flex h-full w-full flex-col justify-between p-6 md:p-8" style={{ background: dark, color: fg }}>
      <div className="flex justify-between gap-4 text-sm font-semibold">
        <span>{item.discipline}</span>
        <span>{item.year ?? ""}</span>
      </div>
      <div>
        <div className="font-cartaz text-[clamp(2rem,5vw,4rem)] font-extrabold leading-[0.84] tracking-[-0.05em]">
          {item.title}
        </div>
        {item.client ? <div className="mt-3 text-sm font-semibold">{item.client}</div> : null}
      </div>
    </div>
  );

  const card = (
    <article
      role="group"
      aria-roledescription="slide"
      aria-label={[item.title, item.client, item.year].filter(Boolean).join(" · ")}
      aria-current={active ? "true" : undefined}
      onMouseEnter={onHover}
      className={
        fanMode
          ? "absolute aspect-[4/5] h-[84%] max-h-[680px] w-auto overflow-hidden border-2 border-[#f2f2ef] bg-[#111]"
          : "relative h-[360px] w-[280px] shrink-0 snap-center overflow-hidden border-2 border-black bg-[#d6d4ce]"
      }
      style={
        fanMode
          ? {
              x,
              y,
              rotate,
              scale,
              opacity,
              zIndex: 100 - Math.abs(distance),
              viewTransitionName: active ? "work-" + item.caseSlug : undefined,
            }
          : {
              viewTransitionName: active ? "work-" + item.caseSlug : undefined,
            }
      }
    >
      <Link
        to="/portfolio/$slug"
        params={{ slug: item.caseSlug }}
        tabIndex={active ? 0 : -1}
        aria-label={active ? "Open " + item.title : undefined}
        className="block h-full w-full"
      >
        {content}
        {active ? (
          <div className="absolute inset-x-0 bottom-0 border-t-2 border-current bg-black/85 p-4 text-white">
            <div className="text-sm font-semibold">{item.title}</div>
            <div className="mt-1 text-sm text-[#b9b7b0]">
              {[item.client, item.year].filter(Boolean).join(" · ")}
            </div>
          </div>
        ) : null}
      </Link>

      {active ? (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            onCinema();
          }}
          className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center border-2 border-[#f2f2ef] bg-black text-white"
          aria-label={"Open " + item.title + " in cinema mode"}
        >
          <Maximize2 size={16} aria-hidden />
        </button>
      ) : null}
    </article>
  );

  return card;
}

function CinemaDialog({
  open,
  onOpenChange,
  item,
  index,
  total,
  onMove,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ReelItem;
  index: number;
  total: number;
  onMove: (delta: number) => void;
}) {
  const touch = React.useRef<{ x: number } | null>(null);
  const color = item.accentColor ?? item.dominantColor ?? DEFAULT_WORK;
  const dark = darkenWorkColor(color);
  const fg = pickFg(dark);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="fixed inset-0 left-0 top-0 h-screen w-screen max-w-none translate-x-0 translate-y-0 overflow-hidden border-0 bg-black p-0 text-[#f2f2ef] shadow-none sm:rounded-none"
        onPointerDown={(event) => {
          touch.current = { x: event.clientX };
        }}
        onPointerUp={(event) => {
          if (!touch.current) return;
          const delta = event.clientX - touch.current.x;
          touch.current = null;
          if (Math.abs(delta) >= 70) onMove(delta < 0 ? 1 : -1);
        }}
      >
        <DialogTitle className="sr-only">Cinema mode — {item.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Fullscreen selected portfolio item. Swipe horizontally to move through the reel.
        </DialogDescription>
        <div className="grid h-full grid-cols-1 md:grid-cols-[1fr_20rem]">
          <div className="flex min-h-0 items-center justify-center p-6 md:p-12">
            {item.mediaUrl ? (
              item.mediaType === "video" ? (
                <video src={item.mediaUrl} poster={item.posterUrl} controls playsInline autoPlay muted className="max-h-full max-w-full object-contain" />
              ) : (
                <img src={item.mediaUrl} alt={item.title} className="max-h-full max-w-full object-contain" />
              )
            ) : (
              <div
                className="flex aspect-[4/5] max-h-[78vh] w-[min(72vw,640px)] items-end border-2 border-[#f2f2ef] p-8"
                style={{ background: dark, color: fg }}
              >
                <div>
                  <div className="text-sm font-semibold">
                    {item.discipline}
                    {item.year ? " · " + item.year : ""}
                  </div>
                  <div className="mt-3 font-cartaz text-[clamp(3rem,8vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">
                    {item.title}
                  </div>
                  {item.client ? <div className="mt-4 text-base font-semibold">{item.client}</div> : null}
                </div>
              </div>
            )}
          </div>
          <aside className="flex flex-col justify-between border-t-2 border-[#f2f2ef] p-6 md:border-l-2 md:border-t-0 md:p-8">
            <div>
              <div className="text-sm font-semibold">{index + 1} / {total}</div>
              <h3 className="mt-4 font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">{item.title}</h3>
              <p className="mt-3 text-sm text-[#b9b7b0]">{[item.client, item.year].filter(Boolean).join(" · ")}</p>
            </div>
            <Link
              to="/portfolio/$slug"
              params={{ slug: item.caseSlug }}
              className="inline-flex min-h-11 items-center justify-center border-2 border-[#f2f2ef] px-4 py-3 text-sm font-semibold hover:bg-[#f2f2ef] hover:text-black"
            >
              Open project
            </Link>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
