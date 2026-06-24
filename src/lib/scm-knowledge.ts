// Structural causal model knowledge base.
//
// The causal graph: a latent life event is the common cause of BOTH the
// spending signals (jewelry, venue, apparel...) AND the banking need (joint
// account, loan, SIP...). The signals and the need are not cause-and-effect of
// each other - they are confounded by the life event. So instead of reading
// "jewelry -> loan", we read "wedding -> {jewelry, loan}" and time the
// intervention to the event, not the symptom.
//
// Parameters below are interpretable priors. The /research folder reproduces
// the same structure with DoWhy on a sampled dataset.

import {
  BankingNeed,
  LifeEvent,
  MerchantCategory,
  SignalKey,
} from "./types";

export const LIFE_EVENTS: LifeEvent[] = [
  "WEDDING",
  "JOB_CHANGE",
  "NEW_CHILD",
  "RELOCATION",
  "MEDICAL",
  "EDUCATION",
  "HOME_PURCHASE",
  "FESTIVAL",
  "NONE",
];

export const SIGNAL_KEYS: SignalKey[] = [
  "jewelry_spike",
  "venue_catering",
  "apparel_surge",
  "salary_employer_change",
  "baby_pharma",
  "new_city_rent",
  "hospital_spend",
  "tuition_fee",
  "electronics_spike",
  "large_savings_inflow",
  "travel_booking",
  "furniture_home",
];

/** Prior P(LifeEvent) — base rates in a 6-month window for an active customer. */
export const EVENT_PRIORS: Record<LifeEvent, number> = {
  WEDDING: 0.09,
  JOB_CHANGE: 0.14,
  NEW_CHILD: 0.08,
  RELOCATION: 0.1,
  MEDICAL: 0.11,
  EDUCATION: 0.09,
  HOME_PURCHASE: 0.07,
  FESTIVAL: 0.13,
  NONE: 0.24,
};

/**
 * EMISSION MATRIX — P(signal = present | life event).
 * This is the causal mechanism: how each latent event expresses itself in
 * observable UPI/transaction behaviour. Rows that don't list a signal use BASE_RATE.
 */
export const SIGNAL_BASE_RATE = 0.03; // background prob a signal fires with no event

export const EMISSION: Record<LifeEvent, Partial<Record<SignalKey, number>>> = {
  WEDDING: {
    jewelry_spike: 0.84,
    venue_catering: 0.82, // venue+catering is near-unique to weddings
    apparel_surge: 0.68,
  },
  JOB_CHANGE: {
    salary_employer_change: 0.88,
    apparel_surge: 0.35,
    electronics_spike: 0.4,
    new_city_rent: 0.3,
  },
  NEW_CHILD: {
    baby_pharma: 0.88,
    hospital_spend: 0.62,
    furniture_home: 0.3,
  },
  RELOCATION: {
    new_city_rent: 0.86, // the distinctive marker of relocation
    travel_booking: 0.5,
    furniture_home: 0.45,
  },
  MEDICAL: {
    hospital_spend: 0.92,
  },
  EDUCATION: {
    tuition_fee: 0.92, // near-unique marker
    electronics_spike: 0.3, // laptop
  },
  HOME_PURCHASE: {
    large_savings_inflow: 0.9, // down-payment accumulation — its signature
    furniture_home: 0.66,
    electronics_spike: 0.4,
  },
  FESTIVAL: {
    apparel_surge: 0.72,
    jewelry_spike: 0.5,
    electronics_spike: 0.55,
    travel_booking: 0.4,
  },
  NONE: {}, // everything at base rate
};

/**
 * NEED MATRIX — the banking needs each life event CAUSES, with causal weight.
 * (event -> need) is the edge ARTH.AI acts on. Weights rank the product offers.
 */
