"use client";

import { NextAction } from "@/lib/types";
import { CheckCircle2, AlertTriangle, ArrowRightCircle } from "lucide-react";

interface NextActionsPanelProps {
  actions: NextAction[];
}

export function NextActionsPanel({ actions }: NextActionsPanelProps) {
  if (!actions || actions.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Action Plan</p>
        <h2 className="mt-2 font-display text-3xl text-textPrimary">Your next steps</h2>
      </div>

      <div className="space-y-4">
        {actions.map((item, index) => {
          const priorityColor = 
            item.priority === "high" ? "text-danger bg-danger/5 border-danger/20" :
            item.priority === "medium" ? "text-warning bg-warning/5 border-warning/20" :
            "text-brand bg-brand/5 border-brand/20";

          const Icon = 
            item.priority === "high" ? AlertTriangle :
            item.priority === "medium" ? ArrowRightCircle :
            CheckCircle2;

          return (
            <div 
              key={index}
              className={`flex items-start gap-4 rounded-2xl border p-5 transition-all hover:shadow-md ${priorityColor}`}
            >
              <div className="mt-1">
                <Icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg leading-tight">{item.action}</h3>
                <p className="mt-2 text-sm opacity-80 leading-relaxed">{item.reason}</p>
                <div className="mt-3 inline-flex items-center rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  {item.priority} priority
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
