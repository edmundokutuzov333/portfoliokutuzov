import { getSiteLocale } from "@/lib/site-locale";

type TranslationMap = Record<string, string>;

/**
 * Second-pass Portuguese coverage for legacy/static UI copy that is rendered
 * outside the primary translation catalogue. English remains the source
 * locale: this bridge is a no-op unless pt-PT is active.
 */
const PT_COMPLETION: TranslationMap = {
  // Credentials / positioning
  "Art Director & Content Creator": "Director de arte e criador de conteúdo",
  "Art Director": "Director de arte",
  "Graphic Designer": "Designer gráfico",
  "Marketing Assistant & Social Media Manager": "Assistente de marketing e gestor de redes sociais",
  "Core Disciplines": "Disciplinas centrais",
  "Digital & Motion": "Digital e motion",
  "Print & Special Projects": "Impressão e projectos especiais",
  "Brand Identity Systems": "Sistemas de identidade de marca",
  "Visual Hierarchy & Typography": "Hierarquia visual e tipografia",
  "Motion Design & Key Art": "Motion design e key art",
  "UI/UX Design Systems": "Sistemas de design UI/UX",
  "Audiovisual Storytelling": "Storytelling audiovisual",
  "Editorial & Publications": "Editorial e publicações",
  "Large-Format OOH Billboards": "Outdoors OOH de grande formato",
  "Packaging & Print Prep": "Packaging e preparação para impressão",
  "Music Video & Single Rollouts": "Videoclipes e lançamentos de singles",
  "Streetwear Curation": "Curadoria de streetwear",
  "Skill Taxonomy": "Mapa de competências",
  "Scope of Competencies": "Âmbito de competências",
  "Proven Track Record": "Percurso comprovado",
  "Selected Collaborations": "Colaborações seleccionadas",
  "Edmundo Kutuzov · Art Director": "Edmundo Kutuzov · Director de arte",
  "Contact & Studio": "Contacto e estúdio",
  "Direct Contact & Studio": "Contacto directo e estúdio",
  "Career History": "Percurso profissional",
  "Professional Experience": "Experiência profissional",
  "Chronological track record of agency and studio leadership across Mozambique.": "Percurso cronológico de liderança em agências e estúdios em Moçambique.",
  "Directing visual communication & strategy": "Direcção de comunicação visual e estratégia",
  "Delivered across brand, digital & print": "Entregues em branding, digital e impressão",
  "National and international collaborations": "Colaborações nacionais e internacionais",
  "Global creative exposure & delivery": "Experiência e entrega criativa global",
  "From high-level strategy to craft execution": "Da estratégia de alto nível à execução de detalhe",
  "Brand Identity Systems": "Sistemas de identidade de marca",

  // Services
  "Visual capabilities &": "Capacidades visuais e",
  "Core Disciplines & Capabilities": "Disciplinas centrais e capacidades",
  "Interactive Architecture": "Arquitectura interactiva",
  "Portfolio Reference": "Referência do portefólio",
  "View Case": "Ver projecto",
  "Tactile publications, large-format OOH & packaging design": "Publicações tácteis, OOH de grande formato e design de packaging",
  "Social-first content engines, motion assets & digital systems": "Sistemas de conteúdo social-first, motion assets e sistemas digitais",
  "Identity Visual": "Identidade visual",
  "View all projects": "Ver todos os projectos",
  "Featured Work": "Trabalho em destaque",
  "Recent Work": "Trabalho recente",

  // Contact / briefing experience
  "Project Briefing Experience": "Experiência de briefing de projecto",
  "Open for 2026 Collaborations": "Aberto a colaborações em 2026",
  "Let's collaborate.": "Vamos colaborar.",
  "Direct Channels": "Canais directos",
  "WhatsApp Direct": "WhatsApp directo",
  Immediate: "Imediato",
  "Quick voice or chat exchange": "Conversa rápida por voz ou chat",
  "Open Chat": "Abrir conversa",
  "Formal Email": "Email formal",
  Compose: "Redigir",
  "Schedule 30-Min Call": "Marcar chamada de 30 min",
  Discovery: "Descoberta",
  "Pick a calendar slot": "Escolha um horário no calendário",
  Book: "Marcar",
  "Brief Submitted Successfully": "Briefing enviado com sucesso",
  "What happens next:": "O que acontece agora:",
  "Review (24-48h):": "Análise (24-48h):",
  "Discovery Response:": "Resposta inicial:",
  "Book a follow-up call": "Marcar chamada de acompanhamento",
  "Chat on WhatsApp": "Falar pelo WhatsApp",
  "Submit another project brief": "Enviar outro briefing de projecto",
  "Your Name": "O seu nome",
  "Primary contact": "Contacto principal",
  "Email Address": "Endereço de email",
  "Where I'll reply": "Onde responderei",
  "Company / Brand": "Empresa / marca",
  "Role / Title": "Função / cargo",
  "Country / City": "País / cidade",
  "Project Discipline": "Área do projecto",
  "Select main focus": "Seleccione o foco principal",
  "Project Urgency": "Urgência do projecto",
  "Rollout timeline pressure": "Pressão sobre o prazo de lançamento",
  "Continue to Project": "Continuar para o projecto",
  "Continue to Budget": "Continuar para o orçamento",
  "Continue to Timing": "Continuar para o prazo",
  "Continue to References": "Continuar para as referências",
  "Send Project Brief": "Enviar briefing do projecto",
  "What are we creating together?": "O que vamos criar em conjunto?",
  "Select the discipline, creative focus and urgency level for the rollout.": "Seleccione a área, o foco criativo e o nível de urgência do projecto.",
  "What's the scale you're working with?": "Qual é a dimensão do projecto?",
  "Establishing scale ensures we align scope, production depth and craft velocity.": "Definir a dimensão do projecto permite alinhar âmbito, profundidade de produção e ritmo de execução.",
  "When does this need to happen?": "Quando precisa de acontecer?",
  "Key delivery milestones and your preferred communication channel.": "Principais marcos de entrega e canal de comunicação preferido.",
  "Share anything that helps define the direction.": "Partilhe tudo o que ajude a definir a direcção.",
  "Describe the vision, upload brand assets or drop links to moodboards.": "Descreva a visão, carregue materiais da marca ou adicione ligações para moodboards.",
  "Let's start with the basics so I know who is leading this initiative.": "Comecemos pelo essencial para perceber quem lidera esta iniciativa.",
  "Tell me who you are and what you're building.": "Diga-me quem é e o que está a construir.",
  "Your full name is required": "O seu nome completo é obrigatório",
  "Your email address is required": "O seu endereço de email é obrigatório",
  "Please enter a valid email address (e.g. name@company.com)": "Introduza um endereço de email válido (por exemplo, nome@empresa.com)",
  "Please select a project discipline": "Seleccione uma área para o projecto",
  "Please share a few more details about your project goals (at least 10 characters)": "Partilhe mais alguns detalhes sobre os objectivos do projecto (pelo menos 10 caracteres)",
  "Please complete the required fields to continue": "Preencha os campos obrigatórios para continuar",
  "Enter a valid URL (https://...)": "Introduza um URL válido (https://...)",
  "Please provide a description of your project before sending": "Descreva o seu projecto antes de o enviar",
  "Please check the highlighted fields": "Verifique os campos assinalados",
  "Attachments uploaded successfully": "Anexos carregados com sucesso",
  "is not an image file": "não é um ficheiro de imagem",
  "exceeds 8 MB limit": "excede o limite de 8 MB",
  "Submission failed": "O envio falhou",
  "Your data is preserved.": "Os seus dados foram preservados.",
  "Brief received. I'll be in touch within 48h.": "Briefing recebido. Entrarei em contacto no prazo de 48 horas.",
  "Network error. Please try again.": "Erro de rede. Tente novamente.",
  "Maximum 5 reference files allowed": "É permitido um máximo de 5 ficheiros de referência",

  // General UI / accessibility / recovery
  "Lost in": "Perdido na",
  "the grid.": "grelha.",
  "The page you are looking for has left the system. It might have been moved, renamed, or never existed in the first place.": "A página que procura já não está neste sistema. Pode ter sido movida, renomeada ou pode nunca ter existido.",
  "Return to surface": "Voltar ao início",
  "Skip to content": "Saltar para o conteúdo",
  "Error 404": "Erro 404",
  "Preview render failed.": "A apresentação da pré-visualização falhou.",
  "A fallback screen was shown instead of a blank page.": "Foi apresentada uma página de recuperação em vez de um ecrã vazio.",
  "Reload preview": "Recarregar pré-visualização",
  "Reset state": "Repor estado",
  "Design is not just what it looks like and feels like. Design is how it works.": "O design não é apenas aquilo que se vê e se sente. É a forma como funciona.",
  "Available for 2026": "Disponível em 2026",
  "Open for 2026 projects": "Aberto a projectos em 2026",

  // AI assistant UI
  "Assistant Speaking (Interrupt anytime)": "Assistente a falar (interrompa quando quiser)",
  "Listening to you in English / Português...": "A ouvir o que diz...",
  "Processing your voice thought...": "A processar o que disse...",
  "Interrupted · Listening...": "Interrompido · A ouvir...",
  "Connecting voice session...": "A ligar à sessão de voz...",
  "Go to Contact & Brief": "Ir para Contacto e briefing",
  "View Full Portfolio": "Ver portefólio completo",
  "Português (Portugal) · Inglês": "Português · Inglês",
  "English · European Portuguese": "Inglês · Português europeu",
  "English / Português": "português",
};

