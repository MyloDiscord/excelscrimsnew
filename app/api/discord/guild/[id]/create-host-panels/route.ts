import { NextRequest, NextResponse } from "next/server";
import { auth} from "@clerk/nextjs/server";
import db from "@/lib/mongoose";
import HostPanel from "@/schemas/hostPanels";
import { useUser } from "@clerk/nextjs";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { user } = useUser();

      const discordId =
    user?.externalAccounts?.find((acc) => acc.provider === "discord")
      ?.providerUserId || userId;

    const body = await req.json();
    await db.connect();

    const newPanel = await HostPanel.create({
      ...body,
      createdBy: discordId,
      createdAt: new Date(),
    });

    return NextResponse.json(newPanel, { status: 201 });

  } catch (err) {
    console.error("Failed to create host panel:", err);
    return NextResponse.json({ message: "Failed to create host panel" }, { status: 500 });
  }
}
