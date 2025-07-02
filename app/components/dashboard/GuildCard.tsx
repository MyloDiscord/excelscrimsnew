"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

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
  onClick: () => Promise<void>;
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
  const [localLoading, setLocalLoading] = useState(false);
  const isLoading = loadingGuildId === guild.id || localLoading;
  const showCounts = isMobile || hoveredGuildId === guild.id;

  const handleDashboardClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    if (isLoading) return;
    setArrowAnim(true);
    setLocalLoading(true);
    setTimeout(() => {
      setArrowAnim(false);
    }, 320);

    try {
      await onClick();
    } finally {
      setLocalLoading(false);
    }
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

        <Button
          type="button"
          variant="default"
          size="lg"
          disabled={isLoading}
          onClick={handleDashboardClick}
          className={`
    mt-2 w-full flex items-center justify-center gap-3 rounded-md text-base font-semibold
    bg-blue-600 text-white
    hover:bg-blue-700
    active:scale-95
    focus:outline-none focus:ring-2 focus:ring-blue-400/70
    transition-all duration-150
    ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
    ${arrowAnim ? "scale-95" : ""}
  `}
        >
          {isLoading ? (
            <>
              <Loader2Icon className="animate-spin h-5 w-5" />
              Loading
            </>
          ) : (
            <>
              Dashboard
              <span
                className={`
          text-xl leading-none transition-all duration-300
          ${arrowAnim ? "translate-x-3 opacity-0" : "translate-x-0 opacity-100"}
        `}
                style={{ display: "inline-block" }}
              >
                ➜
              </span>
            </>
          )}
        </Button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out text-xs mt-3 flex flex-col gap-1 items-center select-none ${
            showCounts ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ willChange: "max-height, opacity" }}
        >
          <div className="flex gap-2">
            <span className="flex items-center px-2 py-0.5 rounded-full border border-green-500 bg-green-500/10 text-green-400 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
              Online: {onlineCount}
            </span>
            <span className="flex items-center px-2 py-0.5 rounded-full border border-red-500 bg-red-500/10 text-red-400 font-medium text-xs">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5" />
              Offline: {offlineCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
