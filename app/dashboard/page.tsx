"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import GuildCard from "../components/dashboard/GuildCard";
import { fetchUserDiscordToken } from "@/lib/fetchUserDiscordToken";
import { fetchUserAdminGuilds } from "@/lib/fetchUserAdminGuilds";
import { toast } from "sonner";

type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
  permissions: string;
  features?: string[];
  approximate_presence_count?: number;
  approximate_offline_count?: number;
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [adminGuilds, setAdminGuilds] = useState<AdminGuildsResponse>({
    known: [],
  });
  const [isLoadingGuilds, setIsLoadingGuilds] = useState<boolean>(true);
  const [loadingGuildId, setLoadingGuildId] = useState<string | null>(null);
  const [hoveredGuildId, setHoveredGuildId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  const loadingToastId = useRef<string | number | null>(null);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const token = await fetchUserDiscordToken();
      if (token) {
        setAccessToken(token);
      } else {
        console.error("Failed to get access token");
      }
    };

    if (isSignedIn) getToken();
  }, [isSignedIn]);

  useEffect(() => {
    const getGuilds = async () => {
      if (!accessToken) return;

      loadingToastId.current = toast.loading("Loading your servers...", {
        duration: 999999,
      });

      try {
        const result = await fetchUserAdminGuilds();

        if ("known" in result) {
          setAdminGuilds(result);
          setIsLoadingGuilds(false);

          if (loadingToastId.current !== null)
            toast.dismiss(loadingToastId.current);

          if (result.known.length > 0) {
            toast.success("Guilds loaded successfully!");
          } else {
            toast.info("No admin guilds found.");
          }
        } else {
          if (loadingToastId.current !== null)
            toast.dismiss(loadingToastId.current);
          toast.error("Error fetching admin guilds.");
          setIsLoadingGuilds(false);
        }
      } catch {
        if (loadingToastId.current !== null)
          toast.dismiss(loadingToastId.current);
        toast.error("An unexpected error occurred loading your servers.");
        setIsLoadingGuilds(false);
      }
    };

    getGuilds();
  }, [accessToken]);

  const handleDashboardClick = (guildId: string) => {
    setLoadingGuildId(guildId);
    router.push(`/dashboard/${guildId}`);
  };

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen bg-[#121212] flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <BackgroundBeams />
        </div>
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center text-center overflow-hidden px-4">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <BackgroundBeams />
        </div>
        <p className="text-white text-lg z-10">You are not logged in!</p>
        <SignInButton mode="modal">
          <button
            className="
              z-10 mt-6 px-8 py-3 rounded-xl font-semibold
              border-2 border-[#FF4B3E] bg-white/5 text-[#FF4B3E]
              shadow-md backdrop-blur-sm
              transition-all duration-200
              hover:bg-[#FF4B3E]/10 hover:text-white hover:border-white
              focus:outline-none focus:ring-2 focus:ring-[#FF4B3E]/50
              active:scale-95
              flex items-center gap-2
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a4 4 0 114 0v2M12 19a7 7 0 110-14 7 7 0 010 14z"
              />
            </svg>
            Sign in
          </button>
        </SignInButton>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#121212] flex flex-col justify-center items-center p-6 text-white overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <BackgroundBeams />
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
          {adminGuilds.known.map((guild) => {
            const counts = {
              online: guild.approximate_presence_count ?? 0,
              offline: guild.approximate_offline_count ?? 0,
            };

            return (
              <GuildCard
                key={guild.id}
                guild={guild}
                loadingGuildId={loadingGuildId}
                onlineCount={counts.online}
                offlineCount={counts.offline}
                onClick={() => handleDashboardClick(guild.id)}
                hoveredGuildId={hoveredGuildId}
                setHoveredGuildId={setHoveredGuildId}
                isMobile={isMobile}
              />
            );
          })}
        </section>
      )}
    </div>
  );
}
