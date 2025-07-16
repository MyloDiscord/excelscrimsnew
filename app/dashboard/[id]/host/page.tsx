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
    tournamentId: string;
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
    const [reminderLoadingId, setReminderLoadingId] = useState<string | null>(null);

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

    const handleReminder = async (panelId: string, tournamentId: string) => {
        setReminderLoadingId(panelId);
        try {
            const res = await fetch(`/api/discord/guild/${guildId}/panel/${panelId}/reminder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tournamentId }),
            });

            if (!res.ok) throw new Error("Failed to send reminder");

            toast.success("Reminder sent!");
        } catch (err) {
            toast.error("Failed to send reminder");
            console.error("Reminder error:", err);
        } finally {
            setReminderLoadingId(null);
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

                <div className="grid gap-5 mt-8 w-full justify-center grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
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
                            className="bg-[#1a1a1a] border border-[#2a2a2e] rounded-xl p-4 shadow-md space-y-4 hover:border-green-500 transition"
                        >
                            <div className="flex justify-between items-center text-sm text-white font-semibold">
                                <span>{panel.tournamentName}</span>
                                <span className="text-neutral-400 text-xs">
                                    {new Date(panel.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div>
                                <div className="text-xs text-green-400 font-bold uppercase tracking-wider mb-2">
                                    Helpers
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    {["Leak", "Need Host", "Code Bug", "Promo"].map((label) => (
                                        <Button
                                            key={label}
                                            variant="secondary"
                                            className="bg-white text-black px-3 py-1 rounded-md text-xs hover:bg-gray-100 transition cursor-pointer"
                                        >
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <hr className="border-t border-neutral-700" />

                            <div>
                                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">
                                    Admin Actions
                                </div>
                                <div className="flex flex-wrap gap-2 text-sm">
                                    {/* Reminder Button */}
                                    <Button
                                        onClick={() => handleReminder(panel._id, panel.tournamentId)}
                                        disabled={reminderLoadingId === panel._id}
                                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {reminderLoadingId === panel._id && (
                                            <svg
                                                className="w-4 h-4 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                />
                                            </svg>
                                        )}
                                        Reminder
                                    </Button>

                                    {/* Other action buttons (placeholder logic) */}
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer">
                                        10 Min
                                    </Button>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer">
                                        Push LB
                                    </Button>
                                    <Button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer">
                                        Create Event
                                    </Button>

                                    <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer">
                                        Conclude
                                    </Button>
                                    <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition cursor-pointer">
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
