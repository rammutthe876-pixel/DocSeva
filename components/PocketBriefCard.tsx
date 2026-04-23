"use client";

import { Pocket, Calendar, ShieldAlert, CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { PocketBrief } from "@/lib/types";

interface PocketBriefCardProps {
  brief: PocketBrief;
}

export function PocketBriefCard({ brief }: PocketBriefCardProps) {
  if (!brief) return null;

  const statusConfig = {
    safe: { color: "text-success", bg: "bg-success/10", icon: CheckCircle2, label: "All Clear" },
    watch: { color: "text-warning", bg: "bg-warning/10", icon: Info, label: "Needs Review" },
    urgent: { color: "text-danger", bg: "bg-danger/10", icon: AlertTriangle, label: "Critical" }
  };

  const config = statusConfig[brief.status] || statusConfig.safe;
  const StatusIcon = config.icon;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 h-full">
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-brand/10 p-2 text-brand">
            <Pocket size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Quick Recap</p>
            <h2 className="mt-1 font-display text-2xl text-textPrimary">Pocket Brief</h2>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full ${config.bg} px-3 py-1.5`}>
          <StatusIcon className={config.color} size={14} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="grid gap-5">
        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-lg bg-slate-100 p-2 text-slate-500">
            <Info size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What it is</p>
            <p className="mt-0.5 text-sm font-semibold text-textPrimary">{brief.whatItIs}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-lg bg-slate-100 p-2 text-slate-500">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Top Priority</p>
            <p className="mt-0.5 text-sm font-semibold text-textPrimary">{brief.whatToDo}</p>
          </div>
        </div>

        {brief.nextDate && (
          <div className="flex items-start gap-4">
            <div className="mt-1 rounded-lg bg-slate-100 p-2 text-slate-500">
              <Calendar size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Next Date</p>
              <p className="mt-0.5 text-sm font-semibold text-textPrimary">{brief.nextDate}</p>
            </div>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="mt-1 rounded-lg bg-slate-100 p-2 text-slate-500">
            <ShieldAlert size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biggest Caution</p>
            <p className="mt-0.5 text-sm font-semibold text-textPrimary">{brief.mainRisk}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
