# -*- coding: utf-8 -*-
"""ARTH.AI Technical & Theory Deep-Dive PDF. ASCII-only (latin-1 safe)."""
from fpdf import FPDF

VIOLET=(124,92,255); TEAL=(20,160,140); INK=(24,28,42); GRAY=(110,120,140)
BODY=(50,55,68); LIGHTBG=(244,243,255); TEALBG=(233,249,246); CODEBG=(243,244,248)

class Doc(FPDF):
    def header(self):
        if self.page_no()==1: return
        self.set_font("Helvetica","B",9); self.set_text_color(*VIOLET); self.set_y(8)
        self.cell(0,6,"ARTH.AI  -  Technical & Theory Deep-Dive",align="L")
        self.set_text_color(*GRAY); self.cell(0,6,"SBI BI Hackathon @ GFF 2026",align="R"); self.ln(10)
    def footer(self):
        if self.page_no()==1: return
        self.set_y(-12); self.set_font("Helvetica","",8); self.set_text_color(*GRAY)
        self.cell(0,6,f"Page {self.page_no()}",align="C")
    def h1(self,text):
        self.add_page() if self.get_y()>235 else self.ln(4)
        y=self.get_y(); self.set_fill_color(*VIOLET); self.rect(self.l_margin,y+0.5,3,9,"F")
        self.set_xy(self.l_margin+6,y-1); self.set_text_color(*INK); self.set_font("Helvetica","B",15)
        self.multi_cell(0,7,text); self.ln(3)
    def h2(self,text):
        if self.get_y()>255: self.add_page()
        self.ln(1.5); self.set_text_color(*TEAL); self.set_font("Helvetica","B",12)
        self.multi_cell(0,6,text); self.ln(1)
    def body(self,text):
        self.set_text_color(*BODY); self.set_font("Helvetica","",10.5); self.multi_cell(0,5.6,text); self.ln(1.5)
    def bullet(self,text,color=VIOLET):
        if self.get_y()>262: self.add_page()
        y=self.get_y(); self.set_fill_color(*color); self.rect(self.l_margin+3,y+1.6,1.8,1.8,"F")
        self.set_xy(self.l_margin+9,y); self.set_text_color(*BODY); self.set_font("Helvetica","",10.5)
        self.multi_cell(self.epw-9,5.6,text); self.ln(0.8)
    def formula(self,text):
        if self.get_y()>255: self.add_page()
        self.ln(0.5); self.set_fill_color(*CODEBG); self.set_draw_color(*VIOLET); self.set_line_width(0.3)
        self.set_text_color(20,20,30); self.set_font("Courier","",10)
        self.multi_cell(0,5.4,text,border=1,fill=True); self.ln(2)
    def callout(self,text,teal=False):
        if self.get_y()>252: self.add_page()
        self.ln(0.5); self.set_fill_color(*(TEALBG if teal else LIGHTBG)); self.set_draw_color(*(TEAL if teal else VIOLET))
        self.set_line_width(0.4); self.set_text_color(*INK); self.set_font("Helvetica","I",10.5)
        self.multi_cell(0,5.6,text,border=1,fill=True); self.ln(2)
    def kv(self,k,v,kw=58):
        if self.get_y()>262: self.add_page()
        self.set_font("Courier","B",9.5); self.set_text_color(*INK); self.cell(kw,5.4,k)
        self.set_font("Helvetica","",10.5); self.set_text_color(*BODY); self.multi_cell(0,5.4,v); self.ln(0.4)

pdf=Doc(); pdf.set_auto_page_break(True,margin=18); pdf.set_margins(18,16,18)

