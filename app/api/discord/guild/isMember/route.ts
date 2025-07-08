import { NextRequest, NextResponse } from "next/server";
import { Client } from "discord.js";

const client = new Client({
    intents: ['Guilds', 'GuildMembers'],
});

client.login(process.env.BOT_TOKEN);

export async function POST(req: NextRequest) {
    const { discordId } = await req.json();
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
        return NextResponse.json({ error: "Missing GUILD_ID env variable." }, { status: 500 });
    }
    
    try {
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(discordId);
        if (member) {
            return NextResponse.json({ isMember: true });
        }
        return NextResponse.json({ isMember: false });
    } catch (err) {
        let errorMessage = "unknown";
        if (err instanceof Error) errorMessage = err.message;
        return NextResponse.json({ isMember: false, error: errorMessage });
    }
}
