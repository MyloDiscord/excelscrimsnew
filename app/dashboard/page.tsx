"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image"; // use Next.js Image for optimization

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

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useUser(); // removed unused 'user'
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
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (response.ok && data.me && data.me[0]?.accessToken) {
          setAccessToken(data.me[0].accessToken);
        } else {
          console.error("Error fetching token:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      }
    };

    if (isSignedIn) {
      fetchToken();
    }
  }, [isSignedIn]);

  useEffect(() => {
    const fetchAdminGuilds = async () => {
      if (!accessToken) return;

      try {
        const response = await fetch("/api/discord/user/adminGuilds", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: AdminGuildsResponse = await response.json();
        if (response.ok) {
          setAdminGuilds(data);
          setIsLoadingGuilds(false);

          const guildIds = data.known.map((guild) => guild.id);
          console.log(guildIds);
        } else {
          console.error("Error fetching admin guilds:", (data as any).message);
        }
      } catch (error) {
        console.error("Failed to fetch admin guilds:", error);
      }
    };

    if (accessToken) {
      fetchAdminGuilds();
    }
  }, [accessToken]);

  const handleDashboardClick = (guildId: string) => {
    setLoadingGuildId(guildId);
    router.push(`/dashboard/${guildId}`);
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#FF0000" size={50} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p>{message}</p>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded"
          onClick={() => router.push("/")}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
      {isLoadingGuilds ? (
        <div className="text-xl text-red-500 flex flex-col items-center">
          <ClipLoader color="#FF0000" size={40} />
        </div>
      ) : (
        <section className="w-full max-w-6xl mb-6 flex flex-col items-center">
          {adminGuilds.known.length > 0 ? (
            <>
              <h3 className="text-2xl font-semibold mb-4">
                Please select a server:
              </h3>

              {/* MOBILE */}
              <div className="flex flex-col items-center gap-6 sm:hidden overflow-y-auto max-h-[80vh] w-full">
                {adminGuilds.known.map((guild, index) => (
                  <div
                    key={guild.id}
                    className="flex flex-col justify-center items-center border p-4 rounded-lg shadow-lg w-80 transform transition-all duration-300 hover:scale-105"
                  >
                    {guild.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        width={80}
                        height={80}
                        className="rounded-full mb-4"
                      />
                    ) : (
                      <Image
                        src="/default-guild-icon.png"
                        alt="Default guild icon"
                        width={80}
                        height={80}
                        className="rounded-full mb-4"
                      />
                    )}
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">
                      {guild.name}
                    </h4>
                    <button
                      onClick={() => handleDashboardClick(guild.id)}
                      disabled={loadingGuildId === guild.id}
                      className={`flex items-center justify-center gap-2 p-3 mt-4 text-white rounded-lg transition-all duration-300 transform active:scale-95 shadow-md cursor-pointer ${
                        loadingGuildId === guild.id
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      {loadingGuildId === guild.id && (
                        <ClipLoader color="#FFFFFF" size={20} />
                      )}
                      <span>Dashboard</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP */}
              <div className="hidden sm:flex sm:flex-wrap justify-center gap-6 w-full">
                {adminGuilds.known.map((guild) => (
                  <div
                    key={guild.id}
                    className="flex flex-col justify-center items-center border p-4 rounded-lg shadow-lg w-80 transform transition-all duration-300 hover:scale-105"
                  >
                    {guild.icon ? (
                      <Image
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                        alt={guild.name}
                        width={80}
                        height={80}
                        className="rounded-full mb-4"
                      />
                    ) : (
                      <Image
                        src="/default-guild-icon.png"
                        alt="Default guild icon"
                        width={80}
                        height={80}
                        className="rounded-full mb-4"
                      />
                    )}
                    <h4 className="text-lg sm:text-xl font-semibold mb-2">
                      {guild.name}
                    </h4>
                    <button
                      onClick={() => handleDashboardClick(guild.id)}
                      disabled={loadingGuildId === guild.id}
                      className={`flex items-center justify-center gap-2 p-3 mt-4 text-white rounded-lg transition-all duration-300 transform active:scale-95 shadow-md cursor-pointer ${
                        loadingGuildId === guild.id
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      {loadingGuildId === guild.id && (
                        <ClipLoader color="#FFFFFF" size={20} />
                      )}
                      <span>Dashboard</span>
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500">No admin guilds found.</p>
          )}
        </section>
      )}
    </div>
  );
}
