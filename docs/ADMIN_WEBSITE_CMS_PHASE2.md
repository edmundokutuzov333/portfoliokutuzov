# Admin Website CMS - Phase 2

Phase 2 converts the Control Room into a structured Website CMS while preserving the Phase 1 backend security model.

Implemented surfaces:
- Overview / operational dashboard
- Homepage Featured Work manager
- Credentials manager for identity, experience, skills and brands
- Structured Stats and Method CRUD
- Services CRUD, duplication, visibility and transactional reorder
- Navigation manager with label, route, order, visibility, external/internal and CTA state
- Global settings for public identity, contact, social and behavioural flags
- SEO manager for global and per-page metadata
- Media Library backed by Supabase Storage and a persistent media_assets registry

Frontend/backend flow:
Admin UI -> typed server function -> permission check -> Supabase/RLS -> audit -> realtime/query invalidation -> public UI.

Public reflection paths added in this phase:
- Featured Work reads site_settings + project relationships.
- Services Interactive reads public services rows with a static fallback for resilience.
- Credentials reads credentials settings, stats and about_method.
- Navbar and Footer read structured navigation.
- SEO runtime synchronises page metadata from the CMS.

Operational safety:
- No normal website operation requires editing raw JSON.
- Media uploads are signed and server-prepared.
- Service/Stats/Method ordering uses transactional database RPCs.
- Existing static fallbacks remain in place so the public site still renders when data is temporarily unavailable.

All implementation changes for this phase are intended for the main branch, per the project execution requirement.
