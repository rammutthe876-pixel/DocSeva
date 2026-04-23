"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/lib/storage";
import { computeDaysUntil } from "@/lib/utils";
import { X, BellRing, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { StoredDocument } from "@/lib/types";

export function GlobalNotifications() {
  const [expiringDocs, setExpiringDocs] = useState<{ doc: StoredDocument, days: number }[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const docs = getAllDocuments();
    const upcoming = docs.map(doc => {
      if (!doc.soonestExpiry) return null;
      const days = computeDaysUntil(doc.soonestExpiry);
      if (days >= 0 && days <= 10) {
        return { doc, days };
      }
      return null;
    }).filter((x): x is { doc: StoredDocument, days: number } => x !== null);

    setExpiringDocs(upcoming);
  }, []);

  const visibleDocs = expiringDocs.filter(x => !dismissedIds.has(x.doc.id));

  if (visibleDocs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm w-full sm:bottom-6 sm:right-6">
      {visibleDocs.slice(0, 3).map(({ doc, days }) => (
        <div key={doc.id} className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-warning/30 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="absolute left-0 top-0 w-1 h-full bg-warning" />
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 rounded-full bg-warning/10 p-1.5">
              <BellRing className="w-4 h-4 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-textPrimary">
                Expiring in {days} {days === 1 ? 'day' : 'days'}
              </p>
              <p className="mt-1 text-xs text-textSecondary truncate">
                {doc.name}
              </p>
            </div>
            <button 
              onClick={() => setDismissedIds(prev => new Set(prev).add(doc.id))} 
              className="flex-shrink-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg p-1 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Link href={`/document/${doc.id}/dates`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 transition">
            View Details <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      ))}
      {visibleDocs.length > 3 && (
        <div className="rounded-2xl bg-slate-800 text-white p-3 text-center text-xs font-medium shadow-lg animate-in fade-in">
          + {visibleDocs.length - 3} more alerts in your Vault
        </div>
      )}
    </div>
  );
}
