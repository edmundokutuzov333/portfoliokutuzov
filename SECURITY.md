# 🔐 Security & Privacy Policy  
**Project:** Kutuzov Portfolio  
**Stack:** React + Vite (Lovable)  
**Last Updated:** 2025-12-02  

This document describes the security and privacy principles used in this project.  
It is designed for static front-end environments like Lovable, where no server-side rendering (SSR) or Next.js features are available.

---

# 1. Supported Versions

| Version | Status |
|--------|--------|
| ≥ 1.0.0 | Supported |
| < 1.0.0 | Not Supported |

---

# 2. Security Architecture Overview

The project uses a minimal, static architecture with strong client-side protections.  
There is **no public login**, only a private admin route:

- `/admin/login` → For Admin Only  
- Hidden from public navigation  
- Protected by firewall rules at the hosting platform (rate limit, bot protection)

Key principles adopted:

### ✔ Zero Public Attack Surface  
Only static files are publicly available.

### ✔ Admin Area Protected
The admin login is the only sensitive entry point, and it is protected by:

- Strong passwords  
- Limited login attempts  
- Private access  
- No exposure through links or menus  

### ✔ Strong Front-end Security Headers  
The deployment platform should apply:

- Content-Security-Policy (CSP)  
- HSTS  
- X-Frame-Options  
- X-Content-Type-Options  
- Referrer-Policy  

(Full list included below.)

### ✔ No Tracking  
No analytics, cookies, or personal-data collection.

---

# 3. Reporting a Vulnerability

If you discover a vulnerability, please send a detailed report to:

📮 **security@kutuzov.dev**

Your message should include:

- Steps to reproduce  
- Description of the impact  
- Any screenshots or sample payloads  

We will:

- Acknowledge within **24 hours**  
- Provide analysis within **72 hours**  
- Patch within **7 days** (or apply temporary protections immediately)

---

# 4. Privacy Policy (Technical Summary)

This project follows a strict minimal-data philosophy:

### We DO NOT collect:
- Personal information  
- Browser fingerprints  
- Behavioral analytics  
- Third-party cookies  
- Tracking identifiers  

### We ONLY collect:
- Basic anonymized technical logs for security purposes  
- Admin login attempts (with hashed IP)

All logs are:

- Temporary  
- Encrypted on the server  
- Deleted after **7 days**  

---

# 5. Admin Area Security

The admin login at `/admin/login` is protected by:

### ✔ Strong password requirements  
### ✔ Limited login attempts  
### ✔ No informative error messages  
Errors do NOT reveal whether a username exists.

### ✔ Optional Two-Factor Authentication (TOTP)  
If enabled on the backend.

### ✔ Hidden route  
It cannot be found through the interface.

---

# 6. Deployment Security (Hosting/CDN)

The hosting platform (e.g., Cloudflare, Netlify, Vercel, Lovable infra) should apply:

### 🔒 HTTPS only  
- TLS 1.3 preferred

### 🛑 Rate Limit  
- `/admin/*` → very strict limit on login attempts

### 🤖 Bot Protection  
Block scanners, crawlers, WP scanners, etc.

### 🚫 Path Blocking  
Common malicious paths should be blocked:

- `/wp-admin`  
- `/.env`  
- `/phpinfo`  
- `/server-status`  

These paths don’t exist but blocking reduces noise and attacks.

---

# 7. Recommended Security Headers  
**No installation needed.**  
Just configure these headers in your hosting panel (most allow copy-paste):
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; upgrade-insecure-requests
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), autoplay=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Resource-Policy: same-origin
These headers provide:

- XSS protection  
- Clickjacking prevention  
- MITM protection  
- Secure resource loading  
- Full HTTPS enforcement  

---

# 8. Incident Response Workflow

If a security issue occurs:

### 1. Immediately restrict public access  
Temporarily disable the site or apply a firewall block.

### 2. Collect technical logs  
Without collecting personal data.

### 3. Identify the root cause  
JavaScript errors, compromised assets, admin login attempts, etc.

### 4. Apply patch  
Release updated files and redeploy.

### 5. Notify stakeholders if needed  

---

# 9. Commitment

This project is committed to:

- Strong privacy  
- Minimal data collection  
- Industry-standard security practices  
- Fast response to security issues  
- Continuous improvement  

If you have concerns or suggestions, please contact us at any time.
