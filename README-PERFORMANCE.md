# Performance & Security Optimization Guide

This repository includes production-ready performance optimizations for static React + Vite sites.

## Quick Start

```bash
# Development
npm run dev

# Optimize images (run before build)
npm run optimize:images

# Production build
npm run build

# Analyze bundle sizes
npm run analyze

# Preview production build
npm run preview
```

## Features

### 1. Image Optimization (`scripts/optimize-images.js`)

Automatically generates responsive images in multiple formats:

- **Formats**: AVIF, WebP, JPEG (progressive fallback)
- **Sizes**: 320, 480, 720, 1080, 1600px widths
- **LQIP**: Low-quality image placeholders for blur-up effect
- **Output**: `public/_img/optimized/` + `manifest.json`

**Usage:**

```bash
# Place source images in:
src/assets/images/

# Run optimization:
npm run optimize:images

# Output:
public/_img/optimized/
├── hero/
│   ├── hero-320.avif
│   ├── hero-320.webp
│   ├── hero-320.jpg
│   └── ... (all sizes)
└── manifest.json
```

### 2. Optimized Image Component (`src/components/ImageOptimized.tsx`)

React component that automatically uses optimized images:

```tsx
import { ImageOptimized, preloadOptimizedImage } from '@/components/ImageOptimized';

// Basic usage
<ImageOptimized name="hero" alt="Hero image" />

// With options
<ImageOptimized
  name="hero"
  alt="Hero image"
  sizes="(min-width: 1024px) 1024px, 100vw"
  priority={true}  // Disables lazy loading
  className="w-full"
/>

// Preload critical images
useEffect(() => {
  preloadOptimizedImage('hero');
}, []);
```

Features:

- Automatic AVIF → WebP → JPEG fallback
- Responsive srcset for all breakpoints
- Lazy loading with LQIP blur placeholder
- Graceful fallback if manifest unavailable

### 3. Edge Cache Worker (`worker/edge-cache-worker.js`)

Cloudflare Worker for optimal caching and security:

**Caching Strategy:**

- Static assets (JS, CSS, images): 1 year immutable
- HTML: No browser cache, 60s edge cache with 3-day stale-while-revalidate

**Security Headers:**

- Strict CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: restrictive defaults

**Blocked Paths:**

- `/wp-admin`, `/.git`, `/.env`, `/phpinfo`, etc.

**Deployment:**

1. Create Cloudflare Worker
2. Paste `worker/edge-cache-worker.js`
3. Add route: `yourdomain.com/*`

### 4. Service Worker (`public/service-worker.js`)

Client-side caching for offline support:

**Strategies:**

- **HTML**: Network-first (fresh content)
- **Assets**: Cache-first (fast loading)
- **API calls**: Network-only (no caching)

**Registration (add to main.tsx):**

```tsx
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js");
  });
}
```

### 5. CI/CD Pipeline (`.github/workflows/ci.yml`)

Automated build and deployment:

**Jobs:**

1. `build-optimize`: Install → Optimize images → Build → Analyze
2. `lighthouse`: Performance audit (optional)
3. `deploy-cloudflare`: Deploy to Cloudflare Pages
4. `security`: npm audit + secret scanning

**Required Secrets:**

```
CLOUDFLARE_API_TOKEN  # For Cloudflare deployment
CF_ACCOUNT_ID         # Cloudflare account ID
```

**Optional Variables:**

```
DEPLOY_DOMAIN         # For Lighthouse audits
```

### 6. Bundle Analyzer (`scripts/analyze.js`)

Analyze build output sizes:

```bash
npm run analyze
```

Output:

- File sizes by category (JS, CSS, images, fonts)
- Warnings for files > 100KB
- Errors for files > 250KB
- Optimization tips

## Performance Checklist

### Build Time

- [x] Image optimization (AVIF/WebP)
- [x] Code splitting (vendor chunks)
- [x] Tree shaking
- [x] CSS minification
- [x] No source maps in production

### Runtime

- [x] Lazy loading for images
- [x] LQIP blur placeholders
- [x] Service worker caching
- [x] Preconnect/preload hints
- [x] Responsive images

### Security

- [x] Strict CSP headers
- [x] HSTS enabled
- [x] X-Frame-Options: DENY
- [x] Blocked malicious paths
- [x] No analytics by default

## Adding Images

1. Place source images in `src/assets/images/`
2. Run `npm run optimize:images`
3. Use `<ImageOptimized name="filename" alt="..." />`

## Customization

### Change Image Sizes

Edit `scripts/optimize-images.js`:

```js
const SIZES = [320, 480, 720, 1080, 1600];
```

### Change Quality Settings

```js
const QUALITY = {
  avif: 50, // Lower = smaller files
  webp: 70,
  jpeg: 75,
};
```

### Modify CSP

Edit `worker/edge-cache-worker.js`:

```js
const CSP_POLICY = [
  "default-src 'self'",
  // Add your domains...
];
```

## Deployment Options

### Lovable (Default)

No additional configuration needed.

### Cloudflare Pages

1. Add secrets: `CLOUDFLARE_API_TOKEN`, `CF_ACCOUNT_ID`
2. Push to main branch
3. CI will automatically deploy

### Netlify

Replace deploy job in `.github/workflows/ci.yml`:

```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v2
  with:
    publish-dir: "./dist"
    production-deploy: true
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Vercel

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: "--prod"
```

## Troubleshooting

### Images not optimizing

- Ensure source images exist in `src/assets/images/`
- Check file extensions: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
- Run `npm run optimize:images` manually to see errors

### Service worker issues

- Clear browser cache and service workers
- Check DevTools > Application > Service Workers
- Send `clearCache` message: `navigator.serviceWorker.controller.postMessage('clearCache')`

### Large bundle sizes

- Run `npm run analyze` to identify large files
- Consider lazy loading heavy components
- Review imported dependencies
