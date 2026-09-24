# Relatório — Fase 10: Credentials (/credentials)

## Resumo

A Fase 10 transforma `/credentials` de uma página monolítica num dossiê editorial em Betão & Cor, preservando o conteúdo factual existente e removendo os padrões de UI abatidos pelo plano.

A nova composição tem sete capítulos: Profile, Numbers, Experience, Toolbelt, Competencies, Clients e Principles. O contacto directo passou para uma faixa horizontal funcional, o Toolbelt substitui as barras percentuais, o ClientWall é rectangular e acessível, e Principles ocupa o fecho em tom Cor sem as letras-fantasma.

Foi também criada uma rota Node para Press Kit / CV com PDF e QR para o portfolio. A Home foi alinhada com a mesma fonte de métricas e experiência usada por Credentials.

Nenhuma alteração foi feita no Supabase ou Storage.

## Commit(s)

- 918b9500b3de221a2e471589869139980baf9de4 — fonte central de Credentials
- 99662abb0b60c3a2b86aadf4c46312024bd9f671 — reconstrução /credentials
- 83076499ca207b419090cd2f44bf9b790be6e652 — route Credentials
- f5b4d99cb612451dd90476603023c93c71330704 — fonte única/ordenação de Experience na Home
- 353128d3772bc7b049e772ac7df9278757f9d8f5 — Home usa métricas de Credentials
- 7e3255a3a447d9838d7291a2528632fcf51ae175 — motor PDF Press Kit / CV
- f37fa2e4adbf5385b3a9ff8df8c492a8c9753871 — endpoint Node do PDF
- 468405edab6baf5a963bd2aaa536f098873c71a0 — contratos estáticos Fase 10
- e71a71922f34a46defed483926ce9f31714ff154 — browser tests Fase 10
- 5852f8a7a0deb5de69d8b7a2540f1114cfe6e2d2 — CI inclui Credentials browser gate
- fcde0aa92b9e1f0e2c6abb4b9db190dc8c26ae26 — ClientWall reutilizável
- 116f2fb3645769afdacfcc2d5533577c9932764b — Credentials usa ClientWall
- 9863eaee0022c980d941beea16e526c80c89afb0 — Press Kit usa fonte CMS
- 5d0b10b0c58ffb91734f8a3732b493a15aa169cf — testes cobrem ClientWall + fonte CMS do PDF
- 86e10573a31fc34ddd540e1ea415df7003ba3863 — divergências da Fase 10
- 776fd07db9be3a7d51d672a4abac620e9a703c11 — conflitos de conteúdo resolvidos

A tag `phase-10-green` não foi criada porque os gates formais ainda não estão verdes/verificáveis.

## Preview Vercel

O histórico de previews consultável pela integração não expôs um deployment associado ao HEAD final desta fase. O último preview verificável do rebuild continua anterior a esta fase e não é usado como prova de Fase 10.

## Ficheiros criados/alterados

- `src/lib/credentials-data.ts`
- `src/components/credentials/CredentialsPagePhase10.tsx`
- `src/routes/credentials.tsx`
- `src/components/home/HomeExperience.tsx`
- `src/components/design-system/ClientWall.tsx`
- `src/lib/credentials-pdf.server.ts`
- `src/routes/api.credentials.press-kit.pdf.ts`
- `tests/phase10-credentials.test.mjs`
- `tests/browser/credentials.spec.ts`
- `.github/workflows/ci.yml`
- `docs/rebuild/DIVERGENCIAS.md`
- `docs/rebuild/CONTEUDO-CONFLITOS.md`
- `docs/rebuild/FASE-10-REPORT.md`
- `docs/rebuild/STATE.md`

## Conteúdo e verdade-terreno

Produção auditada antes da implementação:
- Projectos publicados: 16
- Clientes activos: 16
- Services activos: 0
- Stats activos: 0
- About Method activos: 0
- Tabela `site_metrics`: inexistente
- Tabela `experience`: inexistente
- Tabela `skills`: inexistente
- Logo files dos clientes: 0
- Skills em `site_settings.credentials`: 5
- Experience em `site_settings.credentials`: 5
- Metrics em `site_settings.credentials.cards`: 5

Gate de Paridade:
- projectos: 16 → 16
- clientes: 16 → 16
- experiência: 5 → 5
- skills: 5 → 5
- métricas: 5 → 5
- grupos de competências: 3 → 3
- disciplinas Services: 4 → 4

Nenhuma row foi inserida, actualizada ou apagada.

## Implementação

### 1. Profile

H1 único:
`Strategy, craft and a sharp point of view.`

O título é renderizado uma única vez. A bio usa Newsreader. O cartão anterior foi substituído por uma faixa horizontal de contacto com:
- Email
- WhatsApp real
- localização
- LinkedIn
- Instagram
- Facebook

CTA principal:
`Start a project`

CTA secundário:
`Press kit / CV`

### 2. Numbers

A secção lê `public.stats` quando existem rows activas. Como a tabela actual está vazia, usa `site_settings.credentials.cards`, que é a fonte factual actualmente publicada.

Os cinco valores actuais preservados são:
- 6+
- 150+
- 30+
- 3
- 360º

A Home foi alterada para consumir o mesmo conjunto de métricas, eliminando a divergência Home/Credentials.

### 3. Experience

Experience passou para uma fonte central em `src/lib/credentials-data.ts`.

A ordenação é determinística por ano inicial, mais recente primeiro.

A variante de Ikigai foi fixada em:
`Graphic Designer`

