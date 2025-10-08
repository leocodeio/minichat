import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// POST /api/messages/bulk-read - Mark multiple as read
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { messageIds } = body;

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: "Message IDs are required" }, { status: 400 });
    }

    // Update all messages to read status
    await prisma.message.updateMany({
      where: {
        id: {
          in: messageIds,
        },
        chat: {
          participants: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
      data: { status: "read" },
    });

    return NextResponse.json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}