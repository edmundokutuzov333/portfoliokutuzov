import { useEffect, useState } from "react";

export type SiteLocale = "en" | "pt-PT";

const STORAGE_KEY = "ek_locale_v2";
const DEFAULT_LOCALE: SiteLocale = "en";
const listeners = new Set<(locale: SiteLocale) => void>();
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<HTMLElement, Map<string, string>>();

const PT_TRANSLATIONS: Record<string, string> = {
  "Home": "Início",
  "Portfolio": "Portefólio",
  "Credentials": "Percurso",
  "The Credentials": "O Percurso",
  "Services": "Serviços",
  "Contact": "Contacto",
  "Start a project": "Iniciar um projecto",
  "Start a Conversation": "Iniciar uma conversa",
  "Start a conversation": "Iniciar uma conversa",
  "Let's collaborate": "Vamos colaborar",
  "Let's build a visual presence": "Vamos construir uma presença visual",
  "impossible to ignore.": "impossível de ignorar.",
  "Explore work": "Explorar trabalho",
  "View capabilities": "Ver capacidades",
  "Available for projects": "Disponível para projectos",
  "Available for": "Disponível para",
  "projects in 2026.": "projectos em 2026.",
  "Let's get to work.": "vamos trabalhar.",
  "Send a project brief": "Enviar um briefing",
  "Search archive...": "Pesquisar no arquivo...",
  "Search portfolio...": "Pesquisar portefólio...",
  "Search portfolio archive": "Pesquisar arquivo do portefólio",
  "Clear search": "Limpar pesquisa",
  "Clear filters & search": "Limpar filtros e pesquisa",
  "No matching projects": "Sem projectos correspondentes",
  "No artwork": "Sem imagem",
  "VIEW PROJECT": "VER PROJECTO",
  "VIEW": "VER",
  "PLAY": "REPRODUZIR",
  "Archive": "Arquivo",
  "Selected Work.": "Trabalho seleccionado.",
  "Showing": "A mostrar",
  "Methodology · Practice": "Metodologia · Prática",
  "Capabilities": "Capacidades",
  "Visual capabilities &": "Capacidades visuais e",
  "disciplines.": "disciplinas.",
  "Visual disciplines for brands that move with precision.": "Disciplinas visuais para marcas que avançam com precisão.",
  "Brand Logic / Visual Systems / Digital Presence": "Lógica de marca / Sistemas visuais / Presença digital",
  "Core Disciplines & Capabilities": "Disciplinas centrais e capacidades",
  "Interactive Architecture": "Arquitectura interactiva",
  "Portfolio Reference": "Referência do portefólio",
  "Explore": "Explorar",
  "Identity Visual": "Identidade visual",
  "Art Direction": "Direcção de arte",
  "Editorial & Print": "Editorial e impressão",
  "Digital Design": "Design digital",
  "Campaign Design": "Design de campanhas",
  "Brand Identity": "Identidade de marca",
  "Creative Direction": "Direcção criativa",
  "AI Creative Direction": "Direcção criativa com IA",
  "Digital Experience": "Experiência digital",
  "Experience": "Experiência",
  "In Numbers": "Em números",
  "Reference": "Referência",
  "GOD": "DEUS",
  "Present": "Actual",
  "Career History": "Percurso profissional",
  "Professional Experience": "Experiência profissional",
  "Direct Contact & Studio": "Contacto directo e estúdio",
  "Available 2026": "Disponível em 2026",
  "Email": "Email",
  "Phone / WhatsApp": "Telefone / WhatsApp",
  "Location": "Localização",
  "Navigation": "Navegação",
  "Socials": "Redes sociais",
  "Join the list": "Junte-se à lista",
  "All rights reserved. The only one.": "Todos os direitos reservados. O único.",
  "Years of experience": "Anos de experiência",
  "Projects delivered": "Projectos entregues",
  "National and international brands": "Marcas nacionais e internacionais",
  "Continents": "Continentes",
  "Art direction, branding, strategy, AI, marketing": "Direcção de arte, branding, estratégia, IA, marketing",
  "Years": "Anos",
  "Projects": "Projectos",
  "Brands": "Marcas",
  "Capability": "Capacidade",
  "Directing visual communication & strategy": "Direcção de comunicação visual e estratégia",
  "Delivered across brand, digital & print": "Entregues em branding, digital e impressão",
  "National and international collaborations": "Colaborações nacionais e internacionais",
  "Global creative exposure & delivery": "Experiência e entrega criativa global",
  "From high-level strategy to craft execution": "Da estratégia de alto nível à execução de detalhe",
  "Strategy, craft and a sharp point of view.": "Estratégia, execução e um ponto de vista distinto.",
  "I shape ideas that": "Dou forma a ideias que",
  "cut through noise,": "cortam o ruído,",
  "stay in memory,": "ficam na memória,",
  "and move people.": "e mobilizam pessoas.",
  "Building visual systems, digital products, and campaigns that establish authority on an international scale.": "Construo sistemas visuais, produtos digitais e campanhas que estabelecem autoridade à escala internacional.",
  "Strategy, craft and a sharp": "Estratégia, execução e um ponto de vista",
  "point of view.": "distinto.",
  "The core disciplines used to construct enduring brand identities, direct high-impact campaigns, and engineer modular digital systems. Hover each discipline to inspect relevant case studies.": "As disciplinas centrais usadas para construir identidades de marca duradouras, dirigir campanhas de alto impacto e criar sistemas digitais modulares. Passe por cada disciplina para explorar os projectos relevantes.",
  "Tell me about your brand and": "Fale-me sobre a sua marca e",
  "let's get to work.": "vamos trabalhar.",
  "I make ideas stop, take notice, and act. I design visual identities and communication pieces that capture attention and drive action — blending storytelling, visual hierarchy, and typographic craft.": "Faço as ideias parar, captar atenção e gerar acção. Desenvolvo identidades visuais e peças de comunicação que captam atenção e impulsionam resultados, combinando storytelling, hierarquia visual e rigor tipográfico.",
  "I'm Edmundo Kutuzov, an art director deeply rooted in Mozambique's creative ecosystem. I lead projects ranging from ad campaigns and music videos to clothing collections and brand development.": "Sou Edmundo Kutuzov, director de arte profundamente ligado ao ecossistema criativo de Moçambique. Lidero projectos que vão de campanhas publicitárias e videoclipes a colecções de vestuário e desenvolvimento de marcas.",
  "My focus is always on experiences that generate recognition and measurable results — every choice I make is designed to maximise impact, perception, and brand memory.": "O meu foco está sempre em experiências que geram reconhecimento e resultados mensuráveis. Cada decisão é pensada para maximizar impacto, percepção e memória de marca.",
  "Explore Capabilities": "Explorar capacidades",
  "Chronological track record of agency and studio leadership across Mozambique.": "Percurso cronológico de liderança em agências e estúdios em Moçambique.",
  "Brand Logic": "Lógica de marca",
  "Visual Systems": "Sistemas visuais",
  "Digital Presence": "Presença digital",
  "All": "Todos",
  "No projects found": "Nenhum projecto encontrado",
  "No projects found in category": "Nenhum projecto encontrado na categoria",
  "Building visual languages for campaigns, brands and digital products with consistent aesthetic, narrative intent and execution precision.": "Construção de linguagens visuais para campanhas, marcas e produtos digitais com estética consistente, intenção narrativa e precisão de execução.",
  "Concept": "Conceito",
  "Moodboards": "Moodboards",
  "Key visuals": "Key visuals",
  "Guidelines": "Guidelines",
  "Logo system": "Sistema de logótipo",
  "Typography": "Tipografia",
  "Colour logic": "Lógica de cor",
  "Brand book": "Manual de marca",
  "Big idea": "Grande ideia",
  "Visual rollout": "Desdobramento visual",
  "Social assets": "Materiais para redes sociais",
  "Launch kit": "Kit de lançamento",
  "Web design": "Web design",
  "UI systems": "Sistemas de UI",
  "Motion language": "Linguagem de motion",
  "Responsive layouts": "Layouts responsivos",
  "Strategic brand marks, typography systems & identity architecture": "Marcas estratégicas, sistemas tipográficos e arquitectura de identidade",
  "Transforming strategic brand intent into unmistakable visual form. Developing comprehensive visual grammar, logo systems, bespoke typographic pairings, colour scales, and rigorous brand guideline books built for permanence.": "Transformação da intenção estratégica da marca numa forma visual inequívoca. Desenvolvimento de gramática visual, sistemas de logótipo, combinações tipográficas próprias, escalas cromáticas e manuais de marca rigorosos pensados para perdurar.",
  "Brand Architecture & Strategy": "Arquitectura e estratégia de marca",
  "Logo Marks & Symbol Systems": "Logótipos e sistemas de símbolos",
  "Custom Typographic Scales": "Escalas tipográficas personalizadas",
  "Comprehensive Identity Guidelines": "Manual completo de identidade",
  "Campaign conception, visual storytelling & photography direction": "Concepção de campanhas, storytelling visual e direcção fotográfica",
  "Crafting the visual soul of campaigns and brand narratives. Directing photography, set styling, cinematic color grading, and commercial rollout systems that stop scrolling and demand attention across national and global markets.": "Construção da alma visual de campanhas e narrativas de marca. Direcção fotográfica, styling de cenários, color grading cinematográfico e sistemas de lançamento comercial que interrompem o scroll e exigem atenção nos mercados nacionais e globais.",
  "Campaign Visual Concepts": "Conceitos visuais de campanha",
  "Photography & Video Treatments": "Tratamentos de fotografia e vídeo",
  "Master Key Visuals (KV)": "Key visuals principais (KV)",
  "Multi-Channel Rollout Systems": "Sistemas de desdobramento multicanal",
  "Tactile publications, large-format OOH & packaging design": "Publicações tácteis, OOH de grande formato e design de packaging",
  "Bringing precision and rhythm to tangible media. Editorial compositions, annual reports, large-format outdoor billboards, product packaging, and tactile print production oversight engineered with uncompromising typographic restraint.": "Levar precisão e ritmo aos suportes físicos. Composições editoriais, relatórios anuais, outdoors de grande formato, packaging e acompanhamento de produção gráfica com rigor tipográfico.",
  "Editorial Books & Publications": "Livros e publicações editoriais",
  "Large-Format OOH & Billboards": "OOH e outdoors de grande formato",
  "Packaging & Structural Design": "Packaging e design estrutural",
  "Print Production & Finish Specs": "Produção gráfica e especificações de acabamento",
  "Social-first content engines, motion assets & digital systems": "Sistemas de conteúdo social-first, motion assets e sistemas digitais",
  "Designing modular digital ecosystems for continuous brand momentum. Social-first publication engines, UI/UX aesthetics, digital campaign kits, dynamic motion graphics, and interactive web interfaces optimized for high engagement.": "Concepção de ecossistemas digitais modulares para manter o impulso da marca. Sistemas de publicação social-first, estética UI/UX, kits de campanhas digitais, motion graphics dinâmicos e interfaces web interactivas optimizadas para elevado envolvimento.",
  "Social-First Content Systems": "Sistemas de conteúdo social-first",
  "Dynamic Motion Language": "Linguagem de motion dinâmica",
  "Digital Design Systems": "Sistemas de design digital",
  "Interactive Web Experiences": "Experiências web interactivas",
  "Portfolio": "Portefólio",
  "Start": "Iniciar",
  "Back to portfolio": "Voltar ao portefólio",
  "Next project": "Projecto seguinte",
  "Previous project": "Projecto anterior",
  "Related work": "Trabalho relacionado",
  "Project overview": "Visão geral do projecto",
  "The brief": "O briefing",
  "The approach": "A abordagem",
  "The outcome": "O resultado",
  "Client": "Cliente",
  "Role": "Função",
  "Year": "Ano",
  "Services delivered": "Serviços prestados",
  "View case study": "Ver estudo de caso",
  "View project": "Ver projecto",
  "Close": "Fechar",
  "Menu": "Menu",
  "Open menu": "Abrir menu",
  "Close menu": "Fechar menu",
};

