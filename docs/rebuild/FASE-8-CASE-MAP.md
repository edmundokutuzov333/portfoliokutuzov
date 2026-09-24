# Fase 8 — Mapa do motor de Case Study

## Fonte de verdade auditada

Em 24/09/2026, a produção Supabase hdmopgkbragcoirhabhi contém 16 projectos publicados. Os campos públicos actualmente preenchidos estão em public.projects; os armazenamentos modulares project_sections, project_media, project_metrics, project_credits e project_relations existem no schema mas têm 0 rows.

Nenhuma migração ou escrita foi executada nesta fase.

## Mapeamento antigo → novo

| Slug | Conteúdo real disponível | Bloco novo |
|---|---|---|
| absa | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| vodacom | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| totalenergies | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| pernod-ricard-flying-fish | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| multichoice-dstv-gotv | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| emose | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| automotive-nissan-toyota-hyundai | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| hospitality-hotel-cardoso-ponta-apart | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| nexus | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| aurora | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| volt | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| chronos | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| lume | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| noir | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| atlas | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |
| brava | title, subtitle, description, category, year, client, tags, palette | Hero + Case record + Context + CTA |

## Estrutura modular preparada

- projects.description → Context quando concept e uma secção estruturada equivalente não existem.
- projects.concept → Context prioritário.
- projects.idea → Process prioritário.
- projects.notes → Results/Outcome apenas quando existe conteúdo real.
- projects.cover_url, gallery, gallery_meta, video_url → media; nenhum é fabricado.
- project_sections → blocos narrativos estruturados publicados; secções vazias são ocultadas.
- project_media → imagens/vídeo com poster, proporção, alt e caption.
- project_metrics → resultados medidos; só são apresentados quando existem linhas reais.
- project_credits → créditos reais; ocultos quando vazios.
- project_relations → relacionados fixados pelo CMS; quando vazio, o template deriva relacionados da mesma disciplina a partir dos projectos publicados.
- tags, tools_used, deliverables, collaborators → listas reais, condicionais.

## Fallback determinístico

Quando um case tem apenas metadados publicados e não tem media/narrativa modular, o template não inventa uma história. Mostra Hero + Work Colour + Case record + descrição real, oculta Gallery/Process/Results/Credits vazios e termina em CTA + navegação.

## Conteúdo observado na data da execução

- 16/16 published projects.
- 0/16 covers.
- 0/16 galleries.
- 0/16 videos.
- 0 project_sections.
- 0 project_media.
- 0 project_metrics.
- 0 project_credits.
- 0 project_relations.

A expectativa histórica de 106 items no documento-mestre não corresponde à verdade-terreno desta base. R12 prevalece e a diferença é tratada como divergência, não como conteúdo a reconstruir.