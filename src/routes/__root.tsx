import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { AppErrorBoundary, AppErrorFallback } from "@/components/AppErrorBoundary";
import { InteractiveBackground } from "@/components/visual/InteractiveBackground";
import { NoiseLayer } from "@/components/visual/NoiseLayer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { resetKnownCorruptedState } from "@/lib/browser-safe";
import { installRuntimeDiagnostics, markRenderHealthy, recordRuntimeError } from "@/lib/runtime-diagnostics";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <p className="mono text-[10px] text-[var(--color-acc-blue)]">/// 404</p>
        <h1 className="display text-7xl mt-4 text-metal">Lost in the grid.</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          A página que procuras saiu do sistema.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-[#1d9bff] text-black px-5 py-3 text-sm font-semibold"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    recordRuntimeError("react", error);
  }, [error]);
  return (
    <AppErrorFallback
      error={error}
      onReset={() => {
        resetKnownCorruptedState();
        queryClient.clear();
        router.invalidate();
        reset();
      }}
    />
  );
}

const earlyRecoveryScript = `
(function(){
  if (typeof window === 'undefined' || window.__EK_EARLY_RECOVERY__) return;
  window.__EK_EARLY_RECOVERY__ = true;
  window.__EK_EARLY_ERRORS__ = [];
  function store(type, value){
    try { window.__EK_EARLY_ERRORS__.push({ type: type, at: new Date().toISOString(), message: value && (value.message || String(value)) }); } catch (_) {}
  }
  function resetState(){ try { sessionStorage.removeItem('ek_runtime_diagnostics'); } catch (_) {} }
  window.addEventListener('error', function(event){ store('error', event.error || event.message); });
  window.addEventListener('unhandledrejection', function(event){ store('unhandledrejection', event.reason); });
  window.setTimeout(function(){
    if (window.__EK_RENDER_HEALTHY__) return;
    var body = document.body;
    if (!body) return;
    var text = (body.innerText || '').trim();
    var appNode = body.querySelector('main,nav,section,article,header,footer,button,a,img,canvas,video');
    if (!text && !appNode && !document.getElementById('ek-runtime-recovery')) {
      var node = document.createElement('div');
      node.id = 'ek-runtime-recovery';
      node.style.cssText = 'position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center;';
      node.innerHTML = '<div style="max-width:520px"><div style="font:10px monospace;letter-spacing:.18em;color:#1d9bff;margin-bottom:12px">/// RECOVERY</div><h1 style="font-size:28px;margin:0 0 10px">Preview render failed.</h1><p style="color:#aab6c8;line-height:1.5;margin:0 0 18px">A fallback screen was shown instead of a blank page.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button type="button" data-action="reload" style="border:0;border-radius:999px;background:#1d9bff;color:#01040a;padding:12px 18px;font-weight:700;cursor:pointer">Reload preview</button><button type="button" data-action="reset" style="border:1px solid rgba(255,255,255,.16);border-radius:999px;background:transparent;color:#f5f8ff;padding:12px 18px;font-weight:700;cursor:pointer">Reset state</button></div></div>';
      node.querySelector('[data-action="reload"]').addEventListener('click', function(){ window.location.reload(); });
      node.querySelector('[data-action="reset"]').addEventListener('click', function(){ resetState(); window.location.reload(); });
      body.appendChild(node);
    }
  }, 3500);
})();`;

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Edmundo - Designer & Art Director" },
      {
        name: "description",
        content:
          "Identidades visuais, direção de arte e experiências digitais construídas com clareza estratégica e precisão técnica.",
      },
      { name: "author", content: "Edmundo" },
      { property: "og:title", content: "Edmundo - Designer & Art Director" },
      { name: "twitter:title", content: "Edmundo - Designer & Art Director" },
      {
        property: "og:description",
        content:
          "Dark blue editorial portfolio · brand identity · art direction · digital systems.",
      },
      {
        name: "twitter:description",
        content:
          "Dark blue editorial portfolio · brand identity · art direction · digital systems.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
      { name: "description", content: "KUTUZOV SITE" },
      { property: "og:description", content: "KUTUZOV SITE" },
      { name: "twitter:description", content: "KUTUZOV SITE" },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/webp", href: "/favicon.webp" },
      { rel: "shortcut icon", type: "image/webp", href: "/favicon.webp" },
      { rel: "apple-touch-icon", href: "/favicon.webp" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: earlyRecoveryScript }} />
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/edmundo-control-room");

  useEffect(() => {
    installRuntimeDiagnostics();
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(markRenderHealthy);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <AppErrorBoundary onReset={() => queryClient.clear()}>
      <QueryClientProvider client={queryClient}>
        {!isAdmin && (
          <AppErrorBoundary label="interactive background" minimal>
            <InteractiveBackground />
            <NoiseLayer />
          </AppErrorBoundary>
        )}
        <div className="relative z-10">
          {!isAdmin && (
            <AppErrorBoundary label="navigation" minimal>
              <Navbar />
            </AppErrorBoundary>
          )}
          <main data-ek-app-root="true">
            <AppErrorBoundary label="route content" minimal onReset={() => queryClient.clear()}>
              <Outlet />
            </AppErrorBoundary>
          </main>
          {!isAdmin && (
            <AppErrorBoundary label="footer" minimal>
              <Footer />
            </AppErrorBoundary>
          )}
        </div>
        {!isAdmin && (
          <AppErrorBoundary label="scroll control" minimal>
            <ScrollToTop />
          </AppErrorBoundary>
        )}
        <AppErrorBoundary label="notifications" minimal>
          <Toaster
            theme="dark"
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#06111f",
                border: "1px solid rgba(148,163,184,0.14)",
                color: "#f5f8ff",
              },
            }}
          />
        </AppErrorBoundary>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}
