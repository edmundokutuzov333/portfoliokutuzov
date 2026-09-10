import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/ui/marquee";
import type { DbClient } from "@/lib/cms";

export type LogoCloudClient =
  | DbClient
  | {
      id?: string;
      name: string;
      logo_url?: string | null;
      logo_width?: number | null;
      logo_height?: number | null;
      website_url?: string | null;
    };

function ClientMark({ client }: { client: LogoCloudClient }) {
  const mark = client.logo_url ? (
    <img
      src={client.logo_url}
      alt={client.name}
      width={client.logo_width ?? undefined}
      height={client.logo_height ?? undefined}
      loading="lazy"
      decoding="async"
      className="h-8 md:h-10 w-auto max-w-[130px] md:max-w-[160px] object-contain grayscale opacity-70 transition-[filter,opacity] duration-300 group-hover:grayscale-0 group-hover:opacity-100"
    />
  ) : (
    <span className="display text-sm md:text-base font-medium tracking-[0.04em] text-center text-slate-200 opacity-75 transition-opacity duration-300 group-hover:opacity-100">
      {client.name}
    </span>
  );

  if (client.website_url) {
    return (
      <a
        href={client.website_url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${client.name}`}
        className="inline-flex min-h-11 min-w-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--color-accent-hover)]"
      >
        {mark}
      </a>
    );
  }
  return mark;
}

export function CinematicLogoCloud({
  clients,
  className,
}: {
  clients: LogoCloudClient[];
  className?: string;
}) {
  const activeClients = clients.filter((client) => client.name.trim());
  if (!activeClients.length) return null;
  const split = Math.ceil(activeClients.length / 2);
  const row1 = activeClients.slice(0, split);
  const row2 = activeClients.slice(split);
  const rows = row2.length ? [row1, row2] : [row1];

  const renderRow = (row: LogoCloudClient[], reverse = false) => (
    <Marquee speed={35} reverse={reverse} className="[--gap:1.25rem] md:[--gap:2rem]">
      {row.map((client, index) => (
        <motion.div
          key={client.id || `${client.name}-${index}`}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.55,
            delay: Math.min(index * 0.04, 0.3),
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group flex min-h-[68px] shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5 backdrop-blur-sm transition-colors hover:border-white/[0.12] hover:bg-white/[0.04] md:min-h-[80px] md:px-8 md:py-5"
        >
          <ClientMark client={client} />
        </motion.div>
      ))}
    </Marquee>
  );

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="space-y-4 md:space-y-6 w-full">
        {rows.map((row, index) => (
          <div key={`logo-row-${index}`}>{renderRow(row, index % 2 === 1)}</div>
        ))}
      </div>
    </div>
  );
}
