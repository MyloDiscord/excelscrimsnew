"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Sidebar from "../../../components/Sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  icon?: string | null;
};

type DiscordRole = {
  id: string;
  name: string;
  color: number;
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
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

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

    checkAccess();
  }, [guildId]);

  useEffect(() => {
    async function fetchRoles() {
      if (!guildId || typeof guildId !== "string") return;

      try {
        const res = await fetch(`/api/discord/guild/${guildId}/fetch-roles`);
        const data = await res.json();
        setRoles(data.roles || []);
      } catch {
        console.warn("Failed to fetch roles");
      }
    }

    fetchRoles();
  }, [guildId]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/discord/guild/${guildId}/set-staff-roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffRoles: selectedRoles }),
      });

      const data = await res.json();
      console.log("Saved staff roles:", data);
    } catch (err) {
      console.error("Error saving staff roles:", err);
    }
  };

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

        <Card className="w-full bg-[#1c1c1c] border border-neutral-800 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-pink-400">
              Set Discord Staff Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:brightness-110 transition-all font-semibold shadow-md">
                  Set Staff Roles
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-[#181818] border border-pink-600 text-white rounded-xl shadow-2xl max-w-lg mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    <div className="text-2xl font-bold mb-6 text-pink-400">
                      Select Staff Roles
                    </div>
                  </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scroll">
                  {roles.map((role) => (
                    <label
                      key={role.id}
                      htmlFor={`role-${role.id}`}
                      className="flex items-center gap-4 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer transition-colors select-none"
                    >
                      <input
                        type="checkbox"
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onChange={() => toggleRole(role.id)}
                        className="peer hidden"
                      />
                      <span
                        className="w-6 h-6 border-2 border-white rounded-sm flex items-center justify-center transition-colors peer-checked:bg-pink-500 peer-checked:border-pink-500"
                        aria-hidden="true"
                      >
                        <svg
                          className="w-4 h-4 text-black"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </span>

                      <span
                        className="inline-block w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: `#${role.color
                            .toString(16)
                            .padStart(6, "0")}`,
                        }}
                      />
                      <span className="text-sm font-medium">{role.name}</span>
                    </label>
                  ))}
                </div>

                <AlertDialogFooter className="mt-8 flex justify-end gap-4">
                  <AlertDialogCancel>
                    <Button variant="outline" className="border-neutral-600">
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction>
                    <Button
                      onClick={handleSave}
                      className="bg-pink-600 hover:bg-pink-700 transition-colors"
                    >
                      Save
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
