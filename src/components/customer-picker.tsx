"use client";

import { Dices, User } from "lucide-react";
import { LifeEvent } from "@/lib/types";

export interface PickerState {
  seed: number;
  forceEvent?: LifeEvent;
}

const SCENARIOS: { label: string; event?: LifeEvent }[] = [
  { label: "Surprise me", event: undefined },
  { label: "Wedding", event: "WEDDING" },
  { label: "New child", event: "NEW_CHILD" },
  { label: "Job change", event: "JOB_CHANGE" },
  { label: "Relocation", event: "RELOCATION" },
  { label: "Medical", event: "MEDICAL" },
  { label: "Stable", event: "NONE" },
];

export function CustomerPicker({
  state,
  onChange,
}: {
  state: PickerState;
  onChange: (s: PickerState) => void;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        <User size={13} /> Choose a customer profile
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {SCENARIOS.map((s) => {
          const active =
            (s.event ?? "ANY") === (state.forceEvent ?? "ANY");
          return (
            <button
              key={s.label}
              onClick={() =>
                onChange({ seed: Math.floor(Math.random() * 1e6), forceEvent: s.event })
              }
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                active
                  ? "border-arth-violet/50 bg-arth-violet/15 text-white"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={() =>
          onChange({ seed: Math.floor(Math.random() * 1e6), forceEvent: state.forceEvent })
        }
        className="btn-ghost mt-3 w-full !py-2 !text-xs"
      >
        <Dices size={14} /> Generate another customer
      </button>
    </div>
  );
}
