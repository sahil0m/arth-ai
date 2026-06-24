"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { generateCohort } from "@/lib/synthetic";
import { benchmarkCausalVsCorrelational, BenchmarkResult } from "@/lib/causal";
import { EVENT_EMOJI, EVENT_LABEL } from "@/lib/scm-knowledge";
import { MeterBar } from "@/components/ui";

export function LiveBenchmark() {
  const [n, setN] = useState(400);
  const [result, setResult] = useState<BenchmarkResult | null>(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // defer so the spinner paints before the synchronous compute
    setTimeout(() => {
      const cohort = generateCohort(n, 1000 + Math.floor(Math.random() * 5000));
      setResult(benchmarkCausalVsCorrelational(cohort));
      setRunning(false);
    }, 60);
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold text-white">Reproducible benchmark</div>
          <div className="text-xs text-slate-500">
            Generates a fresh synthetic cohort and scores causal vs correlational — in your browser.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-ink-800 px-3 py-2 text-xs text-slate-200 outline-none"
          >
            {[200, 400, 800, 1500].map((v) => (
              <option key={v} value={v}>{v} customers</option>
            ))}
          </select>
          <button onClick={run} disabled={running} className="btn-primary !py-2 !text-xs">
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "Running" : "Run benchmark"}
          </button>
        </div>
      </div>

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="grid gap-4 sm:grid-cols-4">
            <BenchStat label="Causal need accuracy" value={pct(result.causalNeedAccuracy)} accent="violet" />
            <BenchStat label="Correlational accuracy" value={pct(result.correlationalNeedAccuracy)} accent="amber" />
            <BenchStat label="Absolute uplift" value={`+${(result.absoluteUplift * 100).toFixed(0)} pts`} accent="teal" />
            <BenchStat label="Relative uplift" value={`+${(result.relativeUplift * 100).toFixed(0)}%`} accent="teal" />
          </div>

          <div className="mt-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Per-event recovery (causal engine)
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {[...result.confusion].sort((a, b) => b.total - a.total).map((c) => {
              const acc = c.correct / c.total;
              return (
                <div key={c.event}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{EVENT_EMOJI[c.event]} {EVENT_LABEL[c.event]}</span>
                    <span className="mono-num text-slate-500">{c.correct}/{c.total} · {(acc * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1"><MeterBar value={acc} accent={c.event === "NONE" ? "amber" : "violet"} /></div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] leading-relaxed text-slate-600">
            Controlled synthetic simulation. NONE (no life event) is recovered at a lower rate by design — in
            production, agents act only above a confidence threshold, trading NONE recall for intervention precision.
            Numbers vary slightly per run because each cohort is freshly sampled.
          </p>
        </motion.div>
      )}
    </div>
  );
}

function BenchStat({ label, value, accent }: { label: string; value: string; accent: "violet" | "teal" | "amber" }) {
  const c = accent === "teal" ? "text-arth-teal" : accent === "amber" ? "text-arth-amber" : "text-arth-violet";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className={`mono-num text-2xl font-bold ${c}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-400">{label}</div>
    </div>
  );
}
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
