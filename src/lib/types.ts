// ARTH.AI — Core domain types
// Shared across the synthetic data generator, signal engine, causal SCM,
// and the 4 autonomous agents.

/** The latent life events that causally drive both spending signals AND banking needs. */
export type LifeEvent =
  | "WEDDING"
  | "JOB_CHANGE"
  | "NEW_CHILD"
  | "RELOCATION"
  | "MEDICAL"
  | "EDUCATION"
  | "HOME_PURCHASE"
  | "FESTIVAL"
  | "NONE";

/** Observable behavioural / transactional signals (the *effects* of a life event). */
export type SignalKey =
  | "jewelry_spike"
  | "venue_catering"
  | "apparel_surge"
  | "salary_employer_change"
  | "baby_pharma"
  | "new_city_rent"
  | "hospital_spend"
  | "tuition_fee"
  | "electronics_spike"
  | "large_savings_inflow"
  | "travel_booking"
  | "furniture_home";

/** Banking products a need maps to. */
export type BankingNeed =
  | "joint_account"
  | "personal_loan"
  | "gold_loan"
  | "salary_account"
  | "credit_card"
  | "sip_mutual_fund"
  | "recurring_deposit"
  | "child_insurance"
  | "home_loan"
  | "overdraft"
  | "health_insurance"
  | "education_loan"
  | "consumer_durable_loan"
  | "fixed_deposit";

export type Channel = "whatsapp" | "app_push" | "sms" | "email" | "call";
export type Language =
  | "Hindi"
  | "English"
  | "Kannada"
  | "Tamil"
  | "Telugu"
  | "Marathi"
  | "Bengali";

export interface MerchantTxn {
  id: string;
  day: number; // days ago (0 = today, higher = older), over a 180-day window
  amount: number; // INR, negative = debit, positive = credit
  category: MerchantCategory;
  merchant: string;
  counterpartyIsSbi?: boolean; // for Trust Radius (SPARSH)
}

export type MerchantCategory =
  | "groceries"
  | "jewelry"
  | "apparel"
  | "venue_events"
  | "catering"
  | "salary_credit"
  | "rent"
  | "baby_kids"
  | "hospital_pharma"
  | "education"
  | "electronics"
  | "furniture"
  | "travel"
  | "fuel"
  | "utilities"
  | "dining"
  | "investment"
  | "loan_emi"
  | "p2p_transfer";

export interface Customer {
  id: string;
  name: string;
  age: number;
  city: string;
  language: Language;
  preferredChannel: Channel;
  peakAttentionHour: number; // 0-23, when they engage most
  isExisting: boolean; // existing SBI customer vs prospect (SPARSH)
  monthlyIncomeEstimate: number;
  /** GROUND TRUTH — the life event we synthesised. Used only to score the model. */
  trueLifeEvent: LifeEvent;
  /** Day index (0-180) at which the life event "peaks" / crystallises into a need. */
  eventPeakDay: number;
  txns: MerchantTxn[];
}

/** Output of the signal engine: graded evidence per signal. */
export type SignalVector = Record<SignalKey, number>; // 0..1 strength

/** Posterior over life events from the causal inference engine. */
export interface CausalInference {
  posterior: Record<LifeEvent, number>; // normalised
  topEvent: LifeEvent;
  confidence: number; // = posterior[topEvent]
  // The needs caused by the inferred event, ranked by causal relevance.
  rankedNeeds: { need: BankingNeed; score: number }[];
  // Days until the need crystallises (for timing).
  daysToNeed: number;
  // Evidence that drove the inference (for explainability).
  drivers: { signal: SignalKey; contribution: number }[];
}

/** Counterfactual timing analysis: do(act now) vs do(wait). */
export interface TimingCounterfactual {
  optimalDay: number; // best day to intervene
  curve: { day: number; conversionProb: number }[];
  actNowProb: number;
  waitTwoWeeksProb: number;
  upliftFromTiming: number; // actNow - waitTwoWeeks
}
