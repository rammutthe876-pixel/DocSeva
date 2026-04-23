"use client";

import { useState } from "react";

interface QAItem {
  question: string;
  answer: string;
  confidence: "low" | "medium" | "high";
  support: string;
}

interface QAPanelProps {
  base64: string;
}

export function QAPanel({ base64 }: QAPanelProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QAItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      setError("Please ask a question first.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          mode: "qa",
          question,
          base64,
          mimeType: "application/pdf"
        })
      });

      const data = (await response.json()) as { 
        answer?: string; 
        confidence?: string; 
        support?: string;
        error?: string;
      };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "We could not answer that question.");
      }

      const newItem: QAItem = {
        question,
        answer: data.answer,
        confidence: (data.confidence as any) || "medium",
        support: data.support || ""
      };

      setHistory((current) => [newItem, ...current].slice(0, 5));
      setQuestion("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not answer that question.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Document Q&A</p>
        <h2 className="mt-2 font-display text-3xl text-textPrimary">Ask your document</h2>
        <p className="mt-2 text-sm text-textSecondary">
          Ask anything about this document and get a direct answer grounded in the PDF.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Ask anything about this document…"
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-base text-textPrimary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Thinking…" : "Ask Question"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}

      <div className="mt-8 space-y-6">
        {history.map((item, index) => (
          <div key={`${item.question}-${index}`} className="group relative rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:border-brand/30">
            <div className="flex items-start justify-between mb-3 gap-4">
              <p className="text-lg font-bold text-textPrimary leading-tight">Q: {item.question}</p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                item.confidence === 'high' ? 'bg-success/10 text-success' : 
                item.confidence === 'medium' ? 'bg-warning/10 text-warning' : 
                'bg-danger/10 text-danger'
              }`}>
                {item.confidence} confidence
              </span>
            </div>
            
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-1">Answer</p>
              <p className="text-base leading-relaxed text-textPrimary">{item.answer}</p>
            </div>

            {item.support && (
              <div className="mt-3 pl-4 border-l-2 border-brand/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Document Evidence</p>
                <p className="text-xs text-textSecondary italic">"{item.support}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
