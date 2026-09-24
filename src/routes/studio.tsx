import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { confirmNewsletter } from "@/lib/newsletter.functions";
import { createSeo } from "@/lib/seo";
import { WaitlistForm } from "@/components/studio/WaitlistForm";

export const Route = createFileRoute("/studio")({
  head: () =>
    createSeo({
      title: "Kutuzov Studio | Edmundo Kutuzov",
      description:
        "Kutuzov Studio is being composed privately, line by line, before its public release.",
      path: "/studio",
    }),
  component: StudioLanding,
});

const MINT = "#25e3c2";

const NODES = [
  [74, 48], [156, 92], [258, 44], [372, 76], [468, 42],
  [116, 178], [214, 148], [324, 186], [430, 158], [506, 230],
  [62, 294], [172, 264], [282, 318], [392, 282], [470, 350],
  [126, 410], [244, 432], [362, 408],
] as const;

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 6], [2, 6], [3, 7], [6, 7],
  [6, 11], [7, 8], [8, 9], [7, 13], [10, 11], [11, 12], [12, 13],
  [13, 14], [11, 16], [12, 16], [12, 17], [15, 16], [16, 17],
] as const;

function pathFor(edge: readonly [number, number]) {
  const from = edge[0];
  const to = edge[1];
  const x1 = NODES[from][0];
  const y1 = NODES[from][1];
  const x2 = NODES[to][0];
  const y2 = NODES[to][1];
  const curve = Math.max(12, Math.abs(x2 - x1) * 0.18);
  return "M " + x1 + " " + y1 +
    " C " + (x1 + curve) + " " + (y1 - curve) +
    " " + (x2 - curve) + " " + (y2 + curve) +
    " " + x2 + " " + y2;
}

export function StudioLanding() {
  const reducedMotion = useReducedMotion() ?? false;
  const confirm = useServerFn(confirmNewsletter);
  const [confirmToken, setConfirmToken] = useState<string | null>(null);
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("newsletter_confirm")?.trim();
    if (!token) return;

    setConfirmToken(token);
    setConfirmState("loading");
    void confirm({ data: { token } })
      .then(() => {
        setConfirmState("success");
        window.history.replaceState({}, "", "/studio");
      })
      .catch(() => {
        setConfirmState("error");
      });
  }, [confirm]);

  if (confirmToken && confirmState !== "idle") {
    return <StudioConfirmation state={confirmState} />;
  }

  return (
    <main
      data-tone="preto"
      className="min-h-screen overflow-hidden bg-black px-5 pb-10 pt-28 text-cal sm:px-8 sm:pt-32"
      style={{ ["--work" as string]: MINT }}
    >
      <div className="mx-auto flex min-h-[calc(100vh-11rem)] max-w-[1240px] flex-col">
        <div className="border-b-2 border-white/20 pb-5">
          <span className="text-sm font-semibold">Kutuzov Studio</span>
        </div>

        <div className="grid flex-1 items-center gap-12 py-12 lg:grid-cols-[3fr_2fr] lg:gap-16 lg:py-16">
          <section className="max-w-[760px]">
            <h1
              className="font-cartaz text-[clamp(4rem,9vw,9.5rem)] font-extrabold leading-[0.84] tracking-[-0.07em]"
              style={{ fontVariationSettings: '"wdth" 72, "wght" 800' }}
            >
              A studio still finding its lines.
            </h1>

            <p className="mt-8 max-w-[560px] font-livro text-[clamp(1.2rem,2vw,1.7rem)] leading-[1.55] text-fumo">
              Kutuzov Studio is where the tools I build for myself live - composed privately,
              tested in full, and released only once every line holds up in public.
            </p>

            <Link
              to="/portfolio"
              className="mt-9 inline-flex min-h-12 items-center gap-2 border-2 border-cal bg-cal px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--work)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Explore the portfolio
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>

            <div className="mt-12 border-y-2 border-white/20 py-7">
              <WaitlistForm />
            </div>

            <dl className="mt-10 grid gap-5 border-b-2 border-white/20 pb-7 sm:grid-cols-3 sm:gap-6">
              <div>
                <dt className="text-sm font-semibold text-fumo">Status</dt>
                <dd className="mt-2 text-base">Composing</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-fumo">Access</dt>
                <dd className="mt-2 text-base">Private, by invitation</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-fumo">Release</dt>
                <dd className="mt-2 text-base">When every layer holds</dd>
              </div>
            </dl>
          </section>

          <InteractiveConstellation reducedMotion={reducedMotion} />
        </div>

        <div className="flex items-center justify-between border-t-2 border-white/20 pt-4 text-sm text-fumo">
          <span>Maputo / 2026</span>
          <span>Private build</span>
        </div>
      </div>
    </main>
  );
}

