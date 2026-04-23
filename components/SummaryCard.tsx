interface SummaryCardProps {
  title?: string;
  summarySimple: string;
  summaryDetailed: string;
  keyTerms: string[];
}

export function SummaryCard({
  title = "Document Overview",
  summarySimple,
  summaryDetailed,
  keyTerms
}: SummaryCardProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <h2 className="font-display text-3xl text-textPrimary">{title}</h2>
        
        <div className="mt-5 space-y-4">
          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">The Short Version</p>
            <p className="mt-2 text-base leading-7 text-textPrimary">{summarySimple || "No simple summary available."}</p>
          </div>
          
          <div className="rounded-[1.25rem] bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">More Details</p>
            <p className="mt-2 text-sm leading-7 text-textSecondary">{summaryDetailed || "No detailed summary available."}</p>
          </div>
        </div>
      </section>

      {keyTerms && keyTerms.length > 0 && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-textPrimary">Key Terms & Conditions</h2>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {keyTerms.length} terms
            </span>
          </div>
          <ul className="space-y-3 text-sm leading-6 text-textSecondary">
            {keyTerms.map((term, index) => (
              <li key={`term-${index}`} className="flex gap-4 rounded-[1.25rem] bg-slate-50 px-4 py-3">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-textPrimary">
                  {index + 1}
                </span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
