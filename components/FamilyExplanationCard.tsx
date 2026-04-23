"use client";

import { Heart, Info, AlertCircle, Calendar } from "lucide-react";
import { FamilySafeExplanation } from "@/lib/types";

interface FamilyExplanationCardProps {
  explanation: FamilySafeExplanation;
}

export function FamilyExplanationCard({ explanation }: FamilyExplanationCardProps) {
  if (!explanation) return null;

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 h-full">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-full bg-pink-50 p-2">
          <Heart className="text-pink-500 fill-pink-500" size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-pink-500">For Family</p>
          <h2 className="mt-1 font-display text-2xl text-textPrimary">Simple Breakdown</h2>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <Info size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What is this?</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{explanation.whatThisIs}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <Info size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">What you must do</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{explanation.whatYouMustDo}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <AlertCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Be careful about</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{explanation.whatToBeCarefulAbout}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Calendar size={16} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Date to remember</p>
            <p className="mt-1 text-sm font-bold text-slate-900">{explanation.mostImportantDate}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
