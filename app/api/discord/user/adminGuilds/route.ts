import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found." }, { status: 401 });
    };

    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 });
    };

    try {
        const userGuildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!userGuildsResponse.ok) {
            return NextResponse.json({ message: "Failed to fetch Discord guilds" }, { status: userGuildsResponse.status });
        }

        const userGuilds = await userGuildsResponse.json();
        const adminGuilds = userGuilds.filter((guild: any) => (BigInt(guild.permissions) & BigInt(0x8)) !== BigInt(0));

        const botGuildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        if (!botGuildsResponse.ok) {
            return NextResponse.json({ message: "Failed to fetch bot guilds" }, { status: botGuildsResponse.status });
        };

        const botGuilds = await botGuildsResponse.json();
        const botGuildIds = new Set(botGuilds.map((g: any) => g.id));

        const known = adminGuilds.filter((guild: any) => botGuildIds.has(guild.id));
        const unknown = adminGuilds.filter((guild: any) => !botGuildIds.has(guild.id));

        return NextResponse.json({ known, unknown });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching admin guilds" }, { status: 500 });
    }
}