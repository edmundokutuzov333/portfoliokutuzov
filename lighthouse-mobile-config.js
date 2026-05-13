/**
 * Lighthouse Mobile Configuration
 * Simulates mobile device with 3G network throttling
 */

module.exports = {
  extends: "lighthouse:default",
  settings: {
    // Mobile emulation
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 375,
      height: 812,
      deviceScaleFactor: 3,
      disabled: false,
    },
    // 3G network throttling (Slow 3G simulation)
    throttlingMethod: "simulate",
    throttling: {
      rttMs: 150, // Round trip time
      throughputKbps: 1600, // Download speed (~3G)
      uploadThroughputKbps: 750,
      cpuSlowdownMultiplier: 4,
    },
    // Only audit performance-related categories
    onlyCategories: ["performance", "accessibility", "best-practices"],
  },
};
