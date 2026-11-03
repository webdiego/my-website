import "./globals.css";
import { Bricolage_Grotesque, Instrument_Serif } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
const sans = Bricolage_Grotesque({ subsets: ["latin"] });
// the three hovered words: an italic serif against the grotesk makes them stand out on their own
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument" });
// pixel mono for the small technical text, like type on the CRT behind it (OFL, see fonts/)
const mono = localFont({ src: "./fonts/DepartureMono-Regular.woff2", variable: "--font-departure" });

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
    // font variables go on <html>: tailwind's --font-serif/--font-mono are defined on :root and
    // must be able to see them (declared on <body> they resolve to nothing and fall back)
    <html lang="en" className={`${serif.variable} ${mono.variable}`}>
      <body className={sans.className}>
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
