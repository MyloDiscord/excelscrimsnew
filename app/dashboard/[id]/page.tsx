"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  approximate_presence_count?: number;
  approximate_offline_count?: number;
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

export default function GuildDashboardPage() {
  const { id: guildId } = useParams();

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (!guildId || typeof guildId !== "string") {
        console.warn("guildId is invalid:", guildId);
        setError("Invalid guild ID.");
        setLoading(false);
        return;
      }

      console.log("Checking access for guildId:", guildId);

      try {
        const res = await fetch("/api/discord/user/adminGuilds", {
          headers: { "Content-Type": "application/json" },
        });

        console.log("API response status:", res.status);

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch guilds, response text:", text);
          setError("Failed to fetch guilds");
          setLoading(false);
          return;
        }

        const data: AdminGuildsResponse = await res.json();

        console.log("Received guild data:", data);

        if (data.known.some((guild) => guild.id === guildId)) {
          console.log("User is admin of this guild");
          setUnauthorized(false);
        } else if (data.unknown?.some((guild) => guild.id === guildId)) {
          console.log("User is not admin (guild in unknown)");
          setUnauthorized(true);
        } else {
          console.log("Guild not found in known or unknown");
          setUnauthorized(true);
        }
      } catch (e) {
        console.error("Error checking access:", e);
        setError("Error checking access");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [guildId]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white text-xl overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        {error}
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white text-xl overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-[#121212] p-6 overflow-hidden">
      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-10">Dashboard for guild: {guildId}</div>
    </div>
  );
}
