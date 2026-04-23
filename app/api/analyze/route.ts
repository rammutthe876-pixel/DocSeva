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
  "summary_simple": "string (A plain-language summary for a normal user. Write exactly 5 short, clear, and meaningful bullet points joined by newlines. Focus on what this document is, what it does, what the user should know, and what may matter later. Avoid repeating the same idea. Do not use legal jargon unless necessary. If something is uncertain, say so briefly.)",
  "summary_detailed": "string (A more context-rich version of the 5 bullets above, still in clear language.)",
  "key_terms_and_conditions": ["string", "string"],
  "important_dates": [
    {
      "label": "Renewal due date",
      "rawText": "Premium must be paid before 14 June 2026",
      "normalizedDate": "2026-06-14",
      "meaning": "Last date to pay premium before renewal lapse",
      "missedConsequence": "Policy may enter a grace period and later lapse if payment is not made.",
      "confidence": "high"
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
  "must_know": [
    {
      "title": "short risk title",
      "explanation": "clear explanation",
      "severity": "low / medium / high",
      "confidence": "low / medium / high"
    }
  ],
  "next_actions": [
    {
      "action": "Pay the premium before 14 June 2026",
      "reason": "Missing this may interrupt coverage",
      "priority": "high"
    }
  ],
  "trust_score": 72,
  "risk_level": "low / medium / high",
  "safety_reasons": [
    "The payment obligations are clearly stated.",
    "The exclusions section is broad and may limit claims.",
    "The cancellation terms are not explained clearly."
  ],
  "fraud_check": {
    "status": "clean / review / suspicious",
    "findings": [
      {
        "issue": "Issuer identity is not clearly stated",
        "whyItMatters": "This makes the document harder to verify",
        "severity": "medium"
      }
    ]
  },
  "family_explanation": {
    "whatThisIs": "This is a health insurance policy.",
    "whatYouMustDo": "Pay the premium on time and keep your policy details safe.",
    "whatToBeCarefulAbout": "Some illnesses and situations may not be covered.",
    "mostImportantDate": "14 June 2026"
  },
  "claim_readiness": {
    "likelyNeeded": ["ID proof", "policy number", "hospital bills"],
    "deadlines": ["Claim must be filed within 30 days if stated"],
    "rejectionRisks": ["Missing supporting documents may delay or reject the claim"]
  },
  "pocket_brief": {
    "whatItIs": "Health Policy",
    "whatToDo": "Keep premium paid",
    "nextDate": "2026-06-14",
    "mainRisk": "No coverage for pre-existing diseases",
    "status": "safe"
  },
  "missing_info": [
    {
      "issue": "The issuer contact details are not clearly visible",
      "whyItMatters": "Difficult to verify or seek support",
      "severity": "medium"
    }
  ],
  "recommended_questions": [
    "What happens if I miss the payment date?",
    "What is not covered in this document?",
    "Can this be cancelled early?",
    "What is the most important deadline here?"
  ],
  "language": "English"
}

Rules:
1. POCKET BRIEF: Generate a compact pocket brief. Focus only on what matters most.
2. MISSING INFORMATION: Identify what important information appears to be missing, unclear, incomplete, or hard to verify. Focus on missing dates, vague obligations, incomplete identity details.
3. RECOMMENDED QUESTIONS: Generate exactly 4 useful follow-up questions a normal user should ask to uncover risk, deadlines, and consequences.
4. CLAIM READINESS: Identify required documents and rejection risks for future submissions.
5. FAMILY-FRIENDLY EXPLANATION: Explain simply for a family member.
6. FRAUD & SUSPICIOUS PATTERN REVIEW: Review for deceptive patterns.
7. CONSUMER SAFETY EVALUATION: Score 0-100 for safety and clarity.
8. NEXT ACTIONS: Identify exactly 3 practical next actions.
9. MUST KNOW RISKS: Identify exactly 3 important risks or traps.
10. DATE EXTRACTION: Extract all important dates and consequences. Normalize to YYYY-MM-DD.
11. ERROR HANDLING: If data is missing, return empty arrays. Do NOT fabricate information.`;

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
      "label": "नविकरण की तारीख (Renewal due date)",
      "rawText": "Premium must be paid before 14 June 2026",
      "normalizedDate": "2026-06-14",
      "meaning": "पॉलिसी जारी रखने के लिए प्रीमियम भरने की अंतिम तारीख",
      "missedConsequence": "पॉलिसी बंद हो सकती है और कवर खत्म हो सकता है।",
      "confidence": "high"
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
  "must_know": [
    {
      "title": "जोखिम का शीर्षक",
      "explanation": "स्पष्ट विवरण",
      "severity": "low / medium / high",
      "confidence": "low / medium / high"
    }
  ],
  "next_actions": [
    {
      "action": "14 जून 2026 से पहले प्रीमियम भरें",
      "reason": "देरी होने पर कवर रुक सकता है",
      "priority": "high"
    }
  ],
  "trust_score": 72,
  "risk_level": "low / medium / high",
  "safety_reasons": [
    "भुगतान की शर्तें स्पष्ट हैं।",
    "छूट अनुभाग बहुत व्यापक है।",
    "रद्दीकरण की शर्तें स्पष्ट नहीं हैं।"
  ],
  "fraud_check": {
    "status": "clean / review / suspicious",
    "findings": [
      {
        "issue": "जारीकर्ता की पहचान स्पष्ट नहीं है",
        "whyItMatters": "इसे सत्यापित करना कठिन है",
        "severity": "medium"
      }
    ]
  },
  "family_explanation": {
    "whatThisIs": "यह एक स्वास्थ्य बीमा पॉलिसी है।",
    "whatYouMustDo": "समय पर प्रीमियम भरें और कागज संभाल कर रखें।",
    "whatToBeCarefulAbout": "कुछ बीमारियां शायद इसमें कवर न हों।",
    "mostImportantDate": "14 जून 2026"
  },
  "language": "Hindi"
}

Rules:
1. NATURAL HINDI: Do not perform literal legal translation. Use simple, natural Hindi that a common person can understand. 
2. FAITHFUL MEANING: Keep the meaning faithful to the document. 
3. FOCUS: Prioritize summary, risks, actions, and dates.
4. CONSUMER SAFETY: Evaluate the document honestly for a Hindi-speaking user.
5. ERROR HANDLING: If data is missing, return "Not Found" or empty arrays. Do NOT fabricate information.`;

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
        const date = item?.normalizedDate ? String(item.normalizedDate) : null;
        return {
          label: String(item?.label || "Deadline"),
          rawText: String(item?.rawText || ""),
          date: date,
          meaning: String(item?.meaning || ""),
          missedConsequence: String(item?.missedConsequence || "Not clearly stated in the document."),
          confidence: (item?.confidence === "high" || item?.confidence === "medium" || item?.confidence === "low") ? item.confidence : "medium",
          daysUntil: date ? computeDaysUntil(date) : null
        };
      })
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
    must_know: Array.isArray(raw.must_know) ? raw.must_know.map((m: any) => ({
      title: String(m?.title || ""),
      explanation: String(m?.explanation || ""),
      severity: (m?.severity === "high" || m?.severity === "medium" || m?.severity === "low") ? m.severity : "medium",
      confidence: (m?.confidence === "high" || m?.confidence === "medium" || m?.confidence === "low") ? m.confidence : "medium"
    })) : [],
    next_actions: Array.isArray(raw.next_actions) ? raw.next_actions.map((n: any) => ({
      action: String(n?.action || ""),
      reason: String(n?.reason || ""),
      priority: (n?.priority === "high" || n?.priority === "medium" || n?.priority === "low") ? n.priority : "medium"
    })) : [],
    trust_score: typeof raw.trust_score === "number" ? raw.trust_score : 50,
    risk_level: (raw.risk_level === "high" || raw.risk_level === "medium" || raw.risk_level === "low") ? raw.risk_level : "medium",
    safety_reasons: Array.isArray(raw.safety_reasons) ? raw.safety_reasons.map(String) : [],
    fraud_check: {
      status: (raw.fraud_check as any)?.status === "suspicious" ? "suspicious" : (raw.fraud_check as any)?.status === "review" ? "review" : "clean",
      findings: Array.isArray((raw.fraud_check as any)?.findings) ? (raw.fraud_check as any).findings.map((f: any) => ({
        issue: String(f?.issue || ""),
        whyItMatters: String(f?.whyItMatters || ""),
        severity: (f?.severity === "high" || f?.severity === "medium" || f?.severity === "low") ? f.severity : "medium"
      })) : []
    },
    family_explanation: {
      whatThisIs: String((raw.family_explanation as any)?.whatThisIs || ""),
      whatYouMustDo: String((raw.family_explanation as any)?.whatYouMustDo || ""),
      whatToBeCarefulAbout: String((raw.family_explanation as any)?.whatToBeCarefulAbout || ""),
      mostImportantDate: String((raw.family_explanation as any)?.mostImportantDate || "")
    },
    claim_readiness: {
      likelyNeeded: Array.isArray((raw.claim_readiness as any)?.likelyNeeded) ? (raw.claim_readiness as any).likelyNeeded.map(String) : [],
      deadlines: Array.isArray((raw.claim_readiness as any)?.deadlines) ? (raw.claim_readiness as any).deadlines.map(String) : [],
      rejectionRisks: Array.isArray((raw.claim_readiness as any)?.rejectionRisks) ? (raw.claim_readiness as any).rejectionRisks.map(String) : []
    },
    pocket_brief: {
      whatItIs: String((raw.pocket_brief as any)?.whatItIs || ""),
      whatToDo: String((raw.pocket_brief as any)?.whatToDo || ""),
      nextDate: (raw.pocket_brief as any)?.nextDate ? String((raw.pocket_brief as any).nextDate) : null,
      mainRisk: String((raw.pocket_brief as any)?.mainRisk || ""),
      status: (raw.pocket_brief as any)?.status === "urgent" ? "urgent" : (raw.pocket_brief as any)?.status === "watch" ? "watch" : "safe"
    },
    missing_info: Array.isArray(raw.missing_info) ? raw.missing_info.map((m: any) => ({
      issue: String(m?.issue || ""),
      whyItMatters: String(m?.whyItMatters || ""),
      severity: (m?.severity === "high" || m?.severity === "medium" || m?.severity === "low") ? m.severity : "medium"
    })) : [],
    recommended_questions: Array.isArray(raw.recommended_questions) ? raw.recommended_questions.map(String).slice(0, 4) : [],
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
    const mode = body.mode === "qa" ? "qa" : body.mode === "compare" ? "compare" : "analysis";
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

      const qaPrompt = `Answer the user’s question using ONLY the document provided.
Question: ${question}

Instructions:
- Answer only from the document.
- If the answer is not clearly available, say that clearly.
- Be direct and practical.
- Quote or refer to the supporting part briefly if possible.
- Do not invent clauses.

Return ONLY a valid JSON object with this exact structure:
{
  "answer": "your answer here",
  "confidence": "low|medium|high",
  "support": "short supporting reference from the document or explanation that it was not clearly found"
}
`;
      const rawText = await generateGeminiContent(process.env.GEMINI_API_KEY!, base64, qaPrompt, true, category);
      const cleaned = cleanJsonText(rawText);
      
      try {
        const parsed = JSON.parse(cleaned);
        return NextResponse.json(parsed, { status: 200 });
      } catch (error) {
        return NextResponse.json({ 
          answer: cleaned || "We could not extract a clear answer.", 
          confidence: "low",
          support: "AI response was not in expected format"
        }, { status: 200 });
      }
    }

    if (mode === "compare") {
      const base64B = typeof body.base64B === "string" ? body.base64B : "";
      if (!base64 || !base64B) {
        return NextResponse.json({ error: "Two documents are required for comparison." }, { status: 400 });
      }

      const comparePrompt = `Compare these two documents for a user choosing between them.
Compare coverage/benefits, obligations, fees, exclusions, deadlines, penalties, and user risk.
Highlight meaningful differences only. End with a practical recommendation.

Return ONLY a valid JSON object with this exact structure:
{
  "summary": "short overall comparison",
  "differences": [
    {
      "topic": "Cancellation",
      "documentA": "short point",
      "documentB": "short point",
      "winner": "A / B / unclear"
    }
  ],
  "recommendation": "practical recommendation"
}
`;

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
      
      const result = await model.generateContent([
        comparePrompt,
        { inlineData: { data: base64, mimeType: "application/pdf" } },
        { inlineData: { data: base64B, mimeType: "application/pdf" } }
      ]);

      const rawText = result.response.text();
      return NextResponse.json(JSON.parse(cleanJsonText(rawText)), { status: 200 });
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
