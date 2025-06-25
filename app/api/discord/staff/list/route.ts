import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();

        if (!data.guildId || !Array.isArray(data.staff)) {
            return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
        }

        return NextResponse.json({
            message: `Received ${data.staff.length} staff members for guild ${data.guildId}`,
        });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            { message: "Failed to process data", error: err.message },
            { status: 500 }
        );
    }
}
