-- Consolidate the invoice line item RLS surface into one permissive policy.
-- Reads require finance.read or finance.write; mutations require finance.write.

drop policy if exists "Admins read invoice line items" on public.invoice_line_items;
drop policy if exists "Admins write invoice line items" on public.invoice_line_items;

create policy "Admins read and write invoice line items"
on public.invoice_line_items
as permissive
for all
to authenticated
using (
  public.admin_has_permission('finance.read')
  or public.admin_has_permission('finance.write')
)
with check (
  public.admin_has_permission('finance.write')
);
