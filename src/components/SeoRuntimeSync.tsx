import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useSiteSettings } from "@/hooks/useSiteData";
import { SITE_ORIGIN, SOCIAL_IMAGE } from "@/lib/seo";

function setMeta(name: string, content: string, property = false) {
  if (!content) return;
  const selector = property ? 'meta[property="' + name + '"]' : 'meta[name="' + name + '"]';
  let node = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement("meta");
    if (property) node.setAttribute("property", name);
    else node.setAttribute("name", name);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
}

function setCanonical(url: string) {
  let node = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement("link");
    node.rel = "canonical";
    document.head.appendChild(node);
  }
  node.href = url;
}

function setIcon(url: string) {
  let node = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement("link");
    node.rel = "icon";
    document.head.appendChild(node);
  }
  node.href = url;
}

export function SeoRuntimeSync() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const global = (settings?.seo_global || {}) as Record<string, unknown>;
    const pages = (settings?.seo_pages?.pages || {}) as Record<string, Record<string, unknown>>;
    const page = pages[pathname] || {};
    const title = String(page.title || global.title || "Edmundo Kutuzov - Designer & Art Director");
    const description = String(page.description || global.description || "Visual identities, art direction and digital experiences built with strategic clarity and technical precision.");
    const ogTitle = String(page.og_title || global.og_title || title);
    const ogDescription = String(page.og_description || global.og_description || description);
    const ogImage = String(page.og_image || global.og_image || SOCIAL_IMAGE);
    const canonicalPath = String(page.canonical || pathname || "/");
    const canonical = canonicalPath.startsWith("http") ? canonicalPath : SITE_ORIGIN + (canonicalPath === "/" ? "/" : "/" + canonicalPath.replace(/^\/+/, ""));
    const robots = String(global.robots_meta || "index,follow,max-image-preview:large");
    const twitterCard = String(global.twitter_card || "summary_large_image");
    const favicon = String((settings?.global || {}).favicon_url || "/favicon.webp");

    document.title = title;
    setMeta("description", description);
    setMeta("author", "Edmundo Kutuzov");
    setMeta("robots", robots);
    setMeta("og:type", "website", true);
    setMeta("og:site_name", "Edmundo Kutuzov", true);
    setMeta("og:title", ogTitle, true);
    setMeta("og:description", ogDescription, true);
    setMeta("og:url", canonical, true);
    setMeta("og:image", ogImage, true);
    setMeta("og:image:alt", "Edmundo Kutuzov portfolio", true);
    setMeta("twitter:card", twitterCard);
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDescription);
    setMeta("twitter:image", ogImage);
    setCanonical(canonical);
    setIcon(favicon);
  }, [pathname, settings]);

  return null;
}