# ===== COVER =====
pdf.add_page(); pdf.set_fill_color(*INK); pdf.rect(0,0,210,297,"F")
pdf.set_xy(0,62); pdf.set_text_color(*VIOLET); pdf.set_font("Helvetica","B",13); pdf.cell(0,9,"ARTH.AI",align="C")
pdf.ln(12); pdf.set_text_color(255,255,255); pdf.set_font("Helvetica","B",27)
pdf.cell(0,13,"Technical & Theory",align="C"); pdf.ln(13); pdf.cell(0,13,"Deep-Dive",align="C")
pdf.ln(20); pdf.set_text_color(180,190,210); pdf.set_font("Helvetica","",13)
pdf.cell(0,7,"Every formula, every score, every line of logic -",align="C"); pdf.ln(7)
pdf.cell(0,7,"and how each number reaches the screen.",align="C")
pdf.ln(24); pdf.set_draw_color(*VIOLET); pdf.set_line_width(0.6); pdf.line(70,pdf.get_y(),140,pdf.get_y())
pdf.ln(10); pdf.set_text_color(150,160,180); pdf.set_font("Helvetica","",11)
pdf.cell(0,6,"A complete, plain-English walkthrough of the working system",align="C"); pdf.ln(6)
pdf.cell(0,6,"behind the ARTH.AI causal-banking prototype.",align="C")
pdf.ln(16); pdf.set_text_color(120,130,150); pdf.set_font("Helvetica","",10)
pdf.cell(0,6,"Read top to bottom. No prior AI knowledge assumed.",align="C")

# ===== 0. HOW TO READ =====
pdf.add_page()
pdf.h1("0.  How To Read This Document")
pdf.body("This guide opens the bonnet of ARTH.AI completely. It is organised as a pipeline: data goes in one end, and a banking action comes out the other. We follow that exact path.")
pdf.bullet("Plain paragraphs explain the IDEA in everyday words.")
pdf.bullet("Grey boxes (Courier font) show the ACTUAL formula or rule used in the code.")
pdf.bullet("Coloured boxes highlight the key takeaway or a real worked number.")
pdf.body("Two symbols you will see in formulas:")
pdf.kv("sigmoid(x)","a squashing function = 1 / (1 + e^-x). It turns any number into a value between 0 and 1. Big input -> near 1, big negative -> near 0.")
pdf.kv("P(A | B)","'the probability of A, given that we observed B'. The bar means 'given'.")
pdf.callout("Throughout, we trace ONE real customer the system generated - 'Aditya, 36, from Delhi' - so you can see every number change as it moves through the machine.")

# ===== 1. THE BIG PICTURE =====
pdf.h1("1.  The Big Picture: The Pipeline")
pdf.body("ARTH.AI is a chain of 6 stages. Each stage takes the previous stage's output and adds intelligence:")
pdf.kv("Stage 1  DATA","Generate / read a customer's 180 days of UPI transactions (with consent).")
pdf.kv("Stage 2  SIGNALS","Turn raw transactions into 12 'signal strengths' (0 to 1) - the clues.")
pdf.kv("Stage 3  CAUSAL","From the clues, compute the probability of each life event. Pick the most likely.")
pdf.kv("Stage 4  NEEDS","From that event, rank the banking products it CAUSES (the do-operator).")
pdf.kv("Stage 5  TIMING","Compute the best day to act, using a counterfactual response curve.")
pdf.kv("Stage 6  AGENTS","Four agents turn all of the above into concrete actions and messages.")
pdf.callout("The clever part is Stage 3. Everything else feeds it or acts on it. So we spend the most time there.",teal=True)

# ===== 2. THEORY PRIMER =====
pdf.h1("2.  Theory Primer (the 4 ideas you need)")
pdf.h2("2.1  Correlation vs Causation")
pdf.body("Correlation = two things move together (jewellery buyers often take loans). Causation = one thing makes another happen. ARTH.AI is built to find causes, because acting on a mere correlation leads to wrong, mistimed offers.")
pdf.h2("2.2  The Structural Causal Model (SCM)")
pdf.body("An SCM is a simple map of 'what causes what'. Ours says: a hidden LIFE EVENT is the common cause of BOTH the spending clues AND the banking need. The clues and the need do not cause each other - they are siblings with a shared parent.")
pdf.formula("        LIFE EVENT  (hidden cause)\n          /          \\\n   spending clues     banking need\n   (jewellery...)     (loan, account...)")
pdf.h2("2.3  Bayes' Rule (reasoning backwards)")
pdf.body("We can SEE the clues but not the hidden event. Bayes' rule lets us reason backwards: from observed clues, compute how likely each hidden event is. This 'inversion' is the core calculation.")
pdf.h2("2.4  The do-operator and Counterfactuals")
pdf.body("'do(X)' means 'what if we intervene and do X?' - not just observe. We use it to ask: 'if we offer this product NOW vs in 2 weeks, which converts better?' That is a counterfactual (a what-if) and it drives timing.")

