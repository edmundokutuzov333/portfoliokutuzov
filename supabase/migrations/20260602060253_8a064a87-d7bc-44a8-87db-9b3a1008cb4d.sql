ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'client';
CREATE INDEX IF NOT EXISTS idx_clients_kind ON public.clients(kind);