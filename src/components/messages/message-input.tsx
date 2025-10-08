"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  className
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex items-end gap-2 p-4 border-t bg-background", className)}>
      <div className="flex-1 relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[40px] max-h-32 resize-none pr-12"
          rows={1}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="absolute right-2 bottom-2 h-6 w-6 p-0"
          disabled={disabled}
        >
          <Smile className="w-4 h-4" />
        </Button>
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={!message.trim() || disabled}
        className="h-10 w-10 p-0 flex-shrink-0"
      >
        <Send className="w-4 h-4" />
      </Button>
    </form>
  );
}