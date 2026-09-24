# Awwwards Technical Sheet

## Project

**Website:** edmundokutuzov.art  
**Repository:** edmundokutuzov333/portfoliokutuzov  
**Release branch:** awwwards-rebuild  
**Runtime:** Node.js 24  
**Framework:** TanStack Start + TanStack Router  
**Frontend:** React 19 + TypeScript  
**Build:** Vite + Nitro  
**Deploy:** Vercel  
**Database:** Supabase PostgreSQL  
**Auth / security:** Supabase Auth + RLS  
**Storage:** Supabase Storage  
**Email:** Resend  
**AI:** Google Gemini via @google/genai  
**Animation:** Framer Motion + native View Transitions where available  
**UI primitives:** Radix UI, Tailwind CSS 4, CVA, tailwind-merge  
**Forms:** React Hook Form + Zod  
**Charts:** Recharts  
**Notifications:** Sonner  
**Quality:** ESLint, Prettier, TypeScript, Vitest, Playwright, GitHub Actions

## Architecture

The public website is rendered through TanStack Start and server routes. Server-only PDF, OG, analytics and submission handlers are pinned to Node.js. Supabase data access is split between public read paths governed by RLS and authenticated admin/server paths.

## Accessibility

The QA target is WCAG 2.2 AA. The final gate includes automated axe checks plus keyboard/focus, reduced-motion, target-size, drag alternatives, form-flow and accessible authentication checks.

## Security

Production CSP is enforcing. Admin routes are marked noindex. Supabase writes are protected with RLS/server functions. Admin MFA support uses Supabase Auth TOTP. Secret scanning is performed by gitleaks v3. Dependency security is checked with npm audit.

## Performance

Final promotion thresholds are:
- Desktop Performance >= 90
- Mobile Performance >= 85
- Accessibility >= 95
- Best Practices >= 95
- SEO = 100
- LCP < 2.5 s
- CLS < 0.1
- INP < 200 ms

Measured values are stored by CI artifacts. No unmeasured score is stated here.

## Data integrity

Production data was not mutated by the Phase 15 engineering run. Pending database migrations from previous phases remain unapplied while the required reversible Supabase backup gate is unavailable.
