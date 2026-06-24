import { generateCustomer } from "../src/lib/synthetic";
import { inferFromCustomer, timingCounterfactual } from "../src/lib/causal";
import { runSparsh, runPragati, runBandhan, runGyaan } from "../src/lib/agents";
import { LIFE_EVENTS } from "../src/lib/scm-knowledge";

let problems = 0;
const bad = (m: string) => { console.log("  ✗ " + m); problems++; };
const num = (x: number) => Number.isFinite(x);

// 1. Every event type, plus extreme seeds, run full pipeline — no crash/NaN
const seeds = [0, 1, 42, 88, 999999, 123456, 7, 13];
for (const ev of LIFE_EVENTS) {
  for (const s of seeds) {
    try {
      const c = generateCustomer(s, { forceEvent: ev });
      const { inference } = inferFromCustomer(c);
      const t = timingCounterfactual(inference);
      const sp = runSparsh(c), pr = runPragati(c), ba = runBandhan(c), gy = runGyaan(c);
      // invariants
      const psum = Object.values(inference.posterior).reduce((a,b)=>a+b,0);
      if (Math.abs(psum - 1) > 0.02) bad(`${ev}/${s}: posterior sums to ${psum.toFixed(3)}`);
      if (!num(inference.confidence) || inference.confidence < 0 || inference.confidence > 1) bad(`${ev}/${s}: bad confidence`);
      if (!num(t.actNowProb) || !num(t.waitTwoWeeksProb)) bad(`${ev}/${s}: NaN timing`);
      if (sp.lifeEventScore < 0 || sp.lifeEventScore > 100) bad(`${ev}/${s}: sparsh score ${sp.lifeEventScore}`);
      if (pr.comfort.score < 0 || pr.comfort.score > 100) bad(`${ev}/${s}: pragati score`);
      if (ba.empathy.fei < 0 || ba.empathy.fei > 100) bad(`${ev}/${s}: fei ${ba.empathy.fei}`);
      if (!gy.projection || gy.cohortSize <= 0) bad(`${ev}/${s}: gyaan empty`);
      if (!num(gy.successRate)) bad(`${ev}/${s}: gyaan NaN`);
    } catch (e) { bad(`${ev}/${s}: THREW ${(e as Error).message}`); }
  }
}

// 2. Degenerate customer: force a customer with almost no txns? Generator always adds background. Check NONE stable.
const stable = generateCustomer(5, { forceEvent: "NONE", forceExisting: true });
const inf = inferFromCustomer(stable).inference;
console.log(`Stable customer: top=${inf.topEvent} conf=${(inf.confidence*100).toFixed(0)}% needs=${inf.rankedNeeds.length}`);
if (inf.rankedNeeds.length === 0) bad("NONE customer has zero ranked needs (UI step 5 would fallback)");

console.log(problems === 0 ? "\n✓ ALL EDGE CASES PASSED (" + (LIFE_EVENTS.length*seeds.length) + " pipelines)" : `\n✗ ${problems} problems`);
