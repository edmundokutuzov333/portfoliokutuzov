import { Linkedin, ArrowUpRight } from "lucide-react";
import { LINKEDIN_URL } from "@/lib/cms";

export function LinkedInCard() {
  return (
    <a
      href={LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-white/[0.08] bg-[#030814] p-4 transition hover:border-sky-300/40 hover:bg-sky-300/[0.04]"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#7dd3fc]">
          <Linkedin size={17} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="display text-[15px] text-slate-100 truncate">Edmundo Kutuzov</div>
            <span className="mono text-[9px] tracking-[0.22em] text-sky-300/70 shrink-0">
              LINKEDIN
            </span>
          </div>
          <div className="mono mt-0.5 text-[10px] tracking-[0.18em] text-slate-500">
            Art Director · Maputo
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[12px] text-slate-400">
        <span>Open profile</span>
        <ArrowUpRight
          size={13}
          strokeWidth={1.8}
          className="text-slate-500 transition group-hover:text-sky-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
    </a>
  );
}
