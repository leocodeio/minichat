import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// POST /api/messages - Send message
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, chatId, type = "text", replyToId } = body;

    if (!content || !chatId) {
      return NextResponse.json({ error: "Content and chatId are required" }, { status: 400 });
    }

    // Check if user is a participant in the chat
    const chatParticipant = await prisma.chatParticipant.findFirst({
      where: {
        chatId,
        userId: session.user.id,
      },
    });

    if (!chatParticipant) {
      return NextResponse.json({ error: "Not a participant in this chat" }, { status: 403 });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        id: `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        senderId: session.user.id,
        chatId,
        type,
        replyToId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Update the chat's lastMessageAt
    await prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}