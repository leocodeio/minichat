"use client";


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
  onTypingStart?: () => void;
  onTypingStop?: () => void;
  className?: string;
}

export function ChatFooter({
  onSendMessage,
  disabled = false,
  replyTo,
  onCancelReply,
  onTypingStart,
  onTypingStop,
  className
}: ChatFooterProps) {

  const handleSendMessage = (content: string) => {
    onSendMessage(content, replyTo?.id);
    if (onCancelReply) {
      onCancelReply();
    }
  };

  const handleEmojiSelect = (_emoji: string) => {
    // Emoji selection is handled by MessageInput component
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
              onTypingStart={onTypingStart}
              onTypingStop={onTypingStop}
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