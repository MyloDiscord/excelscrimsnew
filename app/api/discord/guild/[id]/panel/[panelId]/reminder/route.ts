import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";

export async function POST(
    req: NextRequest,
    { params }: { params: { guildId: string; panelId: string } }
) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { guildId, panelId } = params;
    const { tournamentId } = await req.json();

    if (!tournamentId) {
        return NextResponse.json({ message: "Missing tournament ID" }, { status: 400 });
    }

    await db.connect();

    return NextResponse.json(
        { success: true, guildId, panelId, tournamentId },
        { status: 200 }
    );
}
