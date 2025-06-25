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
  DialogClose,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Check, X } from "lucide-react";

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
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

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

  const removeRole = (roleId: string) => {
    setSelectedRoles((prev) => prev.filter((r) => r.id !== roleId));
  };

  const intToHex = (int: number) => "#" + int.toString(16).padStart(6, "0");

  // Cancel clears selection and closes dialog
  const handleCancel = () => {
    setSelectedRoles([]);
    setOpen(false);
  };

  // Save simulates saving with a delay and then closes dialog
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      // TODO: implement actual save logic here
    }, 2500);
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

        <Card className="w-full bg-[#1c1c1c] border border-neutral-700 shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-300">
              Set Discord Staff Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog open={open} onOpenChange={setOpen}>
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

                {/* Dropdown Menu Trigger */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="mt-4 w-full bg-transparent border border-neutral-700 rounded-md h-10 flex items-center justify-between px-4 text-gray-300 hover:bg-gray-700 focus:outline-none"
                      aria-label="Select Staff Roles"
                    >
                      <span className="truncate">Select roles...</span>
                      <ChevronDown className="h-5 w-5 text-gray-300 ml-2 flex-shrink-0" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-[#1f1f1f] text-white border border-neutral-700 max-h-64 overflow-y-auto shadow-lg rounded-md">
                    <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-400">
                      Available Roles
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roles.map((role) => {
                      const isSelected = selectedRoles.some(
                        (r) => r.id === role.id
                      );
                      const hex = intToHex(role.color);

                      return (
                        <DropdownMenuItem
                          key={role.id}
                          onClick={() => toggleRole(role)}
                          className={`
                flex items-center justify-between px-4 py-2 cursor-pointer rounded-md
                transition-colors duration-150
                ${
                  isSelected
                    ? "bg-[#1a1a1a] text-white shadow-md"
                    : "hover:bg-gray-700 text-gray-300"
                }
              `}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: hex }}
                              aria-hidden="true"
                            />
                            <span className="select-none">{role.name}</span>
                          </div>

                          {/* Checkmark for selected */}
                          {isSelected && (
                            <Check className="h-5 w-5 text-white" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Selected roles pills with removable X */}
                {selectedRoles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedRoles.map((role) => {
                      const hex = intToHex(role.color);
                      return (
                        <div
                          key={role.id}
                          className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium cursor-pointer group"
                          style={{
                            backgroundColor: hex + "22", // faded background
                            color: "#fff",
                          }}
                          onClick={() => removeRole(role.id)}
                          title={`Remove ${role.name}`}
                        >
                          <span
                            className="w-2 h-2 rounded-full relative flex-shrink-0 bg-[inherit]"
                            style={{ backgroundColor: hex }}
                          >
                            {/* Show 'X' on hover */}
                            <X
                              className="absolute top-0 left-0 w-2 h-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              strokeWidth={3}
                            />
                          </span>
                          {role.name}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer
                      bg-red-700 bg-opacity-20 hover:bg-opacity-40 text-red-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer
                      bg-green-700 bg-opacity-20 hover:bg-opacity-40 text-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
