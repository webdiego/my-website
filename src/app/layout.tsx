import "./globals.css";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AuroraBackground } from "@/components/AuroraBackground";
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
        <AuroraBackground>{children}</AuroraBackground>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
