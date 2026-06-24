# ARTH.AI — `/research` · Formal causal validation

This folder backs the in-browser TypeScript engine with the **real** causal-inference
toolchain (DoWhy, Microsoft Research), so technical judges can reproduce the claim
that ARTH.AI reasons **causally**, not correlationally.

## What it demonstrates

The dataset is generated from a known Structural Causal Model where a latent
**life event** (e.g. a wedding) is the common cause of both a **symptom**
(jewelry spend) and the **banking need** — and where jewelry spend has, by
construction, **zero direct effect** on the need.

```
        life_event  (latent confounder)
           /     \
          v       v
   jewelry_spend   banking_need        true direct effect (jewelry -> need) = 0
```

A correlational reader sees a strong association and acts on the symptom.
After **back-door adjustment** for the life event, that association collapses to
~0 — proving it was pure confounding.

## Pipeline (DoWhy's four steps)

1. **Model** the causal graph
2. **Identify** the estimand (back-door)
3. **Estimate** naive vs causal (adjusted)
4. **Refute** — placebo treatment + random common cause

## Run

```bash
pip install -r requirements.txt
python causal_validation.py
```

## Expected result (actual run — see `SAMPLE_OUTPUT.txt`)

```
[Correlational] naive jewelry->need association : +0.474   <- strong, but spurious
[Causal/DoWhy]  back-door-adjusted direct effect : +0.014   <- the truth (~0) recovered
Confounding bias removed: 0.460 (97% of the naive signal was spurious)

Refutation tests:
  - Placebo treatment      -> new effect ~ -0.001, p = 0.86  (PASS: effect vanishes)
  - Random common cause    -> effect stable at  0.014, p = 0.92  (PASS: effect holds)
```

So **97% of what a correlational model would "learn" is pure confounding.**
Even **without** DoWhy installed, the script prints the naive-vs-true contrast,
which already exposes the confounding. With DoWhy, the refutation tests confirm
the estimate is credible (placebo effect ≈ 0; effect stable under a random common
cause).

> The in-browser benchmark/ablation studies live in the main app
> (`/methodology`). This module is the *formal* causal-validity counterpart.
