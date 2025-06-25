import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { HeaderProvider, useHeader } from "../app/components/HeaderContext";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";

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
  icons: {
    icon: "/Scrims.png",
  },
};

function Header() {
  const { headerText } = useHeader();

  return (
    <header className="flex justify-between items-center p-4 gap-4 bg-[#0d0d0d] text-white">
      <h1 className="text-xl font-semibold">{headerText}</h1>
      <div className="flex items-center gap-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <HeaderProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <Header />
            <div className="flex-grow">{children}</div>

            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </HeaderProvider>
    </ClerkProvider>
  );
}
