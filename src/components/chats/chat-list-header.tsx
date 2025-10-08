"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ChatSearch } from "./chat-search";
import { NewChatDialog } from "./new-chat-dialog";

interface ChatListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onChatCreated?: (chatId: string) => void;
}

export function ChatListHeader({ searchQuery, onSearchChange, onChatCreated }: ChatListHeaderProps) {
  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chats</h2>
        <NewChatDialog onChatCreated={onChatCreated}>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </NewChatDialog>
      </div>

      <ChatSearch
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Search chats..."
      />
    </div>
  );
}