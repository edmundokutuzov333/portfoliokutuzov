import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import logoUrl from "@/assets/logo.webp";
import { motion, LayoutGroup } from "framer-motion";
import { ShinyButton } from "@/components/ui/shiny-button";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/credentials", label: "Credentials" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-4 z-50 px-4"
    >
      <div className="mx-auto max-w-[var(--width-wide)]">
        <nav
          className="flex items-center justify-between rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/70 py-2 pl-4 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.24)] backdrop-blur-xl transition duration-500 hover:bg-[var(--color-surface)]/90"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group flex items-center gap-3 focus:outline-none pl-1"
            aria-label="Edmundo Kutuzov - home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--color-border-base)] bg-white/[0.02] overflow-hidden transition duration-300 group-hover:border-[var(--color-accent-subtle)] group-hover:bg-[var(--color-accent-subtle)]">
              <img
                src={logoUrl}
                alt="Edmundo Kutuzov logo"
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
              />
            </span>

            <span className="hidden flex-col leading-none sm:flex">
              <span className="display text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-text-primary)]">
                Edmundo Kutuzov
              </span>
              <span className="mono mt-1 text-[9px] tracking-[0.2em] text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent-hover)]">
                Art Director
              </span>
            </span>
          </Link>

          <LayoutGroup>
            <ul className="hidden items-center gap-1.5 md:flex pr-4">
              {links.map((link) => {
                const active =
                  pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
                return (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={clsx(
                        "relative flex items-center px-3 py-1.5 text-[13px] font-medium transition-colors duration-300 focus:outline-none",
                        active
                          ? "text-[var(--color-text-primary)]"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="navActiveIndicator"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                          className="absolute -bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--color-accent-base)] opacity-80"
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>

          <div className="flex items-center gap-2">
            <ShinyButton to="/contact" className="hidden sm:inline-flex !py-2 !px-4 !text-[13px]">
              Start a project
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </ShinyButton>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-border-base)] bg-white/[0.02] text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)] focus:outline-none md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-navigation"
            className="mt-2 overflow-hidden rounded-3xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/95 p-3 shadow-2xl backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active =
                  pathname === link.to || (link.to !== "/" && pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={clsx(
                      "rounded-2xl px-4 py-3 text-[15px] font-medium transition",
                      active
                        ? "bg-[var(--color-accent-subtle)] text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-highlight)] hover:text-[var(--color-text-primary)]",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.header>
  );
}
