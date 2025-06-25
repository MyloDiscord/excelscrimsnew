"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Sidebar from "../../components/Sidebar";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  approximate_presence_count?: number;
  approximate_offline_count?: number;
  icon?: string | null; // for avatar URL if you have it
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

  // Store current guild info to pass to Sidebar
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (!guildId || typeof guildId !== "string") {
        console.warn("guildId is invalid:", guildId);
        setError("Invalid guild ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/discord/user/adminGuilds", {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const text = await res.text();
          setError("Failed to fetch guilds: " + text);
          setLoading(false);
          return;
        }

        const data: AdminGuildsResponse = await res.json();

        const foundGuild = data.known.find((guild) => guild.id === guildId);
        if (foundGuild) {
          setUnauthorized(false);
          setCurrentGuild(foundGuild);
        } else if (data.unknown?.some((guild) => guild.id === guildId)) {
          setUnauthorized(true);
        } else {
          setUnauthorized(true);
        }
      } catch (e) {
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
    <div className="relative min-h-screen text-white bg-[#121212] overflow-hidden flex">
      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />

      {currentGuild && (
        <Sidebar
          current="Dashboard"
          guildName={currentGuild.name}
          guildAvatar={
            currentGuild.icon
              ? `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`
              : null
          }
        />
      )}

      <main className="relative z-10 flex-grow p-6">
        <h1 className="text-5xl font-bold mb-4">Dashboard</h1>
        <p>Guild ID: {guildId}</p>
      </main>
    </div>
  );
}
