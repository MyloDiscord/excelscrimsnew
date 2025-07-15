import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import HostPanel from "@/schemas/hostPanels";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const guildId = url.pathname.split("/").filter(Boolean).at(-2);

    if (!guildId) {
      return NextResponse.json({ message: "Missing guildId" }, { status: 400 });
    }

    await db.connect();

    const panels = await HostPanel.find({ guildId }).sort({ createdAt: -1 });

    return NextResponse.json({ panels }, { status: 200 });
    
  } catch (err) {
    console.error("Failed to fetch host panels:", err);
    return NextResponse.json({ message: "Failed to fetch host panels" }, { status: 500 });
  }
}