# Rebuild State — edmundokutuzov.art

Master execution state for SUPERPROMPT v2. This file is operational, not an approval gate.

| Phase | Status | Tag | Summary |
|---|---|---|---|
| 1 | IN_PROGRESS | — | Truth-terrain, stability and safety baseline |
| 2 | TODO | — | Technical foundation / CI / guardrails |
| 3 | TODO | — | Design system / Betão & Cor |
| 4 | TODO | — | Global shell / i18n / SEO |
| 5 | TODO | — | Home |
| 6 | TODO | — | Selected Portfolio Reel |
| 7 | TODO | — | Portfolio |
| 8 | TODO | — | Case study |
| 9 | TODO | — | Services |
| 10 | TODO | — | Credentials |
| 11 | TODO | — | Contact |
| 12 | TODO | — | Kutuzov Studio |
| 13 | TODO | — | Chatbot / AI |
| 14 | TODO | — | Admin / operations |
| 15 | TODO | — | Final release |

## Execution rules
- Canonical branch: awwwarrds-rebuild.
- Production promotion: Phase 15 only, unless a Phase 1 production hotfix is proven necessary.
- Phase gates and the SUPERPROMPT are authoritative.
- Ambiguity is resolved conservatively and reversibly.
- Production data changes require a confirmed reversible backup first.

## Phase 1 log
Status: IN_PROGRESS.
Started from main HEAD: 58f1e91158edce32841975b76bdc9f6f247270f9.
Branch created: awwwards-rebuild.

## Open risks
- Ground-truth counts conflict with the visual audit (see docs/rebuild/DIVERGENCIAS.md).
- Public Supabase fallback configuration points to a different project ref than the current production Supabase project; no data mutation performed.
- Current production uses an enforced CSP, while Phase 2 specifies Report-Only first; not changed in Phase 1.
