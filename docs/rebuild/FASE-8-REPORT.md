# Relatório — Fase 8: Case Study (/portfolio/:slug)

## Resumo

A Fase 8 foi executada em awwwards-rebuild sobre o motor de case study já existente no branch, consolidando-o em vez de criar um segundo modelo paralelo.

O route /portfolio/:slug agora entrega um template modular guiado por dados reais, com fallback determinístico para cases sem conteúdo editorial, Work Colour com contraste calculado, morph via View Transition, gallery com lightbox modal, related/previous/next, partilha, PDF Node e OG dinâmica.

Nenhuma row do Supabase e nenhum objecto de Storage foi criado, actualizado ou eliminado.

## Commit(s) / tag

Principais commits desta execução:
- f31542504cc51b6fe61c85c8c90a4e51e07f02a4 — primeira reconstrução de case route durante a execução
- 17b9b3f454391a4d47fee92770ac8f8c91d23678 — hero usa o nome real do projecto
- commits subsequentes no branch awwwards-rebuild consolidaram CaseStudyPage, lightbox, SEO, dependency lock, docs e testes.

phase-8-green: não criado. R3 permanece bloqueado pela ausência de evidência externa verificável para todos os runners obrigatórios.

## Ficheiros principais

- src/routes/portfolio.$slug.tsx
- src/components/portfolio/CaseStudyPage.tsx
- src/components/portfolio/CaseStudyLightbox.tsx
- src/components/portfolio/CaseStudyShareButton.tsx
- src/hooks/useCaseStudy.ts
- src/lib/case-study.ts
- src/lib/case-study.server.ts
- src/lib/case-study-pdf.server.ts
- src/routes/api.portfolio-case-study.ts
- src/routes/api.portfolio.$slug.og.ts
- src/routes/api.portfolio.$slug.pdf.ts
- src/routes/contact.lazy.tsx
- tests/phase8-case-study.test.mjs
- docs/rebuild/FASE-8-DATA-MAP.md
- docs/rebuild/FASE-8-REPORT.md
- docs/rebuild/DIVERGENCIAS.md
- package.json
- package-lock.json

## Mapa antigo → novo

A estrutura actual foi auditada antes da implementação.

Fonte factual principal:
- public.projects
- projects.title → hero title
- projects.client_name → client/meta
- projects.subtitle → supporting line do hero
- projects.description → Context fallback
- projects.concept → Context prioritário
- projects.idea → Process
- projects.notes → Outcome/Results textual quando preenchido
- projects.cover_url/gallery/gallery_meta/video_url → media real
- project_sections → narrativa estruturada publicada
- project_media → media estruturada publicada
- project_metrics → resultados medidos
- project_credits → créditos
- project_relations → relações explícitas

O detalhe completo dos 16 slugs publicados encontra-se em docs/rebuild/FASE-8-DATA-MAP.md.

## Truth-terrain

Auditado directamente na produção durante a execução:
- published projects: 16
- cover_url não nulo: 0
- gallery populated: 0
- video_url: 0
- project_sections: 0
- project_media: 0
- project_metrics: 0
- project_credits: 0
- project_relations: 0

A expectativa histórica de 106 items não é usada para fabricar conteúdo.

## Implementação

### Template modular
- Editorial template quando existem sections, media, metrics ou credits reais.
- Gallery fallback quando a fonte só fornece metadata/factos publicados.
- Context, Process e Results só aparecem quando têm fonte real.
- Secções vazias não são renderizadas.
- Deliverables, tools, collaborators e credits são condicionais.

### Hero / Work Colour
- H1 usa projects.title.
- Client aparece como informação de apoio.
- Work Colour deriva de palette e usa fallback cobalt definido pelo design system.
- Work Colour é escurecida em OKLab/0.18 para superfícies.
- Foreground é escolhido por contraste calculado.
- setWorkColor alimenta a camada global.
- viewTransitionName é definido por slug/id.

### Media / Lightbox
- cover/gallery/gallery_meta/project_media são preservados na proporção conhecida.
- Nenhum artwork é recortado.
- Gallery só aparece quando há media real.
- Lightbox foi migrado para HTMLDialogElement com focus modal, fecho por Esc e foco no controlo de fecho.
- Vídeo, embed e imagem mantêm o tipo real.

### Results / Metrics
- project_metrics só é exibido quando existem rows reais.
- Não há gráfico inventado nem números placeholder.
- O motor está preparado para dados reais futuros do CMS.

### Related / Navigation
- project_relations explícitos têm precedência.
- Sem relações explícitas, related usa a mesma disciplina/cliente a partir dos projectos reais publicados.
- Previous/Next usa a ordem real de sort_order.

