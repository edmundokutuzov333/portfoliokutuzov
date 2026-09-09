# Deploy no Vercel

Este projecto usa TanStack Start com SSR e server functions, compilado por Vite + Nitro para Vercel. O Vercel suporta TanStack Start directamente através do Nitro e a configuração oficial usa a detecção explícita `framework: "tanstack-start"`. citeturn766857search0turn766857search8

## Configuração actual

`vercel.json` contém apenas a identificação do framework:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "tanstack-start"
}
```

O build é `npm run build`. Não configurar `outputDirectory` manualmente para uma pasta fictícia. O preset `vercel` do Nitro produz o artefacto de deploy adequado para Vercel. citeturn766857search0turn766857search3

## Vercel Dashboard

1. Importar `edmundokutuzov333/portfoliokutuzov`.
2. Framework Preset: deixar `TanStack Start` quando detectado automaticamente.
3. Root Directory: `/`.
4. Node.js: `22.x`.
5. Build Command: `npm run build`.
6. Install Command: `npm install`.
7. Output Directory: deixar vazio e permitir que o framework/Nitro faça a configuração.
8. Adicionar as variáveis de ambiente necessárias em `Production` e `Preview`.

O repositório mantém `.nvmrc` em Node 22 e `engines.node >=22`. fileciteturn9file0

## Variáveis de ambiente

As variáveis `VITE_*` são incorporadas no bundle do browser durante a build, portanto devem existir no Vercel antes de executar o build. Segredos de servidor não devem receber o prefixo `VITE_`. citeturn766857search0

### Browser / build time

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

### Server runtime

```text
GEMINI_API_KEY=
AI_MODEL_PRIMARY=
AI_MODEL_FALLBACK=
GEMINI_MODEL_PRIMARY=
GEMINI_MODEL_FALLBACK=
GEMINI_LIVE_MODEL=
GEMINI_TTS_MODEL=
SUPABASE_PROJECT_ID=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_AUDIENCE_ID=
BRIEFING_FROM=
BRIEFING_ADMIN_EMAIL=
ADMIN_EMAIL=
NEWSLETTER_FROM=
LOVABLE_API_KEY=
PUBLIC_SITE_URL=
SITE_URL=
```

Consulte `.env.example` para a lista completa sem valores secretos. fileciteturn26file0

## Deploy por Git

Depois de ligar o GitHub ao projecto Vercel, qualquer push para a branch configurada gera um novo deployment. O fluxo recomendado para este projecto é simplesmente:

```bash
npm install
npm run build
```

O Vercel executa o build no seu ambiente e publica o output do Nitro. TanStack Start no Vercel suporta SSR, server functions e deploys baseados em Git. citeturn766857search5turn766857search8

## Deploy local pré-construído

Para testar a build antes de enviar:

```bash
npm install
npm run build
```

O script `start` aponta para a função gerada pelo preset Vercel:

```bash
npm run start
```

Importante: o comando `start` serve para inspecção local da saída gerada. No Vercel, a plataforma gere directamente as funções do artefacto.

## Regras para não voltar a quebrar o deploy

- Não adicionar `outputDirectory` arbitrário ao `vercel.json`.
- Não converter este projecto para SPA estática. O SSR é parte da arquitectura.
- Não commitar `.vercel/`, porque é output de build local.
- Não commitar `.env` nem segredos.
- Manter `package-lock.json` sincronizado com `package.json`.
- Não adicionar hosts temporários de Cloudflare Tunnel à configuração de produção.

A configuração Vite actual mantém o preset Nitro `vercel`, o entry server do TanStack Start e remove o `allowedHosts` temporário específico de um túnel local. fileciteturn44file0
