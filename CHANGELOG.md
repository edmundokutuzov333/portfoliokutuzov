# CHANGELOG — Rebuild edmundokutuzov.art

## Phase 2 — Independent audit correction and release hardening
- Reconciled the Phase 15 rebuild into the production-derived qa-hardening branch without changing the real content set.
- Removed the inline eslint-disable exception from the router and scoped the rule exception in eslint.config.js.
- Removed swallowed performance workflow commands using || true.
- Raised desktop Lighthouse assertions to the v3 acceptance thresholds.
- Expanded desktop Lighthouse coverage to the public EN/PT route set.
- Added audit:all and a fail-closed audit runner.
- Deferred optional root modules and removed unused Google Fonts preconnect/CSP origins.
- Prepared a P0 server-side write boundary for contact, booking, analytics and contact uploads.
- Merged the P0 hotfix to main at commit 4612414968494d0db853c6232eae9f2f14a1c937.
- Prepared migration 20260924160000_phase2_p0_rls_boundary.sql.
- Production deployment of the P0 hotfix and migration remains NOT-VERIFIED.
- Release gate remains NO-GO.

## Phase 15 — Final release engineering
- Enforced production CSP.
- Added maintained Vitest final regression suite.
- Added cross-route WCAG 2.2 axe audit for EN/PT public routes.
- Added security gates: npm audit and Gitleaks.
- Added Lighthouse CI desktop/mobile thresholds.
- Added final Lighthouse + LCP/CLS/INP assertion script.
- Added safe autocannon load smoke for chatbot rate limiting and contact oversized-body rejection.
- Added explicit Node runtime for Reel analytics.
- Added Awwwards technical sheet, credits, Developer Award note and capture specification.
- Added Playwright desktop/mobile Awwwards capture with explicit video recording.
- Added final release evidence workflows.
- No production DB or Storage writes performed.

## Phase 14 — Admin / CMS / Security
- Added MFA TOTP administration and AAL2 enforcement boundary.
- Hardened public submission RLS and booking RPC.
- Added media optimization metadata and native WebP/AVIF pipeline.
- Added structured FAQ, testimonials and site metrics registries.
- Added Reel registry, analytics and admin controls.
- Added leads/subscribers/Reel/chatbot analytics.
- Added Admin Studio token bridge and noindex.
- No production migration applied.

## Phase 13 — AI intelligence
- Added grounded AI knowledge layer, citations, tools, Live Voice context and privacy-safe conversation schema.
- Added AI guardrails and contact handoff analytics.
- Migration prepared but not applied.

## Phase 12 — Kutuzov Studio
- Rebuilt Studio as a minimal prelaunch/lab page with interactive constellation.
- Unified Studio waitlist path and double-opt-in boundary.
- No public Studio product content invented.

## Phase 11 — Contact
- Rebuilt Contact as a five-step Betão + Cal project briefing experience.
- Added server-side submission validation, rate limiting and Resend delivery path.
- Production security migration prepared, not applied.

## Phase 10 — Credentials
- Rebuilt Credentials as a dossier with Profile, Numbers, Experience, Toolbelt, Competencies, Clients and Principles.
- Added source-preserving PDF/CV generation.

## Phase 9 — Services
- Rebuilt Services around the four real disciplines with keyboard/touch expansion and real project references.
- FAQ remains hidden while the live source is absent.

## Phase 8 — Case studies
- Added modular case-study engine, Node PDF, dynamic OG and contact handoff.
- Preserved published case count.

## Phase 7 — Portfolio
- Rebuilt archive with grid/index views, URL state, filters, pagination and Work Colour.

## Phase 6 — Selected Portfolio Reel
- Preserved and evolved the 3D fan.
- Added accessibility, reduced-motion, analytics and Work Colour infrastructure.
- Reel count remained unchanged.

## Phase 5 — Home
- Rebuilt Home around Betão & Cor.
- Preserved the existing Reel.
- Added real featured work, proof and unified closing block.

## Phase 4 — Global shell
- Added global Betão & Cor shell, EN/PT routing, SEO, unified newsletter architecture and View Transitions.

## Phase 3 — Design system
- Added Betão & Cor tokens, Archivo/Newsreader roles, primitives, Work Colour and design-system showcase.

## Phase 2 — Foundation
- Added CI, parity/change gates, performance budgets, security headers and runtime guardrails.

## Phase 1 — Truth terrain
- Audited production, SEO, Supabase counts, storage and source-of-truth conflicts.
- Established baseline and rebuild branch.

## Content parity evidence
- Published projects: 16 → 16
- Active clients: 16 → 16
- Experience: 5 → 5
- Competency groups: 3 → 3
- Skills: 5 → 5
- Credential metrics: 5 → 5
- Service disciplines: 4 → 4
- Production DB rows mutated by rebuild: 0
- Production Storage objects mutated by rebuild: 0

## Performance evidence
Final Lighthouse/CWV values are only considered authoritative once the Phase 15 security/performance workflow writes its CI artifact. No score is fabricated in source control.


## Phase 15 — measured closeout
- CI technical gates verified through parity/change-gate and production build; final release remains blocked.
- Lighthouse desktop Home: 0.75 Performance, below the required 0.90 threshold.
- Performance budget: approximately 437–443 KB gzip critical JavaScript and 222 KB gzip fonts on the seven measured public routes; CSS stayed within budget.
- Security gates and safe rate-limit/load smoke passed.
- Awwwards capture workflow passed.
- Supabase reversible backup remained unavailable; no production DB/Storage mutation was performed.
- Production HTTP audit retained six SEO/canonical failures against the live origin; no 5xx/noindex/redirect/missing-route failure was observed.
- Production promotion was not executed.
