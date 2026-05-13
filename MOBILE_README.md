# Mobile & Tablet Optimization Guide

This document describes the mobile/tablet optimizations applied to the site without changing the desktop experience.

## Overview

The mobile/tablet optimization uses a **progressive enhancement** approach:
- Desktop CSS and JS remain **completely unchanged**
- Mobile/tablet styles are loaded **conditionally** via media queries
- Mobile-specific components mount **only when viewport matches**
- Performance optimizations reduce animations and heavy effects on mobile

## Files Added

| File | Purpose |
|------|---------|
| `public/styles/mobile.css` | Mobile-only CSS overrides (≤480px) |
| `public/styles/tablet.css` | Tablet-only CSS overrides (≤1024px) |
| `src/hooks/useResponsiveLoad.tsx` | Viewport detection and conditional loading |
| `src/components/MobileNav.tsx` | Mobile navigation drawer |
| `src/components/TabletNav.tsx` | Tablet navigation bar |
| `public/manifest/mobile-images.json` | Mobile-optimized image manifest |

## How It Works

### 1. Conditional CSS Loading

Mobile/tablet CSS files are loaded via `<link rel="preload">` with media queries:

```html
<link rel="preload" href="/styles/tablet.css" as="style" media="(max-width:1024px)" onload="this.rel='stylesheet'">
<link rel="preload" href="/styles/mobile.css" as="style" media="(max-width:480px)" onload="this.rel='stylesheet'">
```

- Desktop browsers ignore these stylesheets entirely
- Mobile/tablet browsers preload and apply them
- `noscript` fallback ensures CSS works without JS

### 2. Viewport Detection

The `useResponsiveLoad` hook detects viewport size and:
- Adds viewport classes to `<html>` (e.g., `viewport-mobile`)
- Runs callbacks only when viewport matches
- Adds `reduced-motion-*` classes for performance
- Handles viewport changes (rotation, resize)

### 3. Mobile Navigation

- Desktop nav remains visible on desktop
- `MobileNav` component mounts only on mobile viewports
- Full-screen drawer with keyboard accessibility
- Touch-friendly 56px minimum tap targets

### 4. Performance Optimizations

On mobile devices:
- Animations reduced to 150ms (vs default)
- Heavy effects (shaders, parallax) disabled via CSS
- Smaller image variants served from manifest
- `prefers-reduced-motion` fully respected

## Testing Locally

### 1. Chrome DevTools

```bash
npm run dev
```

1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device:
   - **iPhone 12**: 390×844 (mobile)
   - **iPad**: 768×1024 (tablet)
   - **Desktop**: 1366×768+

### 2. Verify Desktop Unchanged

1. Set viewport to 1366×768 or larger
2. Compare with production site
3. Desktop should be **pixel-identical**

### 3. Check Mobile Features

On mobile viewport (≤480px):
- [ ] Mobile nav toggle appears
- [ ] Desktop nav hidden
- [ ] Drawer opens/closes smoothly
- [ ] Touch targets ≥56px
- [ ] Single-column layout
- [ ] No horizontal scroll

On tablet viewport (≤1024px):
- [ ] Tablet nav appears (compact)
- [ ] Desktop nav may be hidden or condensed
- [ ] 2-column grid layouts
- [ ] Touch targets ≥48px

## Testing on Real Devices

### Using BrowserSync

```bash
npm install -g browser-sync
browser-sync start --proxy "localhost:8080" --files "dist/**/*"
```

Access the URL shown on your mobile device (same network).

### Using ngrok

```bash
ngrok http 8080
```

Access the generated URL from any device.

## Lighthouse Mobile Audit

The CI pipeline includes a Lighthouse mobile audit. To run locally:

```bash
npx lighthouse http://localhost:8080 --preset=desktop --output=html --output-path=./lighthouse-desktop.html
npx lighthouse http://localhost:8080 --preset=mobile --output=html --output-path=./lighthouse-mobile.html
```

### Target Metrics

| Metric | Target | Reason |
|--------|--------|--------|
| FCP | <1.8s | Fast first paint on 3G |
| LCP | <2.5s | Main content visible quickly |
| CLS | <0.1 | No layout shifts |
| TBT | <200ms | Responsive interactions |

## Rollback Instructions

### Option 1: Remove CSS Links (Quick)

Remove these lines from `index.html`:

```html
<link rel="preload" href="/styles/tablet.css" ...>
<link rel="preload" href="/styles/mobile.css" ...>
<noscript>...</noscript>
```

### Option 2: Delete Files (Complete)

```bash
rm public/styles/mobile.css
rm public/styles/tablet.css
rm src/hooks/useResponsiveLoad.tsx
rm src/components/MobileNav.tsx
rm src/components/TabletNav.tsx
```

### Option 3: Disable via CSS

Add to any CSS file:

```css
@media (max-width: 1024px) {
  /* Disable all mobile/tablet overrides */
  .mobile-nav, .tablet-nav, .mobile-nav-toggle { display: none !important; }
}
```

## Customization

### Change Breakpoints

Edit `src/hooks/useResponsiveLoad.tsx`:

```typescript
const BREAKPOINTS = {
  mobile: 480,   // Change mobile breakpoint
  tablet: 1024,  // Change tablet breakpoint
} as const;
```

Update CSS files to match:

```css
@media screen and (max-width: 480px) { /* mobile */ }
@media screen and (max-width: 1024px) { /* tablet */ }
```

### Add Navigation Items

Edit `src/components/MobileNav.tsx` and `TabletNav.tsx`:

```typescript
const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Contact', href: '/contact' },  // Add new item
];
```

### Customize Touch Targets

Edit CSS variables in mobile.css/tablet.css:

```css
:root {
  --mobile-touch-target: 56px;  /* iOS guidelines: 44px min */
  --tablet-touch-target: 48px;  /* Android guidelines: 48dp */
}
```

## Troubleshooting

### Mobile CSS Not Loading

1. Check network tab for mobile.css/tablet.css requests
2. Verify media query matches viewport
3. Check for CSS syntax errors

### Desktop Layout Changed

1. Ensure mobile CSS only has `@media` rules
2. Check specificity doesn't override desktop
3. Verify no global styles outside media queries

### Navigation Not Appearing

1. Check `useResponsiveLoad` is imported in App.tsx
2. Verify viewport matches mobile/tablet breakpoint
3. Check browser console for errors

## Performance Notes

- Mobile CSS: ~3KB gzipped
- Tablet CSS: ~2KB gzipped
- MobileNav: ~2KB (only loaded on mobile)
- No additional dependencies required

All styles use CSS custom properties (variables) matching the existing design system.
