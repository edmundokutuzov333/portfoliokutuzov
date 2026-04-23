import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";

const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Portfolio", to: "/portfolio" as const },
  { label: "The Credentials", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/edmundo.kutuzov/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4" },
  { label: "Facebook", href: "https://www.facebook.com/edmundoku/" },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/[0.08]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/40 to-transparent"
      />

      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 md:grid-cols-12 md:px-8 md:py-20">
        <div className="md:col-span-6">
          <p className="mono text-[10px] font-medium tracking-[0.28em] text-slate-500">
            Edmundo Kutuzov — Art Director
          </p>

          <h3 className="display mt-5 max-w-2xl text-4xl leading-[1] tracking-[-0.035em] text-slate-100 md:text-6xl">
            <span className="text-metal">Available for selected</span>
            <br />
            <span className="text-sky-200">projects in 2026.</span>
          </h3>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-sm font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200 hover:shadow-[0_0_36px_rgba(56,189,248,0.22)] focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#01040A]"
            >
              Start a conversation
              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>

            <a
              href="mailto:edmundokutuzov@phantom-mz.com"
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-3 text-sm text-slate-300 transition duration-300 hover:border-sky-300/35 hover:bg-sky-300/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/60 focus:ring-offset-2 focus:ring-offset-[#01040A]"
            >
              <Mail size={15} strokeWidth={1.8} />
              edmundokutuzov@phantom-mz.com
            </a>
          </div>
        </div>

        <nav className="md:col-span-3" aria-label="Footer navigation">
          <p className="mono text-[10px] font-medium tracking-[0.28em] text-slate-500">
            Navigation
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="inline-flex transition duration-200 hover:translate-x-1 hover:text-white focus:outline-none focus:text-sky-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="mono text-[10px] font-medium tracking-[0.28em] text-slate-500">
            Social
          </p>

          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 transition duration-200 hover:translate-x-1 hover:text-white focus:outline-none focus:text-sky-200"
                >
                  {link.label}
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.8}
                    className="opacity-40 transition group-hover:opacity-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-3 px-5 py-6 text-[12px] text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {new Date().getFullYear()} Edmundo Kutuzov. All rights reserved.</span>
          <span>Magoanine “C”, Maputo · Mozambique</span>
          <span>+258 87 601 312 1</span>
        </div>
      </div>
    </footer>
  );
}
