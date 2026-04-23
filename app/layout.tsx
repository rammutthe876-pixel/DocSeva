import type { Metadata } from "next";
import { Instrument_Serif, Noto_Sans } from "next/font/google";
import "./globals.css";
import { GlobalNotifications } from "@/components/GlobalNotifications";

const notoSans = Noto_Sans({
  subsets: ["latin", "devanagari"],
  variable: "--font-noto-sans",
  display: "swap"
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: "400",
  display: "swap"
});

export const metadata: Metadata = {
  title: "DocSeva",
  description: "AI document intelligence assistant for Indian users."
};

import { ClientLayout } from "@/components/ClientLayout";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSans.variable} ${instrumentSerif.variable} bg-white font-sans text-textPrimary antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <GlobalNotifications />
      </body>
    </html>
  );
}
