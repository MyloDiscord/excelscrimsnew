import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

interface StaffRole {
    id: string;
    name: string;
    color: number;
    position: number;
}

interface GuildSettingsDoc {
    guildId: string;
    staffRoles: StaffRole[];
    lastUpdatedBy?: string;
}

export async function GET(req: NextRequest) {
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

    await db.connect();

    const segments = req.nextUrl.pathname.split("/").filter(Boolean);
    const guildId = segments[segments.length - 2];

    if (!guildId) {
        return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
    }

    try {
        const guildSettings = await GuildSettings.findOne({ guildId }).lean() as GuildSettingsDoc | null;

        if (!guildSettings) {
            return NextResponse.json({ staffRoles: [] });
        }

        return NextResponse.json({ staffRoles: guildSettings.staffRoles || [] });

    } catch (error) {
        let errorMessage = "Failed to fetch staff roles";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
