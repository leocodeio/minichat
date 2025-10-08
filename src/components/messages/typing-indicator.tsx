"use client";

interface TypingIndicatorProps {
  users: string[];
  className?: string;
}

export function TypingIndicator({ users, className }: TypingIndicatorProps) {
  // Filter out any invalid/empty names
  const validUsers = users.filter(user => user && user.trim());

  if (validUsers.length === 0) return null;

  if (validUsers.length === 0) return null;

  const getTypingText = () => {
    if (validUsers.length === 1) {
      return `${validUsers[0]} is typing...`;
    } else if (validUsers.length === 2) {
      return `${validUsers[0]} and ${validUsers[1]} are typing...`;
    } else {
      return `${validUsers[0]} and ${validUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-muted-foreground ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
}