import { Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { auth } from "./services/auth/db.server";
import { prisma } from "./services/auth/db.server";

export function initializeSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      if (!token) {
        return next(new Error("Authentication token required"));
      }

      // For now, we'll skip token verification and use a simple check
      // In a real implementation, you'd verify the token properly
      if (typeof token === "string" && token.startsWith("Bearer ")) {
        const actualToken = token.split(" ")[1];
        // Here you would verify the token with Better Auth
        // For simplicity, we'll assume it's valid for now
        socket.data.userId = "temp-user-id"; // Replace with actual user ID from token
      } else {
        return next(new Error("Invalid token format"));
      }

      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.data.userId} connected`);

    // Join user's personal room
    socket.join(`user:${socket.data.userId}`);

    // Handle joining chat rooms
    socket.on("join-chat", (chatId: string) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${socket.data.userId} joined chat ${chatId}`);
    });

    // Handle leaving chat rooms
    socket.on("leave-chat", (chatId: string) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.data.userId} left chat ${chatId}`);
    });

    // Handle typing indicators
    socket.on("typing", (data: { chatId: string; isTyping: boolean }) => {
      socket.to(`chat:${data.chatId}`).emit("user-typing", {
        userId: socket.data.userId,
        isTyping: data.isTyping,
      });
    });

    // Handle message sending
    socket.on("send-message", async (data: { chatId: string; content: string; type?: string; replyToId?: string }) => {
      try {
        // Create message in database
        const message = await prisma.message.create({
          data: {
            id: `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content: data.content,
            senderId: socket.data.userId,
            chatId: data.chatId,
            type: data.type || "text",
            replyToId: data.replyToId,
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

        // Update chat's lastMessageAt
        await prisma.chat.update({
          where: { id: data.chatId },
          data: { lastMessageAt: new Date() },
        });

        // Broadcast message to chat room
        io.to(`chat:${data.chatId}`).emit("new-message", { message });

        // Send notification to other participants
        const chat = await prisma.chat.findUnique({
          where: { id: data.chatId },
          include: {
            participants: {
              where: {
                userId: {
                  not: socket.data.userId,
                },
              },
            },
          },
        });

        if (chat) {
          chat.participants.forEach((participant) => {
            io.to(`user:${participant.userId}`).emit("notification", {
              type: "new-message",
              chatId: data.chatId,
              messageId: message.id,
            });
          });
        }
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle message read status
    socket.on("mark-read", async (data: { messageId: string }) => {
      try {
        await prisma.message.update({
          where: { id: data.messageId },
          data: { status: "read" },
        });

        // Get the message to broadcast the update
        const message = await prisma.message.findUnique({
          where: { id: data.messageId },
          include: {
            chat: true,
          },
        });

        if (message) {
          io.to(`chat:${message.chatId}`).emit("message-read", {
            messageId: data.messageId,
            userId: socket.data.userId,
          });
        }
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`User ${socket.data.userId} disconnected`);
    });
  });

  return io;
}