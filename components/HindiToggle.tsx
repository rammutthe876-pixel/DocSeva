"use client";

interface HindiToggleProps {
  isHindi: boolean;
  isLoading: boolean;
  onToggle: () => void;
}

export function HindiToggle({ isHindi, isLoading, onToggle }: HindiToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition ${
        isHindi
          ? "border-brand bg-brand/10 text-brand"
          : "border-slate-300 bg-white text-textPrimary hover:border-brand hover:text-brand"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {isLoading ? "Loading..." : isHindi ? "English summary" : "Hindi summary"}
    </button>
  );
}
