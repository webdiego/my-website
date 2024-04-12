import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuroraBackground } from "@/components/AuroraBackground";
import Script from "next/script";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Diego Massarini",
  description: "Web | Mobile developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
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
