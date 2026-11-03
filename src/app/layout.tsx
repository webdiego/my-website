import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata = {
  title: "Diego Massarini",
  description: "Curious developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${mono.variable}`}>
        {children}
        <div className="grain" aria-hidden />
        <Analytics />
        <SpeedInsights />

        <Script
          src="https://analytics.eu.umami.is/script.js"
          data-website-id="8612eba9-e3c6-4f3f-9a64-a1128144c3ba"
        />
      </body>
    </html>
  );
}
