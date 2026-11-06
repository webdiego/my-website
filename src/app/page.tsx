import Hero from "@/components/Hero";
import type { Metadata, Viewport } from "next";
import { contacts } from "@/data/contacts";
import { SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: "Diego Massarini",
  description:
    "Diego Massarini: Italian developer driven by curiosity, creativity and an eye for details.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    other: { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#fff" },
  },
  // share cards (LinkedIn, X, Slack); the image itself comes from app/opengraph-image.jpg
  openGraph: {
    type: "website",
    title: "Diego Massarini",
    description: "Developer driven by curiosity, creativity and an eye for details.",
    siteName: "Diego Massarini",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/site.webmanifest",
  other: { "msapplication-TileColor": "#12110f" },
};

export const viewport: Viewport = { themeColor: "#12110f" };

// lets search engines tie the name to the profiles below
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Diego Massarini",
  url: SITE_URL,
  jobTitle: "Frontend developer",
  address: { "@type": "PostalAddress", addressCountry: "IT" },
  sameAs: contacts.map((c) => c.url),
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Hero />
    </>
  );
}
