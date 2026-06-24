"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

/** Scroll-reveal wrapper — premium fade-up on enter. */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-arth-violet">
      <span className="h-1.5 w-1.5 rounded-full bg-arth-violet shadow-[0_0_12px_2px_rgba(124,92,255,0.7)]" />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function Stat({
  value,
  label,
  sub,
  accent = "violet",
}: {
  value: ReactNode;
  label: string;
  sub?: string;
  accent?: "violet" | "teal" | "amber";
}) {
  const color =
    accent === "teal"
      ? "text-arth-teal"
      : accent === "amber"
      ? "text-arth-amber"
      : "text-arth-violet";
  return (
    <div className="card p-5">
      <div className={`mono-num text-3xl font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-sm font-medium text-slate-200">{label}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

export function Badge({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "teal" | "amber" | "rose" | "violet";
}) {
  const tones: Record<string, string> = {
    default: "border-white/10 bg-white/[0.03] text-slate-300",
    teal: "border-arth-teal/30 bg-arth-teal/10 text-arth-teal",
    amber: "border-arth-amber/30 bg-arth-amber/10 text-arth-amber",
    rose: "border-arth-rose/30 bg-arth-rose/10 text-arth-rose",
    violet: "border-arth-violet/30 bg-arth-violet/10 text-arth-violet",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Horizontal probability/score bar. */
export function MeterBar({
  value,
  max = 1,
  accent = "violet",
}: {
  value: number;
  max?: number;
  accent?: "violet" | "teal" | "amber" | "rose";
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const grad: Record<string, string> = {
    violet: "from-arth-violet to-arth-indigo",
    teal: "from-arth-teal to-arth-emerald",
    amber: "from-arth-amber to-orange-400",
    rose: "from-arth-rose to-red-400",
  };
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/[0.06]">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${grad[accent]}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
