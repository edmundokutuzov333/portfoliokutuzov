# Conflitos de conteúdo — Fase 1

Regra: não escolher um valor “bonito” quando as fontes divergem. Registar, preservar a fonte existente e resolver na fase indicada pelo SUPERPROMPT.

1. Anos de experiência
   - Home fallback actual: 7+.
   - Credentials/site_settings actual: 6+.
   - Parte B mistura 6+, 7+ e 8.
   - Resolução futura: D-04 — derivar de career_start_year / fonte única, sem sobrevalorizar.

2. Projectos
   - Parte B: 106.
   - DB actual: 16.
   - Fallback local: 16.
   - Nenhum número deve ser inventado para preencher a diferença.

3. Clientes / marcas
   - Parte B: ≥23 / 30+ em métricas.
   - DB actual: 16 clientes.
   - Fallback local: 16 clientes.
   - Não converter “marcas” em um número arbitrário. Resolver por fonte única.

4. Métricas
   - public.stats: 0 rows.
   - site_settings.credentials.cards: 5 cartões.
   - Home/credentials possuem fallbacks próprios.
   - Resolução futura: site_metrics como fonte única conforme D-04.

5. Experiência
   - Não existe tabela dedicada experience.
   - Home contém 5 entradas; Credentials fallback contém 5 entradas.
   - Ikigai já aparece como “Senior Graphic Designer” na Home e “Graphic Designer” em Credentials.
   - Resolução futura: D-05, usando a variante conservadora “Graphic Designer”.

6. Skills
   - BD site_settings.credentials.skills: 5 skills.
   - Parte B descreve 6 (incluindo Vibe Coding).
   - A página deverá preservar o que é real até existir uma fonte de dados válida para a sexta skill.

7. Services
   - public.services: 0 rows.
   - Home/Services dependem de fallbacks e de estruturas hard-coded.
   - Não criar serviços fictícios na Fase 1.

8. Method
   - public.about_method: 0 rows.
   - A estrutura existe no frontend/admin mas não há conteúdo de produção para substituir vazio.


## Resolução Fase 10

9. Métricas públicas
   - Não existe a tabela `site_metrics` na produção.
   - `site_settings.credentials.cards` contém a fonte actualmente publicada: 6+ / 150+ / 30+ / 3 / 360º.
   - A Fase 10 adopta esta fonte real para Credentials e Home; não cria `site_metrics` nem altera dados.
   - O conflito histórico com 8 / 120+ / 16 / 03 permanece registado como divergência visual, mas não é tratado como dado actual.

10. Experiência
   - A fonte actual continua a ser `site_settings.credentials.experience`.
   - A Fase 10 centraliza os cinco registos num módulo único.
   - Ikigai é normalizado para "Graphic Designer" conforme D-05.

11. Skills
   - A fonte actual contém cinco skills.
   - A Fase 10 não cria "Vibe Coding" sem fonte de dados real.
   - O Toolbelt agrupa as cinco skills por valor, preservando os scores.

12. Clientes
   - A fonte pública actual contém 16 clientes activos.
   - Como os `logo_url` são nulos, a representação usa nomes acessíveis através do ClientWall.
