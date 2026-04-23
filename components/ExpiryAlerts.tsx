"use client";

import { useEffect, useState } from "react";
import { getExpiringDocuments } from "@/lib/storage";
import Link from "next/link";
import { AlertCircle, Calendar, ChevronRight } from "lucide-react";

export function ExpiryAlerts() {
  const [expiringDocs, setExpiringDocs] = useState<any[]>([]);

  useEffect(() => {
    // Initial load
    setExpiringDocs(getExpiringDocuments());
  }, []);

  if (expiringDocs.length === 0) return null;

  return (
    <div className="mb-8 space-y-3">
      {expiringDocs.map((doc) => (
        <Link
          key={doc.id}
          href={`/document/${doc.id}`}
          className={`group flex items-center justify-between rounded-2xl border p-4 transition-all hover:shadow-md ${
            doc.expiryStatus === "expired"
              ? "border-red-100 bg-red-50/50"
              : "border-amber-100 bg-amber-50/50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                doc.expiryStatus === "expired" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
              }`}
            >
              {doc.expiryStatus === "expired" ? (
                <AlertCircle size={20} />
              ) : (
                <Calendar size={20} />
              )}
            </div>
            <div>
              <p className="font-display text-base font-semibold text-slate-900">
                {doc.name}
              </p>
              <p className={`text-sm ${
                doc.expiryStatus === "expired" ? "text-red-600" : "text-amber-700"
              }`}>
                {doc.expiryStatus === "expired"
                  ? "🔴 Document expired"
                  : `🟠 Expiring in ${doc.daysRemaining} days`}
              </p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-400 transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}
