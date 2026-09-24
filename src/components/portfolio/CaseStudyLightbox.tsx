import { useEffect } from "react";
import type { CaseStudyMedia } from "@/lib/case-study";

export function CaseStudyLightbox({
  media,
  onClose,
}: {
  media: CaseStudyMedia;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/94 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={media.alt || "Project media"}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 min-h-11 min-w-11 border-2 border-[var(--case-cal)] px-3 text-sm text-[var(--case-cal)] hover:bg-[var(--case-cal)] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)]"
      >
        Close
      </button>

      <figure className="max-h-full max-w-[1400px] text-center">
        {media.media_type === "video" ? (
          <video
            src={media.url}
            poster={media.poster_url ?? undefined}
            controls
            playsInline
            className="max-h-[78vh] max-w-full"
          />
        ) : media.media_type === "embed" ? (
          <iframe
            src={media.url}
            title={media.alt || "Embedded project media"}
            className="h-[75vh] w-[min(92vw,1200px)] border-0"
            allowFullScreen
          />
        ) : (
          <img
            src={media.url}
            alt={media.alt || ""}
            className="max-h-[78vh] max-w-full object-contain"
          />
        )}

        {media.caption ? (
          <figcaption className="mt-3 text-sm text-[var(--case-cal)]">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    </div>
  );
}
