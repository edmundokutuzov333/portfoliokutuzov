import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowLeft, ArrowRight, Play, Eye, MoveHorizontal } from "lucide-react";

export type CursorState = "VIEW" | "OPEN" | "DRAG" | "NEXT" | "PREV" | "PLAY" | null;

export function ContextualCursor() {
  const [cursorState, setCursorState] = useState<CursorState>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect touch / coarse pointer devices
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = !window.matchMedia("(hover: hover)").matches;
      setIsTouch(isCoarse || noHover);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch, { passive: true });

    if (isTouch || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      // Check if hovered element or its parents have data-cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor") as CursorState;
        setCursorState(type);
        setIsVisible(true);
      } else {
        setCursorState(null);
        setIsVisible(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setCursorState(null);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", checkTouch);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouch, shouldReduceMotion, mouseX, mouseY]);

  if (isTouch || shouldReduceMotion || !isVisible || !cursorState) {
    return null;
  }

  const renderContent = () => {
    switch (cursorState) {
      case "VIEW":
        return (
          <>
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">VIEW</span>
            <ArrowUpRight size={13} strokeWidth={2.2} />
          </>
        );
      case "NEXT":
        return (
          <>
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">NEXT</span>
            <ArrowRight size={13} strokeWidth={2.2} />
          </>
        );
      case "PREV":
        return (
          <>
            <ArrowLeft size={13} strokeWidth={2.2} />
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">PREV</span>
          </>
        );
      case "PLAY":
        return (
          <>
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">PLAY</span>
            <Play size={11} strokeWidth={2.2} className="fill-current translate-x-[1px]" />
          </>
        );
      case "DRAG":
        return (
          <>
            <MoveHorizontal size={13} strokeWidth={2.2} />
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">DRAG</span>
          </>
        );
      case "OPEN":
        return (
          <>
            <Eye size={13} strokeWidth={2.2} />
            <span className="mono text-[10px] font-bold tracking-[0.2em] uppercase">OPEN</span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      aria-hidden="true"
      style={{
        left: smoothX,
        top: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="pointer-events-none fixed z-[9999] hidden md:flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-[var(--color-bg)]/90 px-3.5 py-1.5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md"
    >
      {renderContent()}
    </motion.div>
  );
}
