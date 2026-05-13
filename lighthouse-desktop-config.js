/**
 * Lighthouse Desktop Configuration
 * Simulates desktop with fast network
 */

module.exports = {
  extends: "lighthouse:default",
  settings: {
    // Desktop emulation
    formFactor: "desktop",
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false,
    },
    // Minimal throttling for desktop
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    // Audit all categories
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  },
};
