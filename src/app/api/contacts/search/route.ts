import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// GET /api/contacts/search - Search contacts
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Search query is required" }, { status: 400 });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        status: "accepted",
        OR: [
          {
            contact: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            contact: {
              email: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            nickname: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        contact: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            uniqueCode: true,
          },
        },
      },
    });

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Error searching contacts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}