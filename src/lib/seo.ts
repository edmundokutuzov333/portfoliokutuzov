import { publicConfig } from "@/config/public";

const FALLBACK_SITE_ORIGIN = "https://portfoliokutuzov-omega.vercel.app";

function normalizeOrigin(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");
  try {
    return new URL(trimmed).origin;
  } catch {
    return FALLBACK_SITE_ORIGIN;
  }
}

export const SITE_ORIGIN = normalizeOrigin(publicConfig.siteUrl || FALLBACK_SITE_ORIGIN);

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, `${SITE_ORIGIN}/`).toString();
}

export function canonicalPath(path = "/") {
  return absoluteUrl(path);
}

export function socialImageUrl() {
  return "https://storage.googleapis.com/gpt-engineer-file-uploads/pHZRYs3DGCdOPGZzeAdkZH1MMif2/social-images/social-1778488549600-EKLOGO.webp";
}

export function createSeo({
  title,
  description,
  path = "/",
  image = socialImageUrl(),
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
}) {
  const canonical = canonicalPath(path);
  const meta = [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index,follow,max-image-preview:large" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}
