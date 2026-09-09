export const SITE_ORIGIN = "https://portfoliokutuzov-omega.vercel.app";
export const SITE_NAME = "Edmundo Kutuzov";
export const SOCIAL_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp";

export function canonicalUrl(path = "/") {
  const normalized = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${SITE_ORIGIN}${normalized}`;
}

export function createSeo({
  title,
  description,
  path = "/",
  image = SOCIAL_IMAGE,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const url = canonicalUrl(path);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "author", content: SITE_NAME },
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
    links: [{ rel: "canonical", href: url }],
  };
}

export function socialImageUrl() {
  return SOCIAL_IMAGE;
}
