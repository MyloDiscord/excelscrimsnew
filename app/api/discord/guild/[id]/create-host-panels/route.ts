import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import HostPanel from "@/schemas/hostPanels";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!;

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const guildId = params.id;
    const body = await req.json();
    await db.connect();

    const { tournamentName, startDate, tournamentData } = body;

    const startTime = new Date(startDate);
    const endTime = new Date(startTime.getTime() + 5 * 60 * 60 * 1000);

    const signupChannelId = tournamentData?.matchTemplate?.signUpChannelID;

    if (!signupChannelId || isNaN(startTime.getTime())) {
      return NextResponse.json(
        { message: "Missing signup channel or start date" },
        { status: 400 }
      );
    }

    const discordRes = await fetch(`https://discord.com/api/v10/guilds/${guildId}/scheduled-events`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: tournamentName,
        scheduled_start_time: startTime.toISOString(),
        scheduled_end_time: endTime.toISOString(),
        privacy_level: 2,
        entity_type: 3,
        channel_id: null,
        entity_metadata: {
          location: `<#${signupChannelId}>`,
        },
      }),
    });

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.error("Discord API error:", errText);
      return NextResponse.json({ message: "Failed to create Discord event" }, { status: 500 });
    }

    const discordEvent = await discordRes.json();
    const eventLink = `https://discord.com/events/${guildId}/${discordEvent.id}`;

    const newPanel = await HostPanel.create({
      ...body,
      guildId,
      createdBy: userId,
      createdAt: new Date(),
      eventLink,
      tournamentData,
    });

    return NextResponse.json(newPanel, { status: 201 });
  } catch (err) {
    console.error("Failed to create host panel:", err);
    return NextResponse.json({ message: "Failed to create host panel" }, { status: 500 });
  }
}

