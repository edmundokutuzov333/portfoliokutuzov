import { useEffect, useRef } from "react";
import type { CaseStudyMedia } from "@/lib/case-study";

export function CaseStudyLightbox({
  media,
  onClose,
}: {
  media: CaseStudyMedia;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!dialog.open && typeof dialog.showModal === "function") {
      dialog.showModal();
    }

    closeRef.current?.focus();

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, [media, onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-label={media.alt || "Project media"}
      className="m-0 h-screen w-screen max-h-none max-w-none bg-black/95 p-4 text-[#F2F2EF] backdrop:bg-black/90 md:p-10"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="grid h-full w-full place-items-center">
        <button
          ref={closeRef}
          type="button"
          onClick={() => dialogRef.current?.close()}
          className="absolute right-4 top-4 grid min-h-11 min-w-11 place-items-center border-2 border-[#F2F2EF] px-3 text-sm text-[#F2F2EF] hover:bg-[#F2F2EF] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)]"
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
              width={media.width || undefined}
              height={media.height || undefined}
              className="max-h-[78vh] max-w-full object-contain"
            />
          )}

          {media.caption ? (
            <figcaption className="mt-3 text-sm text-[#F2F2EF]">{media.caption}</figcaption>
          ) : null}
        </figure>
      </div>
    </dialog>
  );
}
