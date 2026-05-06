// src/app/layout.tsx
import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});
const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KOLI — Find Influencers in Rwanda | Kigali Creator Platform",
  description:
    "Discover and contact top content creators and influencers in Rwanda. Search fashion, food, lifestyle, comedy, tech. Connect directly via WhatsApp. No middlemen.",
  keywords:
    "influencers Rwanda, Rwanda content creators, Kigali influencers, Rwanda influencer marketing, brand collaboration Rwanda, TikTok Rwanda, Instagram Rwanda, KOLI Rwanda, influencer platform Kigali, creator economy Rwanda, East Africa influencers",
  authors: [{ name: "KOLI Rwanda" }],
  openGraph: {
    title: "KOLI — Rwanda's #1 Influencer Platform",
    description:
      "Find & contact Rwanda's top content creators. Direct WhatsApp contact. No middlemen.",
    type: "website",
    locale: "en_RW",
    siteName: "KOLI",
    images: [
      {
        url: "https://koli.netlify.app/ogimage.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KOLI — Rwanda's Influencer Platform",
    description: "Find & contact Rwanda's top creators.",
    images: ["https://koli.netlify.app/ogimage.png"],
  },
  other: {
    "geo.region": "RW-01",
    "geo.placename": "Kigali, Rwanda",
    "geo.position": "-1.9441;30.0619",
    ICBM: "-1.9441, 30.0619",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  metadataBase: new URL("https://koli.netlify.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dm.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "KOLI",
              description: "Rwanda's #1 influencer discovery platform",
              url: "https://koli.netlify.app",
              foundingLocation: { "@type": "Place", name: "Kigali, Rwanda" },
              areaServed: { "@type": "Country", name: "Rwanda" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How do I find influencers in Rwanda?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Search KOLI by category or keyword. Browse creator profiles and contact them directly on WhatsApp.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What is KOLI?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "KOLI is Rwanda's influencer discovery platform connecting brands with content creators in Kigali and across Rwanda.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How much do Rwandan influencers charge?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Micro-influencers (10k–50k followers) typically charge 30,000–100,000 RWF per campaign. Macro influencers charge 100,000–500,000 RWF.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
