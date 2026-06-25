# -*- coding: utf-8 -*-
"""ARTH.AI pitch deck (landscape slides). ASCII-only, brand dark theme."""
from fpdf import FPDF

INK=(9,13,24); PANEL=(20,28,46); PANEL2=(26,34,54)
VIOLET=(124,92,255); INDIGO=(110,120,255); TEAL=(45,212,191)
AMBER=(251,191,36); ROSE=(251,113,133)
WHITE=(255,255,255); LIGHT=(206,213,228); GRAY=(140,151,173); DIM=(96,106,128)

W,H = 297,210
MX = 22

class Deck(FPDF):
    def slide(self, eyebrow=None, n=None):
        self.add_page()
        self.set_fill_color(*INK); self.rect(0,0,W,H,"F")
        # corner accents
        self.set_fill_color(*VIOLET); self.rect(0,0,W,2.2,"F")
        if eyebrow:
            self.set_xy(MX,14); self.set_font("Helvetica","B",9); self.set_text_color(*VIOLET)
            self.cell(0,5,eyebrow.upper())
        if n:
            self.set_xy(W-40,14); self.set_font("Helvetica","",9); self.set_text_color(*DIM)
            self.cell(18,5,f"{n} / 13",align="R")
    def heading(self,text,y=30,size=30,color=WHITE):
        self.set_xy(MX,y); self.set_font("Helvetica","B",size); self.set_text_color(*color)
        self.multi_cell(W-2*MX,size*0.42,text)
    def text(self,x,y,w,s,size=12,color=LIGHT,style="",h=None):
        self.set_xy(x,y); self.set_font("Helvetica",style,size); self.set_text_color(*color)
        self.multi_cell(w,h or size*0.52,s)
    def panel(self,x,y,w,h,fill=PANEL,accent=None):
        self.set_fill_color(*fill); self.rect(x,y,w,h,"F")
        if accent:
            self.set_fill_color(*accent); self.rect(x,y,2.4,h,"F")
    def dot(self,x,y,color=VIOLET,r=1.6):
        self.set_fill_color(*color); self.ellipse(x-r,y-r,2*r,2*r,"F")

d=Deck(orientation="L",format="A4"); d.set_auto_page_break(False); d.set_margins(MX,14,MX)

# ---------- 1 TITLE ----------
d.slide()
d.set_fill_color(*VIOLET); d.rect(MX,70,46,3.4,"F")
d.set_xy(MX,84); d.set_font("Helvetica","B",62); d.set_text_color(*WHITE); d.cell(0,24,"ARTH.AI")
d.text(MX,118,W,"The bank that understands why.",size=24,color=VIOLET,style="B")
d.text(MX,134,200,"Causal, agentic AI for customer acquisition, digital adoption and engagement.",size=13,color=GRAY)
d.set_draw_color(*PANEL2); d.set_line_width(0.4); d.line(MX,168,W-MX,168)
d.text(MX,172,200,"SBI BI Hackathon @ GFF 2026   |   Theme: Agentic AI & Emerging Tech",size=10,color=DIM)
d.text(MX,180,200,"Live prototype: arth-ai-one.vercel.app    |    Code: github.com/sahil0m/arth-ai",size=10,color=DIM)

# ---------- 2 PROBLEM ----------
d.slide("The problem",2)
d.heading("Right product. Wrong moment.",y=34,size=30)
rows=[("~60%","of people abandon a complex digital sign-up before they ever activate."),
      ("Too late","loan and product offers often arrive weeks after the need has passed."),
      ("Fixed calendar","banks engage on schedules, not when life actually creates a need.")]
y=70
for big,desc in rows:
    d.panel(MX,y,W-2*MX,26,accent=VIOLET)
    d.text(MX+10,y+5,40,big,size=18,color=WHITE,style="B")
    d.text(MX+62,y+5,W-2*MX-72,desc,size=12.5,color=LIGHT)
    y+=32
