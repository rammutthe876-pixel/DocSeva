"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { getDocument } from "@/lib/storage";
import { ComparisonResult, StoredDocument } from "@/lib/types";
import { Check, X, Scale, AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export default function ComparePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id1 = searchParams.get("id1");
  const id2 = searchParams.get("id2");

  const [docA, setDocA] = useState<StoredDocument | null>(null);
  const [docB, setDocB] = useState<StoredDocument | null>(null);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id1 || !id2) {
      router.replace("/vault");
      return;
    }

    const a = getDocument(id1);
    const b = getDocument(id2);

    if (!a || !b) {
      router.replace("/vault");
      return;
    }

    setDocA(a);
    setDocB(b);

    const performComparison = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "compare",
            base64: a.fileBase64,
            base64B: b.fileBase64
          })
        });

        if (!response.ok) throw new Error("Comparison failed");
        const data = await response.json();
        setResult(data);
      } catch (err) {
        setError("Failed to compare documents. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    performComparison();
  }, [id1, id2, router]);

  if (!docA || !docB) return null;

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

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Decision Support</p>
            <h1 className="mt-3 font-display text-5xl text-textPrimary">Doc Comparison.</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Document A</p>
              <p className="font-semibold text-textPrimary">{docA.name}</p>
            </div>
            <Scale className="text-slate-300 shrink-0" size={24} />
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Document B</p>
              <p className="font-semibold text-textPrimary">{docB.name}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
            <h2 className="mt-6 font-display text-3xl text-textPrimary">Analyzing differences...</h2>
            <p className="mt-2 text-textSecondary">Comparing terms, risks, and benefits across both documents.</p>
          </div>
        ) : error ? (
          <div className="mt-20 rounded-[2rem] border border-danger/20 bg-danger/5 p-12 text-center">
            <AlertTriangle className="mx-auto text-danger" size={48} />
            <h2 className="mt-6 font-display text-3xl text-textPrimary">Something went wrong</h2>
            <p className="mt-2 text-textSecondary">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-6 font-bold text-brand hover:underline">Try Again</button>
          </div>
        ) : result && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Overall Summary */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="rounded-full bg-brand/10 p-3 text-brand">
                  <Zap size={24} />
                </div>
                <h2 className="font-display text-3xl text-textPrimary">The Big Picture</h2>
              </div>
              <p className="text-lg leading-relaxed text-textSecondary italic">"{result.summary}"</p>
            </section>

            {/* Recommendation */}
            <section className="rounded-[2.5rem] border-2 border-brand bg-brand/5 p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <ShieldCheck className="text-brand" size={32} />
                <h2 className="font-display text-3xl text-textPrimary">Verdict</h2>
              </div>
              <p className="text-xl font-semibold text-brand leading-relaxed">{result.recommendation}</p>
            </section>

            {/* Comparison Table */}
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
              <div className="grid grid-cols-[1fr_1.5fr_1.5fr] bg-slate-50 border-b border-slate-200">
                <div className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Feature</div>
                <div className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Document A</div>
                <div className="p-6 text-xs font-bold uppercase tracking-widest text-slate-500">Document B</div>
              </div>
              <div className="divide-y divide-slate-100">
                {result.differences.map((diff, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1.5fr_1.5fr] group hover:bg-slate-50/50 transition">
                    <div className="p-6 border-r border-slate-100">
                      <p className="font-bold text-textPrimary">{diff.topic}</p>
                    </div>
                    <div className={`p-6 border-r border-slate-100 ${diff.winner === 'A' ? 'bg-success/5' : ''}`}>
                      <p className="text-sm leading-relaxed text-slate-600">{diff.documentA}</p>
                      {diff.winner === 'A' && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success uppercase">Better</span>
                      )}
                    </div>
                    <div className={`p-6 ${diff.winner === 'B' ? 'bg-success/5' : ''}`}>
                      <p className="text-sm leading-relaxed text-slate-600">{diff.documentB}</p>
                      {diff.winner === 'B' && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success uppercase">Better</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
