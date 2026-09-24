#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd -- "$(dirname -- "$0")/../.." && pwd)"
cd "$ROOT"
bash scripts/audit/01-static-governance.sh
bash scripts/audit/00-external-matrix.sh
npm run test:audit-contract
npm run typecheck
npm run lint
npm run test:parity
npm run test:change-gate
