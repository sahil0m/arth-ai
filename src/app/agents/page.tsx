"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  HeartHandshake,
  MessageCircle,
  ShieldQuestion,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { CustomerPicker, PickerState } from "@/components/customer-picker";
import { Badge, MeterBar } from "@/components/ui";
import { generateCustomer } from "@/lib/synthetic";
import { runSparsh, runPragati, runBandhan, runGyaan } from "@/lib/agents";
import { inferFromCustomer } from "@/lib/causal";
import { EVENT_EMOJI, EVENT_LABEL } from "@/lib/scm-knowledge";

export default function AgentsPage() {
  const [picker, setPicker] = useState<PickerState>({ seed: 88, forceEvent: "WEDDING" });

  const d = useMemo(() => {
    const customer = generateCustomer(picker.seed, {
      forceEvent: picker.forceEvent,
      forceExisting: picker.forceEvent === "NONE" ? true : undefined,
    });
    return {
      customer,
      inference: inferFromCustomer(customer).inference,
      sparsh: runSparsh(customer),
      pragati: runPragati(customer),
      bandhan: runBandhan(customer),
      gyaan: runGyaan(customer),
    };
  }, [picker.seed, picker.forceEvent]);

  const { customer, inference, sparsh, pragati, bandhan, gyaan } = d;

  return (
    <div className="section py-10">
      <Badge tone="violet"><Sparkles size={13} /> Layer 3 · Autonomous Agent Network</Badge>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Four agents act on one customer
      </h1>
      <p className="mt-2 max-w-2xl text-slate-400">
        The same causal inference feeds all four agents. Each owns a pillar of the
        SBI mandate and decides autonomously — with a human-readable reason.
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <CustomerPicker state={picker} onChange={setPicker} />
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.05] font-semibold text-white">
                {customer.name[0]}
              </div>
              <div>
                <div className="font-semibold text-white">{customer.name}, {customer.age}</div>
                <div className="text-xs text-slate-500">{customer.city} · {customer.language}</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-arth-violet/20 bg-arth-violet/[0.06] p-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-arth-violet">Causal read</div>
              <div className="mt-1 flex items-center gap-2">
                <span>{EVENT_EMOJI[inference.topEvent]}</span>
                <span className="text-sm font-semibold text-white">{EVENT_LABEL[inference.topEvent]}</span>
                <span className="mono-num ml-auto text-xs text-arth-violet">{(inference.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* SPARSH */}
          <AgentCard name="SPARSH" tag="Customer Acquisition" icon={Target} color="violet"
            tagline="Invisible Qualification Engine — Financial Trust Radius">
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi label="Life-event score" value={`${sparsh.lifeEventScore}/100`} />
              <Kpi label="Trust Radius" value={`${sparsh.trustRadius} SBI links`} />
              <Kpi label="Decision" value={sparsh.decision} highlight={sparsh.decision === "ACTIVATE"} />
            </div>
            <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
              {sparsh.rationale.map((r, i) => (
                <li key={i} className="flex gap-2"><span className="text-arth-violet">↳</span>{r}</li>
              ))}
            </ul>
            <ChatBubble channel="WhatsApp" lang={customer.language}>{sparsh.message}</ChatBubble>
          </AgentCard>

          {/* PRAGATI */}
          <AgentCard name="PRAGATI" tag="Digital Adoption" icon={TrendingUp} color="teal"
            tagline="Digital Comfort Score — progressive feature disclosure">
            <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
              <div>
                <div className="mono-num text-4xl font-bold text-arth-teal">{pragati.comfort.score}</div>
                <div className="text-sm font-medium text-white">{pragati.comfort.tier}</div>
                <div className="mt-3 space-y-1.5">
                  {pragati.comfort.components.map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{c.label}</span><span className="mono-num">{(c.value * 100).toFixed(0)}%</span>
                      </div>
                      <MeterBar value={c.value} accent="teal" />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unlocked features</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {pragati.comfort.unlocked.map((f) => (
                    <span key={f} className="rounded-full border border-arth-teal/30 bg-arth-teal/10 px-2.5 py-1 text-[11px] text-arth-teal">{f}</span>
                  ))}
                  {pragati.comfort.nextUnlock && (
                    <span className="rounded-full border border-dashed border-white/15 px-2.5 py-1 text-[11px] text-slate-500">🔒 {pragati.comfort.nextUnlock}</span>
                  )}
                </div>
                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Nudge timing</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{pragati.nudge.reason}</p>
                <ChatBubble channel="App push" lang={customer.language}>{pragati.nudge.message}</ChatBubble>
              </div>
            </div>
          </AgentCard>

          {/* BANDHAN */}
          <AgentCard name="BANDHAN" tag="Engagement & Retention" icon={Users} color="amber"
            tagline="Financial Empathy Index — support over sales">
            <div className="grid gap-4 sm:grid-cols-[200px_1fr]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Empathy index</div>
                <div className="mono-num mt-1 text-3xl font-bold text-arth-amber">{bandhan.empathy.fei}<span className="text-base text-slate-500">/100</span></div>
                <div className="text-sm font-medium text-white">{bandhan.empathy.level}</div>
                <ul className="mt-2 space-y-1 text-[11px] text-slate-400">
                  {bandhan.empathy.signals.map((s, i) => <li key={i}>• {s}</li>)}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-arth-amber">
                  <HeartHandshake size={14} /> {bandhan.response.title}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">{bandhan.response.message}</p>
                {bandhan.response.options && (
                  <ul className="mt-3 space-y-1.5">
                    {bandhan.response.options.map((o, i) => (
                      <li key={i} className="rounded-lg border border-arth-amber/20 bg-arth-amber/[0.06] px-3 py-2 text-xs text-slate-200">{o}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </AgentCard>

          {/* GYAAN */}
          <AgentCard name="GYAAN" tag="Meta-Learning" icon={Brain} color="rose"
            tagline="Financial Twin clusters — peer-validated, privacy-preserved">
            <div className="grid gap-4 sm:grid-cols-3">
              <Kpi label="Twin cluster" value={`${gyaan.cohortSize} people`} />
              <Kpi label="Success rate" value={`${(gyaan.successRate * 100).toFixed(0)}%`} highlight />
              <Kpi label="Top next action" value={gyaan.topNextAction} />
            </div>
            <div className="mt-4 rounded-2xl border border-arth-rose/20 bg-arth-rose/[0.06] p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-arth-rose">
                <ShieldQuestion size={14} /> {gyaan.clusterName}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{gyaan.projection}</p>
            </div>
          </AgentCard>
        </div>
      </div>
    </div>
  );
}

const COLORS = {
  violet: { text: "text-arth-violet", bg: "bg-arth-violet/10", border: "border-arth-violet/30" },
  teal: { text: "text-arth-teal", bg: "bg-arth-teal/10", border: "border-arth-teal/30" },
  amber: { text: "text-arth-amber", bg: "bg-arth-amber/10", border: "border-arth-amber/30" },
  rose: { text: "text-arth-rose", bg: "bg-arth-rose/10", border: "border-arth-rose/30" },
};

function AgentCard({
  name, tag, tagline, icon: Icon, color, children,
}: {
  name: string; tag: string; tagline: string;
  icon: React.ElementType; color: keyof typeof COLORS; children: React.ReactNode;
}) {
  const c = COLORS[color];
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5 }}
      className="card overflow-hidden p-6">
      <div className="flex items-center gap-3">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.bg} ${c.text}`}><Icon size={22} /></span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">{name}</span>
            <span className={`text-xs font-semibold ${c.text}`}>{tag}</span>
          </div>
          <div className="text-xs text-slate-500">{tagline}</div>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </motion.div>
  );
}

function Kpi({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 ${highlight ? "border-arth-teal/30 bg-arth-teal/[0.07]" : "border-white/10 bg-white/[0.02]"}`}>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`mt-1 text-sm font-bold capitalize ${highlight ? "text-arth-teal" : "text-white"}`}>{value}</div>
    </div>
  );
}

function ChatBubble({ channel, lang, children }: { channel: string; lang: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-500">
        <MessageCircle size={12} /> {channel} · {lang}
      </div>
      <div className="relative max-w-md rounded-2xl rounded-tl-sm border border-arth-teal/20 bg-arth-teal/[0.06] px-4 py-3 text-sm leading-relaxed text-slate-100">
        {children}
      </div>
    </div>
  );
}
