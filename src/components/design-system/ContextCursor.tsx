import { useEffect, useRef, useState } from "react";

export function ContextCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;

    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (raf) return;

      raf = requestAnimationFrame(() => {
        raf = 0;
        const node = ref.current;
        if (!node) return;
        node.style.left = x + "px";
        node.style.top = y + "px";
        const target = document.elementFromPoint(x, y)?.closest("[data-cursor]");
        node.textContent = target?.getAttribute("data-cursor") ?? "";
        setVisible(Boolean(target));
      });
    };

    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="ds-cursor" data-visible={visible} aria-hidden="true" />;
}
