# -*- coding: utf-8 -*-
"""ARTH.AI pitch deck - clean, professional, well-explained. ASCII-only."""
from fpdf import FPDF
import math

# Professional light palette
BG=(255,255,255); SOFT=(247,248,251); LINE=(226,230,237)
INK=(17,24,39); SLATE=(51,65,85); MUTE=(110,118,132)
PRIMARY=(67,56,202); PRIMARY_L=(99,102,241); TEAL=(13,148,136)
AMBER=(176,98,19); SLATEACC=(100,116,139)

W,H=297,210; MX=24

class Deck(FPDF):
    # ---- chrome ----
    def base(self):
        self.add_page()
        self.set_fill_color(*BG); self.rect(0,0,W,H,"F")
    def frame(self, eyebrow, n):
        self.base()
        self.set_fill_color(*PRIMARY); self.rect(0,0,W,1.6,"F")
        self.set_xy(MX,15); self.set_font("Helvetica","B",9); self.set_text_color(*PRIMARY)
        self.cell(0,5,eyebrow.upper())
        self.set_xy(W-MX-20,15); self.set_font("Helvetica","",9); self.set_text_color(*MUTE)
        self.cell(20,5,f"{n:02d} / 13",align="R")
        # footer
        self.set_draw_color(*LINE); self.set_line_width(0.3); self.line(MX,191,W-MX,191)
        self.set_xy(MX,193); self.set_font("Helvetica","B",8); self.set_text_color(*INK)
        self.cell(40,4,"ARTH.AI")
        self.set_font("Helvetica","",8); self.set_text_color(*MUTE)
        self.set_xy(W-MX-90,193); self.cell(90,4,"SBI BI Hackathon @ GFF 2026",align="R")
    def head(self, text, y=27, size=25):
        self.set_xy(MX,y); self.set_font("Helvetica","B",size); self.set_text_color(*INK)
        self.multi_cell(W-2*MX, size*0.46, text)
    def lead(self, text, y, w=W-2*MX, size=12, color=SLATE):
        self.set_xy(MX,y); self.set_font("Helvetica","",size); self.set_text_color(*color)
        self.multi_cell(w, size*0.55, text)
    def para(self,x,y,w,text,size=10.5,color=SLATE,style="",lh=None):
        self.set_xy(x,y); self.set_font("Helvetica",style,size); self.set_text_color(*color)
        self.multi_cell(w, lh or size*0.55, text)
    def card(self,x,y,w,h,fill=SOFT,border=True,accent=None):
        self.set_fill_color(*fill); self.rect(x,y,w,h,"F")
        if border:
            self.set_draw_color(*LINE); self.set_line_width(0.3); self.rect(x,y,w,h,"D")
        if accent:
            self.set_fill_color(*accent); self.rect(x,y,w,2.2,"F")
    def chip_num(self,x,y,txt,color=PRIMARY,r=4.5):
        self.set_fill_color(*color); self.ellipse(x-r,y-r,2*r,2*r,"F")
        self.set_xy(x-r,y-2.4); self.set_font("Helvetica","B",10); self.set_text_color(255,255,255)
        self.cell(2*r,4,txt,align="C")
    def node(self,cx,cy,w,h,label,sub=None,fill=PRIMARY,tcol=(255,255,255)):
        x=cx-w/2; y=cy-h/2
        self.set_fill_color(*fill); self.rect(x,y,w,h,"F")
        self.set_xy(x,cy-(5 if sub else 2.5)); self.set_font("Helvetica","B",10); self.set_text_color(*tcol)
        self.cell(w,5,label,align="C")
        if sub:
            self.set_xy(x,cy+1); self.set_font("Helvetica","",7.5)
            self.cell(w,4,sub,align="C")
    def arrow(self,x1,y1,x2,y2,color=MUTE,wd=0.5):
        self.set_draw_color(*color); self.set_line_width(wd); self.line(x1,y1,x2,y2)
        ang=math.atan2(y2-y1,x2-x1); s=2.4
        p=[(x2,y2),
           (x2-s*math.cos(ang-0.4),y2-s*math.sin(ang-0.4)),
           (x2-s*math.cos(ang+0.4),y2-s*math.sin(ang+0.4))]
        self.set_fill_color(*color); self.polygon(p,style="F")

