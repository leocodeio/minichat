import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/services/auth/db.server";
import { prisma } from "@/server/services/auth/db.server";

// GET /api/contacts - Get all contacts
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contacts = await prisma.contact.findMany({
      where: {
        userId: session.user.id,
        status: "accepted",
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
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/contacts/add - Add contact by unique code
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { uniqueCode } = body;

    if (!uniqueCode) {
      return NextResponse.json({ error: "Unique code is required" }, { status: 400 });
    }

    // Find the user by unique code
    const contactUser = await prisma.user.findUnique({
      where: { uniqueCode },
      select: { id: true, name: true, email: true },
    });

    if (!contactUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (contactUser.id === session.user.id) {
      return NextResponse.json({ error: "Cannot add yourself as a contact" }, { status: 400 });
    }

    // Check if contact already exists
    const existingContact = await prisma.contact.findUnique({
      where: {
        userId_contactId: {
          userId: session.user.id,
          contactId: contactUser.id,
        },
      },
    });

    if (existingContact) {
      return NextResponse.json({ error: "Contact already exists" }, { status: 400 });
    }

    // Create the contact
    const contact = await prisma.contact.create({
      data: {
        id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        contactId: contactUser.id,
        status: "accepted",
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

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}