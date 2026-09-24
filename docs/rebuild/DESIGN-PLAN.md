# DESIGN PLAN — Fase 3 / Betão & Cor

## 1. Mandato

A Fase 3 fixa a linguagem visual e a infraestrutura que as páginas públicas vão herdar. Nesta fase, nenhuma página pública é redesenhada. O único surface aplicado é /admin/design-system, autenticado, para provar os tokens e os primitivos antes da Fase 4.

O conceito é Betão & Cor: a interface é betão — neutra, silenciosa e precisa — enquanto o trabalho é a cor. A cor nunca é decoração fixa; aparece como estado contextual do trabalho em foco.

## 2. Cor

| Token | Valor | Função |
|---|---|---|
| Betão | #D6D4CE | fundo claro neutro |
| Cal | #F2F2EF | superfícies claras e formulários |
| Preto | #000000 | texto claro e superfícies escuras |
| Chapa | #3F3E3B | texto secundário sobre claro |
| Fumo | #B9B7B0 | texto secundário sobre preto |
| Cor do Trabalho | #2F4BFF | fallback; dinamizada por projeto |
| Live | #4ADE80 | semântica de disponibilidade/online |

Os tons de secção são expressos por data-tone: preto, betao, cal e cor. O fundo cor usa --work-dark, calculado a partir da cor de trabalho com redução de luminosidade em OKLab equivalente ao alvo OKLCH L − 0.18.

O cálculo de foreground é baseado em contraste WCAG, não em escolha manual. --work-fg é escolhido entre Preto e Cal pela maior razão de contraste.

## 3. Tipografia

Cartaz: Archivo Variable. O papel é headline, navegação e UI, usando largura variável quando a aplicação pública passar a consumir os tokens.

Livro: Newsreader Variable. O papel é narrativa, biografia, manifesto, citações e corpo de case studies. O itálico usado no sistema vem do ficheiro de itálico real da família; não se sintetiza oblíquo.

Não há mono no novo sistema visual. Micro-labels e eyebrows em caps deixam de ser primitivo. O mínimo de texto pequeno do sistema é 14px.

## 4. Layout

A composição futura é de cartaz, não de dashboard nem de jornal:

- grelha de 12 colunas no desktop e 4 no mobile;
- títulos podem atravessar colunas e aproximar-se da margem;
- imagens em proporção nativa;
- superfícies planas, sem contentores arredondados como padrão;
- raios 0 nos painéis e imagens;
- controlos com bordo de 2px e raio 0;
- sem sombras cinzentas genéricas, gradientes decorativos ou brilhos radiais.

O atalho G mostra a grelha apenas em desktop como ferramenta de craft. A camada não recebe pointer events e não altera a interação.

## 5. Motion

A curva de assinatura é cubic-bezier(0.16, 1, 0.3, 1).

As durações são 180ms, 380ms e 720ms. O objetivo não é animar todas as entradas: movimento deve responder a uma ação ou ser o momento de assinatura.

Na Fase 3, a infraestrutura é preparada para View Transitions e para a Cor do Trabalho. A aplicação pública acontece apenas nas fases de casca/página previstas no plano.

prefers-reduced-motion remove movimento decorativo e deixa a informação estável.

## 6. Primitivos

O showcase comprova estes primitivos:

Button, Link, Tag, Field, Stepper, Accordion, Dialog, Sheet, Toast, Section, Headline, Stat, WorkCard, ClientWall, Marquee e MetaRow.

Os primitivos da Fase 3 vivem em src/components/design-system/ para evitar regressão dos componentes públicos existentes. Radix fornece semântica/focus management para toggles, accordion e dialog; CVA define variantes; tailwind-merge resolve composição de classes.

## 7. Headline e D-01

O Headline recebe o texto uma vez.

O texto acessível vive em aria-label. A camada visual é aria-hidden e aplica a ênfase como um span sobre o mesmo texto. Não existe segundo render do conteúdo completo.

Isto remove estruturalmente o padrão que gerava títulos duplicados na Home e em Credentials.

## 8. Cor do Trabalho e dados

A migration da Fase 3 é deliberadamente aditiva:

public.projects.dominant_color
public.projects.accent_color

Ambas são nullable. A Fase 3 não cria reel_items; o Reel é propriedade de schema e paridade da Fase 6.

O backfill é uma ferramenta local e independente do runtime. Recebe um manifesto local de imagens e produz um manifesto de cores. Não escreve na BD e não é executado em Vercel. sharp não foi adicionado ao runtime da aplicação.

Como o backup reversível da Fase 1 continua não confirmado, a migration foi commitada mas não aplicada à produção.

## 9. Wireframes de referência