d.text(MX,y+2,W-2*MX,"The deeper issue: most banking AI predicts what a customer might do. It never understands why.",size=13,color=TEAL,style="I")

# ---------- 3 INSIGHT ----------
d.slide("The insight",3)
d.heading("Predictive AI guesses. Causal AI understands.",y=34,size=27)
cw=(W-2*MX-12)/2
d.panel(MX,68,cw,78,accent=ROSE)
d.text(MX+10,76,cw-20,"CORRELATIONAL  (what most banks do)",size=10,color=ROSE,style="B")
d.text(MX+10,90,cw-20,'"Customers who buy jewellery often take loans."',size=14,color=WHITE,style="B")
d.text(MX+10,112,cw-20,"Acts on the symptom. Fires for festival shoppers and the wealthy alike, and mistimes the offer.",size=11.5,color=GRAY)
x2=MX+cw+12
d.panel(x2,68,cw,78,accent=VIOLET)
d.text(x2+10,76,cw-20,"CAUSAL  (what ARTH.AI does)",size=10,color=VIOLET,style="B")
d.text(x2+10,90,cw-20,'"A wedding causes both the jewellery and the loan need."',size=14,color=WHITE,style="B")
d.text(x2+10,116,cw-20,"Acts on the real cause and gets the timing right, with a plain reason for every decision.",size=11.5,color=LIGHT)
d.text(MX,156,W-2*MX,"This is the academic difference between prediction and causal / uplift modelling, applied to banking.",size=12,color=TEAL,style="I")

# ---------- 4 SOLUTION ----------
d.slide("The solution",4)
d.heading("ARTH.AI",y=32,size=30)
d.text(MX,52,W-2*MX,"An agentic AI layer that reads a customer's transaction signals, works out the life event behind them, and acts at the right moment, in the right language, on the right channel.",size=14,color=LIGHT)
pills=[("Acquisition","Find and onboard the right customers"),
       ("Digital adoption","Surface the right feature at the right time"),
       ("Engagement","Act around real life events, not campaigns")]
cw=(W-2*MX-24)/3; x=MX
for t,s in pills:
    d.panel(x,96,cw,56,fill=PANEL2,accent=TEAL)
    d.text(x+9,106,cw-18,t,size=15,color=WHITE,style="B")
    d.text(x+9,122,cw-18,s,size=11.5,color=GRAY)
    x+=cw+12
d.text(MX,162,W-2*MX,"One causal engine. All three pillars of the SBI mandate.",size=13,color=VIOLET,style="B")

# ---------- 5 HOW IT WORKS ----------
d.slide("How it works",5)
d.heading("From a UPI transaction to a timed, explained action.",y=34,size=24)
steps=[("1","Data","consent-based UPI history"),
       ("2","Signals","12 interpretable clues, scored 0-1"),
       ("3","Causal engine","infer the hidden life event"),
       ("4","Needs","rank the products it causes"),
       ("5","Timing","the best day to reach out"),
       ("6","Agents","take the action")]
cw=(W-2*MX-5*6)/6; x=MX; y=74
for num,t,s in steps:
    acc = VIOLET if num=="3" else TEAL
    d.panel(x,y,cw,64,fill=PANEL2,accent=acc)
    d.text(x+5,y+6,cw-8,num,size=15,color=acc,style="B")
    d.text(x+5,y+18,cw-8,t,size=11.5,color=WHITE,style="B")
    d.text(x+5,y+34,cw-8,s,size=9,color=GRAY)
    x+=cw+6
d.text(MX,150,W-2*MX,"Stage 3 is the core: a structural causal model inverted with Bayesian reasoning. Everything else feeds it or acts on it.",size=12,color=LIGHT,style="I")

