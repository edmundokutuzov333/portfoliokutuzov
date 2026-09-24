import { lazy, Suspense, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { UI_COPY, useSiteLocale } from "@/lib/site-locale";

const CommandPaletteDialog = lazy(() =>
  import("@/components/CommandPaletteDialog").then((module) => ({ default: module.CommandPaletteDialog })),
);

export function CommandPalette() {
  const locale = useSiteLocale();
  const copy = UI_COPY[locale];
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const shortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (shortcut) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("ek:open-chat", onOpen as EventListener);
    return () => window.removeEventListener("ek:open-chat", onOpen as EventListener);
  }, []);

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 left-5 z-40 hidden min-h-11 items-center gap-2 border-2 border-[var(--color-text-secondary)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text-secondary)] transition hover:border-[var(--work)] hover:text-[var(--color-text-primary)] md:flex"
          aria-label={copy.searchPortfolio}
        >
          <Search size={14} aria-hidden="true" />
          <span>{copy.searchPortfolio}</span>
          <kbd className="ml-2 border-l-2 border-current pl-2 text-[11px]">⌘K</kbd>
        </button>
      ) : null}
      {open ? (
        <Suspense fallback={null}>
          <CommandPaletteDialog onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}
