"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DocumentSubnav } from "@/components/DocumentSubnav";
import { QAPanel } from "@/components/QAPanel";
import { getDocument } from "@/lib/storage";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import type { StoredDocument } from "@/lib/types";

const quickPrompts = [
  "Does this document mention a grace period?",
  "What happens if I miss the payment date?",
  "Does this policy clearly list exclusions?",
  "Is there any claim deadline in this document?"
];

export default function DocumentAskPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<StoredDocument | null>(null);

  useEffect(() => {
    const existing = getDocument(params.id);
    if (!existing) {
      router.replace("/vault");
      return;
    }

    setDocument(existing);
  }, [params.id, router]);

  if (!document) {
    return null;
  }

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

        <div className="mt-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
            {getCategoryLabel(document.category)}
          </p>
          <h1 className="mt-3 break-words font-display text-4xl text-textPrimary sm:text-5xl">
            Ask Doc
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-textSecondary">
            Use the AI workspace to ask direct questions about {document.name}, uploaded on {formatDate(document.uploadedAt)}.
          </p>

          <DocumentSubnav id={document.id} />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <section className="rounded-[2rem] border border-slate-200 bg-[#0f172a] p-6 text-white shadow-sm sm:p-7">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">Question prompts</p>
            <h2 className="mt-3 font-display text-4xl">Guide the user with examples.</h2>
            <p className="mt-3 text-base leading-7 text-slate-300">
              Research-wise, document AI feels much stronger when the interface helps people ask useful questions instead
              of leaving them with an empty box.
            </p>

            <div className="mt-6 space-y-3">
              {quickPrompts.map((prompt) => (
                <div key={prompt} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-200">
                  {prompt}
                </div>
              ))}
            </div>
          </section>

          <QAPanel 
            base64={document.fileBase64} 
            recommendedQuestions={document.analysis.recommended_questions} 
          />
        </div>
      </section>
    </main>
  );
}
