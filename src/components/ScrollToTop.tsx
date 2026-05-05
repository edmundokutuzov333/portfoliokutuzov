import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop({ threshold = 600 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-[60] grid h-11 w-11 place-items-center rounded-full border border-white/[0.12] bg-[#01040A]/80 text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur transition hover:border-sky-300/50 hover:text-sky-200"
    >
      <ArrowUp size={16} strokeWidth={1.8} />
    </button>
  );
}
