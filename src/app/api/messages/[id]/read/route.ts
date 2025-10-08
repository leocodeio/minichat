import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// POST /api/messages/:id/read - Mark as read
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Check if message exists and user is a participant in the chat
    const message = await prisma.message.findFirst({
      where: {
        id,
        chat: {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    });

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Update message status to read
    await prisma.message.update({
      where: { id },
      data: { status: "read" },
    });

    return NextResponse.json({ message: "Message marked as read" });
  } catch (error) {
    console.error("Error marking message as read:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}