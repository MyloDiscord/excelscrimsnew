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

    const discordMe = await fetch("https://discord.com/api/users/@me", {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    const discordUser = await discordMe.json();

    const guildId = process.env.GUILD_ID as string;
    const addRoleGuildId = process.env.ADD_ROLE_GUILD_ID as string;
    const roleId = process.env.ROLE_ID as string;
    const botToken = process.env.DISCORD_BOT_TOKEN as string;

    if (!guildId || !addRoleGuildId || !roleId || !botToken) {
        return NextResponse.json(
            { message: "Server misconfiguration: missing env variables" },
            { status: 500 }
        );
    }

    // Helper to join a guild if not already in
    async function ensureInGuild(targetGuildId: string) {
        const memberCheck = await fetch(
            `https://discord.com/api/v10/guilds/${targetGuildId}/members/${discordUser.id}`,
            {
                headers: { "Authorization": `Bot ${botToken}` },
            }
        );

        if (memberCheck.status === 200) {
            // Already in guild
            return { joined: false, message: "Already in guild." };
        }
        if (memberCheck.status !== 404) {
            // Some other error
            const err = await memberCheck.text();
            throw new Error("Failed to check user membership: " + err);
        }

        // Not in guild, attempt to add
        const joinResp = await fetch(
            `https://discord.com/api/v10/guilds/${targetGuildId}/members/${discordUser.id}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bot ${botToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ access_token: accessToken }),
            }
        );
        if (!joinResp.ok) {
            const err = await joinResp.text();
            throw new Error(`Failed to add user to guild (${targetGuildId}): ` + err);
        }
        return { joined: true, message: "User added to guild." };
    }

    try {
        // 1. Join user to the main guild
        await ensureInGuild(guildId);

        // 2. Join user to the role guild (may be same as main)
        await ensureInGuild(addRoleGuildId);

        // 3. Add role in the role guild
        const roleResp = await fetch(
            `https://discord.com/api/v10/guilds/${addRoleGuildId}/members/${discordUser.id}/roles/${roleId}`,
            {
                method: "PUT",
                headers: {
                    "Authorization": `Bot ${botToken}`,
                },
            }
        );
        if (!roleResp.ok) {
            const err = await roleResp.text();
            throw new Error("Failed to add role: " + err);
        }

        return NextResponse.json({ message: "User joined guild(s) and role added!" });

    } catch (error) {
        let message = "Unknown error";
        if (error instanceof Error) {
            message = error.message;
        }
        return NextResponse.json({ message }, { status: 500 });
    }
}
