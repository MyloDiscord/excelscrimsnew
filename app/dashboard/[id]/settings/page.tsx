"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Sidebar from "../../../components/Sidebar";
import ClipLoader from "react-spinners/ClipLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DiscordGuild = {
  id: string;
  name: string;
  permissions: string;
  approximate_presence_count?: number;
  approximate_offline_count?: number;
  icon?: string | null;
};

type DiscordRole = {
  id: string;
  name: string;
  color: number; // Discord color as int
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
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Load Guilds
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
          setUnauthorized(false);
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

  // Load Roles
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

      <main className="relative z-10 flex-grow p-6 md:p-6 pl-12 md:pl-6">
        <h1 className="text-5xl font-bold mb-6 text-center md:text-left">
          Settings
        </h1>

        {/* Staff Role Selector Card */}
        <Card className="w-full max-w-xl bg-[#1c1c1c] border border-neutral-800">
          <CardHeader>
            <CardTitle>Set Discord Staff Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedRole(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <span
                      className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                      style={{
                        backgroundColor: `#${role.color
                          .toString(16)
                          .padStart(6, "0")}`,
                      }}
                    />
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
