import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import clsx from "clsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "Sobre" },
  { to: "/contact", label: "Contato" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="mx-auto max-w-[1240px]">
        <nav className="glass-nav rounded-full pl-5 pr-2 py-2 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Edmundo home">
            <span className="display text-[15px] font-semibold tracking-tight">ED.</span>
            <span className="hidden sm:inline mono text-[10px] text-[var(--color-text-ghost)] group-hover:text-[var(--color-acc-cyan)] transition-colors">
              ART DIRECTOR
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={clsx(
                      "relative px-4 py-2 text-[13px] font-medium rounded-full transition-colors",
                      active
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    )}
                  >
                    {active && (
                      <span className="absolute inset-0 rounded-full bg-white/5 border border-white/10" />
                    )}
                    <span className="relative">{l.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[var(--color-acc-acid)] text-black px-4 py-2 text-[13px] font-semibold hover:brightness-110 transition"
            >
              Iniciar projeto
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden h-10 w-10 grid place-items-center rounded-full border border-white/10"
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 glass-nav rounded-3xl p-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm rounded-2xl hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
