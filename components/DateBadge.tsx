import { getUrgencyLevel } from "@/lib/utils";
import type { ExtractedDate } from "@/lib/types";

interface DateBadgeProps {
  item: ExtractedDate;
}

export function DateBadge({ item }: DateBadgeProps) {
  const urgency = item.daysUntil !== null ? getUrgencyLevel(item.daysUntil) : "none";
  
  let urgencyClass = "bg-slate-100 text-slate-600";
  if (urgency === "expired" || urgency === "red") urgencyClass = "bg-danger text-white";
  if (urgency === "amber") urgencyClass = "bg-warning text-white";
  if (urgency === "none") urgencyClass = "bg-success/15 text-success";

  return (
    <div className="flex flex-col rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-brand">{item.label}</p>
          <p className="text-sm font-semibold text-textPrimary leading-tight" title={item.rawText}>{item.meaning || item.rawText}</p>
        </div>
        {item.daysUntil !== null && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${urgencyClass}`}>
            {item.daysUntil < 0 ? "Expired" : `${item.daysUntil} days`}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-50">
        <span className="text-slate-400 font-medium italic">{item.date || "Date unclear"}</span>
        <span className={`font-bold uppercase tracking-widest text-[9px] ${
          item.confidence === 'high' ? 'text-success' : 'text-warning'
        }`}>
          {item.confidence} confidence
        </span>
      </div>

      <div className="mt-2 rounded-xl bg-red-50/80 p-3 text-[11px] leading-relaxed text-red-700">
        <p className="font-bold uppercase tracking-wider text-[9px] mb-1 opacity-70">If missed:</p>
        {item.missedConsequence}
      </div>
    </div>
  );
}
