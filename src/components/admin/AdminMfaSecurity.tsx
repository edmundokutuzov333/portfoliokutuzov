import { useEffect, useState, type ReactNode } from "react";
import { Check, Copy, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type TotpFactor = { id: string; status: string; friendly_name?: string | null; factor_type?: string };

function useAdminMfa() {
  const [loading, setLoading] = useState(true);
  const [factors, setFactors] = useState<TotpFactor[]>([]);
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [nextLevel, setNextLevel] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const [{ data: aal, error: aalError }, { data: factorData, error: factorError }] = await Promise.all([
        supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
        supabase.auth.mfa.listFactors(),
      ]);
      if (aalError) throw aalError;
      if (factorError) throw factorError;
      setCurrentLevel(aal?.currentLevel ?? null);
      setNextLevel(aal?.nextLevel ?? null);
      setFactors(((factorData?.totp ?? []) as TotpFactor[]).filter((factor) => factor.factor_type !== "totp" || factor.status === "verified"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not read MFA status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);
  return { loading, factors, currentLevel, nextLevel, refresh };
}

async function challengeFactor(factorId: string, code: string) {
  const challenge = await supabase.auth.mfa.challenge({ factorId });
  if (challenge.error || !challenge.data?.id) throw challenge.error ?? new Error("Could not start MFA challenge.");
  const verified = await supabase.auth.mfa.verify({ factorId, challengeId: challenge.data.id, code });
  if (verified.error) throw verified.error;
}

export function AdminMfaGate({ children }: { children: ReactNode }) {
  const required = import.meta.env.VITE_ADMIN_MFA_REQUIRED === "true";
  const mfa = useAdminMfa();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrollment, setEnrollment] = useState<{ id: string; qr: string; secret: string } | null>(null);

  if (!required) return <>{children}</>;
  if (mfa.loading) return <MfaLoading />;
  const verified = mfa.factors.find((factor) => factor.status === "verified");
  const needsChallenge = Boolean(verified && mfa.currentLevel !== "aal2" && mfa.nextLevel === "aal2");

  const enroll = async () => {
    setBusy(true);
    try {
      const result = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Kutuzov Control Room" });
      if (result.error || !result.data?.id || !result.data.totp) throw result.error ?? new Error("Could not create TOTP factor.");
      setEnrollment({ id: result.data.id, qr: result.data.totp.qr_code, secret: result.data.totp.secret });
      toast.success("Scan the QR code, then enter the six-digit code.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "MFA setup failed.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (factorId: string) => {
    if (!/^\d{6}$/.test(code)) { toast.error("Enter the six-digit authenticator code."); return; }
    setBusy(true);
    try {
      await challengeFactor(factorId, code);
      setCode("");
      setEnrollment(null);
      await mfa.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "MFA verification failed.");
    } finally {
      setBusy(false);
    }
  };

  if (verified && needsChallenge) return <MfaChallenge factor={verified} code={code} setCode={setCode} busy={busy} onVerify={() => void verify(verified.id)} />;
  if (!verified) return <MfaEnrollment enrollment={enrollment} code={code} setCode={setCode} busy={busy} onEnroll={enroll} onVerify={() => enrollment && void verify(enrollment.id)} />;
  return <>{children}</>;
}

export function AdminMfaSecurity() {
  const mfa = useAdminMfa();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [enrollment, setEnrollment] = useState<{ id: string; qr: string; secret: string } | null>(null);

  const enroll = async () => {
    setBusy(true);
    try {
      const result = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Kutuzov Control Room" });
      if (result.error || !result.data?.id || !result.data.totp) throw result.error ?? new Error("Could not create TOTP factor.");
      setEnrollment({ id: result.data.id, qr: result.data.totp.qr_code, secret: result.data.totp.secret });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "MFA setup failed.");
    } finally {
      setBusy(false);
    }
  };
  const verify = async () => {
    if (!enrollment || !/^\d{6}$/.test(code)) { toast.error("Enter the six-digit authenticator code."); return; }
    setBusy(true);
    try { await challengeFactor(enrollment.id, code); setCode(""); setEnrollment(null); await mfa.refresh(); toast.success("Authenticator enabled."); }
    catch (error) { toast.error(error instanceof Error ? error.message : "MFA verification failed."); }
    finally { setBusy(false); }
  };
  return (
    <section className="mt-6 border-2 border-white/[0.10] bg-[#030814] p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center border-2 border-sky-300/20 text-sky-200"><ShieldCheck size={18} /></div>
        <div><h2 className="text-lg font-semibold text-white">Two-factor authentication</h2><p className="mt-1 text-sm text-slate-500">TOTP via your authenticator app. Compatible with password managers and one-time-code autofill.</p></div>
      </div>
      <div className="mt-5 text-sm text-slate-300">{mfa.loading ? "Checking security status…" : mfa.factors.length ? "A verified authenticator is active." : "No verified authenticator is active for this account."}</div>
      {mfa.factors.map((factor) => <div key={factor.id} className="mt-3 flex items-center gap-2 border border-white/10 px-3 py-2 text-sm"><Check size={14} className="text-emerald-300" />{factor.friendly_name || "Authenticator app"}<span className="ml-auto text-xs text-slate-600">TOTP</span></div>)}
      {!enrollment && !mfa.factors.length ? <button type="button" onClick={() => void enroll()} disabled={busy} className="mt-5 inline-flex min-h-11 items-center gap-2 border-2 border-sky-300/30 px-4 text-sm text-sky-100 hover:border-sky-300"><KeyRound size={15} />Set up authenticator</button> : null}
      {enrollment ? <MfaEnrollmentBody enrollment={enrollment} code={code} setCode={setCode} busy={busy} onVerify={() => void verify()} /> : null}
    </section>
  );
}

function MfaChallenge({ factor, code, setCode, busy, onVerify }: { factor: TotpFactor; code: string; setCode: (value: string) => void; busy: boolean; onVerify: () => void }) {
  return <div className="grid min-h-screen place-items-center bg-[#01040A] px-4"><div className="w-full max-w-md border-2 border-white/10 bg-[#030814] p-7">
    <div className="text-sm font-semibold text-sky-200">Control Room security</div><h1 className="mt-2 text-2xl font-semibold text-white">Enter your authenticator code.</h1>
    <p className="mt-3 text-sm leading-6 text-slate-500">A second factor is required before the workspace can open. Use the six-digit code from {factor.friendly_name || "your authenticator app"}.</p>
    <label className="mt-6 block text-sm text-slate-300">One-time code<input autoFocus autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0,6))} className="mt-2 w-full border-2 border-white/10 bg-transparent px-4 py-3 text-lg tracking-[0.35em] text-white outline-none focus:border-sky-300" /></label>
    <button type="button" onClick={onVerify} disabled={busy || code.length !== 6} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-sky-300 px-4 text-sm font-semibold text-[#01040A] disabled:opacity-40">{busy ? <Loader2 className="animate-spin" size={15}/> : <ShieldCheck size={15}/>}Verify and continue</button>
  </div></div>;
}

