import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/seo";
import CanonicalRedirect from "@/components/CanonicalRedirect";
import { SHOW_CBSE } from "@/lib/config";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SHOW_CBSE
      ? "Oxford Grammar School — CBSE School in Marikal, Telangana"
      : "Oxford Grammar School — School in Marikal, Telangana",
    template: "%s · Oxford Grammar School",
  },
  description: SHOW_CBSE
    ? "Oxford Grammar School, Marikal — a CBSE-affiliated school nurturing curious, confident, future-ready children. Admissions open for 2026–27."
    : "Oxford Grammar School, Marikal — a school nurturing curious, confident, future-ready children. Admissions open for 2026–27.",
  keywords: SHOW_CBSE
    ? ["Oxford Grammar School", "Oxford Grammar School Marikal", "CBSE school Marikal", "school in Marikal", "Marikal Telangana school", "CBSE admissions Marikal"]
    : ["Oxford Grammar School", "Oxford Grammar School Marikal", "school in Marikal", "Marikal Telangana school", "admissions Marikal"],
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: SHOW_CBSE ? "Oxford Grammar School — CBSE, Marikal" : "Oxford Grammar School — Marikal",
    description: SHOW_CBSE
      ? "Future-ready CBSE education in Marikal, Telangana. Admissions open 2026–27."
      : "Future-ready education in Marikal, Telangana. Admissions open 2026–27.",
    url: SITE_URL,
    siteName: "Oxford Grammar School",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Oxford Grammar School",
  alternateName: "Oxford Grammar School Marikal",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SHOW_CBSE ? "A CBSE-affiliated school in Marikal, Telangana." : "A school in Marikal, Telangana.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Marikal",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a1f3c",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="grain">
        <CanonicalRedirect />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
