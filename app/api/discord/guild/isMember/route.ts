// /app/api/discord/guild/isMember/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { discordId } = await req.json();
    const guildId = process.env.GUILD_ID;
    const botToken = process.env.DISCORD_BOT_TOKEN;

    if (!guildId || !botToken) {
        return NextResponse.json({ error: "Missing env vars" }, { status: 500 });
    }

    try {
        const resp = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/members/${discordId}`,
            {
                headers: {
                    "Authorization": `Bot ${botToken}`,
                },
            }
        );

        if (resp.status === 200) {
            return NextResponse.json({ isMember: true });
        }
        // 404 = not found = not a member
        return NextResponse.json({ isMember: false });
    } catch (err) {
        return NextResponse.json({ isMember: false, error: (err as Error).message });
    }
}
