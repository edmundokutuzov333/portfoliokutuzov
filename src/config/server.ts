const DEFAULT_PUBLIC_SITE_URL = "https://portfoliokutuzov-omega.vercel.app";

function firstNonEmpty(...values: Array<string | undefined>) {
  return values.find((value) => value && value.trim().length > 0)?.trim();
}

function parseOrigins(value?: string) {
  return (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => origin.replace(/\/$/, ""));
}

export function resolvePublicSiteUrl() {
  return firstNonEmpty(process.env.PUBLIC_SITE_URL, process.env.SITE_URL) ?? DEFAULT_PUBLIC_SITE_URL;
}

export function getAllowedCorsOrigins() {
  const configured = parseOrigins(process.env.CORS_ALLOWED_ORIGINS);
  const siteUrl = resolvePublicSiteUrl().replace(/\/$/, "");
  const defaults = [siteUrl, DEFAULT_PUBLIC_SITE_URL];

  if (process.env.NODE_ENV !== "production") {
    defaults.push("http://localhost:3000", "http://127.0.0.1:3000");
  }

  return new Set([...configured, ...defaults].filter(Boolean));
}

export function getCorsHeaders(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = getAllowedCorsOrigins();

  if (origin && allowed.has(origin.replace(/\/$/, ""))) {
    return {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Vary": "Origin",
    };
  }

  return {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function isCorsOriginAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  return getAllowedCorsOrigins().has(origin.replace(/\/$/, ""));
}
