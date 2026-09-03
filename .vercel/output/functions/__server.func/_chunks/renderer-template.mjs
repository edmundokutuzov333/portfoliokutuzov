import { b as HTTPResponse } from "../_libs/h3.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
const rendererTemplate = () =>
  new HTTPResponse(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <!-- Mobile viewport with safe-area support for notches -->
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>Imersão Criativa - Sua Jornada Criativa Começa Aqui</title>
    <meta
      name="description"
      content="Explore uma experiência imersiva única. Clique e inicie sua jornada criativa em um universo de possibilidades infinitas!"
    />
    <meta name="author" content="Edmundo Kutuzov" />

    <!-- Mobile-specific meta tags -->
    <meta name="theme-color" content="#000000" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <!-- DNS Prefetch & Preconnect for performance -->
    <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/logo-tm.webp" />
    <link rel="shortcut icon" type="image/webp" href="/logo-tm.webp" />
    <link rel="apple-touch-icon" href="/logo-tm.webp" />

    <!-- Google Fonts -->
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
      rel="stylesheet"
    />

    <!-- === MOBILE/TABLET CSS (loaded conditionally via media queries) === -->
    <!-- Tablet styles: 481px - 1024px -->
    <link
      rel="preload"
      href="/styles/tablet.css"
      as="style"
      media="(max-width:1024px)"
      onload="this.rel = 'stylesheet'"
    />
    <!-- Mobile styles: up to 480px -->
    <link
      rel="preload"
      href="/styles/mobile.css"
      as="style"
      media="(max-width:480px)"
      onload="this.rel = 'stylesheet'"
    />
    <!-- Fallback for browsers with JS disabled -->
    <noscript>
      <link rel="stylesheet" href="/styles/tablet.css" media="(max-width:1024px)" />
      <link rel="stylesheet" href="/styles/mobile.css" media="(max-width:480px)" />
    </noscript>

    <!-- Open Graph -->

    <meta property="og:type" content="website" />
    <meta property="og:image" content="/logo-tm.webp" />

    <!-- Critical CSS placeholder (desktop) -->
    <style id="critical-css">
      html,
      body,
      #root {
        height: 100%;
        margin: 0;
      }
      body {
        font-family:
          "Inter",
          system-ui,
          -apple-system,
          sans-serif;
      }
    </style>

    <meta name="twitter:image" content="/logo-tm.webp" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta property="og:title" content="Imersão Criativa - Sua Jornada Criativa Começa Aqui" />
    <meta name="twitter:title" content="Imersão Criativa - Sua Jornada Criativa Começa Aqui" />
    <meta
      property="og:description"
      content="Explore uma experiência imersiva única. Clique e inicie sua jornada criativa em um universo de possibilidades infinitas!"
    />
    <meta
      name="twitter:description"
      content="Explore uma experiência imersiva única. Clique e inicie sua jornada criativa em um universo de possibilidades infinitas!"
    />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"><\/script>
  </body>
</html>
`,
    { headers: { "content-type": "text/html; charset=utf-8" } },
  );
function renderIndexHTML(event) {
  return rendererTemplate(event.req);
}
export { renderIndexHTML as default };
