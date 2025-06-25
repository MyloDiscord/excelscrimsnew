import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Excel Scrims",
  description: "Official Excel Scrims Website.",
  creator: "Mylo",
  keywords: ["excel", "scrims", "gaming", "esports", "fortnite", "tournaments"],
  icons: {
    icon: "/Scrims.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Excel Scrims",
    description: "Official Excel Scrims Website.",
    url: "https://excelscrims.com",
    siteName: "Excel Scrims",
    images: [
      {
        url: "https://excelscrims.com/Scrims.png",
        width: 800,
        height: 600,
        alt: "Excel Scrims Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Excel Scrims",
    description: "Official Excel Scrims Website.",
    images: ["https://excelscrims.com/Scrims.png"],
    creator: "@NexoScrims",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
