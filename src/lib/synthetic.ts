// ─────────────────────────────────────────────────────────────────────────
// ARTH.AI — Synthetic UPI customer generator
//
// Samples a latent life event per customer from EVENT_PRIORS, then emits
// realistic 180-day UPI transaction histories whose signals follow the SCM
// EMISSION matrix. Because the data is generated FROM the causal model, the
// causal-inference engine that inverts it is doing genuine inference, and the
// correlation-vs-causal accuracy gap is measurable, not asserted.
//
// Deterministic via a seeded PRNG so a given seed always reproduces the same
// customer — essential for a live demo that must never surprise you.
// ─────────────────────────────────────────────────────────────────────────

import {
  EMISSION,
  EVENT_PRIORS,
  LIFE_EVENTS,
  NEED_LEAD_DAYS,
  SIGNAL_BASE_RATE,
  SIGNAL_CATEGORY,
  SIGNAL_KEYS,
} from "./scm-knowledge";
import {
  Channel,
  Customer,
  Language,
  LifeEvent,
  MerchantCategory,
  MerchantTxn,
  SignalKey,
} from "./types";

// ── Seeded PRNG (mulberry32) ───────────────────────────────────────────────
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type RNG = () => number;
const pick = <T>(rng: RNG, arr: T[]): T => arr[Math.floor(rng() * arr.length)];
const range = (rng: RNG, lo: number, hi: number) => lo + rng() * (hi - lo);
const gauss = (rng: RNG, mean: number, sd: number) => {
  // Box-Muller
  const u = 1 - rng();
  const v = rng();
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

const FIRST_NAMES = [
  "Ravi", "Anjali", "Vikram", "Priya", "Arjun", "Meera", "Karthik", "Sneha",
  "Rahul", "Divya", "Suresh", "Pooja", "Aditya", "Kavya", "Manish", "Nisha",
];
const CITIES: { city: string; lang: Language }[] = [
  { city: "Bengaluru", lang: "Kannada" },
  { city: "Mumbai", lang: "Marathi" },
  { city: "Chennai", lang: "Tamil" },
  { city: "Hyderabad", lang: "Telugu" },
  { city: "Delhi", lang: "Hindi" },
  { city: "Kolkata", lang: "Bengali" },
  { city: "Pune", lang: "Marathi" },
];
const CHANNELS: Channel[] = ["whatsapp", "app_push", "sms"];

const MERCHANTS: Partial<Record<MerchantCategory, string[]>> = {
  groceries: ["BigBasket", "Reliance Fresh", "DMart", "Local Kirana"],
  jewelry: ["Tanishq", "Kalyan Jewellers", "Malabar Gold", "PC Jeweller"],
  apparel: ["Myntra", "FabIndia", "Manyavar", "Lifestyle"],
  venue_events: ["Royal Banquet Hall", "WedMeGood Venue", "Taj Banquets"],
  catering: ["Sacred Caterers", "Annapurna Catering", "Royal Feast"],
  salary_credit: ["INFOSYS PAYROLL", "TCS SALARY", "WIPRO PAY", "ACME CORP"],
  rent: ["NoBroker Rent", "Landlord UPI", "Nestaway"],
  baby_kids: ["FirstCry", "Mothercare", "Apollo Pharmacy Baby"],
  hospital_pharma: ["Apollo Hospital", "Manipal Clinic", "PharmEasy", "1mg"],
  education: ["Byju's Fees", "University Portal", "Aakash Institute"],
  electronics: ["Croma", "Reliance Digital", "Amazon Electronics", "Vijay Sales"],
  furniture: ["Urban Ladder", "IKEA", "Pepperfry"],
  travel: ["MakeMyTrip", "IRCTC", "Indigo", "OYO Rooms"],
  fuel: ["Indian Oil", "HP Petrol", "Shell"],
  utilities: ["BESCOM", "Airtel Postpaid", "ACT Fibernet"],
  dining: ["Swiggy", "Zomato", "Third Wave Coffee"],
  investment: ["SBI Mutual Fund", "Zerodha", "Self Transfer"],
  loan_emi: ["SBI Home Loan EMI", "Bajaj Finserv"],
  p2p_transfer: ["UPI/Friend", "UPI/Family"],
};

let txnSeq = 0;
function mkTxn(
  rng: RNG,
  day: number,
  category: MerchantCategory,
  amount: number,
  counterpartyIsSbi = false
): MerchantTxn {
  const merchants = MERCHANTS[category] ?? ["UPI Merchant"];
  return {
    id: `t${txnSeq++}`,
    day: Math.max(0, Math.round(day)),
    amount: Math.round(amount),
    category,
    merchant: pick(rng, merchants),
    counterpartyIsSbi,
  };
}

/** Sample a life event from the prior. */
export function sampleEvent(rng: RNG): LifeEvent {
  const r = rng();
  let acc = 0;
  for (const e of LIFE_EVENTS) {
    acc += EVENT_PRIORS[e];
    if (r <= acc) return e;
  }
  return "NONE";
}

/** Generate everyday "background" transactions across the window. */
function backgroundTxns(rng: RNG, income: number): MerchantTxn[] {
  const txns: MerchantTxn[] = [];
  // monthly salary credits
  for (let m = 0; m < 6; m++) {
    txns.push(mkTxn(rng, 178 - m * 30, "salary_credit", income));
  }
  // routine spend
  const routine: MerchantCategory[] = [
    "groceries", "dining", "fuel", "utilities", "p2p_transfer", "groceries", "dining",
  ];
  const n = 60 + Math.floor(rng() * 40);
  for (let i = 0; i < n; i++) {
    const cat = pick(rng, routine);
    const amt = -Math.abs(gauss(rng, cat === "utilities" ? 1200 : 450, 300));
    txns.push(mkTxn(rng, range(rng, 0, 180), cat, amt));
  }
  return txns;
}

/** Emit the transactions that a fired signal produces, clustered near the event peak. */
function emitSignalTxns(
  rng: RNG,
  signal: SignalKey,
  peakDay: number
): MerchantTxn[] {
  const cats = SIGNAL_CATEGORY[signal];
  const out: MerchantTxn[] = [];
  const burst = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < burst; i++) {
    const cat = pick(rng, cats);
    const day = clamp(gauss(rng, peakDay, 9), 0, 180);
    let amt: number;
    switch (signal) {
      case "jewelry_spike": amt = -Math.abs(gauss(rng, 65000, 25000)); break;
      case "venue_catering": amt = -Math.abs(gauss(rng, 120000, 40000)); break;
      case "salary_employer_change": amt = Math.abs(gauss(rng, 58000, 12000)); break;
      case "large_savings_inflow": amt = Math.abs(gauss(rng, 150000, 60000)); break;
      case "hospital_spend": amt = -Math.abs(gauss(rng, 35000, 20000)); break;
      case "tuition_fee": amt = -Math.abs(gauss(rng, 80000, 30000)); break;
      case "new_city_rent": amt = -Math.abs(gauss(rng, 28000, 8000)); break;
      case "electronics_spike": amt = -Math.abs(gauss(rng, 45000, 18000)); break;
      case "furniture_home": amt = -Math.abs(gauss(rng, 32000, 12000)); break;
      case "travel_booking": amt = -Math.abs(gauss(rng, 22000, 9000)); break;
      case "baby_pharma": amt = -Math.abs(gauss(rng, 6500, 3000)); break;
      case "apparel_surge": amt = -Math.abs(gauss(rng, 9000, 4000)); break;
      default: amt = -Math.abs(gauss(rng, 5000, 2000));
    }
    // salary_employer_change appears as a NEW merchant name credit
    const isSbiCounterparty = cat === "salary_credit" ? false : rng() < 0.18;
    out.push(mkTxn(rng, day, cat, amt, isSbiCounterparty));
  }
  return out;
}

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export interface GenOptions {
  forceEvent?: LifeEvent;
  forceExisting?: boolean;
}