export const EVENT_NEEDS: Record<LifeEvent, { need: BankingNeed; weight: number }[]> = {
  WEDDING: [
    { need: "joint_account", weight: 0.9 },
    { need: "personal_loan", weight: 0.85 },
    { need: "gold_loan", weight: 0.6 },
    { need: "credit_card", weight: 0.45 },
  ],
  JOB_CHANGE: [
    { need: "salary_account", weight: 0.92 },
    { need: "credit_card", weight: 0.6 },
    { need: "sip_mutual_fund", weight: 0.55 },
  ],
  NEW_CHILD: [
    { need: "recurring_deposit", weight: 0.8 },
    { need: "child_insurance", weight: 0.78 },
    { need: "health_insurance", weight: 0.6 },
  ],
  RELOCATION: [
    { need: "home_loan", weight: 0.7 },
    { need: "personal_loan", weight: 0.55 },
    { need: "credit_card", weight: 0.5 },
  ],
  MEDICAL: [
    { need: "overdraft", weight: 0.82 },
    { need: "health_insurance", weight: 0.75 },
    { need: "personal_loan", weight: 0.55 },
  ],
  EDUCATION: [
    { need: "education_loan", weight: 0.9 },
    { need: "fixed_deposit", weight: 0.4 },
  ],
  HOME_PURCHASE: [
    { need: "home_loan", weight: 0.95 },
    { need: "health_insurance", weight: 0.4 },
    { need: "credit_card", weight: 0.4 },
  ],
  FESTIVAL: [
    { need: "consumer_durable_loan", weight: 0.78 },
    { need: "credit_card", weight: 0.7 },
    { need: "gold_loan", weight: 0.45 },
  ],
  NONE: [
    { need: "sip_mutual_fund", weight: 0.35 },
    { need: "fixed_deposit", weight: 0.3 },
  ],
};

/**
 * TIMING WINDOWS — how many days from "now" until the need crystallises,
 * relative to the detected event-onset. Drives the counterfactual timing engine.
 */
export const NEED_LEAD_DAYS: Record<LifeEvent, number> = {
  WEDDING: 55,
  JOB_CHANGE: 10,
  NEW_CHILD: 40,
  RELOCATION: 15,
  MEDICAL: 3,
  EDUCATION: 25,
  HOME_PURCHASE: 35,
  FESTIVAL: 12,
  NONE: 30,
};

/** Human-readable labels. */
export const EVENT_LABEL: Record<LifeEvent, string> = {
  WEDDING: "Wedding approaching",
  JOB_CHANGE: "Job / income change",
  NEW_CHILD: "New child in family",
  RELOCATION: "Relocation to new city",
  MEDICAL: "Medical / health event",
  EDUCATION: "Education enrolment",
  HOME_PURCHASE: "Home purchase",
  FESTIVAL: "Festival / big purchase season",
  NONE: "No major life event",
};

export const SIGNAL_LABEL: Record<SignalKey, string> = {
  jewelry_spike: "Jewelry purchase spike",
  venue_catering: "Venue & catering payments",
  apparel_surge: "Apparel / clothing surge",
  salary_employer_change: "New employer salary credit",
  baby_pharma: "Baby & pediatric spend",
  new_city_rent: "Rent / deposit in new city",
  hospital_spend: "Hospital & pharmacy spend",
  tuition_fee: "Tuition / institute fee",
  electronics_spike: "Electronics & appliances",
  large_savings_inflow: "Large savings inflow",
  travel_booking: "Travel & hotel bookings",
  furniture_home: "Furniture & home setup",
};

export const NEED_LABEL: Record<BankingNeed, string> = {
  joint_account: "Joint Savings Account",
  personal_loan: "Personal Loan",
  gold_loan: "Gold Loan",
  salary_account: "Salary Account",
  credit_card: "Credit Card",
  sip_mutual_fund: "SIP / Mutual Fund",
  recurring_deposit: "Recurring Deposit",
  child_insurance: "Child Education Plan",
  home_loan: "Home Loan",
  overdraft: "Instant Overdraft",
  health_insurance: "Health Insurance",
  education_loan: "Education Loan",
  consumer_durable_loan: "Consumer Durable Loan",
  fixed_deposit: "Fixed Deposit",
};

/** Which merchant categories evidence each signal (used by the signal engine). */
export const SIGNAL_CATEGORY: Record<SignalKey, MerchantCategory[]> = {
  jewelry_spike: ["jewelry"],
  venue_catering: ["venue_events", "catering"],
  apparel_surge: ["apparel"],
  salary_employer_change: ["salary_credit"],
  baby_pharma: ["baby_kids"],
  new_city_rent: ["rent"],
  hospital_spend: ["hospital_pharma"],
  tuition_fee: ["education"],
  electronics_spike: ["electronics"],
  large_savings_inflow: ["investment"],
  travel_booking: ["travel"],
  furniture_home: ["furniture"],
};
