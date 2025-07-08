"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [pending] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignInButton mode="redirect" signUpFallbackRedirectUrl="/signin/success">
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
  );
}
