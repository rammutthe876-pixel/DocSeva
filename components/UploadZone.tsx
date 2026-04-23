"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { saveDocument } from "@/lib/storage";
import { fileToBase64, generateId } from "@/lib/utils";
import type { DocumentAnalysis, StoredDocument } from "@/lib/types";
import { LoadingState } from "@/components/LoadingState";

type Category = StoredDocument["category"];

const categories: { label: string; value: Category }[] = [
  { label: "Insurance", value: "insurance" },
  { label: "Credit Card", value: "credit-card" },
  { label: "Contract", value: "contract" },
  { label: "Government", value: "government" },
  { label: "Other", value: "other" }
];

export function UploadZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<Category>("insurance");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function validateFile(file: File) {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF document.");
      return false;
    }

    if (file.size > 20 * 1024 * 1024) {
      setError("File too large. Please use a PDF under 20MB.");
      return false;
    }

    setError("");
    return true;
  }

  function handleFile(file: File | null) {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
  }

  async function handleAnalyze() {
    if (!selectedFile) {
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const base64 = await fileToBase64(selectedFile);
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64,
          mimeType: "application/pdf",
          hindi: false
        })
      });

      const data = (await response.json()) as { analysis?: DocumentAnalysis; error?: string };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error || "We could not analyze this document.");
      }

      let soonestExpiry: string | null = null;
      let minDays = Infinity;
      
      data.analysis.important_dates?.forEach((d) => {
        if (d.daysUntil >= 0 && d.daysUntil < minDays) {
          minDays = d.daysUntil;
          soonestExpiry = d.date;
        }
      });
      data.analysis.payment_schedule?.forEach((p) => {
        if (p.daysUntil >= 0 && p.daysUntil < minDays) {
          minDays = p.daysUntil;
          soonestExpiry = p.due_date;
        }
      });

      const newDocument: StoredDocument = {
        id: generateId(),
        name: selectedFile.name,
        category,
        uploadedAt: new Date().toISOString(),
        fileBase64: base64,
        analysis: data.analysis,
        soonestExpiry
      };

      saveDocument(newDocument);
      router.push(`/document/${newDocument.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not analyze this document.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? <LoadingState /> : null}
      <section className="w-full rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 sm:p-8">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">Upload a document</p>
            <h2 className="mt-2 font-display text-4xl text-textPrimary">Drop a PDF and let DocSeva do the reading.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-textSecondary">
            Best for insurance policies, card agreements, contracts, government letters, and other text-heavy PDFs. Gemini 2.5 Flash analysis.
          </p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            handleFile(event.dataTransfer.files[0] ?? null);
          }}
          className={`cursor-pointer rounded-[1.75rem] border-2 border-dashed px-6 py-14 text-center transition ${
            isDragging
              ? "border-brand bg-brand/5"
              : "border-slate-300 bg-slate-50 hover:border-brand/60 hover:bg-brand/5"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
          <p className="font-display text-4xl text-textPrimary sm:text-5xl">Drop your PDF here</p>
          <p className="mt-3 text-base text-textSecondary">
            Drag and drop a file, or tap to choose a document from your device.
          </p>
          {selectedFile ? (
            <div className="mt-5 inline-flex rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
              {selectedFile.name}
            </div>
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-textPrimary">Document category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Category)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-base text-textPrimary outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            >
              {categories.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!selectedFile || isLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-brand px-6 py-3 text-base font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Analyze Document
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-[1.25rem] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Private</p>
            <p className="mt-2 text-sm leading-6 text-textPrimary">Files stay on your device except for the live Gemini analysis request.</p>
          </div>
          <div className="rounded-[1.25rem] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Fast output</p>
            <p className="mt-2 text-sm leading-6 text-textPrimary">Summary, key dates, and risks in one flow.</p>
          </div>
          <div className="rounded-[1.25rem] bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">Made for India</p>
            <p className="mt-2 text-sm leading-6 text-textPrimary">Supports Hindi summaries for better clarity.</p>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}
      </section>
    </>
  );
}
