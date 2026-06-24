// ─────────────────────────────────────────────────────────────────────────
// ARTH.AI — Signal Engine (Layer 1)
//
// Converts a raw 180-day transaction history into a graded SignalVector.
// In the full architecture this is the Transaction GNN + Behavioural LSTM;
// here it is implemented as interpretable, deterministic feature extraction
// so judges can trace every number back to a transaction.
//
// Each signal strength ∈ [0,1] measures how strongly a merchant-category
// burst stands out against the customer's own baseline (self-normalised, so
// it works across income levels).
// ─────────────────────────────────────────────────────────────────────────

import { SIGNAL_CATEGORY, SIGNAL_KEYS } from "./scm-knowledge";
import {
  Customer,
  MerchantCategory,
  MerchantTxn,
  SignalKey,
  SignalVector,
} from "./types";

const RECENT_WINDOW = 90; // signals weigh the most recent 90 days

function categorySpend(txns: MerchantTxn[], cats: MerchantCategory[], recentOnly: boolean) {
  return txns
    .filter((t) => cats.includes(t.category))
    .filter((t) => (recentOnly ? t.day <= RECENT_WINDOW : true))
    .reduce((s, t) => s + Math.abs(t.amount), 0);
}

function categoryCount(txns: MerchantTxn[], cats: MerchantCategory[], recentOnly: boolean) {
  return txns.filter(
    (t) => cats.includes(t.category) && (recentOnly ? t.day <= RECENT_WINDOW : true)
  ).length;
}

/** Squashing function -> [0,1]. */
const squash = (x: number) => 1 / (1 + Math.exp(-x));

/**
 * Typical per-transaction spend (INR) for a category cluster. Lets each signal
 * be judged against ITS OWN scale — a ₹6.5k pediatric spend is as diagnostic as
 * a ₹65k jewelry spend — rather than against household income.
 */
const SIGNAL_REF_AMOUNT: Record<SignalKey, number> = {
  jewelry_spike: 50000,
  venue_catering: 90000,
  apparel_surge: 6000,
  salary_employer_change: 50000,
  baby_pharma: 4000,
  new_city_rent: 20000,
  hospital_spend: 25000,
  tuition_fee: 60000,
  electronics_spike: 35000,
  large_savings_inflow: 100000,
  travel_booking: 15000,
  furniture_home: 25000,
};

/**
 * Extract signal strengths. Driven primarily by recent occurrence COUNT
 * (a burst of category activity), with a magnitude bonus relative to the
 * signal's own reference scale. salary_employer_change is special — detects a
 * NEW payroll merchant appearing in the recent window.
 */
export function extractSignals(customer: Customer): SignalVector {
  const txns = customer.txns;
  const vec = {} as SignalVector;

  for (const sig of SIGNAL_KEYS) {
    if (sig === "salary_employer_change") {
      vec[sig] = detectEmployerChange(txns);
      continue;
    }
    const cats = SIGNAL_CATEGORY[sig];
    const recentCount = categoryCount(txns, cats, true);
    if (recentCount === 0) {
      vec[sig] = 0;
      continue;
    }
    const recentSpend = categorySpend(txns, cats, true);
    const avgTicket = recentSpend / recentCount;
    const magnitudeBonus = Math.min(1.2, avgTicket / SIGNAL_REF_AMOUNT[sig]);
    // count is the dominant evidence; magnitude refines it
    const strength = squash(1.35 * recentCount + 0.9 * magnitudeBonus - 1.7);
    vec[sig] = round2(strength);
  }
  return vec;
}

/** A new salary-credit merchant name in the recent window = employer change. */
function detectEmployerChange(txns: MerchantTxn[]): number {
  const credits = txns.filter((t) => t.category === "salary_credit");
  if (credits.length === 0) return 0;
  const recentMerchants = new Set(
    credits.filter((t) => t.day <= RECENT_WINDOW).map((t) => t.merchant)
  );
  const olderMerchants = new Set(
    credits.filter((t) => t.day > RECENT_WINDOW).map((t) => t.merchant)
  );
  let isNew = false;
  recentMerchants.forEach((m) => {
    if (!olderMerchants.has(m)) isNew = true;
  });
  return isNew ? 0.9 : 0.05;
}

const round2 = (x: number) => Math.round(x * 100) / 100;

// ── Higher-order network/behavioural features (for the SPARSH Trust Radius
//    and the customer graph visualisation) ────────────────────────────────

export interface NetworkFeatures {
  transactionVelocity: number; // txns / month, recent vs older ratio
  merchantDiversity: number; // unique categories touched (0..1)
  temporalDiscipline: number; // regularity of recurring payments (0..1)
  trustRadius: number; // # distinct SBI-counterparty relationships
  spendingMomentum: number; // recent vs baseline spend acceleration
  incomeStability: number; // 0..1
}

export function networkFeatures(customer: Customer): NetworkFeatures {
  const txns = customer.txns;
  const recent = txns.filter((t) => t.day <= 90);
  const older = txns.filter((t) => t.day > 90);

  const velocity =
    older.length === 0 ? 1 : round2(recent.length / Math.max(1, older.length));

  const cats = new Set(txns.map((t) => t.category));
  const merchantDiversity = round2(cats.size / 18);

  // temporal discipline: do salary credits land on a tight day-of-month band?
  const salaryDays = txns
    .filter((t) => t.category === "salary_credit")
    .map((t) => t.day % 30);
  const temporalDiscipline = salaryDays.length
    ? round2(1 - stddev(salaryDays) / 15)
    : 0.5;

  const trustRadius = new Set(
    txns.filter((t) => t.counterpartyIsSbi).map((t) => t.merchant + t.amount.toFixed(0))
  ).size;

  const recentSpend = recent.reduce((s, t) => s + (t.amount < 0 ? -t.amount : 0), 0);
  const olderSpend = older.reduce((s, t) => s + (t.amount < 0 ? -t.amount : 0), 0);
  const spendingMomentum = round2(
    olderSpend === 0 ? 1 : Math.min(2.5, recentSpend / olderSpend)
  );

  const credits = txns.filter((t) => t.amount > 0 && t.category === "salary_credit");
  const incomeStability = credits.length >= 4 ? 0.85 : credits.length >= 2 ? 0.6 : 0.4;

  return {
    transactionVelocity: velocity,
    merchantDiversity,
    temporalDiscipline: clamp01(temporalDiscipline),
    trustRadius,
    spendingMomentum,
    incomeStability,
  };
}

function stddev(xs: number[]) {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length);
}
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
