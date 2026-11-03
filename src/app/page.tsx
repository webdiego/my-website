import Hero from "@/components/Hero";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
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
  manifest: "/site.webmanifest",
  other: { "msapplication-TileColor": "#12110f" },
};

export const viewport: Viewport = { themeColor: "#12110f" };

export default function Home() {
  return <Hero />;
}
