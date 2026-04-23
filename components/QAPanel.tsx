"use client";

import { useState } from "react";

interface QAItem {
  question: string;
  answer: string;
}

interface QAPanelProps {
  base64: string;
}

export function QAPanel({ base64 }: QAPanelProps) {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState<QAItem[]>([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

      const data = (await response.json()) as { answer?: string; error?: string };

      if (!response.ok || !data.answer) {
        throw new Error(data.error || "We could not answer that question.");
      }

      const answerText = data.answer;
      setAnswer(answerText);
      setHistory((current) => [{ question, answer: answerText }, ...current].slice(0, 5));
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
        <p className="mt-2 text-textSecondary">
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
          className="inline-flex items-center justify-center rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Thinking…" : "Ask Question"}
        </button>
      </form>

      {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}

      {answer ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-textSecondary">Latest answer</p>
          <p className="mt-2 text-base leading-7 text-textPrimary">{answer}</p>
        </div>
      ) : null}

      {history.length > 0 ? (
        <div className="mt-6 space-y-3">
          {history.map((item, index) => (
            <div key={`${item.question}-${index}`} className="rounded-[1.5rem] border border-slate-200 p-4">
              <p className="text-sm font-semibold text-textPrimary">Q: {item.question}</p>
              <p className="mt-2 text-sm leading-6 text-textSecondary">A: {item.answer}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
