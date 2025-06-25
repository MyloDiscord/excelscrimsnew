"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Check } from "lucide-react";
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
      text-sm 
      bg-[#1f1f1f] 
      text-[#00f8ff] 
      px-3 py-1 
      rounded-md 
      border border-[#00f8ff] 
      mt-1 
      cursor-pointer 
      hover:bg-[#2a2a2a] 
      hover:text-[#00f8ff] 
      transition-colors duration-200
      focus:outline-none
      focus:ring-2 focus:ring-[#00f8ff] 
      focus:ring-offset-1
    "
                >
                  Switch Server
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="bg-[#1f1f1f] border border-gray-700 text-white mt-2">
                <DropdownMenuItem
                  disabled
                  className="flex items-center justify-between opacity-50 cursor-default select-none"
                >
                  <span className="flex items-center gap-2">
                    {guildAvatar && (
                      <Image
                        src={guildAvatar}
                        alt={guildName}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    )}
                    {guildName}
                  </span>
                  <Check className="w-4 h-4 text-[#00f8ff]" />
                </DropdownMenuItem>

                <div className="border-t border-gray-700 my-1" />

                {adminGuilds
                  .filter((guild) => guild.id !== guildId)
                  .map((guild) => (
                    <DropdownMenuItem key={guild.id} asChild>
                      <Link
                        href={`/dashboard/${guild.id}`}
                        className="flex items-center gap-2"
                      >
                        {guild.icon && (
                          <Image
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            width={20}
                            height={20}
                            className="rounded-full"
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

        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="mb-4 p-2 bg-[#00f8ff] text-white rounded"
            aria-label="Close Sidebar"
          >
            Close
          </button>
        )}

        <ul className="space-y-3 flex-grow">
          <li>
            <Link
              href={`/dashboard/${guildId}`}
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Dashboard"
                  ? "bg-gray-800 text-white border-l-4 border-[#00f8ff] font-semibold"
                  : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/${guildId}/staff-overview`}
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Scrims Overview"
                  ? "bg-gray-800 text-white border-l-4 border-[#00f8ff] font-semibold"
                  : ""
              }`}
            >
              Staff Overview
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/${guildId}/application-overview`}
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Applications Overview"
                  ? "bg-gray-800 text-white border-l-4 border-[#00f8ff] font-semibold"
                  : ""
              }`}
            >
              Applications Overview
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/${guildId}/activity-checks/overview`}
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Activity Checks"
                  ? "bg-gray-800 text-white border-l-4 border-[#00f8ff] font-semibold"
                  : ""
              }`}
            >
              Activity Checks
            </Link>
          </li>
          <li>
            <Link
              href={`/dashboard/${guildId}/settings`}
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Settings"
                  ? "bg-gray-800 text-white border-l-4 border-[#00f8ff] font-semibold"
                  : ""
              }`}
            >
              Settings
            </Link>
          </li>
        </ul>

        <hr className="my-4 border-gray-600" />

        <footer className="text-center text-sm text-gray-400 mt-auto">
          <p>
            Developed by{" "}
            <a
              href="https://x.com/kotaau1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-400 transition-colors"
            >
              Mylo
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Sidebar;
