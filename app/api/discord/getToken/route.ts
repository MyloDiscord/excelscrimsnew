import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "User not found." });
    };

    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 });
    };

    const discordUrl = "https://discord.com/api/users/@me";

    try {
        const discordResponse = await fetch(discordUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        if (!discordResponse.ok) {
            return NextResponse.json({ message: "Failed to fetch Discord user data" }, { status: discordResponse.status });
        }

        const discordUser = await discordResponse.json();

        const me = [{
            username: discordUser.username,
            userId: discordUser.id,
            userAvatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
            accessToken: accessToken,
        }];

        return NextResponse.json({ me });
    } catch (error) {
        return NextResponse.json({ message: "Error fetching Discord user data" }, { status: 500 });
    }
}