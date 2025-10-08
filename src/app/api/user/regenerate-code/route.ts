import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";
import { generateUniqueCode } from "@/lib/utils";

// POST /api/user/regenerate-code - Generate new unique code
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a new unique code
    let newCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      newCode = generateUniqueCode();
      attempts++;

      if (attempts > maxAttempts) {
        return NextResponse.json({ error: "Unable to generate unique code" }, { status: 500 });
      }
    } while (await prisma.user.findUnique({ where: { uniqueCode: newCode } }));

    // Update user with new code
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { uniqueCode: newCode },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        uniqueCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error regenerating unique code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}