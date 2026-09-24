module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run build && npx nitro preview --host 127.0.0.1 --port 4173",
      startServerReadyPattern: "Listening on",
      startServerReadyTimeout: 120000,
      url: [
        "http://127.0.0.1:4173/",
        "http://127.0.0.1:4173/portfolio",
        "http://127.0.0.1:4173/services",
        "http://127.0.0.1:4173/credentials",
        "http://127.0.0.1:4173/contact",
        "http://127.0.0.1:4173/studio"
      ],
      numberOfRuns: 1,
      settings: { preset: "mobile", throttlingMethod: "simulate" }
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 1 }]
      }
    },
    upload: { target: "temporary-public-storage" }
  }
};
