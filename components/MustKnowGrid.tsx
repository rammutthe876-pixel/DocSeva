import type { DocumentAlert } from "@/lib/types";

interface MustKnowGridProps {
  alerts: DocumentAlert[];
  risks: string[];
  isHindi?: boolean;
}

export function MustKnowGrid({ alerts, risks, isHindi = false }: MustKnowGridProps) {
  if (alerts.length === 0 && risks.length === 0) return null;

  return (
    <section className="space-y-6">
      {alerts.length > 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-danger">
                {isHindi ? "अलर्ट" : "Action Alerts"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-textPrimary">
                {isHindi ? "तुरंत ध्यान दें" : "Requires Attention"}
              </h2>
            </div>
            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-danger">
              {alerts.length} alerts
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {alerts.map((alert, index) => {
              const priorityClass =
                alert.priority.toLowerCase() === "high"
                  ? "border-danger/30 bg-danger/5 text-danger"
                  : alert.priority.toLowerCase() === "medium"
                  ? "border-warning/30 bg-warning/5 text-warning"
                  : "border-brand/30 bg-brand/5 text-brand";

              return (
                <article
                  key={`alert-${index}`}
                  className={`rounded-[1.5rem] border p-5 ${priorityClass}`}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.1em] opacity-80">
                    {alert.priority} Priority
                  </p>
                  <p className="mt-2 text-sm font-medium leading-6 opacity-90">{alert.message}</p>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {risks.length > 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-warning">
                {isHindi ? "सावधानी" : "Risk Radar"}
              </p>
              <h2 className="mt-2 font-display text-3xl text-textPrimary">
                {isHindi ? "ज़रूर जानें" : "Must know before you act"}
              </h2>
            </div>
            <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-warning">
              {risks.length} risks
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {risks.map((item, index) => (
              <article
                key={`risk-${index}`}
                className="rounded-[1.5rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffbeb_100%)] p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-warning">
                  {isHindi ? `बिंदु ${index + 1}` : `Risk ${index + 1}`}
                </p>
                <p className="mt-3 text-sm leading-6 text-textPrimary">{item}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
