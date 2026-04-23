"use client";

import { AlertOctagon, Search, ShieldCheck } from "lucide-react";
import { FraudCheck } from "@/lib/types";

interface FraudCheckCardProps {
  check: FraudCheck;
}

export function FraudCheckCard({ check }: FraudCheckCardProps) {
  const getStatusConfig = () => {
    switch (check.status) {
      case "suspicious":
        return {
          icon: <AlertOctagon size={24} className="text-danger" />,
          label: "Suspicious Patterns Detected",
          colorClass: "bg-danger/10 text-danger border-danger/20",
          desc: "This document contains elements commonly associated with deceptive practices."
        };
      case "review":
        return {
          icon: <Search size={24} className="text-warning" />,
          label: "Human Review Recommended",
          colorClass: "bg-warning/10 text-warning border-warning/20",
          desc: "Some details are unverifiable or unusually vague. Exercise caution."
        };
      default:
        return {
          icon: <ShieldCheck size={24} className="text-success" />,
          label: "No Deceptive Patterns Found",
          colorClass: "bg-success/10 text-success border-success/20",
          desc: "Standard formatting and clear issuer details identified."
        };
    }
  };

  const config = getStatusConfig();

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Integrity Scan</p>
        <h2 className="mt-2 font-display text-3xl text-textPrimary">Fraud Prevention</h2>
      </div>

      <div className={`flex flex-col gap-4 rounded-[1.5rem] border p-5 ${config.colorClass}`}>
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white p-2 shadow-sm">
            {config.icon}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">{config.label}</h3>
            <p className="text-xs mt-1 opacity-80">{config.desc}</p>
          </div>
        </div>
      </div>

      {check.findings.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Scan Results</p>
          {check.findings.map((finding, index) => (
            <div key={index} className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-slate-900">{finding.issue}</p>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  finding.severity === 'high' ? 'bg-red-100 text-red-600' : 
                  finding.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 
                  'bg-sky-100 text-sky-600'
                }`}>
                  {finding.severity} severity
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{finding.whyItMatters}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
