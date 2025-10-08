import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// GET /api/chats - Get all user chats (with last message)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                uniqueCode: true,
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    return NextResponse.json({ chats });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/chats - Create new chat
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { participantIds } = body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0) {
      return NextResponse.json({ error: "Participant IDs are required" }, { status: 400 });
    }

    // Check if all participants exist
    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: participantIds,
        },
      },
    });

    if (participants.length !== participantIds.length) {
      return NextResponse.json({ error: "Some participants not found" }, { status: 404 });
    }

    // Check if a chat already exists with these participants
    const existingChat = await prisma.chat.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: [...participantIds, session.user.id],
            },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (existingChat) {
      return NextResponse.json({ chat: existingChat });
    }

    // Create new chat
    const chat = await prisma.chat.create({
      data: {
        id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        participants: {
          create: [...participantIds, session.user.id].map((userId) => ({
            id: `participant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                uniqueCode: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ chat });
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}