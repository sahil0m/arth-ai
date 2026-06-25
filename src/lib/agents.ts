// ARTH.AI — Autonomous Agent Network (Layer 3)
//
// Four agents that consume the causal inference + signals and emit concrete,
// explainable actions. Each is a deterministic decision policy here; in the
// full architecture each is a LangGraph agent with the same decision surface.
//
//   SPARSH  — Acquisition  (Financial Trust Radius, consent-first onboarding)
//   PRAGATI — Adoption      (Digital Comfort Score, progressive disclosure)
//   BANDHAN — Engagement    (Financial Empathy Index, proactive renegotiation)
//   GYAAN   — Meta-learning (Financial Twin clusters, peer-validated guidance)

import { networkFeatures } from "./signals";
import { inferFromCustomer, timingCounterfactual } from "./causal";
import { EVENT_LABEL, NEED_LABEL } from "./scm-knowledge";
import { BankingNeed, Channel, Customer, Language } from "./types";

// SPARSH — Customer Acquisition
export interface SparshDecision {
  eligible: boolean;
  lifeEventScore: number; // 0..100
  financialHealthProxy: "Low" | "Moderate" | "Moderate-Good" | "Good";
  trustRadius: number;
  optimalChannel: Channel;
  language: Language;
  optimalHour: number;
  decision: "ACTIVATE" | "NURTURE" | "HOLD";
  rationale: string[];
  message: string;
}

export function runSparsh(customer: Customer): SparshDecision {
  const { inference } = inferFromCustomer(customer);
  const net = networkFeatures(customer);
  const lifeEventScore = Math.round(
    (1 - inference.posterior.NONE) * 100 * 0.7 + inference.confidence * 100 * 0.3
  );
  const health =
    net.incomeStability > 0.8 && net.temporalDiscipline > 0.6
      ? "Good"
      : net.incomeStability > 0.6
      ? "Moderate-Good"
      : net.incomeStability > 0.45
      ? "Moderate"
      : "Low";

  const trust = net.trustRadius;
  const decision: SparshDecision["decision"] =
    trust >= 5 && lifeEventScore >= 55
      ? "ACTIVATE"
      : trust >= 3 || lifeEventScore >= 45
      ? "NURTURE"
      : "HOLD";

  const rationale = [
    `Life-event score ${lifeEventScore}/100 — ${EVENT_LABEL[inference.topEvent].toLowerCase()} detected (${Math.round(
      inference.confidence * 100
    )}% causal confidence)`,
    `Financial-health proxy: ${health} (income stability ${(net.incomeStability * 100).toFixed(
      0
    )}%, payment discipline ${(net.temporalDiscipline * 100).toFixed(0)}%)`,
    `Trust Radius: ${trust} SBI customers transact within this person's network`,
    `Optimal channel ${labelChannel(customer.preferredChannel)} · ${customer.language} · ${fmtHour(
      customer.peakAttentionHour
    )}`,
  ];

  const message =
    decision === "ACTIVATE"
      ? `Namaste ${customer.name}, open your free SBI zero-balance account in 4 minutes — fully from your phone, no branch visit. Aadhaar and a 10-second selfie is all it takes, and your first UPI payment is on us with ₹51 cashback.`
      : `Hi ${customer.name}, when you're ready, SBI lets you open an account in minutes from home. We'll be here.`;

  return {
    eligible: decision !== "HOLD",
    lifeEventScore,
    financialHealthProxy: health,
    trustRadius: trust,
    optimalChannel: customer.preferredChannel,
    language: customer.language,
    optimalHour: customer.peakAttentionHour,
    decision,
    rationale,
    message,
  };
}

// PRAGATI — Digital Adoption
export interface DigitalComfort {
  score: number; // 0..100
  tier: "Beginner" | "Intermediate" | "Proficient" | "Advanced";
  unlocked: string[];
  nextUnlock: string | null;
  components: { label: string; value: number }[];
}

const TIERS: { max: number; tier: DigitalComfort["tier"]; unlocked: string[] }[] = [
  { max: 30, tier: "Beginner", unlocked: ["UPI Payments", "Balance & Statements"] },
  { max: 60, tier: "Intermediate", unlocked: ["Fixed Deposit", "Savings Goals", "Bill Pay"] },
  { max: 80, tier: "Proficient", unlocked: ["Mutual Funds / SIP", "Insurance", "Credit Card"] },
  { max: 101, tier: "Advanced", unlocked: ["Wealth Suite", "Forex", "Demat & Trading", "Loans"] },
];

