import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useSiteLocale } from "@/lib/site-locale";
import { loadDraftLocally, createStudioDesign } from "@/lib/studio/design-document";
import { getStudioSessionId } from "@/lib/studio/session";
import { loadStudioCard } from "@/lib/studio/persistence";
import { DigitalIdentityPanel } from "@/components/studio/DigitalIdentityPanel";
import type { StudioDesignDocument } from "@/lib/studio/types";

export const Route = createFileRoute("/studio/identity")({
  head: () => ({ meta: [{ title: "Digital Identity - Kutuzov Studio" }, { name: "description", content: "Publish and share a Kutuzov Studio digital business card." }] }),
  component: DigitalIdentityWorkspace,
});

const emptyValues = { name: "", role: "", company: "", email: "", phone: "", website: "" };

type IdentityState = { values: typeof emptyValues; design: StudioDesignDocument; };

function localIdentity(): IdentityState {
  const draft = loadDraftLocally();
  const values = draft ? { name: draft.name, role: draft.role, company: draft.company, email: draft.email, phone: draft.phone, website: draft.website } : emptyValues;
  return { values, design: draft?.design ?? createStudioDesign("corporate", values) };
}

function DigitalIdentityWorkspace() {
  const pt = useSiteLocale() === "pt-PT";
  const sessionId = useMemo(() => getStudioSessionId(), []);
  const initial = useMemo(localIdentity, []);
  const [state, setState] = useState<IdentityState>(initial);
  const [remoteSync, setRemoteSync] = useState<"idle" | "loading" | "ready" | "offline">("idle");

  useEffect(() => {
    let active = true;
    setRemoteSync("loading");
    void loadStudioCard()
      .then((remote) => {
        if (!active) return;
        if (remote) {
          setState({
            values: { name: remote.name, role: remote.role, company: remote.company, email: remote.email, phone: remote.phone, website: remote.website },
            design: remote.design,
          });
          setRemoteSync("ready");
        } else {
          setRemoteSync("offline");
        }
      })
      .catch(() => { if (active) setRemoteSync("offline"); });
    return () => { active = false; };
  }, []);

  return <main className="min-h-screen bg-[var(--color-bg)] px-5 pb-20 pt-28"><div className="mx-auto max-w-[760px]"><p className="mono text-[10px] uppercase tracking-[.3em] text-[var(--color-accent-base)]">Kutuzov Studio / Digital Identity</p><h1 className="display mt-4 text-5xl font-semibold tracking-[-.04em] text-white sm:text-7xl">{pt ? "Transforme o cartão num contacto." : "Turn the card into a contact."}</h1><p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/45">{pt ? "Publique o cartão como uma identidade digital partilhável. O QR, o vCard e o envio por email apontam para o mesmo endereço público." : "Publish the card as a shareable digital identity. QR, vCard and email delivery all point to the same public address."}</p><p className="mt-3 text-[10px] uppercase tracking-[.16em] text-white/25">{remoteSync === "loading" ? (pt ? "A sincronizar dados…" : "Syncing data…") : remoteSync === "ready" ? (pt ? "Dados sincronizados" : "Data synced") : (pt ? "A usar dados locais" : "Using local data")}</p><div className="mt-10 rounded-[28px] border border-white/10 bg-white/[.025] p-5 sm:p-7"><DigitalIdentityPanel design={state.design} values={state.values} sessionId={sessionId} pt={pt} /></div><a href="/studio/business-card" className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-2.5 text-xs font-semibold text-white">{pt ? "Voltar ao editor" : "Back to editor"}</a></div></main>;
}
