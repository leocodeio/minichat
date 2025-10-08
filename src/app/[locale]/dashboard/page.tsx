"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useBetterAuthSignout, getSession } from "@/server/services/auth/auth-client";
import { LogOut, Menu } from "lucide-react";
import { toast } from "sonner";
import { ChatList } from "@/components/chats/chat-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatBody } from "@/components/chat/chat-body";
import { ChatFooter } from "@/components/chat/chat-footer";
import { EmptyChat } from "@/components/chat/empty-chat";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

interface ChatParticipant {
  user: {
    id: string;
    name: string;
    image?: string;
    uniqueCode?: string;
  };
}

interface LastMessage {
  content: string;
  sender: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
}

interface Chat {
  id: string;
  isGroup: boolean;
  name?: string;
  description?: string;
  lastMessageAt?: string;
  participants: ChatParticipant[];
  messages: LastMessage[];
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

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const signout = useBetterAuthSignout();

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
        toast.error("Failed to load session");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  const handleChatSelect = async (chatId: string) => {
    setSelectedChatId(chatId);
    setMessagesLoading(true);

    try {
      // Fetch chat details
      const chatResponse = await fetch(`/api/chats/${chatId}`);
      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        setSelectedChat(chatData.chat);
      }

      // Fetch messages
      const messagesResponse = await fetch(`/api/chats/${chatId}/messages`);
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setChatMessages(messagesData.messages || []);
      }
    } catch (error) {
      console.error("Failed to load chat:", error);
      toast.error("Failed to load chat");
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async (content: string, replyToId?: string) => {
    if (!selectedChatId || !user) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatId: selectedChatId,
          content,
          replyToId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the new message to the list
        setChatMessages(prev => [...prev, data.message]);
        setReplyTo(null);
      } else {
        toast.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r`}>
        <div className="w-80 h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold">MiniChat</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="md:hidden">
                <Menu className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={signout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat List */}
          <ChatList
            selectedChatId={selectedChatId}
            onChatSelect={handleChatSelect}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!sidebarOpen && (
          <div className="p-4 border-b md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4 mr-2" />
              Open Sidebar
            </Button>
          </div>
        )}

        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              chat={selectedChat}
              isOnline={false} // TODO: Implement online status
              lastSeen="2 hours ago" // TODO: Implement last seen
            />

            {/* Chat Body */}
            <ChatBody
              messages={chatMessages}
              currentUserId={user.id}
              isLoading={messagesLoading}
              hasMore={false} // TODO: Implement pagination
              onLoadMore={() => {}} // TODO: Implement load more
              typingUsers={[]} // TODO: Implement typing indicators
            />

            {/* Chat Footer */}
            <ChatFooter
              onSendMessage={handleSendMessage}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
            />
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}