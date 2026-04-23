import { getUrgencyLevel } from "@/lib/utils";
import type { ExtractedDate } from "@/lib/types";

interface DateBadgeProps {
  item: ExtractedDate;
}

export function DateBadge({ item }: DateBadgeProps) {
  const urgency = getUrgencyLevel(item.daysUntil);
  
  let urgencyClass = "bg-success text-white";
  if (urgency === "expired" || urgency === "red") urgencyClass = "bg-danger text-white";
  if (urgency === "amber") urgencyClass = "bg-warning text-white";

  return (
    <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">{item.type}</p>
        <p className="text-sm font-semibold text-textPrimary line-clamp-1" title={item.description}>{item.description}</p>
        <p className="text-xs text-textSecondary">{item.date}</p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${urgencyClass}`}>
        {item.daysUntil < 0 ? "Expired" : `${item.daysUntil} days left`}
      </span>
    </div>
  );
}
