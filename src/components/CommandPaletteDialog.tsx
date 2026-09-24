import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Command as Cmdk } from "cmdk";
import { Search } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { localizePath, UI_COPY, useSiteLocale } from "@/lib/site-locale";

type SearchResult = {
  id: string;
  title: string;
  client: string;
  year?: string;
  category?: string;
  discipline?: string;
  slug: string;
  thumbnail?: string;
};

const QUICK_FILTERS = ["Social Media", "Ad Campaigns", "Digital Design", "Offline Actions", "Clothes Design", "Videos", "Web Design"];
const RECENT_KEY = "ek_search_recent_v1";

function readRecent(): SearchResult[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as SearchResult[]).slice(0, 5) : [];
  } catch {
    return [];
  }
}

function writeRecent(item: SearchResult) {
  try {
    const next = [item, ...readRecent().filter((entry) => entry.id !== item.id)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // local storage is an enhancement only.
  }
}

export function CommandPaletteDialog({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const locale = useSiteLocale();
  const copy = UI_COPY[locale];
  const open = true;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recent, setRecent] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setRecent(readRecent());
    trackEvent({ action: "search_open", element: "command_palette" });
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    controllerRef.current?.abort();
    const queryValue = query.trim();
    const controller = new AbortController();
    controllerRef.current = controller;
    const timer = window.setTimeout(async () => {
      if (!queryValue) {
        setResults([]);
        return;
      }
      try {
        const response = await fetch(`/api/portfolio-search?q=${encodeURIComponent(queryValue)}`, {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Search request failed");
        const payload = (await response.json()) as { results?: SearchResult[] };
        setResults(payload.results ?? []);
      } catch (error) {
        if ((error as Error)?.name !== "AbortError") setResults([]);
      }
    }, 140);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const close = () => {
    setQuery("");
    onClose();
  };

  const openProject = (item: SearchResult) => {
    writeRecent(item);
    setRecent(readRecent());
    trackEvent({ action: "search_select", element: "command_palette", meta: { slug: item.slug, query } });
    close();
    navigate({ to: localizePath(`/portfolio/${item.slug}`, locale) as never, viewTransition: true }).catch(() => {});
  };

  const goTo = (path: string) => {
    close();
    navigate({ to: localizePath(path, locale) as never, viewTransition: true }).catch(() => {});
  };

  const switchLanguage = (next: "en" | "pt-PT") => {
    close();
    const base = pathname.replace(/^\/pt(?=\/|$)/, "") || "/";
    const nextPath = next === "pt-PT" ? (base === "/" ? "/pt" : `/pt${base}`) : base;
    navigate({ to: nextPath as never, viewTransition: true }).catch(() => {});
  };

  const actionItems = useMemo(
    () => [
      { id: "start", label: copy.startProject, hint: "↵", run: () => goTo("/contact") },
      { id: "chat", label: copy.openChat, hint: "AI", run: () => { close(); window.dispatchEvent(new Event("ek:open-chat")); } },
      { id: "english", label: copy.switchEnglish, hint: "EN", run: () => switchLanguage("en") },
      { id: "portuguese", label: copy.switchPortuguese, hint: "PT", run: () => switchLanguage("pt-PT") },
    ],
    [copy, locale, pathname],
  );

  const navigationItems = useMemo(
    () => [
      [copy.home, "/"],
      [copy.portfolio, "/portfolio"],
      [copy.credentials, "/credentials"],
      [copy.services, "/services"],
      [copy.contact, "/contact"],
      [copy.studio, "/studio"],
    ] as const,
    [copy],
  );

  return (
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
    );
  }

  return (
    <div className="fixed inset-0 z-[1200] bg-black/75 p-4 md:p-8" role="presentation" onMouseDown={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={copy.search}
        className="mx-auto mt-[7vh] w-full max-w-[900px] border-2 border-[#f2f2ef] bg-[#000] text-[#f2f2ef]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Cmdk label={copy.search} loop shouldFilter={false}>
          <div className="flex items-center border-b-2 border-[#f2f2ef]">
            <Search size={20} className="mx-4" aria-hidden="true" />
            <Cmdk.Input
              ref={inputRef}
              value={query}
              onValueChange={setQuery}
              placeholder={copy.searchPortfolio}
              className="min-h-16 min-w-0 flex-1 bg-transparent px-0 text-lg outline-none placeholder:text-[#b9b7b0]"
              aria-label={copy.searchPortfolio}
            />
            <kbd className="mr-4 border-2 border-[#f2f2ef] px-2 py-1 text-xs">ESC</kbd>
          </div>

          <Cmdk.List className="max-h-[70vh] overflow-y-auto p-3">
            <Cmdk.Empty className="p-6 text-sm text-[#b9b7b0]">{copy.noResults}</Cmdk.Empty>

            {!query.trim() ? (
              <>
                <Cmdk.Group heading={copy.actions} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
                  {actionItems.map((item) => (
                    <Cmdk.Item
                      key={item.id}
                      value={item.label}
                      onSelect={item.run}
                      className="min-h-12 cursor-pointer border-b border-[#3f3e3b] px-3 py-3 aria-selected:bg-[#f2f2ef] aria-selected:text-black"
                    >
                      <span>{item.label}</span>
                      <span className="ml-auto text-xs opacity-60">{item.hint}</span>
                    </Cmdk.Item>
                  ))}
                </Cmdk.Group>

                <Cmdk.Group heading={copy.navigation} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
                  {navigationItems.map(([label, path]) => (
                    <Cmdk.Item
                      key={path}
                      value={label}
                      onSelect={() => goTo(path)}
                      className="min-h-12 cursor-pointer border-b border-[#3f3e3b] px-3 py-3 aria-selected:bg-[#f2f2ef] aria-selected:text-black"
                    >
                      {label}
                    </Cmdk.Item>
                  ))}
                </Cmdk.Group>

                {recent.length > 0 ? (
                  <Cmdk.Group heading={copy.recent} className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold">
                    {recent.map((item) => (
                      <Cmdk.Item
                        key={item.id}
                        value={item.title}
                        onSelect={() => openProject(item)}
                        className="min-h-12 cursor-pointer border-b border-[#3f3e3b] px-3 py-3 aria-selected:bg-[#f2f2ef] aria-selected:text-black"
                      >
                        <span>{item.title}</span>
                        <span className="ml-auto text-xs opacity-60">{item.year ?? ""}</span>
                      </Cmdk.Item>
                    ))}
                  </Cmdk.Group>
                ) : null}
              </>
            ) : results.length > 0 ? (
              <Cmdk.Group heading={copy.portfolio}>
                {results.map((item) => (
                  <Cmdk.Item
                    key={item.id}
                    value={item.title + " " + item.client}
                    onSelect={() => openProject(item)}
                    className="min-h-16 cursor-pointer border-b border-[#3f3e3b] px-3 py-3 aria-selected:bg-[#f2f2ef] aria-selected:text-black"
                  >
                    <span className="font-semibold">{item.title}</span>
                    <span className="ml-3 text-sm opacity-70">{item.client}</span>
                    <span className="ml-auto text-xs opacity-60">{[item.year, item.category].filter(Boolean).join(" · ")}</span>
                  </Cmdk.Item>
                ))}
              </Cmdk.Group>
            ) : (
              <Cmdk.Group heading="Quick filters">
                {QUICK_FILTERS.map((filter) => (
                  <Cmdk.Item
                    key={filter}
                    value={filter}
                    onSelect={() => setQuery(filter)}
                    className="min-h-12 cursor-pointer border-b border-[#3f3e3b] px-3 py-3 aria-selected:bg-[#f2f2ef] aria-selected:text-black"
                  >
                    {filter}
                  </Cmdk.Item>
                ))}
              </Cmdk.Group>
            )}
          </Cmdk.List>
        </Cmdk>
      </div>
    </div>
  );
}
