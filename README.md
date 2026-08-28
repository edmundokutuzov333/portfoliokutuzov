# Edmundo Kutuzov - Site

Crie do zero um site portfolio premium para EDMUNDO, designer gráfico / art director, usando obrigatoriamente React + Vite + TypeScript + Tailwind CSS. Não use Next.js, não use App Router, não use SSR. O projeto deve ser uma SPA com react-router-dom.

Quero um site autoral, animado, escuro, futurista, editorial e experimental, mas profissional. Não quero aparência genérica de Lovable: nada de hero comum com card à direita, nada de gradientes roxos genéricos, nada de “featured projects” na home, nada de blocos SaaS. O site deve parecer feito sob medida para um designer visual.

Páginas obrigatórias:
1. Home: apresentação, logos de clientes, manifesto visual, serviços, CTA.
2. Portfolio: grid completo de trabalhos, filtros por categoria, página visualmente rica.
3. Sobre: biografia, método, estatísticas, valores.
4. Contato: formulário visual, email, redes sociais.

Instale/Use:
- react-router-dom
- framer-motion
- lucide-react
- clsx

Arquitetura:
src/
  main.tsx
  App.tsx
  index.css
  data/clients.ts
  data/projects.ts
  components/layout/Navbar.tsx
  components/layout/Footer.tsx
  components/visual/InteractiveBackground.tsx
  components/visual/ClickRipples.tsx
  components/visual/NoiseLayer.tsx
  components/home/Hero.tsx
  components/home/ClientLogos.tsx
  components/home/Manifesto.tsx
  components/home/Services.tsx
  components/home/HomeCTA.tsx
  components/portfolio/PortfolioGrid.tsx
  pages/Home.tsx
  pages/Portfolio.tsx
  pages/About.tsx
  pages/Contact.tsx

Identidade visual:
- Fundo base: #030308
- Superfícies: #080812, #0D0D18
- Texto principal: #F4F1FF
- Texto secundário: #8F8A9E
- Texto fantasma: #464254
- Acents: ciano #22D3EE, violeta #8B5CF6, verde ácido #C6FF00, magenta #FF3DF2
- Bordas: rgba(255,255,255,0.08)
- O site deve usar muito espaço negativo, linhas finas, microtextos técnicos e composição editorial.
- Usar fonte via Google Fonts: Space Grotesk para títulos e Inter para textos. Importar no index.css.

Fundo interativo obrigatório:
Crie um componente InteractiveBackground que:
- Fique fixed, inset-0, pointer-events-none, atrás de todo o conteúdo.
- Escute mousemove e atualize CSS variables --mouse-x e --mouse-y.
- Renderize uma luz radial que acompanha o mouse.
- Renderize uma segunda aura atrasada com requestAnimationFrame para parecer fluida.
- Ao clicar, criar ripples/partículas no ponto do clique por 900ms.
- Usar mix-blend-screen, blur, radial-gradient e opacity baixa.
- O fundo deve reagir ao movimento, sem afetar performance.

Código base para InteractiveBackground.tsx:

import { useEffect, useRef, useState } from "react";

type Ripple = { id: number; x: number; y: number };

