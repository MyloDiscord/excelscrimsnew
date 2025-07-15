import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import GuildSettings from "@/schemas/guildSettings";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await clerkClient();
    const discordTokenResponse = await client.users.getUserOauthAccessToken(userId, "discord");

    const discordAccessToken = discordTokenResponse.data[0]?.token;
    const discordUserId = discordTokenResponse.data[0]?.externalAccountId;

    if (!discordAccessToken || !discordUserId) {
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

        if (!settings || !settings.staffRoles.length) {
            return NextResponse.json({ message: "Staff roles not set", staffRoles: null });
        }

        const memberRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!memberRes.ok) {
            return NextResponse.json({ message: "Failed to fetch user from guild", status: memberRes.status }, { status: 403 });
        }

        const memberData = await memberRes.json();
        const userRoles: string[] = memberData.roles;

        const staffRoleIds = settings.staffRoles.map((role: { id: string }) => role.id);
        const isStaff = userRoles.some(roleId => staffRoleIds.includes(roleId));

        if (!isStaff) {
            return NextResponse.json({ message: "You do not have permission" }, { status: 403 });
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
