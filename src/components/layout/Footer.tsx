import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting, SITE_EMAIL } from "@/lib/cms";
import { NewsletterForm } from "@/components/contact/NewsletterForm";
import { ShinyButton } from "@/components/ui/shiny-button";

const navLinks = [
  { label: "Home", to: "/" as const },
  { label: "Portfolio", to: "/portfolio" as const },
  { label: "The Credentials", to: "/credentials" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Footer() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "footer", f, fb);
  const s = <T,>(f: string, fb: T) => readSetting<T>(settings, "social", f, fb);
  const email = r("email", SITE_EMAIL);

  const socialLinks = [
    { label: "Instagram", href: s("instagram", "#") },
    { label: "LinkedIn", href: s("linkedin", "#") },
    { label: "Facebook", href: s("facebook", "#") },
  ];

  return (
    <footer className="relative z-10 bg-[var(--color-bg)] pt-32 pb-12 border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[var(--width-standard)] px-4 md:px-8">
        {/* Top Section: CTA */}
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-32">
          <div className="md:col-span-8 lg:col-span-9">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-8">
              {r("eyebrow", "Edmundo Kutuzov — Art Director")}
            </p>
            <h3 className="display text-5xl md:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-secondary)]">
                {r("title_1", "Available for")}
              </span>
              <br />
              <span className="text-[var(--color-text-primary)]">
                {r("title_2", "projects in 2026.")}
              </span>
            </h3>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <ShinyButton to="/contact" className="!py-4 !px-8 !text-[14px]">
                {r("cta", "Start a conversation")}
                <ArrowUpRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </ShinyButton>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-8 py-4 text-[14px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
              >
                <Mail size={16} strokeWidth={1.5} />
                {email}
              </a>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-end">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              Join the list
            </p>
            <NewsletterForm source="footer" compact />
          </div>
        </div>

        {/* Middle Section: Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-[var(--color-border-subtle)]">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">
              Navigation
            </p>
            <ul className="space-y-4 text-[14px] text-[var(--color-text-secondary)]">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-block transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">
              Socials
            </p>
            <ul className="space-y-4 text-[14px] text-[var(--color-text-secondary)]">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-2 transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      strokeWidth={1.5}
                      className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 md:text-right flex flex-col justify-between">
            <div className="max-w-xs ml-auto">
              <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed italic mb-8">
                "Design is not just what it looks like and feels like. Design is how it works."
              </p>
            </div>

            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
              © {new Date().getFullYear()} Edmundo Kutuzov.
              <br />
              All rights reserved. The only one.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
