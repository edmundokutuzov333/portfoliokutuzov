import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Control Room - Edmundo Kutuzov" },
      { name: "description", content: "Private portfolio content management workspace." },
      { property: "og:title", content: "Control Room - Edmundo Kutuzov" },
      { property: "og:description", content: "Private portfolio content management workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRouteEntry,
});

function AdminRouteEntry() {
  return <a href="/admin/studio" className="fixed right-5 top-5 z-[60] rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs font-semibold text-slate-300 backdrop-blur hover:bg-white/[0.06]">Studio Intelligence</a>;
}
