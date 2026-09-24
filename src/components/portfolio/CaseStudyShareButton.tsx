import { useState } from "react";
import { Share2 } from "lucide-react";

export function CaseStudyShareButton({ title, text }: { title: string; text: string }) {
  const [label, setLabel] = useState("Share");

  const share = async () => {
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text, url });
        setLabel("Shared");
        return;
      }

      await navigator.clipboard.writeText(url);
      setLabel("Link copied");
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(url);
        setLabel("Link copied");
      } catch {
        setLabel("Copy failed");
      }
    } finally {
      window.setTimeout(() => setLabel("Share"), 2200);
    }
  };

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex min-h-11 items-center gap-2 border-2 border-black px-4 py-2 text-sm text-black transition-colors hover:bg-black hover:text-[var(--case-cal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] focus-visible:ring-offset-2"
      aria-label="Share this case study"
    >
      <Share2 size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
