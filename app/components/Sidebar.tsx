"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ChevronLeft, ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-[#00f8ff]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="#00f8ff"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="#00f8ff"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

interface SidebarProps {
  current: string;
  guildName: string;
  guildAvatar: string | null;
  guildId: string;
  adminGuilds: { id: string; name: string; icon?: string | null }[];
}

type SidebarExtra = {
  label: string;
  href: (guildId: string) => string;
  icon?: React.ReactNode;
};
type SidebarLink = {
  label: string;
  href: (guildId: string) => string;
  match: string;
  extras: SidebarExtra[];
};

const sidebarLinks: SidebarLink[] = [
  {
    label: "Dashboard",
    href: (guildId: string) => `/dashboard/${guildId}`,
    match: "Dashboard",
    extras: [],
  },
  {
    label: "Staff Overview",
    href: (guildId: string) => `/dashboard/${guildId}/staff-overview`,
    match: "Scrims Overview",
    extras: [
      {
        label: "Add Staff",
        href: (guildId: string) => `/dashboard/${guildId}/staff-overview/add`,
      },
      {
        label: "Staff Settings",
        href: (guildId: string) =>
          `/dashboard/${guildId}/staff-overview/settings`,
      },
    ],
  },
  {
    label: "Applications Overview",
    href: (guildId: string) => `/dashboard/${guildId}/applications/overview`,
    match: "Applications Overview",
    extras: [],
  },
  {
    label: "Activity Checks",
    href: (guildId: string) => `/dashboard/${guildId}/activity-checks/overview`,
    match: "Activity Checks",
    extras: [
      {
        label: "New Check",
        href: (guildId: string) => `/dashboard/${guildId}/activity-checks/new`,
      },
    ],
  },
  {
    label: "Settings",
    href: (guildId: string) => `/dashboard/${guildId}/settings`,
    match: "Settings",
    extras: [],
  },
];