# ===== 3. DATA LAYER =====
pdf.h1("3.  Stage 1 - The Data Layer")
pdf.body("Real banks have real UPI data. For a safe, legal prototype we GENERATE realistic fake customers. Crucially, we generate them FROM the causal model, so the data genuinely contains cause-and-effect for the engine to rediscover.")
pdf.h2("3.1  What a customer looks like")
pdf.body("Each customer has: name, age, city, language, estimated income, preferred channel, peak-attention hour, and a list of transactions. Each transaction has a day (0-180, 0=today), an amount (minus=spent, plus=received), and a merchant category (groceries, jewellery, salary, rent...).")
pdf.h2("3.2  Reproducible randomness (the seed)")
pdf.body("We use a 'seeded' random generator (mulberry32). Same seed -> exactly the same customer, every time. This is vital: your live demo will NEVER surprise you, because customer #42 is always identical.")
pdf.h2("3.3  How a customer is built (step by step)")
pdf.bullet("Pick a hidden life event by rolling against base rates (priors): e.g. Wedding 9%, Job-change 14%, none 24%.")
pdf.bullet("Create everyday background transactions: 6 monthly salary credits + 60-100 routine spends (groceries, fuel, dining).")
pdf.bullet("For the chosen event, fire its signal transactions. Each signal fires with a probability from the EMISSION table. A wedding fires 'jewellery' 84% of the time, 'venue/catering' 82%, etc. Signals cluster in a recent window (~day 35) because clues are LEADING indicators.")
pdf.bullet("Add 2-11 small payments to other SBI customers (this feeds SPARSH's Trust Radius later).")
pdf.callout("Key parameters - the EMISSION table (probability a signal fires GIVEN the event):\n"
            "Wedding: jewellery 0.84, venue/catering 0.82, apparel 0.68\n"
            "New child: baby/pharma 0.88, hospital 0.62, furniture 0.30\n"
            "Job change: new-employer salary 0.88, electronics 0.40, apparel 0.35\n"
            "Relocation: new-city rent 0.86, travel 0.50, furniture 0.45\n"
            "Medical: hospital 0.92    Education: tuition 0.92, electronics 0.30\n"
            "Home purchase: large savings inflow 0.90, furniture 0.66\n"
            "Festival: apparel 0.72, electronics 0.55, jewellery 0.50, travel 0.40\n"
            "Any signal can also fire by chance at a 3% background rate (noise).")

# ===== 4. SIGNAL ENGINE =====
pdf.h1("4.  Stage 2 - The Signal Engine")
pdf.body("This converts messy transactions into 12 clean numbers between 0 and 1 (the 'signal strengths'). For each signal we look at the last 90 days only - recent behaviour matters most.")
pdf.h2("4.1  How one signal's strength is computed")
pdf.body("We count how many transactions in that signal's category appeared recently, and how big they were compared to a 'typical' amount for that signal. Then we squash it to 0-1.")
pdf.formula("avgTicket      = total recent spend / number of recent txns\n"
            "magnitudeBonus = min(1.2 , avgTicket / referenceAmount)\n"
            "strength       = sigmoid( 1.35*count + 0.9*magnitudeBonus - 1.7 )")
