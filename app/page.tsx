"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  GridBackground,
  DotBackground,
} from "@/components/ui/grid-dot-background";

export default function HomePage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/signin");
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GridBackground
          gridSize={20}
          gridColor="#e4e4e7"
          darkGridColor="#262626"
          showFade={true}
          fadeIntensity={20}
          className="h-[500px]"
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold">Grid Background</h1>
            <p className="text-gray-600">Perfect for structured layouts</p>
          </div>
        </GridBackground>
      </div>
    </div>
  );
}
