"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { GridBackgroundDemo } from "@/components/ui/grid-background";

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
        <GridBackgroundDemo />
      </div>
    </div>
  );
}
