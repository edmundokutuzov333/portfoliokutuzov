import { Outlet, createRootRouteWithContext, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect, type ReactNode } from "react";
import { AppErrorBoundary, AppErrorFallback } from "@/components/AppErrorBoundary";
import { DeferredAiAssistant } from "@/components/DeferredAiAssistant";
import { CommandPalette } from "@/components/CommandPalette";
import { ProjectEntitySchema } from "@/components/ProjectEntitySchema";
import { ContextualRelatedWork } from "@/components/ContextualRelatedWork";
import { ContactDraftRecovery } from "@/components/ContactDraftRecovery";
import { RouteTimingInstaller } from "@/components/RouteTimingInstaller";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { resetKnownCorruptedState } from "@/lib/browser-safe";
import { installRuntimeDiagnostics, markRenderHealthy, recordRuntimeError } from "@/lib/runtime-diagnostics";
import { createSeo, SITE_ORIGIN, socialImageUrl } from "@/lib/seo";
import { trackPageView } from "@/lib/analytics";
import { installSiteLocaleDomBridge } from "@/lib/site-locale";
import appCss from "../styles.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

function NotFoundComponent() {
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4 bg-[var(--color-bg)]">
      <div className="text-center max-w-lg mx-auto">
        <p className="mono text-[10px] tracking-[0.3em] uppercase text-[var(--color-text-muted)] mb-8">Error 404</p>
        <h1 className="display text-6xl sm:text-8xl leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]">Lost in <br className="hidden sm:block" /><span className="italic text-[var(--color-text-muted)]">the grid.</span></h1>
        <p className="mt-8 text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-sm mx-auto">The page you are looking for has left the system. It might have been moved, renamed, or never existed in the first place.</p>
        <a href="/" className="mt-12 inline-flex items-center rounded-full bg-[var(--color-text-primary)] text-[var(--color-bg)] px-8 py-3.5 text-[14px] font-semibold">Return to surface</a>
      </div>
    </div>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = Route.useRouter();
  const { queryClient } = Route.useRouteContext();
  useEffect(() => {
    recordRuntimeError("react", error);
  }, [error]);
  return <AppErrorFallback error={error} onReset={() => { resetKnownCorruptedState(); queryClient.clear(); router.invalidate(); reset(); }} />;
}

