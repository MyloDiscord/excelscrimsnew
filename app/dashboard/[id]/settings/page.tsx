"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Sidebar from "../../../components/Sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  color: number;
};

type AdminGuildsResponse = {
  known: DiscordGuild[];
  unknown?: DiscordGuild[];
};

type DiscordChannel = {
  id: string;
  name: string;
};

export default function SettingsGuildPage() {
  const { id: guildId } = useParams();
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentGuild, setCurrentGuild] = useState<DiscordGuild | null>(null);
  const [adminGuilds, setAdminGuilds] = useState<DiscordGuild[]>([]);
  const [roles, setRoles] = useState<DiscordRole[]>([]);
  const [savedRoles, setSavedRoles] = useState<DiscordRole[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<DiscordRole[]>([]);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(
    undefined
  );

  const [channels, setChannels] = useState<DiscordChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [logChannelDialogOpen, setLogChannelDialogOpen] = useState(false);

  useEffect(() => {
    async function loadAllData() {
      if (!guildId || typeof guildId !== "string") {
        setError("Invalid guild ID.");
        setLoading(false);
        return;
      }

      try {
        const resGuilds = await fetch("/api/discord/user/adminGuilds");
        const dataGuilds: AdminGuildsResponse = await resGuilds.json();

        setAdminGuilds(dataGuilds.known);
        const foundGuild = dataGuilds.known.find((g) => g.id === guildId);
        if (!foundGuild) {
          setUnauthorized(true);
          setLoading(false);
          return;
        }
        setCurrentGuild(foundGuild);

        const resRoles = await fetch(
          `/api/discord/guild/${guildId}/fetch-roles`
        );
        if (!resRoles.ok) {
          setError("Failed to fetch roles");
          setLoading(false);
          return;
        }
        const rolesData: DiscordRole[] = await resRoles.json();
        setRoles(rolesData);

        const resSaved = await fetch(
          `/api/discord/guild/${guildId}/get-staff-roles`
        );
        if (!resSaved.ok) throw new Error("Failed to fetch saved staff roles");
        const savedData = await resSaved.json();
        if (Array.isArray(savedData.staffRoles)) {
          setSavedRoles(savedData.staffRoles);
        } else {
          setSavedRoles([]);
        }

        const resChannels = await fetch(
          `/api/discord/guild/${guildId}/fetch-channels`
        );
        if (!resChannels.ok) {
          setError("Failed to fetch channels");
          setLoading(false);
          return;
        }
        const channelsData: DiscordChannel[] = await resChannels.json();
        setChannels(channelsData);

        const resSavedChannel = await fetch(
          `/api/discord/guild/${guildId}/get-log-channel`
        );
        if (resSavedChannel.ok) {
          const savedChannelData = await resSavedChannel.json();
          if (savedChannelData?.channelId)
            setSelectedChannel(savedChannelData.channelId);
        }
      } catch {
        setError("Error loading data");
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, [guildId]);

  useEffect(() => {
    if (open) {
      setSelectedRoles(savedRoles);
    }
  }, [open, savedRoles]);

  useEffect(() => {
    if (triggerRef.current) {
      setDropdownWidth(triggerRef.current.offsetWidth);
    }
  }, [dropdownOpen]);

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

  const handleCancel = () => {
    setSelectedRoles([]);
    setOpen(false);
  };

  const handleSave = async () => {
    if (!guildId) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/discord/guild/${guildId}/save-staff-roles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            staffRoles: selectedRoles,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Staff roles saved successfully");
        setOpen(false);
      } else {
        toast.error(data.message || "Failed to save staff roles");
      }
    } catch {
      toast.error("Failed to save staff roles");
    } finally {
      setSaving(false);
    }
  };

  const saveLogChannel = async () => {
    if (!guildId || !selectedChannel) return;

    try {
      const res = await fetch(
        `/api/discord/guild/${guildId}/save-log-channel`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ channelId: selectedChannel }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Log channel saved");
        setLogChannelDialogOpen(false);
      } else {
        toast.error(data.message || "Failed to save log channel");
      }
    } catch {
      toast.error("Error saving log channel");
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

                <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
                  <DropdownMenuTrigger asChild>
                    <button
                      ref={triggerRef}
                      type="button"
                      className="mt-4 w-full bg-transparent border border-neutral-700 rounded-md h-10 flex items-center justify-between px-4 text-gray-300 hover:bg-gray-700 focus:outline-none"
                      aria-label="Select Staff Roles"
                    >
                      <span className="truncate">
                        {selectedRoles.length > 0
                          ? selectedRoles.map((r) => r.name).join(", ")
                          : "Select roles..."}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-300 ml-2 flex-shrink-0 transform transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    style={{ width: dropdownWidth }}
                    className={`bg-[#1f1f1f] text-white border border-neutral-700 max-h-64 overflow-y-auto shadow-lg rounded-md
                    scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-transparent
                    transition-opacity duration-300 ease-in-out
                    ${
                      dropdownOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
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
                          onSelect={(e) => {
                            e.preventDefault();
                            toggleRole(role);
                          }}
                          className={`flex items-center justify-between px-4 py-2 cursor-pointer rounded-md transition-colors duration-150 ${
                            isSelected
                              ? "bg-[#1a1a1a] text-white shadow-md"
                              : "hover:bg-gray-700 text-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: hex }}
                              aria-hidden="true"
                            />
                            <span className="select-none">{role.name}</span>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-white" />
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                {selectedRoles.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 items-center">
                    {selectedRoles.map((role) => {
                      const hex = intToHex(role.color);
                      return (
                        <div
                          key={role.id}
                          className="flex items-center gap-2 px-3 py-1 rounded-md text-sm font-medium cursor-pointer group"
                          style={{
                            backgroundColor: hex + "22",
                            color: "#fff",
                          }}
                          onClick={() => removeRole(role.id)}
                          title={`Remove ${role.name}`}
                        >
                          <span
                            className="w-2 h-2 rounded-full relative flex-shrink-0 bg-[inherit]"
                            style={{ backgroundColor: hex }}
                          >
                            <X
                              className="absolute top-0 left-0 w-2 h-2 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              strokeWidth={3}
                            />
                          </span>
                          {role.name}
                        </div>
                      );
                    })}

                    <button
                      onClick={() => setSelectedRoles([])}
                      className="ml-2 px-3 py-1 text-sm rounded-md font-medium text-red-400 bg-red-700/20 hover:bg-red-700/40 transition cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer bg-red-700/20 hover:bg-red-700/40 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer bg-green-600/20 hover:bg-green-600/40 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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

        <Card className="w-full bg-[#1c1c1c] border border-neutral-700 shadow-lg rounded-lg mt-6">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-300">
              Set Log Channel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog
              open={logChannelDialogOpen}
              onOpenChange={setLogChannelDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 transition-all font-semibold shadow-sm rounded-md cursor-pointer">
                  Set Log Channel
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1e1e1e] border border-neutral-700 text-white focus:outline-none">
                <DialogHeader>
                  <DialogTitle>Set Log Channel</DialogTitle>
                  <DialogDescription>
                    Choose the channel where logs should be sent.
                  </DialogDescription>
                </DialogHeader>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="mt-4 w-full bg-transparent border border-neutral-700 rounded-md h-10 flex items-center justify-between px-4 text-gray-300 hover:bg-gray-700 focus:outline-none"
                      aria-label="Select Log Channel"
                    >
                      <span className="truncate">
                        {selectedChannel
                          ? `#${
                              channels.find((c) => c.id === selectedChannel)
                                ?.name || "Unknown"
                            }`
                          : "Select a channel..."}
                      </span>
                      <ChevronDown className="h-5 w-5 text-gray-300 ml-2" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="bg-[#1f1f1f] text-white border border-neutral-700 max-h-64 overflow-y-auto shadow-lg rounded-md">
                    <DropdownMenuLabel className="px-4 py-2 text-sm font-semibold text-gray-400">
                      Available Channels
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {channels.map((channel) => (
                      <DropdownMenuItem
                        key={channel.id}
                        onSelect={(e) => {
                          e.preventDefault();
                          setSelectedChannel(channel.id);
                        }}
                        className={`flex justify-between items-center px-4 py-2 ${
                          selectedChannel === channel.id
                            ? "bg-[#1a1a1a] text-white"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                      >
                        #{channel.name}
                        {selectedChannel === channel.id && (
                          <Check className="h-4 w-4" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    onClick={() => setLogChannelDialogOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer bg-red-700/20 hover:bg-red-700/40 text-white transition"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={saveLogChannel}
                    disabled={!selectedChannel}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold cursor-pointer bg-green-600/20 hover:bg-green-600/40 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" />
                    Save
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
