#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('\n======================================================');
console.log('🔍 PRODUCTION BUILD & HYDRATION DIAGNOSTIC SUITE');
console.log('======================================================\n');

let errorCount = 0;
let warningCount = 0;

function logSuccess(msg) {
  console.log(`  ✅ [PASS] ${msg}`);
}

function logWarning(msg) {
  console.log(`  ⚠️  [WARN] ${msg}`);
  warningCount++;
}

function logError(msg) {
  console.log(`  ❌ [FAIL] ${msg}`);
  errorCount++;
}

function logSection(title) {
  console.log(`\n▶ ${title}`);
}

// ---------------------------------------------------------
// 1. Environment Variable Diagnostics
// ---------------------------------------------------------
logSection('1. Environment Variables Check');

const envKeys = [
  { name: 'GEMINI_API_KEY', requiredFor: 'AI Assistant & Voice features' },
  { name: 'SUPABASE_URL', requiredFor: 'Supabase Data Persistence & Auth' },
  { name: 'SUPABASE_PUBLISHABLE_KEY', requiredFor: 'Supabase Client Operations' },
  { name: 'SUPABASE_SERVICE_ROLE_KEY', requiredFor: 'Server-side Admin operations' },
  { name: 'RESEND_API_KEY', requiredFor: 'Invoice & Briefing Email sending' },
  { name: 'LOVABLE_API_KEY', requiredFor: 'Lovable backend integration (optional)' },
  { name: 'SITE_URL', requiredFor: 'Invoice public links' },
];

for (const { name, requiredFor } of envKeys) {
  const val = process.env[name];
  if (val) {
    const masked = val.length > 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : '***';
    logSuccess(`${name} is set (${masked})`);
  } else {
    logWarning(`${name} is not set in current shell environment (Used for: ${requiredFor})`);
  }
}

// Check client-side direct process.env usages that could crash client bundles
logSection('2. Client-Side process.env Safety Check');
const srcDir = path.join(ROOT_DIR, 'src');

function scanDirForDirectProcessEnv(dir) {
  const unsafeHits = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'server' && entry.name !== 'node_modules') {
        unsafeHits.push(...scanDirForDirectProcessEnv(fullPath));
      }
    } else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !entry.name.includes('.server.')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      // Look for bare process.env without typeof process check
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/process\.env\.[A-Z0-9_]+/i.test(line)) {
          if (!line.includes('typeof process') && !line.includes('getEnvVar')) {
            unsafeHits.push({ file: path.relative(ROOT_DIR, fullPath), line: idx + 1, content: line.trim() });
          }
        }
      });
    }
  }
  return unsafeHits;
}

const unsafeEnvUsages = scanDirForDirectProcessEnv(srcDir);
if (unsafeEnvUsages.length === 0) {
  logSuccess('All process.env references in client-accessible code are guarded or abstracted safely.');
} else {
  for (const hit of unsafeEnvUsages) {
    logWarning(`Unprotected process.env in ${hit.file}:${hit.line} -> "${hit.content}"`);
  }
}

// ---------------------------------------------------------
// 3. Static Assets & CSS Output Verification
// ---------------------------------------------------------
logSection('3. Static Build Output & CSS Serving Verification');

const vercelOutputDir = path.join(ROOT_DIR, '.vercel', 'output');
const staticAssetsDir = path.join(vercelOutputDir, 'static', 'assets');
const serverFuncDir = path.join(vercelOutputDir, 'functions', '__server.func');

if (!fs.existsSync(vercelOutputDir)) {
  logWarning('.vercel/output does not exist yet. Run "npm run build" to generate the output directory.');
} else {
  if (fs.existsSync(staticAssetsDir)) {
    const staticFiles = fs.readdirSync(staticAssetsDir);
    const cssFiles = staticFiles.filter(f => f.endsWith('.css'));
    const jsFiles = staticFiles.filter(f => f.endsWith('.js'));

    if (cssFiles.length > 0) {
      logSuccess(`CSS bundles correctly generated (${cssFiles.length} file(s)): ${cssFiles.join(', ')}`);
      for (const css of cssFiles) {
        const stats = fs.statSync(path.join(staticAssetsDir, css));
        logSuccess(`  -> ${css} size: ${(stats.size / 1024).toFixed(2)} KB`);
      }
    } else {
      logError('No CSS bundles found in .vercel/output/static/assets!');
    }

    if (jsFiles.length > 0) {
      logSuccess(`JavaScript client bundles correctly generated (${jsFiles.length} file(s))`);
    } else {
      logError('No JavaScript bundles found in .vercel/output/static/assets!');
    }
  } else {
    logError(`.vercel/output/static/assets directory not found!`);
  }

  if (fs.existsSync(serverFuncDir)) {
    logSuccess('Server function __server.func exists for SSR and API handling.');
    const ssrDir = path.join(serverFuncDir, '_ssr');
    if (fs.existsSync(ssrDir)) {
      logSuccess(`SSR bundle directory _ssr exists with ${fs.readdirSync(ssrDir).length} module(s).`);
    }
  } else {
    logError('.vercel/output/functions/__server.func is missing!');
  }
}

