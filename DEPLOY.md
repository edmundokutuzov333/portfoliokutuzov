# Deploy no Vercel

Este projeto usa TanStack Start com Nitro e o preset `vercel`. O build de produção gera o Build Output API em `.vercel/output`, incluindo os assets estáticos e a função SSR.

## Deploy pelo GitHub

1. Importe `edmundokutuzov333/portfoliokutuzov` no Vercel.
2. Use Node.js 22.x (o repositório já inclui `.nvmrc` e fixa a função SSR em `nodejs22.x`).
3. Deixe os comandos definidos pelo repositório:
   - Install: `npm ci`
   - Build: `npm run build`
   - Output directory: deixe vazio; o Nitro escreve diretamente em `.vercel/output`.
4. Configure no Vercel as variáveis usadas pelas funcionalidades opcionais, conforme `.env.example`.

## Deploy pela CLI

```bash
npm ci
npm run build
npx vercel deploy --prebuilt --prod
```

## Verificação local

Antes de enviar alterações, execute:

```bash
npm ci
npm run build
npm run diagnose
```

O diagnóstico confirma que os bundles CSS/JS, a função SSR, a árvore de rotas e os assets estão presentes no output do Vercel.