# ---------- 6 AGENTS ----------
d.slide("The four agents",6)
d.heading("Four agents, one causal brain.",y=34,size=27)
agents=[("SPARSH","Acquisition","Finds and onboards new customers with a quick, consent-based video-KYC flow.",VIOLET),
        ("PRAGATI","Digital adoption","Unlocks features at a pace that matches each customer's comfort, nudging only at good moments.",TEAL),
        ("BANDHAN","Engagement","Answers financial stress with support, not sales, and offers loyal customers better rates first.",AMBER),
        ("GYAAN","Meta-learning","Learns across customers to give privacy-safe, peer-validated guidance.",ROSE)]
cw=(W-2*MX-12)/2; ch=44; y0=66
for i,(name,tag,desc,acc) in enumerate(agents):
    x=MX+(i%2)*(cw+12); y=y0+(i//2)*(ch+10)
    d.panel(x,y,cw,ch,fill=PANEL2,accent=acc)
    d.text(x+9,y+6,cw-18,name,size=15,color=WHITE,style="B")
    d.text(x+9+38,y+7.5,cw-60,tag,size=10,color=acc,style="B")
    d.text(x+9,y+20,cw-18,desc,size=10.5,color=GRAY)

# ---------- 7 PROOF ----------
d.slide("The proof",7)
d.heading("It works, and we measured it.",y=34,size=27)
stats=[("~70%","causal need accuracy",TEAL),("~29%","pattern-based accuracy",AMBER),
       ("+138%","relative uplift",VIOLET),("65-87%","real life-event recall",TEAL)]
cw=(W-2*MX-3*10)/4; x=MX
for big,lab,acc in stats:
    d.panel(x,68,cw,46,fill=PANEL2)
    d.text(x,78,cw,big,size=26,color=acc,style="B")
    d.text(x+2,100,cw-4,lab,size=9.5,color=GRAY)
    x+=cw+10
d.text(MX,126,W-2*MX,"All reproducible live in the browser. The causal model nearly triples the accuracy of the pattern-based approach.",size=12.5,color=LIGHT)
d.panel(MX,142,W-2*MX,30,accent=VIOLET)
d.text(MX+10,148,W-2*MX-20,"Validated formally in Python with DoWhy (Microsoft Research): in a controlled test, 97% of a naive correlation was confounding. Placebo and random-common-cause refutation tests both passed.",size=11,color=LIGHT)

# ---------- 8 DEMO ----------
d.slide("Live demo",8)
d.heading("It reads a customer in 45 seconds.",y=34,size=27)
d.text(MX,52,W-2*MX,"Example: Aditya, 36, Delhi. Six months of UPI data goes in.",size=12.5,color=GRAY)
flow=["Signals: jewellery, venue, salary change","Causal read: WEDDING, 80% confidence",
      "Needs: joint account, personal loan","Timing: act near day 39, not today",
      "Action: WhatsApp in Hindi, at 7 PM"]
y=70
for i,s in enumerate(flow):
    d.dot(MX+3,y+3,color=TEAL); d.text(MX+10,y,W-2*MX-10,s,size=13,color=WHITE if i==1 else LIGHT,style="B" if i==1 else "")
    y+=16
d.text(MX,y+4,W-2*MX,"Notice the restraint: a spurious signal fired, yet the wedding still won, and the system chose to wait for the right day rather than pounce.",size=11.5,color=VIOLET,style="I")

# ---------- 9 COMPLIANCE ----------
d.slide("Regulatory readiness",9)
d.heading("Compliant by design, not by patch.",y=34,size=27)
items=[("RBI FREE-AI","Built to all 7 sutras: trust, fairness, accountability, explainability and more."),
       ("DPDP Act 2023","Per-signal, revocable consent. Raw data never leaves the device."),
       ("Human in the loop","Every credit decision is approved by a person."),
       ("Explainable & fair","A plain reason for every action; causal logic avoids proxy bias.")]
cw=(W-2*MX-12)/2; ch=38; y0=66
for i,(t,s) in enumerate(items):
    x=MX+(i%2)*(cw+12); y=y0+(i//2)*(ch+10)
    d.panel(x,y,cw,ch,fill=PANEL2,accent=TEAL)
    d.text(x+9,y+6,cw-18,t,size=13,color=WHITE,style="B")
    d.text(x+9,y+18,cw-18,s,size=10.5,color=GRAY)
d.text(MX,162,W-2*MX,"This prototype uses only synthetic, consent-simulated data. No real customer data is involved.",size=11,color=DIM,style="I")

# ---------- 10 BUSINESS ----------
d.slide("Business model",10)
d.heading("A B2B platform that pays for itself.",y=34,size=26)
cols=[("How we earn","Annual platform licence or subscription.\n\nA success-based share of the incremental products and loans it drives.\n\nPaid integration, deployment and support."),
      ("Why it scales","One engine lifts acquisition, adoption and retention at once.\n\nFor a bank of SBI's scale, a small percentage gain is significant value.\n\nCloud-native, so it scales at low marginal cost, then extends to other banks and NBFCs.")]
cw=(W-2*MX-12)/2; x=MX
for t,s in cols:
    d.panel(x,64,cw,98,fill=PANEL2,accent=VIOLET)
    d.text(x+10,72,cw-20,t,size=14,color=VIOLET,style="B")
    d.text(x+10,88,cw-20,s,size=11,color=LIGHT,h=5.4)
    x+=cw+12

# ---------- 11 WHY WIN ----------
d.slide("Why ARTH.AI",11)
d.heading("Why this wins.",y=36,size=30)
pts=["First live causal inference in Indian customer banking, to our knowledge.",
     "Nearly 3x the accuracy of the usual pattern-based approach, measured and reproducible.",
     "All three pillars (acquisition, adoption, engagement) on one shared engine.",
     "Built around RBI FREE-AI and DPDP from the first line of code.",
     "A working, deployable prototype today, with an honest path to production."]
y=66
for p in pts:
    d.dot(MX+3,y+3,color=VIOLET); d.text(MX+11,y,W-2*MX-11,p,size=13.5,color=LIGHT)
    y+=18

# ---------- 12 ROADMAP ----------
d.slide("Roadmap",12)
d.heading("From pilot to national scale.",y=36,size=27)
phases=[("3 months","Sandbox pilot","A/B test on a consented cohort inside SBI.",VIOLET),
        ("6 months","Regional scale","RCT-calibrated, measured uplift across regions.",TEAL),
        ("12 months","National","Full rollout with on-device federated learning.",AMBER)]
cw=(W-2*MX-24)/3; x=MX
for ph,t,s,acc in phases:
    d.panel(x,70,cw,72,fill=PANEL2,accent=acc)
    d.text(x+9,78,cw-18,ph,size=16,color=acc,style="B")
    d.text(x+9,94,cw-18,t,size=13,color=WHITE,style="B")
    d.text(x+9,110,cw-18,s,size=10.5,color=GRAY)
    x+=cw+12

# ---------- 13 CLOSING ----------
d.slide()
d.set_fill_color(*VIOLET); d.rect(MX,64,46,3.4,"F")
d.set_xy(MX,76); d.set_font("Helvetica","B",40); d.set_text_color(*WHITE)
d.cell(0,18,"The first causally")
d.set_xy(MX,96); d.cell(0,18,"intelligent bank.")
d.text(MX,128,W,"ARTH.AI",size=20,color=VIOLET,style="B")
d.set_draw_color(*PANEL2); d.line(MX,150,W-MX,150)
d.text(MX,156,W,"Live prototype:  arth-ai-one.vercel.app",size=12,color=LIGHT)
d.text(MX,166,W,"Code:  github.com/sahil0m/arth-ai",size=12,color=LIGHT)
d.text(MX,180,W,"Thank you.",size=12,color=GRAY,style="I")

d.output("ARTH_AI_Pitch_Deck.pdf")
print("OK slides:", d.page_no())
