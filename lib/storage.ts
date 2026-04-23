"use client";

import { computeDaysUntil } from "@/lib/utils";
import type { ExtractedDate, StoredDocument, Folder, DocumentReminder } from "@/lib/types";

const STORAGE_KEY = "docseva_vault";
const FOLDERS_KEY = "docseva_folders";

function readFolders(): Folder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FOLDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to read folders:", error);
    return [];
  }
}

function writeFolders(folders: Folder[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
  } catch (error) {
    console.error("Failed to save folders:", error);
  }
}

export function getAllFolders(): Folder[] {
  return readFolders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getFolder(id: string): Folder | null {
  return readFolders().find((f) => f.id === id) || null;
}

export function saveFolder(folder: Folder): void {
  const folders = readFolders();
  folders.push(folder);
  writeFolders(folders);
}

export function deleteFolder(id: string): void {
  const folders = readFolders().filter((f) => f.id !== id);
  writeFolders(folders);
}

export function updateFolder(id: string, updates: Partial<Folder>): void {
  const folders = readFolders().map((f) => f.id === id ? { ...f, ...updates } : f);
  writeFolders(folders);
}

function readVault(): StoredDocument[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as StoredDocument[];
  } catch (error) {
    console.error("Failed to read documents from localStorage:", error);
    return [];
  }
}

function writeVault(documents: StoredDocument[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error("Failed to save documents to localStorage:", error);
  }
}

function computeSoonestExpiry(dates: ExtractedDate[], reminders?: DocumentReminder[]): string | null {
  const allDates = [
    ...dates.map(item => item.date),
    ...(reminders || []).map(r => r.date)
  ];

  const validDates = allDates
    .map((dateStr) => {
      if (!dateStr) return null;
      const date = new Date(dateStr);
      return Number.isNaN(date.getTime()) ? null : dateStr;
    })
    .filter((value): value is string => Boolean(value));

  if (validDates.length === 0) {
    return null;
  }

  const futureDates = validDates.filter((date) => new Date(date).getTime() >= Date.now());
  if (futureDates.length > 0) {
    return futureDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    )[0];
  }

  return validDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
}

function withComputedFields(doc: StoredDocument): StoredDocument {
  const important_dates = (doc.analysis.important_dates ?? []).map((item) => ({
    ...item,
    daysUntil: computeDaysUntil(item.date ?? "")
  }));

  const payment_schedule = (doc.analysis.payment_schedule ?? []).map((item) => ({
    ...item,
    daysUntil: computeDaysUntil(item.due_date ?? "")
  }));

  const combinedDatesForExpiry = [
    ...important_dates,
    ...payment_schedule.map(p => ({ date: p.due_date }))
  ];

  return {
    ...doc,
    analysis: {
      ...doc.analysis,
      important_dates,
      payment_schedule
    },
    soonestExpiry: computeSoonestExpiry(combinedDatesForExpiry as any, doc.reminders)
  };
}

export function getAllDocuments(): StoredDocument[] {
  return readVault()
    .map(withComputedFields)
    .sort((a, b) => {
      if (!a.soonestExpiry && !b.soonestExpiry) {
        return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }

      if (!a.soonestExpiry) {
        return 1;
      }

      if (!b.soonestExpiry) {
        return -1;
      }

      return new Date(a.soonestExpiry).getTime() - new Date(b.soonestExpiry).getTime();
    });
}

export function getDocument(id: string): StoredDocument | null {
  const doc = readVault().find((item) => item.id === id);
  return doc ? withComputedFields(doc) : null;
}

export function saveDocument(doc: StoredDocument): void {
  const documents = readVault();
  const normalized = withComputedFields(doc);
  documents.push(normalized);
  writeVault(documents);
}

export function deleteDocument(id: string): void {
  const documents = readVault().filter((item) => item.id !== id);
  writeVault(documents);
}

export function updateDocument(id: string, updates: Partial<StoredDocument>): void {
  const documents = readVault().map((item) => {
    if (item.id !== id) {
      return item;
    }

    return withComputedFields({
      ...item,
      ...updates,
      analysis: {
        ...item.analysis,
        ...updates.analysis
      }
    });
  });

  writeVault(documents);
}
export function getExpiringDocuments() {
  const docs = getAllDocuments();
  const today = new Date();
  const next7Days = new Date();
  next7Days.setDate(today.getDate() + 7);

  return docs
    .map((doc) => {
      if (!doc.soonestExpiry) return null;
      const expiryDate = new Date(doc.soonestExpiry);
      const isExpired = expiryDate < today;
      const isExpiringSoon = expiryDate <= next7Days && !isExpired;

      if (isExpired || isExpiringSoon) {
        return {
          ...doc,
          expiryStatus: isExpired ? "expired" : ("expiring" as const),
          daysRemaining: Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        };
      }
      return null;
    })
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .sort((a, b) => {
      // Expired first, then nearest expiry
      if (a.expiryStatus === "expired" && b.expiryStatus !== "expired") return -1;
      if (a.expiryStatus !== "expired" && b.expiryStatus === "expired") return 1;
      return new Date(a.soonestExpiry!).getTime() - new Date(b.soonestExpiry!).getTime();
    });
}
