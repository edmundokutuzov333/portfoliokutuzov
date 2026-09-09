# Deploy no Vercel

Este projeto é TanStack Start (SSR + server functions). A build usa o preset
Nitro `vercel` e produz a saída no formato oficial **Build Output API v3**:

```text
.vercel/output/
  config.json                      # rotas (assets imutáveis, filesystem, fallback SSR)
  static/                          # ficheiros servidos pelo CDN
  functions/__server.func/         # função SSR (runtime nodejs22.x)
```

O Vercel deteta esta pasta automaticamente. **Não** definir
`outputDirectory` no `vercel.json`.

## Configuração no dashboard

1. Importar o repositório em vercel.com → New Project.
2. Build settings (já vêm do `vercel.json`):
   - Framework preset: **Other**
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: (vazio)
3. Node.js version: **22.x** (`.nvmrc` e `engines.node` já pedem 22).
4. Adicionar as variáveis de ambiente (Production **e** Preview) — ver abaixo.
5. Deploy.

## Variáveis de ambiente

Build time (substituídas no bundle do browser, têm de existir **antes** da build):

| Variável                        | Uso                             |
| ------------------------------- | ------------------------------- |
| `VITE_SUPABASE_URL`             | cliente Supabase no browser     |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | chave pública do Supabase       |
| `VITE_SUPABASE_PROJECT_ID`      | identificação do projeto        |

Runtime (lidas dentro dos handlers do servidor):

| Variável                                        | Uso                              |
| ----------------------------------------------- | -------------------------------- |
| `GEMINI_API_KEY`                                | assistente AI e voz              |
| `RESEND_API_KEY`, `BRIEFING_FROM`, `ADMIN_EMAIL`, `NEWSLETTER_FROM` | emails de briefing/faturas/newsletter |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`     | operações privilegiadas          |
| `SITE_URL`, `PUBLIC_SITE_URL`                   | links públicos (faturas, sitemap)|

## CLI

```bash
npm install
npm run build          # gera .vercel/output
npx vercel deploy --prebuilt          # preview
npx vercel deploy --prebuilt --prod   # produção
```

Pré-visualizar a saída localmente: `npm start`.

## Notas

- `.vercel/` está no `.gitignore`: nunca commitar a build — o Vercel constrói
  sempre a versão nova.
- `package-lock.json` é o único lockfile (nada de Bun); `npm ci` funciona.
- SSR é necessário: formulários de contacto, faturação, área admin e
  `/sitemap.xml` dependem de server functions. Não converter para site estático.
