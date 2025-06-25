"use client";

import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";

type DiscordGuild = {
  id: string;
  name: string;
  icon: string | null;
  permissions: string;
  approximate_presence_count?: number;
  approximate_offline_count?: number;
};

type GuildCardProps = {
  guild: DiscordGuild;
  loadingGuildId: string | null;
  onClick: () => void;
  onlineCount: number;
  offlineCount: number;
  hoveredGuildId: string | null;
  setHoveredGuildId: React.Dispatch<React.SetStateAction<string | null>>;
  isMobile: boolean;
};

export default function GuildCard({
  guild,
  loadingGuildId,
  onClick,
  onlineCount,
  offlineCount,
  hoveredGuildId,
  setHoveredGuildId,
  isMobile,
}: GuildCardProps) {
  const isLoading = loadingGuildId === guild.id;
  const showCounts = isMobile || hoveredGuildId === guild.id;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHoveredGuildId(guild.id)}
      onMouseLeave={() => setHoveredGuildId(null)}
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

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out text-sm mt-2 text-gray-300 select-none ${
            showCounts ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ willChange: "max-height, opacity" }}
        >
          <p className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            Online: {onlineCount}
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            Offline: {offlineCount}
          </p>
        </div>
      </div>
    </div>
  );
}