function InteractiveConstellation({ reducedMotion }: { reducedMotion: boolean }) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [hovered, setHovered] = useState<number | null>(null);

  const offsets = useMemo(
    () =>
      NODES.map(([x, y], index) => {
        if (reducedMotion) return { x, y, scale: index === 7 ? 1.45 : 1 };
        const nx = (pointer.x - 0.5) * (1 + (index % 4) * 0.18);
        const ny = (pointer.y - 0.5) * (1 + (index % 3) * 0.16);
        const emphasis = hovered === index ? 2.6 : 0;
        return {
          x: x + nx * 18,
          y: y + ny * 18,
          scale: index === 7 ? 1.45 + emphasis * 0.08 : 1 + emphasis * 0.08,
        };
      }),
    [hovered, pointer, reducedMotion],
  );

  return (
    <div
      className="relative mx-auto w-full max-w-[620px]"
      onPointerMove={(event) => {
        if (reducedMotion) return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPointer({
          x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
          y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
        });
      }}
      onPointerLeave={() => setPointer({ x: 0.5, y: 0.5 })}
      aria-label="Kutuzov Studio constellation"
      role="img"
    >
      <svg viewBox="0 0 560 480" className="h-auto w-full overflow-visible">
        <defs>
          <filter id="studio-phase12-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {EDGES.map((edge) => (
          <path
            key={edge[0] + "-" + edge[1]}
            d={pathFor(edge)}
            fill="none"
            stroke={MINT}
            strokeOpacity={reducedMotion ? 0.28 : 0.2}
            strokeWidth="1"
          />
        ))}

        {offsets.map((node, index) => (
          <g
            key={NODES[index][0] + "-" + NODES[index][1]}
            transform={"translate(" + node.x + " " + node.y + ") scale(" + node.scale + ")"}
            onPointerEnter={() => {
              if (!reducedMotion) setHovered(index);
            }}
            onPointerLeave={() => {
              if (!reducedMotion) setHovered(null);
            }}
          >
            <circle
              r={index === 7 ? 3.4 : 2.1}
              fill={index === 7 ? MINT : "#D8E2E0"}
              opacity={index === 7 ? 1 : 0.5}
              filter={index === 7 ? "url(#studio-phase12-glow)" : undefined}
            />
          </g>
        ))}

        <circle
          cx="324"
          cy="186"
          r="11"
          fill="none"
          stroke={MINT}
          strokeWidth="0.8"
          opacity={reducedMotion ? 0.28 : 0.2}
        />
      </svg>
    </div>
  );
}

function StudioConfirmation({
  state,
}: {
  state: "loading" | "success" | "error";
}) {
  return (
    <main data-tone="preto" className="grid min-h-screen place-items-center bg-black px-6 py-20 text-cal">
      <section className="w-full max-w-[760px] border-2 border-cal p-8 md:p-12">
        {state === "loading" ? (
          <>
            <p className="text-sm font-semibold text-fumo">Kutuzov Studio</p>
            <h1 className="mt-6 font-cartaz text-5xl font-extrabold leading-[0.9] md:text-7xl">
              Confirming your place.
            </h1>
            <p className="mt-5 max-w-xl font-livro text-xl leading-[1.55] text-fumo">
              One moment while the Studio verifies the confirmation link.
            </p>
          </>
        ) : state === "success" ? (
          <>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Check size={20} aria-hidden="true" /> Subscription confirmed.
            </div>
            <h1 className="mt-6 font-cartaz text-5xl font-extrabold leading-[0.9] md:text-7xl">
              You&apos;re in.
            </h1>
            <p className="mt-5 max-w-xl font-livro text-xl leading-[1.55] text-fumo">
              You will hear from Kutuzov Studio when it is ready to open.
            </p>
            <Link
              to="/portfolio"
              className="mt-8 inline-flex min-h-12 items-center gap-2 border-2 border-cal bg-cal px-5 py-3 text-sm font-semibold text-black transition hover:bg-[var(--work)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ ["--work" as string]: MINT }}
            >
              Explore the portfolio
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-sm font-semibold">
              <Mail size={20} aria-hidden="true" /> Confirmation failed.
            </div>
            <h1 className="mt-6 font-cartaz text-5xl font-extrabold leading-[0.9] md:text-7xl">
              This link no longer works.
            </h1>
            <p className="mt-5 max-w-xl font-livro text-xl leading-[1.55] text-fumo">
              Request another Studio confirmation from the waitlist form.
            </p>
            <Link
              to="/studio"
              className="mt-8 inline-flex min-h-12 items-center gap-2 border-2 border-cal px-5 py-3 text-sm font-semibold text-cal transition hover:bg-cal hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ ["--work" as string]: MINT }}
            >
              Back to Studio
            </Link>
          </>
        )}
      </section>
    </main>
  );
}
