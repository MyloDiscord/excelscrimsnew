"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Sidebar from "../../../components/Sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  icon?: string | null;
};

type DiscordRole = {
  id: string;
  name: string;
  position: number;
  color: number; // Discord hex color int
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

export default function SettingsGuildPage() {
  const { id: guildId } = useParams();
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);
  const [adminGuilds, setAdminGuilds] = useState<DiscordGuild[]>([]);
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<DiscordRole[]>([]);

  useEffect(() => {
    async function checkAccess() {
      if (!guildId || typeof guildId !== "string") {
        setError("Invalid guild ID.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/discord/user/adminGuilds");
        const data: AdminGuildsResponse = await res.json();

        setAdminGuilds(data.known);
        const foundGuild = data.known.find((g) => g.id === guildId);
        if (foundGuild) {
          setCurrentGuild(foundGuild);
        } else {
          setUnauthorized(true);
        }
      } catch {
        setError("Error checking access");
      } finally {
        setLoading(false);
      }
    }

    async function fetchRoles() {
      if (!guildId || typeof guildId !== "string") return;
      try {
        setError(null);
        console.log("Fetching roles for guildId:", guildId);
        const res = await fetch(`/api/discord/guild/${guildId}/fetch-roles`);
        if (!res.ok) {
          console.error("Failed to fetch roles: HTTP status", res.status);
          setError("Failed to fetch roles");
          return;
        }
        const data: DiscordRole[] = await res.json();
        console.log("Roles API response:", data);
        setRoles(data);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
        setError("Failed to fetch roles");
      }
    }

    checkAccess();
    fetchRoles();
  }, [guildId]);

  const toggleRole = (role: DiscordRole) => {
    const alreadySelected = selectedRoles.find((r) => r.id === role.id);
    if (alreadySelected) {
      setSelectedRoles((prev) => prev.filter((r) => r.id !== role.id));
    } else {
      setSelectedRoles((prev) => [...prev, role]);
    }
  };

  const intToHex = (int: number) => "#" + int.toString(16).padStart(6, "0");

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (error || unauthorized) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white text-xl overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        {error || "You are not authorized to view this page."}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-[#121212] overflow-hidden flex">
      <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />

      {currentGuild && (
        <Sidebar
          current="Dashboard"
          guildName={currentGuild.name}
          guildAvatar={
            currentGuild.icon
              ? `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.png`
              : null
          }
          guildId={currentGuild.id}
          adminGuilds={adminGuilds}
        />
      )}

      <main className="relative z-10 flex-grow p-6 md:p-6 pl-12 md:pl-6 max-w-3xl mx-auto w-full">
        <h1 className="text-5xl font-bold mb-6 text-center md:text-left">
          Settings
        </h1>

        <Card className="w-full bg-[#1c1c1c] border border-neutral-700 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-300">
              Set Discord Staff Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 transition-all font-semibold shadow-sm rounded-md cursor-pointer">
                  Set Staff Roles
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1e1e1e] border border-neutral-700 text-white focus:outline-none">
                <DialogHeader>
                  <DialogTitle>Set Discord Staff Roles</DialogTitle>
                  <DialogDescription>
                    Choose one or more Discord roles that should be recognized
                    as staff.
                  </DialogDescription>
                </DialogHeader>

                {/* Dropdown Menu Trigger is a blank button with arrow */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="mt-4 w-full bg-transparent border border-neutral-700 rounded-md h-10 flex items-center justify-between px-4 text-gray-300 hover:bg-gray-700 focus:outline-none"
                    >
                      {/* Empty content (blank button) */}
                      <span>&nbsp;</span>
                      {/* Arrow down */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-[#1f1f1f] text-white border border-neutral-700 max-h-64 overflow-y-auto">
                    <DropdownMenuLabel>Available Roles</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        onClick={() => toggleRole(role)}
                        className={`hover:bg-gray-700 cursor-pointer ${
                          selectedRoles.find((r) => r.id === role.id)
                            ? "bg-gray-700"
                            : ""
                        }`}
                      >
                        {role.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected roles outside dropdown, as pills */}
                {selectedRoles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRoles.map((role) => {
                      const hex = intToHex(role.color);
                      return (
                        <div
                          key={role.id}
                          className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium"
                          style={{
                            backgroundColor: hex + "22", // faded background
                            color: "#fff",
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: hex }}
                          />
                          {role.name}
                        </div>
                      );
                    })}
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
