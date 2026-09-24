import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FALLBACK_NAVIGATION, readSetting, SITE_EMAIL } from "@/lib/cms";
import { useSiteSettings } from "@/hooks/useSiteData";
import { NewsletterForm } from "@/components/contact/NewsletterForm";
import { UI_COPY, localizePath, useSiteLocale } from "@/lib/site-locale";

function getNavigation(raw: unknown) {
  if (!Array.isArray(raw)) return FALLBACK_NAVIGATION;
  const parsed = raw
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map((item, index) => ({
      id: typeof item.id === "string" ? item.id : "footer-" + String(index),
      label: typeof item.label === "string" ? item.label : "",
      route: typeof item.route === "string" ? item.route : "/",
      order: typeof item.order === "number" ? item.order : index + 1,
      visible: item.visible !== false,
      external: item.external === true,
      cta: item.cta === true,
    }))
    .filter((item) => item.label && item.visible && !item.cta);
  return parsed.length ? parsed.sort((a, b) => a.order - b.order) : FALLBACK_NAVIGATION.filter((item) => !item.cta);
}

function MaputoClock() {
  const [time, setTime] = useState(() => new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Maputo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTime(new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Maputo",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()));
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return <time dateTime={new Date().toISOString()}>{time}</time>;
}

export function Footer() {
  const locale = useSiteLocale();
  const copy = UI_COPY[locale];
  const { pathname } = useLocation();
  const { data: settings } = useSiteSettings();
  const navigation = useMemo(() => getNavigation(readSetting<unknown>(settings, "navigation", "items", FALLBACK_NAVIGATION)), [settings]);
  const footer = <T,>(field: string, fallback: T) => readSetting<T>(settings, "footer", field, fallback);
  const social = <T,>(field: string, fallback: T) => readSetting<T>(settings, "social", field, fallback);
  const email = readSetting(settings, "global", "email", footer("email", SITE_EMAIL));
  const copyright = readSetting(settings, "global", "copyright", copy.allRights);
  const availability = readSetting(settings, "availability", "enabled", true);
  const availabilityLabel = readSetting(settings, "availability", "label", locale === "pt-PT" ? "Disponível para projectos" : "Available for projects");
  const availabilityYear = readSetting(settings, "availability", "year", new Date().getFullYear());\n  const isHome = pathname === localizePath("/", locale);
  const homeClosing = "Tell me what you're building. I'll show you how to make it impossible to ignore.";


  return (
    <footer className="ek-global-footer">
      <section className="ek-footer__close" aria-labelledby="footer-close-heading">
        <p className="ek-footer__label">{footer("eyebrow", "Edmundo Kutuzov - Art Director")}</p>
        <h2 id="footer-close-heading" className="ek-footer__headline">
          {isHome ? homeClosing : <>{String(availabilityLabel)}{availability ? <> <em>{availabilityYear}</em>.</> : null}</>}
        </h2>
        <div className="ek-footer__actions">
          <Link to={localizePath("/contact", locale) as never} viewTransition className="ek-nav__cta">{copy.startProject}</Link>
          <a href={`mailto:${email}`} className="ek-nav__cta" style={{ background: "transparent", color: "inherit" }}>{email}</a>
        </div>
      </section>

      <div className="ek-footer__grid">
        <div className="ek-footer__column">
          <p className="ek-footer__label">{copy.navigation}</p>
          <ul className="ek-footer__list">
            {navigation.map((item) => (
              <li key={item.id}>
                {item.external ? (
                  <a href={item.route} target="_blank" rel="noreferrer">{item.label}</a>
                ) : (
                  <Link to={localizePath(item.route, locale) as never} viewTransition>
                    {item.id === "home" ? copy.home : item.id === "portfolio" ? copy.portfolio : item.id === "credentials" ? copy.credentials : item.id === "services" ? copy.services : item.id === "contact" ? copy.contact : item.id === "studio" ? copy.studio : item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="ek-footer__column">
          <p className="ek-footer__label">Socials</p>
          <ul className="ek-footer__list">
            <li><a href={String(social("instagram", "#"))} target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href={String(social("linkedin", "#"))} target="_blank" rel="noreferrer">LinkedIn</a></li>
            <li><a href={String(social("facebook", "#"))} target="_blank" rel="noreferrer">Facebook</a></li>
          </ul>
        </div>

        <div className="ek-footer__column--wide">
          <p className="ek-footer__label">{copy.newsletterLabel}</p>
          <p className="ek-footer__quote">{copy.newsletterDescription}</p>
        </div>

        <div className="ek-footer__newsletter">
          <NewsletterForm source="footer" compact />
        </div>
      </div>

      <div className="ek-footer__grid" style={{ borderTop: "2px solid rgba(242,242,239,.22)", paddingBlock: "1rem" }}>
        <div className="ek-footer__column--wide">
          <p className="ek-footer__quote">{footer("quote", "Design is not just what it looks like and feels like. Design is how it works.")}</p>
        </div>
        <div className="ek-footer__column">
          <p className="ek-footer__label">{copy.maputo}</p>
          <MaputoClock />
        </div>
        <div className="ek-footer__column">
          <p className="ek-footer__label">{new Date().getFullYear()}</p>
          <p style={{ margin: 0, color: "#b9b7b0", font: '500 0.875rem/1.4 var(--font-cartaz, "Archivo Variable", sans-serif)' }}>{copyright}</p>
        </div>
      </div>
    </footer>
  );
}