export function translateSiteText(value: string, locale: SiteLocale): string {
  if (locale !== "pt-PT") return value;
  return PT_TRANSLATIONS[value] ?? value;
}

export function getSiteLocale(): SiteLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "pt-PT" ? "pt-PT" : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

export function setSiteLocale(locale: SiteLocale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Persistence is best effort.
  }
  document.documentElement.lang = locale;
  window.dispatchEvent(new CustomEvent("ek-locale-change", { detail: locale }));
  for (const listener of listeners) listener(locale);
}

function rememberText(node: Text, currentCore: string, locale: SiteLocale): string {
  const remembered = originalText.get(node);
  if (remembered === undefined) {
    originalText.set(node, currentCore);
    return currentCore;
  }
  const previouslyRendered = translateSiteText(remembered, locale);
  if (currentCore !== remembered && currentCore !== previouslyRendered) {
    originalText.set(node, currentCore);
    return currentCore;
  }
  return remembered;
}

function rememberAttribute(element: HTMLElement, attribute: string, currentValue: string, locale: SiteLocale): string {
  let attributes = originalAttributes.get(element);
  if (!attributes) {
    attributes = new Map();
    originalAttributes.set(element, attributes);
  }
  const remembered = attributes.get(attribute);
  if (remembered === undefined) {
    attributes.set(attribute, currentValue);
    return currentValue;
  }
  const previouslyRendered = translateSiteText(remembered, locale);
  if (currentValue !== remembered && currentValue !== previouslyRendered) {
    attributes.set(attribute, currentValue);
    return currentValue;
  }
  return remembered;
}

