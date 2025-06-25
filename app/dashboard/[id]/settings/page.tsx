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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-gray-800 hover:bg-gray-700 transition-all font-semibold shadow-sm rounded-md cursor-pointer">
                  Set Staff Roles
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
