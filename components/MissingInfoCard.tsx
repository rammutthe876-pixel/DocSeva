"use client";

import { Search, AlertCircle, HelpCircle } from "lucide-react";
import { MissingInfoItem } from "@/lib/types";

interface MissingInfoCardProps {
  items: MissingInfoItem[];
}

export function MissingInfoCard({ items }: MissingInfoCardProps) {
  if (!items) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-slate-50 p-2">
          <Search className="text-slate-600" size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-600">Observation Audit</p>
          <h2 className="mt-1 font-display text-2xl text-textPrimary">Incomplete Details</h2>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="group relative rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-slate-300">
            <div className="flex items-start gap-3">
              <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                item.severity === 'high' ? 'bg-danger' : item.severity === 'medium' ? 'bg-warning' : 'bg-slate-300'
              }`} />
              <div className="space-y-1">
                <p className="text-sm font-bold text-textPrimary leading-tight">{item.issue}</p>
                <p className="text-xs text-textSecondary leading-relaxed">{item.whyItMatters}</p>
              </div>
            </div>
            <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition">
              <HelpCircle size={14} className="text-slate-300" />
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="text-success mb-3" size={32} />
            <p className="text-sm font-semibold text-textPrimary">Everything looks complete</p>
            <p className="text-xs text-textSecondary mt-1">No significant missing information identified.</p>
          </div>
        )}
      </div>
    </section>
  );
}
