"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocumentSubnavProps {
  id: string;
}

const tabs = [
  { label: "Overview", suffix: "" },
  { label: "Deadlines", suffix: "/dates" },
  { label: "Ask", suffix: "/ask" }
];

export function DocumentSubnav({ id }: DocumentSubnavProps) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const href = `/document/${id}${tab.suffix}`;
        const isActive = pathname === href;
        return (
          <Link
            key={tab.label}
            href={href}
            className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition ${
              isActive
                ? "bg-brand text-white"
                : "border border-slate-300 text-textPrimary hover:border-brand hover:text-brand"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
