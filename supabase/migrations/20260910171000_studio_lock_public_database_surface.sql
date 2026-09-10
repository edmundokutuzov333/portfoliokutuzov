-- Studio application data is accessed through server routes.
-- Keep anonymous public access limited to the server's opaque-token contract,
-- not to the raw studio_cards table through the browser Supabase client.

drop policy if exists "studio cards anon insert" on public.studio_cards;
drop policy if exists "studio cards public published read" on public.studio_cards;

alter table public.studio_cards enable row level security;

-- Authenticated access remains intentionally ownership-bound.
-- Public cards are served by server routes using the privileged client,
-- which exposes only an explicit, minimal response shape.
