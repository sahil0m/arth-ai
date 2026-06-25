import type { Metadata } from "next";
import { Reveal, SectionHeader, Badge, Eyebrow } from "@/components/ui";
import {
  Database, Radio, Brain, Workflow, Send, RefreshCw, Server, Lock, Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Architecture — ARTH.AI",
  description: "The six-layer ARTH.AI system: consent-first ingestion, signal engine, causal inference core, autonomous agents, intervention layer, and a federated learning loop.",
};

const LAYERS = [
  {
    n: 0, name: "Data Ingestion", sub: "Consent-first", icon: Database, color: "text-slate-300",
    points: [
      "UPI transaction graph + Account Aggregator (consented, purpose-bound)",
      "App behaviour, support history, voice patterns",
      "Every field carries a revocable consent artefact (DPDP-aligned)",
    ],
  },
  {
    n: 1, name: "Signal Engine", sub: "Layer 1", icon: Radio, color: "text-arth-teal",
    points: [
      "Transaction Graph Neural Network reads merchant/counterparty network",
      "Behavioural sequence model reads HOW the app is used, not just what",
      "Self-normalised signal strengths — works across income levels",
    ],
  },
  {
    n: 2, name: "Causal Inference Engine", sub: "Layer 2 · the core", icon: Brain, color: "text-arth-violet",
    points: [
      "Structural Causal Model — life event is the latent common cause",
      "Bayesian inversion → P(life event | signals); do-operator → caused needs",
      "Counterfactual reasoning times each intervention by incremental effect",
    ],
  },
  {
    n: 3, name: "Autonomous Agent Network", sub: "Layer 3", icon: Workflow, color: "text-arth-amber",
    points: [
      "SPARSH (acquire) · PRAGATI (adopt) · BANDHAN (engage) · GYAAN (meta-learn)",
      "Each is a LangGraph agent consuming the same causal inference",
      "Every action carries a plain-language reason + human-override hook",
    ],
  },
  {
    n: 4, name: "Intervention Layer", sub: "Layer 4", icon: Send, color: "text-arth-teal",
    points: [
      "Right channel · right language · right time · right emotional tone",
      "Zero-friction, consent-verified delivery",
      "Financial Empathy Filter suppresses contact during detected stress",
    ],
  },
  {
    n: 5, name: "Federated Learning Loop", sub: "Layer 5", icon: RefreshCw, color: "text-arth-rose",
    points: [
      "Models improve from outcomes; raw data never leaves the device",
      "Differential privacy on aggregated updates",
      "DPDP-by-design — minimisation, purpose limitation, auditability",
    ],
  },
];

const STACK = [
  { icon: Brain, area: "Causal AI", tools: "DoWhy · EconML · CausalNex (Bayesian SCM)" },
  { icon: Cpu, area: "Graph / sequence", tools: "PyTorch Geometric (GNN) · temporal models" },
  { icon: Workflow, area: "Agent orchestration", tools: "LangGraph multi-agent · FastAPI · Celery" },
  { icon: Server, area: "Data layer", tools: "Neo4j (graph) · PostgreSQL · Redis · vector store" },
  { icon: Lock, area: "Privacy / compliance", tools: "Flower (federated) · differential privacy · consent ledger" },
  { icon: Radio, area: "Prototype engine", tools: "TypeScript SCM (in-browser) + Python DoWhy validation" },
];

export default function ArchitecturePage() {
  return (
    <div className="section py-12">
      <Reveal>
        <SectionHeader
          eyebrow="System design"
          title="Six layers, one causal brain"
          subtitle="ARTH.AI is engineered to be deployable, explainable and compliant end-to-end — from consent-first ingestion to a privacy-preserving federated loop."
        />
      </Reveal>

      <div className="mt-12 space-y-4">
        {LAYERS.map((l, i) => (
          <Reveal key={l.n} delay={i * 0.05}>
            <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4 sm:w-72 sm:shrink-0">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/[0.04] ${l.color}`}>
                  <l.icon size={22} />
                </span>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Layer {l.n} · {l.sub}
                  </div>
                  <div className="text-lg font-bold text-white">{l.name}</div>
                </div>
              </div>
              <ul className="grid flex-1 gap-1.5 text-sm text-slate-400">
                {l.points.map((p, j) => (
                  <li key={j} className="flex gap-2">
                    <span className={l.color}>›</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* tech stack */}
      <Reveal>
        <div className="mt-16">
          <Eyebrow>Implementable today</Eyebrow>
          <h3 className="mt-3 text-2xl font-bold text-white">Production technology stack</h3>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Every component is a real, production-grade open-source tool. This
            prototype ships a faithful causal engine in TypeScript so the science
            runs live in the browser, validated by a Python DoWhy notebook.
          </p>
        </div>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((s, i) => (
          <Reveal key={s.area} delay={i * 0.05}>
            <div className="card h-full p-5">
              <s.icon size={20} className="text-arth-violet" />
              <div className="mt-3 text-sm font-bold text-white">{s.area}</div>
              <div className="mt-1 text-xs leading-relaxed text-slate-400">{s.tools}</div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* resilience */}
      <Reveal>
        <div className="mt-12 card p-7">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="teal">Resilience by design</Badge>
            <span className="text-sm text-slate-400">(RBI FREE-AI Sutra 7)</span>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              ["Stateless agents", "Any agent can restart without data loss — real-time state lives in Redis."],
              ["No intervention lost", "Durable queues guarantee at-least-once delivery if an agent crashes."],
              ["Circuit breakers", "External APIs (WhatsApp, DigiLocker) fail safe; no cascading outages."],
            ].map(([k, v]) => (
              <div key={k}>
                <div className="text-sm font-semibold text-white">{k}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-400">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
