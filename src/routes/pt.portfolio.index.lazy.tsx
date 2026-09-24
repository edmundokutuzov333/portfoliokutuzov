import { createLazyFileRoute } from "@tanstack/react-router";
import { PortfolioRoutePage } from "@/components/portfolio/PortfolioRoutePage";

export const Route = createLazyFileRoute("/pt/portfolio")({
  component: PortfolioRoutePage,
});
