export type CredentialExperience = {
  period: string;
  role: string;
  company: string;
};

export type CredentialMetric = {
  value: string;
  label: string;
};

export type CredentialSkill = {
  name: string;
  value: number;
  level?: "Core" | "Fluent" | "Exploring";
};

export type CredentialCapabilityGroup = {
  category: string;
  items: string[];
};

export type CredentialPrinciple = {
  key: string;
  value: string;
};

export const FALLBACK_EXPERIENCE: CredentialExperience[] = [
  {
    role: "Art Director & Content Creator",
    company: "WEBMASTERS Limitada",
    period: "2024 - Present",
  },
  { role: "Art Director", company: "SPOT Comunicação", period: "2023 - 2024" },
  { role: "Graphic Designer", company: "Ikigai Moçambique", period: "2023" },
  {
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
    period: "2023",
  },
  { role: "Graphic Designer", company: "Agência Creer", period: "2020 - 2023" },
];

export const FALLBACK_METRICS: CredentialMetric[] = [
  { value: "6+", label: "Years of experience" },
  { value: "150+", label: "Projects delivered" },
  { value: "30+", label: "National and international brands" },
  { value: "3", label: "Continents" },
  { value: "360º", label: "Art direction, branding, strategy, AI, marketing" },
];

export const FALLBACK_SKILLS: CredentialSkill[] = [
  { name: "Adobe Photoshop", value: 95 },
  { name: "Adobe Illustrator", value: 75 },
  { name: "Adobe Premiere", value: 75 },
  { name: "Adobe After Effects", value: 45 },
  { name: "Artificial Intelligence", value: 95 },
];

export const FALLBACK_CAPABILITY_GROUPS: CredentialCapabilityGroup[] = [
  {
    category: "Core Disciplines",
    items: [
      "Art Direction",
      "Brand Identity Systems",
      "Campaign Design",
      "Creative Direction",
      "Visual Hierarchy & Typography",
    ],
  },
  {
    category: "Digital & Motion",
    items: [
      "Social-First Content Systems",
      "Motion Design & Key Art",
      "UI/UX Design Systems",
      "AI Creative Direction",
      "Audiovisual Storytelling",
    ],
  },
  {
    category: "Print & Special Projects",
    items: [
      "Editorial & Publications",
      "Large-Format OOH Billboards",
      "Packaging & Print Prep",
      "Music Video & Single Rollouts",
      "Streetwear Curation",
    ],
  },
];

export const FALLBACK_PRINCIPLES: CredentialPrinciple[] = [
  {
    key: "Clarity",
    value: "Every element must earn its place. Noise is the enemy of memory.",
  },
  {
    key: "Rhythm",
    value: "Pacing dictates attention. Contrast creates engagement.",
  },
  {
    key: "Precision",
    value: "Execution defines positioning. God is in the details.",
  },
  {
    key: "Memory",
    value: "Aesthetic survival requires a distinct point of view.",
  },
];

export const FALLBACK_PROFILE = {
  eyebrow: "The Credentials",
  topRight: "Edmundo Kutuzov · Art Director",
  title: "Strategy, craft and a sharp point of view.",
  bio: [
    "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action - blending storytelling, visual hierarchy, and typographic craft.",
    "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.",
    "My focus is always on experiences that generate recognition and measurable results - every choice I make is designed to maximise impact and perception.",
  ],
  email: "contact@edmundokutuzov.art",
  phone: "+258 87 601 312 1",
  location: 'Magoanine "C", Maputo, Mozambique',
};

export function parseStartYear(period: string): number {
  const match = String(period).match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : 0;
}

export function sortExperience<T extends CredentialExperience>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort(
      (a, b) =>
        parseStartYear(b.item.period) - parseStartYear(a.item.period) ||
        a.index - b.index,
    )
    .map(({ item }) => item);
}

export function deriveSkillLevel(value: number): "Core" | "Fluent" | "Exploring" {
  if (value >= 90) return "Core";
  if (value >= 70) return "Fluent";
  return "Exploring";
}
