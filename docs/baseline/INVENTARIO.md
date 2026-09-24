# Inventário de dados — baseline Fase 1

Obtido por query directa ao Supabase de produção e por inspecção do fallback versionado. Data: 24/09/2026.

| Entidade | Produção / fonte | Contagem | Observação |
|---|---|---:|---|
| Portfolio projects | public.projects | 16 | Todos os 16 observados publicados. |
| Project fallback | src/data/projects.ts | 16 | Correspondência de volume com a BD; conteúdo serve como fallback. |
| Reel candidate projects | public.projects.cover_url IS NOT NULL | 0 | Os 16 registos consultados têm cover_url = null; o componente filtra por cover. |
| Clients | public.clients | 16 | Todos activos no snapshot. |
| Client fallback | src/data/clients.ts | 16 | Lista textual. |
| Experience | frontend fallback | 5 | Não existe tabela experience no schema actual. |
| Services | public.services | 0 | Frontend possui fallback. |
| Competency groups | src/routes/credentials.tsx | 3 | Core Disciplines; Digital & Motion; Print & Special Projects. |
| Skills (DB setting) | site_settings.credentials.skills | 5 | Parte B previa 6. |
| Stats | public.stats | 0 | Home/Credentials usam fallback. |
| Methods | public.about_method | 0 | Secção pode ficar vazia/oculta. |
| Site settings | public.site_settings | 8 | Inclui credentials, global, navigation, SEO e homepage_structure. |
| Leads | public.crm_leads | 0 | Nenhum lead no snapshot. |
| Contact requests | public.contact_requests | 0 | Nenhum registo no snapshot. |
| Briefing submissions | public.briefing_submissions | 0 | Nenhum registo no snapshot. |
| Newsletter subscribers | public.newsletter_subscribers | 0 | Nenhum registo nesta tabela. |
| Studio waitlist | public.studio_waitlist | 2 | 2 registos; source=studio. |
| Analytics events | public.analytics_events | 0 | Sem eventos no snapshot. Não foi encontrada uma tabela pública específica de chat logs. |
| Admin users | public.admin_users | 1 | Um utilizador com role owner. |
| Admin drafts | public.admin_drafts | 0 | Nenhum draft no snapshot. |
| Admin audit log | public.admin_audit_log | 0 | Nenhum registo no snapshot. |
| Storage buckets | storage.buckets | 2 | Buckets existentes. |
| Storage objects | storage.objects | 0 | Nenhum objecto no snapshot. |
| Project media | public.project_media | 0 | Sem media relacional no snapshot. |
| Project sections | public.project_sections | 0 | Sem blocos narrativos no snapshot. |
| Project metrics | public.project_metrics | 0 | Sem métricas por case. |
| Project credits | public.project_credits | 0 | Sem créditos por case. |
| Project relations | public.project_relations | 0 | Sem relações entre cases. |

## Fontes estáticas relacionadas

- Reel/case study fallback: src/data/projects.ts — 16 itens.
- Client fallback: src/data/clients.ts — 16 itens.
- Experience fallback: src/components/home/HomeExperience.tsx — 5 itens.
- Credentials experience fallback: src/routes/credentials.tsx — 5 itens.
- Competencies: src/routes/credentials.tsx — 3 grupos.
- Credentials metrics fallback: 5 cards.
- Site settings: 8 rows no snapshot.

## Nota de paridade

Os números “106” e “≥23” constantes do SUPERPROMPT/Parte B não correspondem ao snapshot real em 24/09/2026. Nenhum dado foi fabricado para satisfazer a expectativa documental.
