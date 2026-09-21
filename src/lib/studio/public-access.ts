import { publicConfig } from "@/config/public";

export const STUDIO_PUBLIC_ENABLED = publicConfig.studioPublicEnabled;

export function isStudioPublicEnabled() {
  return STUDIO_PUBLIC_ENABLED;
}

export function studioUnavailableResponse() {
  return new Response(JSON.stringify({ error: "STUDIO_UNAVAILABLE" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
