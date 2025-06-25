import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

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
        const logChannel = body.logChannel;

        if (!logChannel || typeof logChannel !== "string") {
            return NextResponse.json({ message: "Invalid or missing logChannel" }, { status: 400 });
        }

        const updated = await GuildSettings.findOneAndUpdate(
            { guildId },
            { logChannel, lastUpdatedBy: discordUserId },
            { new: true, upsert: true }
        );

        return NextResponse.json({ message: "Log channel saved successfully", updated });
    } catch (error) {
        let errorMessage = "Failed to save log channel";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
