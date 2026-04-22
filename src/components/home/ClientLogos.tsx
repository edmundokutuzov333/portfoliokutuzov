import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { clients } from "@/data/clients";

type ClientInput =
  | string
  | {
      name: string;
      logo?: string;
      alt?: string;
      url?: string;
      featured?: boolean;
    };

type Client = {
  name: string;
  logo?: string;
  alt: string;
  url?: string;
  featured?: boolean;
};

const wordmarkStyles: Record<string, { font: string; letter: string; mark?: string }> = {
  NOVA: { font: "display font-semibold", letter: "tracking-[0.18em]" },
  KORA: { font: "display font-medium italic", letter: "tracking-[0.04em]" },
  ALMA: { font: "font-light", letter: "tracking-[0.42em]" },
  VOLT: { font: "display font-bold", letter: "tracking-[-0.04em]", mark: "/" },
  NEXUS: { font: "mono", letter: "tracking-[0.3em]" },
  AURORA: { font: "display font-medium", letter: "tracking-[0.08em]" },
  MINT: { font: "font-semibold", letter: "tracking-[0.02em]" },
  ORBIT: { font: "display font-light", letter: "tracking-[0.24em]" },
  LUME: { font: "display font-semibold italic", letter: "tracking-[0]" },
  ATLAS: { font: "mono font-semibold", letter: "tracking-[0.18em]" },
  NOIR: { font: "font-bold", letter: "tracking-[0.4em]" },
  BRAVA: { font: "display font-medium", letter: "tracking-[0.08em]" },
};

function normalizeClient(client: ClientInput): Client {
  if (typeof client === "string") {
    return {
      name: client,
      alt: `${client} logo`,
    };
  }

  return {
    name: client.name,
    logo: client.logo,
    alt: client.alt ?? `${client.name} logo`,
    url: client.url,
    featured: client.featured,
  };
}

function ClientMark({ client }: { client: Client }) {
  if (client.logo) {
    return (
      <img
        src={client.logo}
        alt={client.alt}
        loading="lazy"
        className="max-h-10 max-w-[150px] object-contain opacity-70 grayscale invert transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
      />
    );
  }

  const style = wordmarkStyles[client.name.toUpperCase()] ?? {
    font: "display font-medium",
    letter: "tracking-[0.16em]",
  };

  return (
    <span
      className={`${style.font} ${style.letter} text-base uppercase text-slate-400 transition duration-300 group-hover:text-slate-50 md:text-lg`}
    >
      {style.mark && <span className="mr-1.5 text-sky-300/60">{style.mark}</span>}
      {client.name}
    </span>
  );
}

export function ClientLogos() {
  const normalizedClients = (clients as ClientInput[]).map(normalizeClient);

  return (
    <section className="relative px-5 py-24 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
              /// CLIENTES & COLABORAÇÕES
            </p>

            <h2 className="display mt-4 max-w-xl text-3xl leading-[1.03] tracking-[-0.025em] text-metal md:text-5xl">
              Marcas que passaram pelo processo.
            </h2>
          </div>

          <div className="col-span-12 self-end md:col-span-5 md:col-start-8">
            <p className="max-w-xl text-sm leading-7 text-slate-400 md:text-[15px]">
              Uma seleção de marcas, equipas e projetos desenvolvidos entre
              direção de arte, identidade visual, campanhas e design digital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 overflow-hidden border border-white/[0.08] bg-white/[0.04] md:grid-cols-3 lg:grid-cols-4">
          {normalizedClients.map((client, index) => {
            const content = (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  delay: index * 0.035,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative flex h-28 items-center justify-center border-b border-r border-white/[0.08] bg-[#01040A]/80 px-5 transition duration-300 hover:bg-[#06111F]/90 md:h-32"
              >
                <span className="absolute left-3 top-3 mono text-[9px] tracking-[0.18em] text-slate-700 transition group-hover:text-sky-300/70">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {client.featured && (
                  <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.75)]" />
                )}

                <ClientMark client={client} />

                {client.url && (
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.7}
                    className="absolute bottom-3 right-3 text-slate-700 opacity-0 transition duration-300 group-hover:text-sky-300 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                )}

                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-sky-300/80 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              </motion.div>
            );

            if (client.url) {
              return (
                <a
                  key={`${client.name}-${index}`}
                  href={client.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir site de ${client.name}`}
                >
                  {content}
                </a>
              );
            }

            return <div key={`${client.name}-${index}`}>{content}</div>;
          })}
        </div>

        <p className="mono mt-5 text-[10px] tracking-[0.22em] text-slate-600">
          LOGOS PODEM SER SUBSTITUÍDOS POR SVG, PNG OU WEBP EM /src/assets/clients
        </p>
      </div>
    </section>
  );
}