d=Deck(orientation="L",format="A4"); d.set_auto_page_break(False); d.set_margins(MX,14,MX)

# ============ 1  COVER ============
d.base()
d.set_fill_color(*PRIMARY); d.rect(0,0,W,1.6,"F")
# logo mark
lx,ly=MX,40
d.set_fill_color(*PRIMARY); d.rect(lx,ly,11,11,"F")
d.set_fill_color(255,255,255)
for px,py in [(lx+3,ly+3.2),(lx+7.6,ly+3.6),(lx+7,ly+8),(lx+3.4,ly+7.6)]:
    d.ellipse(px-0.9,py-0.9,1.8,1.8,"F")
d.set_xy(lx+15,ly+1); d.set_font("Helvetica","B",13); d.set_text_color(*INK); d.cell(0,8,"ARTH.AI")
# headline
d.set_xy(MX,72); d.set_font("Helvetica","B",46); d.set_text_color(*INK)
d.multi_cell(W-2*MX,18,"The bank that understands why.")
d.para(MX,118,200,"Causal, agentic AI that reaches the right customer with the right product at the right moment, across acquisition, digital adoption and engagement.",size=14,color=SLATE,lh=7)
d.set_draw_color(*LINE); d.line(MX,158,W-MX,158)
d.para(MX,164,120,"Theme: Agentic AI & Emerging Tech\nProblem statement: Digital Engagement",size=10,color=MUTE,lh=5.2)
d.para(W/2,164,W/2-MX,"Live prototype: arth-ai-one.vercel.app\nCode: github.com/sahil0m/arth-ai",size=10,color=MUTE,lh=5.2)

# ============ 2  PROBLEM ============
d.frame("The problem",2)
d.head("Banks reach customers at the wrong moment.",y=27,size=23)
d.lead("There has never been more data or more products, yet the basics still slip. A new account is opened and never activated. A loan offer lands weeks after the need has passed. The gap is rarely the product. It is the timing.", y=46, w=W-2*MX, size=12)
facts=[("Onboarding leaks","Around 60% of people abandon a complex digital sign-up before they ever activate."),
       ("Offers arrive late","Cross-sell and loan offers are sent on a fixed calendar, not when the need appears."),
       ("Engagement is generic","Mass campaigns ignore what is actually happening in a customer's life right now.")]
cw=(W-2*MX-2*8)/3; x=MX
for i,(t,s) in enumerate(facts):
    d.card(x,82,cw,46,accent=PRIMARY)
    d.para(x+8,90,cw-16,t,size=12,color=INK,style="B")
    d.para(x+8,101,cw-16,s,size=10,color=SLATE,lh=5)
    x+=cw+8
d.para(MX,138,W-2*MX,"For a bank of SBI's scale, even small percentage losses at each step add up to a very large number.",size=11,color=MUTE,style="I")

# ============ 3  ROOT CAUSE ============
d.frame("Why it happens",3)
d.head("Most banking AI predicts. It never asks why.",y=27,size=23)
d.lead("To fix timing you first have to understand cause. But the AI banks use today is built to spot patterns, not to explain them. It notices that two things happen together and quietly assumes one explains the other.", y=46, size=12)
d.card(MX,76,W-2*MX,40,fill=SOFT,accent=SLATEACC)
d.para(MX+10,84,W-2*MX-20,'A typical model learns: "customers who buy jewellery often take a loan", and starts pushing loans at jewellery buyers.',size=12.5,color=INK,style="B",lh=6)
d.para(MX+10,99,W-2*MX-20,"But that link is misleading. It also fires for wealthy shoppers and festival buyers, and it offers the loan at the wrong time. The model is reacting to a symptom without knowing the cause.",size=10.5,color=SLATE,lh=5.2)
d.para(MX,126,W-2*MX,"This is the core limitation ARTH.AI is built to remove.",size=12,color=PRIMARY,style="B")

