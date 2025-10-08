import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/services/auth/db.server";

// GET /api/user/by-code/:code - Find user by unique code
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { uniqueCode: code },
      select: {
        id: true,
        name: true,
        image: true,
        uniqueCode: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error finding user by code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}