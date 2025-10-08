"use client";

import { useState, useEffect } from "react";
import { ChatListHeader } from "./chat-list-header";
import { ChatListItem } from "./chat-list-item";
import { Loader2 } from "lucide-react";

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

interface ChatListProps {
  selectedChatId?: string;
  onChatSelect?: (chatId: string) => void;
  onChatCreated?: (chatId: string) => void;
  className?: string;
}

export function ChatList({ selectedChatId, onChatSelect, onChatCreated, className }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredChats(
        chats.filter((chat) => {
          // Search in chat name
          if (chat.name && chat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return true;
          }

          // Search in participant names
          return chat.participants.some((participant) =>
            participant.user.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        })
      );
    } else {
      setFilteredChats(chats);
    }
  }, [chats, searchQuery]);

  const fetchChats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setChats(data.chats || []);
      } else {
        console.error("Failed to fetch chats");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={`flex flex-col h-full border-r bg-background ${className}`}>
      <ChatListHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onChatCreated={onChatCreated}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <p className="text-muted-foreground mb-4">
              {chats.length === 0 ? "No chats yet" : "No chats match your search"}
            </p>
            {chats.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Start a conversation by clicking &quot;New Chat&quot;
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                unreadCount={0} // TODO: Implement unread count logic
                onClick={onChatSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}