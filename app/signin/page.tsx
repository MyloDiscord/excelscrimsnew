"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function LoginPage() {
  const [pending, setPending] = useState(false);

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
          <Button
            className="w-56"
            disabled={pending}
            onClick={() => setPending(true)}
          >
            {pending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <span className="mr-2 h-5 w-5 inline-block">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 71 55"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M60.104 4.552A58.823 58.823 0 0 0 46.852.458a.113.113 0 0 0-.12.056 40.724 40.724 0 0 0-1.782 3.674c-5.403-.812-10.762-.812-16.132 0a40.6 40.6 0 0 0-1.807-3.674.117.117 0 0 0-.12-.056C13.897 2.09 3.352 7.06 1.013 20.316c-.013.08.029.161.102.203A60.437 60.437 0 0 0 17.184 27.23a.112.112 0 0 0 .124-.041c1.384-1.902 2.636-3.907 3.726-5.998a.112.112 0 0 0-.06-.159 38.969 38.969 0 0 1-5.548-2.647.114.114 0 0 1-.011-.191c.373-.28.746-.566 1.096-.857a.109.109 0 0 1 .114-.013c11.619 5.315 24.163 5.315 35.74 0a.11.11 0 0 1 .116.012c.35.29.723.577 1.098.858a.114.114 0 0 1-.01.19 36.88 36.88 0 0 1-5.549 2.648.112.112 0 0 0-.06.159c1.09 2.091 2.342 4.096 3.726 5.998a.113.113 0 0 0 .124.04 60.378 60.378 0 0 0 16.07-6.711.112.112 0 0 0 .103-.202ZM23.725 36.703c-3.16 0-5.762-2.885-5.762-6.445 0-3.56 2.572-6.446 5.762-6.446 3.21 0 5.786 2.907 5.762 6.446 0 3.56-2.572 6.445-5.762 6.445Zm23.543 0c-3.16 0-5.762-2.885-5.762-6.445 0-3.56 2.572-6.446 5.762-6.446 3.21 0 5.786 2.907 5.762 6.446 0 3.56-2.572 6.445-5.762 6.445Z"
                      fill="white"
                    />
                  </svg>
                </span>
                Login with Discord
              </>
            )}
          </Button>
        </SignInButton>
      </div>
    </div>
  );
}
