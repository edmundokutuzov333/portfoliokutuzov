-- Complete server-mediated persistence for anonymous Kutuzov Studio sessions.
-- The draft token is an opaque bearer secret scoped to one Studio card record.
-- Revision provides optimistic concurrency so rapid saves cannot silently overwrite newer state.

alter table public.studio_cards
  add column if not exists draft_token text,
  add column if not exists revision integer not null default 1,
  add column if not exists last_saved_at timestamptz;

create unique index if not exists studio_cards_draft_token_idx
  on public.studio_cards (draft_token)
  where draft_token is not null;

create index if not exists studio_cards_last_saved_at_idx
  on public.studio_cards (last_saved_at desc)
  where last_saved_at is not null;

alter table public.studio_cards
  drop constraint if exists studio_cards_revision_positive;

alter table public.studio_cards
  add constraint studio_cards_revision_positive check (revision >= 1);

comment on column public.studio_cards.draft_token is 'Opaque server-issued bearer token for anonymous Studio draft persistence. Never log or expose in URLs.';
comment on column public.studio_cards.revision is 'Optimistic concurrency revision for Studio autosave.';
comment on column public.studio_cards.last_saved_at is 'Timestamp of the most recent successful Studio persistence operation.';
