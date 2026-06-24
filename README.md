<div align="center">

# ARTH.AI

### Agentic Real-Time Intelligence for Holistic Banking

**The first bank that understands _WHY_.**

Causal, agentic AI for customer acquisition, digital adoption & engagement.
Built for the **SBI BI Hackathon @ GFF 2026** · _AI & Emerging Tech track_.

[Live Demo](#) · [Methodology](#-methodology--why-this-is-real) · [Compliance](#-regulatory-readiness)

</div>

---

## 🎯 The one-line pitch

> Every banking AI **predicts** what a customer might do. ARTH.AI uses **causal inference** to understand **why** they do it — and acts at the right moment, in the right language, on the right channel, autonomously — while staying compliant with RBI's FREE-AI framework and the DPDP Act by design.

---

## 💡 The core innovation: Causal AI, not just Predictive AI

| | Correlational AI (what most banks do) | **Causal AI (ARTH.AI)** |
|---|---|---|
| Question | "Who is *likely* to act?" | "*Whom* does our action change, and *when*?" |
| Example | "Jewelry buyers → need a loan" | "A **wedding** causes *both* the jewelry spend *and* the loan need" |
| Failure mode | Chases symptoms, mistimes offers, wastes contacts | Acts on the **cause**, timed to the event |
| Foundation | Propensity scoring | Structural Causal Models + uplift modeling |

This isn't marketing language — it's the academic distinction between **predictive** and **uplift/causal** modeling (Devriendt et al., 2018). Life-event prediction from transaction data is empirically established on 60M+ transactions (De Caigny, Coussement & De Bock, 2020), whose transaction-counterparty **pseudo-social network** is exactly the structure ARTH.AI uses for its SPARSH _Trust Radius_.

**Measured, reproducibly, in your browser:** the causal engine recovers the right banking need **~70%** of the time vs **~29%** for the correlational shortcut — a **+138% relative uplift** — with per-event recall of **65–87%** on real life events.
_(Controlled synthetic simulation — see [Methodology](#-methodology--why-this-is-real). Figures vary per run; real-world results require A/B-validated production data.)_

---

## 🏗️ System architecture — six layers, one causal brain

```
LAYER 0  Data Ingestion (consent-first)   UPI graph · Account Aggregator · app behaviour
   ↓
LAYER 1  Signal Engine                    Transaction GNN · behavioural sequences
   ↓
LAYER 2  Causal Inference Engine ★        Structural Causal Model · do-operator · counterfactuals
   ↓
LAYER 3  Autonomous Agent Network         SPARSH · PRAGATI · BANDHAN · GYAAN
   ↓
LAYER 4  Intervention Layer               right channel · time · language · tone
   ↓
LAYER 5  Federated Learning Loop          models improve · raw data never leaves device
```

---

## 🤖 The four autonomous agents (mapped to the 3 SBI pillars)

| Agent | Pillar | What it does |
|---|---|---|
| **SPARSH** | Acquisition | Consent-based **Financial Trust Radius** profiling + zero-friction sub-5-minute video-KYC onboarding for prospects inside SBI's transaction network. |
| **PRAGATI** | Digital Adoption | A **Digital Comfort Score** unlocks features by *psychological readiness*; nudges fire at peak-attention moments, never during detected stress. |
| **BANDHAN** | Engagement | A **Financial Empathy Index** answers stress with *support, not sales* — plus proactive rate renegotiation and milestone intelligence. |
| **GYAAN** | Meta-learning | Privacy-preserved **Financial Twin** clusters turn collective outcomes into peer-validated, statistically-grounded guidance. |

Each agent consumes the *same* causal inference and carries a **plain-language reason** + a **human-in-the-loop override** for every action.

---

## 🔬 Methodology — why this is real

ARTH.AI's brain is a genuine **Structural Causal Model**, not a scripted demo:

1. **Inference** — Bayesian inversion of the SCM: `P(life event | signals) ∝ P(L)·Πᵢ P(Sᵢ|L)`
2. **Intervention** — the `do`-operator ranks the needs the inferred event *causes* (not symptom-correlated needs)
3. **Counterfactual timing** — `Δ = P(convert | do(now)) − P(convert | do(+14d))`, an uplift-first policy

**Validated three ways, all runnable:**
- **Reproducible benchmark** (in-browser): causal vs correlational on fresh synthetic cohorts
- **Ablation & robustness** (in-browser): component ablation ladder, action-threshold precision/coverage sweep, graceful degradation under signal dropout
- **Formal causal validation** (`/research`, Python + **DoWhy**): demonstrates a strong **+0.47 naive association that is pure confounding** (true direct effect = 0), recovered by back-door adjustment, with placebo + random-common-cause refutations

```bash
cd research
pip install -r requirements.txt
python causal_validation.py
```

---

## 🛡️ Regulatory readiness

Designed against India's **current** AI-in-finance regime — directly scoring the jury's *Regulatory Readiness* criterion:

- **RBI FREE-AI** (Aug 2025) — engineered to all 7 Sutras: Trust · People First · Innovation · Fairness · Accountability · Explainability · Resilience
- **DPDP Act 2023 & Rules 2025** — per-signal, purpose-bound, revocable consent ledger; data minimisation; federated learning so raw data never leaves the device
- **Human-in-the-loop** override on every credit decision; **plain-language explanation** for every action; causal model **structurally blocks proxy discrimination**

> This prototype uses only **synthetic, consent-simulated data**. No real customer data is used.

---

## 💼 Business case

- Targets a real, quantified leak: **~60% of applicants abandon** complex digital onboarding before activation.
- Builds on SBI's own proof point: paperless **video-KYC cut acquisition cost ~38%** vs branch; **>98%** of SBI transactions are already digital.
- Three pillars, one platform — acquisition, adoption and engagement compound on shared causal intelligence.

---

## 🧰 Tech stack

**Prototype (this repo):** Next.js 14 · TypeScript · Tailwind · Framer Motion · Recharts — with a faithful causal SCM engine running **live in the browser**, validated by a Python **DoWhy** notebook.

**Production blueprint:** LangGraph (agents) · DoWhy / EconML / CausalNex (causal) · PyTorch Geometric (GNN) · FastAPI + Celery · Neo4j + PostgreSQL + Redis · Flower (federated learning) + differential privacy.

---

## 🚀 Run it locally

```bash
npm install
npm run dev          # http://localhost:3000

# verify the engine + ablations headlessly
npx tsx scripts/verify-engine.ts
npx tsx scripts/verify-ablations.ts
```

---

## 🗺️ Roadmap

**3-month pilot** (sandbox, A/B holdout on consented cohort) → **6-month scale** (regional, RCT-calibrated uplift) → **national deployment** with federated learning.

---

## 📚 Citations

All quantitative claims trace to sources listed in [`src/lib/citations.ts`](src/lib/citations.ts) and on the in-app **Methodology** page: De Caigny, Coussement & De Bock (2020, *Decision Support Systems*); Devriendt et al. (2018, *Big Data* — uplift survey); Sharma & Kiciman (2020, DoWhy); RBI FREE-AI (2025); DPDP Act 2023 & Rules 2025; AA framework; industry onboarding & SBI video-KYC figures.

<div align="center">

**ARTH.AI** — _the first causally-intelligent bank._ · Built for SBI BI Hackathon @ GFF 2026

</div>
