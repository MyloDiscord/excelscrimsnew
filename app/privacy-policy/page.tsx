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

        <h2 className="text-2xl font-semibold mt-8 mb-4">Who We Are</h2>
        <p className="mb-6 text-lg leading-relaxed">
          Excel Scrims is operated by a team of passionate Fortnite players and
          event organizers. We provide a structured and secure environment for
          competitive custom games, ensuring players are matched fairly and
          transparently.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Why We Use Epic Login
        </h2>
        <p className="mb-6 text-lg leading-relaxed">
          We use Epic Account Services (AES) login to verify all players who
          join our custom matches. This prevents impersonation, helps enforce
          rules, and ensures a level playing field. No Epic credentials are
          stored — all authentication is handled securely by Epic Games.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Get Started</h2>
        <p className="mb-6 text-lg leading-relaxed">
          To participate in our scrims, simply log in with your Epic account
          below. Once verified, you&apos;ll gain access to our Discord-based
          events and leaderboard tracking.
        </p>

        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-md transition"
        >
          Log In with Epic Account
        </Link>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Need Help?</h2>
        <p className="mb-6 text-lg leading-relaxed">
          For questions or support, please join our{" "}
          <a
            href="https://discord.gg/SCRIMS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 underline"
          >
            Discord server
          </a>{" "}
          or email us at{" "}
          <a
            href="mailto:excelscrimsdiscord@gmail.com"
            className="text-red-500 underline"
          >
            excelscrimsdiscord@gmail.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