pdf.body("'count' (how many times it happened) is the main driver; magnitude refines it. This design means even small but repeated spends (like baby/pharma at Rs 4,000) register as strongly as one big jewellery spend - which is the correct behaviour.")
pdf.kv("referenceAmount","jewellery 50k, venue 90k, baby 4k, tuition 60k, rent 20k, hospital 25k, electronics 35k, large-savings 100k, travel 15k, furniture 25k, apparel 6k, salary 50k (Rs).")
pdf.h2("4.2  The special one: employer change")
pdf.body("A new SALARY merchant name appearing in the recent window (that was not there before) signals a job change. We return 0.9 if a new payroll source is seen, else 0.05. This catches a job change even before other clues appear.")
pdf.h2("4.3  Network features (the 'graph' view)")
pdf.body("Separately, we compute 6 features that describe the customer's transaction NETWORK and rhythm. These feed the agents (especially SPARSH and PRAGATI):")
pdf.kv("transactionVelocity","recent txn count / older txn count (are they getting more active?).")
pdf.kv("merchantDiversity","unique categories used / 18 (variety of life).")
pdf.kv("temporalDiscipline","1 - (spread of salary-credit days)/15 (do they get paid like clockwork?).")
pdf.kv("trustRadius","number of distinct SBI customers they pay (the social proof signal).")
pdf.kv("spendingMomentum","recent spend / older spend, capped at 2.5 (acceleration).")
pdf.kv("incomeStability","0.85 if 4+ salary credits seen, 0.6 if 2+, else 0.4.")
pdf.callout("Aditya's signals came out: jewellery 0.99, venue/catering 0.85, employer-change 0.90 (a chance firing). Network: diversity 0.44, discipline 1.0, trustRadius 7, momentum 2.5, incomeStability 0.85.",teal=True)

# ===== 5. CAUSAL ENGINE =====
pdf.h1("5.  Stage 3 - The Causal Inference Engine (the core)")
pdf.body("Now the magic. Given the 12 signal strengths, we compute the probability of each of the 9 possible life events, then pick the most likely. This is Bayes' rule applied to our SCM.")
pdf.h2("5.1  The formula, explained")
pdf.formula("P(event | signals)  is proportional to\n"
            "      P(event)  x  PRODUCT over signals of  L(signal_i)\n\n"
            "where, for each signal i with strength s in [0,1]:\n"
            "      L = s * P(signal_i | event) + (1-s) * (1 - P(signal_i | event))")
pdf.body("In words: start with how common the event is (the prior). Then, for every signal, multiply in how well that signal's strength matches what this event would produce. A strong jewellery signal strongly supports 'wedding' (which produces jewellery 84% of the time) and weakly supports 'medical' (which almost never does). The strength 's' acts as SOFT evidence - a half-on clue counts half.")
pdf.h2("5.2  Why we use logarithms")
pdf.body("Multiplying many small probabilities makes tiny numbers that computers handle badly. So we add their logarithms instead (adding logs = multiplying values). Then we convert back to clean percentages using the 'softmax' function, which makes all 9 probabilities add up to 100%.")
pdf.formula("logScore(event) = log P(event) + SUM log L(signal_i)\n"
            "P(event)        = softmax(logScores)   ->  all events sum to 100%")
pdf.h2("5.3  Explaining WHY (the drivers)")
pdf.body("For transparency (and for RBI's explainability rule), we record which signals pushed the winning event up the most, versus pure chance. These become the human-readable 'drivers' shown in the UI.")
pdf.formula("contribution(signal) = log L(signal | winningEvent)\n"
            "                       - log L(signal | background 3% rate)\n"
            "Keep the top 5 with positive contribution.")
