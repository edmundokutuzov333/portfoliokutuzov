import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useSiteLocale } from "@/lib/site-locale";
import { loadDraftLocally, createStudioDesign } from "@/lib/studio/design-document";
import { getStudioSessionId } from "@/lib/studio/session";
import { DigitalIdentityPanel } from "@/components/studio/DigitalIdentityPanel";
import type { StudioTextRole } from "@/lib/studio/types";

export const Route = createFileRoute("/studio/identity")({
  head: () => ({ meta: [{ title: "Digital Identity - Kutuzov Studio" }, { name: "description", content: "Publish and share a Kutuzov Studio digital business card." }] }),
  component: DigitalIdentityWorkspace,
});

function DigitalIdentityWorkspace() {
  const pt = useSiteLocale() === "pt-PT";
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const draft = useMemo(() => loadDraftLocally(), []);
  const values = draft ? { name: draft.name, role: draft.role, company: draft.company, email: draft.email, phone: draft.phone, website: draft.website } : { name: "", role: "", company: "", email: "", phone: "", website: "" };
  const design = draft?.design ?? createStudioDesign("corporate", values);
  return <main className="min-h-screen bg-[var(--color-bg)] px-5 pb-20 pt-28"><div className="mx-auto max-w-[760px]"><p className="mono text-[10px] uppercase tracking-[.3em] text-[var(--color-accent-base)]">Kutuzov Studio / Digital Identity</p><h1 className="display mt-4 text-5xl font-semibold tracking-[-.04em] text-white sm:text-7xl">{pt ? "Transforme o cartão num contacto." : "Turn the card into a contact."}</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/45">{pt ? "Publique o cartão como uma identidade digital partilhável. O QR, o vCard e o envio por email apontam para o mesmo endereço público." : "Publish the card as a shareable digital identity. QR, vCard and email delivery all point to the same public address."}</p><div className="mt-10 rounded-[28px] border border-white/10 bg-white/[.025] p-5 sm:p-7"><DigitalIdentityPanel design={design} values={values} sessionId={sessionId} pt={pt} /></div><a href="/studio/business-card" className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-white">{pt ? "Voltar ao editor" : "Back to editor"}</a></div></main>;
}
