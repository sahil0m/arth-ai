"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateCustomer } from "@/lib/synthetic";
import { inferFromCustomer } from "@/lib/causal";
import { EVENT_EMOJI, EVENT_LABEL, NEED_LABEL, SIGNAL_LABEL } from "@/lib/scm-knowledge";
import { LifeEvent } from "@/lib/types";

const SHOWCASE: { seed: number; event: LifeEvent }[] = [
  { seed: 42, event: "WEDDING" },
  { seed: 7, event: "NEW_CHILD" },
  { seed: 19, event: "JOB_CHANGE" },
  { seed: 88, event: "RELOCATION" },
];

export function HeroDemo() {
  const [idx, setIdx] = useState(0);
  const current = SHOWCASE[idx % SHOWCASE.length];

  const { customer, signals, inference } = useMemo(() => {
    const customer = generateCustomer(current.seed, { forceEvent: current.event });
    const { signals, inference } = inferFromCustomer(customer);
    return { customer, signals, inference };
  }, [current.seed, current.event]);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => i + 1), 4200);
    return () => clearInterval(t);
  }, []);

  const topSignals = Object.entries(signals)
    .filter(([, v]) => v > 0.15)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="relative">
      <div className="absolute -inset-3 -z-10 rounded-[28px] bg-radial-violet blur-2xl" />
      <div className="glass-strong rounded-3xl p-5 shadow-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arth-teal opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-arth-teal" />
            </span>
            Live causal inference
          </div>
          <span className="mono-num text-[11px] text-slate-500">
            180-day UPI window · {customer.txns.length} txns
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mt-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.05] text-base font-semibold text-white">
                {customer.name[0]}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {customer.name}, {customer.age} · {customer.city}
                </div>
                <div className="text-xs text-slate-500">
                  {customer.language} · prospect profile
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Signals detected
              </div>
              {topSignals.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{SIGNAL_LABEL[k as keyof typeof SIGNAL_LABEL]}</span>
                  <span className="mono-num text-slate-500">{(v * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-arth-violet/25 bg-arth-violet/[0.07] p-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-arth-violet">
                Causal inference → why
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-xl">{EVENT_EMOJI[inference.topEvent]}</span>
                <span className="text-lg font-bold text-white">
                  {EVENT_LABEL[inference.topEvent]}
                </span>
                <span className="mono-num ml-auto rounded-md bg-arth-violet/20 px-2 py-0.5 text-sm font-semibold text-arth-violet">
                  {(inference.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {inference.rankedNeeds.slice(0, 3).map((n) => (
                  <span
                    key={n.need}
                    className="rounded-full border border-arth-teal/30 bg-arth-teal/10 px-2.5 py-1 text-[11px] font-medium text-arth-teal"
                  >
                    {NEED_LABEL[n.need]}
                  </span>
                ))}
              </div>
              <div className="mt-3 text-xs leading-relaxed text-slate-400">
                Need crystallises in <span className="mono-num text-white">~{inference.daysToNeed} days</span>.
                ARTH.AI acts before the customer consciously feels it.
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-4 flex justify-center gap-1.5">
          {SHOWCASE.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show example ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx % SHOWCASE.length ? "w-5 bg-arth-violet" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
