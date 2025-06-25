import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

interface StaffRole {
    id: string;
    name: string;
    position: number;
    color: number;
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const discordTokenResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const discordAccessToken = discordTokenResponse.data[0]?.token;

    if (!discordAccessToken) {
        return NextResponse.json({ message: "Discord not linked or access token missing" }, { status: 401 });
    }

    const discordUserRes = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${discordAccessToken}`,
        },
    });

    if (!discordUserRes.ok) {
        return NextResponse.json({ message: "Failed to fetch Discord user info" }, { status: 500 });
    }

    const discordUser = await discordUserRes.json();
    const discordUserId = discordUser.id as string;

    await db.connect();
    console.log("db connected - processing...");

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
                (r: StaffRole) =>
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
                lastUpdatedBy: lastUpdatedBy || discordUserId || userId,
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        return NextResponse.json({ message: "Staff roles saved successfully", updated });
    } catch (error) {
        let errorMessage = "Failed to save staff roles";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