pdf.h2("5.4  From event to NEEDS (the do-operator)")
pdf.body("Once we know the event, we DON'T ask 'what need correlates with jewellery'. We follow the causal arrows from the event to the needs it CAUSES, each with a weight, and rank them.")
pdf.formula("needScore = causalWeight(event -> need)  x  P(winningEvent)")
pdf.kv("Wedding needs","joint account 0.90, personal loan 0.85, gold loan 0.60, credit card 0.45.")
pdf.kv("daysToNeed","how far ahead the need crystallises: wedding 55, job-change 10, medical 3, new-child 40, home 35 days.")
pdf.callout("Aditya's result: WEDDING 79.8% (next: job-change 8.2%, none 7.2%). Drivers: jewellery (+3.05), venue (+1.44). Needs: joint account 0.72, personal loan 0.68, gold loan 0.48. Need crystallises in ~55 days.",teal=True)

# ===== 6. TIMING =====
pdf.h1("6.  Stage 5 - Counterfactual Timing")
pdf.body("Knowing WHAT they need is half the job; knowing WHEN to act is the other half. We model how the chance of conversion changes depending on the day we intervene.")
pdf.body("The idea: people convert best a little BEFORE the need fully arrives. Too early = they ignore it; too late = they already solved it elsewhere. So the response curve is a bell shape peaking just before the need.")
pdf.formula("optimalDay = round( daysToNeed * 0.7 )\n"
            "peakHeight = 0.55 + 0.4 * confidence\n"
            "response(day) = peakHeight * exp( -(day-optimalDay)^2 / (2*sigma^2) )\n"
            "   sigma is wider before the peak, narrower after (late = punished more)")
pdf.body("We then read off two points - acting today vs waiting 14 days - and report the difference as the 'timing uplift'.")
pdf.callout("Aditya (wedding 55 days out): optimal day = 39. Acting TODAY scores 0.38, waiting 14 days scores 0.62. So the engine correctly says: do NOT act today - it is too early; wait closer to day 39. This is the system showing patience, which is exactly right.")

# ===== 7. PROOF: BENCHMARK + ABLATION =====
pdf.h1("7.  Proving It Works: Benchmark, Ablation, Robustness")
pdf.body("We don't just claim accuracy - we measure it live on fresh fake cohorts. Four models are compared on 'did it recover the right banking need?':")
pdf.bullet("Causal (full engine): ~70% correct.")
pdf.bullet("Correlational (pick the single strongest signal, map it straight to a need): ~29%.")
pdf.bullet("Prior-only (no signals, just guess the most common event's need): ~13%.")
pdf.bullet("Random: ~12%.")
pdf.callout("This is an ABLATION: by stripping the engine down piece by piece, we prove each piece earns its place. The jump from 29% (patterns) to 70% (causal) is the value of causal reasoning. ~2.4x better.",teal=True)
pdf.h2("7.1  The action-threshold sweep (precision vs coverage)")
pdf.body("We only act when confidence clears a bar. Raise the bar -> fewer actions, but each is more likely right. Lower it -> more coverage, less precision. This is a tunable dial.")
pdf.formula("at threshold 0.6:  ~57% of customers acted on, ~81% of those correct\n"
            "at threshold 0.9:  ~13% acted on, ~99% correct")
pdf.h2("7.2  Robustness (graceful degradation)")
pdf.body("We deliberately hide some signals (using a fixed hash so it's repeatable) and watch accuracy fall. It declines smoothly - no sudden collapse - and stays well above random even with 60% of clues hidden. That means the system is robust to missing data.")
pdf.formula("signals hidden:   0%    15%    30%    45%    60%\nneed accuracy:  ~67%   ~59%   ~50%   ~43%   ~39%")
pdf.h2("7.3  The action threshold in production")
pdf.body("We set the bar at 0.6 confidence. Below it, agents stay silent. This is why a 'Stable' customer (no real event) is left alone about 89% of the time - the system refuses to spam on weak evidence.")

# ===== 8. AGENTS =====
pdf.h1("8.  Stage 6 - The Four Agents (every score)")
pdf.body("Each agent reads the causal result + network features and produces concrete decisions. Here is exactly how each score is built.")

