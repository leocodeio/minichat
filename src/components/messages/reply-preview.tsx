"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReplyPreviewProps {
  message: {
    id: string;
    content: string;
    sender: {
      name: string;
    };
  };
  onCancel: () => void;
}

export function ReplyPreview({ message, onCancel }: ReplyPreviewProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 border-l-4 border-primary rounded-t-lg">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-primary">
          Replying to {message.sender.name}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {message.content}
        </div>
      </div>
      <Button
        size="sm"
        variant="ghost"
        onClick={onCancel}
        className="h-6 w-6 p-0 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}