# ============ 4  INSIGHT (diagram) ============
d.frame("The insight",4)
d.head("Find the cause, and timing takes care of itself.",y=27,size=22)
d.lead("ARTH.AI asks a different question: not what tends to happen next, but what is actually causing this behaviour. The answer is usually a life event, and that event is the shared cause of both the spending we observe and the need we want to serve.", y=46, size=11.5)
# diagram
cx=W/2
d.node(cx,86,64,15,"LIFE EVENT","e.g. a wedding approaching",fill=PRIMARY)
d.node(cx-72,128,62,15,"Spending signals","jewellery, venue, apparel",fill=(238,240,248),tcol=INK)
d.node(cx+72,128,62,15,"Banking need","joint account, loan",fill=(228,242,240),tcol=INK)
d.arrow(cx-18,93.5,cx-58,121,color=PRIMARY,wd=0.6)
d.arrow(cx+18,93.5,cx+58,121,color=PRIMARY,wd=0.6)
# faint crossed link between siblings
d.set_draw_color(*SLATEACC); d.set_line_width(0.4)
d.set_dash_pattern(dash=2, gap=2); d.line(cx-41,128,cx+41,128); d.set_dash_pattern()
d.para(cx-41,131,82,"not cause and effect",size=8,color=MUTE,style="I")
d.para(MX,150,W-2*MX,"The jewellery does not cause the loan. The wedding causes both. So ARTH.AI acts on the wedding, and the timing and the offer are right by construction.",size=11,color=SLATE,lh=5.4)

# ============ 5  SOLUTION ============
d.frame("The solution",5)
d.head("ARTH.AI: an agentic layer that acts on the cause.",y=27,size=22)
d.lead("ARTH.AI sits on top of the bank's existing systems. With the customer's consent it reads their transaction signals, infers the life event behind them, and then decides what to offer and when. Four specialised agents carry out the work across the three pillars of the SBI mandate.", y=46, size=11.5)
pills=[("Acquisition","Identify and onboard the right new customers, with a quick consent-based video-KYC flow."),
       ("Digital adoption","Introduce features at the pace each customer is ready for, nudging only at good moments."),
       ("Engagement","Act around real life events and financial stress, not generic monthly campaigns.")]
cw=(W-2*MX-2*8)/3; x=MX
for t,s in pills:
    d.card(x,86,cw,50,accent=TEAL)
    d.para(x+8,94,cw-16,t,size=12,color=INK,style="B")
    d.para(x+8,105,cw-16,s,size=9.8,color=SLATE,lh=5)
    x+=cw+8
d.para(MX,146,W-2*MX,"One causal engine powers all three, so every improvement compounds across the customer journey.",size=11,color=PRIMARY,style="B")

# ============ 6  HOW IT WORKS (pipeline) ============
d.frame("How it works",6)
d.head("From a UPI transaction to a timed, explained action.",y=27,size=21)
d.lead("The system runs as a six-stage pipeline. Each stage is interpretable, so every recommendation can be traced back to the transactions that produced it.", y=46, size=11.5)
steps=[("Data","Consent-based UPI history"),("Signals","12 clues scored 0 to 1"),
       ("Causal engine","Infer the hidden life event"),("Needs","Rank the products it causes"),
       ("Timing","Pick the best day to act"),("Action","An agent reaches out")]
n=len(steps); gap=8; bw=(W-2*MX-(n-1)*gap)/n; y=82; bh=30; x=MX
for i,(t,s) in enumerate(steps):
    acc = PRIMARY if i==2 else TEAL
    d.card(x,y,bw,bh,fill=SOFT,accent=acc)
    d.chip_num(x+bw/2,y-0.5,str(i+1),color=acc)
    d.para(x+3,y+7,bw-6,t,size=9.3,color=INK,style="B",lh=4)
    d.para(x+3,y+15,bw-6,s,size=7.4,color=MUTE,lh=3.6)
    if i<n-1: d.arrow(x+bw+1.5,y+bh/2,x+bw+gap-1.5,y+bh/2,color=MUTE,wd=0.5)
    x+=bw+gap
d.para(MX,126,W-2*MX,"Stage three is the heart of the system: a structural causal model, inverted with Bayesian reasoning, that turns the clues into a confident read of the life event. Everything before it feeds that step; everything after it acts on the result.",size=11,color=SLATE,lh=5.4)

# ============ 7  AGENTS ============
d.frame("The four agents",7)
d.head("Four agents, one shared causal brain.",y=27,size=22)
d.lead("Each agent owns a part of the journey and consumes the same causal read, so they work from one consistent view of the customer.", y=46, size=11.5)
agents=[("SPARSH","Acquisition",PRIMARY,"Finds promising prospects within the bank's network and onboards them in minutes through a consent-based video-KYC flow, with no branch visit."),
        ("PRAGATI","Digital adoption",TEAL,"Measures how comfortable a customer is with the app and unlocks features at a matching pace, nudging only when attention is high and never during stress."),
        ("BANDHAN","Engagement",AMBER,"Detects financial stress and responds with support rather than a sales pitch, and proactively offers loyal customers a better rate before they ask."),
        ("GYAAN","Meta-learning",SLATEACC,"Learns from outcomes across similar customers to give privacy-safe, peer-validated guidance, without exposing any individual's data.")]
