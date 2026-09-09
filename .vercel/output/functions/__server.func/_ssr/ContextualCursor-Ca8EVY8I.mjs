import { r as reactExports, d as jsxDevRuntimeExports } from "../_libs/react.mjs";
import { u as useReducedMotion, c as useMotionValue, f as useSpring, m as motion } from "../_libs/framer-motion.mjs";
import { E as Eye, u as MoveHorizontal, t as Play, v as ArrowLeft, w as ArrowRight, A as ArrowUpRight } from "../_libs/lucide-react.mjs";
function ContextualCursor() {
  const [cursorState, setCursorState] = reactExports.useState(null);
  const [isVisible, setIsVisible] = reactExports.useState(false);
  const [isTouch, setIsTouch] = reactExports.useState(false);
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  reactExports.useEffect(() => {
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const noHover = !window.matchMedia("(hover: hover)").matches;
      setIsTouch(isCoarse || noHover);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch, { passive: true });
    if (isTouch || shouldReduceMotion) return;
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target;
      if (!target) return;
      const cursorTarget = target.closest("[data-cursor]");
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor");
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
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "VIEW" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 75,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowUpRight, { size: 13, strokeWidth: 2.2 }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 76,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 74,
          columnNumber: 11
        }, this);
      case "NEXT":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "NEXT" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 82,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowRight, { size: 13, strokeWidth: 2.2 }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 83,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 81,
          columnNumber: 11
        }, this);
      case "PREV":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(ArrowLeft, { size: 13, strokeWidth: 2.2 }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 89,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "PREV" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 90,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 88,
          columnNumber: 11
        }, this);
      case "PLAY":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "PLAY" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 96,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Play, { size: 11, strokeWidth: 2.2, className: "fill-current translate-x-[1px]" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 97,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 95,
          columnNumber: 11
        }, this);
      case "DRAG":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(MoveHorizontal, { size: 13, strokeWidth: 2.2 }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 103,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "DRAG" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 104,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 102,
          columnNumber: 11
        }, this);
      case "OPEN":
        return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(jsxDevRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Eye, { size: 13, strokeWidth: 2.2 }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 110,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("span", { className: "mono text-[10px] font-bold tracking-[0.2em] uppercase", children: "OPEN" }, void 0, false, {
            fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
            lineNumber: 111,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
          lineNumber: 109,
          columnNumber: 11
        }, this);
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(
    motion.div,
    {
      "aria-hidden": "true",
      style: {
        left: smoothX,
        top: smoothY,
        translateX: "-50%",
        translateY: "-50%"
      },
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      transition: { duration: 0.18, ease: "easeOut" },
      className: "pointer-events-none fixed z-[9999] hidden md:flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-[var(--color-bg)]/90 px-3.5 py-1.5 text-white shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-md",
      children: renderContent()
    },
    void 0,
    false,
    {
      fileName: "/app/applet/src/components/portfolio/ContextualCursor.tsx",
      lineNumber: 120,
      columnNumber: 5
    },
    this
  );
}
export {
  ContextualCursor as C
};
