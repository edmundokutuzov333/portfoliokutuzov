import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

test("Control Room exposes the exact final navigation architecture", () => {
  const source = read("src/components/admin/AdminControlRoom.tsx");
  const start = source.indexOf("const allItems = [");
  const end = source.indexOf("  ] as const;", start);
  assert.ok(start >= 0 && end > start, "allItems navigation block must exist");
  const nav = source.slice(start, end);

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

  const forbidden = [
    "Studio Logos",
    "Studio Intelligence",
    "Media Library",
    "Site Content",
    "Operations OS",
    "Legacy Inbox",
    "Invoicing",
    "Audit Center",
    "Release Center",
  ];

  for (const label of required) assert.match(nav, new RegExp('label: "' + label.replace(/[.*+?^$()|[\]\\]/g, "\\$&") + '"'));
  for (const label of forbidden) assert.doesNotMatch(nav, new RegExp('label: "' + label.replace(/[.*+?^$()|[\]\\]/g, "\\$&") + '"'));
});

test("Advanced is a technical surface and no longer mounts the raw JSON editor", () => {
  const source = read("src/components/admin/AdminControlRoom.tsx");
  assert.match(source, /System diagnostics/);
  assert.match(source, /Cache and state recovery/);
  assert.match(source, /Event inspection/);
  assert.match(source, /Global technical search/);
  assert.match(source, /section === "advanced" && <AdvancedControlCenter onNavigate=\{requestSection\} \/>/);
  assert.doesNotMatch(source, /Raw JSON editing for every setting key/);
});

test("Focused operations and Studio destinations are wired to existing live modules", () => {
  const admin = read("src/components/admin/AdminControlRoom.tsx");
  const operations = read("src/components/admin/Phase3OperationsOS.tsx");
  const studio = read("src/components/admin/StudioIntelligenceSurface.tsx");

  assert.match(admin, /section === "leads" && <Phase3OperationsOS initialTab="leads"/);
  assert.match(admin, /section === "newsletter" && <Phase3OperationsOS initialTab="audience" audienceMode="newsletter"/);
  assert.match(admin, /section === "studioWaitlist" && <Phase3OperationsOS initialTab="audience" audienceMode="studio"/);
  assert.match(admin, /section === "payments" && <Phase3OperationsOS initialTab="finance" financeMode="payments"/);
  assert.match(admin, /section === "studioLibrary" && <StudioAdminPage initialTab="library"/);
  assert.match(admin, /section === "studioAI" && <StudioAdminPage initialTab="ai"/);
  assert.match(operations, /initialTab = "overview"/);
  assert.match(operations, /audienceMode?: "all" | "newsletter" | "studio"/);
  assert.match(operations, /listAdminPayments/);
  assert.match(studio, /initialTab?: Tab/);
});

test("Global search routes to canonical Control Room destinations", () => {
  const source = read("src/lib/admin.phase4.functions.ts");
  assert.match(source, /type:"Lead", target:"leads"/);
  assert.match(source, /type:"Invoice", target:"invoices"/);
  assert.match(source, /const canFinanceRead =/);
  assert.ok(source.indexOf("const canFinanceRead =") < source.indexOf("if (row.key === \"invoice_settings\""));
});