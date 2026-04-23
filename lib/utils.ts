import { v4 as uuidv4 } from "uuid";

export function computeDaysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return Number.NaN;
  }

  return Math.ceil((date.getTime() - Date.now()) / 86400000);
}

export function getUrgencyLevel(
  daysUntil: number
): "green" | "amber" | "red" | "expired" {
  if (daysUntil < 0) {
    return "expired";
  }

  if (daysUntil <= 14) {
    return "red";
  }

  if (daysUntil <= 60) {
    return "amber";
  }

  return "green";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function generateId(): string {
  return uuidv4();
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }

      const base64 = result.split(",")[1];
      if (!base64) {
        reject(new Error("Could not convert file to base64."));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Could not read file."));
    };

    reader.readAsDataURL(file);
  });
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "insurance":
      return "Insurance";
    case "credit-card":
      return "Credit Card";
    case "contract":
      return "Contract";
    case "government":
      return "Government";
    default:
      return "Other";
  }
}