cw=(W-2*MX-8)/2; ch=44; y0=62
for i,(nm,tag,acc,desc) in enumerate(agents):
    x=MX+(i%2)*(cw+8); y=y0+(i//2)*(ch+8)
    d.card(x,y,cw,ch,accent=acc)
    d.para(x+9,y+7,60,nm,size=13,color=INK,style="B")
    d.para(x+9+34,y+8.6,cw-50,tag,size=9.5,color=acc,style="B")
    d.para(x+9,y+19,cw-18,desc,size=9.4,color=SLATE,lh=4.7)

# ============ 8  PROOF ============
d.frame("Does it work",8)
d.head("It works, and the numbers are reproducible.",y=27,size=22)
d.lead("We measured the causal engine against the usual pattern-based approach on identifying the correct banking need. The gap is large, and anyone can re-run it live in the browser.", y=46, size=11.5)
stats=[("70%","need identified correctly by the causal model",TEAL),
       ("29%","by the pattern-based approach it replaces",AMBER),
       ("2.4x","more accurate, end to end",PRIMARY)]
cw=(W-2*MX-2*8)/3; x=MX
for big,lab,acc in stats:
    d.card(x,80,cw,38)
    d.set_xy(x,86); d.set_font("Helvetica","B",30); d.set_text_color(*acc); d.cell(cw,12,big,align="C")
    d.para(x+6,103,cw-12,lab,size=9,color=SLATE,lh=4.4)
    x+=cw+8
d.card(MX,126,W-2*MX,30,fill=SOFT,accent=PRIMARY)
d.para(MX+9,132,W-2*MX-18,"Validated formally in Python with DoWhy from Microsoft Research. In a controlled test, 97% of the naive correlation turned out to be confounding, and both standard refutation tests (placebo and random common cause) passed.",size=10,color=SLATE,lh=5)

# ============ 9  DEMO ============
d.frame("Live demo",9)
d.head("It reads a customer in about 45 seconds.",y=27,size=22)
d.lead("A worked example from the live prototype. Six months of one customer's UPI data goes in, and the system reasons step by step:",y=46,size=11.5)
flow=[("Signals","jewellery purchases, a venue payment, a new salary source"),
      ("Causal read","WEDDING, at 80% confidence, with the reasons shown"),
      ("Needs","a joint savings account and a personal loan"),
      ("Timing","act near day 39, not today, while the need is forming"),
      ("Action","a WhatsApp message in the customer's language, at the hour they usually engage")]
y=70
for i,(t,s) in enumerate(flow):
    d.chip_num(MX+4,y+2.5,str(i+1),color=PRIMARY if i==1 else TEAL,r=3.6)
    d.para(MX+13,y,40,t,size=10.5,color=INK,style="B")
    d.para(MX+58,y,W-2*MX-58,s,size=10.5,color=SLATE)
    y+=13.5
d.para(MX,y+3,W-2*MX,"Note the judgement: a stray signal fired, yet the wedding still won, and the system chose to wait for the right day rather than act immediately.",size=10.5,color=MUTE,style="I",lh=5.2)

# ============ 10  COMPLIANCE ============
d.frame("Regulatory readiness",10)
d.head("Built for the rules from the first line of code.",y=27,size=22)
d.lead("Banking AI in India has to meet a high bar. ARTH.AI is designed around the current framework rather than retrofitted to it, which directly addresses the regulatory-readiness criterion.", y=46, size=11.5)
items=[("RBI FREE-AI framework","Aligned to all seven principles, including trust, fairness, accountability and explainability."),
       ("DPDP Act 2023","Per-signal consent that can be withdrawn at any time; raw data never leaves the device."),
       ("Human in the loop","Every credit decision is recommended by the system but approved by a person."),
       ("Explainable and fair","Each action carries a plain-language reason, and causal logic avoids hidden proxy bias.")]
cw=(W-2*MX-8)/2; ch=33; y0=72
for i,(t,s) in enumerate(items):
    x=MX+(i%2)*(cw+8); y=y0+(i//2)*(ch+8)
    d.card(x,y,cw,ch,accent=TEAL)
    d.para(x+8,y+6,cw-16,t,size=11,color=INK,style="B")
    d.para(x+8,y+16,cw-16,s,size=9,color=SLATE,lh=4.5)
d.para(MX,158,W-2*MX,"The prototype uses only synthetic, consent-simulated data. No real customer information is involved.",size=9.5,color=MUTE,style="I")

# ============ 11  BUSINESS ============
d.frame("Business model",11)
d.head("A B2B platform with a clear path to value.",y=27,size=22)
d.lead("ARTH.AI is sold to banks as a platform. The model is designed so our success is tied directly to the bank's.", y=46, size=11.5)
left=("How we earn",["An annual platform licence or subscription, sized to the customer base served.",
                     "A success-based share of the products and loans the system actually drives.",
                     "Paid integration, deployment and ongoing support."])
right=("Why it scales",["One engine improves acquisition, adoption and retention together.",
                        "At SBI's scale, a small percentage gain is a large absolute return.",
                        "Cloud-native, so it grows at low marginal cost, then extends to other banks and NBFCs."])
cw=(W-2*MX-8)/2; x=MX
for title,pts in (left,right):
    d.card(x,70,cw,86,accent=PRIMARY)
    d.para(x+9,77,cw-18,title,size=12.5,color=PRIMARY,style="B")
    yy=91
    for p in pts:
        d.set_fill_color(*TEAL); d.ellipse(x+9,yy+1.3,1.6,1.6,"F")
        d.para(x+14,yy-0.5,cw-24,p,size=9.8,color=SLATE,lh=4.8)
        yy+=17
    x+=cw+8

# ============ 12  ROADMAP ============
d.frame("Roadmap",12)
d.head("From a measured pilot to national scale.",y=27,size=22)
d.lead("A staged rollout that proves value on a small, consented group first, then scales with evidence.", y=46, size=11.5)
phases=[("Months 0-3","Sandbox pilot","Run inside SBI on a consented cohort with a proper A/B holdout, to measure real lift.",PRIMARY),
        ("Months 3-9","Regional scale","Expand across regions with calibrated, audited uplift and tighter targeting.",TEAL),
        ("Months 9-18","National rollout","Full deployment with on-device federated learning so models improve without moving data.",AMBER)]
cw=(W-2*MX-2*8)/3; x=MX
for ph,t,s,acc in phases:
    d.card(x,74,cw,64,accent=acc)
    d.para(x+8,82,cw-16,ph,size=11,color=acc,style="B")
    d.para(x+8,93,cw-16,t,size=12.5,color=INK,style="B")
    d.para(x+8,106,cw-16,s,size=9.5,color=SLATE,lh=4.8)
    x+=cw+8
d.para(MX,148,W-2*MX,"Each stage gates the next on evidence, which keeps risk low and keeps the bank in control.",size=10.5,color=MUTE,style="I")

# ============ 13  CLOSE ============
d.base()
d.set_fill_color(*PRIMARY); d.rect(0,0,W,1.6,"F")
d.set_xy(MX,58); d.set_font("Helvetica","B",36); d.set_text_color(*INK)
d.multi_cell(W-2*MX,15,"The first causally intelligent bank.")
d.para(MX,104,200,"Every other solution tells SBI what a customer might do. ARTH.AI understands why, and acts before the customer even feels the need.",size=13,color=SLATE,lh=6.5)
d.set_draw_color(*LINE); d.line(MX,140,W-MX,140)
d.para(MX,146,120,"Live prototype\narth-ai-one.vercel.app",size=11,color=INK,lh=5.6,style="")
d.para(W/2,146,W/2-MX,"Code repository\ngithub.com/sahil0m/arth-ai",size=11,color=INK,lh=5.6)
d.set_xy(MX,172); d.set_font("Helvetica","B",11); d.set_text_color(*PRIMARY); d.cell(0,6,"ARTH.AI")
d.set_font("Helvetica","",10); d.set_text_color(*MUTE); d.cell(0,6,"    Thank you.")

d.output("ARTH_AI_Pitch_Deck.pdf")
print("OK slides:", d.page_no())
