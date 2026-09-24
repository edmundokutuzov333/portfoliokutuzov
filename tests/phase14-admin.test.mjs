import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const read=(path)=>readFile(new URL("../"+path,import.meta.url),"utf8");

test("Phase 14 security migration hardens public writes and adds MFA boundary", async () => {
  const sql=await read("supabase/migrations/20260924150000_phase14_admin_security_media.sql");
  const down=await read("supabase/rollbacks/20260924150000_phase14_admin_security_media.down.sql");
  for(const token of ["mfa_required","aal2","submit_booking_request","authenticated","admin_has_permission","media.manage","optimized_webp_url","optimized_avif_url","dominant_color"]) assert.match(sql,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
  for(const token of ["drop function if exists public.submit_booking_request","drop column if exists optimized_webp_url","drop column if exists optimized_avif_url","drop column if exists mfa_required","create or replace function public.is_admin"]) assert.match(down,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
});

test("Phase 14 RLS migration removes direct public submission paths", async()=>{
  const sql=await read("supabase/migrations/20260924150000_phase14_admin_security_media.sql");
  for(const table of ["booking_requests","briefing_submissions","contact_requests","newsletter_subscribers"]) {
    assert.match(sql,new RegExp("drop policy if exists.*anyone.*("+table+")","i"));
    assert.match(sql,new RegExp("for (select|update|delete) to authenticated.*admin_has_permission","i"));
  }
  assert.match(sql,/grant execute on function public.submit_booking_request\(text,text,date,text,text,text\) to anon, authenticated/);
});

test("Phase 14 TOTP path is password-manager and accessibility friendly", async()=>{
  const ui=await read("src/components/admin/AdminMfaSecurity.tsx");
  assert.match(ui,/supabase\.auth\.mfa\.enroll/);
  assert.match(ui,/supabase\.auth\.mfa\.challenge/);
  assert.match(ui,/supabase\.auth\.mfa\.verify/);
  assert.match(ui,/autoComplete="one-time-code"/);
  assert.match(ui,/inputMode="numeric"/);
  assert.doesNotMatch(ui,/captcha|security question|cognitive/i);
});

test("Phase 14 media pipeline is native and dependency-free", async()=>{
  const helper=await read("src/lib/media-optimization.ts");
  const packageJson=await read("package.json");
  assert.match(helper,/createImageBitmap/);
  assert.match(helper,/image\/webp/);
  assert.match(helper,/image\/avif/);
  assert.match(helper,/getImageData/);
  assert.doesNotMatch(packageJson,/"sharp"\s*:/);
});

test("Phase 14 admin analytics exposes leads, subscribers, reel and chatbot series", async()=>{
  const fn=await read("src/lib/admin.phase4.functions.ts");
  const ui=await read("src/components/admin/Phase4ControlRoom.tsx");
  for(const token of ["leads_daily","subscribers_daily","reel","chatbot","handoff_rate"]) assert.match(fn,new RegExp(token));
  for(const token of ["ResponsiveContainer","LineChart","Leads over time","Subscribers over time","Reel engagement","Chatbot activity"]) assert.match(ui,new RegExp(token));
});

test("Phase 14 Reel registry has reversible seed and public fallback", async()=>{
  const sql=await read("supabase/migrations/20260924155000_phase14_reel_registry.sql");
  const down=await read("supabase/rollbacks/20260924155000_phase14_reel_registry.down.sql");
  const reel=await read("src/components/ui/cinematic-portfolio-reel.tsx");
  assert.match(sql,/create table if not exists public\.reel_items/);
  assert.match(sql,/insert into public\.reel_items/);
  assert.match(sql,/create table if not exists public\.reel_analytics/);
  assert.match(down,/drop table if exists public\.reel_items/);
  assert.match(reel,/from\("reel_items"\)/);
  assert.match(reel,/roundRobin/);
});

test("Phase 14 structured CMS is empty-safe and bilingual", async()=>{
  const migration=await read("supabase/migrations/20260924153000_phase14_content_registry.sql");
  const ui=await read("src/components/admin/ContentRegistryManager.tsx");
  const fn=await read("src/lib/admin.content-registry.functions.ts");
  for(const table of ["faq_entries","testimonials","site_metrics"]) assert.match(migration,new RegExp(table));
  assert.match(ui,/No real entries exist yet/);
  assert.match(fn,/question_pt/);
  assert.match(fn,/quote_pt/);
  assert.match(fn,/value_pt/);
});

test("Phase 14 Admin Studio stays out of indexing and keeps internal component logic", async()=>{
  const route=await read("src/routes/admin.studio.tsx");
  const surface=await read("src/components/admin/StudioIntelligenceSurface.tsx");
  const css=await read("src/styles/admin-studio-phase14.css");
  assert.match(route,/noindex,nofollow,noarchive/);
  assert.match(surface,/data-admin-studio/);
  assert.match(css,/--admin-studio-work/);
});

test("Phase 14 public submission code no longer inserts booking directly", async()=>{
  const modal=await read("src/components/contact/BookingModal.tsx");
  assert.doesNotMatch(modal,/from\("booking_requests"\)\.insert/);
  assert.match(modal,/submit_booking_request/);
});
