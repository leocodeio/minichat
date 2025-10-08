"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Loader2 } from "lucide-react";

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

interface GroupedMessage extends Message {
  showAvatar: boolean;
  showTimestamp: boolean;
  isNewDay: boolean;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  typingUsers?: string[];
  onMessageRead?: (messageId: string) => void;
  className?: string;
}

export function MessageList({
  messages,
  currentUserId,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  typingUsers = [],
  onMessageRead,
  className
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Intersection observer for marking messages as read
  useEffect(() => {
    if (!onMessageRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            if (messageId) {
              // Find the message to check if it's not from current user and not already read
              const message = messages.find(m => m.id === messageId);
              if (message && message.senderId !== currentUserId && message.status !== 'read') {
                onMessageRead(messageId);
              }
            }
          }
        });
      },
      {
        root: messagesContainerRef.current,
        threshold: 0.5, // Message is considered read when 50% visible
      }
    );

    // Observe all message elements
    messageRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [messages, currentUserId, onMessageRead]);

  // Group messages by date and sender for better UI
  const groupedMessages = messages.reduce((groups: GroupedMessage[], message, index) => {
    const prevMessage = messages[index - 1];
    const messageDate = new Date(message.createdAt).toDateString();
    const prevMessageDate = prevMessage ? new Date(prevMessage.createdAt).toDateString() : null;

    const isNewDay = messageDate !== prevMessageDate;
    const isSameSender = prevMessage && prevMessage.senderId === message.senderId;
    const timeDiff = prevMessage
      ? new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()
      : 0;
    const isWithinTimeWindow = timeDiff < 5 * 60 * 1000; // 5 minutes

    const showAvatar = !isSameSender || isNewDay;
    const showTimestamp = !isSameSender || !isWithinTimeWindow || isNewDay;

    groups.push({
      ...message,
      showAvatar,
      showTimestamp,
      isNewDay,
    });

    return groups;
  }, []);

  const handleScroll = () => {
    if (messagesContainerRef.current && hasMore && !isLoading) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0) {
        onLoadMore?.();
      }
    }
  };

  return (
    <div
      ref={messagesContainerRef}
      className={`flex-1 overflow-y-auto p-4 space-y-2 ${className}`}
      onScroll={handleScroll}
    >
      {isLoading && hasMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      )}

      {groupedMessages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
          <p className="text-lg mb-2">No messages yet</p>
          <p className="text-sm">Start the conversation!</p>
        </div>
      )}

      {groupedMessages.map((message: GroupedMessage) => (
        <div
          key={message.id}
          data-message-id={message.id}
          ref={(el) => {
            if (el) {
              messageRefs.current.set(message.id, el);
            } else {
              messageRefs.current.delete(message.id);
            }
          }}
        >
          {message.isNewDay && (
            <div className="flex justify-center my-4">
              <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}

          <MessageBubble
            message={message}
            isOwn={message.senderId === currentUserId}
            showAvatar={message.showAvatar}
            showTimestamp={message.showTimestamp}
          />
        </div>
      ))}

      {typingUsers.length > 0 && (
        <TypingIndicator users={typingUsers} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}