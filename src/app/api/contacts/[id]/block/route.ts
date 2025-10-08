import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// POST /api/contacts/:id/block - Block contact
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Check if contact exists and belongs to user
    const contact = await prisma.contact.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: { status: "blocked" },
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

    return NextResponse.json({ contact: updatedContact });
  } catch (error) {
    console.error("Error blocking contact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}