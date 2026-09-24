import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

async function read(relativePath: string) {
  return readFile(path.join(root, relativePath), "utf8");
}

function count(text: string, needle: string) {
  return text.split(needle).length - 1;
}

describe("Phase 15 final product regression", () => {
  it("preserves the required public routes and PT mirrors", async () => {
    const routes = [
      "src/routes/index.tsx",
      "src/routes/portfolio.index.tsx",
      "src/routes/portfolio.$slug.tsx",
      "src/routes/services.tsx",
      "src/routes/credentials.tsx",
      "src/routes/contact.tsx",
      "src/routes/studio.tsx",
      "src/routes/admin.tsx",
      "src/routes/admin.studio.tsx",
      "src/routes/pt.tsx",
      "src/routes/pt.portfolio.tsx",
      "src/routes/pt.services.tsx",
      "src/routes/pt.credentials.tsx",
      "src/routes/pt.contact.tsx",
      "src/routes/pt.studio.tsx",
    ];

    for (const route of routes) {
      await expect(read(route)).resolves.toMatch(/create(File|LazyFile)Route|createRootRoute/);
    }
  });

  it("renders the Home H1 exactly once and keeps the canonical copy", async () => {
    const source = await read("src/components/home/HomePhase5.tsx");
    const headline = "I shape ideas that cut through noise, stay in memory, and move people.";
    expect(count(source, headline)).toBe(1);
  });

  it("keeps the Studio prelaunch contract exact and minimal", async () => {
    const source = await read("src/routes/studio.tsx");
    expect(source).toContain("A studio still finding its lines.");
    const normalized = source.replace(/\s+/g, " ");
expect(normalized).toContain("Kutuzov Studio is where the tools I build for myself live - composed privately, tested in full, and released only once every line holds up in public.");
    expect(source).toContain("Private, by invitation");
    expect(source).toContain("Maputo / 2026");
  });

  it("keeps the Reel 3D interaction accessible", async () => {
    const source = await read("src/components/ui/cinematic-portfolio-reel.tsx");
    expect(source).toContain('role="group"');
    expect(source).toContain('aria-roledescription="slide"');
    expect(source).toContain("onKeyDown");
    expect(source).toContain("sendBeacon");
    expect(source).toContain("IntersectionObserver");
    expect(source).toContain("useReducedMotion");
  });

  it("keeps server-only API routes on Node runtime", async () => {
    const routes = [
      "src/routes/api.credentials.press-kit.pdf.ts",
      "src/routes/api.portfolio-case-study.ts",
      "src/routes/api.portfolio.$slug.og.ts",
      "src/routes/api.portfolio.$slug.pdf.ts",
      "src/routes/api.reel-analytics.ts",
    ];

    for (const route of routes) {
      const source = await read(route);
      expect(source).toContain('export const runtime = "nodejs";');
    }
  });

  it("keeps Admin surfaces out of indexing", async () => {
    const vercel = await read("vercel.json");
    const adminRoute = await read("src/routes/admin.tsx");
    const studioRoute = await read("src/routes/admin.studio.tsx");
    expect(vercel).toContain('"X-Robots-Tag"');
    expect(vercel).toContain("noindex, nofollow");
    expect(adminRoute).toContain("noindex, nofollow");
    expect(studioRoute).toContain("noindex,nofollow,noarchive");
  });

  it("uses enforcing CSP on the final release configuration", async () => {
    const vercel = await read("vercel.json");
    expect(vercel).toContain('"key": "Content-Security-Policy"');
    expect(vercel).not.toContain('"key": "Content-Security-Policy-Report-Only"');
  });

  it("keeps the Phase 14 security and CMS foundations reversible", async () => {
    const migration = await read("supabase/migrations/20260924150000_phase14_admin_security_media.sql");
    const rollback = await read("supabase/rollbacks/20260924150000_phase14_admin_security_media.down.sql");
    const cmsMigration = await read("supabase/migrations/20260924153000_phase14_content_registry.sql");
    const cmsRollback = await read("supabase/rollbacks/20260924153000_phase14_content_registry.down.sql");

    expect(migration).toContain("mfa_required");
    expect(migration).toContain("submit_booking_request");
    expect(rollback).toContain("drop function if exists public.submit_booking_request");
    expect(cmsMigration).toContain("faq_entries");
    expect(cmsMigration).toContain("testimonials");
    expect(cmsMigration).toContain("site_metrics");
    expect(cmsRollback).toContain("drop table if exists public.site_metrics");
  });

  it("keeps the native media optimization path dependency-free", async () => {
    const helper = await read("src/lib/media-optimization.ts");
    const packageJson = await read("package.json");
    expect(helper).toContain("createImageBitmap");
    expect(helper).toContain("image/webp");
    expect(helper).toContain("image/avif");
    expect(packageJson).not.toMatch(/"sharp"\s*:/);
  });

  it("keeps MFA compatible with password managers", async () => {
    const source = await read("src/components/admin/AdminMfaSecurity.tsx");
    expect(source).toContain("supabase.auth.mfa.enroll");
    expect(source).toContain("supabase.auth.mfa.challenge");
    expect(source).toContain("supabase.auth.mfa.verify");
    expect(source).toContain(`autoComplete="one-time-code"`);
  });

  it("keeps the contact dossier at five explicit steps", async () => {
    const source = await read("src/components/contact/ContactPagePhase11.tsx");
    for (const step of ["Identity", "Project", "Budget", "Timing", "References"]) {
      expect(source).toContain(step);
    }
  });

  it("keeps the four service disciplines and the empty-safe FAQ contract", async () => {
    const services = await read("src/components/services/ServicesPagePhase9.tsx");
    const migration = await read("supabase/migrations/20260924153000_phase14_content_registry.sql");
    expect(services).toContain("Visual capabilities");
    expect(migration).toContain("faq_entries");
    expect(services).toContain("/contact");
  });
});
