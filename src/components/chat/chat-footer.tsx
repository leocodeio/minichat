"use client";

import { useState } from "react";
import { MessageInput } from "@/components/messages/message-input";
import { ReplyPreview } from "@/components/messages/reply-preview";
import { EmojiPicker } from "@/components/messages/emoji-picker";

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
  };
}

interface ChatFooterProps {
  onSendMessage: (content: string, replyToId?: string) => void;
  disabled?: boolean;
  replyTo?: Message | null;
  onCancelReply?: () => void;
  className?: string;
}

export function ChatFooter({
  onSendMessage,
  disabled = false,
  replyTo,
  onCancelReply,
  className
}: ChatFooterProps) {
  const [message, setMessage] = useState("");

  const handleSendMessage = (content: string) => {
    onSendMessage(content, replyTo?.id);
    setMessage("");
    if (onCancelReply) {
      onCancelReply();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div className={`border-t bg-background ${className}`}>
      {replyTo && onCancelReply && (
        <ReplyPreview message={replyTo} onCancel={onCancelReply} />
      )}

      <div className="flex items-end gap-2 p-4">
        <div className="flex-1">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={disabled}
            placeholder="Type a message..."
          />
        </div>

        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          disabled={disabled}
        />
      </div>
    </div>
  );
}