# Deploy no Vercel: 100% funcional

## Diagnóstico (verificado no projeto)

Quatro bloqueios reais impedem o deploy no Vercel:

1. **Pasta de saída errada em `vercel.json`.** O ficheiro declara
   `"outputDirectory": ".output/public"`, mas a build (Nitro, preset `vercel`)
   escreve em `.vercel/output` (Build Output API v3). O Vercel procura uma pasta
   que nunca existe e falha com "No Output Directory found".
2. **Build antiga commitada.** Estão 165 ficheiros de `.vercel/output/` dentro
   do repositório (de 2026-09-03). O Vercel encontra essa saída pré-construída e
   pode servir uma versão antiga do site, ou entrar em conflito com a build nova.
   `.gitignore` não cobre `.vercel/`.
3. **Sem ficheiro de lock.** Não existe `package-lock.json` no projeto. Sem lock,
   a instalação no Vercel não é reprodutível e qualquer comando `npm ci` falha
   imediatamente.
4. **Dependência legacy `@tanstack/start`** instalada em paralelo com
   `@tanstack/react-start`, o que pode resolver módulos duplicados na build de
   produção.

Adicionalmente: o `DEPLOY.md` só documenta Cloudflare, o script `start` aponta
para `.output/server/index.mjs` (caminho que este preset não gera), e o
`.env.example` não lista as variáveis públicas `VITE_SUPABASE_*` que a build
precisa.

## O que vou fazer

1. **Corrigir `vercel.json`** para o formato correto do Build Output API:
   sem `outputDirectory`, com `framework: null`, `buildCommand: npm run build`,
   `installCommand: npm install` e Node 22. O Vercel passa a ler `.vercel/output`
   automaticamente, servindo estáticos do CDN e o SSR como função Node 22.
2. **Remover a build antiga do repositório** (`.vercel/output/`) e acrescentar
   `.vercel` ao `.gitignore`, para que cada deploy use apenas a build fresca.
3. **Gerar `package-lock.json`** com Node 22, tornando a instalação
   determinística (e compatível com `npm ci`).
4. **Limpar dependências**: remover `@tanstack/start` (legacy, não usado no
   código) mantendo `@tanstack/react-start`.
5. **Documentar as variáveis de ambiente** no `.env.example` (incluindo
   `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`, necessárias em tempo de
   build) e reescrever o `DEPLOY.md` como guia Vercel, com a lista exata de
   variáveis a colocar em Production e Preview.
6. **Corrigir o script `start`** para o comando de preview local real desta
   saída, e manter `npm run build` como único comando de build.
7. **Validar de ponta a ponta**: correr a build de produção completa, confirmar
   que `.vercel/output/config.json`, `static/` e `functions/__server.func/`
   são gerados, arrancar a saída localmente e testar `/`, `/portfolio`,
   `/services`, `/credentials`, `/contact`, `/sitemap.xml` e `/robots.txt`
   com resposta 200 e HTML renderizado. Corrigir qualquer erro que apareça
   até a build passar limpa.

## Detalhes técnicos

- `vercel.json` final: `{ "$schema": ..., "framework": null, "buildCommand":
  "npm run build", "installCommand": "npm install", "devCommand": "npm run dev" }`.
  Nada de `outputDirectory` — o preset Nitro `vercel` já emite
  `.vercel/output/config.json` com as rotas (`/assets/*` imutável, filesystem,
  fallback para `/__server`).
- Runtime da função: `nodejs22.x`, já declarado pelo preset; `engines.node >= 22`
  e `.nvmrc` (22) mantêm-se alinhados.
- Variáveis: as `VITE_*` são substituídas em tempo de build (precisam existir no
  Vercel antes do build); os segredos de servidor (`GEMINI_API_KEY`,
  `RESEND_API_KEY`, chaves Supabase de servidor) são lidos dentro dos handlers em
  runtime.
- Não vou alterar lógica de aplicação, rotas nem UI — apenas configuração de
  build/deploy, dependências e documentação.

## Fora de âmbito

- Não altero o design nem funcionalidades do site.
- Não desligo SSR nem converto o projeto para site estático (isso quebraria
  formulários, faturação, admin e sitemap dinâmico).
