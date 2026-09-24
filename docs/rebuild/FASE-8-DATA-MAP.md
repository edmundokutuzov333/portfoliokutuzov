# Fase 8 · Mapa de dados dos Case Studies

Data: 2026-09-24  
Branch: \`awwwards-rebuild\`

## Verdade-terreno

A fonte pública actual é \`public.projects\`. Existem **16 projectos publicados**.

As tabelas editoriais já existentes no schema, mas vazias no snapshot desta fase, são:

- \`project_sections\`: 0
- \`project_media\`: 0
- \`project_metrics\`: 0
- \`project_credits\`: 0
- \`project_relations\`: 0

Nenhum registo ou objecto de produção foi criado ou alterado nesta fase.

## Mapeamento antigo → novo

| Fonte actual | Novo bloco Case Study | Regra |
|---|---|---|
| \`projects.title\` | Hero title | sempre |
| \`projects.client_name\` | Hero client / metadata | quando preenchido |
| \`projects.subtitle\` | Hero supporting line / fallback outcome | quando preenchido |
| \`projects.year\` | Hero metadata | quando preenchido |
| \`projects.category\` + \`tags\` | Discipline / taxonomy | sempre que existirem |
| \`projects.description\` | Context | fallback factual quando não há \`project_sections\` |
| \`projects.concept\` | Context | precedência sobre description |
| \`projects.idea\` | Process | fallback sobre role |
| \`projects.role\` | Metadata / Process fallback | quando preenchido |
| \`projects.notes\` | Outcome | precedência sobre subtitle |
| \`projects.deliverables\` | Deliverables | só quando não vazio |
| \`projects.tools_used\` | Tools | só quando não vazio |
| \`projects.collaborators\` | Credits | fallback quando \`project_credits\` está vazio |
| \`projects.cover_url\` | Hero media | só quando existe media real |
| \`projects.gallery\` / \`gallery_meta\` | Gallery + lightbox | proporção nativa; sem crop |
| \`projects.video_url\` | Hero/media video | só quando existe URL real |
| \`project_sections\` | Context / Challenge / Direction / Execution / Outcome / Custom | só blocos publicados e não vazios |
| \`project_media\` | Gallery / video / embed | só media publicada |
| \`project_metrics\` | Results | só métricas reais existentes |
| \`project_credits\` | Credits | só créditos existentes |
| \`project_relations\` | Previous / Next / Related | relação explícita tem precedência |

## Template determinístico

**Editorial** quando existe conteúdo estruturado em \`project_sections\`, \`project_metrics\`, \`project_credits\` ou \`project_media\`.

**Gallery fallback** quando o case não tem conteúdo editorial estruturado. A composição fica reduzida a hero, metadata, conteúdo factual disponível, media existente, navegação e CTA. Secções vazias não são renderizadas.

Não são introduzidos textos, métricas, clientes, imagens ou resultados que não existam na fonte.

## Casos actualmente publicados

| # | Slug | Título | Cliente | Ano | Categoria |
|---:|---|---|---|---|---|
| 1 | \`absa\` | Absa | Absa | 2024 | Ad Campaigns |
| 2 | \`vodacom\` | Vodacom | Vodacom | 2024 | Social Media |
| 3 | \`totalenergies\` | TotalEnergies | TotalEnergies | 2023 | Ad Campaigns |
| 4 | \`pernod-ricard-flying-fish\` | Pernod Ricard - Flying Fish | Pernod Ricard / Flying Fish | 2023 | Ad Campaigns |
| 5 | \`multichoice-dstv-gotv\` | MultiChoice - DStv & GOtv | MultiChoice | 2024 | Videos |
| 6 | \`emose\` | EMOSE | EMOSE | 2023 | Web Design |
| 7 | \`automotive-nissan-toyota-hyundai\` | Automotive - Nissan / Toyota / Hyundai | Nissan / Toyota / Hyundai | 2023 | Ad Campaigns |
| 8 | \`hospitality-hotel-cardoso-ponta-apart\` | Hospitality - Hotel Cardoso / Ponta Apart | Hotel Cardoso / Ponta Apart | 2023 | Web Design |
| 9 | \`nexus\` | NEXUS | NEXUS | 2026 | Branding |
| 10 | \`aurora\` | AURORA | AURORA | 2025 | Editorial |
| 11 | \`volt\` | VOLT | VOLT | 2025 | Campaign |
| 12 | \`chronos\` | CHRONOS | CHRONOS | 2024 | Experimental |
| 13 | \`lume\` | LUME | LUME | 2026 | Digital |
| 14 | \`noir\` | NOIR | NOIR | 2024 | Branding |
| 15 | \`atlas\` | ATLAS | ATLAS | 2025 | Branding |
| 16 | \`brava\` | BRAVA | BRAVA | 2026 | Campaign |

## Resultado da auditoria

Todos os 16 slugs acima entram no mesmo motor \`/portfolio/:slug\`. Como as tabelas editoriais e media estão vazias, nenhum dos casos recebe conteúdo fabricado para satisfazer o layout.
