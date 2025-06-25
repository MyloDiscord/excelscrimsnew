"use client";

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
  const { guildId } = useParams();

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAccess() {
      if (typeof guildId !== "string") return;

      try {
        const res = await fetch("/api/discord/user/adminGuilds", {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          setError("Failed to fetch guilds");
          setLoading(false);
          return;
        }

        const data: AdminGuildsResponse = await res.json();

        if (data.known.some((guild) => guild.id === guildId)) {
          setUnauthorized(false);
        } else if (data.unknown?.some((guild) => guild.id === guildId)) {
          setUnauthorized(true);
        } else {
          setUnauthorized(true);
        }
      } catch (e) {
        setError("Error checking access");
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [guildId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        {error}
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        You are not an admin in this server.
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white bg-black p-6">
      Dashboard for guild: {guildId}
    </div>
  );
}
