import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

// Get base URL from environment variable, fallback to default
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://torqking-tool-selector.vercel.app";
const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || "https://www.thetorqking.com";
const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

export const metadata: Metadata = {
  title: {
    default: "Torque Tool Selector | Industrial Bolting Tool Selection | TorqKing",
    template: "%s | TorqKing"
  },
  description: "Select the right torque tool or hydraulic bolt tensioner for your industrial bolting application. Expert recommendations for aerospace, oil & gas, mining, petrochemical, refineries, railway, manufacturing, and wind energy industries.",
  keywords: [
    "torque tool selector",
    "industrial bolting tools",
    "hydraulic torque wrench",
    "battery torque tool",
    "electric torque wrench",
    "pneumatic torque tool",
    "bolt tensioner",
    "torque tool rental",
    "industrial bolting",
    "flange bolting",
    "aerospace bolting",
    "oil and gas bolting",
    "mining bolting",
    "petrochemical bolting",
    "refinery bolting",
    "railway bolting",
    "wind energy bolting",
    "RAD torque tools",
    "TorsionX hydraulic",
    "B-RAD",
    "DB-RAD",
    "E-RAD",
    "torque tool selection"
  ],
  authors: [{ name: "TorqKing" }],
  creator: "TorqKing",
  publisher: "TorqKing",
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "TorqKing",
    title: "Torque Tool Selector | Industrial Bolting Tool Selection",
    description: "Select the right torque tool or hydraulic bolt tensioner for your industrial bolting application. Expert recommendations for aerospace, oil & gas, mining, petrochemical, refineries, railway, manufacturing, and wind energy industries.",
    images: [
      {
        url: `${baseUrl}/torqking-logo.png.png`,
        width: 1200,
        height: 630,
        alt: "TorqKing Torque Tool Selector"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Torque Tool Selector | Industrial Bolting Tool Selection",
    description: "Select the right torque tool or hydraulic bolt tensioner for your industrial bolting application.",
    images: [`${baseUrl}/torqking-logo.png.png`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: googleVerification
    ? {
        google: googleVerification
      }
    : undefined
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="canonical" href={baseUrl} />
      </head>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  );
}
