import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { Download, Mail, Phone, Share2, Globe2 } from "lucide-react";
import { useSiteLocale } from "@/lib/site-locale";
import { publicConfig } from "@/config/public";
import { buildVCard, normalizeWebsite, publicIdentityUrl } from "@/lib/studio/identity-format";
import { safeClipboardWrite } from "@/lib/browser-safe";

const client = createClient(publicConfig.supabase.url, publicConfig.supabase.publishableKey, { auth: { persistSession: false, autoRefreshToken: false } });

export const Route = createFileRoute("/card/$token")({
  head: () => ({ meta: [{ title: "Digital Card - Edmundo Kutuzov" }, { name: "robots", content: "index,follow" }] }),
  component: PublicDigitalCard,
});

function PublicDigitalCard() {
  const { token } = Route.useParams();
  const pt = useSiteLocale() === "pt-PT";
  const q = useQuery({
    queryKey: ["digital-card", token],
    queryFn: async () => {
      const result = await client.from("studio_cards").select("name,role,company,email,phone,website,design,public_enabled,status").eq("share_token", token).eq("status", "published").eq("public_enabled", true).maybeSingle();
      if (result.error) throw result.error;
      return result.data as any;
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
  if (q.isLoading) return <div className="min-h-screen bg-[#02050c] grid place-items-center text-white/50">Loading digital card…</div>;
  if (q.isError || !q.data) return <div className="min-h-screen bg-[#02050c] grid place-items-center px-6 text-center"><div><p className="mono text-[10px] uppercase tracking-[.25em] text-white/25">Kutuzov Studio</p><h1 className="display mt-3 text-4xl text-white">{pt ? "Cartão não encontrado" : "Card not found"}</h1><p className="mt-3 text-sm text-white/40">{pt ? "Este endereço pode ter sido desactivado." : "This public address may have been disabled."}</p></div></div>;
  const card = q.data;
  const design = card.design as any;
  const url = publicIdentityUrl(publicConfig.siteUrl, token);
  const website = normalizeWebsite(card.website || "");
  const vcard = buildVCard({ name: card.name, role: card.role, company: card.company, email: card.email, phone: card.phone, website, url });
  async function share() {
    const data = { title: card.name || card.company || "Digital card", text: [card.name, card.role, card.company].filter(Boolean).join(" · "), url };
    try {
      if (navigator.share && navigator.canShare?.(data)) await navigator.share(data); else await safeClipboardWrite(url);
    } catch { /* cancelled by user */ }
  }
  function downloadVCard() {
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const urlObject = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = urlObject; a.download = `${(card.name || card.company || "contact").replace(/[^a-z0-9-_]+/gi, "-").toLowerCase()}.vcf`; a.click(); setTimeout(() => URL.revokeObjectURL(urlObject), 1000);
  }
  return <main className="min-h-screen bg-[#02050c] px-5 py-12 sm:py-20"><div className="mx-auto max-w-[920px]">
    <div className="mb-8 flex items-center justify-between"><span className="mono text-[9px] uppercase tracking-[.28em] text-white/30">Kutuzov Studio / Digital Identity</span><button type="button" onClick={share} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white"><Share2 size={14}/>{pt ? "Partilhar" : "Share"}</button></div>
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[.03] p-3 shadow-2xl"><div className="relative overflow-hidden rounded-[26px]" style={{ background: design?.background?.value || "#0b1118" }}>
      {design?.background?.type === "gradient" && design?.background?.secondary && <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${design.background.value}, ${design.background.secondary})` }} />}
      <div className="relative grid min-h-[320px] gap-8 p-8 sm:min-h-[480px] sm:p-14"><div className="flex items-start justify-between"><span className="mono text-[9px] tracking-[.2em] text-white/45">DIGITAL BUSINESS CARD</span><span className="h-3 w-3 rounded-full bg-white/70" /></div><div className="self-center"><h1 className="display max-w-2xl text-4xl font-semibold tracking-[-.04em] text-white sm:text-6xl">{card.name || card.company}</h1><p className="mt-3 text-sm text-white/60 sm:text-base">{[card.role, card.company].filter(Boolean).join(" · ")}</p></div><div className="grid gap-2 text-xs text-white/55 sm:grid-cols-3"><span>{card.email}</span><span>{card.phone}</span><span>{card.website}</span></div></div>
    </div></section>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><a href={`mailto:${card.email}`} className="rounded-2xl border border-white/10 bg-white/[.025] p-4 text-white"><Mail size={16}/><span className="mt-3 block text-xs">Email</span></a><a href={`tel:${card.phone}`} className="rounded-2xl border border-white/10 bg-white/[.025] p-4 text-white"><Phone size={16}/><span className="mt-3 block text-xs">{pt ? "Telefonar" : "Call"}</span></a><a href={website || "#"} target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-white/10 bg-white/[.025] p-4 text-white"><Globe2 size={16}/><span className="mt-3 block text-xs">Website</span></a><button type="button" onClick={downloadVCard} className="rounded-2xl border border-white/10 bg-white/[.025] p-4 text-left text-white"><Download size={16}/><span className="mt-3 block text-xs">{pt ? "Guardar contacto" : "Save contact"}</span></button></div>
    <p className="mt-6 text-center text-[11px] text-white/25">{pt ? "Identidade digital publicada pelo Kutuzov Studio." : "Digital identity published by Kutuzov Studio."}</p>
  </div></main>;
}
