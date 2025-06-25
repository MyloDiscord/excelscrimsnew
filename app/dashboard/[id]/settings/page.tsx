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

import { Check, X } from "lucide-react";

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
  position: number;
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
  const [isSaving, setIsSaving] = useState(false);

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
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
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

  const sortedRoles = [...roles].sort((a, b) => b.position - a.position);

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
            <AlertDialog>
              <AlertDialogTrigger>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 transition-all font-semibold shadow-sm rounded-md cursor-pointer">
                  Set Staff Roles
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-6">
                <div className="bg-[#222222] border border-neutral-700 text-white rounded-lg shadow-lg max-w-lg w-full relative p-6">
                  {/* Close (X) button */}
                  <button
                    aria-label="Close dialog"
                    className="absolute top-4 right-4 p-1 rounded hover:bg-gray-700 transition-colors"
                    onClick={() => {
                      const cancelBtn = document.querySelector(
                        "button[aria-label='Cancel']"
                      );
                      if (cancelBtn && cancelBtn instanceof HTMLButtonElement) {
                        cancelBtn.click();
                      }
                    }}
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-200" />
                  </button>

                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <div className="text-3xl font-extrabold mb-8 text-gray-200 tracking-wide">
                        Select Staff Roles
                      </div>
                    </AlertDialogTitle>
                  </AlertDialogHeader>

                  <div className="space-y-3 max-h-80 overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-[#121212]">
                    {sortedRoles.map((role) => (
                      <label
                        key={role.id}
                        htmlFor={`role-${role.id}`}
                        className="flex items-center gap-5 p-3 hover:bg-[#2b2b2b] rounded-md cursor-pointer transition-colors select-none"
                      >
                        <input
                          type="checkbox"
                          id={`role-${role.id}`}
                          checked={selectedRoles.includes(role.id)}
                          onChange={() => toggleRole(role.id)}
                          className="peer hidden"
                          disabled={isSaving}
                        />
                        <span
                          className={`w-7 h-7 border-2 rounded-md flex items-center justify-center transition-colors shadow-sm
              ${
                selectedRoles.includes(role.id)
                  ? "border-gray-300 bg-gray-300"
                  : "border-gray-600 bg-transparent"
              }
            `}
                          aria-hidden="true"
                        >
                          {selectedRoles.includes(role.id) && (
                            <Check className="w-5 h-5 text-gray-900" />
                          )}
                        </span>

                        <span
                          className="inline-block w-5 h-5 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: `#${role.color
                              .toString(16)
                              .padStart(6, "0")}`,
                          }}
                        />
                        <span className="text-base font-medium select-text text-gray-300">
                          {role.name}
                        </span>
                      </label>
                    ))}
                  </div>

                  <AlertDialogFooter className="mt-10 flex justify-end gap-4">
                    <AlertDialogCancel>
                      <Button
                        aria-label="Cancel"
                        variant="outline"
                        className="border border-gray-600 hover:border-gray-400 hover:text-gray-400 transition-colors font-semibold rounded-md"
                        disabled={isSaving}
                      >
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction>
                      <Button
                        aria-label="Save"
                        onClick={handleSave}
                        className="bg-gray-700 hover:bg-gray-600 transition-colors font-semibold rounded-md flex items-center gap-2"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <ClipLoader size={18} color="#d1d5db" />
                            Saving...
                          </>
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
