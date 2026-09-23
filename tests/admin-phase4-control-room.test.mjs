import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Phase 4 creates a governed release workflow", () => {
  const migration = read("supabase/migrations/20260922180000_phase4_control_room_2.sql");
  const integrity = read("supabase/migrations/20260922190000_phase4_draft_entity_integrity.sql");
  const fn = read("src/lib/admin.phase4.functions.ts");
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  const route = read("src/routes/admin.preview.tsx");
  assert.match(migration, /admin_drafts/);
  assert.match(migration, /admin_publish_drafts/);
  assert.match(migration, /baseline_updated_at/);
  assert.match(integrity, /20001|22023|Draft payload id does not match entity id|payload.*entity id/);
  assert.match(migration, /40001/);
  assert.match(fn, /createAdminDraft/);
  assert.match(fn, /submitAdminDraftForReview/);
  assert.match(fn, /publishAdminDrafts/);
  assert.match(fn, /getAdminPreviewBundle/);
  assert.match(ui, /ReleaseCenter/);
  assert.match(ui, /Live preview/);
  assert.match(ui, /Compare with live baseline/);
  assert.match(ui, /Unsaved changes/);
  assert.match(route, /validateSearch/);
  assert.match(route, /AdminDraftPreviewPage/);
});

test("Admin preview route rejects invalid identifiers without throwing route validation errors", () => {
  const route = read("src/routes/admin.preview.tsx");
  assert.match(route, /draft: z\.string\(\)\.optional\(\)/);
  assert.match(route, /!draft \|\| !isUuid\(draft\)/);
  assert.match(route, /Invalid preview request/);
  assert.doesNotMatch(route, /draft: z\.string\(\)\.uuid\(\)/);
});

test("Phase 4 has a global command palette and audit center", () => {
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  const fn = read("src/lib/admin.phase4.functions.ts");
  assert.match(ui, /Search everything/);
  assert.match(ui, /ArrowDown/);
  assert.match(ui, /aria-modal/);
  assert.match(ui, /AuditCenter/);
  assert.match(ui, /Restore this state/);
  assert.match(fn, /globalAdminSearch/);
  assert.match(fn, /getAdminAuditLogPhase4/);
  assert.match(fn, /restoreAdminAuditState/);
});

test("Phase 4 has global unsaved-change protection and lazy admin workspaces", () => {
  const dirty = read("src/lib/admin-dirty.ts");
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const portfolio = read("src/components/admin/PortfolioModule.tsx");
  assert.match(dirty, /hasAdminDirty/);
  assert.match(dirty, /beforeunload/);
  assert.match(admin, /lazy/);
  assert.match(admin, /Phase2AdminSurface/);
  assert.match(admin, /PortfolioModule/);
  assert.match(admin, /Unsaved changes/);
  assert.match(portfolio, /setAdminDirty/);
  assert.match(portfolio, /JSON.stringify\(form\)/);
});

test("Phase 4 integrates Studio Intelligence and global Analytics into the Control Room", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  const studioRoute = read("src/routes/admin.studio.tsx");
  const studioSurface = read("src/components/admin/StudioIntelligenceSurface.tsx");
  assert.match(admin, /StudioAdminPage/);
  assert.match(admin, /studioOverview/);
  assert.match(admin, /studioLibrary/);
  assert.match(admin, /studioAI/);
  assert.match(admin, /Analytics/);
  assert.match(ui, /AnalyticsCenter/);
  assert.match(ui, /getAdminAnalyticsOverview/);
  assert.match(studioRoute, /StudioIntelligenceSurface/);
  assert.match(studioSurface, /StudioAdminPage/);
});

test("Phase 4 Users & Roles is server-enforced", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  const server = read("src/lib/admin.phase4.functions.ts");
  assert.match(admin, /Users & Roles/);
  assert.match(ui, /UsersRolesCenter/);
  assert.match(server, /system\.users\.manage/);
  assert.match(server, /Only an owner can assign the owner role/);
});

