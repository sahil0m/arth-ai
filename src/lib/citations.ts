// ─────────────────────────────────────────────────────────────────────────
// ARTH.AI — Research citations registry
// Every quantitative claim in the product traces to one of these sources.
// Per the project directive: no invented numbers. Where we show our own
// figures (the in-app benchmark), they are labelled as a reproducible
// controlled simulation, distinct from cited real-world results.
// ─────────────────────────────────────────────────────────────────────────

export interface Citation {
  id: string;
  authors: string;
  title: string;
  venue: string;
  year: string;
  url: string;
  takeaway: string; // what we use it to justify
}

export const CITATIONS: Citation[] = [
  {
    id: "decaigny2020",
    authors: "De Caigny, A., Coussement, K., De Bock, K. W.",
    title: "Leveraging fine-grained transaction data for customer life event predictions",
    venue: "Decision Support Systems, vol. 130",
    year: "2020",
    url: "https://doi.org/10.1016/j.dss.2019.113232",
    takeaway:
      "Demonstrates life events (moving, birth of a child, new/ended relationship) are predictable from ~60M debit transactions of 132K customers, and builds a pseudo-social network from transaction counterparties — empirical basis for ARTH.AI's life-event signals and SPARSH Trust Radius.",
  },
  {
    id: "uplift-survey",
    authors: "Devriendt, F., Moldovan, D., Verbeke, W.",
    title:
      "A Literature Survey and Experimental Evaluation of the State-of-the-Art in Uplift Modeling",
    venue: "Big Data, 5(1)",
    year: "2018",
    url: "https://doi.org/10.1089/big.2018.0014",
    takeaway:
      "Establishes uplift (causal/incremental) modeling: target the customers whose behaviour an intervention actually changes, not those with high propensity. ARTH.AI's causal layer is an uplift-first decision policy.",
  },
  {
    id: "dowhy",
    authors: "Sharma, A., Kiciman, E.",
    title: "DoWhy: An End-to-End Library for Causal Inference",
    venue: "arXiv:2011.04216 (Microsoft Research)",
    year: "2020",
    url: "https://arxiv.org/abs/2011.04216",
    takeaway:
      "The causal-inference library ARTH.AI's /research module uses to validate the structural causal model: model → identify → estimate → refute.",
  },
  {
    id: "rbi-freeai",
    authors: "Reserve Bank of India (FREE-AI Committee)",
    title:
      "Framework for Responsible and Ethical Enablement of Artificial Intelligence (FREE-AI)",
    venue: "RBI Committee Report — 7 Sutras, 6 Pillars, 26 recommendations",
    year: "2025",
    url: "https://rbidocs.rbi.org.in/rdocs/PublicationReport/Pdfs/FREEAIR130820250A24FF2D4578453F824C72ED9F5D5851.PDF",
    takeaway:
      "India's AI-in-finance framework (released 13 Aug 2025). ARTH.AI is designed against its 7 Sutras — Trust, People First, Innovation, Fairness, Accountability, Explainability, Resilience — incl. human override and AI-use disclosure.",
  },
  {
    id: "dpdp",
    authors: "Government of India (MeitY)",
    title: "Digital Personal Data Protection Act, 2023 & DPDP Rules, 2025",
    venue: "Act No. 22 of 2023; Rules notified 13 Nov 2025",
    year: "2023/2025",
    url: "https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf",
    takeaway:
      "Consent must be free, specific, informed, unconditional and unambiguous, with withdrawal as easy as granting. ARTH.AI's consent ledger and per-signal opt-in implement this directly.",
  },
  {
    id: "aa-framework",
    authors: "Reserve Bank of India / Sahamati",
    title: "Account Aggregator framework (consent-based financial data sharing)",
    venue: "RBI NBFC-AA Master Direction; Sahamati ecosystem",
    year: "2021–",
    url: "https://sahamati.org.in/",
    takeaway:
      "The consent-artefact rails ARTH.AI uses to ingest financial data only with explicit, revocable, purpose-bound customer consent.",
  },
  {
    id: "onboarding-dropoff",
    authors: "Industry analysis (Innovatrics TrustReport; Celusion)",
    title: "Digital bank onboarding abandonment",
    venue: "~60–63% of applicants abandon complex digital onboarding",
    year: "2024–2026",
    url: "https://innovatrics.com/trustreport/63-of-customers-abandon-digital-bank-onboarding-is-biometrics-the-solution/",
    takeaway:
      "Quantifies the acquisition-funnel leak ARTH.AI's SPARSH agent (zero-friction, sub-5-minute video-KYC onboarding) targets.",
  },
  {
    id: "sbi-vkyc",
    authors: "State Bank of India",
    title: "Video-KYC / paperless onboarding outcomes",
    venue: "SBI Integrated Annual Report 2024–25 (>98% transactions digital)",
    year: "2025",
    url: "https://sbi.bank.in/corporate/SBIAR2425/chairmans-message.html",
    takeaway:
      "SBI's own paperless video-KYC cut acquisition cost ~38% vs branch; >98% of SBI transactions are digital — the deployment surface ARTH.AI plugs into.",
  },
];

export const cite = (id: string): Citation =>
  CITATIONS.find((c) => c.id === id) ?? CITATIONS[0];
