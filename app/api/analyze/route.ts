import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { computeDaysUntil } from "@/lib/utils";
import type { DocumentAnalysis, ExtractedDate, PaymentInstallment, DocumentAlert } from "@/lib/types";

const ENGLISH_PROMPT = `You are DocSeva, an advanced AI-powered Document Intelligence System.
Analyze the following document (e.g., insurance policy, legal agreement, contract, financial document).
Extract, interpret, and simplify the document into structured, user-friendly outputs.

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:

{
  "document_type": "string (e.g., Insurance Policy, Rental Agreement)",
  "document_title": "string",
  "issued_date": "YYYY-MM-DD or Not Found",
  "expiry_date": "YYYY-MM-DD or Not Found",
  "summary_simple": "string (Explain like the user is a beginner - very easy language)",
  "summary_detailed": "string (Include more context but still readable)",
  "key_terms_and_conditions": ["string", "string"],
  "important_dates": [
    {
      "type": "payment / renewal / deadline",
      "date": "YYYY-MM-DD",
      "description": "string"
    }
  ],
  "payment_schedule": [
    {
      "installment_number": "string",
      "amount": "string",
      "due_date": "YYYY-MM-DD",
      "status": "upcoming"
    }
  ],
  "alerts": [
    {
      "priority": "high / medium / low",
      "message": "string"
    }
  ],
  "risks_and_warnings": ["string", "string"],
  "language": "English"
}

Rules:
1. DATE EXTRACTION: Identify all relevant dates (start date, maturity, deadlines, premium dates). Normalize all dates to YYYY-MM-DD.
2. SMART DEADLINE DETECTION: Detect recurring payments (monthly, quarterly, yearly). Infer schedule if not explicitly listed.
3. TERMS & CONDITIONS: Extract only important clauses. Convert legal jargon into plain language.
4. RISK DETECTION: Highlight penalties, late fees, cancellation risks, hidden clauses.
5. ALERT GENERATION: Create actionable alerts (e.g., "Next premium due in 5 days"). Prioritize based on urgency.
6. ERROR HANDLING: If data is missing, return "Not Found" or empty arrays instead of guessing. Do NOT fabricate information.`;

const HINDI_PROMPT = `You are DocSeva, an advanced AI-powered Document Intelligence System.
Analyze the following document (e.g., insurance policy, legal agreement, contract, financial document).
Extract, interpret, and simplify the document into structured, user-friendly outputs. ALL OUTPUT MUST BE IN HINDI.

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:

{
  "document_type": "string (e.g., जीवन बीमा पॉलिसी)",
  "document_title": "string",
  "issued_date": "YYYY-MM-DD or Not Found",
  "expiry_date": "YYYY-MM-DD or Not Found",
  "summary_simple": "string (शुरुआती लोगों के लिए बहुत आसान भाषा में समझाएं)",
  "summary_detailed": "string (अधिक संदर्भ शामिल करें लेकिन पढ़ने में आसान हो)",
  "key_terms_and_conditions": ["string", "string"],
  "important_dates": [
    {
      "type": "payment / renewal / deadline",
      "date": "YYYY-MM-DD",
      "description": "string"
    }
  ],
  "payment_schedule": [
    {
      "installment_number": "string",
      "amount": "string",
      "due_date": "YYYY-MM-DD",
      "status": "upcoming"
    }
  ],
  "alerts": [
    {
      "priority": "high / medium / low",
      "message": "string"
    }
  ],
  "risks_and_warnings": ["string", "string"],
  "language": "Hindi"
}

Rules:
1. All text fields must be translated to natural, human-friendly Hindi.
2. DATE EXTRACTION: Identify all relevant dates. Normalize all dates to YYYY-MM-DD.
3. SMART DEADLINE DETECTION: Detect recurring payments.
4. TERMS & CONDITIONS: Extract only important clauses. Convert legal jargon into plain Hindi.
5. RISK DETECTION: Highlight penalties, late fees, cancellation risks.
6. ERROR HANDLING: If data is missing, return "Not Found" or empty arrays. Do NOT fabricate information.`;

