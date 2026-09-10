import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Command, Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

type SearchResult = {
  id: string;
  title: string;
  client: string;
  year?: string;
  category?: string;
  discipline?: string;
  description?: string;
  slug: string;
  thumbnail?: string;
  tags?: string[];
};

const quickFilters = ["Branding", "Digital", "Campaigns", "Art Direction", "Motion", "Technology", "Fashion"];

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

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
    if (!open) return;
    trackEvent({ action: "search_open", element: "command_palette" });
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    if (!open) return;
    controllerRef.current?.abort();
    const queryValue = query.trim();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/portfolio-search?q=${encodeURIComponent(queryValue)}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Search request failed");
        const payload = (await response.json()) as { results?: SearchResult[] };
        setResults(payload.results ?? []);
        setActiveIndex(0);
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") setResults([]);
      }
    }, queryValue ? 120 : 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [open, query]);

  const items = useMemo(() => {
    if (query.trim()) return results;
    return [];
  }, [query, results]);

  const closeAndOpen = (slug: string) => {
    trackEvent({ action: "search_select", element: "command_palette", meta: { slug, query } });
    setOpen(false);
    setQuery("");
    navigate({ to: "/portfolio/$slug", params: { slug } }).catch(() => {});
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((value) => Math.min(value + 1, Math.max(0, items.length - 1)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter" && items[activeIndex]) {
      event.preventDefault();
      closeAndOpen(items[activeIndex].slug);
    }
  };

  const applyFilter = (filter: string) => {
    setQuery(filter);
    trackEvent({ action: "search_filter", element: "command_palette", meta: { filter } });
  };

  return (
    <>
      <button
        type="button"
        className="fixed bottom-5 left-5 z-40 hidden md:flex items-center gap-2 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)]/90 px-3 py-2 text-[11px] text-[var(--color-text-secondary)] backdrop-blur-xl transition hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
        onClick={() => setOpen(true)}
        aria-label="Open portfolio search"
      >
        <Search size={13} aria-hidden="true" />
        <span>Search portfolio</span>
        <kbd className="mono text-[9px] opacity-60">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-sm" role="presentation" onMouseDown={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search portfolio"
            className="mx-auto mt-[12vh] w-[min(720px,calc(100vw-28px))] overflow-hidden rounded-2xl border border-white/10 bg-[#060b14] shadow-2xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
              <Search size={18} className="text-[var(--color-text-muted)]" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={120}
                placeholder="Search portfolio..."
                className="min-w-0 flex-1 bg-transparent text-base text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
                aria-label="Search portfolio projects"
                autoComplete="off"
              />
              <kbd className="mono hidden sm:inline-flex rounded border border-white/10 px-2 py-1 text-[9px] text-[var(--color-text-muted)]">
                ESC
              </kbd>
            </div>

            {!query.trim() && (
              <div className="px-5 py-5">
                <div className="mono mb-3 text-[9px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase">
                  Explore by discipline
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => applyFilter(filter)}
                      className="rounded-full border border-white/10 px-3 py-2 text-xs text-[var(--color-text-secondary)] transition hover:border-white/20 hover:text-[var(--color-text-primary)]"
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim() && (
              <div className="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="Portfolio search results">
                {items.length === 0 ? (
                  <div className="px-4 py-8 text-sm text-[var(--color-text-muted)]">No projects found in the published portfolio records.</div>
                ) : (
                  items.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => closeAndOpen(item.slug)}
                      className={`flex w-full items-center gap-4 rounded-xl p-3 text-left transition ${index === activeIndex ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"}`}
                    >
                      <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[var(--color-bg)]">
                        {item.thumbnail ? <img src={item.thumbnail} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-[var(--color-text-primary)]">{item.client || item.title}</div>
                        <div className="mt-1 text-xs text-[var(--color-text-secondary)]">{item.title}</div>
                        <div className="mono mt-1 text-[9px] tracking-[0.12em] uppercase text-[var(--color-text-muted)]">
                          {[item.year, item.category].filter(Boolean).join(" · ")}
                        </div>
                      </div>
                      {index === activeIndex ? <Command size={15} className="text-[var(--color-accent-hover)]" aria-hidden="true" /> : null}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
