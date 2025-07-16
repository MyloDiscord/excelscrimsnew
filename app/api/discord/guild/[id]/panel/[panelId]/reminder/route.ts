import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";

const YUNITE_API_TOKEN = process.env.YUNITE_API_TOKEN;
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);

  const guildId = segments[3];
  const panelId = segments[5];

  const { tournamentId } = await req.json();

  if (!tournamentId) {
    return NextResponse.json({ message: "Missing tournament ID" }, { status: 400 });
  }

  await db.connect();

  try {
    const yuniteRes = await fetch(`https://yunite.xyz/api/v3/guild/${guildId}/tournaments/${tournamentId}`, {
      method: "GET",
      headers: {
        "Y-Api-Token": YUNITE_API_TOKEN!,
        "Content-Type": "application/json",
      },
    });

    if (!yuniteRes.ok) {
      return NextResponse.json(
        { message: `Yunite API error`, status: yuniteRes.status },
        { status: yuniteRes.status }
      );
    }

    const tournamentData = await yuniteRes.json();

    const signupChannelId = tournamentData.matchTemplate?.signUpChannelID;
    if (!signupChannelId) {
      return NextResponse.json(
        { message: "Tournament does not have a signup channel" },
        { status: 400 }
      );
    }

    const startDateISO: string | undefined = tournamentData.startDate;
    if (!startDateISO) {
      return NextResponse.json(
        { message: "Missing startDate in tournament data" },
        { status: 400 }
      );
    }

    const unixTimestamp = Math.floor(new Date(startDateISO).getTime() / 1000);

    const discordMessage = {
      content: `**${tournamentData.name}**\nStart Time: <t:${unixTimestamp}:F>`,
    };

    const discordRes = await fetch(`https://discord.com/api/v10/channels/${signupChannelId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(discordMessage),
    });

    if (!discordRes.ok) {
      const errorText = await discordRes.text();
      console.error("Discord API error:", errorText);
      return NextResponse.json(
        { message: "Failed to send Discord message", status: discordRes.status },
        { status: discordRes.status }
      );
    }

    return NextResponse.json(
      {
        success: true,
        guildId,
        panelId,
        discordMessageSent: true,
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
