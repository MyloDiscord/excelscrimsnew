"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const Sidebar = ({
  current,
  guildName,
  guildAvatar,
  guildId,
}: {
  current: string;
  guildName: string;
  guildAvatar: string | null;
  guildId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
          <h2 className="text-xl font-bold text-gray-100 truncate">
            {guildName}
          </h2>
        </div>
        <hr className="my-4 border-gray-600" />

        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="mb-4 p-2 bg-red-600 text-white rounded"
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
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
                  : ""
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/scrims"
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Scrims Overview"
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
                  : ""
              }`}
            >
              Scrims Overview
            </Link>
          </li>
          <li>
            <Link
              href="/applications"
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Applications Overview"
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
                  : ""
              }`}
            >
              Applications Overview
            </Link>
          </li>
          <li>
            <Link
              href="/activity-checks"
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Activity Checks"
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
                  : ""
              }`}
            >
              Activity Checks
            </Link>
          </li>
          <li>
            <Link
              href="/presets"
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Presets"
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
                  : ""
              }`}
            >
              Presets
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                current === "Settings"
                  ? "bg-gray-800 text-white border-l-4 border-red-500 font-semibold"
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
