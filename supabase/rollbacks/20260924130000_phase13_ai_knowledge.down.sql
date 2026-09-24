-- Rollback for Phase 13 AI knowledge/logging migration.
drop function if exists public.match_knowledge_chunks(vector(768), integer, text);
drop table if exists public.ai_messages;
drop table if exists public.ai_conversations;
drop table if exists public.knowledge_chunks;
-- The vector extension is intentionally retained: it is shared infrastructure and
-- may have been enabled by another migration or operational feature after deployment.
