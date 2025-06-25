import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
const botToken = process.env.DISCORD_BOT_TOKEN;

export async function GET(request: Request, { params }: { params: { id: string } }) {

    if (!params || !params.id) {
        return NextResponse.json({ message: "Guild ID not provided." }, { status: 400 });
    }

    const { userId } = await auth();
    const guildId = await params.id;
    console.log("guild id from route:", guildId);

    if (!userId) {
        return NextResponse.json({ message: "User not found." }, { status: 401 });
    };

    if (!guildId) {
        return NextResponse.json({ message: "Guild not found." }, { status: 401 });
    };

    const client = await clerkClient();
    const clerkResponse = await client.users.getUserOauthAccessToken(userId, "discord");
    const accessToken = clerkResponse.data[0]?.token || '';

    if (!accessToken) {
        return NextResponse.json({ message: 'Access token not found' }, { status: 401 });
    };

    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}?with_counts=true`, {
        method: "GET",
        headers: {
            "Authorization": `Bot ${botToken}`,
        },
    });

    const data = await response.json();

    const approximateMemberCount = data.approximate_member_count || null;
    const approximatePresenceCount = data.approximate_presence_count || null;

    return NextResponse.json({
        statusCode: 200,
        approximateMemberCount,
        approximatePresenceCount
    }, { status: 200 });
}