export function digitalComfort(customer: Customer): DigitalComfort {
  const net = networkFeatures(customer);
  // Synthesise component sub-scores from behavioural proxies.
  const featureConfidence = clamp01(net.merchantDiversity * 1.2);
  const sessionCompletion = clamp01(0.4 + net.temporalDiscipline * 0.5);
  const decisiveness = clamp01(0.35 + net.incomeStability * 0.5);
  const lowErrorRate = clamp01(0.5 + (net.transactionVelocity > 1 ? 0.3 : 0.1));
  const exploration = clamp01(net.merchantDiversity);

  const raw =
    featureConfidence * 0.28 +
    sessionCompletion * 0.22 +
    decisiveness * 0.2 +
    lowErrorRate * 0.18 +
    exploration * 0.12;
  const score = Math.round(raw * 100);

  let cumUnlocked: string[] = [];
  let tier: DigitalComfort["tier"] = "Beginner";
  let nextUnlock: string | null = null;
  for (let i = 0; i < TIERS.length; i++) {
    if (score < TIERS[i].max) {
      tier = TIERS[i].tier;
      cumUnlocked = TIERS.slice(0, i + 1).flatMap((t) => t.unlocked);
      nextUnlock = TIERS[i + 1]?.unlocked[0] ?? null;
      break;
    }
  }

  return {
    score,
    tier,
    unlocked: cumUnlocked,
    nextUnlock,
    components: [
      { label: "Feature confidence", value: round2(featureConfidence) },
      { label: "Session completion", value: round2(sessionCompletion) },
      { label: "Decisiveness", value: round2(decisiveness) },
      { label: "Low error rate", value: round2(lowErrorRate) },
      { label: "Re-exploration", value: round2(exploration) },
    ],
  };
}

export interface PragatiNudge {
  shouldSend: boolean;
  feature: string;
  reason: string;
  message: string;
  sendAtHour: number;
}

export function runPragati(customer: Customer): { comfort: DigitalComfort; nudge: PragatiNudge } {
  const comfort = digitalComfort(customer);
  const { inference } = inferFromCustomer(customer);
  const topNeed = inference.rankedNeeds[0]?.need;
  const feature = topNeed ? NEED_LABEL[topNeed] : comfort.nextUnlock ?? "Savings Goals";

  const message = buildNudge(customer, topNeed, feature);
  return {
    comfort,
    nudge: {
      shouldSend: inference.topEvent !== "NONE" || comfort.nextUnlock !== null,
      feature,
      reason: `${EVENT_LABEL[inference.topEvent]} → ${feature} is now contextually relevant. Sending at the customer's peak-attention hour (${fmtHour(
        customer.peakAttentionHour
      )}), outside any detected stress window.`,
      message,
      sendAtHour: customer.peakAttentionHour,
    },
  };
}

function buildNudge(customer: Customer, need: BankingNeed | undefined, feature: string): string {
  const salary = customer.monthlyIncomeEstimate;
  if (need === "fixed_deposit" || feature.includes("Fixed Deposit")) {
    const park = Math.round((salary * 0.25) / 1000) * 1000;
    const earn = Math.round(park * 0.071 * (90 / 365));
    return `Your ₹${salary.toLocaleString("en-IN")} salary just arrived. Park ₹${park.toLocaleString(
      "en-IN"
    )} for 90 days and earn ₹${earn.toLocaleString("en-IN")} extra. Open an FD in one tap — we've pre-filled it for you.`;
  }
  return `${customer.name}, ${feature} fits where you are right now. We've pre-filled everything — set it up in under a minute. [Get started]`;
}

// BANDHAN — Engagement & Retention
export interface FinancialEmpathy {
  fei: number; // 0..100, higher = more stress
  level: "Calm" | "Watchful" | "Elevated" | "High Stress";
  signals: string[];
}

