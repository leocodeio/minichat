"use client";

import { MessageCircle } from "lucide-react";

interface EmptyChatProps {
  className?: string;
}

export function EmptyChat({ className }: EmptyChatProps) {
  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-lg font-semibold mb-2">Welcome to MiniChat</h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        Select a conversation from the sidebar to start messaging, or create a new chat with your contacts.
      </p>

      <div className="text-sm text-muted-foreground">
        <p>💬 Connect with friends and family</p>
        <p>🔒 Secure and private messaging</p>
        <p>⚡ Real-time conversations</p>
      </div>
    </div>
  );
}