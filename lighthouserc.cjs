module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3000/",
        "http://127.0.0.1:3000/portfolio",
        "http://127.0.0.1:3000/services",
        "http://127.0.0.1:3000/credentials",
        "http://127.0.0.1:3000/contact",
        "http://127.0.0.1:3000/studio",
        "http://127.0.0.1:3000/pt",
        "http://127.0.0.1:3000/pt/portfolio",
        "http://127.0.0.1:3000/pt/services",
        "http://127.0.0.1:3000/pt/credentials",
        "http://127.0.0.1:3000/pt/contact",
        "http://127.0.0.1:3000/pt/studio",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      // Lighthouse thresholds are release gates. They are aligned with SUPERPROMPT v3
      // and must not be lowered to accommodate lab variance.
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 1 }],
        "first-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./.lighthouseci" },
  },
};
