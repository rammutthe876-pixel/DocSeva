"use client";

import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface SafetyScoreCardProps {
  score: number;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
}

export function SafetyScoreCard({ score, riskLevel, reasons }: SafetyScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-success border-success/20 bg-success/5";
    if (s >= 50) return "text-warning border-warning/20 bg-warning/5";
    return "text-danger border-danger/20 bg-danger/5";
  };

  const getRiskIcon = () => {
    if (riskLevel === "low") return <ShieldCheck className="text-success" size={24} />;
    if (riskLevel === "medium") return <Shield className="text-warning" size={24} />;
    return <ShieldAlert className="text-danger" size={24} />;
  };

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7 h-full">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Safety Audit</p>
          <h2 className="mt-2 font-display text-3xl text-textPrimary">Consumer Trust</h2>
        </div>
        <div className={`flex flex-col items-center justify-center h-16 w-16 rounded-2xl border-2 font-bold ${getScoreColor(score)}`}>
          <span className="text-2xl leading-none">{score}</span>
          <span className="text-[10px] uppercase tracking-tighter opacity-70">score</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          {getRiskIcon()}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Level</p>
            <p className={`text-lg font-bold capitalize ${
              riskLevel === 'low' ? 'text-success' : riskLevel === 'medium' ? 'text-warning' : 'text-danger'
            }`}>{riskLevel} Risk</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400 pt-2">Audit Findings</p>
          {reasons.map((reason, index) => (
            <div key={index} className="flex gap-3 text-sm leading-relaxed text-slate-600">
              <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
              <p>{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
