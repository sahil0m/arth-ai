// Headless sanity check of the ARTH.AI causal engine.
// Run: npx tsx scripts/verify-engine.ts
import { generateCohort, generateCustomer } from "../src/lib/synthetic";
import { benchmarkCausalVsCorrelational, inferFromCustomer } from "../src/lib/causal";

const cohort = generateCohort(400);
const bench = benchmarkCausalVsCorrelational(cohort);

console.log("=== ARTH.AI Engine Verification ===");
console.log("Cohort size:               ", bench.n);
console.log("Causal EVENT accuracy:     ", (bench.causalAccuracy * 100).toFixed(1) + "%");
console.log("Causal NEED accuracy:      ", (bench.causalNeedAccuracy * 100).toFixed(1) + "%");
console.log("Correlational NEED accuracy:", (bench.correlationalNeedAccuracy * 100).toFixed(1) + "%");
console.log("Absolute uplift:           ", (bench.absoluteUplift * 100).toFixed(1) + " pts");
console.log("Relative uplift:           ", (bench.relativeUplift * 100).toFixed(1) + "%");
console.log("\nPer-event recovery:");
for (const c of bench.confusion.sort((a, b) => b.total - a.total)) {
  console.log(`  ${c.event.padEnd(14)} ${c.correct}/${c.total} (${((c.correct / c.total) * 100).toFixed(0)}%)`);
}

console.log("\n=== Sample inference (forced WEDDING) ===");
const wedding = generateCustomer(42, { forceEvent: "WEDDING" });
const { inference } = inferFromCustomer(wedding);
console.log("True event:  WEDDING");
console.log("Predicted:  ", inference.topEvent, `(${(inference.confidence * 100).toFixed(0)}%)`);
console.log("Top needs:  ", inference.rankedNeeds.slice(0, 3).map((n) => n.need).join(", "));
console.log("Drivers:    ", inference.drivers.map((d) => d.signal).join(", "));
