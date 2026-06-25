import type { Metadata } from "next";
import { Reveal, SectionHeader, Eyebrow, Badge } from "@/components/ui";
import { cite } from "@/lib/citations";
import {
  ShieldCheck, Users, Lightbulb, Scale, ClipboardCheck, Eye, Activity, Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Compliance — ARTH.AI",
  description: "ARTH.AI mapped to RBI's FREE-AI framework (7 Sutras) and the DPDP Act 2023 & Rules 2025 — regulatory readiness built in by design.",
};

const SUTRAS = [
  { icon: ShieldCheck, name: "Trust", impl: "AI involvement is always disclosed to the customer; trust is treated as the core asset, not an afterthought." },
  { icon: Users, name: "People First", impl: "A human-in-the-loop override gates every credit decision; the customer can always reach a person." },
  { icon: Lightbulb, name: "Innovation", impl: "Causal inference is deployed responsibly inside a sandbox-first, A/B-validated rollout." },
  { icon: Scale, name: "Fairness", impl: "The causal model conditions on the true life event, structurally blocking proxy discrimination on caste, gender or religion." },
  { icon: ClipboardCheck, name: "Accountability", impl: "An immutable consent + decision ledger records what was decided, on what evidence, and under whose authority." },
  { icon: Eye, name: "Explainability", impl: "Every action ships with a plain-language reason — the exact signals and causal path that drove it." },
  { icon: Activity, name: "Resilience", impl: "Stateless agents, durable queues and circuit breakers ensure no intervention is lost and no cascade occurs." },
];

const DPDP = [
  ["Consent is free, specific, informed, unconditional & unambiguous", "Per-signal, purpose-bound consent captured as a verifiable artefact before any data is read."],
  ["Right to withdraw, as easily as it was given", "One-tap revocation per signal; downstream models drop the signal immediately."],
  ["Purpose limitation & data minimisation", "Only signals needed for the stated purpose are ingested; nothing is retained beyond it."],
  ["Data Principal rights & grievance", "In-app access, correction and complaint routes to the Data Protection Board."],
  ["Federated learning", "Raw data never leaves the device; only privacy-preserving model updates aggregate."],
];

export default function CompliancePage() {
  const freeai = cite("rbi-freeai");
  const dpdp = cite("dpdp");
  return (
    <div className="section py-12">
      <Reveal>
        <Badge tone="teal"><Lock size={13} /> Regulatory readiness</Badge>
        <SectionHeader
          title="Compliant by design — not by patch"
          subtitle="ARTH.AI is engineered against India's current AI-in-finance regime: the RBI FREE-AI framework and the DPDP Act 2023 & Rules 2025. Governance is part of the architecture, not an afterthought."
        />
      </Reveal>

      {/* FREE-AI */}
      <div className="mt-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>RBI FREE-AI · the seven Sutras</Eyebrow>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Framework for Responsible &amp; Ethical Enablement of AI
              </h3>
            </div>
            <a href={freeai.url} target="_blank" rel="noopener noreferrer" className="text-xs text-arth-violet hover:underline">
              RBI report (Aug 2025) ↗
            </a>
          </div>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUTRAS.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.04}>
              <div className="card h-full p-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-arth-violet/10 text-arth-violet">
                    <s.icon size={18} />
                  </span>
                  <span className="font-bold text-white">{s.name}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{s.impl}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* DPDP */}
      <div className="mt-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>DPDP Act 2023 &amp; Rules 2025</Eyebrow>
              <h3 className="mt-2 text-2xl font-bold text-white">Consent architecture</h3>
            </div>
            <a href={dpdp.url} target="_blank" rel="noopener noreferrer" className="text-xs text-arth-violet hover:underline">
              The Act ↗
            </a>
          </div>
        </Reveal>
        <div className="mt-6 space-y-3">
          {DPDP.map(([req, impl], i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className="card grid gap-3 p-5 sm:grid-cols-[1fr_1fr] sm:items-center">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0 text-arth-teal" />
                  <span className="text-sm font-medium text-slate-200">{req}</span>
                </div>
                <div className="text-sm text-slate-400 sm:border-l sm:border-white/[0.06] sm:pl-4">{impl}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-4 text-xs text-slate-600">
            Substantive DPDP obligations phase in through May 2027 — ARTH.AI is built to that bar today. This prototype uses only synthetic, consent-simulated data.
          </p>
        </Reveal>
      </div>

      {/* Governance FAQ */}
      <Reveal>
        <div className="mt-14 card p-7">
          <h3 className="text-lg font-bold text-white">Common questions on governance</h3>
          <div className="mt-5 divide-y divide-white/[0.06]">
            {[
              ["How is customer data protected?", "Federated learning — raw data never leaves the device; only differentially-private updates aggregate."],
              ["What about consent?", "Granular, per-signal, purpose-bound and revocable at any time via the consent ledger."],
              ["Is it fair / non-discriminatory?", "The causal model conditions on the real life event, which structurally prevents proxy discrimination."],
              ["Who is accountable for an AI decision?", "Every credit decision has human-in-the-loop override; the ledger records authority and evidence."],
              ["Can you explain a decision?", "Yes — each action carries the exact signals and causal path in plain language."],
            ].map(([q, a], i) => (
              <div key={i} className="grid gap-2 py-4 sm:grid-cols-[260px_1fr]">
                <div className="text-sm font-semibold text-slate-200">{q}</div>
                <div className="text-sm text-slate-400">{a}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
