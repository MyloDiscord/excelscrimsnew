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
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";


export default function HostPage() {
    const { id: guildId } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [guildName, setGuildName] = useState<string | null>(null);

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
                setLoading(false);
            } catch {
                console.error("Error fetching");
                setError("Something went wrong while verifying access. Please try again later.");
            }
        };

        checkAccess();
    }, [guildId]);

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
                            className="fixed bottom-6 right-6 rounded-full bg-green-500 hover:bg-green-600 text-white text-3xl w-14 h-14 shadow-lg"
                        >
                            +
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create Host Panel</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <label className="text-sm font-medium text-gray-300">Select Mode</label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Choose an option..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="solos">Solos</SelectItem>
                                    <SelectItem value="duos">Duos</SelectItem>
                                    <SelectItem value="trios">Trios</SelectItem>
                                    <SelectItem value="squads">Squads</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogContent>
                </Dialog>

            </main>
        </div>
    );
}
