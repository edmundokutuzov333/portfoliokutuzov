import * as React from "react";
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
    };

export function CinematicLogoCloud({
  clients,
  className,
}: {
  clients: LogoCloudClient[];
  className?: string;
}) {
  const row1 = clients.slice(0, Math.ceil(clients.length / 2));
  const row2 = clients.slice(Math.ceil(clients.length / 2));

  const renderClient = (c: LogoCloudClient) => {
    if (c.logo_url) {
      return (
        <img
          src={c.logo_url}
          alt={c.name}
          width={c.logo_width ?? undefined}
          height={c.logo_height ?? undefined}
          className="h-8 md:h-10 w-auto max-w-[130px] md:max-w-[160px] object-contain opacity-75 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      );
    }
    return (
      <span className="display text-sm md:text-base font-medium tracking-[0.04em] text-center text-slate-200 opacity-75 group-hover:opacity-100 transition-opacity">
        {c.name}
      </span>
    );
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(12px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="space-y-4 md:space-y-6 w-full"
      >
        <Marquee speed={35} className="[--gap:1.25rem] md:[--gap:2rem]">
          {row1.map((client, idx) => (
            <motion.div
              key={client.id || `${client.name}-${idx}`}
              variants={itemVariants}
              className="group flex shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5 md:px-8 md:py-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {renderClient(client)}
            </motion.div>
          ))}
        </Marquee>

        <Marquee speed={35} reverse className="[--gap:1.25rem] md:[--gap:2rem]">
          {row2.map((client, idx) => (
            <motion.div
              key={client.id || `${client.name}-${idx}`}
              variants={itemVariants}
              className="group flex shrink-0 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5 md:px-8 md:py-5 backdrop-blur-sm transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
            >
              {renderClient(client)}
            </motion.div>
          ))}
        </Marquee>
      </motion.div>
    </div>
  );
}
