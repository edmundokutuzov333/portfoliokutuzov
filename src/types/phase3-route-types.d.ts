import type { Route as PortfolioSearchRoute } from "@/routes/api.portfolio-search";

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/api/portfolio-search": {
      id: "/api/portfolio-search";
      path: "/api/portfolio-search";
      fullPath: "/api/portfolio-search";
      preLoaderRoute: typeof PortfolioSearchRoute;
      parentRoute: never;
    };
  }
}
