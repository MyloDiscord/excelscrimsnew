"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Sidebar = ({
  current,
  guildName,
  guildAvatar,
  guildId,
  adminGuilds,
}: {
  current: string;
  guildName: string;
  guildAvatar: string | null;
  guildId: string;
  adminGuilds: { id: string; name: string; icon?: string | null }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="p-2 bg-gray-800 text-gray-300 rounded md:hidden fixed top-4 left-4 z-50"
          aria-label="Open Sidebar"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div
        className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:block w-64 bg-[#121212] text-gray-200 h-screen p-4 shadow-lg flex flex-col`}
      >
        <div className="flex items-center mb-6">
          {guildAvatar ? (
            <Image
              src={guildAvatar}
              alt={`${guildName}'s avatar`}
              width={48}
              height={48}
              className="rounded-full shadow-lg mr-3"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-3">
              <span className="text-gray-300 text-sm">No Avatar</span>
            </div>
          )}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-100 truncate">
              {guildName}
            </h2>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-[#00f8ff] hover:underline text-left">
                Switch Server
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#1f1f1f] border border-gray-700 text-white">
                {adminGuilds
                  .filter((guild) => guild.id !== guildId)
                  .map((guild) => (
                    <DropdownMenuItem key={guild.id} asChild>
                      <Link href={`/dashboard/${guild.id}`}>
                        {guild.icon && (
                          <Image
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            width={20}
                            height={20}
                            className="inline-block mr-2 rounded-full"
                          />
                        )}
                        {guild.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <hr className="my-4 border-gray-600" />

        {/* rest of your sidebar... */}
        {/* Leave your nav links and footer untouched here */}
      </div>
    </div>
  );
};

export default Sidebar;
