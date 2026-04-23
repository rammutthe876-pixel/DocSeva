"use client";

import { useEffect, useState } from "react";
import { LoadingState } from "./LoadingState";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2800); // Slightly longer than the loading simulation to feel premium

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? <LoadingState /> : null}
      <div className={showSplash ? "opacity-0" : "opacity-100 transition-opacity duration-700"}>
        {children}
      </div>
    </>
  );
}