### Home

    ┌──────────────────────────────────────────────────────────────┐
    │ EK.            nav links                         Start project│
    ├──────────────────────────────────────────────────────────────┤
    │                                                              │
    │ I SHAPE IDEAS THAT CUT THROUGH NOISE...                      │
    │                                                              │
    │                [ assinatura / work colour ]                  │
    │                                                              │
    ├──────────────────────────────────────────────────────────────┤
    │                6–8 trabalhos em composição assimétrica       │
    ├──────────────────────────────────────────────────────────────┤
    │ SERVICES                                                     │
    │ identidade visual                                            │
    │ direção de arte                                               │
    │ editorial & print                                             │
    │ design digital                                                │
    ├──────────────────────────────────────────────────────────────┤
    │ métricas · ClientWall · cargo actual                         │
    ├──────────────────────────────────────────────────────────────┤
    │ REFERENCE                                                    │
    ├──────────────────────────────────────────────────────────────┤
    │ Tell me what you're building.                    Start project│
    └──────────────────────────────────────────────────────────────┘

### Portfolio

    ┌──────────────────────────────────────────────────────────────┐
    │ Selected Work.                                106 of 106     │
    ├──────────────────────────────────────────────────────────────┤
    │ [Social Media] [Ad Campaigns] [Digital Design] [Year] [Q]  │
    ├───────────────────────────────┬──────────────────────────────┤
    │ artwork                       │ artwork                      │
    │                               │                              │
    │ artwork                       │ artwork                      │
    └───────────────────────────────┴──────────────────────────────┘
                         ↑
                 work colour on focus

### Services

    ┌──────────────────────────────────────────────────────────────┐
    │ Visual capabilities & disciplines.                           │
    ├──────────────────────────────────────────────────────────────┤
    │ IDENTIDADE VISUAL                                      +     │
    ├──────────────────────────────────────────────────────────────┤
    │ DIREÇÃO DE ARTE                                         +    │
    ├──────────────────────────────────────────────────────────────┤
    │ EDITORIAL & PRINT                                       +    │
    ├──────────────────────────────────────────────────────────────┤
    │ DESIGN DIGITAL                                          +    │
    ├──────────────────────────────────────────────────────────────┤
    │ How the studio works: Diagnose → System → Direction → Ship │
    └──────────────────────────────────────────────────────────────┘

### Contact

    ┌──────────────────────────────────────────────────────────────┐
    │ Let's collaborate.                                           │
    ├───────────────────────────────┬──────────────────────────────┤
    │ Direct channels               │ 01 Identity                  │
    │ WhatsApp                      │ 02 Project                   │
    │ Email                         │ 03 Budget                    │
    │ 30-minute call                │ 04 Timing                    │
    │                               │ 05 References                │
    │                               │                              │
    │                               │ [form on Cal surface]        │
    └───────────────────────────────┴──────────────────────────────┘

## 10. Revisão anti-template

### Cliché 1 — fundo creme quente + serifa de alto contraste + terracota

Rejeitado. Betão não é creme quente. Newsreader existe apenas no papel de livro/narrativa; Archivo sustenta o cartaz. Não há terracota fixa. A cor forte pertence ao trabalho.

### Cliché 2 — fundo quase-preto + um único acento verde-ácido ou vermilion

Rejeitado. Preto é um dos tons e pode ocupar uma secção, mas não é o site inteiro. A cor de destaque é dinâmica e derivada do conteúdo do trabalho, com fallback cobalto. Verde existe apenas como semântica live.

### Cliché 3 — layout de jornal com filetes finos e raio zero em tudo

Rejeitado por estrutura. O raio zero é mantido onde melhora precisão, mas a composição não é editorial de jornal: é cartaz, billboard, grelha de 12 colunas e contraste de escala. Bordos de controlos têm 2px, não hairlines.

### Cliché 4 — kit SaaS de cartões arredondados, sombras e gradientes

Rejeitado. Não há contentor arredondado por defeito, sombra padrão ou gradiente decorativo. WorkCard, Stat e ClientWall são superfícies de estrutura, não cards SaaS.

### Cliché 5 — chrome de template

Rejeitado. Não se criou mono para dados, eyebrows caps para cada secção, meta com pontos médios, etiquetas PALAVRA — fragmento ou setas em todos os botões. O sistema usa sentence case e texto com pelo menos 14px.

## 11. Regra de segurança

A Fase 3 não altera a composição pública, não publica valores de conteúdo e não executa migrations em produção enquanto o backup reversível anterior não estiver confirmado. Tudo o que foi adicionado pode ser removido por ficheiros de rollback e commits reversíveis.

## 12. Saída esperada desta fase

O contrato visual está implementado e testável num surface autenticado. As páginas públicas permanecem intocadas e continuam a usar os tokens antigos até à Fase 4.