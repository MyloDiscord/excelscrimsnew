"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { GridBackgroundDemo } from "@/components/ui/grid-background";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";

type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions: string;
  features?: string[];
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

type ErrorResponse = {
  message?: string;
};

type GetTokenResponse = {
  me: { accessToken: string }[];
};

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [message, setMessage] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminGuilds, setAdminGuilds] = useState<AdminGuildsResponse>({
    known: [],
  });
  const [isLoadingGuilds, setIsLoadingGuilds] = useState<boolean>(true);
  const [loadingGuildId, setLoadingGuildId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setMessage("You are not logged in!");
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch("/api/discord/getToken", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data: GetTokenResponse | ErrorResponse = await response.json();

        if (
          response.ok &&
          "me" in data &&
          Array.isArray(data.me) &&
          data.me[0]?.accessToken
        ) {
          setAccessToken(data.me[0].accessToken);
        } else {
          const err = data as ErrorResponse;
          console.error(
            "Error fetching token:",
            err.message ?? "Unknown error"
          );
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if (isSignedIn) fetchToken();
  }, [isSignedIn]);

  useEffect(() => {
    const fetchAdminGuilds = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("/api/discord/user/adminGuilds", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data: AdminGuildsResponse | ErrorResponse = await response.json();

        if (response.ok && "known" in data) {
          setAdminGuilds(data);
          setIsLoadingGuilds(false);
          console.log(data.known.map((guild) => guild.id));
        } else {
          const err = data as ErrorResponse;
          console.error(
            "Error fetching admin guilds:",
            err.message ?? "Unknown error"
          );
        }
      } catch (error) {
        console.error("Failed to fetch admin guilds:", error);
      }
    };

    fetchAdminGuilds();
  }, [accessToken]);

  const handleDashboardClick = (guildId: string) => {
    setLoadingGuildId(guildId);
    router.push(`/dashboard/${guildId}`);
  };

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-[#121212] flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GridBackgroundDemo />
        </div>
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GridBackgroundDemo />
        </div>
        <p className="text-white text-lg z-10">{message}</p>
        <button
          className="z-10 mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg shadow-lg font-semibold transition duration-300"
          onClick={() => router.push("/")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <GridBackgroundDemo />
      </div>

      {isLoadingGuilds ? (
        <div className="flex flex-col items-center gap-3 text-red-500 z-10">
          <ClipLoader color="#FF4B3E" size={40} />
          <p className="text-lg">Loading your servers...</p>
        </div>
      ) : adminGuilds.known.length === 0 ? (
        <p className="text-gray-400 text-xl mt-12 z-10">
          No admin guilds found.
        </p>
      ) : (
        <section className="w-full max-w-7xl flex flex-wrap justify-center gap-8 z-10">
          {adminGuilds.known.map((guild) => (
            <GuildCard
              key={guild.id}
              guild={guild}
              loadingGuildId={loadingGuildId}
              onClick={() => handleDashboardClick(guild.id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

type GuildCardProps = {
  guild: DiscordGuild;
  loadingGuildId: string | null;
  onClick: () => void;
};

function GuildCard({ guild, loadingGuildId, onClick }: GuildCardProps) {
  const isLoading = loadingGuildId === guild.id;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? onClick() : null)}
      className="w-64 bg-[#1a1a1a] rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transition-transform transform hover:-translate-y-1 hover:scale-105 text-center select-none"
    >
      <div className="p-6 flex flex-col items-center">
        <Image
          src={
            guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : "/default-guild-icon.png"
          }
          alt={guild.name}
          width={96}
          height={96}
          className="rounded-full mb-4 border-2"
          priority
        />
        <h4 className="text-lg font-bold mb-3 truncate text-white">
          {guild.name}
        </h4>

        <button
          disabled={isLoading}
          className={`mt-2 w-full py-2 rounded-xl font-semibold text-white transition-colors duration-300 ${
            isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 active:scale-95 shadow-md"
          }`}
        >
          {isLoading ? <ClipLoader color="#FFF" size={20} /> : "Dashboard"}
        </button>
      </div>
    </div>
  );
}