function translateDom(locale: SiteLocale): void {
  if (typeof document === "undefined") return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) textNodes.push(node as Text);
  }

  for (const textNode of textNodes) {
    const raw = textNode.textContent ?? "";
    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const trailing = raw.match(/\s*$/)?.[0] ?? "";
    const core = raw.trim();
    const base = rememberText(textNode, core, locale);
    const translated = translateSiteText(base, locale);
    if (translated !== core) textNode.textContent = `${leading}${translated}${trailing}`;
  }

  for (const selector of ["[aria-label]", "[placeholder]", "[title]"]) {
    document.querySelectorAll<HTMLElement>(selector).forEach((element) => {
      for (const attribute of ["aria-label", "placeholder", "title"]) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const base = rememberAttribute(element, attribute, value, locale);
        const translated = translateSiteText(base, locale);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    });
  }
}

export function installSiteLocaleDomBridge(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};
  let scheduled = false;
  const apply = () => {
    scheduled = false;
    translateDom(getSiteLocale());
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(apply);
  };
  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["aria-label", "placeholder", "title"] });
  schedule();
  const onLocaleChange = () => schedule();
  window.addEventListener("ek-locale-change", onLocaleChange);
  return () => {
    observer.disconnect();
    window.removeEventListener("ek-locale-change", onLocaleChange);
  };
}

export function subscribeSiteLocale(listener: (locale: SiteLocale) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteLocale(): SiteLocale {
  const [locale, setLocale] = useState<SiteLocale>(getSiteLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    return subscribeSiteLocale(setLocale);
  }, [locale]);
  return locale;
}
