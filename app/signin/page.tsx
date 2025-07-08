"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function LoginPage() {
  const [pending] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        <SignInButton
          mode="redirect"
          forceRedirectUrl="/signin/success"
          signUpForceRedirectUrl="/signin/success"
        >
          <Button className="w-56" disabled={pending}>
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <img
                  src="/discord-mark-white.svg"
                  alt="Discord"
                  className="mr-2 h-5 w-5"
                  style={{ display: "inline" }}
                />
                Login with Discord
              </>
            )}
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}
