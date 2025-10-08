"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Video, Search } from "lucide-react";
import { ChatActions } from "./chat-actions";

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
  participants: ChatParticipant[];
}

interface ChatHeaderProps {
  chat: Chat;
  isOnline?: boolean;
  lastSeen?: string;
  onSearch?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
}

export function ChatHeader({ chat, isOnline, lastSeen, onSearch, onCall, onVideoCall }: ChatHeaderProps) {
  const getChatName = () => {
    if (chat.isGroup && chat.name) {
      return chat.name;
    }
    // For direct chats, show the other participant's name
    const otherParticipant = chat.participants.find(p => p.user.id !== "current-user-id"); // TODO: Get current user ID
    return otherParticipant?.user.name || "Unknown";
  };

  const getChatAvatar = () => {
    if (chat.isGroup) {
      // For groups, show first letter of group name or generic icon
      return chat.name?.charAt(0)?.toUpperCase() || "G";
    }
    // For direct chats, show the other participant's avatar
    const otherParticipant = chat.participants.find(p => p.user.id !== "current-user-id"); // TODO: Get current user ID
    return otherParticipant?.user.image;
  };

  const getStatusText = () => {
    if (chat.isGroup) {
      return `${chat.participants.length} members`;
    }
    if (isOnline) {
      return "Online";
    }
    if (lastSeen) {
      return `Last seen ${lastSeen}`;
    }
    return "Offline";
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={getChatAvatar()} alt={getChatName()} />
          <AvatarFallback>
            {getChatName().charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate text-sm">
            {getChatName()}
          </h2>
          <p className="text-xs text-muted-foreground">
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {onSearch && (
          <Button size="sm" variant="ghost" onClick={onSearch}>
            <Search className="w-4 h-4" />
          </Button>
        )}

        {!chat.isGroup && onCall && (
          <Button size="sm" variant="ghost" onClick={onCall}>
            <Phone className="w-4 h-4" />
          </Button>
        )}

        {!chat.isGroup && onVideoCall && (
          <Button size="sm" variant="ghost" onClick={onVideoCall}>
            <Video className="w-4 h-4" />
          </Button>
        )}

        <ChatActions chat={chat} />
      </div>
    </div>
  );
}