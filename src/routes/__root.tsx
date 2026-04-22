import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { InteractiveBackground } from "@/components/visual/InteractiveBackground";
import { NoiseLayer } from "@/components/visual/NoiseLayer";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function NotFoundComponent() {
  return (
    <div className="relative z-10 min-h-screen grid place-items-center px-4">
      <div className="text-center">
        <p className="mono text-[10px] text-[var(--color-acc-acid)]">/// 404</p>
        <h1 className="display text-7xl mt-4 text-metal">Lost in the grid.</h1>
        <p className="mt-3 text-sm text-[var(--color-text-muted)]">
          A página que procuras saiu do sistema.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-white text-black px-5 py-3 text-sm font-semibold"
        >
          Voltar ao início
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Edmundo — Designer & Art Director" },
      {
        name: "description",
        content:
          "Identidades visuais, direção de arte e experiências digitais para marcas que recusam aparência ordinária.",
      },
      { name: "author", content: "Edmundo" },
      { property: "og:title", content: "Edmundo — Designer & Art Director" },
      { name: "twitter:title", content: "Edmundo — Designer & Art Director" },
      { name: "description", content: "A premium portfolio website for Edmundo, a graphic designer and art director, built with React, Vite, and TypeScript." },
      { property: "og:description", content: "A premium portfolio website for Edmundo, a graphic designer and art director, built with React, Vite, and TypeScript." },
      { name: "twitter:description", content: "A premium portfolio website for Edmundo, a graphic designer and art director, built with React, Vite, and TypeScript." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4698235c-2667-4e59-a392-41660e35da00/id-preview-aebadd55--42b99eb3-a083-4211-87df-e3780ebbfa7f.lovable.app-1776862041012.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4698235c-2667-4e59-a392-41660e35da00/id-preview-aebadd55--42b99eb3-a083-4211-87df-e3780ebbfa7f.lovable.app-1776862041012.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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
  return (
    <>
      <InteractiveBackground />
      <NoiseLayer />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
