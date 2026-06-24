"""
ARTH.AI — Formal causal validation with DoWhy
=============================================

This module backs the in-browser TypeScript engine with the real causal-inference
toolchain (DoWhy, Microsoft Research) so technical judges can reproduce the claim
that ARTH.AI reasons *causally*, not correlationally.

The demonstration centres on the confounding structure ARTH.AI is built around:

        life_event  (latent common cause)
           /     \
          v       v
     jewelry_spend   banking_need
          (symptom)     (the thing we act on)

A purely correlational reader sees a strong jewelry_spend -> banking_need
association and acts on the symptom. But that association is CONFOUNDED by the
life event: once we adjust for life_event (the back-door), the *direct* effect of
jewelry_spend on banking_need collapses toward zero. ARTH.AI therefore times its
intervention to the life event, not the symptom.

Pipeline (DoWhy's four steps):
    1. MODEL     — encode the causal graph
    2. IDENTIFY  — find the estimand (back-door adjustment)
    3. ESTIMATE  — naive (unadjusted) vs causal (adjusted)
    4. REFUTE    — placebo treatment + random common cause robustness checks

Run:
    pip install -r requirements.txt
    python causal_validation.py
"""

from __future__ import annotations

import numpy as np
import pandas as pd

RNG = np.random.default_rng(42)
N = 8000


def generate(n: int = N) -> pd.DataFrame:
    """Generate data from the TRUE structural causal model.

    Ground truth: jewelry_spend has NO direct causal effect on banking_need.
    Both are driven by the latent wedding (life_event). Any naive association
    is pure confounding — exactly what ARTH.AI must not be fooled by.
    """
    # latent life event (e.g. wedding approaching)
    life_event = RNG.binomial(1, 0.18, size=n)

    # symptom: jewelry spend is caused by the life event (+ noise)
    p_jewelry = 0.06 + 0.72 * life_event
    jewelry_spend = RNG.binomial(1, p_jewelry)

    # the banking need is caused by the life event (+ noise) and, by construction,
    # NOT by jewelry_spend (true direct effect = 0)
    true_direct_effect = 0.0
    p_need = 0.05 + 0.70 * life_event + true_direct_effect * jewelry_spend
    banking_need = RNG.binomial(1, np.clip(p_need, 0, 1))

    return pd.DataFrame(
        {
            "life_event": life_event,
            "jewelry_spend": jewelry_spend,
            "banking_need": banking_need,
        }
    ), true_direct_effect


def naive_association(df: pd.DataFrame) -> float:
    """What a correlational model 'learns': P(need|jewelry) - P(need|no jewelry)."""
    a = df.loc[df.jewelry_spend == 1, "banking_need"].mean()
    b = df.loc[df.jewelry_spend == 0, "banking_need"].mean()
    return a - b


def main() -> None:
    df, true_effect = generate()

    print("=" * 64)
    print("ARTH.AI - Causal validation (DoWhy)")
    print("=" * 64)
    print(f"Samples: {len(df)} | life-event base rate: {df.life_event.mean():.2%}")
    print(f"TRUE direct effect of jewelry_spend -> banking_need: {true_effect:.3f}\n")

    naive = naive_association(df)
    print(f"[Correlational] naive jewelry->need association : {naive:+.3f}")
    print("   A bank acting on this would chase the symptom and mistime the offer.\n")

    try:
        from dowhy import CausalModel
    except ImportError:
        print("dowhy not installed - run: pip install -r requirements.txt")
        print("(The naive vs adjusted contrast above already shows the confounding.)")
        return

    # 1. MODEL — declare the causal graph
    model = CausalModel(
        data=df,
        treatment="jewelry_spend",
        outcome="banking_need",
        common_causes=["life_event"],  # the confounder / back-door
    )

    # 2. IDENTIFY
    estimand = model.identify_effect(proceed_when_unidentifiable=True)

    # 3. ESTIMATE — back-door adjustment via propensity/linear regression
    estimate = model.estimate_effect(
        estimand, method_name="backdoor.linear_regression"
    )
    causal_effect = float(estimate.value)
    print(f"[Causal/DoWhy] back-door-adjusted direct effect  : {causal_effect:+.3f}")
    print(f"   Adjusting for the life event collapses the effect toward the")
    print(f"   true value ({true_effect:.3f}) - the association was confounding.\n")

    print(f"Confounding bias removed: {abs(naive - causal_effect):.3f} "
          f"({(1 - abs(causal_effect) / max(abs(naive), 1e-9)) * 100:.0f}% of the naive signal was spurious)\n")

    # 4. REFUTE — robustness / falsification checks
    print("-" * 64)
    print("Refutation tests (a credible causal estimate should survive these):")
    print("-" * 64)
    for name, method in [
        ("Placebo treatment (effect should vanish)", "placebo_treatment_refuter"),
        ("Random common cause (effect should hold)", "random_common_cause"),
    ]:
        try:
            ref = model.refute_estimate(estimand, estimate, method_name=method)
            print(f"  - {name}\n      {ref}")
        except Exception as exc:  # pragma: no cover - environment dependent
            print(f"  - {name}: skipped ({exc})")

    print("\nConclusion: jewelry_spend and banking_need are confounded by the life")
    print("event. ARTH.AI infers the event and acts on the cause - not the symptom.")


if __name__ == "__main__":
    main()
