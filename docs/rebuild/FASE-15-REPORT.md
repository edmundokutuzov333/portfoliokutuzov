# Relatório — Fase 15: Release Engineering e Promoção

## Resumo

A Fase 15 fechou a engenharia de release, reforçou segurança, acessibilidade, performance e a preparação da submissão Awwwards. Foram adicionados gates de segurança, Lighthouse, WCAG, load smoke, regressão final e captura de evidência. A promoção para produção permanece bloqueada por R1, porque o workflow de backup Supabase falha antes de gerar um backup reversível confirmado. A especificação exige que a promoção só aconteça com todos os gates verdes e sem BLOCKED. fileciteturn1056file0L1246-L1260

## Evidência técnica

### CI geral
HEAD final desta etapa: b9cbd35e6d4dd3c14f169a875cc1f0b4c32d9d85.

O último ciclo completo antes da adição da auditoria axe passou TypeScript, build, lint, Vitest, Phase 14 regression e contrast; o único bloqueio era o parser de paridade da experiência. O parser foi corrigido para usar a fonte partilhada de credenciais e contar todas as entradas de experiência.

O CI do HEAD final estava em execução no fecho deste relatório.

### Segurança
Workflow: .github/workflows/phase15-security-performance.yml

- npm audit: PASS
- Gitleaks: PASS
- CSP: enforcing em vercel.json
- Admin noindex: mantido
- Nenhum segredo adicionado
- Nenhuma alteração de DB/Storage de produção

### Accessibility
- @axe-core/playwright 4.13.0 é usado apenas no browser QA.
- Auditoria axe cobre EN e PT para /, /portfolio, /services, /credentials, /contact e /studio.
- O gate bloqueia violações critical e serious.
- Playwright mantém matriz Chromium, Edge, Firefox, WebKit, iPhone Safari e Android Chrome.

### Lighthouse
Preparados:
- lighthouserc.desktop.cjs
- lighthouserc.mobile.cjs
- scripts/phase15-lighthouse.mjs

Thresholds:
- Desktop Performance >= 90
- Mobile Performance >= 85
- Accessibility >= 95
- Best Practices >= 95
- SEO = 100
- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms

Os valores finais ainda dependem do workflow de performance. Nenhum resultado não medido é apresentado como facto.

### Load / abuse resistance
scripts/phase15-load-test.mjs exerce:
- chatbot rate limiting e espera observar HTTP 429;
- contacto com payload acima do limite para validar a rejeição segura sem criar lead;
- não executa um payload de contacto válido repetitivo porque isso escreveria em produção/local Supabase e violaria a regra R1 sem backup confirmado.

### Awwwards evidence package
Criado:
- docs/awwwards/README.md
- docs/awwwards/TECHNICAL-SHEET.md
- docs/awwwards/CREDITS.md
- docs/awwwards/DEVELOPER-AWARD.md
- docs/awwwards/CAPTURE.md
- tests/browser/awwwards-capture.spec.ts
- .github/workflows/awwwards-capture.yml

O capture usa 1440x900 e 390x844 e grava vídeo explicitamente com Playwright. A duração de 30–60 segundos é incorporada no percurso de captura, sem inventar conteúdo de apresentação.

### Paridade

| Entidade | Antes | Depois | Estado |
|---|---:|---:|---|
| Published projects | 16 | 16 | Preservado |
| Active clients | 16 | 16 | Preservado |
| Experience | 5 | 5 | Preservado |
| Competency groups | 3 | 3 | Preservado |
| Skills | 5 | 5 | Preservado |
| Credential metrics | 5 | 5 | Preservado |
| Service disciplines | 4 | 4 | Preservado |
| Production DB writes | 0 | 0 | Sem mutação |
| Production Storage writes | 0 | 0 | Sem mutação |

A auditoria visual original indicava 106 projectos, mas a verdade-terrain real da BD é 16 e permanece 16. R12 prevalece.

## Promotion gate

A promoção não foi executada.

Bloqueio definitivo desta fase:
1. Supabase Backup workflow falha em Verify backup secrets exist.
2. Sem backup reversível confirmado, R1 proíbe qualquer alteração de produção.
3. O próprio plano determina que, existindo BLOCKED na Fase 15, não se promove para produção.

### Estado dos gates no momento do fecho
- Typecheck: última execução completa observada PASS.
- Production build: última execução completa observada PASS.
- ESLint: última execução completa observada PASS, com warnings sem erros.
- Vitest: 12/12 PASS.
- Phase 14 regression: 9/9 PASS.
- Contrast gate: PASS.
- Parity gate: corrigido no HEAD final, aguardando evidência do workflow final.
- Browser QA final: aguardando conclusão do HEAD final.
- WCAG axe final: aguardando conclusão do HEAD final.
- Lighthouse: aguardando conclusão.
- Security: npm audit PASS, Gitleaks PASS.
- Load smoke: em execução no momento do fecho.
- Supabase Backup: FAILURE, R1 BLOCKED.
- Production promotion: NOT EXECUTED.
- phase-15-green: não criado.
- pre-release tag: não criada.

## Rollback plan

Como não houve promoção, não existe rollback de produção a executar nesta fase.

Para reverter o trabalho da Fase 15 no branch, o ponto seguro é o commit imediatamente anterior ao primeiro commit desta fase. Para migrations das fases anteriores, cada migration possui rollback dedicado e nenhuma foi aplicada.

## Decisões autónomas

1. Não alterar a BD apenas para produzir métricas ou completar load tests.
2. Fazer o audit axe como dependência de CI, não runtime.
3. Endurecer CSP em vez de manter Report-Only porque a Fase 15 explicitamente exige enforcing.
4. Tratar os valores 16/16/5/3 como verdade-terrain e não os substituir pelo número visual antigo 106.
5. Não inventar score Lighthouse, métricas CWV, créditos ou prémios.
6. Não promover enquanto o backup externo continuar sem evidência.

## Conclusão

A Fase 15 está implementada tecnicamente, mas permanece BLOCKED-EXTERNAL e não pode ser promovida para produção sob R1/R3. O pacote de submissão Awwwards e os gates de segurança/performance estão preparados; a decisão de release permanece negativa até existirem todas as evidências exigidas.
