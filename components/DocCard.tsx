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

import { Trash2, FolderInput } from "lucide-react";
import { deleteDocument, updateDocument } from "@/lib/storage";
import type { Folder } from "@/lib/types";

interface DocCardProps {
  document: StoredDocument;
  folders: Folder[];
  onRefresh: () => void;
  onToggleCompare?: (id: string) => void;
  isSelectedForCompare?: boolean;
}

export function DocCard({ document, folders, onRefresh, onToggleCompare, isSelectedForCompare }: DocCardProps) {
  const daysUntil = document.soonestExpiry ? computeDaysUntil(document.soonestExpiry) : null;
  const badge = getBadge(daysUntil);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Permanently delete this document?")) {
      deleteDocument(document.id);
      onRefresh();
    }
  };

  const handleMove = (folderId: string) => {
    updateDocument(document.id, { folderId: folderId === "none" ? undefined : folderId });
    onRefresh();
  };

  return (
    <article className={`group relative rounded-[2rem] border p-6 shadow-sm shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-lg ${
      isSelectedForCompare ? "border-brand bg-brand/5 ring-2 ring-brand/20" : "border-slate-200 bg-white"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              {CATEGORY_ICONS[document.category]}
            </div>
            {onToggleCompare && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={isSelectedForCompare}
                  onChange={() => onToggleCompare(document.id)}
                  className="w-4 h-4 accent-brand"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand">Compare</span>
              </label>
            )}
          </div>
          <div>
            <h2 className="line-clamp-2 text-xl font-semibold text-textPrimary">{document.name}</h2>
            <p className="mt-1 text-sm text-textSecondary">{getCategoryLabel(document.category)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badge.className}`}>
            {badge.label}
          </span>
          <button 
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-danger transition opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
          <FolderInput className="w-4 h-4 text-textSecondary" />
          <select 
            className="bg-transparent text-xs font-bold text-textSecondary outline-none w-full"
            value={document.folderId || "none"}
            onChange={(e) => handleMove(e.target.value)}
          >
            <option value="none">No Folder</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
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
      </div>
    </article>
  );
}
