import { createLazyFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";

const ControlRoom = lazy(() =>
  import("@/components/admin/AdminControlRoom").then((module) => ({
    default: module.Route.options.component as ComponentType,
  })),
);

export const Route = createLazyFileRoute("/admin")({
  component: () => (
    <Suspense fallback={<div className="min-h-screen bg-[#01040A]" aria-busy="true" />}>
      <ControlRoom />
    </Suspense>
  ),
});