pdf.h2("8.1  SPARSH - Acquisition")
pdf.body("Decides whether to pursue a prospect, and how.")
pdf.formula("lifeEventScore = round( (1 - P(none))*100*0.7 + confidence*100*0.3 )")
pdf.body("So a customer with a clear, confident life event scores high. Financial-health proxy is read from income stability + payment discipline (Good / Moderate-Good / Moderate / Low). Then the decision tree:")
pdf.formula("if trustRadius >= 5 AND lifeEventScore >= 55 -> ACTIVATE (reach out now)\n"
            "elif trustRadius >= 3 OR lifeEventScore >= 45 -> NURTURE (slow build)\n"
            "else -> HOLD (do nothing yet)")
pdf.kv("Aditya","lifeEventScore 89, health Good, trustRadius 7 -> ACTIVATE. Sends a WhatsApp account-opening offer in Hindi at 7 PM.")

pdf.h2("8.2  PRAGATI - Digital Adoption")
pdf.body("Computes a Digital Comfort Score (0-100) from 5 behavioural sub-scores, each weighted, then unlocks app features by tier.")
pdf.formula("featureConfidence = merchantDiversity * 1.2\n"
            "sessionCompletion = 0.4 + temporalDiscipline*0.5\n"
            "decisiveness      = 0.35 + incomeStability*0.5\n"
            "lowErrorRate      = 0.5 + (0.3 if velocity>1 else 0.1)\n"
            "reExploration     = merchantDiversity\n"
            "score = 100 * (0.28*fc + 0.22*sc + 0.20*dec + 0.18*ler + 0.12*reExp)")
pdf.kv("Tiers","0-30 Beginner (UPI only) | 31-60 Intermediate (FD, goals) | 61-80 Proficient (mutual funds, insurance) | 81-100 Advanced (full suite).")
pdf.body("Nudges are sent at the customer's peak-attention hour and never during a detected stress window. The message is built to fit the relevant feature (e.g. an FD nudge computes the exact interest earned).")
pdf.kv("Aditya","score 70 -> Proficient. Sub-scores 0.53/0.90/0.77/0.80/0.44.")

pdf.h2("8.3  BANDHAN - Engagement")
pdf.body("Computes a Financial Empathy Index (FEI, 0-100, higher = more stress) and responds with the right MODE.")
pdf.formula("lateNight   = count of small (<Rs2000) debits in last 30 days\n"
            "recentDebits= count of all debits in last 14 days\n"
            "FEI = 100 * ( min(1, lateNight/12)*0.4\n"
            "            + min(1, recentDebits/18)*0.3\n"
            "            + (0.3 if momentum>1.4 else 0.15 if momentum>1.1 else 0) )")
pdf.kv("Levels","70+ High Stress | 45+ Elevated | 25+ Watchful | else Calm.")
pdf.body("If stressed (Elevated/High) -> SUPPORT mode: offers help (0% overdraft, pause FD, free advisor), NOT a sales pitch. If a stable existing customer with a good profile -> TRUST_BUILD mode: proactively offers a lower loan rate (9.2% -> 8.4%). Otherwise -> STEADY (stay quiet).")
pdf.formula("monthlySaving = (income*70) * (9.2 - 8.4) / 100 / 12   [illustrative]")
pdf.kv("Aditya","FEI 78 -> High Stress -> SUPPORT. Note: his heavy WEDDING spending (momentum 2.5) reads as financial strain - so BANDHAN gently offers help. An honest, human response.")

pdf.h2("8.4  GYAAN - Meta-Learning (Financial Twins)")
pdf.body("Finds the customer's 'financial twin' cluster and gives peer-validated, privacy-preserved guidance.")
pdf.formula("cohortSize  = 60 + round( (1 - P(none)) * 140 )\n"
            "successRate = 0.55 + confidence * 0.35")
pdf.kv("Aditya","cluster ~190 people, success rate 0.83, top action: Joint Savings Account. 'People like you who acted reached their goal 83% of the time.'")