function cleanJsonText(text: string): string {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeAnalysis(raw: Record<string, unknown>): DocumentAnalysis {
  const important_dates = Array.isArray(raw.important_dates)
    ? raw.important_dates.map((item: any) => {
        const date = String(item?.date ?? "");
        return {
          type: String(item?.type ?? "deadline"),
          date,
          description: String(item?.description ?? ""),
          daysUntil: computeDaysUntil(date)
        };
      }).filter((item) => !Number.isNaN(item.daysUntil))
    : [];

  const payment_schedule = Array.isArray(raw.payment_schedule)
    ? raw.payment_schedule.map((item: any) => {
        const date = String(item?.due_date ?? "");
        return {
          installment_number: String(item?.installment_number ?? ""),
          amount: String(item?.amount ?? ""),
          due_date: date,
          status: String(item?.status ?? "upcoming"),
          daysUntil: computeDaysUntil(date)
        };
      }).filter((item) => !Number.isNaN(item.daysUntil))
    : [];

  return {
    document_type: String(raw.document_type || "Unknown Document"),
    document_title: String(raw.document_title || "Untitled"),
    issued_date: String(raw.issued_date || "Not Found"),
    expiry_date: String(raw.expiry_date || "Not Found"),
    summary_simple: String(raw.summary_simple || "Summary unavailable."),
    summary_detailed: String(raw.summary_detailed || "Detailed summary unavailable."),
    key_terms_and_conditions: Array.isArray(raw.key_terms_and_conditions) ? raw.key_terms_and_conditions.map(String) : [],
    important_dates,
    payment_schedule,
    alerts: Array.isArray(raw.alerts) ? raw.alerts.map((a: any) => ({ priority: String(a?.priority || "medium"), message: String(a?.message || "") })) : [],
    risks_and_warnings: Array.isArray(raw.risks_and_warnings) ? raw.risks_and_warnings.map(String) : [],
    language: String(raw.language || "English")
  };
}

async function generateGeminiContent(apiKey: string, base64: string, promptText: string, isJson: boolean, hint?: string) {
  const cleanKey = apiKey.trim();
  const genAI = new GoogleGenerativeAI(cleanKey);
  
  const modelNames = [
    "gemini-flash-latest",
    "models/gemini-flash-latest",
    "gemini-2.5-flash",
    "models/gemini-2.5-flash",
    "gemini-1.5-flash",
    "models/gemini-1.5-flash",
    "gemini-1.5-pro",
    "models/gemini-1.5-pro",
    "gemini-pro"
  ];
  
  for (const modelName of modelNames) {
    // Try both with and without JSON config
    const configs = [isJson ? { responseMimeType: "application/json" } : {}, {}];
    for (const config of configs) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, generationConfig: config });
        const result = await model.generateContent([promptText, { inlineData: { data: base64, mimeType: "application/pdf" } }]);
        const text = result.response.text();
        if (text) return text;
      } catch (e) {
        console.warn(`SDK Fail: ${modelName}`, e);
      }
    }
  }

  // Last ditch Fetch attempt
  for (const modelName of ["gemini-flash-latest", "gemini-2.5-flash", "gemini-1.5-flash", "gemini-pro"]) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }, { inlineData: { mimeType: "application/pdf", data: base64 } }] }]
        })
      });
      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;
    } catch (e) {
      console.warn(`Fetch Fail: ${modelName}`);
    }
  }

  throw new Error("All Gemini models failed to analyze the document. Please check your API key and quotas.");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base64 = typeof body.base64 === "string" ? body.base64 : "";
    const category = body.category || "";
    const hindi = Boolean(body.hindi);
    const mode = body.mode === "qa" ? "qa" : "analysis";
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing." }, { status: 500 });
    }

    if (!base64) {
      return NextResponse.json({ error: "PDF data is required." }, { status: 400 });
    }

    if (mode === "qa") {
      if (!question) {
        return NextResponse.json({ error: "Question is required." }, { status: 400 });
      }

      const qaPrompt = `Answer this question based ONLY on the document provided: ${question}.`;
      const answer = await generateGeminiContent(process.env.GEMINI_API_KEY!, base64, qaPrompt, false, category);

      return NextResponse.json({ answer }, { status: 200 });
    }

    const prompt = hindi ? HINDI_PROMPT : ENGLISH_PROMPT;
    const rawText = await generateGeminiContent(process.env.GEMINI_API_KEY!, base64, prompt, true, category);
    const cleaned = cleanJsonText(rawText);

    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(cleaned) as Record<string, unknown>;
    } catch (error) {
      console.error("Failed to parse Gemini response:", rawText, error);
      return NextResponse.json(
        { error: "AI response could not be parsed. Please try again." },
        { status: 500 }
      );
    }

    const analysis = normalizeAnalysis(parsed);
    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error: any) {
    console.error("Analyze route failed:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong while analyzing the document." },
      { status: 500 }
    );
  }
}
