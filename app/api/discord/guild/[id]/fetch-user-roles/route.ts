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

        const guildInfoRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}`, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
            },
        });

        if (!guildInfoRes.ok) {
            return NextResponse.json({ message: "Failed to fetch guild info" }, { status: 500 });
        }

        const guild = await guildInfoRes.json();


        const memberData = await memberRes.json();
        const userRoles: string[] = memberData.roles;

        const staffRoleIds = settings.staffRoles.map((role: { id: string }) => role.id);
        const isStaff = userRoles.some(roleId => staffRoleIds.includes(roleId));

        if (!isStaff) {
            return NextResponse.json({ message: "You do not have permission" }, { status: 403 });
        }

        return NextResponse.json({
            message: "Authorized",
            guildName: guild.name,
        });

    } catch (error) {
        let errorMessage = "Failed to fetch user roles";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
