"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface ChatListItemProps {
  chat: Chat;
  isSelected?: boolean;
  unreadCount?: number;
  onClick?: (chatId: string) => void;
}

export function ChatListItem({ chat, isSelected, unreadCount, onClick }: ChatListItemProps) {
  // Get chat display name
  const getChatName = () => {
    if (chat.isGroup && chat.name) {
      return chat.name;
    }
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants.find(p => p.user.id !== "current-user-id"); // TODO: Get current user ID
    return otherParticipant?.user.name || "Unknown";
  };

  // Get chat avatar
  const getChatAvatar = () => {
    if (chat.isGroup) {
      // For groups, show first letter of group name or generic icon
      return chat.name?.charAt(0)?.toUpperCase() || "G";
    }
    // For direct chats, show the other participant's avatar
    const otherParticipant = chat.participants.find(p => p.user.id !== "current-user-id"); // TODO: Get current user ID
    return otherParticipant?.user.image;
  };

  // Get last message preview
  const getLastMessagePreview = () => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages yet";
    }

    const lastMessage = chat.messages[0];
    const senderName = lastMessage.sender.name;
    const content = lastMessage.content;

    // For group chats, show sender name
    if (chat.isGroup) {
      return `${senderName}: ${content}`;
    }

    // For direct chats, just show content
    return content;
  };

  // Format timestamp
  const formatTimestamp = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 0 ? "now" : `${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "bg-accent border-primary"
      )}
      onClick={() => onClick?.(chat.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar>
              <AvatarImage src={getChatAvatar()} alt={getChatName()} />
              <AvatarFallback>
                {getChatName().charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {unreadCount && unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-medium truncate text-sm">
                {getChatName()}
              </h3>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTimestamp(chat.lastMessageAt)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate mt-1">
              {getLastMessagePreview()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}