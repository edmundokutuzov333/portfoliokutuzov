module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:3000/",
        "http://127.0.0.1:3000/portfolio",
        "http://127.0.0.1:3000/services",
      ],
      numberOfRuns: 1,
      settings: {
        preset: "mobile",
        onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 4500 }],
        "total-blocking-time": ["warn", { maxNumericValue: 350 }],
      },
    },
    upload: { target: "filesystem", outputDir: "./.lighthouseci/mobile" },
  },
};
