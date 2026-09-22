import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Phase 3 Operations OS is wired into the main Control Room", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const operations = read("src/components/admin/Phase3OperationsOS.tsx");
  assert.match(admin, /Phase3OperationsOS/);
  assert.match(admin, /id: "operations"/);
  assert.match(admin, /section === "operations"/);
  for (const token of ["Unified Inbox", "Leads", "Bookings", "Audience", "Client CRM", "Finance", "Studio", "Tasks"]) {
    assert.ok(operations.includes(token), token);
  }
});

test("Phase 3 operations use server functions and Supabase Realtime", () => {
  const source = read("src/components/admin/Phase3OperationsOS.tsx");
  const server = read("src/lib/operations.functions.ts");
  assert.match(source, /useServerFn/);
  assert.match(source, /postgres_changes/);
  assert.match(source, /table: "crm_leads"/);
  assert.match(source, /table: "crm_payments"/);
  assert.match(server, /requireSupabaseAuth/);
  assert.match(server, /admin_has_permission/);
  assert.match(server, /z\.object/);
  assert.match(server, /admin_record_invoice_payment/);
});

test("CRM pipeline preserves contact and briefing source records", () => {
  const migration = read("supabase/migrations/20260922160000_phase3_operations_os.sql");
  assert.match(migration, //create table if not exists public\\.crm_leads/i/);
  assert.match(migration, /source_type text not null check/);
  assert.match(migration, /ensure_crm_lead_from_source/);
  assert.match(migration, /trg_ensure_crm_lead_contact/);
  assert.match(migration, /trg_ensure_crm_lead_briefing/);
});

test("Phase 3 provides a unified operational inbox and audience surface", () => {
  const migration = read("supabase/migrations/20260922160000_phase3_operations_os.sql");
  const server = read("src/lib/operations.functions.ts");
  assert.match(migration, //create view public\\.crm_inbox/i/);
  for (const kind of ["briefing", "contact", "booking", "subscriber", "studio_waitlist"]) {
    assert.ok(migration.includes("'" + kind + "'"), kind);
  }
  assert.match(server, /listAdminInbox/);
  assert.match(server, /listAdminAudience/);
  assert.match(server, /exportAdminAudience/);
});

test("Phase 3 finance is transactional and linked to invoice lifecycle", () => {
  const migration = read("supabase/migrations/20260922160000_phase3_operations_os.sql");
  const server = read("src/lib/operations.functions.ts");
  assert.match(migration, //create table if not exists public\\.crm_payments/i/);
  assert.match(migration, /admin_record_invoice_payment/);
  assert.match(migration, /for update/);
  assert.match(migration, /invoice_status=v_status/);
  assert.match(server, /recordInvoicePayment/);
});

test("Phase 3 bookings preserve legacy status compatibility", () => {
  const migration = read("supabase/migrations/20260922160000_phase3_operations_os.sql");
  assert.match(migration, /booking_status/);
  assert.match(migration, /sync_booking_status_compatibility/);
  assert.match(migration, /requested.*new/);
  assert.match(migration, /confirmed.*accepted/);
  assert.match(migration, /cancelled.*closed/);
});

test("Phase 3 permissions remain server and RLS enforced", () => {
  const migration = read("supabase/migrations/20260922160000_phase3_operations_os.sql");
  for (const permission of ["leads.read", "leads.write", "finance.read", "finance.write"]) {
    assert.ok(migration.includes(permission), permission);
  }
  assert.match(migration, //alter table public\\.crm_leads enable row level security/i/);
  assert.match(migration, //alter table public\\.crm_payments enable row level security/i/);
});