Isto implementa D-05 sem sobrevalorizar a função.

### 4. Toolbelt

As barras percentuais foram removidas.

Os valores continuam preservados:
- Photoshop 95
- Illustrator 75
- Premiere 75
- After Effects 45
- Artificial Intelligence 95

Agrupamento:
- 90+ Core
- 70–89 Fluent
- abaixo de 70 Exploring

A sexta skill descrita na auditoria visual não está na fonte actual e não foi inventada.

### 5. Competencies

Os três grupos existentes continuam presentes:
- Core Disciplines
- Digital & Motion
- Print & Special Projects

A secção permanece explicitamente distinta de Services e contém ligação cruzada para `/services`.

### 6. Clients

Foi criado `ClientWall` reutilizável.

A composição usa grelha rectangular, nomes acessíveis e suporte opcional a `logo_url` quando este existir.

Na produção actual:
- 16 clientes activos
- 0 logo_url

Logo, a página mostra os nomes reais em vez de fabricar logótipos.

### 7. Principles

O Manifesto foi transformado no fecho em tom Cor.

Os quatro pilares preservados:
- Clarity
- Rhythm
- Precision
- Memory

A frase principal permanece:
`A brand does not need to shout to be noticed. It needs structure, clarity, and memory.`

As letras-fantasma de Credentials foram removidas.

Reference `GOD` foi preservado como conteúdo actual.

### 8. Press Kit / CV

Criado:
`/api/credentials/press-kit.pdf`

Runtime:
`nodejs`

O documento é gerado com `pdf-lib` e inclui QR gerado por `qrcode-generator`.

A fonte CMS `site_settings.credentials` é lida primeiro; fallback só é usado quando a fonte não responde ou está ausente.

Os clientes activos são lidos de forma read-only pela API REST pública.

Não existe qualquer escrita de dados.

## Dependências / R8

Nenhuma dependência nova foi adicionada.

Foram reutilizados:
- pdf-lib já existente
- qrcode-generator já existente
- Lucide já existente
- Tailwind 4 já existente
- React/TanStack já existentes

Não houve migration.

## Defeitos da Parte B resolvidos

- D-01: H1 sem duplicação.
- D-03: placeholder de métricas removido.
- D-04: fonte actual de métricas centralizada.
- D-05: Experience centralizada e Ikigai normalizado para Graphic Designer.
- D-06: Services e Competencies mantidos separados com ligação.
- D-17: ClientWall rectangular e sem marquee/cortes.
- D-19: letras-fantasma removidas.
- K6: barras percentuais eliminadas.
- K7: caixas de estatísticas com placeholder eliminadas.
- K9: chips de clientes eliminados.
- K13: micro-tipografia/mono eliminada da nova página.
- K3/K8: cartões rounded/gradientes/brilhos eliminados.

## Testes

### Contratos estáticos
`tests/phase10-credentials.test.mjs`

Cobre:
- sete capítulos
- fonte única de Experience
- cinco skills reais
- ausência de Vibe Coding inventado
- Home/credentials com a mesma fonte de métricas
- ClientWall
- PDF Node + pdf-lib + QR
- ausência de writes

### Browser
`tests/browser/credentials.spec.ts`

Cobre:
- H1
- índice de sete capítulos
- CTAs
- Toolbelt
- ausência das barras antigas
- endpoint PDF

### Estado externo no fecho
O workflow final é executado pelo GitHub Actions, porque o runner local desta sessão não possui checkout executável do repository.

No último ciclo observado, o CI e o Browser QA estavam a entrar em execução; a confirmação GREEN ainda não estava disponível.

Portanto:
- lint: NOT CLAIMED GREEN
- typecheck: NOT CLAIMED GREEN
- Vitest/node:test: NOT CLAIMED GREEN
- Playwright: NOT CLAIMED GREEN
- build Vercel: NOT CLAIMED GREEN
- Gate de Mudança: NOT CLAIMED GREEN
- Gate de Paridade: conteúdo preservado e contagens verificadas, mas gate formal externo não promovido

## Segurança / reversibilidade

- 0 migrations
- 0 inserts
- 0 updates
- 0 deletes
- 0 upserts
- 0 Storage mutations
- 0 segredos novos

R1 não foi ultrapassada.

## Decisões autónomas

1. Não criar `site_metrics`, porque a fonte real publicada é `site_settings.credentials.cards` e uma migration exigiria R1/R6.
2. Não inventar a sexta skill.
3. Usar "Graphic Designer" para Ikigai conforme D-05 e fonte conservadora existente.
4. Criar ClientWall como primitivo reutilizável porque o plano exige um muro de clientes partilhado.
5. Fazer o PDF read-only através das fontes públicas existentes.
6. Preservar a lógica PT existente: `/pt/credentials` reutiliza a página pública actual porque não existe fonte editorial PT-PT comprovada.

## Riscos / dívida técnica

- A fonte histórica de métricas continua sem uma tabela `site_metrics`.
- Não existe tabela dedicada para Experience ou Skills.
- A fonte actual contém cinco skills enquanto a auditoria visual descrevia seis.
- Logos dos clientes continuam ausentes na produção.
- Os gates formais dependem do runner externo.
- Backup automático do Supabase continua a falhar nos workflows anteriores.

## Avança automaticamente

Não.

A implementação da Fase 10 está concluída, mas R3 impede a promoção a `phase-10-green` sem evidência verde de lint, typecheck, testes, Playwright e Gate de Mudança.

Não houve promoção para produção.
