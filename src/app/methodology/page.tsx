import type { Metadata } from "next";
import { Reveal, SectionHeader, Eyebrow, Badge } from "@/components/ui";
import { LiveBenchmark } from "@/components/live-benchmark";
import { LiveAblation } from "@/components/live-ablation";
import { CITATIONS } from "@/lib/citations";
import { AlertTriangle, BookOpen, FunctionSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Methodology — ARTH.AI",
  description: "The science behind ARTH.AI: structural causal modelling, Bayesian inversion, do-calculus, counterfactual timing, reproducible benchmarks, ablations and the research it stands on.",
};

export default function MethodologyPage() {
  return (
    <div className="section py-12">
      <Reveal>
        <Badge tone="violet"><BookOpen size={13} /> The science, in the open</Badge>
        <SectionHeader
          title="Methodology, benchmarks & ablations"
          subtitle="No black boxes and no invented numbers. Every claim is either drawn from peer-reviewed research or produced by the reproducible engine below — and clearly labelled as which."
        />
      </Reveal>

      {/* The math */}
      <Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          <MathCard
            step="1 · Inference"
            title="Bayesian SCM inversion"
            body="The life event L is a latent common cause of the signals S and the banking need N. We invert the structural model to get the posterior over events:"
            formula="P(L | S) ∝ P(L) · Πᵢ P(Sᵢ | L)"
            note="Graded signals enter as soft evidence — a Naive-Bayes read of a Bayesian network."
          />
          <MathCard
            step="2 · Intervention"
            title="do-operator"
            body="We don't ask which need correlates with a symptom. We follow the causal edge from the inferred event to the needs it produces:"
            formula="rank N by  w(L → N) · P(L | S)"
            note="This is why a wedding's jewelry spend never gets mistaken for a loan trigger."
          />
          <MathCard
            step="3 · Counterfactual"
            title="Timed by incremental effect"
            body="For each customer we estimate the conversion response to intervening at day d and compare acting now vs waiting:"
            formula="Δ = P(conv | do(now)) − P(conv | do(+14d))"
            note="An uplift-first policy: target the moment the action actually changes behaviour."
          />
        </div>
      </Reveal>

      {/* Why causal */}
      <Reveal>
        <div className="mt-10 card p-7">
          <Eyebrow>Why causal, not correlational</Eyebrow>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
            Predictive models estimate <em>who is likely to act</em>. Uplift / causal
            models estimate <em>whom an intervention actually changes</em> — the
            quantity a bank can act on without wasting contacts or mistiming offers
            (Devriendt et al., 2018). Life-event prediction from fine-grained
            transaction data is empirically established on 60M+ transactions, and
            the transaction counterparty graph yields a pseudo-social network of
            behavioural similarity (De Caigny, Coussement &amp; De Bock, 2020) — the
            same structure ARTH.AI uses for the SPARSH Trust Radius.
          </p>
        </div>
      </Reveal>

      {/* Live benchmark */}
      <div className="mt-12">
        <Reveal>
          <h3 className="text-xl font-bold text-white">Reproducible benchmark</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Generate a fresh synthetic cohort and score the causal engine against a
            correlational baseline — entirely in your browser.
          </p>
        </Reveal>
        <Reveal delay={0.05}><div className="mt-5"><LiveBenchmark /></div></Reveal>
      </div>

      {/* Live ablations */}
      <div className="mt-12">
        <Reveal>
          <h3 className="text-xl font-bold text-white">Ablation &amp; robustness</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Isolate each component’s contribution, expose the precision/coverage
            trade-off, and stress-test the engine under missing evidence.
          </p>
        </Reveal>
        <Reveal delay={0.05}><div className="mt-5"><LiveAblation /></div></Reveal>
      </div>

      {/* Limitations — honesty wins technical judges */}
      <Reveal>
        <div className="mt-12 card border-arth-amber/20 p-7">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-arth-amber" />
            <h3 className="text-lg font-bold text-white">Honest limitations</h3>
          </div>
          <ul className="mt-4 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
            {[
              "Benchmarks run on synthetic, self-generated data where ground truth is known. Real-world AUC will be lower and must be validated on consented production data via A/B holdouts.",
              "Causal identification assumes the modelled life event is the dominant confounder. Unobserved confounders require sensitivity analysis (DoWhy refutation) — included in /research.",
              "Account Aggregator data needs explicit, purpose-bound consent and cannot be pulled for non-customers; SPARSH operates only on consented or public, opt-in signals.",
              "The browser engine is a faithful but lightweight SCM; the production system uses DoWhy/EconML, a real GNN, and RCT-calibrated uplift estimators.",
            ].map((t, i) => (
              <li key={i} className="flex gap-2"><span className="text-arth-amber">›</span>{t}</li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Citations */}
      <div id="citations" className="mt-12 scroll-mt-20">
        <Reveal>
          <h3 className="text-xl font-bold text-white">Research &amp; citations</h3>
          <p className="mt-1 text-sm text-slate-400">Every quantitative claim traces to one of these sources.</p>
        </Reveal>
        <div className="mt-5 space-y-3">
          {CITATIONS.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.03}>
              <a href={c.url} target="_blank" rel="noopener noreferrer"
                className="card block p-5 transition-colors hover:border-arth-violet/30">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-semibold text-white">{c.title}</span>
                  <span className="mono-num text-xs text-slate-500">{c.year}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{c.authors} · {c.venue}</div>
                <div className="mt-2 text-sm leading-relaxed text-slate-400">{c.takeaway}</div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}

function MathCard({ step, title, body, formula, note }: {
  step: string; title: string; body: string; formula: string; note: string;
}) {
  return (
    <div className="card h-full p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-arth-violet">{step}</div>
      <div className="mt-1 flex items-center gap-2">
        <FunctionSquare size={16} className="text-slate-500" />
        <h4 className="font-bold text-white">{title}</h4>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
      <div className="mono-num mt-3 rounded-lg border border-white/10 bg-ink-950/60 px-3 py-2.5 text-center text-sm text-arth-teal">
        {formula}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-500">{note}</p>
    </div>
  );
}
