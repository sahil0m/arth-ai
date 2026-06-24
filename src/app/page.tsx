import Link from "next/link";
import {
  ArrowRight,
  Brain,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
} from "lucide-react";
import { HeroDemo } from "@/components/hero-demo";
import { Reveal, SectionHeader, Eyebrow, Stat, Badge } from "@/components/ui";
import { cite } from "@/lib/citations";

const AGENTS = [
  {
    name: "SPARSH",
    tag: "Acquisition",
    color: "text-arth-violet",
    icon: Target,
    desc: "Consent-based Trust-Radius profiling + zero-friction, sub-5-minute video-KYC onboarding for prospects inside SBI's transaction network.",
  },
  {
    name: "PRAGATI",
    tag: "Adoption",
    color: "text-arth-teal",
    icon: TrendingUp,
    desc: "A Digital Comfort Score unlocks features by psychological readiness, and nudges fire at peak-attention moments — never during detected stress.",
  },
  {
    name: "BANDHAN",
    tag: "Engagement",
    color: "text-arth-amber",
    icon: Users,
    desc: "A Financial Empathy Index responds to stress with support, not sales — plus proactive rate renegotiation and milestone intelligence.",
  },
  {
    name: "GYAAN",
    tag: "Meta-learning",
    color: "text-arth-rose",
    icon: Brain,
    desc: "Privacy-preserved 'Financial Twin' clusters turn collective outcomes into peer-validated, statistically-grounded guidance.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [mask-image:radial-gradient(70%_50%_at_50%_0%,black,transparent)] [background-size:48px_48px]" />
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-[28rem] w-[28rem] -translate-x-1/2 glow-orb opacity-60" />

        <div className="section grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <Reveal>
            <Badge tone="violet">
              <Sparkles size={13} /> SBI BI Hackathon @ GFF 2026 · Agentic AI track
            </Badge>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
              The first bank that understands{" "}
              <span className="gradient-text">WHY</span>.
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-400">
              Every banking AI predicts <em>what</em> a customer might do. ARTH.AI
              uses <strong className="text-slate-200">causal inference</strong> to
              understand <em>why</em> they do it — and acts at the right moment,
              in the right language, on the right channel. Autonomously.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/demo" className="btn-primary">
                Run the live demo <ArrowRight size={16} />
              </Link>
              <Link href="/methodology" className="btn-ghost">
                See the science
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5"><GitBranch size={13} /> Real causal SCM engine</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} /> DPDP &amp; RBI FREE-AI by design</span>
              <span className="flex items-center gap-1.5"><Workflow size={13} /> 4 autonomous agents</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <HeroDemo />
          </Reveal>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="section py-12">
        <Reveal>
          <div className="card grid gap-6 p-8 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <Eyebrow>The acquisition &amp; engagement gap</Eyebrow>
            </div>
            <ProblemStat
              figure="~60%"
              text="of applicants abandon complex digital onboarding before activation."
              src={cite("onboarding-dropoff").url}
            />
            <ProblemStat
              figure="3 in 5"
              text="drop a digital application if it takes longer than five minutes."
              src={cite("onboarding-dropoff").url}
            />
            <ProblemStat
              figure="Timing"
              text="Banks reach customers on fixed calendars — not when life creates the need. Right product, wrong moment."
              src={cite("uplift-survey").url}
            />
          </div>
        </Reveal>
      </section>

      {/* THE INSIGHT */}
      <section className="section py-16">
        <Reveal>
          <SectionHeader
            center
            eyebrow="The core innovation"
            title={<>Causal AI, not just predictive AI</>}
            subtitle={
              <>
                Predictive models ask <em>“who is likely to act?”</em>. Causal /
                uplift models ask <em>“whom does our action actually change, and
                when?”</em> ARTH.AI infers the <strong className="text-slate-200">latent
                life event</strong> that jointly causes both the spending pattern
                and the banking need — so it never confuses a symptom for a cause.
              </>
            }
          />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-7">
              <Badge tone="rose">Correlational — what most banks do</Badge>
              <p className="mt-4 text-slate-300">
                “Customers who buy jewelry are likely to need a personal loan.”
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                This is a spurious shortcut. It fires for festival shoppers and
                the wealthy alike, mistimes the offer, and wastes the contact.
                It can’t tell <em>why</em>.
              </p>
              <div className="mt-5 font-mono text-xs text-slate-500">
                jewelry&nbsp;⟶&nbsp;loan&nbsp;&nbsp;<span className="text-arth-rose">(confounded)</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card h-full border-arth-violet/20 p-7 shadow-glow">
              <Badge tone="violet">Causal — what ARTH.AI does</Badge>
              <p className="mt-4 text-slate-200">
                “A <strong>wedding</strong> is approaching — it causes the jewelry
                purchase <em>and</em> the joint-account + loan need.”
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                ARTH.AI builds a Structural Causal Model, infers the event, and
                times the intervention to the <em>event</em>, not the symptom —
                with a plain-language reason for every decision.
              </p>
              <div className="mt-5 font-mono text-xs text-slate-400">
                wedding&nbsp;⟶&nbsp;&#123;&nbsp;jewelry,&nbsp;venue,&nbsp;<span className="text-arth-teal">banking&nbsp;need</span>&nbsp;&#125;
              </div>
            </div>
          </Reveal>
        </div>

        {/* Reproducible benchmark */}
        <Reveal delay={0.1}>
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Measured live, in your browser, on 400 synthetic customers —{" "}
                <Link href="/methodology" className="text-arth-violet hover:underline">
                  reproducible benchmark ↗
                </Link>
              </p>
              <Badge tone="teal">Controlled synthetic simulation</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Stat value="≈70%" label="Causal need accuracy" sub="recovers the right banking need" />
              <Stat value="≈29%" label="Correlational accuracy" sub="strongest-signal shortcut" accent="amber" />
              <Stat value="+138%" label="Relative uplift" sub="causal vs correlational" accent="teal" />
              <Stat value="65–87%" label="Real life-event recall" sub="per-event recovery range" accent="teal" />
            </div>
            <p className="mt-3 text-xs text-slate-600">
              Life-event prediction from transaction data is empirically established —{" "}
              {cite("decaigny2020").authors} ({cite("decaigny2020").year}),{" "}
              <em>{cite("decaigny2020").venue}</em>. Figures above are from ARTH.AI’s
              own controlled simulation, not a real-world deployment.
            </p>
          </div>
        </Reveal>
      </section>

      {/* AGENTS */}
      <section className="section py-16">
        <Reveal>
          <SectionHeader
            eyebrow="Layer 3 · the autonomous agent network"
            title="Four agents, three pillars, one causal brain"
            subtitle="Each agent consumes the same causal inference and acts on its pillar of the SBI mandate — acquisition, adoption and engagement — with a meta-learner that improves all three."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {AGENTS.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.07}>
              <div className="card group h-full p-6 transition-all hover:border-white/15">
                <div className="flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-xl bg-white/[0.04] ${a.color}`}>
                    <a.icon size={20} />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-white">{a.name}</span>
                      <span className={`text-xs font-semibold ${a.color}`}>{a.tag}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <div className="mt-8 text-center">
            <Link href="/agents" className="btn-ghost">
              Watch all four act on one customer <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* COMPLIANCE */}
      <section className="section py-16">
        <Reveal>
          <div className="card overflow-hidden p-8 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
              <div>
                <Eyebrow>Regulatory readiness — built in, not bolted on</Eyebrow>
                <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                  Aligned to RBI FREE-AI &amp; DPDP from line one
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-400">
                  ARTH.AI is designed against the seven Sutras of RBI’s 2025
                  FREE-AI framework and the consent architecture of the DPDP Act
                  2023 &amp; Rules 2025 — human override on every credit decision,
                  per-signal revocable consent, and a plain-language reason behind
                  every action.
                </p>
                <Link href="/compliance" className="btn-primary mt-6">
                  Explore the governance model <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Trust", "AI use is disclosed"],
                  ["People First", "Human override on credit"],
                  ["Fairness", "Causal model blocks proxy bias"],
                  ["Explainability", "A reason for every decision"],
                  ["Accountability", "Full consent + decision ledger"],
                  ["Resilience", "Stateless, fail-safe agents"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                    <div className="text-sm font-semibold text-white">{k}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="section pb-8 pt-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-arth-violet/20 bg-gradient-to-br from-ink-800 to-ink-900 p-10 text-center shadow-glow">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[30rem] -translate-x-1/2 glow-orb opacity-50" />
            <h3 className="text-balance text-3xl font-bold text-white sm:text-4xl">
              See ARTH.AI read a customer in 45 seconds.
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-slate-400">
              Generate a synthetic SBI customer, watch the causal engine infer the
              life event, and see all four agents decide — live.
            </p>
            <Link href="/demo" className="btn-primary mx-auto mt-7">
              Launch the demo <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function ProblemStat({ figure, text, src }: { figure: string; text: string; src: string }) {
  return (
    <div>
      <div className="mono-num text-3xl font-bold text-white">{figure}</div>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{text}</p>
      <a href={src} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-[11px] text-slate-600 hover:text-arth-violet">
        source ↗
      </a>
    </div>
  );
}
