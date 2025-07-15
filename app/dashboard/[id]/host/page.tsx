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

type Panel = {
    _id: string;
    tournamentName: string;
    createdAt: string;
};

export default function HostPage() {
    const { id: guildId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [guildName, setGuildName] = useState<string | null>(null);
    const [mode, setMode] = useState<string | null>(null);
    const [tournaments, setTournaments] = useState<{ id: string; name: string }[]>([]);
    const [panels, setPanels] = useState<Panel[]>([]);

    const fetchPanels = async () => {
        try {
            const res = await fetch(`/api/discord/guild/${guildId}/fetch-host-panels`);
            if (!res.ok) throw new Error("Failed to fetch panels");
            const data = await res.json();
            setPanels(data.panels || []);
        } catch (err) {
            toast.error("Failed to load panels.");
            console.error("Error fetching panels:", err);
        }
    };

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
        fetchPanels(); // ✅ Fetch panels on load
    }, [guildId]);

    const handleCreate = async () => {
        const selected = tournaments.find((t) => t.id === mode);
        if (!selected) return;

        try {
            const res = await fetch(`/api/discord/guild/${guildId}/create-host-panels`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guildId,
                    tournamentId: selected.id,
                    tournamentName: selected.name,
                }),
            });

            if (!res.ok) throw new Error("Failed to create panel");

            await res.json();
            toast.success(`Created panel for ${selected.name}`);
            setMode(null);
            fetchPanels(); // ✅ Refresh panel list
        } catch (err) {
            toast.error("Failed to create panel");
            console.error(err);
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

                {/* Create Panel Dialog */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="fixed bottom-6 right-6 rounded-full bg-green-500 hover:bg-green-600 text-white w-14 h-14 shadow-lg flex items-center justify-center text-3xl">
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
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setMode(null)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!mode}
                                className="bg-green-500 hover:bg-green-600 text-white"
                            >
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Panels Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {panels.map((panel) => (
                        <div
                            key={panel._id}
                            className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition hover:border-green-500"
                        >
                            {/* Header */}
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-white">{panel.tournamentName}</h3>
                                <p className="text-xs text-gray-400">
                                    {new Date(panel.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Helpers Section */}
                            <div className="mb-6">
                                <h4 className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-2">
                                    Helpers
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="secondary" className="w-full text-xs">Leak</Button>
                                    <Button variant="secondary" className="w-full text-xs">Need Host</Button>
                                    <Button variant="secondary" className="w-full text-xs">Bugged Code</Button>
                                    <Button variant="secondary" className="w-full text-xs">Interested Promo</Button>
                                </div>
                            </div>

                            {/* Admins Section */}
                            <div>
                                <h4 className="text-xs text-blue-400 font-semibold uppercase tracking-wide mb-2">
                                    Admins
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="secondary" className="w-full text-xs">Code Reminder</Button>
                                    <Button variant="secondary" className="w-full text-xs">10 Min Reminder</Button>
                                    <Button variant="secondary" className="w-full text-xs">Push Leaderboard</Button>
                                    <Button variant="secondary" className="w-full text-xs">Create Event</Button>
                                    <Button variant="destructive" className="w-full text-xs">Conclude</Button>
                                    <Button variant="destructive" className="w-full text-xs">Terminate</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
