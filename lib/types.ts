export interface Folder {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface ExtractedDate {
  label: string;
  rawText: string;
  date: string | null; // This will be the normalizedDate
  meaning: string;
  missedConsequence: string;
  confidence: "low" | "medium" | "high";
  daysUntil: number | null; // Computed locally
}

export interface PaymentInstallment {
  installment_number: string;
  amount: string;
  due_date: string;
  status: string;
  daysUntil: number; // Computed locally
}

export interface DocumentAlert {
  priority: string;
  message: string;
}

export interface MustKnowRisk {
  title: string;
  explanation: string;
  severity: "low" | "medium" | "high";
  confidence: "low" | "medium" | "high";
}

export interface NextAction {
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export interface FraudFinding {
  issue: string;
  whyItMatters: string;
  severity: "low" | "medium" | "high";
}

export interface FraudCheck {
  status: "clean" | "review" | "suspicious";
  findings: FraudFinding[];
}

export interface FamilySafeExplanation {
  whatThisIs: string;
  whatYouMustDo: string;
  whatToBeCarefulAbout: string;
  mostImportantDate: string;
}

export interface DocumentAnalysis {
  document_type: string;
  document_title: string;
  issued_date: string;
  expiry_date: string;
  summary_simple: string;
  summary_detailed: string;
  key_terms_and_conditions: string[];
  important_dates: ExtractedDate[];
  payment_schedule: PaymentInstallment[];
  alerts: DocumentAlert[];
  risks_and_warnings: string[];
  must_know: MustKnowRisk[];
  next_actions: NextAction[];
  trust_score: number;
  risk_level: "low" | "medium" | "high";
  safety_reasons: string[];
  fraud_check: FraudCheck;
  family_explanation: FamilySafeExplanation;
  language: string;
}

export interface DocumentReminder {
  id: string;
  date: string;
  label: string;
}

export interface StoredDocument {
  id: string;
  name: string;
  category: "insurance" | "credit-card" | "contract" | "government" | "other";
  uploadedAt: string;
  fileBase64: string;
  analysis: DocumentAnalysis;
  hindiAnalysis?: DocumentAnalysis;
  soonestExpiry: string | null;
  folderId?: string;
  reminders?: DocumentReminder[];
}
