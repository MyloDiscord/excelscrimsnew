import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await db.connect();
    console.log('db connected - processing...');

    try {
        const segments = req.nextUrl.pathname.split("/").filter(Boolean);
        const guildId = segments[segments.length - 2];

        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const body = await req.json();
        const { staffRoles, lastUpdatedBy } = body;

        if (
            !Array.isArray(staffRoles) ||
            staffRoles.some(
                (r: any) =>
                    !r.id || !r.name || typeof r.position !== "number" || typeof r.color !== "number"
            )
        ) {
            return NextResponse.json({ message: "Invalid staffRoles format" }, { status: 400 });
        }

        const updated = await GuildSettings.findOneAndUpdate(
            { guildId },
            {
                guildId,
                staffRoles,
                lastUpdatedBy: lastUpdatedBy || userId,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ message: "Staff roles saved successfully", updated });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to save staff roles", error: error.message }, { status: 500 });
    }
}
