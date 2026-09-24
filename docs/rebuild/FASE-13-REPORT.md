# Relatório — Fase 13: Agente de IA

## Resumo

A Fase 13 evoluiu o chatbot existente, sem substituir a arquitectura funcional que já servia texto, tool-calling, TTS e Gemini Live. A intervenção acrescenta grounding RAG preparado para pgvector, citações, guardrails de âmbito, limites de uso, logging protegido, novos tools de contacto/PDF e uma experiência visual Betao & Cor acessível.

A especificação exige preservar o título/subtítulo e quatro sugestões actuais, RAG com knowledge_chunks, tool-calling factual, guardrails, voz Live com token efémero, SSE token-a-token, diálogo acessível e um golden set de 15 perguntas verificáveis. fileciteturn569file0L1185-L1235

## Conteúdo técnico

### Chat existente auditado

- Modelo Gemini via @google/genai, com fallback de modelo em caso de quota/rate limit.
- Gemini API key apenas no servidor.
- Texto por server route SSE.
- Tool-calling já existente preservado.
- Gemini Live utiliza token efémero gerado no servidor e ligação WebSocket directa no browser.
- TTS server-side existente preservado como fallback.
- Session memory existente preservado.

Não foi introduzido um proxy de voz desnecessário.

### RAG

Migration criada:

supabase/migrations/20260924130000_phase13_ai_knowledge.sql

Rollback:

supabase/rollbacks/20260924130000_phase13_ai_knowledge.down.sql

Schema:
- knowledge_chunks com vector(768), source_table, source_id, source_key, source_title, source_url, lang, content, content_hash e embedding.
- HNSW index para cosine similarity.
- ai_conversations com session_hash, idioma, pathname, intent, modelo e estado de handoff.
- ai_messages com role, content, source_citations, tool_names e token_estimate.
- RLS admin-only nos três conjuntos de dados.
- match_knowledge_chunks executável apenas por service_role.

Produção não foi alterada. A migration permanece por aplicar devido a R1.

### Reindexer

src/lib/ai/rag-index.functions.ts fornece:
- reindex administrativo protegido por content.write;
- ingestão de projectos publicados;
- ingestão de services activos;
- ingestão de credentials de site_settings;
- chunking determinístico;
- embeddings Gemini;
- upsert de knowledge_chunks;
- hook zero-op quando AI_RAG_ENABLED=false.

FAQ não é indexada porque não existe fonte FAQ na produção auditada.

O publish existente foi ligado ao hook de reindex, mas este só executa quando AI_RAG_ENABLED=true.

### Retrieval

src/lib/ai/rag.ts:
- usa Gemini Embeddings;
- default gemini-embedding-2;
- output dimensionality 768;
- filtra pelo idioma;
- devolve chunk id, título, URL e similarity;
- produz contexto marcado por SOURCE;
- falha de forma segura para vazio quando o RAG não está activo ou a migration ainda não existe.

### Guardrails

src/lib/ai/agent.ts recebeu:
- scope guard para o universo de Edmundo Kutuzov;
- recusa para segredos, prompts internos, tokens e pedidos fora de âmbito;
- moderação básica para pedidos de conteúdo perigoso/ilícito;
- limite de 18 pedidos por 10 minutos por sessão;
- rate limit IP já existente na route /api/chat preservado;
- budget de 15.000 tokens estimados por sessão/dia;
- maxOutputTokens ajustado ao saldo diário, com máximo de 700 por resposta;
- logging não bloqueante;
- instrução explícita para não afirmar factos não suportados por fontes.

### Tool-calling

Adicionados:
- searchPortfolio;
- getCaseStudyDetails;
- sendContactRequest;
- generateOnePagePDF;
- checkAvailability.

sendContactRequest devolve handoff para /contact, podendo passar service e message. Não submete leads automaticamente.

generateOnePagePDF reutiliza os endpoints existentes de PDF de credentials e portfolio.

Não foi criado bookIntro porque a produção apenas expõe booking_url no Contact e não possui API de agendamento.

### Contact handoff

O Contact Phase 11 passou a aceitar ?message= e preserva o fluxo server-side /api/contact/submit.

Não existe insert directo do chatbot em briefing_submissions.

### Conversas / privacidade

src/lib/ai/conversation-log.ts:
- cria SHA-256 do session id;
- nunca grava o session id cru;
- grava user e assistant messages;
- guarda citações e ferramentas usadas;
- falha silenciosamente para não quebrar a experiência.

