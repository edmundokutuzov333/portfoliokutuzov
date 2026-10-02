import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Mail } from "lucide-react";
import { useMemo } from "react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { FALLBACK_NAVIGATION, readSetting, SITE_EMAIL } from "@/lib/cms";
import { NewsletterForm } from "@/components/contact/NewsletterForm";
import { ShinyButton } from "@/components/ui/shiny-button";

function getNavigation(raw: unknown) {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const items = raw.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
  const parsed = items.map((item, index) => ({
    id: typeof item.id === "string" ? item.id : "footer-" + String(index),
    label: typeof item.label === "string" ? item.label : "",
    route: typeof item.route === "string" ? item.route : "/",
    order: typeof item.order === "number" ? item.order : index + 1,
    visible: item.visible !== false,
    external: item.external === true,
    cta: item.cta === true,
  })).filter((item) => item.label && item.visible && !item.cta);
  return parsed.length ? parsed.sort((a, b) => a.order - b.order) : FALLBACK_NAVIGATION.filter((item) => !item.cta);
}

export function Footer() {
  const { data: settings } = useSiteSettings();
  const navigation = useMemo(() => getNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)), [settings]);
  const footer = <T,>(field: string, fallback: T) => readSetting<T>(settings, "footer", field, fallback);
  const social = <T,>(field: string, fallback: T) => readSetting<T>(settings, "social", field, fallback);
  const email = readSetting(settings, "global", "email", footer("email", SITE_EMAIL));
  const copyright = readSetting(settings, "global", "copyright", "Edmundo Kutuzov. All rights reserved. The only one.");
  const ctaLabel = footer("cta", "Start a conversation");

  return (
    <footer className="relative z-10 bg-[var(--color-bg)] pt-32 pb-12 border-t border-[var(--color-border-subtle)]">
      <div className="mx-auto max-w-[var(--width-standard)] px-4 md:px-8">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-32">
          <div className="md:col-span-8 lg:col-span-9">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-8">{footer("eyebrow", "Edmundo Kutuzov - Art Director")}</p>
            <h3 className="display text-5xl md:text-7xl lg:text-[100px] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]">
              <span className="text-[var(--color-text-secondary)]">{footer("title_1", "Available for")}</span><br />
              <span className="text-[var(--color-text-primary)]">{footer("title_2", "projects in 2026.")}</span>
            </h3>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <ShinyButton to="/contact" className="!py-4 !px-8 !text-[14px]">{ctaLabel}<ArrowUpRight size={16} strokeWidth={2}/></ShinyButton>
              <a href={"mailto:" + email} className="inline-flex items-center gap-3 rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] px-8 py-4 text-[14px] text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"><Mail size={16} strokeWidth={1.5}/>{email}</a>
            </div>
          </div>
          <div className="md:col-span-4 lg:col-span-3 flex flex-col justify-end">
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">Join the list</p>
            <NewsletterForm source="footer" compact />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-[var(--color-border-subtle)]">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">Navigation</p>
            <ul className="space-y-4 text-[14px] text-[var(--color-text-secondary)]">
              {navigation.map((item) => <li key={item.id}>{item.external ? <a href={item.route} target="_blank" rel="noreferrer" className="inline-block hover:text-[var(--color-text-primary)]">{item.label}</a> : <Link to={item.route as never} className="inline-block hover:text-[var(--color-text-primary)]">{item.label}</Link>}</li>)}
            </ul>
          </div>
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-6">Socials</p>
            <ul className="space-y-4 text-[14px] text-[var(--color-text-secondary)]">
              {[["Instagram",social("instagram","#")],["LinkedIn",social("linkedin","#")],["Facebook",social("facebook","#")]].map((item)=><li key={item[0]}><a href={String(item[1])} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 hover:text-[var(--color-text-primary)]">{item[0]}<ArrowUpRight size={14} className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0"/></a></li>)}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2 md:text-right flex flex-col justify-between">
            <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed italic mb-8">"Design is not just what it looks like and feels like. Design is how it works."</p>
            <p className="mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">© {new Date().getFullYear()} {copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
