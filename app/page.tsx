"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signin");
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden flex items-center justify-center">
      {/* Animated background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-white text-center drop-shadow">
          Coming soon.
        </h1>
        <a
          href="https://discord.gg/FNCS" // change to your actual Discord invite
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-lg px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
        >
          Join Our Discord
        </a>
      </div>
    </div>
  );
}
