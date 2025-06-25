import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

type DiscordRoleFromApi = {
    id: string;
    name: string;
    position: number;
    color: number | null;
};

type FormattedRole = {
    id: string;
    name: string;
    position: number;
    color: number;
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

        const roles: DiscordRoleFromApi[] = await res.json();

        const formattedRoles: FormattedRole[] = roles
            .filter(role => role.name !== "@everyone")
            .sort((a, b) => b.position - a.position)
            .map((role) => ({
                id: role.id,
                name: role.name,
                position: role.position,
                color: role.color ?? 0,
            }));

        return NextResponse.json(formattedRoles);
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