const Sidebar = ({
  current,
  guildName,
  guildAvatar,
  guildId,
  adminGuilds,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [collapse, setCollapse] = useState<Record<string, boolean>>({});
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoadingHref(null);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleCollapseToggle = (label: string) => {
    setCollapse((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleNav = async (href: string) => {
    setLoadingHref(href);
    router.push(href);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } md:hidden`}
        aria-hidden={!isOpen}
      />

      <button
        ref={triggerRef}
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center w-11 h-11 bg-[#18191c] rounded-full shadow-lg text-[#00f8ff] hover:bg-[#23272a] transition group"
        aria-label="Open Sidebar"
        style={{ outline: "none" }}
      >
        <ChevronRight className="w-7 h-7 transition-transform duration-300 group-hover:translate-x-1" />
      </button>

      <nav
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 z-50 h-screen w-72 max-w-full
          bg-[#121212] border-r border-[#23272a]
          shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          md:relative md:block md:shadow-none md:translate-x-0
        `}
        aria-label="Sidebar"
        tabIndex={-1}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-50 md:hidden flex items-center justify-center w-9 h-9 bg-[#18191c] text-[#00f8ff] rounded-full hover:bg-[#23272a] transition"
          aria-label="Close Sidebar"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-7 mt-6 px-2">
          {guildAvatar ? (
            <Image
              src={guildAvatar}
              alt={`${guildName}'s avatar`}
              width={48}
              height={48}
              className="rounded-full shadow-md border-2 border-[#23272a]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#23272a] flex items-center justify-center">
              <span className="text-gray-400 text-xs">No Avatar</span>
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-bold text-white truncate max-w-[10rem]">
              {guildName}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="
                    mt-1 text-xs px-3 py-1 rounded-md border
                    border-[#00f8ff] text-[#00f8ff] bg-[#18191c]
                    hover:bg-[#222] hover:text-cyan-400 transition-colors
                    focus:outline-none focus:ring-2 focus:ring-[#00f8ff]
                  "
                >
                  Switch Server
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#18191c] border border-[#222] text-white mt-2 min-w-[200px]">
                <DropdownMenuItem
                  disabled
                  className="flex items-center gap-2 opacity-60 cursor-default select-none"
                >
                  {guildAvatar && (
                    <Image
                      src={guildAvatar}
                      alt={guildName}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                  )}
                  <span className="truncate">{guildName}</span>
                  <Check className="ml-auto w-4 h-4 text-[#00f8ff]" />
                </DropdownMenuItem>
                <div className="border-t border-[#23272a] my-1" />
                {adminGuilds
                  .filter((g) => g.id !== guildId)
                  .map((guild) => (
                    <DropdownMenuItem
                      key={guild.id}
                      asChild
                      className="cursor-pointer hover:bg-[#222] hover:text-[#00f8ff] flex items-center gap-2"
                    >
                      <Link href={`/dashboard/${guild.id}`}>
                        {guild.icon && (
                          <Image
                            src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                            alt={guild.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                        )}
                        <span className="truncate">{guild.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <hr className="my-3 border-[#23272a]" />

        <ul className="flex flex-col gap-0.5 px-1 flex-grow">
          {sidebarLinks.map((item) => {
            const hasExtras =
              Array.isArray(item.extras) && item.extras.length > 0;
            const isExpanded = !!collapse[item.label];
            const mainHref = item.href(guildId);

            return (
              <li key={item.label}>
                <div className="flex flex-col">
                  <div
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-md
                      font-medium text-sm
                      transition-colors duration-150
                      focus:outline-none focus:ring-2 focus:ring-[#00f8ff]
                      select-none cursor-pointer
                      ${
                        current === item.match
                          ? "bg-[#161b20] text-[#00f8ff] font-semibold shadow"
                          : "hover:bg-[#191e23] hover:text-[#00f8ff] text-gray-200"
                      }
                      relative
                    `}
                  >
                    {!hasExtras && (
                      <span
                        className={`absolute left-1.5 transition-opacity duration-200 ${
                          current === item.match ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}

                    {hasExtras ? (
                      <button
                        type="button"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                        aria-expanded={isExpanded}
                        tabIndex={0}
                        onClick={() => handleCollapseToggle(item.label)}
                        className="flex items-center focus:outline-none bg-transparent border-0 mr-1"
                        style={{ marginRight: "0.2rem" }}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    ) : (
                      <span className="w-4" />
                    )}
                    <button
                      className={`flex-1 truncate text-left bg-transparent border-0 outline-none cursor-pointer px-1 py-0 ${
                        loadingHref === mainHref ? "opacity-70" : ""
                      }`}
                      disabled={loadingHref === mainHref}
                      onClick={() => handleNav(mainHref)}
                      style={{ minHeight: "32px" }}
                    >
                      <span className="flex items-center gap-2">
                        {item.label}
                        {loadingHref === mainHref && <Spinner />}
                      </span>
                    </button>
                  </div>
                  {hasExtras && (
                    <div
                      className={`
                        transition-all duration-300
                        ${
                          isExpanded
                            ? "max-h-32 opacity-100"
                            : "max-h-0 opacity-0 pointer-events-none"
                        }
                        ml-8
                      `}
                      style={{ overflow: "hidden" }}
                    >
                      <ul>
                        {item.extras.map((extra) => {
                          const extraHref = extra.href(guildId);
                          return (
                            <li key={extra.label}>
                              <button
                                className={`
                                  flex items-center gap-2 px-2 py-1.5 rounded-md text-xs w-full
                                  text-gray-300 hover:text-[#00f8ff] hover:bg-[#191e23]
                                  transition-colors duration-100 text-left bg-transparent border-0
                                  ${
                                    loadingHref === extraHref
                                      ? "opacity-70"
                                      : ""
                                  }
                                `}
                                disabled={loadingHref === extraHref}
                                onClick={() => handleNav(extraHref)}
                              >
                                {extra.icon && (
                                  <span className="text-[#00f8ff] opacity-60">
                                    {extra.icon}
                                  </span>
                                )}
                                {extra.label}
                                {loadingHref === extraHref && <Spinner />}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <hr className="my-4 border-[#23272a]" />

        <footer className="text-center text-xs text-gray-500 mb-3 px-2 mt-auto">
          <p>
            Developed by{" "}
            <a
              href="https://discord.com/users/253680525619757057"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00f8ff] hover:underline"
            >
              Mylo
            </a>
          </p>
        </footer>
      </nav>
    </>
  );
};

export default Sidebar;
