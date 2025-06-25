import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

type DiscordChannel = {
    id: string;
    name: string;
    type: number;
};

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found." }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const accessToken = clerkResponse.data[0]?.token || "";

    if (!accessToken) {
        return NextResponse.json({ message: "Access token not found" }, { status: 401 });
    }

    try {
        const segments = req.nextUrl.pathname.split("/").filter(Boolean);
        const guildId = segments[segments.length - 2];

        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch channels from Discord", status: res.status },
                { status: res.status }
            );
        }

        const channels: DiscordChannel[] = await res.json();

        const validChannels = channels
            .filter((channel) => [0, 5].includes(channel.type))
            .map((channel) => ({
                id: channel.id,
                name: channel.name,
            }));

        return NextResponse.json(validChannels);
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            {
                message: "Error fetching channels",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
