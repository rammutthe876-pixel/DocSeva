import { DateBadge } from "@/components/DateBadge";
import type { ExtractedDate, PaymentInstallment } from "@/lib/types";

interface DeadlinePanelProps {
  dates: ExtractedDate[];
  payments: PaymentInstallment[];
}

export function DeadlinePanel({ dates = [], payments = [] }: DeadlinePanelProps) {
  const hasDates = dates.length > 0;
  const hasPayments = payments.length > 0;

  if (!hasDates && !hasPayments) {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Deadline Center</p>
          <h2 className="mt-2 font-display text-3xl text-textPrimary">No dates found</h2>
        </div>
        <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-base leading-7 text-textSecondary">
            This document may be informational only, or its dates and payment schedules may not be explicitly written in the PDF.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {hasDates && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Important Dates</p>
              <h2 className="mt-2 font-display text-3xl text-textPrimary">Deadlines & Renewals</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">
              {dates.length} events
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {dates.map((item, index) => (
              <DateBadge key={`date-${index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {hasPayments && (
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-success">Payment Schedule</p>
              <h2 className="mt-2 font-display text-3xl text-textPrimary">Premiums & Installments</h2>
            </div>
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-success">
              {payments.length} payments
            </span>
          </div>

          <div className="grid gap-4">
            {payments.map((payment, index) => (
              <div key={`payment-${index}`} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-textSecondary">
                    Installment {payment.installment_number || (index + 1)}
                  </p>
                  <p className="mt-1 text-xl font-bold text-textPrimary">{payment.amount}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-textPrimary">Due: {payment.due_date}</p>
                    <p className="text-xs text-textSecondary capitalize">{payment.status}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${payment.daysUntil < 0 ? "bg-danger text-white" : payment.daysUntil <= 15 ? "bg-warning text-white" : "bg-success/15 text-success"}`}>
                    {payment.daysUntil < 0 ? "Overdue" : `${payment.daysUntil} days left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
