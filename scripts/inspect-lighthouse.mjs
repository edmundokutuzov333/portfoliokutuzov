import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2];
if (!dir || !fs.existsSync(dir)) process.exit(0);

for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
  const lhr = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const score = (id) => Math.round((lhr.categories?.[id]?.score ?? 0) * 100);
  const audit = (id) => lhr.audits?.[id];
  const lcp = audit("largest-contentful-paint");
  const lcpNode = lcp?.details?.items?.[0]?.node?.snippet ?? "unknown";
  const failed = (category) =>
    Object.values(lhr.categories?.[category]?.auditRefs ?? [])
      .map((ref) => audit(ref.id))
      .filter((item) => item && item.score !== null && item.score < 1)
      .map((item) => `${item.id}: ${item.title}`);

  console.log(
    `LH ${lhr.requestedUrl}: perf=${score("performance")} a11y=${score("accessibility")} best=${score("best-practices")} seo=${score("seo")}`,
  );
  console.log(
    `  LCP=${audit("largest-contentful-paint")?.numericValue ?? "?"}ms element=${lcpNode}`,
  );
  console.log(
    `  FCP=${audit("first-contentful-paint")?.numericValue ?? "?"}ms CLS=${audit("cumulative-layout-shift")?.numericValue ?? "?"} TBT=${audit("total-blocking-time")?.numericValue ?? "?"}ms`,
  );
  console.log(`  accessibility failures: ${failed("accessibility").join(" | ") || "none"}`);
  console.log(`  seo failures: ${failed("seo").join(" | ") || "none"}`);
}
