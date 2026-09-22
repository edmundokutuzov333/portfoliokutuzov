import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("Phase 4 creates a governed release workflow", () => {
  const migration = read("supabase/migrations/20260922180000_phase4_control_room_2.sql");
  const fn = read("src/lib/admin.phase4.functions.ts");
  const ui = read("src/components/admin/Phase4ControlRoom.tsx");
  const route = read("src/routes/admin.preview.tsx");
  assert.match(migration, /admin_drafts/);
  assert.match(migration, /admin_publish_drafts/);
  assert.match(migration, /baseline_updated_at/);
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
  assert.match(dirty, /beforeunload/); // may be held by component, keep registry API itself tested below
  assert.match(dirty, /hasAdminDirty/);
  assert.match(admin, /lazy/);
  assert.match(admin, /Phase2AdminSurface/);
  assert.match(admin, /PortfolioModule/);
  assert.match(admin, /Unsaved changes/);
  assert.match(portfolio, /setAdminDirty/);
  assert.match(portfolio, /JSON.stringify\(form\)/);
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
  assert.match(restore, /GRANT EXECUTE ON FUNCTION public\.admin_restore_audit_state/);
});
