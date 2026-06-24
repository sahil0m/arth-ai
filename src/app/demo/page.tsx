"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  Network,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomerPicker, PickerState } from "@/components/customer-picker";
import { MeterBar, Badge } from "@/components/ui";
import { generateCustomer } from "@/lib/synthetic";
import { inferFromCustomer, timingCounterfactual, isActionable } from "@/lib/causal";
import { networkFeatures } from "@/lib/signals";
import {
  EVENT_EMOJI,
  EVENT_LABEL,
  LIFE_EVENTS,
  NEED_LABEL,
  SIGNAL_LABEL,
} from "@/lib/scm-knowledge";

export default function DemoPage() {
  const [picker, setPicker] = useState<PickerState>({ seed: 42, forceEvent: "WEDDING" });
  const [showTruth, setShowTruth] = useState(false);

  const data = useMemo(() => {
    const customer = generateCustomer(picker.seed, { forceEvent: picker.forceEvent });
    const { signals, inference } = inferFromCustomer(customer);
    const timing = timingCounterfactual(inference);
    const net = networkFeatures(customer);
    return { customer, signals, inference, timing, net };
  }, [picker.seed, picker.forceEvent]);

  const { customer, signals, inference, timing, net } = data;

  const activeSignals = Object.entries(signals)
    .filter(([, v]) => v > 0.12)
    .sort((a, b) => b[1] - a[1]);

  const sortedPosterior = LIFE_EVENTS.map((e) => ({ event: e, p: inference.posterior[e] }))
    .filter((x) => x.p > 0.005)
    .sort((a, b) => b.p - a.p);

  const correct = inference.topEvent === customer.trueLifeEvent;
  const actionable = isActionable(inference);

  return (
    <div className="section py-10">
      {/* header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge tone="violet"><Zap size={13} /> Live causal pipeline</Badge>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Watch ARTH.AI understand a customer
          </h1>
          <p className="mt-2 max-w-2xl text-slate-400">
            Raw UPI history → signals → <strong className="text-slate-200">causal life-event
            inference</strong> → caused needs → counterfactual timing → autonomous action.
            Everything below is computed in your browser from the synthetic data.
          </p>
        </div>
        <button onClick={() => setShowTruth((v) => !v)} className="btn-ghost !py-2 !text-xs">
          {showTruth ? <EyeOff size={14} /> : <Eye size={14} />}
          {showTruth ? "Hide" : "Reveal"} ground truth
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* ── LEFT: picker + profile ── */}
        <div className="space-y-5">
          <CustomerPicker state={picker} onChange={setPicker} />

          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-arth-violet/30 to-arth-indigo/20 text-lg font-semibold text-white">
                {customer.name[0]}
              </div>
              <div>
                <div className="font-semibold text-white">
                  {customer.name}, {customer.age}
                </div>
                <div className="text-xs text-slate-500">
                  {customer.city} · {customer.language}
                </div>
              </div>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <Row k="Profile" v={customer.isExisting ? "Existing customer" : "Prospect"} />
              <Row k="Est. monthly income" v={`₹${customer.monthlyIncomeEstimate.toLocaleString("en-IN")}`} />
              <Row k="Peak attention" v={fmtHour(customer.peakAttentionHour)} />
              <Row k="Preferred channel" v={customer.preferredChannel} />
              <Row k="UPI transactions" v={`${customer.txns.length} / 180 days`} />
            </dl>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Network size={13} /> Network features (GNN proxy)
            </div>
            <div className="mt-3 space-y-2.5">
              <FeatureBar label="Trust Radius (SBI links)" value={net.trustRadius} max={12} raw />
              <FeatureBar label="Merchant diversity" value={net.merchantDiversity} />
              <FeatureBar label="Payment discipline" value={net.temporalDiscipline} />
              <FeatureBar label="Spending momentum" value={Math.min(1, net.spendingMomentum / 2)} />
              <FeatureBar label="Income stability" value={net.incomeStability} />
            </div>
          </div>

          {showTruth && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={`card border p-4 ${correct ? "border-arth-teal/30" : "border-arth-rose/30"}`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Ground truth (synthetic)
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-lg">{EVENT_EMOJI[customer.trueLifeEvent]}</span>
                <span className="font-semibold text-white">{EVENT_LABEL[customer.trueLifeEvent]}</span>
              </div>
              <div className={`mt-2 flex items-center gap-1.5 text-sm ${correct ? "text-arth-teal" : "text-arth-rose"}`}>
                {correct ? <CheckCircle2 size={15} /> : <Activity size={15} />}
                {correct ? "Correctly recovered by the causal engine" : "Mis-inferred — an honest miss"}
              </div>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: the pipeline ── */}
        <div className="space-y-6">
          {/* STEP 1 — signals */}
          <Step n={1} title="Signal Engine" subtitle="Behavioural & transaction signals extracted from the UPI graph">
            {activeSignals.length === 0 ? (
              <p className="text-sm text-slate-500">No strong signals — a calm transaction rhythm.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {activeSignals.map(([k, v]) => (
                  <div key={k}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{SIGNAL_LABEL[k as keyof typeof SIGNAL_LABEL]}</span>
                      <span className="mono-num text-slate-500">{(v * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-1"><MeterBar value={v} accent="teal" /></div>
                  </div>
                ))}
              </div>
            )}
          </Step>

          {/* STEP 2 — causal inference */}
          <Step n={2} title="Causal Inference Engine" subtitle="Bayesian inversion of the structural causal model — P(life event | signals)">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div className="space-y-2.5">
                {sortedPosterior.map((x, i) => (
                  <div key={x.event}>
                    <div className="flex items-center justify-between text-xs">
                      <span className={i === 0 ? "font-semibold text-white" : "text-slate-400"}>
                        {EVENT_EMOJI[x.event]} {EVENT_LABEL[x.event]}
                      </span>
                      <span className="mono-num text-slate-500">{(x.p * 100).toFixed(1)}%</span>
                    </div>
                    <div className="mt-1">
                      <MeterBar value={x.p} accent={i === 0 ? "violet" : "amber"} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-arth-violet/20 bg-arth-violet/[0.06] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-arth-violet">
                  Why — top causal drivers
                </div>
                {inference.drivers.length === 0 ? (
                  <p className="mt-2 text-xs text-slate-500">Prior-dominated — weak evidence.</p>
                ) : (
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-300">
                    {inference.drivers.map((d) => (
                      <li key={d.signal} className="flex items-center gap-1.5">
                        <span className="text-arth-violet">↳</span>
                        {SIGNAL_LABEL[d.signal]}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                  These signals and the banking need share one cause — the life event — so the
                  symptom is never mistaken for the cause.
                </p>
              </div>
            </div>
          </Step>

          {actionable ? (
          <>
          {/* STEP 3 — do-operator needs */}
          <Step n={3} title="Intervention — do-operator" subtitle="The banking needs this event causes, ranked by causal weight">
            <div className="flex flex-wrap gap-2">
              {inference.rankedNeeds.map((n, i) => (
                <div
                  key={n.need}
                  className={`rounded-xl border px-4 py-3 ${
                    i === 0
                      ? "border-arth-teal/40 bg-arth-teal/10"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <div className={`text-sm font-semibold ${i === 0 ? "text-arth-teal" : "text-slate-200"}`}>
                    {NEED_LABEL[n.need]}
                  </div>
                  <div className="mono-num mt-0.5 text-[11px] text-slate-500">
                    causal score {(n.score * 100).toFixed(0)}
                  </div>
                </div>
              ))}
            </div>
          </Step>

          {/* STEP 4 — counterfactual timing */}
          <Step n={4} title="Counterfactual Timing" subtitle="P(convert | do(intervene at day d)) — act now vs wait two weeks">
            <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timing.curve} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} unit="d" />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                    <Tooltip
                      contentStyle={{ background: "#0f1626", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: "#94a3b8" }}
                      formatter={(v: number) => [`${(v * 100).toFixed(0)}%`, "convert prob"]}
                      labelFormatter={(l) => `Day ${l}`}
                    />
                    <ReferenceLine x={timing.optimalDay} stroke="#2dd4bf" strokeDasharray="4 4" label={{ value: "optimal", fill: "#2dd4bf", fontSize: 10, position: "top" }} />
                    <Area type="monotone" dataKey="conversionProb" stroke="#7c5cff" strokeWidth={2} fill="url(#g)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <TimingStat label="Act NOW" value={timing.actNowProb} accent="teal" />
                <TimingStat label="Wait 2 weeks" value={timing.waitTwoWeeksProb} accent="amber" />
                <div className="rounded-xl border border-arth-teal/30 bg-arth-teal/10 p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-arth-teal">
                    <Clock size={13} /> Timing uplift
                  </div>
                  <div className="mono-num mt-1 text-2xl font-bold text-white">
                    {timing.upliftFromTiming >= 0 ? "+" : ""}
                    {(timing.upliftFromTiming * 100).toFixed(0)}
                    <span className="text-sm text-slate-400"> pts</span>
                  </div>
                </div>
              </div>
            </div>
          </Step>

          {/* STEP 5 — action */}
          <Step n={5} title="Autonomous Action" subtitle="Right need · right time · right channel · right language" last>
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-5">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <Badge tone="violet">{EVENT_EMOJI[inference.topEvent]} {EVENT_LABEL[inference.topEvent]}</Badge>
                <Badge tone="teal">{NEED_LABEL[inference.rankedNeeds[0]?.need ?? "fixed_deposit"]}</Badge>
                <Badge>{customer.preferredChannel}</Badge>
                <Badge>{customer.language}</Badge>
                <Badge tone="amber">{fmtHour(customer.peakAttentionHour)}</Badge>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">
                ARTH.AI dispatches a consent-verified message offering the{" "}
                <strong>{NEED_LABEL[inference.rankedNeeds[0]?.need ?? "fixed_deposit"]}</strong>{" "}
                via {customer.preferredChannel} in {customer.language}, timed to day{" "}
                <span className="mono-num">{timing.optimalDay}</span> of a{" "}
                <span className="mono-num">{inference.daysToNeed}</span>-day need window — before the
                customer consciously feels the need.
              </p>
              <Link href="/agents" className="btn-primary mt-5 !py-2 !text-xs">
                See all 4 agents act on {customer.name} <ArrowRight size={14} />
              </Link>
            </div>
          </Step>
          </>
          ) : (
            <Step n={3} title="Decision — hold back" subtitle={`Confidence below the ${Math.round(0.6 * 100)}% action threshold — ARTH.AI does not intervene`} last>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-arth-teal">
                  <CheckCircle2 size={16} /> No strong life event — steady customer
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  The evidence doesn’t clear ARTH.AI’s confidence bar, so it deliberately
                  <strong className="text-white"> stays silent</strong>. Restraint is a feature:
                  not nudging during calm periods is what builds long-term trust and keeps
                  intervention precision high (this is the tunable action threshold from the{" "}
                  <Link href="/methodology" className="text-arth-violet hover:underline">ablation studies</Link>).
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Raise or lower the threshold to trade coverage for precision — see the threshold sweep on the Methodology page.
                </p>
              </div>
            </Step>
          )}
        </div>
      </div>
    </div>
  );
}

// ── small components ──
function Step({
  n, title, subtitle, children, last,
}: {
  n: number; title: string; subtitle: string; children: React.ReactNode; last?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: n * 0.05 }}
      className="relative pl-10"
    >
      <div className="absolute left-0 top-0 grid h-7 w-7 place-items-center rounded-full border border-arth-violet/40 bg-ink-900 text-xs font-bold text-arth-violet">
        {n}
      </div>
      {!last && <div className="absolute left-[13px] top-7 h-[calc(100%+1.5rem)] w-px bg-white/[0.07]" />}
      <div className="card p-5">
        <h3 className="text-base font-bold text-white">{title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{k}</dt>
      <dd className="font-medium capitalize text-slate-200">{v}</dd>
    </div>
  );
}

function FeatureBar({ label, value, max = 1, raw = false }: { label: string; value: number; max?: number; raw?: boolean }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{label}</span>
        <span className="mono-num text-slate-500">{raw ? value : `${(value * 100).toFixed(0)}%`}</span>
      </div>
      <div className="mt-1"><MeterBar value={value} max={max} accent="violet" /></div>
    </div>
  );
}

function TimingStat({ label, value, accent }: { label: string; value: number; accent: "teal" | "amber" }) {
  const color = accent === "teal" ? "text-arth-teal" : "text-arth-amber";
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`mono-num mt-0.5 text-xl font-bold ${color}`}>{(value * 100).toFixed(0)}%</div>
    </div>
  );
}

function fmtHour(h: number) {
  const am = h < 12;
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${am ? "AM" : "PM"}`;
}