### Partilha / PDF / OG
- Web Share API com fallback clipboard.
- PDF server-side em runtime Node com pdf-lib e @pdf-lib/fontkit.
- Open Graph por case com imagem SVG dinâmica baseada nos dados do project.
- A rota acrescenta og:image:type, width e height.
- Sem secrets em source.

### Contact handoff
- /contact?ref=<slug> é consumido pelo wizard existente.
- A etapa Project é aberta automaticamente.
- A disciplina é mapeada para o conjunto real de PROJECT_TYPES.
- Nenhum novo formulário foi criado.

## Dependency / R8

Foi adicionado @pdf-lib/fontkit 1.1.1. A dependência é compatível com o runtime Node serverless usado pelo export PDF e usa pako, já presente no lockfile.

Nenhuma nova dependência de browser pesada foi adicionada para a galeria ou share: HTMLDialogElement, Web Share API e Clipboard API são nativos.

## Gate de Paridade

Antes → depois:
- published projects: 16 → 16
- project sections: 0 → 0
- project media: 0 → 0
- project metrics: 0 → 0
- project credits: 0 → 0
- project relations: 0 → 0
- DB mutations: 0 → 0
- Storage mutations: 0 → 0

Os 16 slugs reais estão incluídos no mesmo motor.

## Gate de Mudança

Sinais estruturais implementados:
- S1 — novo paradigma editorial modular.
- S2 — cartaz/livro com Archivo + Newsreader.
- S3 — superfícies rectangulares, sem pills/cards arredondados.
- S4 — motion ligado a morph/share/lightbox e não a entradas automáticas repetitivas.
- S5 — ritmo Betão / Preto / Work Colour.
- S6 — nova hierarquia: hero → story → media → credits/results → related → CTA.

Lista de abate:
- K1/K2/K3: não usados na página do case.
- K4: título sem itálico azul duplicado.
- K5/K13: labels >= 14px; sem mono micro-label.
- K6: barras de skills ausentes.
- K7: sem stats placeholder.
- K8: sem paleta azul-marinho/menta como sistema de UI.
- K9: sem client chips.
- K10: lightbox/share/navegação funcionam sem hover exclusivo.
- K11: um só CTA final.
- K12: sem marquee.
- K14: nenhuma numeração artificial de conteúdo.
- K15: sem seta universal em botões.

Diff estrutural >= 0.45 não foi declarado porque o runner de screenshot/Playwright não está disponível nesta superfície.

## Testes / execução

Static contract tests foram actualizados para o implementation surface real de Phase 8.

Não foi fabricada evidência de execução:
- lint: NOT CLAIMED GREEN
- typecheck: NOT CLAIMED GREEN
- Vitest/node:test: NOT CLAIMED GREEN
- Playwright: NOT CLAIMED GREEN
- Lighthouse: NOT RUN
- Gate de Mudança: NOT CLAIMED GREEN

A razão é a mesma registada desde as fases anteriores: checkout/runner externo e resultados do GitHub Actions não estão disponíveis de forma verificável nesta execução.

## Segurança / reversibilidade

- Sem migrations novas.
- Sem writes no Supabase.
- Sem Storage mutation.
- Sem produção promotion.
- O branch continua awwwards-rebuild.

## Decisões autónomas

1. Consolidei a pré-estrutura de Case Study já existente no branch em vez de criar uma segunda implementação paralela.
2. O subtitle deixou de ser classificado como Outcome; só notes ou sections de outcome podem ocupar essa função.
3. A ausência de media/narrativa na produção foi tratada com fallback factual, nunca com inventação de assets.
4. A cor da superfície e o foreground passaram a ser escolhidos por contraste, não por gosto.
5. O lightbox foi trocado por HTML dialog para reduzir dependência e melhorar focus management.
6. A Fase 8 não cria schema novo porque o schema editorial existente já cobre sections/media/metrics/credits/relations.

## Riscos / dívida técnica

- A produção continua com 16 projects enquanto a auditoria histórica refere 106.
- Não existem assets reais publicados para a galeria dos 16 cases.
- OG é SVG; validação efectiva em debuggers sociais depende de runner externo.
- A confirmação formal de lint/typecheck/test/playwright e Gate de Mudança permanece BLOCKED-EXTERNAL.
- Route tree é gerada pelo TanStack Router; a validação final do build deve regenerar os novos API routes.

## Avança automaticamente

Tecnicamente a Fase 8 está implementada.

Formalmente permanece BLOCKED-EXTERNAL sob R3 porque os gates executáveis externos não podem ser verificados nesta superfície. A Fase 9 é independente segundo A.3, mas não deve ser marcada GREEN sem os gates requeridos.
