"use client";

import { useEffect, useState } from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function Success() {
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState("Joining Discord...");

  useEffect(() => {
    const joinDiscord = async () => {
      try {
        const res = await fetch("/api/discord/join", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("Successfully joined the Discord server!");
        } else {
          setStatus("error");
          setMessage(data?.error || "Failed to join Discord server.");
        }
      } catch {
        setStatus("error");
        setMessage("Unexpected error. Please try again.");
      }
    };
    joinDiscord();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
        {status === "pending" && (
          <div className="flex items-center gap-2 text-lg text-white">
            <Loader2 className="h-5 w-5 animate-spin" />
            {message}
          </div>
        )}
        {status === "success" && (
          <div className="flex items-center gap-2 text-lg text-green-400">
            <CheckCircle2 className="h-5 w-5" />
            {message}
          </div>
        )}
        {status === "error" && (
          <div className="flex items-center gap-2 text-lg text-red-400">
            <XCircle className="h-5 w-5" />
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
