-- Phase 14 Reel registry rollback.
drop trigger if exists trg_reel_items_audit on public.reel_items;
drop trigger if exists trg_reel_items_updated on public.reel_items;
drop trigger if exists trg_reel_analytics_audit on public.reel_analytics;
drop index if exists public.reel_analytics_created_at_idx;
drop index if exists public.reel_items_display_order_idx;
drop table if exists public.reel_analytics;
drop table if exists public.reel_items;
