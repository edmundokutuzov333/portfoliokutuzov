import { useEffect, useRef, useState } from "react";

type Ripple = { id: number; x: number; y: number };

export function InteractiveBackground() {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const aura = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    let raf = 0;
    const start = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    aura.current = start;
    target.current = start;

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    const click = (event: PointerEvent) => {
      const id = Date.now() + Math.random();
      setRipples((items) => [...items, { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setRipples((items) => items.filter((item) => item.id !== id));
      }, 900);
    };

    const tick = () => {
      aura.current.x += (target.current.x - aura.current.x) * 0.08;
      aura.current.y += (target.current.y - aura.current.y) * 0.08;
      if (layerRef.current) {
        layerRef.current.style.setProperty("--aura-x", `${aura.current.x}px`);
        layerRef.current.style.setProperty("--aura-y", `${aura.current.y}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", click);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={layerRef} className="interactive-bg" aria-hidden />
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="click-ripple"
          style={{ left: ripple.x, top: ripple.y }}
          aria-hidden
        />
      ))}
    </>
  );
}
