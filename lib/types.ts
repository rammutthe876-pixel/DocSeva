export interface Folder {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
}

export interface ExtractedDate {
  type: string;
  date: string;
  description: string;
  daysUntil: number; // Computed locally
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
