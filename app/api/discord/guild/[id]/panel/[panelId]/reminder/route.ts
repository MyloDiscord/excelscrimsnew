import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";

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

  return NextResponse.json(
    { success: true, guildId, panelId, tournamentId },
    { status: 200 }
  );
}
