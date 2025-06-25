import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const discordId = params.id;

    if (!discordId) {
        return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
    }

    try {
        const res = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!res.ok) {
            return NextResponse.json({ message: "Failed to fetch user from Discord" }, { status: res.status });
        }

        const user = await res.json();

        return NextResponse.json({
            id: user.id,
            username: `${user.username}#${user.discriminator ?? user.global_name ?? ""}`,
            avatar: user.avatar
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : null,
        });
    } catch (error: unknown) {
        const err = error as Error;

        return NextResponse.json({
            message: "Unexpected error while fetching Discord user",
            error: err.message,
        }, { status: 500 });
    }
}
