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

    // 2. Check if user is already in the guild
    const guildId = process.env.GUILD_ID as string;
    const botToken = process.env.DISCORD_BOT_TOKEN as string;

    const checkMemberResp = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUser.id}`,
        {
            headers: {
                "Authorization": `Bot ${botToken}`,
            },
        }
    );

    if (checkMemberResp.status === 200) {
        // User is already in the guild
        return NextResponse.json({ message: "User already in guild!" });
    }

    if (checkMemberResp.status !== 404) {
        // Some error occurred (403, 500, etc.)
        const err = await checkMemberResp.text();
        return NextResponse.json({ message: "Failed to check user membership", error: err }, { status: checkMemberResp.status });
    }

    // 3. Add user to guild if not already in
    const joinResponse = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/members/${discordUser.id}`,
        {
            method: "PUT",
            headers: {
                "Authorization": `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                access_token: accessToken,
            }),
        }
    );

    if (joinResponse.ok) {
        return NextResponse.json({ message: "User added to guild!" });
    } else {
        const err = await joinResponse.text();
        return NextResponse.json({ message: "Failed to add user", error: err }, { status: joinResponse.status });
    }
}
