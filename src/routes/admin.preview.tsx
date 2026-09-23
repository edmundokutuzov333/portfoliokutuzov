import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminDraftPreviewPage } from "@/components/admin/Phase4ControlRoom";
import { isUuid } from "@/lib/utils";

const searchSchema = z.object({
  draft: z.string().optional(),
});

export const Route = createFileRoute("/admin/preview")({
  validateSearch: searchSchema,
  component: PreviewRoute,
  head: () => ({
    meta: [
      { title: "Draft Preview | Kutuzov Control Room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function PreviewRoute() {
  const { draft } = Route.useSearch();

  if (!draft || !isUuid(draft)) {
    return (
      <main className="min-h-screen bg-[#01040A] px-4 py-16 text-slate-200 sm:px-6">
        <div className="mx-auto max-w-xl rounded-2xl border border-white/[0.08] bg-[#030814] p-8 shadow-2xl">
          <div className="mono text-[10px] uppercase tracking-[0.24em] text-sky-300/70">
            CONTROL ROOM / PREVIEW
          </div>
          <h1 className="display mt-3 text-3xl text-metal">Invalid preview request.</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            This preview link is missing a valid draft identifier. Open Preview from a draft inside the Control Room.
          </p>
          <a
            href="/admin"
            className="mt-6 inline-flex min-h-10 items-center rounded-lg bg-sky-300 px-4 text-xs font-semibold text-[#01040A]"
          >
            Back to Control Room
          </a>
        </div>
      </main>
    );
  }

  return <AdminDraftPreviewPage draftId={draft} />;
}