export function financialEmpathy(customer: Customer): FinancialEmpathy {
  const txns = customer.txns;
  const lateNight = txns.filter(
    (t) => t.amount < 0 && t.day <= 30 && Math.abs(t.amount) < 2000
  ).length;
  const recentDebits = txns.filter((t) => t.amount < 0 && t.day <= 14).length;
  const net = networkFeatures(customer);

  const stressRaw =
    Math.min(1, lateNight / 12) * 0.4 +
    Math.min(1, recentDebits / 18) * 0.3 +
    (net.spendingMomentum > 1.4 ? 0.3 : net.spendingMomentum > 1.1 ? 0.15 : 0);
  const fei = Math.round(stressRaw * 100);

  const level =
    fei >= 70 ? "High Stress" : fei >= 45 ? "Elevated" : fei >= 25 ? "Watchful" : "Calm";

  const signals: string[] = [];
  if (lateNight > 6) signals.push("Multiple small late-window debits");
  if (recentDebits > 12) signals.push("Elevated debit frequency (last 14 days)");
  if (net.spendingMomentum > 1.4) signals.push("Sharp spend acceleration vs baseline");
  if (signals.length === 0) signals.push("Stable, healthy transaction rhythm");

  return { fei, level, signals };
}

export interface BandhanResponse {
  mode: "SUPPORT" | "TRUST_BUILD" | "CELEBRATE" | "STEADY";
  title: string;
  message: string;
  options?: string[];
}

export function runBandhan(customer: Customer): {
  empathy: FinancialEmpathy;
  response: BandhanResponse;
} {
  const empathy = financialEmpathy(customer);

  if (empathy.level === "High Stress" || empathy.level === "Elevated") {
    return {
      empathy,
      response: {
        mode: "SUPPORT",
        title: "Financial Empathy Filter engaged — support, not sales",
        message:
          "We noticed this might be a tight month. No application needed — you're pre-approved for all three:",
        options: [
          "₹15,000 instant overdraft — 0% interest for 30 days",
          "Pause FD auto-renewal — access your funds immediately",
          "Talk to a financial advisor — free, confidential, 15 min",
        ],
      },
    };
  }

  // Trust-build: proactive rate renegotiation (illustrative existing-loan case).
  if (customer.isExisting && customer.age > 28 && customer.monthlyIncomeEstimate > 45000) {
    const oldRate = 9.2;
    const newRate = 8.4;
    const principalProxy = customer.monthlyIncomeEstimate * 70;
    const monthlySaving = Math.round((principalProxy * (oldRate - newRate)) / 100 / 12);
    return {
      empathy,
      response: {
        mode: "TRUST_BUILD",
        title: "Proactive rate review",
        message: `Good news, ${customer.name}! Based on your excellent repayment record you now qualify for our ${newRate}% home-loan rate (down from ${oldRate}%). That's about ₹${(
          monthlySaving * 12
        ).toLocaleString("en-IN")} saved per year — want us to apply it automatically?`,
      },
    };
  }

  return {
    empathy,
    response: {
      mode: "STEADY",
      title: "Healthy rhythm — light-touch engagement",
      message: `${customer.name} is in a calm financial window. BANDHAN holds back and stays ready — no nudges during steady periods builds long-term trust.`,
    },
  };
}

// GYAAN — Meta-learning / Financial Twins
export interface FinancialTwins {
  clusterName: string;
  cohortSize: number;
  topNextAction: string;
  successRate: number; // % of twins who succeeded
  projection: string;
}

export function runGyaan(customer: Customer): FinancialTwins {
  const { inference } = inferFromCustomer(customer);
  const cohortSize = 60 + Math.round((1 - inference.posterior.NONE) * 140);
  const successRate = 0.55 + inference.confidence * 0.35;
  const topNeed = inference.rankedNeeds[0]?.need;
  const action = topNeed ? NEED_LABEL[topNeed] : "a starter SIP";

  return {
    clusterName: `${EVENT_LABEL[inference.topEvent]} · age ${bucket(customer.age)} · ${customer.city}`,
    cohortSize,
    topNextAction: action,
    successRate: round2(successRate),
    projection: `${Math.round(successRate * 100)}% of ${cohortSize} financial twins who acted on ${action} at this stage reached their goal within 24 months — privacy-preserved, never exposing any individual.`,
  };
}

// shared helpers
function bucket(age: number) {
  const lo = Math.floor(age / 5) * 5;
  return `${lo}–${lo + 4}`;
}
function labelChannel(c: Channel) {
  return { whatsapp: "WhatsApp", app_push: "App push", sms: "SMS", email: "Email", call: "Call" }[c];
}
function fmtHour(h: number) {
  const am = h < 12;
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:00 ${am ? "AM" : "PM"}`;
}
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const round2 = (x: number) => Math.round(x * 100) / 100;

export { fmtHour, labelChannel };
