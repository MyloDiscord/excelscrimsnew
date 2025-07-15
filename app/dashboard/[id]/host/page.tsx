"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import ClipLoader from "react-spinners/ClipLoader";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { toast } from "sonner";

export default function HostPage() {
  const { id: guildId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guildName, setGuildName] = useState<string | null>(null);
  const [mode, setMode] = useState<string | null>(null);
  const [tournaments, setTournaments] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await fetch(`/api/discord/guild/${guildId}/fetch-user-roles`, {
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Unauthorized");
          return;
        }

        const data = await res.json();
        setGuildName(data.guildName || "Unknown Guild");
      } catch {
        console.error("Error verifying user access");
        setError("Something went wrong while verifying access.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTournaments = async () => {
      try {
        const res = await fetch(`/api/discord/guild/${guildId}/fetch-yunite-tournaments`);
        if (!res.ok) throw new Error("Failed to fetch tournaments");

        const data = await res.json();
        setTournaments(data.tournaments || []);
      } catch (err) {
        console.error("Error fetching tournaments:", err);
        toast.error("Failed to load tournaments.");
      }
    };

    checkAccess();
    fetchTournaments();
  }, [guildId]);

  const handleCreate = () => {
    const selected = tournaments.find((t) => t.id === mode);
    toast.success(`Created panel for ${selected?.name || "Unknown Tournament"}`);
    setMode(null);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        <ClipLoader color="#FF4B3E" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#121212] text-white text-xl overflow-hidden">
        <BackgroundBeams className="absolute inset-0 z-0 pointer-events-none" />
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-white bg-[#121212] overflow-hidden flex">
      <main className="relative z-10 flex-grow p-6 md:p-6 pl-12 md:pl-6 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl font-bold mb-4 text-center md:text-left">
          Host Dashboard
        </h1>
        {guildName && (
          <p className="text-lg text-neutral-300 text-center md:text-left">
            Managing server: <span className="font-semibold text-white">{guildName}</span>
          </p>
        )}

        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 rounded-full bg-green-500 hover:bg-green-600 text-white w-14 h-14 shadow-lg flex items-center justify-center text-3xl"
            >
              +
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Host Panel</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="mode" className="text-sm font-medium text-gray-300">
                  Select Tournament
                </label>
                <Select onValueChange={(value) => setMode(value)} value={mode || undefined}>
                  <SelectTrigger id="mode" className="w-full">
                    <SelectValue placeholder="Choose a tournament..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tournaments.map((tournament) => (
                      <SelectItem key={tournament.id} value={tournament.id}>
                        {tournament.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <DialogTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button
                  onClick={handleCreate}
                  disabled={!mode}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Create
                </Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
