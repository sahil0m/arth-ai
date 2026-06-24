import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.06] bg-ink-950/60">
      <div className="section grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-arth-violet to-arth-indigo text-xs font-bold text-white">
              A
            </span>
            <span className="font-bold text-white">ARTH.AI</span>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
            Agentic Real-Time Intelligence for Holistic Banking. The first
            causally-intelligent agentic layer for customer acquisition, digital
            adoption and engagement — built for the SBI BI Hackathon @ GFF 2026.
          </p>
          <p className="mt-4 text-xs text-slate-600">
            Prototype on synthetic, consent-simulated data. No real customer data
            is used. Figures shown are either cited or produced by the in-app
            reproducible benchmark, as labelled.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Explore
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/demo" className="hover:text-white">Live Demo</Link></li>
            <li><Link href="/agents" className="hover:text-white">The 4 Agents</Link></li>
            <li><Link href="/architecture" className="hover:text-white">Architecture</Link></li>
            <li><Link href="/methodology" className="hover:text-white">Methodology</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Governance
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li><Link href="/compliance" className="hover:text-white">RBI FREE-AI &amp; DPDP</Link></li>
            <li><Link href="/methodology#citations" className="hover:text-white">Research &amp; Citations</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <span>© 2026 Team ARTH.AI · Built for SBI BI Hackathon @ GFF 2026</span>
          <span className="mono-num">Causal AI · Agentic · DPDP-by-design</span>
        </div>
      </div>
    </footer>
  );
}
