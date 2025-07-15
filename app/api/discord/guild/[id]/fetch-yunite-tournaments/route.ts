import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";

const YUNITE_API_TOKEN = process.env.YUNITE_API_TOKEN;

type YuniteTournament = {
    id: string;
    name: string;
    description: string;
    queueSize: number;
    startDate: string;
    endDate: string;
    [key: string]: any;
};

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

    await db.connect();

    try {
        const segments = req.nextUrl.pathname.split("/").filter(Boolean);
        const guildId = segments[segments.length - 2];

        if (!guildId) {
            return NextResponse.json({ message: "Missing guild ID" }, { status: 400 });
        }

        const yuniteRes = await fetch(`https://yunite.xyz/api/v3/guild/${guildId}/tournaments`, {
            headers: {
                "Y-Api-Token": YUNITE_API_TOKEN!,
            },
        });

        if (!yuniteRes.ok) {
            return NextResponse.json({ message: "Failed to fetch Yunite tournaments" }, { status: yuniteRes.status });
        }

        const tournaments: YuniteTournament[] = await yuniteRes.json();

        tournaments.sort((a, b) => {
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });


        return NextResponse.json({ tournaments }, { status: 200 });

    } catch (error) {
        let errorMessage = "Failed to fetch Yunite tournaments";
        if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message?: string }).message || errorMessage;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
