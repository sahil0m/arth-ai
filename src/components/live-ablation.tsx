"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, Loader2 } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { generateCohort } from "@/lib/synthetic";
import {
  ablationBaselines, thresholdSweep, robustnessSweep,
  AblationBaselines, ThresholdPoint, RobustnessPoint,
} from "@/lib/causal";
import { MeterBar } from "@/components/ui";

const AXIS = { fill: "#64748b", fontSize: 11 };
const TOOLTIP = {
  contentStyle: { background: "#0f1626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 },
  labelStyle: { color: "#94a3b8" },
};

export function LiveAblation() {
  const [running, setRunning] = useState(false);
  const [data, setData] = useState<{
    ablation: AblationBaselines; threshold: ThresholdPoint[]; robustness: RobustnessPoint[];
  } | null>(null);

  const run = () => {
    setRunning(true);
    setTimeout(() => {
      const cohort = generateCohort(600, 2000 + Math.floor(Math.random() * 5000));
      setData({
        ablation: ablationBaselines(cohort),
        threshold: thresholdSweep(cohort),
        robustness: robustnessSweep(cohort),
      });
      setRunning(false);
    }, 60);
  };

  return (
    <div className="card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <FlaskConical size={16} className="text-arth-violet" /> Ablation &amp; robustness studies
          </div>
          <div className="text-xs text-slate-500">
            Component ablation, action-threshold sweep, and graceful-degradation test — 600 customers, live.
          </div>
        </div>
        <button onClick={run} disabled={running} className="btn-primary !py-2 !text-xs">
          {running ? <Loader2 size={14} className="animate-spin" /> : <FlaskConical size={14} />}
          {running ? "Running" : "Run studies"}
        </button>
      </div>

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-8">
          {/* Component ablation */}
          <div>
            <h4 className="text-sm font-semibold text-white">1 · Component ablation — what each layer contributes</h4>
            <p className="mt-1 text-xs text-slate-500">Strip the engine down. The jump from correlational → causal isolates the value of causal reasoning.</p>
            <div className="mt-3 space-y-2.5">
              {[
                ["Full causal SCM", data.ablation.causal, "violet"],
                ["Correlational shortcut", data.ablation.correlational, "amber"],
                ["Prior-only (no signals)", data.ablation.priorOnly, "rose"],
                ["Random baseline", data.ablation.random, "rose"],
              ].map(([label, val, acc]) => (
                <div key={label as string}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{label as string}</span>
                    <span className="mono-num text-slate-400">{((val as number) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="mt-1"><MeterBar value={val as number} accent={acc as "violet" | "amber" | "rose"} /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Threshold sweep */}
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h4 className="text-sm font-semibold text-white">2 · Action-threshold sweep</h4>
              <p className="mt-1 text-xs text-slate-500">Higher confidence threshold → fewer but far more precise interventions. The operating point is tunable.</p>
              <div className="mt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.threshold} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="threshold" tick={AXIS} tickLine={false} axisLine={false} />
                    <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}`} />
                    <Tooltip {...TOOLTIP} formatter={(v: number, k) => [`${(v * 100).toFixed(0)}%`, k as string]} />
                    <Line type="monotone" dataKey="precision" stroke="#2dd4bf" strokeWidth={2} dot={false} name="precision" />
                    <Line type="monotone" dataKey="coverage" stroke="#fbbf24" strokeWidth={2} dot={false} name="coverage" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-4 text-[11px]">
                <span className="text-arth-teal">— precision</span>
                <span className="text-arth-amber">— coverage</span>
              </div>
            </div>

            {/* Robustness */}
            <div>
              <h4 className="text-sm font-semibold text-white">3 · Robustness to sparse evidence</h4>
              <p className="mt-1 text-xs text-slate-500">Randomly hide signals. Accuracy degrades gracefully — no cliff — and stays well above random throughout.</p>
              <div className="mt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.robustness} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="dropout" tick={AXIS} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                    <YAxis tick={AXIS} tickLine={false} axisLine={false} domain={[0, 0.8]} tickFormatter={(v) => `${Math.round(v * 100)}`} />
                    <Tooltip {...TOOLTIP} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, "accuracy"]} labelFormatter={(l) => `${Math.round(Number(l) * 100)}% signals hidden`} />
                    <Bar dataKey="accuracy" fill="#7c5cff" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <p className="text-[11px] leading-relaxed text-slate-600">
            Controlled synthetic studies; figures vary slightly per run as each cohort is freshly sampled.
            The formal causal-validity checks (placebo treatment, random-common-cause refutation) run in the Python <span className="mono-num">/research</span> module via DoWhy.
          </p>
        </motion.div>
      )}
    </div>
  );
}
