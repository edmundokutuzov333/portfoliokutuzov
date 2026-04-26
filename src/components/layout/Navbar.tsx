import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
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
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto max-w-[1240px]">
        <nav
          className="flex items-center justify-between rounded-full border border-white/[0.08] bg-[#01040A]/75 py-2 pl-5 pr-2 shadow-[0_18px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            className="group flex items-center gap-3 focus:outline-none"
            aria-label="Edmundo Kutuzov - home"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full border border-white/[0.1] bg-white/[0.035] display text-[13px] font-semibold tracking-[-0.02em] text-slate-100 transition group-hover:border-sky-300/35 group-hover:text-sky-200">
              EK
            </span>

            <span className="hidden flex-col leading-none sm:flex">
              <span className="display text-[13px] font-semibold tracking-[-0.01em] text-slate-100">
                Edmundo Kutuzov
              </span>
              <span className="mono mt-1 text-[9px] tracking-[0.22em] text-slate-600 transition group-hover:text-sky-300/70">
                Art Director
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={clsx(
                      "relative rounded-full px-4 py-2 text-[13px] font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300/50",
                      active ? "text-white" : "text-slate-400 hover:text-slate-100"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full border border-sky-300/20 bg-sky-300/[0.08]" />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="group hidden items-center gap-1.5 rounded-full bg-slate-100 px-4 py-2 text-[13px] font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200 hover:shadow-[0_0_32px_rgba(56,189,248,0.18)] focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#01040A] sm:inline-flex"
            >
              Start a project
              <ArrowUpRight
                size={14}
                strokeWidth={1.9}
                className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="grid h-10 w-10 place-items-center rounded-full border border-white/[0.1] bg-white/[0.03] text-slate-200 transition hover:border-sky-300/35 hover:bg-sky-300/[0.06] focus:outline-none focus:ring-2 focus:ring-sky-300/60 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={18} strokeWidth={1.8} /> : <Menu size={18} strokeWidth={1.8} />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            id="mobile-navigation"
            className="mt-2 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#01040A]/92 p-3 shadow-[0_18px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const active = pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={clsx(
                      "rounded-2xl px-4 py-3 text-sm transition",
                      active
                        ? "bg-sky-300/[0.08] text-white"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
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
    </header>
  );
}