# ===== 9. UI FLOW =====
pdf.h1("9.  How The Numbers Reach The Screen")
pdf.body("All the maths above lives in plain functions (in the /src/lib folder). The website (React) calls these functions and paints the results. Here is the flow.")
pdf.h2("9.1  The data flow")
pdf.formula("user picks a customer  ->  generateCustomer(seed)\n"
            "  -> extractSignals()  -> inferLifeEvent()  -> timingCounterfactual()\n"
            "  -> runSparsh/Pragati/Bandhan/Gyaan()\n"
            "  -> React renders bars, charts, badges, messages")
pdf.body("The page uses 'useMemo': it only re-runs the maths when you change the customer, so it is instant and smooth. Nothing is pre-recorded - every bar you see was just computed live in your browser.")
pdf.h2("9.2  How a 'score bar' is drawn")
pdf.body("A score like 0.79 becomes a coloured bar. The MeterBar component takes the value, turns it into a percentage width, and animates from 0 to that width. Posterior percentages, comfort sub-scores, signal strengths - all use this same bar.")
pdf.formula("widthPercent = clamp(0..100, value/max * 100)   then animate to it")
pdf.h2("9.3  The charts")
pdf.body("The timing curve and the ablation graphs use a chart library (Recharts). We hand it the list of (day, probability) points from timingCounterfactual(), and it draws the smooth area/line. The 'optimal day' dashed line is a marker we add.")
pdf.h2("9.4  The 5-step demo and the gate")
pdf.body("The Live Demo page shows Stages 2-6 as 5 numbered steps. After Stage 3 it checks isActionable():")
pdf.formula("isActionable = (topEvent != none) AND (confidence >= 0.6)")
pdf.body("If true, it shows steps 3-5 (needs, timing, action). If false, it replaces them with a calm 'hold back - steady customer' panel. That is the spam-prevention behaviour, visible on screen.")
pdf.h2("9.5  The auto-cycling hero")
pdf.body("The home page card cycles through 4 pre-chosen customers every ~4 seconds (a timer in the component), each time re-running the real inference - so even the landing animation is genuine.")

# ===== 10. DOWHY PROOF =====
pdf.h1("10.  The Formal Proof (Python + DoWhy)")
pdf.body("To convince technical judges beyond our own engine, the /research folder uses DoWhy (Microsoft's real causal-inference library). It runs a clean experiment:")
pdf.bullet("Build data where, by construction, jewellery has ZERO direct effect on the loan need - the wedding causes both.")
pdf.bullet("Measure the naive correlation: it wrongly shows a strong +0.47 jewellery->need link.")
pdf.bullet("Apply back-door adjustment (control for the wedding): the link collapses to ~0.01 - the truth.")
pdf.bullet("Run refutation tests: a placebo treatment (effect should vanish - it does, p=0.86) and a random common cause (effect should stay - it does, p=0.92).")
pdf.callout("Conclusion: 97% of what a correlational model 'learns' here is an illusion caused by ignoring the hidden cause. ARTH.AI's approach removes that illusion. The four DoWhy steps are: Model -> Identify -> Estimate -> Refute.",teal=True)

# ===== 11. COMPLIANCE + ARCH MAP =====
pdf.h1("11.  Architecture & Compliance Mapping")
pdf.h2("11.1  Six layers <-> the code")
pdf.kv("L0 Data","synthetic.ts (consented data simulation).")
pdf.kv("L1 Signals","signals.ts (extractSignals, networkFeatures).")
pdf.kv("L2 Causal","causal.ts + scm-knowledge.ts (the SCM brain).")
pdf.kv("L3 Agents","agents.ts (SPARSH/PRAGATI/BANDHAN/GYAAN).")
pdf.kv("L4 Action","the messages each agent emits; UI delivery.")
pdf.kv("L5 Learning","federated-learning blueprint (production roadmap).")
pdf.h2("11.2  Compliance is built into the logic")
pdf.bullet("Explainability (RBI FREE-AI): the 'drivers' list (5.3) gives a plain reason for every decision.")
pdf.bullet("Fairness: decisions follow the causal event, not proxies for caste/religion/gender, structurally avoiding bias.")
pdf.bullet("Human-in-the-loop: credit actions are framed as recommendations needing approval.")
pdf.bullet("Privacy (DPDP): per-signal consent; federated learning keeps raw data on-device.")