const PT_COMPLETION_ENTRIES = Object.entries(PT_COMPLETION).sort(
  ([a], [b]) => b.length - a.length,
);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceStandalone(value: string, source: string, target: string): string {
  if (!source || !value.includes(source)) return value;
  if (/^\p{L}[\p{L}\p{N}'’ -]*$/u.test(source)) {
    const pattern = new RegExp(
      `(^|[^\\p{L}\\p{N}])${escapeRegExp(source)}(?=$|[^\\p{L}\\p{N}])`,
      "gu",
    );
    return value.replace(pattern, `$1${target}`);
  }
  return value.split(source).join(target);
}

function translateCompletion(value: string): string {
  const exact = PT_COMPLETION[value];
  if (exact) return exact;
  return PT_COMPLETION_ENTRIES.reduce(
    (current, [source, target]) => replaceStandalone(current, source, target),
    value,
  );
}

function translateDynamic(value: string): string {
  const translated = translateCompletion(value);
  if (translated !== value) return translated;

  let next = value;
  next = next.replace(/^STEP\s+(\d+)\s+OF\s+(\d+)$/i, "PASSO $1 DE $2");
  next = next.replace(/^(\d+)%\s+Complete$/i, "$1% concluído");
  next = next.replace(/^Maximum\s+(\d+)\s+reference files allowed$/i, "É permitido um máximo de $1 ficheiros de referência");
  next = next.replace(/^(.*?)\s+exceeds\s+8 MB limit$/i, "$1 excede o limite de 8 MB");
  next = next.replace(/^Brief received,\s+(.+)\.$/i, "Briefing recebido, $1.");
  next = next.replace(/^Submission failed:\s*(.+?)\.\s*Your data is preserved\.$/i, "O envio falhou: $1. Os seus dados foram preservados.");
  return next;
}

const originalAttributes = new WeakMap<HTMLElement, Map<string, string>>();
const originalText = new WeakMap<Text, string>();

function rememberAttribute(element: HTMLElement, attribute: string, value: string): string {
  let attributes = originalAttributes.get(element);
  if (!attributes) {
    attributes = new Map();
    originalAttributes.set(element, attributes);
  }
  const remembered = attributes.get(attribute);
  if (remembered === undefined) {
    attributes.set(attribute, value);
    return value;
  }
  const previouslyRendered = translateDynamic(remembered);
  if (value !== remembered && value !== previouslyRendered) {
    attributes.set(attribute, value);
    return value;
  }
  return remembered;
}

function rememberText(node: Text, value: string): string {
  const remembered = originalText.get(node);
  if (remembered === undefined) {
    originalText.set(node, value);
    return value;
  }
  const previouslyRendered = translateDynamic(remembered);
  if (value !== remembered && value !== previouslyRendered) {
    originalText.set(node, value);
    return value;
  }
  return remembered;
}

function applyPortugueseCompletion(): void {
  if (typeof document === "undefined" || getSiteLocale() !== "pt-PT") return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    const textNode = node as Text;
    const raw = textNode.textContent;
    const leading = raw.match(/^\s*/)?.[0] ?? "";
    const trailing = raw.match(/\s*$/)?.[0] ?? "";
    const base = rememberText(textNode, raw.trim());
    const translated = translateDynamic(base);
    const next = `${leading}${translated}${trailing}`;
    if (next !== raw) textNode.textContent = next;
  }

  document.querySelectorAll<HTMLElement>("[aria-label], [placeholder], [title]").forEach((element) => {
    for (const attribute of ["aria-label", "placeholder", "title"] as const) {
      const value = element.getAttribute(attribute);
      if (!value) continue;
      const base = rememberAttribute(element, attribute, value);
      const translated = translateDynamic(base);
      if (translated !== value) element.setAttribute(attribute, translated);
    }
  });
}

export function installPortugueseCompletionBridge(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      applyPortugueseCompletion();
    });
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-label", "placeholder", "title"],
  });

  const onLocaleChange = schedule;
  window.addEventListener("ek-locale-change", onLocaleChange);
  schedule();

  return () => {
    observer.disconnect();
    window.removeEventListener("ek-locale-change", onLocaleChange);
  };
}
