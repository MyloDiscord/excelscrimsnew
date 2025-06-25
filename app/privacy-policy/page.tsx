"use client";

import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12 text-gray-300">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Excel Scrims
        </h1>

        <p className="mb-6 text-lg leading-relaxed">
          Excel Scrims is a community platform dedicated to organizing
          competitive Fortnite scrims. Our verification system uses Epic Account
          Services login to ensure that every player participating in our scrims
          is verified and authentic.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Why Verification Matters
        </h2>
        <p className="mb-6 text-lg leading-relaxed">
          We use Epic Account login to confirm player identities, helping us
          maintain fair competition and prevent cheating or impersonation. This
          system lets us track who is playing in our scrims accurately and
          securely.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Get Started</h2>
        <p className="mb-6 text-lg leading-relaxed">
          To participate in our scrims, simply log in with your Epic account.
          This verifies your identity and grants you access to our events and
          community features.
        </p>

        <Link href="/">
          <a className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition">
            Log In with Epic Account
          </a>
        </Link>
      </div>
    </div>
  );
}