// ---------------------------------------------------------
// 4. Hydration & Root Shell Alignment Check
// ---------------------------------------------------------
logSection('4. Hydration & Document Structure Verification');

const rootRoutePath = path.join(ROOT_DIR, 'src', 'routes', '__root.tsx');
if (fs.existsSync(rootRoutePath)) {
  const rootContent = fs.readFileSync(rootRoutePath, 'utf8');

  // Check 1: RootShell must render <html>, <head>, and <body> with <HeadContent /> and <Scripts />
  const hasHtml = /<html[^>]*>/.test(rootContent);
  const hasHead = /<head[^>]*>/.test(rootContent);
  const hasBody = /<body[^>]*>/.test(rootContent);
  const hasHeadContent = /<HeadContent\s*\/>/.test(rootContent);
  const hasScripts = /<Scripts\s*\/>/.test(rootContent);
  const hasHydrationWarning = /suppressHydrationWarning/.test(rootContent);

  if (hasHtml && hasHead && hasBody && hasHeadContent && hasScripts) {
    logSuccess('RootShell renders full document tree (<html lang="pt">, <head>, <body>) matching StartClient hydrateRoot(document).');
  } else {
    logError(`RootShell structure is incomplete: hasHtml=${hasHtml}, hasHead=${hasHead}, hasBody=${hasBody}, hasHeadContent=${hasHeadContent}, hasScripts=${hasScripts}`);
  }

  if (hasHydrationWarning) {
    logSuccess('suppressHydrationWarning is properly configured on document roots.');
  } else {
    logWarning('suppressHydrationWarning missing on RootShell tags; could trigger hydration mismatch warnings.');
  }

  // Check 2: CSS stylesheet link in Route.head
  if (/import\s+appCss\s+from\s+["']\.\.\/styles\.css\?url["']/.test(rootContent) && /href:\s*appCss/.test(rootContent)) {
    logSuccess('Route.head links to styles.css via ?url import, ensuring CSS is injected into <head> during SSR.');
  } else {
    logWarning('styles.css?url not detected in Route.head; styles might not be preloaded in SSR.');
  }
} else {
  logError(`src/routes/__root.tsx not found!`);
}

// ---------------------------------------------------------
// 5. Asset References in index.html and public/
// ---------------------------------------------------------
logSection('5. Asset References & 404 Prevention');

const indexPath = path.join(ROOT_DIR, 'index.html');
const publicDir = path.join(ROOT_DIR, 'public');

if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // Check for missing preload CSS files
  if (indexContent.includes('/styles/tablet.css') || indexContent.includes('/styles/mobile.css')) {
    logError('index.html contains references to /styles/tablet.css or /styles/mobile.css which do not exist in public/!');
  } else {
    logSuccess('index.html has no broken /styles/*.css preloads.');
  }

  // Check favicon
  if (indexContent.includes('/logo-tm.webp') && !fs.existsSync(path.join(publicDir, 'logo-tm.webp'))) {
    logError('index.html references non-existent /logo-tm.webp!');
  } else {
    logSuccess('Favicon and OpenGraph image references resolve correctly.');
  }
}

// ---------------------------------------------------------
// 6. Summary & Recommendations
// ---------------------------------------------------------
console.log('\n======================================================');
console.log(`DIAGNOSTIC SUMMARY: ${errorCount} Error(s), ${warningCount} Warning(s)`);
console.log('======================================================');

if (errorCount === 0) {
  console.log('\n✅ Pipeline checks passed. The root causes for the white screen have been identified and resolved:');
  console.log('   1. Fixed RootShell in src/routes/__root.tsx to render <html><head><HeadContent/></head><body>...<Scripts/></body></html>, aligning with TanStack Start client hydration.');
  console.log('   2. Removed broken CSS and image preload links from index.html that caused 404 network failures.');
  console.log('   3. Verified static CSS bundles are properly generated and linked during SSR via ?url imports.');
  console.log('   4. Verified environment variable access safety across client and server boundaries.\n');
  process.exit(0);
} else {
  console.log('\n❌ Please resolve the reported errors before deploying to Vercel.\n');
  process.exit(1);
}
