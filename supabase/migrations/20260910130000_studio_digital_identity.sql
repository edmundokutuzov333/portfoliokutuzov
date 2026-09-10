-- Digital identity layer for Kutuzov Studio.
-- Published cards are readable anonymously by opaque share token only.

alter table public.studio_cards
  add column if not exists share_token text unique,
  add column if not exists published_at timestamptz,
  add column if not exists public_enabled boolean not null default false;

create unique index if not exists studio_cards_share_token_idx
  on public.studio_cards (share_token)
  where share_token is not null;

create index if not exists studio_cards_public_enabled_idx
  on public.studio_cards (public_enabled, published_at desc)
  where public_enabled = true;

drop policy if exists "studio cards public published read" on public.studio_cards;
create policy "studio cards public published read"
on public.studio_cards
for select
to anon
using (
  public_enabled = true
  and status = 'published'
  and share_token is not null
);

comment on column public.studio_cards.share_token is 'Opaque public URL token. Never expose session_id.';
comment on column public.studio_cards.public_enabled is 'Controls anonymous public-card visibility.';
