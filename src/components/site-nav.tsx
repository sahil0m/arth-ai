"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/demo", label: "Live Demo" },
  { href: "/agents", label: "Agents" },
  { href: "/architecture", label: "Architecture" },
  { href: "/methodology", label: "Methodology" },
  { href: "/compliance", label: "Compliance" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-xl">
      <nav className="section flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <Logo />
          <div className="leading-none">
            <span className="text-[15px] font-bold tracking-tight text-white">ARTH.AI</span>
            <span className="ml-2 hidden text-[11px] font-medium text-slate-500 sm:inline">
              Causal Banking Intelligence
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                {l.label}
                {active && (
                  <span className="mx-auto mt-1 block h-px w-4 bg-arth-violet" />
                )}
              </Link>
            );
          })}
          <Link href="/demo" className="btn-primary ml-2 !py-2 !text-[13px]">
            Run the demo
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.06] bg-ink-950/95 md:hidden">
          <div className="section flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-arth-violet to-arth-indigo shadow-glow">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        {/* causal node-graph mark */}
        <circle cx="6" cy="6" r="2.4" fill="white" />
        <circle cx="18" cy="7" r="1.7" fill="white" opacity="0.85" />
        <circle cx="16" cy="18" r="1.7" fill="white" opacity="0.85" />
        <circle cx="7" cy="17" r="1.7" fill="white" opacity="0.85" />
        <path
          d="M6 6L18 7M6 6L16 18M6 6L7 17"
          stroke="white"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}