export function InteractiveBackground() {
  const layerRef = useRef(null);
  const aura = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    let raf = 0;

    const move = (event: PointerEvent) => {
      target.current = { x: event.clientX, y: event.clientY };
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    };

    const click = (event: PointerEvent) => {
      const id = Date.now();
      setRipples((items) => [...items, { id, x: event.clientX, y: event.clientY }]);
      window.setTimeout(() => {
        setRipples((items) => items.filter((item) => item.id !== id));
      }, 900);
    };

    const tick = () => {
      aura.current.x += (target.current.x - aura.current.x) * 0.08;
      aura.current.y += (target.current.y - aura.current.y) * 0.08;
      if (layerRef.current) {
        layerRef.current.style.setProperty("--aura-x", `${aura.current.x}px`);
        layerRef.current.style.setProperty("--aura-y", `${aura.current.y}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerdown", click);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    


      {ripples.map((ripple) => (
        
      ))}
    


  );
}

CSS obrigatório no index.css:

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap");

:root {
  --mouse-x: 50vw;
  --mouse-y: 50vh;
  --aura-x: 50vw;
  --aura-y: 50vh;
}

html {
  scroll-behavior: smooth;
  background: #030308;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #030308;
  color: #f4f1ff;
  font-family: Inter, system-ui, sans-serif;
}

h1, h2, h3, .display {
  font-family: "Space Grotesk", Inter, sans-serif;
  letter-spacing: 0;
}

.interactive-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(680px circle at var(--mouse-x) var(--mouse-y), rgba(34,211,238,0.13), transparent 42%),
    radial-gradient(760px circle at var(--aura-x) var(--aura-y), rgba(255,61,242,0.10), transparent 48%),
    radial-gradient(900px circle at 78% 12%, rgba(139,92,246,0.16), transparent 50%),
    linear-gradient(180deg, #030308 0%, #050510 48%, #030308 100%);
}

.interactive-bg::before {
  content: "";
  position: absolute;
  inset: -20%;
  opacity: 0.12;
  background-image:
    linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(circle at center, black, transparent 72%);
}

.interactive-bg::after {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.045;
  background-image: radial-gradient(circle, rgba(255,255,255,0.8) 0 1px, transparent 1px);
  background-size: 4px 4px;
  mix-blend-mode: screen;
}

.click-ripple {
  position: fixed;
  width: 18px;
  height: 18px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  border: 1px solid rgba(198,255,0,0.65);
  box-shadow: 0 0 40px rgba(34,211,238,0.35);
  animation: ripple-expand 900ms ease-out forwards;
}

@keyframes ripple-expand {
  0% { opacity: 0.9; width: 18px; height: 18px; }
  100% { opacity: 0; width: 420px; height: 420px; }
}

.text-metal {
  background: linear-gradient(180deg, #ffffff 0%, #d8d2ef 42%, #6f687f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.text-acid {
  background: linear-gradient(90deg, #c6ff00, #22d3ee, #ff3df2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

Layout global:
- Todo conteúdo deve ficar acima do fundo com relative z-10.
- Usar container max-w-[1240px] mx-auto px-5 md:px-8.
- Navbar fixa no topo, centralizada, glassmorphism escuro, sem parecer template:
  links: Home, Portfolio, Sobre, Contato.
  à esquerda pequeno monograma “ED.”
  à direita botão “Iniciar projeto”.
- Navbar deve ter borda fina, blur, altura compacta e estados ativos.

Home:
Hero:
- Não copiar a referência literalmente. Criar algo mais autoral.
- Fullscreen com composição assimétrica.
- H1 enorme:
  “Design systems for brands that refuse to look ordinary.”
- Abaixo, versão PT:
  “Identidades visuais, direção de arte e experiências digitais para marcas que querem ser lembradas.”
- Incluir microcopy técnica:
  “BRAND IDENTITY / EDITORIAL SYSTEMS / DIGITAL ART DIRECTION”
- Botões:
  “Ver portfolio” com ArrowUpRight
  “Enviar briefing” com Send
- Incluir um bloco lateral pequeno chamado “CURRENT STATUS” com:
  “Available for selected projects”
  “Maputo · São Paulo · Remote”
  “2026”
- O hero deve ter linhas finas, números pequenos, coordenadas falsas e elementos editoriais, não cards genéricos.

Seção Clientes na Home:
- Esta seção deve aparecer logo depois do hero.
- Título pequeno: “CLIENTES & COLABORAÇÕES”
- Texto: “Algumas marcas, equipas e projetos que já passaram pelo meu processo visual.”
- Grid de logos 3x4 desktop, 2 colunas mobile.
- Como ainda não tenho os logos reais, criar placeholders elegantes em texto, fáceis de substituir.
- Os logos devem ser monocromáticos, cinza claro, com hover em branco/ciano.
- Nomes placeholder:
  “NOVA”, “KORA”, “ALMA”, “VOLT”, “NEXUS”, “AURORA”, “MINT”, “ORBIT”, “LUME”, “ATLAS”, “NOIR”, “BRAVA”.
- Cada logo deve parecer marca real usando tipografia diferente via CSS: uppercase, letter spacing moderado, linhas, símbolos simples.
- Não usar quadrados genéricos. Cada item deve parecer uma placa de identidade visual.

Manifesto:
- Título grande:
  “A marca não precisa gritar. Ela precisa ficar na memória.”
- Texto em duas colunas sobre estratégia, forma, contraste, ritmo, tipografia e sistemas visuais.
- Incluir uma linha horizontal animada que cresce ao entrar na viewport.

Serviços:
- Criar 4 blocos horizontais, não cards comuns:
  01 Identidade Visual
  02 Direção de Arte
  03 Editorial & Print
  04 Design Digital
- Cada bloco ocupa largura total, com número pequeno, título grande, descrição curta e ícone Lucide.
- Hover muda o fundo com radial gradient próximo ao mouse.

CTA Home:
- Bloco grande, escuro, com borda fina:
  “Vamos desenhar uma presença visual impossível de ignorar.”
- Botão: “Começar conversa”

Portfolio:
- Página própria em /portfolio.
- Header da página:
  “Portfolio”
  “Selected visual systems, campaigns and editorial experiments.”
- Filtros: Todos, Branding, Editorial, Digital, Campaign, Experimental.
- Grid masonry controlado com 8 projetos, não apenas 4.
- Projetos:
  01 NEXUS / Identity System / Branding / 2026
  02 AURORA / Editorial Series / Editorial / 2025
  03 VOLT / Campaign Language / Campaign / 2025
  04 CHRONOS / Poster System / Experimental / 2024
  05 LUME / Digital Launch / Digital / 2026
  06 NOIR / Visual Identity / Branding / 2024
  07 ATLAS / Brand Architecture / Branding / 2025
  08 BRAVA / Social Campaign / Campaign / 2026
- Cada projeto deve ter visual próprio em CSS, com gradientes, overlays, textura, formas e tipografia.
- Ao clicar no card, abrir modal detalhado com imagem grande abstrata, descrição, categoria, ano e botão “Solicitar projeto semelhante”.
- Não precisa página individual para cada projeto, modal basta.

Sobre:
- Layout editorial.
- Título: “Entre precisão estratégica e acidente visual controlado.”
- Texto sobre Edmundo como designer gráfico/art director.
- Estatísticas:
  08 anos de experiência
  120+ projetos
  16 setores
  03 continentes
- Seção método:
  01 Diagnóstico
  02 Sistema
  03 Direção
  04 Entrega

Contato:
- Formulário com campos:
  Nome, Email, Tipo de projeto, Orçamento estimado, Mensagem.
- Não precisa backend; ao enviar, mostrar estado visual “Mensagem preparada”.
- Botão mailto com assunto preenchido.
- Incluir email: edmundo@studio.com
- Redes: Instagram, Behance, Dribbble, LinkedIn.

Regras de qualidade:
- Componentes pequenos e reutilizáveis.
- Dados de clientes e projetos devem ficar em arquivos separados.
- Usar TypeScript com types explícitos.
- Usar Framer Motion para reveal on scroll, stagger, hover e modal.
- Usar prefers-reduced-motion para reduzir animações se necessário.
- Todos os botões devem ter foco acessível.
- Não usar lorem ipsum.
- Não usar imagens stock.
- Não usar emojis.
- Não criar elementos com aparência infantil.
- Garantir responsividade real em mobile.
- Garantir contraste legível.
- O resultado deve ser publicável.

Exemplo de dados para clients.ts:

export const clients = [
  "NOVA", "KORA", "ALMA", "VOLT", "NEXUS", "AURORA",
  "MINT", "ORBIT", "LUME", "ATLAS", "NOIR", "BRAVA"
];

Exemplo de type para projects.ts:

export type ProjectCategory = "Branding" | "Editorial" | "Digital" | "Campaign" | "Experimental";

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  year: string;
  description: string;
  palette: string;
};

export const projects: Project[] = [
  {
    id: 1,
    title: "NEXUS",
    subtitle: "Identity System",
    category: "Branding",
    year: "2026",
    palette: "from-fuchsia-500 via-violet-700 to-cyan-900",
    description: "Sistema de identidade visual para uma marca tecnológica com linguagem modular, tipografia proprietária e aplicações digitais."
  },
  {
    id: 2,
    title: "AURORA",
    subtitle: "Editorial Series",
    category: "Editorial",
    year: "2025",
    palette: "from-blue-400 via-slate-800 to-emerald-950",
    description: "Série editorial com grelhas rígidas, fotografia tratada e ritmo tipográfico de alto contraste."
  },
  {
    id: 3,
    title: "VOLT",
    subtitle: "Campaign Language",
    category: "Campaign",
    year: "2025",
    palette: "from-lime-300 via-cyan-700 to-purple-950",
    description: "Direção visual para campanha com energia cromática, motion language e peças para social-first rollout."
  }
];

Entregue o site completo, funcional e bonito. Priorize acabamento visual, interações suaves, código limpo e uma estética memorável.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://portfoliokutuzov.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/42b99eb3-a083-4211-87df-e3780ebbfa7f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
