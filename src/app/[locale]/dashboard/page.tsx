"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { getSession } from "@/server/services/auth/auth-client";
import { useBetterAuthSignout } from "@/server/services/auth/auth-client";
import { ChatList } from "@/components/chats/chat-list";
import { Button } from "@/components/ui/button";
import { Menu, LogOut } from "lucide-react";
import { toast } from "sonner";
import { EmptyChat } from "@/components/chat/empty-chat";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleChatSelect = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
  };

  const handleChatCreated = (chatId: string) => {
    router.push(`/dashboard/chat/${chatId}`);
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
            onChatSelect={handleChatSelect}
            onChatCreated={handleChatCreated}
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

        <EmptyChat />
      </div>
    </div>
  );
}