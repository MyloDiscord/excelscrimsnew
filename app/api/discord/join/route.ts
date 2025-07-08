import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found." }, { status: 401 });
    }

    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 });
    }

    // 1. Get Discord userId
    const discordMe = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const discordUser = await discordMe.json();

    // Guild and role you want to use
    const guildId = process.env.GUILD_ID as string; // The main guild for joining
    const addRoleGuildId = process.env.ADD_ROLE_GUILD_ID as string; // The guild where you want to add the role
    const roleId = process.env.ROLE_ID as string; // The role to add
    const botToken = process.env.DISCORD_BOT_TOKEN as string;

    if (!guildId || !botToken || !addRoleGuildId || !roleId) {
        return NextResponse.json(
            { message: "Server misconfiguration: missing env variables" },
            { status: 500 }
        );
    }

    // 2. Add user to the main guild if needed (optional, depends on your logic)
    // ...your existing add-to-guild logic...

    // 3. Add role to user in another guild
    // First, check if they're in the other guild
    const memberResp = await fetch(
        `https://discord.com/api/v10/guilds/${addRoleGuildId}/members/${discordUser.id}`,
        {
            headers: {
                "Authorization": `Bot ${botToken}`,
            },
        }
    );

    if (memberResp.status !== 200) {
        return NextResponse.json(
            { message: "User is not in the role guild." },
            { status: 404 }
        );
    }

    // Add the role
    const roleResp = await fetch(
        `https://discord.com/api/v10/guilds/${addRoleGuildId}/members/${discordUser.id}/roles/${roleId}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bot ${botToken}`,
            },
        }
    );

    if (roleResp.ok) {
        return NextResponse.json({ message: "Role added to user in other guild!" });
    } else {
        const err = await roleResp.text();
        return NextResponse.json({ message: "Failed to add role", error: err }, { status: roleResp.status });
    }
}
