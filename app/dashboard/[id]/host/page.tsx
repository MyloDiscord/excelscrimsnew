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
    const [creating, setCreating] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const fetchPanels = async () => {
        try {
            const res = await fetch(`/api/discord/guild/${guildId}/fetch-host-panels`);
            if (!res.ok) throw new Error("Failed to fetch panels");
            const data = await res.json();

            const sorted = [...(data.panels || [])].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPanels(sorted);
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
        fetchPanels();
    }, [guildId]);

    const handleCreate = async () => {
        const selected = tournaments.find((t) => t.id === mode);
        if (!selected) return;

        setCreating(true);

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
            fetchPanels();
            setDialogOpen(false);
        } catch (err) {
            toast.error("Failed to create panel");
            console.error(err);
        } finally {
            setCreating(false);
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

    const PanelSkeleton = () => (
        <div className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.4)] animate-pulse space-y-4">
            <div className="h-5 w-1/2 bg-neutral-700 rounded" />
            <div className="h-4 w-1/3 bg-neutral-800 rounded" />

            <div className="space-y-2 mt-4">
                <div className="h-4 w-24 bg-green-800 rounded" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                </div>
            </div>

            <div className="space-y-2 mt-4">
                <div className="h-4 w-20 bg-blue-800 rounded" />
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-neutral-700 rounded" />
                    <div className="h-10 bg-red-800 rounded" />
                    <div className="h-10 bg-red-800 rounded" />
                </div>
            </div>
        </div>
    );


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

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg text-white text-3xl leading-none flex items-center justify-center transition-transform duration-150 hover:scale-105"
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
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setMode(null)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleCreate}
                                disabled={!mode || creating}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-medium transition duration-150 disabled:opacity-50"
                            >
                                {creating ? "Creating..." : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
                    {panels.length === 0 && !error && (
                        <>
                            <PanelSkeleton />
                            <PanelSkeleton />
                            <PanelSkeleton />
                        </>
                    )}

                    {panels.map((panel) => (
                        <div
                            key={panel._id}
                            className="bg-[#1c1c1e] border border-[#2a2a2e] rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition hover:border-green-500"
                        >
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-white">{panel.tournamentName}</h3>
                                <p className="text-xs text-gray-400">
                                    {new Date(panel.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-xs text-green-400 font-semibold uppercase tracking-wide mb-2">
                                    Helpers
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {["Leak", "Need Host", "Code Bug", "Promo"].map((label) => (
                                        <Button
                                            key={label}
                                            variant="secondary"
                                            className="w-full text-sm font-medium py-2 px-3 rounded-md bg-white text-black hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                    {[
                                        "Reminder",
                                        "10 Min",
                                        "Push LB",
                                        "Create Event",
                                    ].map((label) => (
                                        <Button
                                            key={label}
                                            className="w-full text-sm font-medium py-2 px-3 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 transition text-center break-words"
                                        >
                                            {label}
                                        </Button>
                                    ))}

                                    <Button
                                        className="w-full text-sm font-semibold py-2 px-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-center"
                                    >
                                        Conclude
                                    </Button>
                                    <Button
                                        className="w-full text-sm font-semibold py-2 px-3 rounded-md bg-red-600 text-white hover:bg-red-700 transition text-center"
                                    >
                                        Terminate
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