A UI apresenta aviso de privacidade visível.

### Voz

Live Voice continua a usar:
- authTokens.create no servidor;
- expireTime limitado;
- WebSocket directo do browser;
- transcrição de input;
- transcrição de output;
- contexto grounded com RAG quando activo.

### UI / acessibilidade

src/components/AiAssistantRealtime.tsx foi restilizado:
- painel recto com bordo de 2px;
- botão flutuante rectangular com rótulo Talk to Kutuzov;
- role=dialog e aria-modal;
- focus trap;
- Escape fecha e devolve foco ao launcher;
- aria-live via região de log;
- estado minimizado preservado;
- targets mínimos de 44px;
- zero rounded, shadow, gradients ou mono micro-labels no componente;
- quatro sugestões actuais preservadas;
- sugestões contextuais por rota;
- citações clicáveis;
- privacy notice visível;
- ferramentas continuam acessíveis por voz/texto.

### Testes

Adicionados:
- tests/phase13-ai.test.mjs;
- tests/browser/ai-assistant-phase13.spec.ts.

O golden set tem 15 perguntas e cobre site info, serviços, projectos, case studies, clientes, disponibilidade, contacto, PDF e related work.

O CI foi actualizado para executar o browser suite Phase 13.

## Dependências

Nenhuma dependência nova foi instalada.

A Fase 13 usa apenas @google/genai, React, TanStack, WebSocket, Web APIs nativas e Supabase já presentes.

## Produção / R1

Nenhuma migration aplicada.
Nenhuma row de produção criada, actualizada ou apagada.
Nenhum objecto Storage alterado.
Nenhum lead real criado.
Nenhuma chave adicionada ao source.

Truth-terrain auditada antes da implementação:
- knowledge_chunks: inexistente;
- ai_conversations: inexistente;
- ai_messages: inexistente;
- FAQ table: inexistente;
- vector extension: não instalada;
- studio_events: inexistente;
- booking API: inexistente.

## Gate de Paridade

Sem writes em produção, as entidades públicas anteriores permanecem inalteradas.
Portfolio, clients, experience, services, credentials e lead counts não foram alterados.

## Gate de Mudança

Sinais implementados:
- S1 paradigma novo do painel;
- S2 Cartaz/Livro e remoção de mono;
- S3 geometria rectangular;
- S4 diálogo/focus/streaming/voice interaction;
- S5 Preto/Cal/Menta sem o antigo navy/celeste;
- S6 hierarquia nova de welcome, sources, privacy e handoffs.

Lista de Abate no painel:
- K1 eliminado;
- K2 eliminado;
- K3 eliminado;
- K4 eliminado;
- K5 eliminado;
- K8 eliminado;
- K10 eliminado;
- K11 eliminado;
- K13 eliminado;
- K15 eliminado.

A medição formal de screenshot edge-diff depende do runner externo.

## Gates no fecho

- Lint: ainda não certificado GREEN.
- Typecheck: ainda não certificado GREEN.
- Vitest/node:test: ainda não certificado GREEN.
- Playwright: ainda não certificado GREEN.
- Gate de Paridade: PASS por ausência de mutações.
- Gate de Mudança: NOT CLAIMED GREEN até edge-diff formal.
- Supabase Backup: não confirmado / workflow continua a falhar.
- Vercel preview: submetido pelos pushes da branch; estado final ainda pendente de validação externa.
- phase-13-green: não criado.
- produção: não promovida.

## Decisões autónomas

1. Reutilizar o chatbot existente em vez de criar outro sistema paralelo.
2. RAG feature-flagged e fail-safe porque a migration ainda não pode ser aplicada.
3. Não criar bookIntro sem API de agendamento existente.
4. Não indexar FAQ enquanto não existir fonte real.
5. Reindex publish hook é zero-op quando AI_RAG_ENABLED=false.
6. Guardrails in-memory complementam, não substituem, o rate limit IP da route /api/chat.

## Riscos / dívida técnica

- A migration RAG/logging ainda não está aplicada.
- A extensão vector ainda não está instalada em produção.
- O golden set estrutural valida cobertura de fontes/tools, mas a verificação factual final depende da BD populada e da execução real do reindexer.
- O Gate de Mudança aguarda screenshot runner.
- As gates globais anteriores continuam BLOCKED-EXTERNAL.

## Estado

A Fase 13 está implementada em código mas permanece BLOCKED-EXTERNAL sob R1/R3 até existirem backup, runner e edge-diff verificáveis.