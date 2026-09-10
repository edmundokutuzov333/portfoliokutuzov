import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ImagePlus, Sparkles } from "lucide-react";
import { useSiteLocale } from "@/lib/site-locale";
import { STUDIO_STYLES } from "@/lib/studio/types";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio - Business Card Studio" },
      { name: "description", content: "Create a professional business card with Kutuzov Studio." },
    ],
  }),
  component: StudioLanding,
});

function StudioLanding() {
  const locale = useSiteLocale();
  const pt = locale === "pt-PT";
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-32 pb-20">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <p className="mono mb-5 text-[10px] uppercase tracking-[0.35em] text-[var(--color-accent-base)]">Kutuzov Studio</p>
          <h1 className="display text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--color-text-primary)] sm:text-7xl">Business Card Studio</h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">{pt ? "Precisa de um cartão de visita? Crie-o aqui. Grátis. Comece com os seus dados e trate o resultado como um verdadeiro ficheiro de design." : "Need a business card? Make one here. Free. Start with your details and treat the result as a real design document."}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/studio/business-card" className="inline-flex items-center gap-2 rounded-full bg-[var(--color-text-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-bg)] transition hover:translate-y-[-1px]">{pt ? "Criar o meu cartão" : "Create my card"}<ArrowRight size={16} /></Link>
            <Link to="/studio/background" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[.04]"><ImagePlus size={16} />{pt ? "Criar fundo com Magnific" : "Create background with Magnific"}</Link>
          </div>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.015] p-4 shadow-2xl">
            <div className="aspect-[1.8] rounded-[22px] bg-[#0b1118] p-7 sm:p-10">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-start justify-between"><span className="mono text-[9px] tracking-[0.2em] text-white/35">KUTUZOV STUDIO</span><span className="h-3 w-3 rounded-full bg-white/70" /></div>
                <div><div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">Your Name</div><div className="mt-2 text-xs text-white/45 sm:text-sm">Creative Director · Your Company</div></div>
                <div className="flex justify-between gap-6 text-[10px] text-white/45 sm:text-xs"><span>hello@company.com</span><span>+258 84 000 0000</span><span>company.com</span></div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 text-sm text-white"><Sparkles size={16} />{pt ? "Uma fundação editorial, não um gerador de imagens." : "An editorial foundation, not an image generator."}</div>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/45">{pt ? "O Studio começa por um documento vectorial editável. Isso garante uma base consistente para a IA, para exportações de alta qualidade e para futuras ferramentas do Kutuzov Studio." : "The Studio starts from an editable vector document. That creates a consistent foundation for AI, high-quality exports and future Kutuzov Studio tools."}</p>
            <div className="mt-8 flex flex-wrap gap-2">{STUDIO_STYLES.map((style) => <span key={style.id} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/55">{style.label}</span>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
