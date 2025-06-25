import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    try {
        const guildId = context.params.id;
        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const res = await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!res.ok) {
            return NextResponse.json(
                { message: "Failed to fetch roles from Discord", status: res.status },
                { status: res.status }
            );
        }

        const roles = await res.json();

        return NextResponse.json({ roles });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            {
                message: "Error fetching roles",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
