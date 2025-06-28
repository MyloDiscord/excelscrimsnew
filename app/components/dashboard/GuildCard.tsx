"use client";

import { useState } from "react";
import Image from "next/image";

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
  const [arrowAnim, setArrowAnim] = useState(false);
  const isLoading = loadingGuildId === guild.id;
  const showCounts = isMobile || hoveredGuildId === guild.id;

  const handleDashboardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isLoading) return;
    setArrowAnim(true);
    setTimeout(() => {
      setArrowAnim(false);
      onClick();
    }, 320);
  };

  return (
    <div
      onMouseEnter={() => setHoveredGuildId(guild.id)}
      onMouseLeave={() => setHoveredGuildId(null)}
      className="w-64 bg-[#1a1a1a] rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 hover:scale-105 text-center select-none"
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
          type="button"
          disabled={isLoading}
          onClick={handleDashboardClick}
          className={`
            mt-2 w-full flex items-center justify-center gap-3
            px-4 py-2
            rounded-full
            font-bold
            border
            cursor-pointer
            border-[#00f8ff]
            bg-[#181818]
            text-[#00f8ff]
            text-lg
            transition-all duration-150
            hover:bg-[#00f8ff]/10
            hover:text-white
            hover:border-white
            active:scale-95
            focus:outline-none focus:ring-2 focus:ring-[#00f8ff]/40
            ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
            ${arrowAnim ? "scale-95" : ""}
          `}
        >
          Dashboard
          <span
            className={`
              text-xl leading-none transition-all duration-300
              ${
                arrowAnim
                  ? "translate-x-3 opacity-0"
                  : "translate-x-0 opacity-100"
              }
            `}
            style={{ display: "inline-block" }}
          >
            ➜
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out text-sm mt-4 flex flex-col gap-2 items-center select-none ${
            showCounts ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ willChange: "max-height, opacity" }}
        >
          <div className="flex gap-2">
            <span className="flex items-center px-3 py-1 rounded-full border border-green-500 bg-green-500/10 text-green-400 font-semibold text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2" />
              Online: {onlineCount}
            </span>
            <span className="flex items-center px-3 py-1 rounded-full border border-red-500 bg-red-500/10 text-red-400 font-semibold text-sm">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2" />
              Offline: {offlineCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
