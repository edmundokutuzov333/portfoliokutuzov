export const STUDIO_PUBLIC_ENABLED = import.meta.env.VITE_STUDIO_PUBLIC_ENABLED === "true";

export const isStudioPublicEnabled = () => STUDIO_PUBLIC_ENABLED;
