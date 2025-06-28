"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Sidebar from "../../components/Sidebar";
import { toast } from "sonner";
import { useTopbar } from "@/app/components/TopbarContext";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  approximate_presence_count?: number;
  approximate_offline_count?: number;
  icon?: string | null;
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

export default function GuildDashboardPage() {
  const { id: guildId } = useParams();

  const { setContent } = useTopbar();

  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);
  const [adminGuilds, setAdminGuilds] = useState<DiscordGuild[]>([]);

  const loadingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    if (!loading && !error && !unauthorized) {
      setContent(
        <span className="text-xl font-bold text-[#00f8ff]">Dashboard</span>
      );
      return () => setContent(null);
    }
  }, [loading, error, unauthorized, setContent]);

  useEffect(() => {
    async function checkAccess() {
      if (!guildId || typeof guildId !== "string") {
        setError("Invalid guild ID.");
        setLoading(false);
        return;
      }

      loadingToastId.current = toast.loading("Loading Dashboard...", {
        duration: 999999,
      });

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
        setAdminGuilds(data.known);

        const foundGuild = data.known.find((guild) => guild.id === guildId);
        if (foundGuild) {
          setUnauthorized(false);
          setCurrentGuild(foundGuild);
        } else if (data.unknown?.some((guild) => guild.id === guildId)) {
          setUnauthorized(true);
        } else {
          setUnauthorized(true);
        }
      } catch {
        setError("Error checking access");
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [guildId]);

  useEffect(() => {
    if (!loading && loadingToastId.current !== null) {
      toast.dismiss(loadingToastId.current);
    }

    if (!loading && error) {
      toast.error(error);
    } else if (!loading && unauthorized) {
      toast.error("You are not authorized to view this page.");
    } else if (!loading && !error && !unauthorized) {
      toast.success("Successfully loaded Dashboard!");
    }
  }, [loading, error, unauthorized]);

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
          guildId={currentGuild.id}
          adminGuilds={adminGuilds}
        />
      )}

      <main className="relative z-10 flex-grow p-6 md:p-6 pl-12 md:pl-6">
        <h1 className="text-5xl font-bold mb-4 text-center md:text-left">
          Dashboard
        </h1>
        <hr className="border-gray-600 mb-6 block md:hidden" />
      </main>
    </div>
  );
}
