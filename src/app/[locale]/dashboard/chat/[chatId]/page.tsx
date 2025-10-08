"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "@/server/services/auth/auth-client";
import { useWebSocket } from "@/hooks/use-websocket";
import { Button } from "@/components/ui/button";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatBody } from "@/components/chat/chat-body";
import { ChatFooter } from "@/components/chat/chat-footer";
import { EmptyChat } from "@/components/chat/empty-chat";
import { Menu, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface ChatParticipant {
  user: {
    id: string;
    name: string;
    image?: string;
    uniqueCode?: string;
  };
}

interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
  description?: string;
  lastMessageAt?: string;
  participants: ChatParticipant[];
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  status: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.chatId as string;
  const {
    connect,
    joinChat,
    leaveChat,
    sendMessage: wsSendMessage,
    markMessageRead,
    typingUsers,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessageRead,
    onlineUsers,
    isConnected,
  } = useWebSocket();

  const [user, setUser] = useState<User | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();
        if (session?.data?.user) {
          setUser({
            id: session.data.user.id,
            name: session.data.user.name || "User",
            email: session.data.user.email,
            image: session.data.user.image || undefined,
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to get session:", error);
        router.push("/login");
      }
    };

    fetchSession();
  }, [router]);

  const fetchChat = useCallback(async () => {
    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const data = await response.json();
        setChat(data.chat);
      } else {
        toast.error("Failed to load chat");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
      toast.error("Failed to load chat");
      router.push("/dashboard");
    }
  }, [chatId, router]);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setMessagesLoading(false);
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (chatId && user) {
      fetchChat();
      fetchMessages();
      // Connect to WebSocket and join chat room
      connect();
      joinChat(chatId);
    }

    return () => {
      // Leave chat room when component unmounts or chatId changes
      if (chatId) {
        leaveChat(chatId);
      }
    };
  }, [chatId, user, connect, joinChat, leaveChat, fetchChat, fetchMessages]);

  // Set up WebSocket event listeners
  useEffect(() => {
    const unsubscribeNewMessage = onNewMessage((message) => {
      if (message.chatId === chatId) {
        setMessages(prev => {
          // Check if message already exists (to avoid duplicates)
          if (prev.some(m => m.id === message.id)) {
            return prev;
          }
          return [...prev, message];
        });
      }
    });

    const unsubscribeMessageRead = onMessageRead(({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, status: 'read' as const }
            : msg
        )
      );
    });

    return () => {
      unsubscribeNewMessage();
      unsubscribeMessageRead();
    };
  }, [chatId, onNewMessage, onMessageRead]);

  const handleSendMessage = useCallback((content: string, replyToId?: string) => {
    if (!user || !isConnected) {
      toast.error("Not connected to chat server");
      return;
    }

    // Stop typing indicator
    stopTyping(chatId);

    // Send message via WebSocket
    wsSendMessage(chatId, content, replyToId);
    setReplyTo(null);
  }, [user, isConnected, chatId, wsSendMessage, stopTyping]);

  // Handle typing indicators
  const handleTypingStart = useCallback(() => {
    if (isConnected) {
      startTyping(chatId);
    }
  }, [isConnected, chatId, startTyping]);

  const handleTypingStop = useCallback(() => {
    if (isConnected) {
      stopTyping(chatId);
    }
  }, [isConnected, chatId, stopTyping]);

  const handleMessageRead = useCallback((messageId: string) => {
    if (isConnected) {
      markMessageRead(messageId);
    }
  }, [isConnected, markMessageRead]);

  // Convert typing user IDs to names
  const getTypingUserNames = useCallback((userIds: string[]) => {
    if (!chat) return [];
    return userIds
      .map(userId => {
        const participant = chat.participants.find(p => p.user.id === userId);
        return participant?.user.name || userId;
      })
      .filter(name => name !== user?.name); // Don't show current user as typing
  }, [chat, user?.name]);

  // Check if any participant in the chat is online
  const getChatOnlineStatus = useCallback(() => {
    if (!chat || chat.isGroup) return false;
    // For direct chats, check if the other participant is online
    const otherParticipant = chat.participants.find(p => p.user.id !== user?.id);
    return otherParticipant ? onlineUsers.has(otherParticipant.user.id) : false;
  }, [chat, user?.id, onlineUsers]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return <EmptyChat />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar toggle */}
      {!sidebarOpen && (
        <div className="md:hidden fixed top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background border-r">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold">Chats</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-4">
              <p className="text-muted-foreground text-center">
                Chat list would go here on mobile
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <ChatHeader
          chat={chat}
          isOnline={getChatOnlineStatus()}
          lastSeen="2 hours ago" // TODO: Implement last seen with actual timestamps
        />

        {/* Chat Body */}
        <ChatBody
          messages={messages}
          currentUserId={user.id}
          isLoading={messagesLoading}
          hasMore={false} // TODO: Implement pagination
          onLoadMore={() => {}} // TODO: Implement load more
          typingUsers={getTypingUserNames(typingUsers[chatId] || [])}
          onMessageRead={handleMessageRead}
        />

        {/* Chat Footer */}
        <ChatFooter
          onSendMessage={handleSendMessage}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          onTypingStart={handleTypingStart}
          onTypingStop={handleTypingStop}
        />
      </div>
    </div>
  );
}