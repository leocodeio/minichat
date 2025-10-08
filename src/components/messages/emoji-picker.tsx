"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  disabled?: boolean;
}

// Common emojis for chat
const EMOJIS = [
  "😀", "😂", "😊", "😍", "🥰", "😘", "😉", "😎", "🤔", "😮",
  "😢", "😭", "😤", "😅", "🙄", "😴", "🤤", "🤗", "🤔", "🤭",
  "👍", "👎", "👌", "✌️", "🤞", "👏", "🙌", "🤝", "🙏", "✍️",
  "❤️", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️",
  "🌟", "⭐", "✨", "🔥", "💯", "🎉", "🎊", "🎈", "🎁", "🎂"
];

export function EmojiPicker({ onEmojiSelect, disabled = false }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        disabled={disabled}
        onClick={() => setShowPicker(!showPicker)}
        className="h-8 w-8 p-0"
      >
        <Smile className="w-4 h-4" />
      </Button>

      {showPicker && (
        <div className="absolute bottom-10 right-0 bg-background border rounded-lg shadow-lg p-2 w-64 z-10">
          <div className="grid grid-cols-10 gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleEmojiClick(emoji)}
                className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}