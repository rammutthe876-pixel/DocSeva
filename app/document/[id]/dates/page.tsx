"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DeadlinePanel } from "@/components/DeadlinePanel";
import { DocumentSubnav } from "@/components/DocumentSubnav";
import { getDocument } from "@/lib/storage";
import { computeDaysUntil, formatDate, getCategoryLabel } from "@/lib/utils";
import type { StoredDocument } from "@/lib/types";

export default function DocumentDatesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<StoredDocument | null>(null);

  useEffect(() => {
    const existing = getDocument(params.id);
    if (!existing) {
      router.replace("/vault");
      return;
    }

    setDocument(existing);
  }, [params.id, router]);

  if (!document) {
    return null;
  }

  // We should default to the English one, or if they have Hindi selected elsewhere, we can't easily know here without a global state, but it's fine.
  // The dates themselves are basically English or Hindi, but dates remain dates.
  const analysis = document.hindiAnalysis || document.analysis;

  const soonestText = document.soonestExpiry
    ? `${computeDaysUntil(document.soonestExpiry)} days`
    : "No tracked date";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)]">
      <AppHeader />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Link
          href="/vault"
          className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-textPrimary transition hover:border-brand hover:text-brand"
        >
          Back to Vault
        </Link>

        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            {getCategoryLabel(document.category)}
          </p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="break-words font-display text-4xl text-textPrimary sm:text-5xl">
                Deadline Center
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-textSecondary">
                Dates extracted from {document.name}, uploaded on {formatDate(document.uploadedAt)}.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Soonest item</p>
              <p className="mt-2 text-2xl font-semibold text-textPrimary">{soonestText}</p>
            </div>
          </div>

          <DocumentSubnav id={document.id} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <DeadlinePanel 
            dates={analysis.important_dates} 
            payments={analysis.payment_schedule}
          />
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Why this page exists</p>
            <h2 className="mt-3 font-display text-3xl text-textPrimary">Deadlines deserve their own screen.</h2>
            <p className="mt-3 text-base leading-7 text-textSecondary">
              During the UI research pass, the strongest product pattern was separation of reading tasks from action tasks.
              Dates are easy to miss when they sit below a long summary, so this page makes them primary.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-sm font-semibold text-textPrimary">Red means immediate attention</p>
                <p className="mt-2 text-sm leading-6 text-textSecondary">
                  Under 15 days or already expired. This mirrors the vault so the urgency system stays consistent.
                </p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-5">
                <p className="text-sm font-semibold text-textPrimary">Numbers before color alone</p>
                <p className="mt-2 text-sm leading-6 text-textSecondary">
                  Every badge still shows the exact number of days left because the product needs to work for color-blind
                  users and low-literacy contexts.
                </p>
              </div>
              <Link
                href={`/document/${document.id}/ask`}
                className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
              >
                Ask a question about this document
              </Link>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
