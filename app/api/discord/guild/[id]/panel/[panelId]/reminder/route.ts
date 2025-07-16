import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.connect();

    try {
        const segments = req.nextUrl.pathname.split("/").filter(Boolean);
        const guildId = segments[segments.length - 4];
        const panelId = segments[segments.length - 2];

        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const { tournamentId } = await req.json();

        if (!tournamentId) {
            return NextResponse.json({ message: "Missing tournament ID" }, { status: 400 });
        }

        return NextResponse.json({ tournamentId, guildId, panelId }, { status: 200 });

    } catch (error) {
        let errorMessage = "Failed to send reminder.";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
