# Mapa de fontes de verdade — baseline Fase 1

## Regras de precedência actuais

1. Dados publicados em Supabase quando o hook existente os consegue ler.
2. Fallbacks versionados no repositório quando a BD está vazia, indisponível ou sem conteúdo suficiente.
3. Valores hard-coded de componente apenas quando não existe fonte CMS equivalente.
4. A Fase 3/4 deverá transformar isto numa fonte de verdade deliberada sem apagar conteúdo.

## Mapa

| Conteúdo | Fonte actual primária | Fallback / observação |
|---|---|---|
| Home structure | src/routes/index.tsx | site_settings.homepage_structure existe mas já não é consumido pela Home pública actual |
| Navigation | public.site_settings.navigation | src/lib/cms.ts / fallback navigation |
| Global SEO | src/lib/seo.ts | site_settings.seo_global / seo_pages |
| Portfolio projects | public.projects | src/data/projects.ts via useProjects |
| Clients | public.clients | src/data/clients.ts via useClients |
| Services | public.services | Fallbacks em componentes quando a query está vazia |
| Experience | hard-coded frontend | HomeExperience.tsx e credentials.tsx mantêm arrays próprios |
| Credentials metrics | site_settings.credentials.cards | HomeExperience.tsx NUMBERS_DATA |
| Credentials skills | site_settings.credentials.skills | Página pode ficar com lista vazia |
| Competencies | src/routes/credentials.tsx | Sem tabela própria |
| Method | public.about_method | UI oculta quando array vazio; no snapshot está vazio |
| Leads | public.crm_leads | Sem registos |
| Contact submissions | public.contact_requests + briefing path | Snapshot vazio |
| Newsletter | public.newsletter_subscribers | Snapshot vazio |
| Studio waitlist | public.studio_waitlist | 2 registos |
| Analytics | public.analytics_events | Snapshot vazio |
| Admin roles | public.admin_users | Supabase Auth + RLS |
| Media | Supabase Storage / media tables | Snapshot actual sem Storage objects |
| Case study narrative | projects + project_* tables | project_* tables vazias no snapshot |

## Hard-coded content requiring future centralisation

- Experience.
- Competency groups.
- Fallback credentials metrics.
- Services fallback.
- Home headline / role line / CTA texts.
- Project fallback dataset.
- Client fallback dataset.
