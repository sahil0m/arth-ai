import { generateCustomer } from "../src/lib/synthetic";
import { inferFromCustomer, isActionable } from "../src/lib/causal";
function rate(ev: any, n=120) {
  let act=0; for(let i=0;i<n;i++){const c=generateCustomer(1000+i*3,{forceEvent:ev}); if(isActionable(inferFromCustomer(c).inference)) act++;}
  return (act/n*100).toFixed(0);
}
console.log("Actionable rate (should be LOW for Stable, HIGH for real events):");
for (const ev of ["NONE","WEDDING","JOB_CHANGE","NEW_CHILD","MEDICAL"])
  console.log(`  ${ev.padEnd(11)} ${rate(ev)}% actionable`);
