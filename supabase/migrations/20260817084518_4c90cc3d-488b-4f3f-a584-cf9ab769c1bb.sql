REVOKE EXECUTE ON FUNCTION public.next_invoice_number(text) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.next_invoice_number(text) TO service_role;