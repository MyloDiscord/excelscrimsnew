"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";
import { BackgroundBeams } from "@/components/ui/background-beams";

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

  return (
    <div className="relative min-h-screen bg-[#0e0e0e] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center text-white px-4 py-10 min-h-screen">
        {!isLoaded ? (
          <ClipLoader color="#FF0000" size={50} />
        ) : !isSignedIn ? (
          <div className="text-center space-y-4">
            <p className="text-gray-300">{message}</p>
            <button
              className="bg-[#2c262a] hover:bg-[#3a3137] text-white px-6 py-2 rounded-lg shadow-md shadow-black/50 transition-all duration-300 hover:scale-105 active:scale-95"
              onClick={() => router.push("/")}
            >
              Login
            </button>
          </div>
        ) : isLoadingGuilds ? (
          <ClipLoader color="#FF0000" size={40} />
        ) : (
          <div className="w-full max-w-6xl text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-100">
              Select a server
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {adminGuilds.known.map((guild) => (
                <GuildCard
                  key={guild.id}
                  guild={guild}
                  loadingGuildId={loadingGuildId}
                  onClick={() => handleDashboardClick(guild.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type GuildCardProps = {
  guild: DiscordGuild;
  loadingGuildId: string | null;
  onClick: () => void;
};

function GuildCard({ guild, loadingGuildId, onClick }: GuildCardProps) {
  return (
    <div className="bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2f2f2f] text-white rounded-xl p-6 w-72 flex flex-col items-center shadow-md shadow-black/40 transition-all duration-300 hover:scale-105">
      <Image
        src={
          guild.icon
            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
            : "/default-guild-icon.png"
        }
        alt={guild.name}
        width={72}
        height={72}
        className="rounded-full mb-4"
      />
      <h4 className="text-lg font-semibold mb-3">{guild.name}</h4>
      <button
        onClick={onClick}
        disabled={loadingGuildId === guild.id}
        className={`px-5 py-2 rounded-md text-white font-medium transition-all duration-300 transform active:scale-95 ${
          loadingGuildId === guild.id
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600 hover:shadow-lg hover:scale-105"
        }`}
      >
        {loadingGuildId === guild.id ? (
          <ClipLoader color="#FFFFFF" size={16} />
        ) : (
          "Dashboard"
        )}
      </button>
    </div>
  );
}