# ===== 12. END TO END EXAMPLE =====
pdf.h1("12.  Full Worked Example: 'Aditya'")
pdf.body("Putting it all together, here is every number for one real generated customer, end to end:")
pdf.kv("1. Customer","Aditya, 36, Delhi, Hindi, income Rs 85,000, 90 transactions, existing customer, peak hour 7 PM.")
pdf.kv("2. Signals","jewellery 0.99, venue/catering 0.85, employer-change 0.90 (a chance firing).")
pdf.kv("3. Causal","WEDDING 79.8% (job-change 8.2%, none 7.2%, festival 4.1%). Drivers: jewellery +3.05, venue +1.44.")
pdf.kv("4. Needs","joint account 0.72, personal loan 0.68, gold loan 0.48, credit card 0.36. Need in ~55 days.")
pdf.kv("5. Timing","optimal day 39; act-now 0.38 vs wait-14 0.62 -> be patient, act near day 39.")
pdf.kv("6a SPARSH","score 89, health Good, trust 7 -> ACTIVATE (WhatsApp, Hindi, 7 PM).")
pdf.kv("6b PRAGATI","comfort 70 -> Proficient; mutual funds & insurance unlocked.")
pdf.kv("6c BANDHAN","FEI 78 -> High Stress (wedding spend looks like strain) -> SUPPORT, offers help.")
pdf.kv("6d GYAAN","~190 twins, 83% success, suggests Joint Savings Account.")
pdf.callout("Notice the system is not naive: a spurious salary signal fired, yet WEDDING still won; and timing told us to WAIT rather than pounce. That nuance is what separates causal reasoning from pattern-matching.",teal=True)

# ===== 13. STACK + LIMITS =====
pdf.h1("13.  Tech Stack, File Map & Honest Limits")
pdf.h2("13.1  Files (where each thing lives)")
pdf.kv("src/lib/types.ts","all data shapes.")
pdf.kv("scm-knowledge.ts","priors, emission table, needs, timing - the SCM parameters.")
pdf.kv("synthetic.ts","customer & transaction generator.")
pdf.kv("signals.ts","signal strengths + network features.")
pdf.kv("causal.ts","inference, do-operator, timing, benchmark, ablations, gating.")
pdf.kv("agents.ts","the four agents.")
pdf.kv("src/app/*","the website pages; src/components/* the UI pieces.")
pdf.kv("research/*","the Python DoWhy proof.")
pdf.h2("13.2  Tech")
pdf.body("Website: Next.js 14 + TypeScript + Tailwind + Framer Motion + Recharts. Engine: pure TypeScript, runs in the browser (no server, no delay). Proof: Python + DoWhy + EconML. Production blueprint adds LangGraph, PyTorch Geometric (GNN), Neo4j, FastAPI, Flower (federated learning).")
pdf.h2("13.3  Honest limitations")
pdf.bullet("All numbers are from synthetic data where we know the truth; real-world accuracy will be lower and must be A/B validated on consented data.")
pdf.bullet("The browser engine is a faithful but lightweight SCM; production uses DoWhy/EconML and a real graph neural network.")
pdf.bullet("Account Aggregator data needs explicit consent and cannot be pulled for non-customers; SPARSH uses only consented or opt-in signals.")
pdf.bullet("Some features (voice, live WhatsApp/DigiLocker, federated training) are blueprint, presented honestly as roadmap.")
pdf.ln(3)
pdf.set_font("Helvetica","B",12); pdf.set_text_color(*VIOLET)
pdf.multi_cell(0,7,"That is the entire machine - from a raw transaction to a timed, explainable, compliant banking action.")

pdf.output("ARTH_AI_Technical_DeepDive.pdf")
print("OK pages:", pdf.page_no())
