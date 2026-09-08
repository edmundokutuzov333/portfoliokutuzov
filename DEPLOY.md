# Deploy no Vercel

O projeto publica uma aplicação React/TanStack Router como build estático Vite. Esta configuração evita que o shell SSR do Nitro seja servido sem a montagem do React (a causa da tela branca).

## Deploy pelo GitHub

1. Importe `edmundokutuzov333/portfoliokutuzov` no Vercel.
2. Use Node.js 22.x.
3. Mantenha as definições do repositório:
   - Install: `npm ci`
   - Build: `npm run build:vercel` (o `npm run build` padrão também aponta para este build)
   - Output directory: `dist/client`
4. Configure no Vercel as variáveis opcionais de `.env.example`.

O `vercel.json` já contém o fallback SPA para que rotas como `/portfolio` carreguem o cliente e sejam resolvidas pelo TanStack Router.

## Deploy pela CLI

```bash
npm ci
npm run build
npx vercel --prod
```

## Verificação local

```bash
npm ci
npm run build
npm run diagnose
```

O diagnóstico verifica os bundles, a estrutura do root e referências de assets antes do deploy.