test("Phase 4 public-data realtime coverage includes services, stats and about_method", () => {
  const siteData = read("src/hooks/useSiteData.ts");
  assert.match(siteData, /useRealtimeInvalidate\("services"/);
  assert.match(siteData, /useRealtimeInvalidate\("stats"/);
  assert.match(siteData, /useRealtimeInvalidate\("about_method"/);
});

test("Phase 4 database security keeps sensitive admin operations behind permissions", () => {
  const migration = read("supabase/migrations/20260922180000_phase4_control_room_2.sql");
  const restore = read("supabase/migrations/20260922181500_phase4_restore_directory.sql");
  assert.match(migration, /admin_has_permission\('content.write'\)/);
  assert.match(migration, /admin_system_health_db/);
  assert.match(restore, /admin_restore_audit_state/);
  assert.match(restore, /auth\.uid\(\)/);
  const kernel = read("supabase/migrations/20260922110000_admin_control_kernel.sql");
  assert.match(kernel, /WHEN 'INSERT' THEN 'create'/);
  assert.match(restore, /GRANT EXECUTE ON FUNCTION public\.admin_restore_audit_state/);
  const server = read("src/lib/admin.phase4.functions.ts");
  assert.match(server, /finance\.read/);
  assert.match(server, /invoice_settings/);
});


test("Phase 4 final hardening keeps finance drafts private and realtime coverage complete", () => {
  const migration = read("supabase/migrations/20260922200000_phase4_final_hardening.sql");
  assert.match(migration, /admins read admin drafts/);
  assert.match(migration, /finance.read/);
  assert.match(migration, /finance.write/);
  assert.match(migration, /expected_tables',17/);
  assert.match(migration, /media_assets/);
  assert.match(migration, /admin_drafts/);
});

test("Phase 4 global admin shortcut is wired", () => {
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  assert.match(ui, /event.metaKey \|\| event.ctrlKey/);
  assert.match(ui, /event\.key\.toLowerCase\(\) === "k"/);
  assert.match(ui, /setSearchOpen\(true\)/);
});

test("Control Room navigation matches the final architecture", () => {
  const ui = read("src/components/admin/AdminControlRoom.tsx");
  const required = [
    "Overview",
    "Homepage",
    "Navigation",
    "About",
    "Credentials",
    "Services",
    "Contact",
    "SEO",
    "Global Settings",
    "Portfolio",
    "Clients",
    "Media",
    "Inbox",
    "Leads",
    "Bookings",
    "Newsletter",
    "Studio Waitlist",
    "Invoices",
    "Payments",
    "Invoice settings",
    "Studio Overview",
    "Card Library",
    "Generation",
    "Exports",
    "Email",
    "Digital Cards",
    "AI",
    "Analytics",
    "History",
    "Audit Log",
    "Users & Roles",
    "System Health",
    "Advanced",
  ];
  for (const label of required) assert.match(ui, new RegExp('label: "' + label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + '"'));
  for (const legacy of [
    'label: "Studio Logos"',
    'label: "Studio Intelligence"',
    'label: "Site Content"',
    'label: "Operations OS"',
    'label: "Legacy Inbox"',
    'label: "Invoicing"',
    'label: "Audit Center"',
    'label: "Release Center"',
  ]) assert.doesNotMatch(ui, new RegExp(legacy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.doesNotMatch(ui, /AdvancedJSONManager/);
  assert.match(ui, /AdvancedControlCenter/);
  assert.doesNotMatch(ui, /section === "(site|studios|studio|operations|invoice|release)"/);
  assert.doesNotMatch(ui, /requestSection\("release"\)/);
  assert.match(ui, /releaseOpen/);
  assert.match(ui, /ReleaseCenter/);
});
test("Phase 4 restore is bound to the selected immutable audit snapshot", () => {
  const migration = read("supabase/migrations/20260923100000_phase4_restore_snapshot_integrity.sql");
  assert.match(migration, /SELECT \* INTO audit_row/);
  assert.match(migration, /audit_row\.entity_type IS DISTINCT FROM p_entity_type/);
  assert.match(migration, /audit_row\.entity_id IS DISTINCT FROM p_entity_id/);
  assert.match(migration, /p_snapshot IS NOT DISTINCT FROM audit_row\.before_data/);
  assert.match(migration, /p_snapshot IS NOT DISTINCT FROM audit_row\.after_data/);
  assert.match(migration, /Restore snapshot does not match the selected audit event/);
  assert.match(migration, /verified_snapshot/);
});
