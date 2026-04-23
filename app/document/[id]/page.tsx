"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { DocumentSubnav } from "@/components/DocumentSubnav";
import { HindiToggle } from "@/components/HindiToggle";
import { MustKnowGrid } from "@/components/MustKnowGrid";
import { SummaryCard } from "@/components/SummaryCard";
import { NextActionsPanel } from "@/components/NextActionsPanel";
import { SafetyScoreCard } from "@/components/SafetyScoreCard";
import { FraudCheckCard } from "@/components/FraudCheckCard";
import { FamilyExplanationCard } from "@/components/FamilyExplanationCard";
import { ClaimReadinessCard } from "@/components/ClaimReadinessCard";
import { PocketBriefCard } from "@/components/PocketBriefCard";
import { MissingInfoCard } from "@/components/MissingInfoCard";
import { deleteDocument, getDocument, updateDocument } from "@/lib/storage";
import { formatDate, getCategoryLabel } from "@/lib/utils";
import type { StoredDocument } from "@/lib/types";

export default function DocumentOverviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<StoredDocument | null>(null);
  const [isHindi, setIsHindi] = useState(false);
  const [isLoadingHindi, setIsLoadingHindi] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const existing = getDocument(params.id);
    if (!existing) {
      router.replace("/vault");
      return;
    }

    setDocument(existing);
  }, [params.id, router]);

  async function handleToggleLanguage() {
    if (!document) {
      return;
    }

    if (isHindi) {
      setIsHindi(false);
      return;
    }

    if (document.hindiAnalysis) {
      setIsHindi(true);
      return;
    }

    try {
      setIsLoadingHindi(true);
      setError("");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          base64: document.fileBase64,
          mimeType: "application/pdf",
          hindi: true
        })
      });

      const data = (await response.json()) as {
        analysis?: StoredDocument["analysis"];
        error?: string;
      };

      if (!response.ok || !data.analysis) {
        throw new Error(data.error || "We could not load the Hindi summary.");
      }

      const nextDocument: StoredDocument = {
        ...document,
        hindiAnalysis: data.analysis
      };

      updateDocument(document.id, { hindiAnalysis: nextDocument.hindiAnalysis });
      setDocument(nextDocument);
      setIsHindi(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We could not load the Hindi summary.");
    } finally {
      setIsLoadingHindi(false);
    }
  }

  function handleDelete() {
    if (!document) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure? This will remove the document and its analysis from your device."
    );

    if (!confirmed) {
      return;
    }

    deleteDocument(document.id);
    router.push("/vault");
  }

  if (!document) {
    return null;
  }

  const activeAnalysis = isHindi && document.hindiAnalysis ? document.hindiAnalysis : document.analysis;

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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
                {getCategoryLabel(document.category)} • {activeAnalysis.document_type || "Document"}
              </p>
              <h1 className="mt-3 break-words font-display text-4xl text-textPrimary sm:text-5xl">
                {activeAnalysis.document_title || document.name}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-textSecondary">
                Uploaded on {formatDate(document.uploadedAt)}.
                {activeAnalysis.issued_date && activeAnalysis.issued_date !== "Not Found" && ` Issued: ${activeAnalysis.issued_date}.`}
                {activeAnalysis.expiry_date && activeAnalysis.expiry_date !== "Not Found" && ` Expires: ${activeAnalysis.expiry_date}.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <HindiToggle
                isHindi={isHindi}
                isLoading={isLoadingHindi}
                onToggle={handleToggleLanguage}
              />
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center justify-center rounded-full border border-danger/20 bg-white px-5 py-2 text-sm font-semibold text-danger transition hover:bg-danger/5"
              >
                Delete Document
              </button>
            </div>
          </div>

          <DocumentSubnav id={document.id} />
        </div>

        {error ? <p className="mt-4 text-sm font-medium text-danger">{error}</p> : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <SummaryCard 
            title={isHindi ? "सरल सारांश" : "Plain-language summary"} 
            summarySimple={activeAnalysis.summary_simple}
            summaryDetailed={activeAnalysis.summary_detailed}
            keyTerms={activeAnalysis.key_terms_and_conditions}
          />
          <NextActionsPanel actions={activeAnalysis.next_actions} />
          <SafetyScoreCard 
            score={activeAnalysis.trust_score}
            riskLevel={activeAnalysis.risk_level}
            reasons={activeAnalysis.safety_reasons}
          />
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <FraudCheckCard check={activeAnalysis.fraud_check} />
          <FamilyExplanationCard explanation={activeAnalysis.family_explanation} />
          <ClaimReadinessCard data={activeAnalysis.claim_readiness} />
        </div>
        
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <PocketBriefCard brief={activeAnalysis.pocket_brief} />
          <MissingInfoCard items={activeAnalysis.missing_info} />
        </div>

        <div className="mt-6">
          <MustKnowGrid 
            alerts={activeAnalysis.alerts} 
            risks={activeAnalysis.risks_and_warnings} 
            mustKnow={activeAnalysis.must_know}
            isHindi={isHindi} 
          />
        </div>
      </section>
    </main>
  );
}
