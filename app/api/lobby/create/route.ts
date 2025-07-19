import { NextResponse } from "next/server";
import db from "@/lib/mongoose"; // adjust if your DB file is elsewhere
import LobbyData from "@/schemas/lobbyDataSchema"; // adjust the import path

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guildId, lobbyId } = body;

    if (!guildId) {
      return NextResponse.json({ message: "guildId is required" }, { status: 400 });
    }

    await db.connect();

    const existing = await LobbyData.findOne({ guildId });

    if (existing) {
      existing.lobbyId = lobbyId || existing.lobbyId;
      await existing.save();
      return NextResponse.json({ message: "Lobby updated", data: existing });
    }

    const newLobby = await LobbyData.create({ guildId, lobbyId });

    return NextResponse.json({ message: "Lobby created", data: newLobby });
  } catch (error) {
    console.error("[API][Create Lobby]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