/** Generate one fully-formed synthetic customer for a given seed. */
export function generateCustomer(seed: number, opts: GenOptions = {}): Customer {
  const rng = mulberry32(seed);
  const event = opts.forceEvent ?? sampleEvent(rng);
  const loc = pick(rng, CITIES);
  const age = Math.round(range(rng, 23, 52));
  const income = Math.round(range(rng, 28000, 95000) / 1000) * 1000;
  // The NEED crystallises in the FUTURE (eventPeakDay days from now). The
  // spending SIGNALS are LEADING INDICATORS that appear in the recent past —
  // de Caigny et al. (2020) detect life events from the run-up in transactions.
  const peakDay = clamp(NEED_LEAD_DAYS[event] + gauss(rng, 25, 10), 6, 150);
  const signalCenter = clamp(gauss(rng, 35, 16), 4, 80); // recent leading window

  let txns = backgroundTxns(rng, income);

  // Fire each signal per the SCM emission probabilities (+ base rate).
  for (const sig of SIGNAL_KEYS) {
    const p = EMISSION[event][sig] ?? SIGNAL_BASE_RATE;
    if (rng() < p) {
      txns = txns.concat(emitSignalTxns(rng, sig, signalCenter));
    } else if (rng() < SIGNAL_BASE_RATE * 0.4) {
      // rare, faint spurious firing — a single stray transaction, not a burst
      txns.push(
        mkTxn(rng, range(rng, 0, 88), SIGNAL_CATEGORY[sig][0], -Math.abs(gauss(rng, 4000, 1500)))
      );
    }
  }

  // Add a few SBI-counterparty p2p transfers (Trust Radius fuel for SPARSH).
  const trustCount = Math.floor(range(rng, 2, 11));
  for (let i = 0; i < trustCount; i++) {
    txns.push(mkTxn(rng, range(rng, 0, 180), "p2p_transfer", -Math.abs(gauss(rng, 2500, 1500)), true));
  }

  txns.sort((a, b) => a.day - b.day);

  return {
    id: `cust_${seed}`,
    name: pick(rng, FIRST_NAMES),
    age,
    city: loc.city,
    language: loc.lang,
    preferredChannel: pick(rng, CHANNELS),
    peakAttentionHour: Math.round(range(rng, 7, 22)),
    isExisting: opts.forceExisting ?? rng() < 0.6,
    monthlyIncomeEstimate: income,
    trueLifeEvent: event,
    eventPeakDay: Math.round(peakDay),
    txns,
  };
}

/** Generate a cohort — used for the live accuracy benchmark (causal vs correlational). */
export function generateCohort(n: number, baseSeed = 1000): Customer[] {
  const out: Customer[] = [];
  for (let i = 0; i < n; i++) out.push(generateCustomer(baseSeed + i * 7));
  return out;
}
