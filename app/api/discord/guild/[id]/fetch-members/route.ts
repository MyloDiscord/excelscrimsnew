import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

type DiscordGuild = {
    id: string;
    name: string;
    icon: string | null;
    owner: boolean;
    permissions: string;
    features: string[];
};

export async function GET() {
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
        // Fetch user guilds with user token
        const userGuildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!userGuildsResponse.ok) {
            return NextResponse.json(
                { message: "Failed to fetch Discord guilds" },
                { status: userGuildsResponse.status }
            );
        }

        const userGuilds: DiscordGuild[] = await userGuildsResponse.json();

        // Filter guilds where user has admin (permission bit 0x8)
        const adminGuilds = userGuilds.filter(
            (guild) => (BigInt(guild.permissions) & BigInt(0x8)) !== BigInt(0)
        );

        // Fetch bot guilds with bot token
        const botGuildsResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
            method: "GET",
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json",
            },
        });

        if (!botGuildsResponse.ok) {
            return NextResponse.json(
                { message: "Failed to fetch bot guilds" },
                { status: botGuildsResponse.status }
            );
        }

        const botGuilds: DiscordGuild[] = await botGuildsResponse.json();
        const botGuildIds = new Set(botGuilds.map((g) => g.id));

        const known = adminGuilds.filter((guild) => botGuildIds.has(guild.id));
        const unknown = adminGuilds.filter((guild) => !botGuildIds.has(guild.id));

        // Fetch member counts for known guilds
        const knownWithCounts = await Promise.all(
            known.map(async (guild) => {
                try {
                    const guildDetailsResponse = await fetch(
                        `https://discord.com/api/v10/guilds/${guild.id}?with_counts=true`,
                        {
                            headers: {
                                Authorization: `Bot ${BOT_TOKEN}`,
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!guildDetailsResponse.ok) {
                        throw new Error(`Failed to fetch guild details for ${guild.id}`);
                    }

                    const guildDetails = await guildDetailsResponse.json();

                    return {
                        ...guild,
                        approximate_member_count: guildDetails.approximate_member_count ?? null,
                        approximate_presence_count: guildDetails.approximate_presence_count ?? null,
                        approximate_offline_count:
                            guildDetails.approximate_member_count && guildDetails.approximate_presence_count
                                ? guildDetails.approximate_member_count - guildDetails.approximate_presence_count
                                : null,
                    };
                } catch {
                    return {
                        ...guild,
                        approximate_member_count: null,
                        approximate_presence_count: null,
                        approximate_offline_count: null,
                    };
                }
            })
        );

        return NextResponse.json({ known: knownWithCounts, unknown });
    } catch (error: unknown) {
        const err = error as Error;

        return NextResponse.json(
            {
                message: "Error fetching admin guilds",
                error: err.message,
            },
            { status: 500 }
        );
    }
}
