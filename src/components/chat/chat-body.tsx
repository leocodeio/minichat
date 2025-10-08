"use client";

import { MessageList } from "@/components/messages/message-list";

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

interface ChatBodyProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  typingUsers?: string[];
  className?: string;
}

export function ChatBody({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  typingUsers = [],
  className
}: ChatBodyProps) {
  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        typingUsers={typingUsers}
      />
    </div>
  );
}