function MfaEnrollment({ enrollment, code, setCode, busy, onEnroll, onVerify }: { enrollment: { id: string; qr: string; secret: string } | null; code: string; setCode: (value: string) => void; busy: boolean; onEnroll: () => Promise<void>; onVerify: () => void }) {
  return <div className="grid min-h-screen place-items-center bg-[#01040A] px-4"><div className="w-full max-w-lg border-2 border-white/10 bg-[#030814] p-7">
    <div className="text-sm font-semibold text-sky-200">First-time security setup</div><h1 className="mt-2 text-2xl font-semibold text-white">Add an authenticator.</h1>
    <p className="mt-3 text-sm leading-6 text-slate-500">Scan the QR code with your authenticator or password manager. Then enter the six-digit code. No knowledge test or secondary puzzle is used.</p>
    {!enrollment ? <button type="button" onClick={() => void onEnroll()} disabled={busy} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 bg-sky-300 px-4 text-sm font-semibold text-[#01040A]"><KeyRound size={15}/>Generate authenticator QR</button> : <MfaEnrollmentBody enrollment={enrollment} code={code} setCode={setCode} busy={busy} onVerify={onVerify} />}
  </div></div>;
}

function MfaEnrollmentBody({ enrollment, code, setCode, busy, onVerify }: { enrollment: { id: string; qr: string; secret: string }; code: string; setCode: (value: string) => void; busy: boolean; onVerify: () => void }) {
  const image = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(enrollment.qr);
  const copySecret = () => navigator.clipboard.writeText(enrollment.secret).then(() => toast.success("Secret copied."), () => toast.error("Clipboard unavailable."));
  return <div className="mt-6 grid gap-5 md:grid-cols-[180px_1fr]">
    <img src={image} alt="Authenticator QR code" className="h-[180px] w-[180px] border-2 border-white/10 bg-white p-2" />
    <div>
      <p className="text-sm text-slate-300">If your app cannot scan the QR code, copy the secret.</p>
      <button type="button" onClick={copySecret} className="mt-3 inline-flex min-h-10 items-center gap-2 border-2 border-white/15 px-3 text-sm text-slate-300"><Copy size={14}/>Copy secret</button>
      <label className="mt-5 block text-sm text-slate-300">Verification code<input autoFocus autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0,6))} className="mt-2 w-full border-2 border-white/10 bg-transparent px-4 py-3 text-lg tracking-[0.35em] text-white outline-none focus:border-sky-300" /></label>
      <button type="button" onClick={onVerify} disabled={busy || code.length !== 6} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-sky-300 px-4 text-sm font-semibold text-[#01040A] disabled:opacity-40">{busy ? <Loader2 className="animate-spin" size={15}/> : <Check size={15}/>}Verify authenticator</button>
    </div>
  </div>;
}

function MfaLoading() { return <div className="grid min-h-screen place-items-center bg-[#01040A] text-sm text-slate-500"><div className="flex items-center gap-2"><Loader2 size={15} className="animate-spin"/>Checking admin security…</div></div>; }
