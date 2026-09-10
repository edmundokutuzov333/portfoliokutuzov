export const DESIGN_SYSTEM_CONTRACT = {
  tokens: ["color", "type", "space", "motion", "width", "z-index"],
  primitives: ["Typography", "Button", "Tag", "MonoLabel", "Divider", "MediaFrame"],
  components: ["GlassNav", "SectionHeader", "StatusIndicator", "CaseMeta", "CaseNavigation", "ProjectCard"],
  sections: ["Hero", "FeaturedWork", "ClientLogos", "CaseStudy", "ContactBrief"],
} as const;

export type DesignSystemComponent =
  | (typeof DESIGN_SYSTEM_CONTRACT.primitives)[number]
  | (typeof DESIGN_SYSTEM_CONTRACT.components)[number];

export function isDesignSystemComponent(name: string): name is DesignSystemComponent {
  return [...DESIGN_SYSTEM_CONTRACT.primitives, ...DESIGN_SYSTEM_CONTRACT.components].includes(
    name as DesignSystemComponent,
  );
}
