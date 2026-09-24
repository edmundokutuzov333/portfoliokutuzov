export const SITE_ORIGIN = "https://edmundokutuzov.art";
export const SITE_NAME = "Edmundo Kutuzov";
export const SOCIAL_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp";

export function canonicalUrl(path = "/") {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_ORIGIN}${normalized}`;
}

function alternatePtPath(path: string): string {
  if (path === "/") return "/pt";
  if (path === "/pt" || path.startsWith("/pt/")) return path;
  return `/pt${path}`;
}

function alternateEnPath(path: string): string {
  if (path === "/pt") return "/";
  if (path.startsWith("/pt/")) return path.replace(/^\/pt/, "") || "/";
  return path;
}

export function createSeo({
  title,
  description,
  path = "/",
  image = SOCIAL_IMAGE,
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
}) {
  const url = canonicalUrl(path);
  const ptUrl = canonicalUrl(alternatePtPath(path));
  const enUrl = canonicalUrl(alternateEnPath(path));
  const robots = noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large";

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
      { name: "robots", content: robots },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: `${SITE_NAME} portfolio` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: url },
      { rel: "alternate", hrefLang: "en", href: enUrl },
      { rel: "alternate", hrefLang: "pt-PT", href: ptUrl },
      { rel: "alternate", hrefLang: "x-default", href: enUrl },
      { rel: "sitemap", type: "application/xml", href: `${SITE_ORIGIN}/sitemap.xml` },
    ],
  };
}

export function socialImageUrl() {
  return SOCIAL_IMAGE;
}
