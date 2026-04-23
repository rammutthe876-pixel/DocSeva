"use client";

import { FileCheck, ClipboardList, Clock, AlertTriangle } from "lucide-react";
import { ClaimReadiness } from "@/lib/types";

interface ClaimReadinessCardProps {
  data: ClaimReadiness;
}

export function ClaimReadinessCard({ data }: ClaimReadinessCardProps) {
  if (!data) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-sky-50 p-2">
          <FileCheck className="text-sky-600" size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-600">Preparation</p>
          <h2 className="mt-1 font-display text-2xl text-textPrimary">Claim Readiness</h2>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList size={16} className="text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Likely Needed Documents</p>
          </div>
          <ul className="grid gap-2">
            {data.likelyNeeded.map((item, i) => (
              <li key={i} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                {item}
              </li>
            ))}
            {data.likelyNeeded.length === 0 && <p className="text-sm text-slate-400 italic">None identified</p>}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-slate-400" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Important Deadlines</p>
          </div>
          <div className="space-y-2">
            {data.deadlines.map((item, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-600 pl-6 relative">
                <span className="absolute left-0 top-1 text-slate-300">•</span>
                {item}
              </p>
            ))}
            {data.deadlines.length === 0 && <p className="text-sm text-slate-400 italic">None identified</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-500" />
            <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Rejection Risks</p>
          </div>
          <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4 space-y-2">
            {data.rejectionRisks.map((item, i) => (
              <p key={i} className="text-sm leading-relaxed text-amber-800 flex gap-2">
                <span className="shrink-0 mt-1 h-1 w-1 rounded-full bg-amber-400" />
                {item}
              </p>
            ))}
            {data.rejectionRisks.length === 0 && <p className="text-sm text-amber-400 italic">No specific risks identified</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
