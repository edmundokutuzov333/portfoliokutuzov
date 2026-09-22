import type { ComponentType } from "react";
import {
  Phase2Overview,
  HomepageManager,
  CredentialsManager,
  ServicesManager,
  NavigationManager,
  GlobalSettingsManager,
  SeoManager,
  MediaLibrary,
} from "@/components/admin/Phase2WebsiteCMS";

type Surface =
  | "overview"
  | "homepage"
  | "navigation"
  | "credentials"
  | "services"
  | "global"
  | "seo"
  | "media";

const surfaces: Record<Surface, ComponentType<any>> = {
  overview: Phase2Overview,
  homepage: HomepageManager,
  navigation: NavigationManager,
  credentials: CredentialsManager,
  services: ServicesManager,
  global: GlobalSettingsManager,
  seo: SeoManager,
  media: MediaLibrary,
};

export function Phase2AdminSurface({
  section,
  onNavigate,
}: {
  section: Surface;
  onNavigate?: (section: string) => void;
}) {
  const Component = surfaces[section];
  return <Component onNavigate={onNavigate} />;
}
