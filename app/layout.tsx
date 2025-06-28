import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { useTopbar, TopbarProvider } from "./components/TopbarContext";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <TopbarProvider>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <TopbarHeader />
            <div className="flex-grow">{children}</div>
            <Toaster />
            <SpeedInsights />
            <Analytics />
          </body>
        </html>
      </TopbarProvider>
    </ClerkProvider>
  );
}

function TopbarHeader() {
  const { content } = useTopbar();
  return (
    <header className="flex justify-between items-center p-4 gap-4 bg-[#0d0d0d] text-white">
      <div>{content}</div>
      <div>
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