const earlyLocaleScript = `(function(){try{document.documentElement.lang="en";localStorage.removeItem("ek_locale_v2");}catch(_){try{document.documentElement.lang="en";}catch(__){}}})();`;
const earlyRecoveryScript = `(function(){if(typeof window==="undefined"||window.__EK_EARLY_RECOVERY__)return;window.__EK_EARLY_RECOVERY__=true;window.__EK_EARLY_ERRORS__=[];function store(type,value){try{window.__EK_EARLY_ERRORS__.push({type,at:new Date().toISOString(),message:value&&(value.message||String(value))});}catch(_){}}function resetState(){try{sessionStorage.removeItem("ek_runtime_diagnostics")}catch(_){}}window.addEventListener("error",function(e){store("error",e.error||e.message)});window.addEventListener("unhandledrejection",function(e){store("unhandledrejection",e.reason)});window.setTimeout(function(){if(window.__EK_RENDER_HEALTHY__)return;var body=document.body;if(!body)return;var text=(body.innerText||"").trim();var appNode=body.querySelector("main,nav,section,article,header,footer,button,a,img,canvas,video");if(!text&&!appNode&&!document.getElementById("ek-runtime-recovery")){var node=document.createElement("div");node.id="ek-runtime-recovery";node.style.cssText="position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;background:#01040a;color:#f5f8ff;font:14px Inter,system-ui,sans-serif;padding:24px;text-align:center;";node.innerHTML='<div style="max-width:520px"><div style="font:10px monospace;letter-spacing:.18em;color:#1d9bff;margin-bottom:12px">/// RECOVERY</div><h1 style="font-size:28px;margin:0 0 10px">Preview render failed.</h1><p style="color:#aab6c8;line-height:1.5;margin:0 0 18px">A fallback screen was shown instead of a blank page.</p><button type="button" data-action="reload" style="border:0;border-radius:999px;background:#1d9bff;color:#01040a;padding:12px 18px;font-weight:700;cursor:pointer">Reload preview</button> <button type="button" data-action="reset" style="border:1px solid rgba(255,255,255,.16);border-radius:999px;background:transparent;color:#f5f8ff;padding:12px 18px;cursor:pointer">Reset state</button></div>';node.querySelector('[data-action="reload"]').addEventListener("click",function(){location.reload()});node.querySelector('[data-action="reset"]').addEventListener("click",function(){resetState();location.reload()});body.appendChild(node);}},3500)})();`;
const structuredData = JSON.stringify({"@context":"https://schema.org","@graph":[{"@type":"Person","@id":`${SITE_ORIGIN}/#person`,name:"Edmundo Kutuzov",jobTitle:"Art Director",url:SITE_ORIGIN,image:socialImageUrl(),address:{"@type":"PostalAddress",addressLocality:"Maputo",addressCountry:"MZ"}},{"@type":"WebSite","@id":`${SITE_ORIGIN}/#website`,url:SITE_ORIGIN,name:"Edmundo Kutuzov",description:"Portfolio of art direction, visual identities, campaigns and digital experiences.",inLanguage:"en",publisher:{"@id":`${SITE_ORIGIN}/#person`}}]}).replace(/</g,"\\u003c");

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => {
    const seo = createSeo({ title: "Edmundo Kutuzov - Designer & Art Director", description: "Visual identities, art direction and digital experiences built with strategic clarity and technical precision.", path: "/" });
    return { meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" }, { name: "theme-color", content: "#02050c" }, { name: "color-scheme", content: "dark" }, ...seo.meta], links: [...seo.links, { rel: "stylesheet", href: appCss }, { rel: "preconnect", href: "https://fonts.googleapis.com" }, { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" }, { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" }, { rel: "icon", type: "image/webp", href: "/favicon.webp" }, { rel: "apple-touch-icon", href: "/favicon.webp" }] };
  },
  shellComponent: RootShell,
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return <html lang="en" suppressHydrationWarning><head suppressHydrationWarning><HeadContent /><script dangerouslySetInnerHTML={{ __html: earlyLocaleScript }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} /></head><body suppressHydrationWarning><script dangerouslySetInnerHTML={{ __html: earlyRecoveryScript }} />{children}<Scripts /></body></html>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAdmin = pathname.startsWith("/edmundo-control-room");
  useEffect(() => {
    installRuntimeDiagnostics();
    const frame = window.requestAnimationFrame(() => window.requestAnimationFrame(markRenderHealthy));
    return () => window.cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (!isAdmin) trackPageView(pathname);
  }, [isAdmin, pathname]);
  useEffect(() => {
    const cleanupPrimary = installSiteLocaleDomBridge();
    return () => cleanupPrimary();
  }, []);
  return <AppErrorBoundary onReset={() => queryClient.clear()}><QueryClientProvider client={queryClient}><RouteTimingInstaller />{!isAdmin && <ProjectEntitySchema />}{!isAdmin && <ContactDraftRecovery />}{!isAdmin && <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-text-primary)] focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-[var(--color-bg)]">Skip to content</a>}{!isAdmin && <div className="fixed inset-0 z-0 bg-[var(--color-bg)]" aria-hidden="true" />}<div className="relative z-10">{!isAdmin && <Navbar />}<main id="main-content" data-ek-app-root="true"><AppErrorBoundary label="route content" minimal onReset={() => queryClient.clear()}><Outlet /></AppErrorBoundary></main>{!isAdmin && <ContextualRelatedWork />}{!isAdmin && <Footer />}</div>{!isAdmin && <ScrollToTop />}<AppErrorBoundary label="notifications" minimal><Toaster theme="dark" position="bottom-right" toastOptions={{ style: { background: "#06111f", border: "1px solid rgba(148,163,184,0.14)", color: "#f5f8ff" } }} /></AppErrorBoundary>{!isAdmin && <CommandPalette />}{!isAdmin && <DeferredAiAssistant />}</QueryClientProvider></AppErrorBoundary>;
}
