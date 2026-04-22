import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/8 mt-32">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="mono text-[10px] text-[var(--color-text-ghost)]">/ EDMUNDO STUDIO</p>
          <h3 className="display text-3xl md:text-5xl mt-4 leading-[1.05]">
            Available for selected
            <br />
            <span className="text-acid">projects in 2026.</span>
          </h3>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium border-b border-white/20 pb-1 hover:border-[var(--color-acc-acid)]"
          >
            Iniciar conversa <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="md:col-span-3">
          <p className="mono text-[10px] text-[var(--color-text-ghost)]">/ NAV</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/portfolio" className="hover:text-white">Portfolio</Link></li>
            <li><Link to="/about" className="hover:text-white">Sobre</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contato</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="mono text-[10px] text-[var(--color-text-ghost)]">/ CONTACT</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-muted)]">
            <li><a href="mailto:edmundo@studio.com" className="hover:text-white">edmundo@studio.com</a></li>
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">Behance</a></li>
            <li><a href="#" className="hover:text-white">Dribbble</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/8">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3 mono text-[10px] text-[var(--color-text-ghost)]">
          <span>© 2026 EDMUNDO — ALL RIGHTS RESERVED</span>
          <span>MAPUTO · SÃO PAULO · REMOTE</span>
          <span>LAT -25.96 / LON 32.58</span>
        </div>
      </div>
    </footer>
  );
}
