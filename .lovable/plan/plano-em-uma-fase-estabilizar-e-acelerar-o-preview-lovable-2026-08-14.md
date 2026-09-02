# Plano em uma fase: estabilizar e acelerar o Preview Lovable

## Objetivo

Eliminar a tela branca e tornar a primeira abertura, o refresh e o hot reload previsíveis no Preview Lovable, sem alterar o comportamento do site publicado.

## Diagnóstico confirmado

- Os logs recentes registram várias requisições SSR abortadas por `ECONNRESET`, convertidas em respostas 500 pelo wrapper atual (`src/server.ts`), durante reinício/reconexão do preview.
- O Vite reiniciou e reotimizou dependências porque o lockfile mudou; durante essa janela, o cliente foi recarregado e o preview ficou sujeito a interrupções.
- As versões declaradas com `^` não são as mesmas resolvidas localmente: por exemplo, `@tanstack/react-start` declara `1.168.27`, mas o ambiente resolveu `1.168.44`; isso reduz a reprodutibilidade do preview.
- Na medição atual, a página terminou de carregar em cerca de 4,65 s; a resposta inicial levou cerca de 1,19 s, o cliente cerca de 1,8 s e as leituras públicas aproximadamente 1,1–1,3 s.
- A abertura da home carregou também módulos grandes de outras rotas, incluindo o painel administrativo e contacto; o painel administrativo tem mais de 2.500 linhas e não deve fazer parte do caminho inicial da home.
- A home abre múltiplas consultas e várias assinaturas realtime duplicadas para os mesmos dados. O conteúdo possui fallbacks, portanto essas operações não precisam bloquear nem pesar tanto no arranque.
- Já existem error boundaries, diagnóstico e fallback; porém, o fallback é marcado como saudável cedo demais e o wrapper trata cancelamentos normais do preview como erros SSR catastróficos.

## Execução única

1. **Fixar uma árvore de dependências reproduzível**
   - Escolher um único lockfile compatível com o ambiente Lovable e remover a inconsistência restante.
   - Fixar versões compatíveis de TanStack/Vite sem ranges flutuantes nos pacotes críticos e alinhar Start, Router e plugins.
   - Remover dependências TanStack legadas ou duplicadas que não sejam usadas.
   - Corrigir a API depreciada `inputValidator()` indicada pelo compilador.

2. **Reduzir drasticamente o caminho inicial da home**
   - Confirmar e ajustar o code splitting por rota para que `/edmundo-control-room`, `/contact`, MCP e páginas de detalhe não sejam baixadas ao abrir `/`.
   - Dividir o painel administrativo em módulos menores somente se isso for necessário para impedir sua entrada no bundle inicial.
   - Manter no primeiro render apenas shell, navegação, hero e conteúdo essencial; carregar secções abaixo da dobra e recursos pesados progressivamente.
   - Evitar que fontes remotas atrasem a pintura inicial, mantendo fallbacks locais e carregamento não bloqueante.

3. **Consolidar dados públicos e realtime**
   - Deduplicar consultas repetidas de `site_settings` e canais realtime por tabela, com uma única assinatura partilhada por página.
   - Definir timeout e fallback explícitos para leituras públicas; falha ou lentidão do backend não poderá apagar nem bloquear a home.
   - Preservar conteúdo estático de fallback enquanto os dados chegam e renderizar estados de erro localizados nas secções dependentes.
   - Não alterar banco de dados, políticas ou regras de negócio.

4. **Tratar corretamente o ciclo de vida exclusivo do Preview Lovable**
   - No servidor de desenvolvimento, reconhecer `AbortError`, `ECONNRESET` e pedidos desconectados como cancelamentos esperados, sem convertê-los em 500 catastrófico ou poluir o diagnóstico.
   - Manter o tratamento rigoroso para erros SSR reais e conservar o fallback HTML para falhas verdadeiras.
   - Tornar o boot/HMR idempotente: listeners, timers, canais e animações devem ser removidos e reinstalados corretamente após hot reload.
   - Marcar a aplicação como saudável somente depois do primeiro commit visível da rota; se isso não acontecer, mostrar imediatamente uma recuperação funcional em vez de tela branca.
   - Limitar a recuperação automática a uma tentativa por ciclo para evitar loops de reload.

5. **Eliminar trabalho visual contínuo desnecessário no arranque**
   - Suspender o loop do fundo interativo quando a aba estiver oculta, quando houver preferência por movimento reduzido ou antes da hidratação terminar.
   - Garantir cleanup de `requestAnimationFrame`, timers e eventos em refresh/HMR.
   - Manter o visual atual, mas impedir que efeitos decorativos concorram com a renderização inicial.

6. **Validar o resultado no preview real**
   - Executar as verificações normais do projeto e corrigir qualquer erro de tipos/build sem mascarar warnings relevantes.
   - Testar abertura fria, 10 refreshes consecutivos, navegação entre todas as rotas, retorno à home e pelo menos 5 ciclos de hot reload.
   - Simular backend lento/offline e uma falha real de componente para confirmar conteúdo fallback e recuperação visível.
   - Medir novamente recursos e tempos no Preview Lovable e confirmar que rotas administrativas/contato não entram na abertura da home.
   - Inspecionar logs após os testes e confirmar ausência de telas brancas, loops de reload e 500 causados por cancelamento de conexão.

## Critérios de aceite

- Nenhuma tela branca em abertura fria, refresh, navegação ou hot reload durante a bateria de testes.
- Hero/shell visível rapidamente, mesmo com backend lento ou indisponível.
- Nenhum 500 gerado apenas por `ECONNRESET`/requisição abortada do preview.
- Home não baixa o módulo administrativo nem módulos de rotas não visitadas.
- Um único fluxo de consulta/cache e no máximo uma assinatura realtime ativa por tabela no uso público.
- Fallback de recuperação aparece para erro real e consegue tentar novamente sem loop.
- Build e testes passam; site publicado mantém o comportamento existente.
