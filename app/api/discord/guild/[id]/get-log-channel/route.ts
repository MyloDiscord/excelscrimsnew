import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

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

    try {
        const segments = req.nextUrl.pathname.split("/").filter(Boolean);
        const guildId = segments[segments.length - 2];

        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const settings = await GuildSettings.findOne({ guildId });

        if (!settings || !settings.logChannel) {
            return NextResponse.json({ message: "Log channel not set", logChannel: null });
        }

        return NextResponse.json({ logChannel: settings.logChannel });
    } catch (error) {
        let errorMessage = "Failed to fetch log channel";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
