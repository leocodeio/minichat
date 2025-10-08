"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { MessageStatus } from "./message-status";
import { MessageTimestamp } from "./message-timestamp";

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

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;

}

export function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true
}: MessageBubbleProps) {
  return (
    <div className={cn("flex gap-3 mb-4", isOwn && "flex-row-reverse")}>
      {showAvatar && !isOwn && (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarImage src={message.sender.image} alt={message.sender.name} />
          <AvatarFallback>
            {message.sender.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn("flex flex-col max-w-[70%]", isOwn && "items-end")}>
        {!isOwn && (
          <span className="text-xs text-muted-foreground mb-1 px-3">
            {message.sender.name}
          </span>
        )}

        <div
          className={cn(
            "relative px-4 py-2 rounded-2xl max-w-full break-words",
            isOwn
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-muted rounded-bl-md"
          )}
        >
          {message.replyTo && (
            <div className="border-l-2 border-muted-foreground/30 pl-2 mb-2 opacity-70">
              <div className="text-xs font-medium">
                {message.replyTo.sender.name}
              </div>
              <div className="text-xs truncate max-w-48">
                {message.replyTo.content}
              </div>
            </div>
          )}

          <div className="text-sm whitespace-pre-wrap">
            {message.content}
          </div>

          <div className={cn(
            "flex items-center gap-1 mt-1",
            isOwn ? "justify-end" : "justify-start"
          )}>
            {showTimestamp && (
              <MessageTimestamp
                timestamp={message.createdAt}
                className="text-xs opacity-70"
              />
            )}
            {isOwn && <MessageStatus status={message.status} />}
          </div>
        </div>
      </div>
    </div>
  );
}