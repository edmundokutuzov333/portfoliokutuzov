#!/usr/bin/env bash
set -euo pipefail
for f in docs/audit/STATE.md docs/audit/MATRIZ.md docs/audit/DEFEITOS.md docs/audit/SCORECARD.md docs/audit/LEDGER-DADOS-TESTE.md; do test -f "$f"; done
if grep -RInE 'test\.(skip|fixme|only)|it\.(skip|only)|describe\.(skip|only)|\bxit\b|@ts-ignore|@ts-nocheck|eslint-disable' tests src .github 2>/dev/null; then exit 2; fi
if grep -RInE 'continue-on-error|\|\| true|--no-verify' .github .husky package.json 2>/dev/null; then exit 3; fi
