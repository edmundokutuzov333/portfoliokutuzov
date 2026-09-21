import { createFileRoute } from "@tanstack/react-router";
import { StudioConstructionSignal } from "@/components/studio/StudioConstructionSignal";
import { STUDIO_PUBLIC_ENABLED } from "@/lib/studio/public-launch";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio - Under Construction" },
      {
        name: "description",
        content: "Kutuzov Studio is under construction. Explore Edmundo Kutuzov's portfolio while the Studio is being built.",
      },
      { name: "robots", content: STUDIO_PUBLIC_ENABLED ? "index,follow" : "noindex,nofollow" },
    ],
  }),
  component: StudioLanding,
});

function StudioLanding() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32">
      <div className="mx-auto w-full max-w-[1440px]">
        <StudioConstructionSignal />
      </div>
    </main>
  );
}
