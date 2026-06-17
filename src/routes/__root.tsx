import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { InteractiveBackground } from "@/components/visual/InteractiveBackground";
import { NoiseLayer } from "@/components/visual/NoiseLayer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

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
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <head>
        <HeadContent />
      </head>
      <body>
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

  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <InteractiveBackground />}
      {!isAdmin && <NoiseLayer />}
      <div className="relative z-10">
        {!isAdmin && <Navbar />}
        <main>
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
      </div>
      {!isAdmin && <ScrollToTop />}
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
    </QueryClientProvider>
  );
}
