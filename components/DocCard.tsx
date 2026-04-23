"use client";

import Link from "next/link";
import { computeDaysUntil, getCategoryLabel, getUrgencyLevel } from "@/lib/utils";
import type { StoredDocument } from "@/lib/types";

const CATEGORY_ICONS: Record<StoredDocument["category"], string> = {
  insurance: "🛡️",
  "credit-card": "💳",
  contract: "📄",
  government: "🏛️",
  other: "📁"
};

function getBadge(daysUntil: number | null) {
  if (daysUntil === null || Number.isNaN(daysUntil)) {
    return {
      label: "No expiry",
      className: "bg-slate-100 text-slate-500"
    };
  }

  const urgency = getUrgencyLevel(daysUntil);
  if (urgency === "expired") {
    return {
      label: "EXPIRED",
      className: "bg-danger text-white"
    };
  }

  if (urgency === "red") {
    return {
      label: `${daysUntil} days left`,
      className: "bg-danger text-white"
    };
  }

  if (urgency === "amber") {
    return {
      label: `${daysUntil} days left`,
      className: "bg-warning/15 text-warning"
    };
  }

  return {
    label: `${daysUntil} days left`,
    className: "bg-success/15 text-success"
  };
}

interface DocCardProps {
  document: StoredDocument;
}

export function DocCard({ document }: DocCardProps) {
  const daysUntil = document.soonestExpiry ? computeDaysUntil(document.soonestExpiry) : null;
  const badge = getBadge(daysUntil);

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
            {CATEGORY_ICONS[document.category]}
          </div>
          <div>
            <h2 className="line-clamp-2 text-xl font-semibold text-textPrimary">{document.name}</h2>
            <p className="mt-1 text-sm text-textSecondary">{getCategoryLabel(document.category)}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badge.className}`}>
          {badge.label}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link
          href={`/document/${document.id}`}
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Overview
        </Link>
        <Link
          href={`/document/${document.id}/dates`}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-textPrimary transition hover:border-brand hover:text-brand"
        >
          Deadlines
        </Link>
      </div>
    </article>
  );
}
